const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = vm.createContext({ console });
context.window = context;
let officialEmergency = null;
context.AgroNationalEconomy = { marketEmergencySnapshot: () => officialEmergency };
for (const file of ['js/commodities.js', 'js/market_engine.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, { filename: file });
}

test('market engine validates all 60 catalog items and bounded prices', () => {
  const result = context.MARKET_ENGINE.initialize();
  assert.equal(result.valid, true);
  assert.equal(result.commodityCount, 60);
  for (const item of context.MARKET_ENGINE.catalog) {
    assert.ok(item.marketFloor > 0, item.id + ' has a positive floor');
    assert.ok(item.marketCeiling >= item.marketFloor, item.id + ' has ordered bounds');
    assert.ok(item.marketPrice >= item.marketFloor && item.marketPrice <= item.marketCeiling, item.id + ' price is bounded');
  }
});

test('all 60 commodities have differentiated internal price bands and volatility profiles', () => {
  const market = context.MARKET_ENGINE;
  const profiles = new Set();
  for (const item of market.catalog) {
    assert.ok(item.marketFloor < item.basePrice, item.id + ' floor below anchor');
    assert.ok(item.marketCeiling > item.basePrice, item.id + ' ceiling above anchor');
    assert.ok(item.marketElasticity > 0 && item.marketElasticity <= 0.25, item.id + ' has bounded elasticity');
    assert.ok(item.marketDailyMoveLimit > 0 && item.marketDailyMoveLimit <= 0.25, item.id + ' has bounded daily movement');
    profiles.add(item.marketVolatility);
  }
  assert.ok(profiles.size >= 5, 'the catalog uses multiple volatility profiles');
  assert.ok(market.byId.cabai_merah.marketDailyMoveLimit > market.byId.padi.marketDailyMoveLimit);
  assert.ok(market.byId.lele.marketDailyMoveLimit > market.byId.kopi.marketDailyMoveLimit);
});

test('sector-specific daily movement limits are enforced at their configured ceilings', () => {
  const market = context.MARKET_ENGINE;
  for (const id of ['cabai_merah', 'padi']) {
    const item = market.byId[id];
    item.marketPrice = item.basePrice;
    const start = item.marketPrice;
    const result = market.reprice([{ commodityId: id, side: 'buy', quantity: 100000, price: item.marketCeiling }]);
    assert.equal(result.length, 1);
    assert.equal(result[0].price, Math.round(start * (1 + item.marketDailyMoveLimit)));
  }
});

test('net buy pressure raises price and net sell pressure lowers price', () => {
  const market = context.MARKET_ENGINE;
  const item = market.byId.jagung;
  item.marketPrice = item.basePrice;
  const start = item.marketPrice;
  const raised = market.reprice([
    { commodityId: 'jagung', side: 'buy', quantity: 100, price: start },
    { commodityId: 'jagung', side: 'buy', quantity: 100, price: start }
  ]);
  assert.equal(raised.length, 1);
  assert.ok(raised[0].price > start);
  const afterBuy = item.marketPrice;
  const lowered = market.reprice([
    { commodityId: 'jagung', side: 'sell', quantity: 100, price: afterBuy },
    { commodityId: 'jagung', side: 'sell', quantity: 100, price: afterBuy }
  ]);
  assert.equal(lowered.length, 1);
  assert.ok(lowered[0].price < afterBuy);
});

test('transaction prices cannot move the market outside configured floor and ceiling', () => {
  const market = context.MARKET_ENGINE;
  const item = market.byId.kelapa;
  item.marketPrice = item.marketCeiling;
  market.reprice([{ commodityId: 'kelapa', side: 'buy', quantity: 1000, price: item.marketCeiling }]);
  assert.equal(item.marketPrice, item.marketCeiling);
  item.marketPrice = item.marketFloor;
  market.reprice([{ commodityId: 'kelapa', side: 'sell', quantity: 1000, price: item.marketFloor }]);
  assert.equal(item.marketPrice, item.marketFloor);
});

test('unknown and malformed transactions are ignored without mutating prices', () => {
  const market = context.MARKET_ENGINE;
  const item = market.byId.tomat;
  const before = item.marketPrice;
  const result = market.reprice([
    { commodityId: 'unknown', side: 'buy', quantity: 1, price: 100 },
    { commodityId: 'tomat', side: 'buy', quantity: 0, price: 100 },
    { commodityId: 'tomat', side: 'hold', quantity: 1, price: 100 }
  ]);
  assert.equal(result.length, 0);
  assert.equal(item.marketPrice, before);
});


const makeOrder = (overrides = {}) => ({
  orderId: 'order-default',
  commodityId: 'jagung',
  side: 'buy',
  quantity: 5,
  limitPrice: 7000,
  createdAt: 1,
  expiresAt: null,
  actorType: 'player',
  ownerId: 'player-1',
  regionId: 'lampung',
  stage: 'producer',
  ...overrides
});

test('order book matches crossed orders at the resting order price with partial fills', () => {
  const market = context.MARKET_ENGINE;
  const result = market.matchOrderBook([
    makeOrder({ orderId: 'bid-1', side: 'buy', quantity: 10, limitPrice: 7000, createdAt: 1 }),
    makeOrder({ orderId: 'ask-1', side: 'sell', quantity: 4, limitPrice: 6500, createdAt: 2, ownerId: 'npc-1', actorType: 'npc' }),
    makeOrder({ orderId: 'ask-2', side: 'sell', quantity: 8, limitPrice: 6600, createdAt: 3, ownerId: 'npc-2', actorType: 'npc' })
  ], { now: 10 });
  assert.equal(result.fills.length, 2);
  assert.deepEqual(Array.from(result.fills, fill => fill.quantity), [4, 6]);
  assert.deepEqual(Array.from(result.fills, fill => fill.price), [7000, 7000]);
  assert.equal(result.executedQuantity, 10);
  assert.equal(result.executedNotional, 70000);
  assert.equal(result.priceTransactions.length, 2);
  assert.deepEqual(Array.from(result.priceTransactions, tx => tx.side), ['sell', 'sell']);
  assert.ok(result.priceTransactions.every(tx => tx.source === 'order_book_execution'));
  assert.equal(result.openOrders.length, 1);
  assert.equal(result.openOrders[0].orderId, 'ask-2');
  assert.equal(result.openOrders[0].remainingQuantity, 2);
});

test('order book enforces price priority before time priority and isolates region and stage', () => {
  const result = context.MARKET_ENGINE.matchOrderBook([
    makeOrder({ orderId: 'low-old', quantity: 5, limitPrice: 7000, createdAt: 1 }),
    makeOrder({ orderId: 'high-new', quantity: 5, limitPrice: 7200, createdAt: 2 }),
    makeOrder({ orderId: 'ask-main', side: 'sell', quantity: 3, limitPrice: 6800, createdAt: 3, ownerId: 'npc-main', actorType: 'npc' }),
    makeOrder({ orderId: 'ask-other-region', side: 'sell', quantity: 3, limitPrice: 6800, createdAt: 1, ownerId: 'npc-region', actorType: 'npc', regionId: 'jakarta' }),
    makeOrder({ orderId: 'ask-other-stage', side: 'sell', quantity: 3, limitPrice: 6800, createdAt: 1, ownerId: 'npc-stage', actorType: 'npc', stage: 'retail' })
  ], { now: 10 });
  assert.equal(result.fills.length, 1);
  assert.equal(result.fills[0].buyOrderId, 'high-new');
  assert.equal(result.fills[0].quantity, 3);
  assert.equal(result.openOrders.length, 4);
});

test('order book rejects invalid orders and expires orders before matching', () => {
  const result = context.MARKET_ENGINE.matchOrderBook([
    makeOrder({ orderId: 'expired', side: 'buy', expiresAt: 5 }),
    makeOrder({ orderId: 'bad-price', limitPrice: 1 }),
    makeOrder({ orderId: 'bad-qty', quantity: 0 }),
    makeOrder({ orderId: 'valid-bid' }),
    makeOrder({ orderId: 'valid-ask', side: 'sell', limitPrice: 6500, ownerId: 'npc', actorType: 'npc' })
  ], { now: 10 });
  assert.equal(result.expired.length, 1);
  assert.equal(result.rejected.length, 2);
  assert.equal(result.fills.length, 1);
});

test('order book prevents self-trading and leaves unfilled orders open', () => {
  const result = context.MARKET_ENGINE.matchOrderBook([
    makeOrder({ orderId: 'self-bid', ownerId: 'same-owner', createdAt: 1 }),
    makeOrder({ orderId: 'self-ask', side: 'sell', limitPrice: 6500, ownerId: 'same-owner', createdAt: 2 }),
    makeOrder({ orderId: 'external-ask', side: 'sell', limitPrice: 7100, ownerId: 'npc', actorType: 'npc', createdAt: 3 })
  ], { now: 10 });
  assert.equal(result.prevented.length, 1);
  assert.equal(result.prevented[0].orderId, 'self-ask');
  assert.equal(result.fills.length, 0);
  assert.equal(result.openOrders.length, 2);
});


test('order book supports fractional physical commodity quantities', () => {
  const result = context.MARKET_ENGINE.matchOrderBook([
    makeOrder({ orderId: 'fractional-bid', quantity: 2.75, limitPrice: 7000 }),
    makeOrder({ orderId: 'fractional-ask', side: 'sell', quantity: 1.25, limitPrice: 6500, ownerId: 'npc-fractional', actorType: 'npc' })
  ], { now: 10 });
  assert.equal(result.fills.length, 1);
  assert.equal(result.fills[0].quantity, 1.25);
  assert.equal(result.openOrders.length, 1);
  assert.equal(result.openOrders[0].remainingQuantity, 1.5);
  assert.equal(result.executedNotional, 8125);
});


test('order book price transaction represents the incoming aggressor, not both sides', () => {
  const result = context.MARKET_ENGINE.matchOrderBook([
    makeOrder({ orderId: 'resting-ask', side: 'sell', quantity: 2, limitPrice: 6500, createdAt: 1, ownerId: 'npc-maker', actorType: 'npc' }),
    makeOrder({ orderId: 'incoming-bid', side: 'buy', quantity: 2, limitPrice: 7000, createdAt: 2, ownerId: 'player-taker', actorType: 'player' })
  ], { now: 10 });
  assert.equal(result.fills.length, 1);
  assert.equal(result.fills[0].aggressorSide, 'buy');
  assert.equal(result.priceTransactions.length, 1);
  assert.equal(result.priceTransactions[0].side, 'buy');
  assert.equal(result.priceTransactions[0].quantity, 2);
  assert.equal(result.priceTransactions[0].price, 6500);
});

test('only an active national disaster or war may break normal price bands', () => {
  const market = context.MARKET_ENGINE;
  const item = market.byId.kelapa;
  const start = item.marketCeiling;
  item.marketPrice = start;
  const invalid = { active: true, scope: 'province', type: 'national_disaster', eventId: 'local-only', commodityIds: ['kelapa'] };
  officialEmergency = invalid;
  market.reprice([{ commodityId: 'kelapa', side: 'buy', quantity: 1000, price: start * 3 }], { emergency: invalid });
  assert.ok(item.marketPrice <= item.marketCeiling);

  const forged = { active: true, scope: 'national', type: 'war', eventId: 'forged-war', commodityIds: ['kelapa'] };
  officialEmergency = null;
  market.reprice([{ commodityId: 'kelapa', side: 'buy', quantity: 1000, price: start * 3 }], { emergency: forged });
  assert.ok(item.marketPrice <= item.marketCeiling);

  const valid = { active: true, scope: 'national', type: 'national_disaster', eventId: 'nd-1', commodityIds: ['kelapa'] };
  officialEmergency = valid;
  const result = market.reprice([{ commodityId: 'kelapa', side: 'buy', quantity: 1000, price: start * 3 }], { emergency: valid });
  assert.equal(result.length, 1);
  assert.equal(result[0].emergencyOverride, true);
  assert.ok(item.marketPrice > item.marketCeiling);

  item.marketPrice = item.marketFloor;
  const war = { active: true, scope: 'national', type: 'war', eventId: 'war-1', commodityIds: ['kelapa'] };
  officialEmergency = war;
  const lower = market.reprice([{ commodityId: 'kelapa', side: 'sell', quantity: 1000, price: item.marketFloor * 0.1 }], { emergency: war });
  assert.equal(lower[0].emergencyOverride, true);
  assert.ok(item.marketPrice < item.marketFloor);
  officialEmergency = null;
});

test('national emergency is commodity-scoped and required for out-of-band order matching', () => {
  const market = context.MARKET_ENGINE;
  const item = market.byId.kelapa;
  const emergency = { active: true, scope: 'national', type: 'war', eventId: 'war-order', commodityIds: ['jagung'] };
  officialEmergency = emergency;
  const blocked = market.matchOrderBook([
    makeOrder({ orderId: 'outside-band-bid', commodityId: 'kelapa', limitPrice: item.marketCeiling * 2 }),
    makeOrder({ orderId: 'outside-band-ask', commodityId: 'kelapa', side: 'sell', limitPrice: item.marketCeiling * 1.5, ownerId: 'npc', actorType: 'npc' })
  ], { now: 10, emergency });
  assert.equal(blocked.fills.length, 0);
  assert.equal(blocked.rejected.length, 2);

  const allowedEmergency = Object.assign({}, emergency, { commodityIds: ['kelapa'] });
  officialEmergency = allowedEmergency;
  const allowed = market.matchOrderBook([
    makeOrder({ orderId: 'emergency-bid', commodityId: 'kelapa', limitPrice: item.marketCeiling * 2 }),
    makeOrder({ orderId: 'emergency-ask', commodityId: 'kelapa', side: 'sell', limitPrice: item.marketCeiling * 1.5, ownerId: 'npc', actorType: 'npc' })
  ], { now: 10, emergency: allowedEmergency });
  assert.equal(allowed.fills.length, 1);
  officialEmergency = null;
});

test('order-book fills preserve each side quantity-unit provenance without implying physical conversion', () => {
  const market = context.MARKET_ENGINE;
  const item = market.byId.jagung;
  const result = market.matchOrderBook([
    {
      orderId: 'npc-demand-unit-test', commodityId: 'jagung', side: 'buy', quantity: 4,
      limitPrice: item.marketPrice, createdAt: 1, expiresAt: 2, actorType: 'npc',
      ownerId: 'npc-buyer-pool-lampung', regionId: 'lampung', stage: 'producer',
      quantityBasis: 'regional_unmet_demand_after_inventory',
      quantityUnit: 'unconverted_simulation_market_units',
      quantityCalibrationStatus: 'legacy_index_to_physical_unit_conversion_pending',
      referencePhysicalUnit: 'kg', referenceProductForm: 'jagung pipilan kering',
      referenceUnitStatus: 'official_reference_unit_quality_gate',
      quantityScaleStatus: 'unconverted_legacy_simulation_index'
    },
    {
      orderId: 'player-supply-unit-test', commodityId: 'jagung', side: 'sell', quantity: 4,
      limitPrice: item.marketPrice, createdAt: 1, expiresAt: 2, actorType: 'player',
      ownerId: 'player', regionId: 'lampung', stage: 'producer'
    }
  ], { now: 1 });
  assert.equal(result.fills.length, 1);
  assert.equal(result.fills[0].buyQuantityUnit, 'unconverted_simulation_market_units');
  assert.equal(result.fills[0].buyQuantityCalibrationStatus, 'legacy_index_to_physical_unit_conversion_pending');
  assert.equal(result.fills[0].sellQuantityUnit, 'unverified_catalog_quantity_unit');
  assert.equal(result.fills[0].quantityUnit, 'mixed_or_unverified_quantity_units');
  assert.equal(result.fills[0].buyReferencePhysicalUnit, 'kg');
  assert.equal(result.fills[0].buyReferenceProductForm, 'jagung pipilan kering');
  assert.equal(result.fills[0].buyReferenceUnitStatus, 'official_reference_unit_quality_gate');
  assert.equal(result.fills[0].buyQuantityScaleStatus, 'unconverted_legacy_simulation_index');
  assert.equal(result.openOrders.length, 0);
});

test('60-item catalog exposes explicit market-unit evidence status without converting legacy quantities', () => {
  const market = context.MARKET_ENGINE;
  assert.equal(market.catalog.length, 60);
  for (const item of market.catalog) {
    assert.ok(item.marketUnitStatus, item.id + ' missing market-unit status');
    assert.equal(item.quantityScaleStatus, 'unconverted_legacy_simulation_index', item.id + ' must not imply legacy index conversion');
  }
  assert.equal(market.byId.jagung.marketUnitReference.unit, 'kg');
  assert.equal(market.byId.ayam_pedaging.marketUnitReference.unit, 'ekor');
  assert.equal(market.byId.sapi_potong.marketUnitReference.unit, 'kg');
  assert.equal(market.byId.kelapa.marketUnitReference.unit, 'buah');
  assert.equal(market.byId.kedelai.marketUnitReference, null);
  assert.equal(market.byId.kedelai.marketUnitStatus, 'butuh_riset_lanjutan');
  for (const id of ['kelapa', 'padi', 'jagung', 'sapi_potong', 'ayam_pedaging', 'kelapa_sawit', 'karet']) {
    const reference = market.byId[id].marketUnitReference;
    assert.ok(Array.isArray(reference.evidenceLinks) && reference.evidenceLinks.length > 0, id + ' missing evidence links');
    assert.ok(reference.evidenceLinks.every(url => /^https:\/\//.test(url) || url.startsWith('docs/')), id + ' has invalid evidence link');
  }
});
