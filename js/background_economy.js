/* Background NPC demand/supply and political policy layer.
 * NPCs are data-only economic actors, not rendered entities. This local layer is a
 * simulation fallback; only a server-authoritative feed can represent all players.
 */
(function (root) {
  "use strict";
  const DEFAULT_POLICIES = Object.freeze({
    productionTax: 0.05,       // 0..0.50; raises producer cost and can reduce supply
    inputSubsidy: 0,           // 0..0.50; lowers effective input costs
    importTariff: 0.05,        // 0..1.00; discourages import supply
    interestRate: 0.08,        // 0..0.50; dampens investment/production
    logisticsEfficiency: 1,    // 0.50..1.50; higher means cheaper/easier distribution
    foodReserveDemand: 0.05    // 0..0.50; public stockpile demand for food
  });
  const CATEGORY_FLOW = Object.freeze({
    pangan: { demand: 1.12, supply: 1.00 },
    hortikultura: { demand: 1.04, supply: 0.98 },
    perkebunan: { demand: 1.00, supply: 1.00 },
    buah: { demand: 1.02, supply: 0.97 },
    rempah: { demand: 0.96, supply: 0.94 },
    peternakan: { demand: 1.08, supply: 0.96 },
    perikanan: { demand: 1.06, supply: 0.97 },
    industri: { demand: 0.98, supply: 1.02 }
  });
  const SECTOR_BY_CATEGORY = Object.freeze({
    pangan: "agriculture", hortikultura: "agriculture", perkebunan: "agriculture",
    buah: "agriculture", rempah: "agriculture", peternakan: "livestock",
    perikanan: "fishery", industri: "processing"
  });
  const clamp = (n, min, max) => Math.max(min, Math.min(max, Number.isFinite(Number(n)) ? Number(n) : min));
  function normalizePolicies(input) {
    const p = Object.assign({}, DEFAULT_POLICIES, input || {});
    p.productionTax = clamp(p.productionTax, 0, 0.5);
    p.inputSubsidy = clamp(p.inputSubsidy, 0, 0.5);
    p.importTariff = clamp(p.importTariff, 0, 1);
    p.interestRate = clamp(p.interestRate, 0, 0.5);
    p.logisticsEfficiency = clamp(p.logisticsEfficiency, 0.5, 1.5);
    p.foodReserveDemand = clamp(p.foodReserveDemand, 0, 0.5);
    return p;
  }
  function stableUnit(id) {
    let h = 2166136261;
    for (let i = 0; i < String(id).length; i++) { h ^= String(id).charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0) / 4294967295;
  }
  function buildNpcFlow(options) {
    const opts = options || {};
    const day = Math.max(1, Math.floor(Number(opts.day) || 1));
    const activePlayers = clamp(Math.floor(Number(opts.activePlayers) || 1), 1, 1000000);
    const policies = normalizePolicies(opts.policies);
    const catalog = opts.catalog || (root.MARKET_ENGINE && root.MARKET_ENGINE.catalog) || [];
    const capacityInput = opts.regionCapacity || {};
    const capacity = root.REGION_CAPACITY
      ? root.REGION_CAPACITY.allocate(capacityInput)
      : { activeConsumers: 4600000, sectorProducerCaps: { agriculture: 45000, livestock: 18000, fishery: 9000, processing: 12000 } };
    const defaultCaps = root.REGION_CAPACITY ? root.REGION_CAPACITY.defaults.sectorProducerCaps : capacity.sectorProducerCaps;
    const consumerScale = capacity.activeConsumers / 4600000;
    const flow = [];
    catalog.forEach(item => {
      if (!item || !item.id || !(Number(item.marketPrice) > 0)) return;
      const profile = CATEGORY_FLOW[item.category] || { demand: 1, supply: 1 };
      const phase = (day % 30) / 30;
      const seasonal = 1 + 0.08 * Math.sin((phase * Math.PI * 2) + stableUnit(item.id) * Math.PI * 2);
      const idNoise = 0.9 + stableUnit(item.id + "|flow") * 0.2;
      const foodReserve = ["pangan", "hortikultura"].includes(item.category) ? policies.foodReserveDemand : 0;
      // Population drives aggregate consumption; the count is an explicit scenario,
      // not a claim about live Indonesian population data.
      const demand = 100 * profile.demand * seasonal * idNoise * (1 + foodReserve) * consumerScale;
      const taxSupplyFactor = Math.max(0.55, 1 - policies.productionTax * 0.65);
      const subsidySupplyFactor = 1 + policies.inputSubsidy * 0.35;
      const interestSupplyFactor = Math.max(0.7, 1 - policies.interestRate * 0.25);
      const tariffSupplyFactor = Math.max(0.65, 1 - policies.importTariff * 0.2);
      const logisticsSupplyFactor = 0.8 + policies.logisticsEfficiency * 0.2;
      // Producer counts are capped by the region model. Capacity changes therefore
      // change aggregate supply instead of allowing unlimited abstract producers.
      const sector = SECTOR_BY_CATEGORY[item.category] || "other";
      const configuredCap = Number(capacity.sectorProducerCaps[sector]) || 0;
      const referenceCap = Math.max(1, Number(defaultCaps[sector]) || configuredCap || 1);
      const capacityFactor = clamp(configuredCap / referenceCap, 0, 1.5);
      const supply = 100 * profile.supply * (2 - seasonal) * idNoise * capacityFactor * taxSupplyFactor *
        subsidySupplyFactor * interestSupplyFactor * tariffSupplyFactor * logisticsSupplyFactor;
      const scale = Math.sqrt(activePlayers);
      const price = Number(item.marketPrice);
      flow.push({
        commodityId: item.id, side: "buy", quantity: Math.max(0.01, demand * scale),
        price, actorType: "npc", source: "background_demand", gameDay: day
      });
      flow.push({
        commodityId: item.id, side: "sell", quantity: Math.max(0.01, supply * scale),
        price, actorType: "npc", source: "background_supply", gameDay: day
      });
    });
    return flow;
  }
  function tick(options) {
    const opts = options || {};
    if (!root.MARKET_ENGINE) throw new Error("MARKET_ENGINE must load before background economy");
    const npcTransactions = buildNpcFlow(Object.assign({}, opts, { catalog: root.MARKET_ENGINE.catalog }));
    const hasSharedFeed = Array.isArray(opts.sharedTransactions);
    // A caller-supplied array is not proof of server authority; only a verified adapter may set this flag.
    const sharedVerified = hasSharedFeed && opts.sharedFeedVerified === true;
    const playerTransactions = hasSharedFeed ? opts.sharedTransactions : (Array.isArray(opts.playerTransactions) ? opts.playerTransactions : []);
    const allTransactions = playerTransactions.concat(npcTransactions);
    const prices = root.MARKET_ENGINE.reprice(allTransactions, opts.marketOptions);
    return {
      gameDay: Math.max(1, Math.floor(Number(opts.day) || 1)),
      scope: sharedVerified ? "shared-player-feed-plus-npc" : (hasSharedFeed ? "unverified-feed-plus-npc" : "local-player-feed-plus-npc"),
      marketIsGloballyShared: sharedVerified,
      npcTransactionCount: npcTransactions.length,
      playerTransactionCount: playerTransactions.length,
      priceUpdates: prices,
      policies: normalizePolicies(opts.policies),
      regionalCapacity: root.REGION_CAPACITY ? root.REGION_CAPACITY.snapshot(opts.regionCapacity || {}) : null
    };
  }
  function politicalEligibility(company) {
    const c = company || {};
    const level = Math.max(0, Number(c.companyLevel) || 0);
    const annualRevenue = Math.max(0, Number(c.annualRevenue) || 0);
    const reputation = clamp(c.reputation, 0, 100);
    const national = level >= 10 && annualRevenue >= 1000000000 && reputation >= 60;
    return {
      canEnterNationalPolitics: national,
      canRunForPresident: national && level >= 15 && annualRevenue >= 10000000000 && reputation >= 75,
      requirements: { companyLevel: 10, annualRevenue: 1000000000, reputation: 60,
        presidentCompanyLevel: 15, presidentAnnualRevenue: 10000000000, presidentReputation: 75 }
    };
  }
  root.BACKGROUND_ECONOMY = {
    version: "0.2.0", defaultPolicies: DEFAULT_POLICIES, categoryFlow: CATEGORY_FLOW,
    sectorByCategory: SECTOR_BY_CATEGORY, normalizePolicies, buildNpcFlow, tick, politicalEligibility
  };
})(typeof window !== "undefined" ? window : globalThis);
