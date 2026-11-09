/* Shared-market pricing core for the 60-commodity catalog.
 * The host must pass transactions from the shared server feed to reprice().
 * This module deliberately does not pretend browser-local transactions are global.
 */
(function (root) {
  "use strict";

  const catalog = typeof COMMODITIES !== "undefined" && Array.isArray(COMMODITIES) ? COMMODITIES : [];
  const byId = typeof COMMODITY_BY_ID !== "undefined" ? COMMODITY_BY_ID : Object.fromEntries(catalog.map((item) => [item.id, item]));
  const DEFAULT_ELASTICITY = 0.08;
  const MAX_STEP = 0.25;

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

  function authorizedEmergency(emergency, commodityId) {
    if (!emergency || emergency.active !== true || emergency.scope !== "national") return false;
    if (!["national_disaster", "war"].includes(String(emergency.type || ""))) return false;
    if (typeof emergency.eventId !== "string" || !emergency.eventId.trim()) return false;
    const authority = root.AgroNationalEconomy;
    if (!authority || typeof authority.marketEmergencySnapshot !== "function") return false;
    const current = authority.marketEmergencySnapshot();
    if (!current || current.active !== true || current.scope !== "national" ||
        current.eventId !== emergency.eventId || current.type !== emergency.type) return false;
    if (commodityId && Array.isArray(emergency.commodityIds) && emergency.commodityIds.length &&
        !emergency.commodityIds.includes(String(commodityId))) return false;
    if (commodityId && Array.isArray(current.commodityIds) && current.commodityIds.length &&
        !current.commodityIds.includes(String(commodityId))) return false;
    return true;
  }

  function clampPrice(item, value, emergency) {
    const b = bounds(item);
    const numeric = Number(value) || Number(item.marketPrice) || b.floor;
    if (authorizedEmergency(emergency)) return Math.round(Math.min(1e12, Math.max(0.01, numeric)));
    return Math.round(Math.min(b.ceiling, Math.max(b.floor, numeric)));
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
    const emergency = opts.emergency || null;
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
      const itemEmergency = authorizedEmergency(emergency, item.id) ? emergency : null;
      const safePrice = itemEmergency ? Math.min(1e12, Math.max(0.01, price)) : Math.min(b.ceiling, Math.max(b.floor, price));
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
      const itemEmergency = authorizedEmergency(emergency, id) ? emergency : null;
      const current = clampPrice(item, Number(item.marketPrice) || Number(item.basePrice), itemEmergency);
      const totalFlow = g.buyQty + g.sellQty;
      if (totalFlow <= 0 || g.volume <= 0) return;
      const imbalance = (g.buyQty - g.sellQty) / totalFlow;
      const vwap = g.turnover / g.volume;
      const tradeSignal = current > 0 ? (vwap - current) / current : 0;
      const itemElasticity = finitePositive(item.marketElasticity) ? Math.min(0.25, item.marketElasticity) : elasticity;
      const normalMaxStep = finitePositive(item.marketDailyMoveLimit) ? Math.min(maxStep, item.marketDailyMoveLimit) : maxStep;
      const itemMaxStep = itemEmergency ? Math.max(0.75, normalMaxStep) : normalMaxStep;
      const rawChange = (itemElasticity * imbalance) + (0.25 * tradeSignal);
      const boundedChange = Math.max(-itemMaxStep, Math.min(itemMaxStep, rawChange));
      const next = clampPrice(item, current * (1 + boundedChange), itemEmergency);
      item.marketPrice = next;
      results.push({
        commodityId: id,
        previousPrice: current,
        price: next,
        floor: Number(item.marketFloor),
        ceiling: Number(item.marketCeiling),
        emergencyOverride: !!itemEmergency,
        emergencyEventId: itemEmergency ? itemEmergency.eventId : null,
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

  // Local order-book matching primitive. This is a deterministic simulation engine,
  // not a cross-player exchange or a ledger writer. Only returned fills are executions.
  function matchOrderBook(orders, options) {
    const opts = options || {};
    const emergency = opts.emergency || null;
    const now = Number.isFinite(Number(opts.now)) ? Number(opts.now) : Date.now();
    const input = Array.isArray(orders) ? orders : [];
    const seen = new Set();
    const accepted = [];
    const rejected = [];
    const expired = [];
    input.forEach((source) => {
      const order = source && typeof source === "object" ? source : {};
      const id = String(order.orderId || "");
      const side = String(order.side || "").toLowerCase();
      const quantity = Number(order.quantity);
      const price = Number(order.limitPrice);
      const item = byId[order.commodityId];
      const createdAt = Number(order.createdAt);
      const expiresAt = order.expiresAt == null ? null : Number(order.expiresAt);
      const invalid = !id || seen.has(id) || !item || !["buy", "sell"].includes(side) ||
        !finitePositive(quantity) || !finitePositive(price) ||
        !Number.isFinite(createdAt) || (expiresAt !== null && (!Number.isFinite(expiresAt) || expiresAt <= createdAt)) ||
        !["player", "npc"].includes(String(order.actorType || "").toLowerCase()) ||
        !String(order.ownerId || "") || !String(order.regionId || "") || !String(order.stage || "");
      if (invalid) {
        rejected.push({ orderId: id || null, reason: "invalid_order_contract" });
        return;
      }
      seen.add(id);
      const b = bounds(item);
      if (!authorizedEmergency(emergency, item.id) && (price < b.floor || price > b.ceiling)) {
        rejected.push({ orderId: id, reason: "limit_price_outside_market_bounds" });
        return;
      }
      if (expiresAt !== null && expiresAt <= now) {
        expired.push({ orderId: id, remainingQuantity: quantity });
        return;
      }
      accepted.push({
        orderId: id, commodityId: item.id, side, quantity, remainingQuantity: quantity,
        limitPrice: price, createdAt, expiresAt, actorType: String(order.actorType).toLowerCase(),
        ownerId: String(order.ownerId), regionId: String(order.regionId), stage: String(order.stage),
        sequence: Number.isFinite(Number(order.sequence)) ? Number(order.sequence) : 0,
        quantityBasis: order.quantityBasis || null,
        quantityUnit: order.quantityUnit || "unverified_catalog_quantity_unit",
        quantityCalibrationStatus: order.quantityCalibrationStatus || "unit_calibration_unverified",
        referencePhysicalUnit: order.referencePhysicalUnit || null,
        referenceProductForm: order.referenceProductForm || null,
        referenceUnitStatus: order.referenceUnitStatus || "butuh_riset_lanjutan",
        quantityScaleStatus: order.quantityScaleStatus || "unconverted_legacy_simulation_index"
      });
    });

    const groups = new Map();
    accepted.forEach((order) => {
      const key = [order.commodityId, order.regionId, order.stage].join("|");
      if (!groups.has(key)) groups.set(key, { buys: [], sells: [] });
      groups.get(key)[order.side === "buy" ? "buys" : "sells"].push(order);
    });
    const fills = [];
    const prevented = [];
    const quantityMismatches = [];
    groups.forEach((group) => {
      const compatible = (a, b) =>
        a.quantityUnit === b.quantityUnit &&
        a.quantityCalibrationStatus === b.quantityCalibrationStatus &&
        a.quantityScaleStatus === b.quantityScaleStatus;
      group.buys.forEach((buy) => {
        group.sells.forEach((sell) => {
          if (buy.limitPrice >= sell.limitPrice && !compatible(buy, sell)) {
            quantityMismatches.push({
              buyOrderId: buy.orderId,
              sellOrderId: sell.orderId,
              commodityId: buy.commodityId,
              regionId: buy.regionId,
              stage: buy.stage,
              reason: "quantity_contract_mismatch",
              buyQuantityUnit: buy.quantityUnit,
              sellQuantityUnit: sell.quantityUnit,
              buyQuantityCalibrationStatus: buy.quantityCalibrationStatus,
              sellQuantityCalibrationStatus: sell.quantityCalibrationStatus,
              buyQuantityScaleStatus: buy.quantityScaleStatus,
              sellQuantityScaleStatus: sell.quantityScaleStatus
            });
          }
        });
      });
      const contractGroups = new Map();
      group.buys.concat(group.sells).forEach((order) => {
        const contractKey = JSON.stringify([
          order.quantityUnit, order.quantityCalibrationStatus, order.quantityScaleStatus
        ]);
        if (!contractGroups.has(contractKey)) contractGroups.set(contractKey, { buys: [], sells: [] });
        contractGroups.get(contractKey)[order.side === "buy" ? "buys" : "sells"].push(order);
      });
      contractGroups.forEach((compatibleGroup) => {
        const priority = (a, b) => a.createdAt - b.createdAt || a.sequence - b.sequence || a.orderId.localeCompare(b.orderId);
        compatibleGroup.buys.sort((a, b) => b.limitPrice - a.limitPrice || priority(a, b));
        compatibleGroup.sells.sort((a, b) => a.limitPrice - b.limitPrice || priority(a, b));
        let bi = 0;
        let si = 0;
        while (bi < compatibleGroup.buys.length && si < compatibleGroup.sells.length) {
          const buy = compatibleGroup.buys[bi];
          const sell = compatibleGroup.sells[si];
          if (buy.remainingQuantity <= 0) { bi++; continue; }
          if (sell.remainingQuantity <= 0) { si++; continue; }
          if (buy.limitPrice < sell.limitPrice) break;
          if (buy.ownerId === sell.ownerId) {
            const newer = priority(buy, sell) <= 0 ? sell : buy;
            newer.remainingQuantity = 0;
            prevented.push({ orderId: newer.orderId, reason: "self_trade_prevented" });
            continue;
          }
          const quantity = Math.min(buy.remainingQuantity, sell.remainingQuantity);
          const buyIsMaker = priority(buy, sell) <= 0;
          const executionPrice = buyIsMaker ? buy.limitPrice : sell.limitPrice;
          const aggressor = buyIsMaker ? sell : buy;
          fills.push({
            fillId: "fill-" + (fills.length + 1), commodityId: buy.commodityId,
            regionId: buy.regionId, stage: buy.stage, buyOrderId: buy.orderId,
            sellOrderId: sell.orderId, buyerId: buy.ownerId, sellerId: sell.ownerId,
            quantity, price: executionPrice, notional: quantity * executionPrice,
            makerOrderId: buyIsMaker ? buy.orderId : sell.orderId,
            aggressorSide: aggressor.side, aggressorActorType: aggressor.actorType,
            quantityBasis: buy.quantityBasis || sell.quantityBasis || null,
            quantityUnit: buy.quantityUnit,
            quantityCalibrationStatus: buy.quantityCalibrationStatus,
            buyQuantityUnit: buy.quantityUnit,
            sellQuantityUnit: sell.quantityUnit,
            buyQuantityCalibrationStatus: buy.quantityCalibrationStatus,
            sellQuantityCalibrationStatus: sell.quantityCalibrationStatus,
            buyReferencePhysicalUnit: buy.referencePhysicalUnit,
            sellReferencePhysicalUnit: sell.referencePhysicalUnit,
            buyReferenceProductForm: buy.referenceProductForm,
            sellReferenceProductForm: sell.referenceProductForm,
            buyReferenceUnitStatus: buy.referenceUnitStatus,
            sellReferenceUnitStatus: sell.referenceUnitStatus,
            buyQuantityScaleStatus: buy.quantityScaleStatus,
            sellQuantityScaleStatus: sell.quantityScaleStatus,
            executedAt: now
          });
          buy.remainingQuantity -= quantity;
          sell.remainingQuantity -= quantity;
        }
      });
    });
    const openOrders = accepted.filter((order) => order.remainingQuantity > 0).map((order) => ({
      orderId: order.orderId, commodityId: order.commodityId, side: order.side,
      remainingQuantity: order.remainingQuantity, limitPrice: order.limitPrice,
      createdAt: order.createdAt, expiresAt: order.expiresAt, actorType: order.actorType,
      ownerId: order.ownerId, regionId: order.regionId, stage: order.stage,
      quantityBasis: order.quantityBasis, quantityUnit: order.quantityUnit,
      quantityCalibrationStatus: order.quantityCalibrationStatus,
      referencePhysicalUnit: order.referencePhysicalUnit,
      referenceProductForm: order.referenceProductForm,
      referenceUnitStatus: order.referenceUnitStatus,
      quantityScaleStatus: order.quantityScaleStatus
    }));
    const priceTransactions = fills.map((fill) => ({
      commodityId: fill.commodityId, side: fill.aggressorSide, quantity: fill.quantity,
      price: fill.price, actorType: fill.aggressorActorType, source: "order_book_execution",
      regionId: fill.regionId, marketStage: fill.stage, fillId: fill.fillId
    }));
    return { fills, priceTransactions, openOrders, expired, rejected, prevented, quantityMismatches,
      executedQuantity: fills.reduce((sum, fill) => sum + fill.quantity, 0),
      executedNotional: fills.reduce((sum, fill) => sum + fill.notional, 0) };
  }

  function getPrice(commodityId, options) {
    const item = byId[commodityId];
    if (!item) return null;
    const emergency = authorizedEmergency(options && options.emergency, item.id) ? options.emergency : null;
    return clampPrice(item, Number(item.marketPrice) || Number(item.basePrice), emergency);
  }

  const api = { initialize, reprice, recordTransaction, matchOrderBook, getPrice, authorizedEmergency, catalog, byId };
  root.MARKET_ENGINE = api;
  initialize();
})(typeof window !== "undefined" ? window : globalThis);

if(typeof module!=="undefined"&&module.exports)module.exports=globalThis.MARKET_ENGINE;
