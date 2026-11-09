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

  function ensureBook() {
    if (typeof S === "undefined" || !S || typeof S !== "object") throw new Error("Game state is not initialized");
    if (!S.marketOrderBook || typeof S.marketOrderBook !== "object") {
      S.marketOrderBook = { version: 1, sequence: 0, orders: [], reservedCash: 0, reservedInventory: {}, pendingSettlement: [], lastMatch: null };
    }
    const book = S.marketOrderBook;
    if (!Array.isArray(book.orders)) book.orders = [];
    if (!Array.isArray(book.pendingSettlement)) book.pendingSettlement = [];
    if (!Array.isArray(book.npcOrders)) book.npcOrders = [];
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
    if (limitPrice < Number(item.marketFloor) || limitPrice > Number(item.marketCeiling)) {
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
    const order = {
      orderId: "player-" + day + "-" + book.sequence,
      commodityId, side, quantity, remainingQuantity: quantity, limitPrice,
      createdAt: day, expiresAt: day + ttl, actorType: "player", ownerId: "player",
      regionId, stage, sequence: book.sequence, status: "open"
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
          !finitePositive(price) || price < Number(item.marketFloor) || price > Number(item.marketCeiling) ||
          !String(order.ownerId || "").startsWith("npc-") || !String(order.regionId || "") ||
          order.stage !== "producer" || createdAt !== day || expiresAt !== day + 1) {
        return { ok: false, reason: "invalid_npc_order_contract", storedCount: book.npcOrders.length };
      }
      ids.add(id);
      accepted.push(JSON.parse(JSON.stringify(order)));
    }
    book.npcOrders = accepted;
    book.lastNpcGenerationDay = day;
    persist(book);
    return { ok: true, alreadyGenerated: false, day, storedCount: accepted.length };
  }

  function playerOrderBookSnapshot() {
    const book = ensureBook();
    return JSON.parse(JSON.stringify({
      version: book.version, orders: book.orders, reservedCash: book.reservedCash,
      reservedInventory: book.reservedInventory, pendingSettlement: book.pendingSettlement,
      lastMatch: book.lastMatch, npcOrders: book.npcOrders,
      lastNpcGenerationDay: book.lastNpcGenerationDay
    }));
  }

  root.AgroPlayerOrderBook = {
    version: "0.1.0", maxOpenOrders: MAX_OPEN_ORDERS, defaultTtlDays: DEFAULT_TTL_DAYS,
    submit: submitPlayerMarketOrder, cancel: cancelPlayerMarketOrder, expire: expirePlayerMarketOrders, replaceNpcOrders, snapshot: playerOrderBookSnapshot
  };
})(typeof window !== "undefined" ? window : globalThis);
