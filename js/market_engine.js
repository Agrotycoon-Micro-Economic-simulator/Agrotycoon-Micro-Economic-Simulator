/* Shared-market pricing core for the 60-commodity catalog.
 * The host must pass transactions from the shared server feed to reprice().
 * This module deliberately does not pretend browser-local transactions are global.
 */
(function (root) {
  "use strict";

  const catalog = typeof COMMODITIES !== "undefined" && Array.isArray(COMMODITIES) ? COMMODITIES : [];
  const byId = typeof COMMODITY_BY_ID !== "undefined" ? COMMODITY_BY_ID : Object.fromEntries(catalog.map((item) => [item.id, item]));
  const DEFAULT_ELASTICITY = 0.08;
  const MAX_STEP = 0.10;

  function finitePositive(value) {
    return typeof value === "number" && Number.isFinite(value) && value > 0;
  }

  function bounds(item) {
    const floor = Number(item && item.marketFloor);
    const ceiling = Number(item && item.marketCeiling);
    if (!finitePositive(floor) || !finitePositive(ceiling) || floor > ceiling) {
      throw new Error("Invalid market bounds for commodity: " + (item && item.id));
    }
    return { floor, ceiling };
  }

  function clampPrice(item, value) {
    const b = bounds(item);
    return Math.round(Math.min(b.ceiling, Math.max(b.floor, Number(value) || Number(item.marketPrice) || b.floor)));
  }

  function initialize() {
    const errors = [];
    if (catalog.length !== 60) errors.push("Expected 60 commodities; found " + catalog.length);
    const ids = new Set();
    catalog.forEach((item) => {
      if (!item || !item.id || ids.has(item.id)) errors.push("Missing or duplicate commodity id: " + (item && item.id));
      if (item && item.id) ids.add(item.id);
      try {
        const b = bounds(item);
        item.marketPrice = clampPrice(item, Number(item.marketPrice) || Number(item.basePrice) || b.floor);
      } catch (error) {
        errors.push(error.message);
      }
    });
    if (errors.length) throw new Error("Market catalog validation failed: " + errors.join("; "));
    return { commodityCount: catalog.length, valid: true };
  }

  // Transactions are aggregated across the supplied feed. side is the initiating
  // order-flow side: "buy" adds demand pressure, "sell" adds supply pressure.
  // Each record: {commodityId, side, quantity, price, timestamp?}
  function reprice(transactions, options) {
    const opts = options || {};
    const elasticity = finitePositive(opts.elasticity) ? Math.min(0.25, opts.elasticity) : DEFAULT_ELASTICITY;
    const maxStep = finitePositive(opts.maxStep) ? Math.min(0.25, opts.maxStep) : MAX_STEP;
    const grouped = Object.create(null);

    (Array.isArray(transactions) ? transactions : []).forEach((tx) => {
      if (!tx || !byId[tx.commodityId]) return;
      const side = String(tx.side || "").toLowerCase();
      const quantity = Number(tx.quantity);
      const price = Number(tx.price);
      if (!["buy", "sell"].includes(side) || !finitePositive(quantity) || !finitePositive(price)) return;
      const item = byId[tx.commodityId];
      const b = bounds(item);
      const safePrice = Math.min(b.ceiling, Math.max(b.floor, price));
      const bucket = grouped[item.id] || (grouped[item.id] = { buyQty: 0, sellQty: 0, turnover: 0, volume: 0 });
      if (side === "buy") bucket.buyQty += quantity;
      else bucket.sellQty += quantity;
      bucket.turnover += safePrice * quantity;
      bucket.volume += quantity;
    });

    const results = [];
    Object.keys(grouped).forEach((id) => {
      const item = byId[id];
      const g = grouped[id];
      const current = clampPrice(item, Number(item.marketPrice) || Number(item.basePrice));
      const totalFlow = g.buyQty + g.sellQty;
      if (totalFlow <= 0 || g.volume <= 0) return;
      const imbalance = (g.buyQty - g.sellQty) / totalFlow;
      const vwap = g.turnover / g.volume;
      const tradeSignal = current > 0 ? (vwap - current) / current : 0;
      const rawChange = (elasticity * imbalance) + (0.25 * tradeSignal);
      const boundedChange = Math.max(-maxStep, Math.min(maxStep, rawChange));
      const next = clampPrice(item, current * (1 + boundedChange));
      item.marketPrice = next;
      results.push({
        commodityId: id,
        previousPrice: current,
        price: next,
        floor: Number(item.marketFloor),
        ceiling: Number(item.marketCeiling),
        buyQuantity: g.buyQty,
        sellQuantity: g.sellQty,
        transactionVolume: g.volume,
        vwap: Math.round(vwap)
      });
    });
    return results;
  }

  function recordTransaction(transaction, sharedFeed) {
    if (!transaction || !byId[transaction.commodityId]) throw new Error("Unknown commodity transaction");
    const side = String(transaction.side || "").toLowerCase();
    if (!["buy", "sell"].includes(side)) throw new Error("Transaction side must be buy or sell");
    if (!finitePositive(Number(transaction.quantity)) || !finitePositive(Number(transaction.price))) {
      throw new Error("Transaction quantity and price must be positive");
    }
    // In production, sharedFeed must come from a server-authoritative, cross-player ledger.
    const feed = Array.isArray(sharedFeed) ? sharedFeed.concat([transaction]) : [transaction];
    return reprice(feed);
  }

  function getPrice(commodityId) {
    const item = byId[commodityId];
    if (!item) return null;
    return clampPrice(item, Number(item.marketPrice) || Number(item.basePrice));
  }

  const api = { initialize, reprice, recordTransaction, getPrice, catalog, byId };
  root.MARKET_ENGINE = api;
  initialize();
})(typeof window !== "undefined" ? window : globalThis);

if(typeof module!=="undefined"&&module.exports)module.exports=globalThis.MARKET_ENGINE;
