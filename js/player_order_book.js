/* Persistent player order submission and reservation layer.
 * Matching and settlement are deliberately separate: submitted orders reserve
 * buying power or raw inventory, but do not change cash, stock, HPP or the ledger.
 */
(function (root) {
  "use strict";

  const MAX_OPEN_ORDERS = 200;
  const DEFAULT_TTL_DAYS = 7;

  function finitePositive(value) {
    return typeof value === "number" && Number.isFinite(value) && value > 0;
  }

  function migrateLegacyQuantityContract(order) {
    if (!order || typeof order !== "object") return;
    const hasAnyQuantityContract = order.quantityUnit != null ||
      order.quantityCalibrationStatus != null || order.quantityScaleStatus != null;
    if (hasAnyQuantityContract) return;
    const item = root.MARKET_ENGINE && root.MARKET_ENGINE.byId
      ? root.MARKET_ENGINE.byId[String(order.commodityId || "")] : null;
    const reference = item && item.marketUnitReference || null;
    order.quantityBasis = order.quantityBasis || (
      order.actorType === "npc"
        ? (order.side === "buy" ? "legacy_npc_unmet_demand_index" : "legacy_npc_marketable_inventory_index")
        : "player_inventory_legacy_simulation_units"
    );
    order.quantityUnit = "unconverted_simulation_market_units";
    order.quantityCalibrationStatus = "legacy_index_to_physical_unit_conversion_pending";
    order.referencePhysicalUnit = reference && reference.unit || null;
    order.referenceProductForm = reference && reference.productForm || null;
    order.referenceUnitStatus = item && item.marketUnitStatus || "butuh_riset_lanjutan";
    order.quantityScaleStatus = "unconverted_legacy_simulation_index";
  }

  function ensureBook() {
    if (typeof S === "undefined" || !S || typeof S !== "object") throw new Error("Game state is not initialized");
    if (!S.marketOrderBook || typeof S.marketOrderBook !== "object") {
      S.marketOrderBook = { version: 1, sequence: 0, orders: [], reservedCash: 0, reservedInventory: {}, pendingSettlement: [], lastMatch: null };
    }
    const book = S.marketOrderBook;
    if (!Array.isArray(book.orders)) book.orders = [];
    if (!Array.isArray(book.pendingSettlement)) book.pendingSettlement = [];
    if (!Array.isArray(book.npcOrders)) book.npcOrders = [];
    book.orders.concat(book.npcOrders).forEach(migrateLegacyQuantityContract);
    if (!Number.isSafeInteger(book.lastNpcGenerationDay) || book.lastNpcGenerationDay < 0) book.lastNpcGenerationDay = 0;
    if (!book.reservedInventory || typeof book.reservedInventory !== "object") book.reservedInventory = {};
    if (!Number.isSafeInteger(book.sequence) || book.sequence < 0) book.sequence = 0;
    recomputeReservations(book);
    return book;
  }

  function recomputeReservations(book) {
    let cash = 0;
    const inventory = {};
    (book.orders || []).forEach(order => {
      if (!order || order.status !== "open") return;
      if (order.side === "buy") cash += Number(order.remainingQuantity) * Number(order.limitPrice);
      if (order.side === "sell") inventory[order.commodityId] = (inventory[order.commodityId] || 0) + Number(order.remainingQuantity);
    });
    book.reservedCash = Number.isFinite(cash) ? cash : 0;
    book.reservedInventory = inventory;
  }

  function persist(book) {
    recomputeReservations(book);
    if (typeof save === "function") save();
  }

  function submitPlayerMarketOrder(input) {
    const book = ensureBook();
    const source = input && typeof input === "object" ? input : {};
    const commodityId = String(source.commodityId || "");
    const side = String(source.side || "").toLowerCase();
    const quantity = Number(source.quantity);
    const limitPrice = Number(source.limitPrice);
    const item = root.MARKET_ENGINE && root.MARKET_ENGINE.byId && root.MARKET_ENGINE.byId[commodityId];
    const regionId = String(source.regionId || S.playerRegionId || "");
    const stage = String(source.stage || "producer");
    const day = Math.max(1, Math.floor(Number(S.day) || 1));
    const ttl = source.expiresInDays == null ? DEFAULT_TTL_DAYS : Number(source.expiresInDays);

    if (!item || !["buy", "sell"].includes(side) || !finitePositive(quantity) || !finitePositive(limitPrice)) {
      return { ok: false, reason: "invalid_order_fields" };
    }
    if (stage !== "producer" || !regionId || !Number.isSafeInteger(ttl) || ttl < 1 || ttl > 365) {
      return { ok: false, reason: "unsupported_market_scope_or_expiry" };
    }
    const emergency = root.AgroNationalEconomy && typeof root.AgroNationalEconomy.marketEmergencySnapshot === "function"
      ? root.AgroNationalEconomy.marketEmergencySnapshot() : null;
    const emergencyAllowed = root.MARKET_ENGINE && typeof root.MARKET_ENGINE.authorizedEmergency === "function"
      ? root.MARKET_ENGINE.authorizedEmergency(emergency, commodityId) : false;
    if (!emergencyAllowed && (limitPrice < Number(item.marketFloor) || limitPrice > Number(item.marketCeiling))) {
      return { ok: false, reason: "limit_price_outside_market_bounds" };
    }
    if (book.orders.filter(order => order && order.status === "open").length >= MAX_OPEN_ORDERS) {
      return { ok: false, reason: "open_order_limit_reached" };
    }

    if (side === "buy") {
      const requiredCash = quantity * limitPrice;
      if (!Number.isFinite(requiredCash) || requiredCash <= 0 ||
          !Number.isFinite(Number(S.gold)) || Number(S.gold) - book.reservedCash < requiredCash) {
        return { ok: false, reason: "insufficient_unreserved_cash" };
      }
    } else {
      const stock = Math.max(0, Number(S.landSystem && S.landSystem.inventory && S.landSystem.inventory[commodityId]) || 0);
      const alreadyReserved = Math.max(0, Number(book.reservedInventory[commodityId]) || 0);
      if (stock - alreadyReserved + 1e-9 < quantity) {
        return { ok: false, reason: "insufficient_unreserved_inventory" };
      }
    }

    book.sequence += 1;
    const unitReference = item.marketUnitReference || null;
    const order = {
      orderId: "player-" + day + "-" + book.sequence,
      commodityId, side, quantity, remainingQuantity: quantity, limitPrice,
      createdAt: day, expiresAt: day + ttl, actorType: "player", ownerId: "player",
      regionId, stage, sequence: book.sequence, status: "open",
      quantityBasis: "player_inventory_legacy_simulation_units",
      quantityUnit: "unconverted_simulation_market_units",
      quantityCalibrationStatus: "legacy_index_to_physical_unit_conversion_pending",
      referencePhysicalUnit: unitReference && unitReference.unit || null,
      referenceProductForm: unitReference && unitReference.productForm || null,
      referenceUnitStatus: item.marketUnitStatus || "butuh_riset_lanjutan",
      quantityScaleStatus: item.quantityScaleStatus || "unconverted_legacy_simulation_index"
    };
    book.orders.push(order);
    persist(book);
    return { ok: true, order: Object.assign({}, order), reservedCash: book.reservedCash,
      reservedInventory: Object.assign({}, book.reservedInventory) };
  }

  function cancelPlayerMarketOrder(orderId) {
    const book = ensureBook();
    const id = String(orderId || "");
    const order = book.orders.find(candidate => candidate && candidate.orderId === id && candidate.status === "open");
    if (!order) return { ok: false, reason: "open_order_not_found" };
    order.status = "cancelled";
    order.cancelledAt = Math.max(1, Math.floor(Number(S.day) || 1));
    const releasedQuantity = Number(order.remainingQuantity) || 0;
    order.remainingQuantity = 0;
    persist(book);
    return { ok: true, orderId: id, releasedQuantity, reservedCash: book.reservedCash,
      reservedInventory: Object.assign({}, book.reservedInventory) };
  }

  function expirePlayerMarketOrders(targetDay) {
    const book = ensureBook();
    const day = Number(targetDay);
    if (!Number.isSafeInteger(day) || day < 1) {
      return { ok: false, reason: "invalid_expiry_day", expiredCount: 0, expiredOrderIds: [] };
    }
    const expiredOrderIds = [];
    (book.orders || []).forEach(order => {
      if (!order || order.status !== "open") return;
      const expiresAt = Number(order.expiresAt);
      if (!Number.isSafeInteger(expiresAt) || expiresAt > day) return;
      order.status = "expired";
      order.expiredAt = day;
      order.remainingQuantity = 0;
      expiredOrderIds.push(order.orderId);
    });
    if (expiredOrderIds.length) persist(book);
    else recomputeReservations(book);
    return {
      ok: true,
      targetDay: day,
      expiredCount: expiredOrderIds.length,
      expiredOrderIds,
      reservedCash: book.reservedCash,
      reservedInventory: Object.assign({}, book.reservedInventory)
    };
  }

  function replaceNpcOrders(orders, targetDay) {
    const book = ensureBook();
    const day = Number(targetDay);
    if (!Number.isSafeInteger(day) || day < 1 || !Array.isArray(orders)) {
      return { ok: false, reason: "invalid_npc_order_batch", storedCount: book.npcOrders.length };
    }
    if (book.lastNpcGenerationDay === day) {
      return { ok: true, alreadyGenerated: true, day, storedCount: book.npcOrders.length };
    }
    const ids = new Set();
    const accepted = [];
    const emergency = root.AgroNationalEconomy && typeof root.AgroNationalEconomy.marketEmergencySnapshot === "function"
      ? root.AgroNationalEconomy.marketEmergencySnapshot() : null;
    for (const source of orders) {
      const order = source && typeof source === "object" ? source : {};
      const item = root.MARKET_ENGINE && root.MARKET_ENGINE.byId && root.MARKET_ENGINE.byId[String(order.commodityId || "")];
      const id = String(order.orderId || "");
      const quantity = Number(order.quantity);
      const price = Number(order.limitPrice);
      const createdAt = Number(order.createdAt);
      const expiresAt = Number(order.expiresAt);
      if (!id || ids.has(id) || !item || order.actorType !== "npc" ||
          !["buy", "sell"].includes(order.side) || !finitePositive(quantity) ||
          !finitePositive(price) || (!root.MARKET_ENGINE.authorizedEmergency(emergency, String(order.commodityId || "")) && (price < Number(item.marketFloor) || price > Number(item.marketCeiling))) ||
          !String(order.ownerId || "").startsWith("npc-") || !String(order.regionId || "") ||
          order.stage !== "producer" || createdAt !== day || expiresAt !== day + 1) {
        return { ok: false, reason: "invalid_npc_order_contract", storedCount: book.npcOrders.length };
      }
      ids.add(id);
      accepted.push(JSON.parse(JSON.stringify(order)));
    }
    book.npcOrders = accepted;
    book.lastNpcGenerationDay = day;
    // Do not persist the transient NPC batch here. Matching and settlement consume it
    // in-memory, then persist only the compact post-settlement state.
    return { ok: true, alreadyGenerated: false, day, storedCount: accepted.length };
  }

  function postLedger(category, description, amount, detail, accounting) {
    if (typeof ledger === "function") ledger(category, description, amount, detail, accounting);
    else {
      if (!Array.isArray(S.ledger)) S.ledger = [];
      S.ledger.push({ day: S.day, cat: category, desc: description, amt: amount, detail: detail || null, accounting });
    }
  }

  function matchAndSettle(targetDay) {
    const book = ensureBook();
    const day = Number(targetDay);
    if (!Number.isSafeInteger(day) || day < 1) return { ok: false, reason: "invalid_match_day", fills: [] };
    if (book.lastMatch && Number(book.lastMatch.day) === day) {
      return { ok: true, alreadyMatched: true, day, fills: book.lastMatch.fills || [],
        quantityMismatches: book.lastMatch.quantityMismatches || [] };
    }
    if (!root.MARKET_ENGINE || typeof root.MARKET_ENGINE.matchOrderBook !== "function") {
      return { ok: false, reason: "market_matcher_unavailable", fills: [] };
    }
    const playerOrders = (book.orders || []).filter(order => order && order.status === "open");
    const npcOrders = (book.npcOrders || []).filter(order => order && Number(order.expiresAt) > day);
    const emergency = root.AgroNationalEconomy && typeof root.AgroNationalEconomy.marketEmergencySnapshot === "function"
      ? root.AgroNationalEconomy.marketEmergencySnapshot() : null;
    const matched = root.MARKET_ENGINE.matchOrderBook(playerOrders.concat(npcOrders), { now: day, emergency });
    const playerBuyFills = matched.fills.filter(fill => fill.buyerId === "player");
    const playerSellFills = matched.fills.filter(fill => fill.sellerId === "player");
    const buyNotional = playerBuyFills.reduce((sum, fill) => sum + fill.notional, 0);
    const sellQuantity = playerSellFills.reduce((sum, fill) => sum + fill.quantity, 0);
    const sellByCommodity = {};
    playerSellFills.forEach(fill => { sellByCommodity[fill.commodityId] = (sellByCommodity[fill.commodityId] || 0) + fill.quantity; });
    const buyByCommodity = {};
    playerBuyFills.forEach(fill => { buyByCommodity[fill.commodityId] = (buyByCommodity[fill.commodityId] || 0) + fill.quantity; });
    if (Object.keys(sellByCommodity).some(id => buyByCommodity[id] > 0)) {
      return { ok: false, reason: "same_day_player_buy_and_sell_not_supported", fills: [], matched };
    }
    if (buyNotional > Math.max(0, Number(S.gold) || 0) + 1e-7) {
      return { ok: false, reason: "insufficient_cash_at_settlement", fills: [], matched };
    }
    if (sellQuantity > 0) {
      if (!S.landSystem || !S.landSystem.inventory || !S.landSystem.inventoryCost) {
        return { ok: false, reason: "player_inventory_unavailable", fills: [], matched };
      }
      const lotBook = root.AgroCommodityStorage && typeof root.AgroCommodityStorage.ensureLotBook === "function"
        ? root.AgroCommodityStorage.ensureLotBook(S) : null;
      for (const id of Object.keys(sellByCommodity)) {
        const quantity = Math.max(0, Number(S.landSystem.inventory[id]) || 0);
        const cost = Math.max(0, Number(S.landSystem.inventoryCost[id]) || 0);
        if (quantity + 1e-9 < sellByCommodity[id]) return { ok: false, reason: "insufficient_inventory_at_settlement:" + id, fills: [], matched };
        if (cost <= 0) return { ok: false, reason: "missing_inventory_cost_at_settlement:" + id, fills: [], matched };
        if (lotBook && lotBook.ok) {
          const lotQuantity = lotBook.lots.filter(lot => lot.commodityId === id).reduce((sum, lot) => sum + Math.max(0, Number(lot.quantity) || 0), 0);
          if (lotQuantity + 1e-6 < sellByCommodity[id]) return { ok: false, reason: "inventory_lot_shortfall_at_settlement:" + id, fills: [], matched };
        }
      }
    }
    const hasBuy = playerBuyFills.length > 0;
    const hasSell = playerSellFills.length > 0;

    const settled = [];
    playerSellFills.forEach(fill => {
      const id = fill.commodityId, qty = fill.quantity, stock = Number(S.landSystem.inventory[id]) || 0;
      const costPool = Math.max(0, Number(S.landSystem.inventoryCost[id]) || 0);
      let consumedCost = costPool * qty / stock;
      if (root.AgroCommodityStorage && typeof root.AgroCommodityStorage.ensureLotBook === "function") {
        const stateLots = root.AgroCommodityStorage.ensureLotBook(S);
        if (stateLots.ok) {
          let remaining = qty; consumedCost = 0;
          stateLots.lots.filter(lot => lot.commodityId === id).sort((a, b) => Number(a.receivedDay) - Number(b.receivedDay)).forEach(lot => {
            if (remaining <= 1e-9) return;
            const take = Math.min(remaining, Math.max(0, Number(lot.quantity) || 0));
            consumedCost += take * Math.max(0, Number(lot.unitCost) || 0);
            remaining -= take;
          });
          if (remaining > 1e-6) return;
          const consumed = root.AgroCommodityStorage.consumeLots(S, id, qty);
          if (!consumed.ok) return;
        }
      }
      consumedCost = Math.min(costPool, Math.max(0, consumedCost));
      S.landSystem.inventory[id] = Math.max(0, stock - qty);
      S.landSystem.inventoryCost[id] = Math.max(0, costPool - consumedCost);
      S.gold = (Number(S.gold) || 0) + fill.notional;
      if (S.dayLog) {
        S.dayLog.gross = (Number(S.dayLog.gross) || 0) + fill.notional;
        S.dayLog.cashIn = (Number(S.dayLog.cashIn) || 0) + fill.notional;
      }
      postLedger("PENJUALAN", "Penjualan pasar order-book " + id, fill.notional,
        { fillId: fill.fillId, quantity: qty, price: fill.price, commodityId: id, channel: "regional_order_book" },
        { classification: "business_revenue", debitAccount: "Kas", creditAccount: "Penjualan", debit: fill.notional, credit: fill.notional, basis: "cash",
          lines: [{ account: "Kas", debit: fill.notional, credit: 0 }, { account: "Penjualan", debit: 0, credit: fill.notional }] });
      if (consumedCost > 0) {
        const components = [{ account: "Persediaan Bahan Baku Pertanian", amount: consumedCost }];
        if (typeof recordBusinessCogs === "function") recordBusinessCogs("HPP penjualan order-book " + id, components);
        else {
          if (S.dayLog) {
            S.dayLog.cogs = (Number(S.dayLog.cogs) || 0) + consumedCost;
            S.dayLog.expense = (Number(S.dayLog.expense) || 0) + consumedCost;
          }
          postLedger("HPP", "HPP penjualan order-book " + id, -consumedCost, { components },
          { classification: "business_cogs", debitAccount: "HPP Penjualan", creditAccount: components[0].account, debit: consumedCost, credit: consumedCost, basis: "noncash",
            lines: [{ account: "HPP Penjualan", debit: consumedCost, credit: 0 }, { account: components[0].account, debit: 0, credit: consumedCost }] });
        }
      }
      settled.push(fill.fillId);
    });
    playerBuyFills.forEach(fill => {
      const id = fill.commodityId, qty = fill.quantity, value = fill.notional;
      if (!S.landSystem) S.landSystem = { inventory: {}, inventoryCost: {} };
      if (!S.landSystem.inventory) S.landSystem.inventory = {};
      if (!S.landSystem.inventoryCost) S.landSystem.inventoryCost = {};
      if (root.AgroCommodityStorage && typeof root.AgroCommodityStorage.ensureLotBook === "function") root.AgroCommodityStorage.ensureLotBook(S);
      S.gold = (Number(S.gold) || 0) - value;
      S.landSystem.inventory[id] = (Number(S.landSystem.inventory[id]) || 0) + qty;
      S.landSystem.inventoryCost[id] = (Number(S.landSystem.inventoryCost[id]) || 0) + value;
      if (root.AgroCommodityStorage && typeof root.AgroCommodityStorage.receiveLot === "function") {
        root.AgroCommodityStorage.receiveLot(S, { commodityId: id, quantity: qty, unitCost: value / qty, day, id: "market-fill-" + fill.fillId });
      }
      if (S.dayLog) {
        S.dayLog.businessPurchases = (Number(S.dayLog.businessPurchases) || 0) + value;
        S.dayLog.cashOut = (Number(S.dayLog.cashOut) || 0) + value;
      }
      postLedger("BELANJA", "Pembelian bahan baku order-book " + id, -value,
        { fillId: fill.fillId, quantity: qty, price: fill.price, commodityId: id, channel: "regional_order_book" },
        { classification: "business_purchase", debitAccount: "Persediaan Bahan Baku", creditAccount: "Kas", debit: value, credit: value, basis: "cash",
          lines: [{ account: "Persediaan Bahan Baku", debit: value, credit: 0 }, { account: "Kas", debit: 0, credit: value }] });
      settled.push(fill.fillId);
    });

    const remainingById = new Map(matched.openOrders.map(order => [order.orderId, order.remainingQuantity]));
    const expiredIds = new Set(matched.expired.map(item => item.orderId));
    const preventedIds = new Set(matched.prevented.map(item => item.orderId));
    (book.orders || []).forEach(order => {
      if (!order || order.status !== "open") return;
      const remaining = remainingById.has(order.orderId) ? remainingById.get(order.orderId) : 0;
      order.remainingQuantity = remaining;
      if (expiredIds.has(order.orderId)) { order.status = "expired"; order.expiredAt = day; }
      else if (preventedIds.has(order.orderId)) { order.status = "cancelled"; order.cancelledAt = day; }
      else if (remaining <= 1e-9) order.status = "filled";
      order.lastMatchedDay = day;
    });
    (book.orders || []).forEach(order => {
      if (order && order.status === "open" && preventedIds.has(order.orderId)) {
        order.status = "cancelled"; order.remainingQuantity = 0; order.cancelledAt = day;
      }
    });
    // NPC regional orders are a one-day execution layer, not persistent player state.
    // Persisting the full province × commodity batch can exceed browser localStorage quotas
    // (hundreds/thousands of transient orders). Keep only aggregate/player-relevant state.
    book.npcOrders = [];
    if (matched.priceTransactions.length) root.MARKET_ENGINE.reprice(matched.priceTransactions, { emergency });
    const executionRecords = matched.fills.map(fill => Object.assign({}, fill, { settlement: settled.includes(fill.fillId) ? "player_settled" : "npc_aggregate_execution" }));
    book.trades = (Array.isArray(book.trades) ? book.trades : []).concat(executionRecords.filter(fill => fill.buyerId === "player" || fill.sellerId === "player")).slice(-1000);
    const playerExecutionRecords = executionRecords.filter(fill => fill.buyerId === "player" || fill.sellerId === "player");
    const quantityMismatches = (matched.quantityMismatches || []).slice(-100);
    book.lastMatch = { day, fills: playerExecutionRecords, openOrderCount: matched.openOrders.filter(order => order.actorType !== "npc").length,
      expired: (matched.expired || []).slice(-100), rejected: (matched.rejected || []).slice(-100), prevented: (matched.prevented || []).slice(-100),
      quantityMismatches, quantityMismatchCount: (matched.quantityMismatches || []).length,
      executedQuantity: matched.executedQuantity, executedNotional: matched.executedNotional,
      npcExecutionCount: executionRecords.length - playerExecutionRecords.length };
    persist(book);
    return { ok: true, alreadyMatched: false, day, fills: executionRecords,
      openOrderCount: matched.openOrders.length, executedQuantity: matched.executedQuantity,
      executedNotional: matched.executedNotional, settledPlayerFillCount: settled.length,
      quantityMismatches: matched.quantityMismatches || [],
      priceUpdates: matched.priceTransactions.length };
  }

  function playerOrderBookSnapshot() {
    const book = ensureBook();
    return JSON.parse(JSON.stringify({
      version: book.version, orders: book.orders, reservedCash: book.reservedCash,
      reservedInventory: book.reservedInventory, pendingSettlement: book.pendingSettlement,
      lastMatch: book.lastMatch, npcOrders: book.npcOrders, trades: book.trades || [],
      lastNpcGenerationDay: book.lastNpcGenerationDay
    }));
  }

  root.AgroPlayerOrderBook = {
    version: "0.1.0", maxOpenOrders: MAX_OPEN_ORDERS, defaultTtlDays: DEFAULT_TTL_DAYS,
    submit: submitPlayerMarketOrder, cancel: cancelPlayerMarketOrder, expire: expirePlayerMarketOrders, replaceNpcOrders, matchAndSettle, snapshot: playerOrderBookSnapshot
  };
})(typeof window !== "undefined" ? window : globalThis);
