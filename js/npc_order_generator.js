/* Regional NPC order proposals derived from the national economy's executed daily state.
 * Orders are aggregate NPC pools, not individual agent inventories. Production quantities
 * remain experimental scenario values until region/commodity capacity data is calibrated.
 */
(function (root) {
  "use strict";

  function positive(value) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }

  const DEFAULT_NPC_SPREAD_BPS = 100;

  function boundedQuote(item, value) {
    const floor = positive(item && item.marketFloor);
    const ceiling = positive(item && item.marketCeiling);
    if (floor <= 0 || ceiling < floor || !Number.isFinite(Number(value))) return 0;
    return Math.round(Math.min(ceiling, Math.max(floor, Number(value))));
  }

  function buildDailyOrders(input) {
    const x = input && typeof input === "object" ? input : {};
    const day = Number(x.day);
    if (!Number.isSafeInteger(day) || day < 1) {
      return { ok: false, reason: "invalid_game_day", day: null, orders: [], summary: { buyCount: 0, sellCount: 0 } };
    }

    const provinces = Array.isArray(x.provinces) ? x.provinces : [];
    const catalog = Array.isArray(x.catalog) ? x.catalog : [];
    const getPrice = typeof x.getPrice === "function" ? x.getPrice : () => null;
    const spreadBps = Number.isFinite(Number(x.npcSpreadBps)) && Number(x.npcSpreadBps) >= 0
      ? Math.min(1000, Number(x.npcSpreadBps)) : DEFAULT_NPC_SPREAD_BPS;
    const halfSpread = spreadBps / 10000;
    const orders = [];
    let sequence = 0;
    const seenRegions = new Set();

    provinces.slice().sort((a, b) => String(a && a.id).localeCompare(String(b && b.id))).forEach(province => {
      if (!province || !province.id || seenRegions.has(String(province.id))) return;
      const regionId = String(province.id);
      seenRegions.add(regionId);

      catalog.forEach(item => {
        if (!item || !item.id) return;
        const id = String(item.id);
        const marketableStock = positive(province.inventory && province.inventory[id]);
        const unmetDemand = positive(province.unmetDemand && province.unmetDemand[id]);
        if (marketableStock <= 0 && unmetDemand <= 0) return;

        const nationalPrice = positive(getPrice(id));
        if (nationalPrice <= 0) return;

        const index = positive(province.prices && province.prices[id]) || 1;
        const localPrice = boundedQuote(item, nationalPrice * index);
        if (localPrice <= 0) return;

        const askPrice = boundedQuote(item, localPrice * (1 + halfSpread));
        const bidPrice = boundedQuote(item, localPrice * (1 - halfSpread));
        const common = {
          commodityId: id,
          createdAt: day,
          expiresAt: day + 1,
          actorType: "npc",
          regionId,
          stage: "producer",
          calibrationStatus: "experimental_regional_simulation_aggregate",
          spreadStatus: "experimental_unresearched_transaction_cost_proxy",
          spreadBps,
          midPrice: localPrice,
          pricingBasis: "bounded_local_quote_experimental_npc_half_spread",
          sourceRegion: "AgroNationalEconomy.provinceSnapshot",
          sourceDay: day
        };

        if (marketableStock > 0) {
          sequence += 1;
          orders.push(Object.assign({}, common, {
            orderId: "npc-supply-" + day + "-" + regionId + "-" + id,
            side: "sell",
            quantity: marketableStock,
            limitPrice: askPrice,
            ownerId: "npc-producer-pool-" + regionId,
            sequence,
            quantityBasis: "regional_marketable_inventory_after_daily_demand"
          }));
        }

        if (unmetDemand > 0) {
          sequence += 1;
          orders.push(Object.assign({}, common, {
            orderId: "npc-demand-" + day + "-" + regionId + "-" + id,
            side: "buy",
            quantity: unmetDemand,
            limitPrice: bidPrice,
            ownerId: "npc-buyer-pool-" + regionId,
            sequence,
            quantityBasis: "regional_unmet_demand_after_inventory"
          }));
        }
      });
    });

    return {
      ok: true,
      day,
      orders,
      summary: {
        npcSpreadBps: spreadBps,
        buyCount: orders.filter(order => order.side === "buy").length,
        sellCount: orders.filter(order => order.side === "sell").length,
        totalBuyQuantity: orders.filter(order => order.side === "buy").reduce((sum, order) => sum + order.quantity, 0),
        totalSellQuantity: orders.filter(order => order.side === "sell").reduce((sum, order) => sum + order.quantity, 0),
        regionCount: seenRegions.size,
        calibrationStatus: "experimental_regional_simulation_aggregate"
      }
    };
  }

  root.AgroNpcOrderGenerator = { version: "0.2.0", buildDailyOrders };
})(typeof window !== "undefined" ? window : globalThis);

if (typeof module !== "undefined" && module.exports) module.exports = globalThis.AgroNpcOrderGenerator;
