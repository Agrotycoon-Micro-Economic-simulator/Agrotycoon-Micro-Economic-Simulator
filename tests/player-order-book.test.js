const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const saved = new Map();
const context = vm.createContext({
  console,
  localStorage: {
    getItem: key => saved.has(key) ? saved.get(key) : null,
    setItem: (key, value) => saved.set(key, String(value))
  }
});
context.window = context;
for (const file of ['js/commodities.js', 'js/market_engine.js', 'js/state.js', 'js/player_order_book.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, { filename: file });
}
function freshState() {
  vm.runInContext("S = defaultState(); S.landSystem = { inventory: { jagung: 10 }, inventoryCost: { jagung: 50000 } };", context);
}

test('player buy orders reserve buying power without debiting cash or changing inventory', () => {
  freshState();
  const before = vm.runInContext('S.gold', context);
  const result = context.AgroPlayerOrderBook.submit({ commodityId: 'jagung', side: 'buy', quantity: 100, limitPrice: 6000 });
  assert.equal(result.ok, true);
  assert.equal(result.reservedCash, 600000);
  assert.equal(vm.runInContext('S.gold', context), before);
  assert.equal(vm.runInContext('S.landSystem.inventory.jagung', context), 10);
  const overcommitted = context.AgroPlayerOrderBook.submit({ commodityId: 'jagung', side: 'buy', quantity: 1000, limitPrice: 6000 });
  assert.equal(overcommitted.ok, false);
  assert.equal(overcommitted.reason, 'insufficient_unreserved_cash');
});

test('player sell orders reserve raw stock and prevent double-selling the same units', () => {
  freshState();
  const beforeCost = vm.runInContext('S.landSystem.inventoryCost.jagung', context);
  const result = context.AgroPlayerOrderBook.submit({ commodityId: 'jagung', side: 'sell', quantity: 7.5, limitPrice: 6000 });
  assert.equal(result.ok, true);
  assert.equal(result.reservedInventory.jagung, 7.5);
  const duplicate = context.AgroPlayerOrderBook.submit({ commodityId: 'jagung', side: 'sell', quantity: 3, limitPrice: 5900 });
  assert.equal(duplicate.ok, false);
  assert.equal(duplicate.reason, 'insufficient_unreserved_inventory');
  assert.equal(vm.runInContext('S.landSystem.inventory.jagung', context), 10);
  assert.equal(vm.runInContext('S.landSystem.inventoryCost.jagung', context), beforeCost);
});

test('cancelling an open order releases its reservation and is idempotently rejected afterwards', () => {
  freshState();
  const result = context.AgroPlayerOrderBook.submit({ commodityId: 'jagung', side: 'buy', quantity: 2, limitPrice: 6000 });
  const cancelled = context.AgroPlayerOrderBook.cancel(result.order.orderId);
  assert.equal(cancelled.ok, true);
  assert.equal(cancelled.releasedQuantity, 2);
  assert.equal(cancelled.reservedCash, 0);
  assert.equal(context.AgroPlayerOrderBook.cancel(result.order.orderId).ok, false);
});

test('order contract rejects invalid market scope, expiry, price and unknown commodities', () => {
  freshState();
  assert.equal(context.AgroPlayerOrderBook.submit({ commodityId: 'unknown', side: 'buy', quantity: 1, limitPrice: 10 }).reason, 'invalid_order_fields');
  assert.equal(context.AgroPlayerOrderBook.submit({ commodityId: 'jagung', side: 'buy', quantity: 1, limitPrice: 1 }).reason, 'limit_price_outside_market_bounds');
  assert.equal(context.AgroPlayerOrderBook.submit({ commodityId: 'jagung', side: 'buy', quantity: 1, limitPrice: 6000, stage: 'retail' }).reason, 'unsupported_market_scope_or_expiry');
  assert.equal(context.AgroPlayerOrderBook.submit({ commodityId: 'jagung', side: 'buy', quantity: 1, limitPrice: 6000, expiresInDays: 0 }).reason, 'unsupported_market_scope_or_expiry');
});

test('order book persists in the save payload and snapshots cannot mutate live state', () => {
  freshState();
  const result = context.AgroPlayerOrderBook.submit({ commodityId: 'jagung', side: 'sell', quantity: 1.25, limitPrice: 6000 });
  assert.equal(result.ok, true);
  const serialized = saved.get('agrotycoon_save_v15');
  assert.ok(serialized.includes('"marketOrderBook"'));
  const snapshot = context.AgroPlayerOrderBook.snapshot();
  snapshot.orders[0].remainingQuantity = 999;
  assert.equal(context.AgroPlayerOrderBook.snapshot().orders[0].remainingQuantity, 1.25);
});

test('player orders are scoped to the saved player region and have bounded expiry', () => {
  freshState();
  vm.runInContext("S.playerRegionId = 'lampung'; S.day = 12;", context);
  const result = context.AgroPlayerOrderBook.submit({ commodityId: 'jagung', side: 'buy', quantity: 1, limitPrice: 6000 });
  assert.equal(result.ok, true);
  assert.equal(result.order.regionId, 'lampung');
  assert.equal(result.order.createdAt, 12);
  assert.equal(result.order.expiresAt, 19);
});
