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
      const stock = Math.max(0, Number(S.landSystem && S.landSystem.inventory && root.S.landSystem.inventory[commodityId]) || 0);
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

  function playerOrderBookSnapshot() {
    const book = ensureBook();
    return JSON.parse(JSON.stringify({
      version: book.version, orders: book.orders, reservedCash: book.reservedCash,
      reservedInventory: book.reservedInventory, pendingSettlement: book.pendingSettlement,
      lastMatch: book.lastMatch
    }));
  }

  root.AgroPlayerOrderBook = {
    version: "0.1.0", maxOpenOrders: MAX_OPEN_ORDERS, defaultTtlDays: DEFAULT_TTL_DAYS,
    submit: submitPlayerMarketOrder, cancel: cancelPlayerMarketOrder, snapshot: playerOrderBookSnapshot
  };
})(typeof window !== "undefined" ? window : globalThis);
