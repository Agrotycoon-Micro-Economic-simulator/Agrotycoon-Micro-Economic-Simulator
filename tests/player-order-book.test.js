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
for (const file of ['js/commodities.js', 'js/market_engine.js', 'js/state.js', 'js/commodity_storage.js', 'js/player_order_book.js']) {
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


test('daily expiry releases remaining buy cash and sell inventory reservations exactly once', () => {
  freshState();
  vm.runInContext("S.day = 10; S.gold = 1000000;", context);
  const buy = context.AgroPlayerOrderBook.submit({ commodityId: 'jagung', side: 'buy', quantity: 10, limitPrice: 6000, expiresInDays: 2 });
  const sell = context.AgroPlayerOrderBook.submit({ commodityId: 'jagung', side: 'sell', quantity: 4, limitPrice: 6000, expiresInDays: 2 });
  assert.equal(buy.ok, true);
  assert.equal(sell.ok, true);
  assert.equal(context.AgroPlayerOrderBook.snapshot().reservedCash, 60000);
  assert.equal(context.AgroPlayerOrderBook.snapshot().reservedInventory.jagung, 4);

  const early = context.AgroPlayerOrderBook.expire(11);
  assert.equal(early.expiredCount, 0);
  assert.equal(context.AgroPlayerOrderBook.snapshot().reservedCash, 60000);

  const expired = context.AgroPlayerOrderBook.expire(12);
  assert.equal(expired.ok, true);
  assert.equal(expired.expiredCount, 2);
  assert.equal(context.AgroPlayerOrderBook.snapshot().reservedCash, 0);
  assert.equal(context.AgroPlayerOrderBook.snapshot().reservedInventory.jagung, undefined);
  assert.equal(context.AgroPlayerOrderBook.snapshot().orders.every(order => order.status === 'expired' && order.remainingQuantity === 0), true);

  const repeated = context.AgroPlayerOrderBook.expire(12);
  assert.equal(repeated.expiredCount, 0);
  assert.equal(context.AgroPlayerOrderBook.snapshot().orders.length, 2);
});

test('expiry rejects invalid game-day values without changing open orders', () => {
  freshState();
  const order = context.AgroPlayerOrderBook.submit({ commodityId: 'jagung', side: 'buy', quantity: 1, limitPrice: 6000 });
  assert.equal(order.ok, true);
  const result = context.AgroPlayerOrderBook.expire(1.5);
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'invalid_expiry_day');
  assert.equal(context.AgroPlayerOrderBook.snapshot().orders[0].status, 'open');
});


test('daily NPC order batches persist once, validate provenance and do not settle player assets', () => {
  freshState();
  vm.runInContext("S.day = 9; S.gold = 500000; S.landSystem.inventory.jagung = 25;", context);
  const beforeGold = vm.runInContext('S.gold', context);
  const beforeStock = vm.runInContext('S.landSystem.inventory.jagung', context);
  const order = {
    orderId: 'npc-supply-9-lampung-jagung', commodityId: 'jagung', side: 'sell',
    quantity: 12.5, limitPrice: context.MARKET_ENGINE.byId.jagung.marketPrice,
    createdAt: 9, expiresAt: 10, actorType: 'npc', ownerId: 'npc-producer-pool-lampung',
    regionId: 'lampung', stage: 'producer', sequence: 1,
    calibrationStatus: 'experimental_regional_simulation_aggregate'
  };
  const first = context.AgroPlayerOrderBook.replaceNpcOrders([order], 9);
  assert.equal(first.ok, true);
  assert.equal(first.storedCount, 1);
  assert.equal(context.AgroPlayerOrderBook.snapshot().npcOrders[0].orderId, order.orderId);
  assert.equal(context.AgroPlayerOrderBook.snapshot().lastNpcGenerationDay, 9);
  const serialized = saved.get('agrotycoon_save_v15');
  assert.ok(serialized.includes('npc-supply-9-lampung-jagung'));
  const repeated = context.AgroPlayerOrderBook.replaceNpcOrders([], 9);
  assert.equal(repeated.ok, true);
  assert.equal(repeated.alreadyGenerated, true);
  assert.equal(context.AgroPlayerOrderBook.snapshot().npcOrders.length, 1);
  assert.equal(vm.runInContext('S.gold', context), beforeGold);
  assert.equal(vm.runInContext('S.landSystem.inventory.jagung', context), beforeStock);
  const nextDay = context.AgroPlayerOrderBook.replaceNpcOrders([], 10);
  assert.equal(nextDay.ok, true);
  assert.equal(context.AgroPlayerOrderBook.snapshot().npcOrders.length, 0);
  assert.equal(context.AgroPlayerOrderBook.snapshot().lastNpcGenerationDay, 10);
});

test('invalid NPC proposal batch is rejected without replacing the previous batch', () => {
  freshState();
  const valid = {
    orderId: 'npc-demand-1-lampung-jagung', commodityId: 'jagung', side: 'buy',
    quantity: 1, limitPrice: context.MARKET_ENGINE.byId.jagung.marketPrice,
    createdAt: 1, expiresAt: 2, actorType: 'npc', ownerId: 'npc-buyer-pool-lampung',
    regionId: 'lampung', stage: 'producer', sequence: 1
  };
  assert.equal(context.AgroPlayerOrderBook.replaceNpcOrders([valid], 1).ok, true);
  const invalid = Object.assign({}, valid, { orderId: 'bad', actorType: 'player' });
  const result = context.AgroPlayerOrderBook.replaceNpcOrders([invalid], 2);
  assert.equal(result.ok, false);
  assert.equal(context.AgroPlayerOrderBook.snapshot().lastNpcGenerationDay, 1);
  assert.equal(context.AgroPlayerOrderBook.snapshot().npcOrders[0].orderId, valid.orderId);
});


test('partial player sell fills settle cash, FIFO inventory cost, HPP and retain only the unfilled reservation', () => {
  freshState();
  vm.runInContext("S.day = 1; S.playerRegionId = 'lampung'; S.gold = 1000000; S.landSystem.inventory.jagung = 10; S.landSystem.inventoryCost.jagung = 50000; S.dayLog = { gross: 0, expense: 0, businessPurchases: 0, cogs: 0, cashIn: 0, cashOut: 0 }; S.ledger = [];", context);
  const price = context.MARKET_ENGINE.getPrice('jagung');
  const player = context.AgroPlayerOrderBook.submit({ commodityId: 'jagung', side: 'sell', quantity: 5, limitPrice: price });
  assert.equal(player.ok, true);
  const npc = {
    orderId: 'npc-demand-1-lampung-jagung', commodityId: 'jagung', side: 'buy',
    quantity: 3, limitPrice: price, createdAt: 1, expiresAt: 2, actorType: 'npc',
    ownerId: 'npc-buyer-pool-lampung', regionId: 'lampung', stage: 'producer', sequence: 1
  };
  assert.equal(context.AgroPlayerOrderBook.replaceNpcOrders([npc], 1).ok, true);
  const beforeCash = vm.runInContext('S.gold', context);
  const result = context.AgroPlayerOrderBook.matchAndSettle(1);
  assert.equal(result.ok, true);
  assert.equal(result.settledPlayerFillCount, 1);
  assert.equal(result.executedQuantity, 3);
  assert.equal(vm.runInContext('S.gold', context), beforeCash + 3 * price);
  assert.equal(vm.runInContext('S.landSystem.inventory.jagung', context), 7);
  assert.equal(vm.runInContext('S.landSystem.inventoryCost.jagung', context), 35000);
  assert.equal(vm.runInContext('S.dayLog.gross', context), 3 * price);
  assert.equal(vm.runInContext('S.dayLog.cogs', context), 15000);
  const snapshot = context.AgroPlayerOrderBook.snapshot();
  assert.equal(snapshot.orders[0].status, 'open');
  assert.equal(snapshot.orders[0].remainingQuantity, 2);
  assert.equal(snapshot.reservedInventory.jagung, 2);
  assert.equal(snapshot.trades[0].settlement, 'player_settled');
  assert.equal(snapshot.trades[0].quantity, 3);
});

test('partial player buy fills debit only executed notional and create valued, age-tracked inventory lots', () => {
  freshState();
  vm.runInContext("S.day = 4; S.playerRegionId = 'lampung'; S.gold = 1000000; S.landSystem.inventory = {}; S.landSystem.inventoryCost = {}; S.dayLog = { gross: 0, expense: 0, businessPurchases: 0, cogs: 0, cashIn: 0, cashOut: 0 }; S.ledger = [];", context);
  const price = context.MARKET_ENGINE.getPrice('jagung');
  const player = context.AgroPlayerOrderBook.submit({ commodityId: 'jagung', side: 'buy', quantity: 5, limitPrice: price });
  assert.equal(player.ok, true);
  const npc = {
    orderId: 'npc-supply-4-lampung-jagung', commodityId: 'jagung', side: 'sell',
    quantity: 3, limitPrice: price, createdAt: 4, expiresAt: 5, actorType: 'npc',
    ownerId: 'npc-producer-pool-lampung', regionId: 'lampung', stage: 'producer', sequence: 1
  };
  assert.equal(context.AgroPlayerOrderBook.replaceNpcOrders([npc], 4).ok, true);
  const beforeCash = vm.runInContext('S.gold', context);
  const result = context.AgroPlayerOrderBook.matchAndSettle(4);
  assert.equal(result.ok, true);
  assert.equal(result.settledPlayerFillCount, 1);
  assert.equal(vm.runInContext('S.gold', context), beforeCash - 3 * price);
  assert.equal(vm.runInContext('S.landSystem.inventory.jagung', context), 3);
  assert.equal(vm.runInContext('S.landSystem.inventoryCost.jagung', context), 3 * price);
  assert.equal(vm.runInContext('S.dayLog.businessPurchases', context), 3 * price);
  const lots = vm.runInContext('S.landSystem.storageLots', context);
  assert.equal(lots.length, 1);
  assert.equal(lots[0].quantity, 3);
  assert.equal(lots[0].unitCost, price);
  assert.equal(lots[0].receivedDay, 4);
  const snapshot = context.AgroPlayerOrderBook.snapshot();
  assert.equal(snapshot.orders[0].remainingQuantity, 2);
  assert.equal(snapshot.reservedCash, 2 * price);
});

test('player orders may cross commodity bands only during an authorized national emergency', () => {
  freshState();
  const item = context.MARKET_ENGINE.byId.kelapa;
  const limitPrice = item.marketCeiling * 1.5;
  const blocked = context.AgroPlayerOrderBook.submit({ commodityId: 'kelapa', side: 'buy', quantity: 1, limitPrice });
  assert.equal(blocked.ok, false);
  assert.equal(blocked.reason, 'limit_price_outside_market_bounds');

  context.AgroNationalEconomy = {
    marketEmergencySnapshot: () => ({
      active: true, scope: 'national', type: 'war', eventId: 'war-player-order', commodityIds: ['kelapa']
    })
  };
  const allowed = context.AgroPlayerOrderBook.submit({ commodityId: 'kelapa', side: 'buy', quantity: 1, limitPrice });
  assert.equal(allowed.ok, true);
  assert.equal(allowed.order.limitPrice, limitPrice);
  assert.equal(allowed.reservedCash, limitPrice);
  context.AgroNationalEconomy = undefined;
});
