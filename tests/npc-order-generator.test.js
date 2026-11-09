const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const context = vm.createContext({ Math, Number, Object, Array, Set, String });
context.window = context;
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js', 'npc_order_generator.js'), 'utf8'), context, { filename: 'js/npc_order_generator.js' });
const catalog = [
  { id: 'jagung', marketFloor: 1000, marketCeiling: 10000, marketUnitReference: { unit: 'kg', productForm: 'jagung pipilan kering' }, marketUnitStatus: 'official_reference_unit_quality_gate', quantityScaleStatus: 'unconverted_legacy_simulation_index' },
  { id: 'padi', marketFloor: 5000, marketCeiling: 20000 }
];
const province = (overrides = {}) => ({
  id: 'lampung', prices: { jagung: 1.2, padi: 0.9 }, inventory: { jagung: 80, padi: 0 },
  dailyProduction: { jagung: 120, padi: 0 }, unmetDemand: { jagung: 15, padi: 40 }, ...overrides
});
const getPrice = id => ({ jagung: 6000, padi: 12000 }[id] || null);

test('NPC proposals use regional marketable inventory and unmet demand with explicit provenance', () => {
  const result = context.AgroNpcOrderGenerator.buildDailyOrders({ day: 7, provinces: [province()], catalog, getPrice });
  assert.equal(result.ok, true);
  assert.equal(result.summary.regionCount, 1);
  assert.equal(result.summary.sellCount, 1);
  assert.equal(result.summary.buyCount, 2);
  const supply = result.orders.find(order => order.side === 'sell');
  const demand = result.orders.find(order => order.side === 'buy' && order.commodityId === 'jagung');
  assert.equal(supply.quantity, 80);
  assert.equal(supply.quantityBasis, 'regional_marketable_inventory_after_daily_demand');
  assert.equal(demand.quantity, 15);
  assert.equal(demand.quantityBasis, 'regional_unmet_demand_after_inventory');
  assert.equal(demand.quantityUnit, 'unconverted_simulation_market_units');
  assert.equal(demand.quantityCalibrationStatus, 'legacy_index_to_physical_unit_conversion_pending');
  assert.equal(supply.regionId, 'lampung');
  assert.equal(supply.stage, 'producer');
  assert.equal(supply.actorType, 'npc');
  assert.equal(supply.createdAt, 7);
  assert.equal(supply.expiresAt, 8);
  assert.equal(supply.limitPrice, 7272);
  assert.equal(supply.calibrationStatus, 'experimental_regional_simulation_aggregate');
  assert.equal(supply.pricingBasis, 'bounded_local_quote_experimental_npc_half_spread');
  assert.equal(supply.spreadBps, 100);
  assert.equal(supply.midPrice, 7200);
  assert.equal(supply.spreadStatus, 'experimental_unresearched_transaction_cost_proxy');
  assert.equal(supply.quantityUnit, 'unconverted_simulation_market_units');
  assert.equal(supply.quantityCalibrationStatus, 'legacy_index_to_physical_unit_conversion_pending');
  assert.equal(supply.referencePhysicalUnit, 'kg');
  assert.equal(supply.referenceProductForm, 'jagung pipilan kering');
  assert.equal(supply.referenceUnitStatus, 'official_reference_unit_quality_gate');
  assert.equal(supply.quantityScaleStatus, 'unconverted_legacy_simulation_index');
  const bid = result.orders.find(order => order.side === 'buy' && order.commodityId === 'jagung');
  assert.equal(bid.limitPrice, 7128);
  assert.notEqual(supply.ownerId, demand.ownerId);
});
test('NPC order IDs and order sequence are deterministic and region-scoped', () => {
  const a = context.AgroNpcOrderGenerator.buildDailyOrders({ day: 11, provinces: [province()], catalog, getPrice });
  const b = context.AgroNpcOrderGenerator.buildDailyOrders({ day: 11, provinces: [province()], catalog, getPrice });
  assert.deepEqual(Array.from(a.orders, order => order.orderId), Array.from(b.orders, order => order.orderId));
  assert.deepEqual(Array.from(a.orders, order => order.sequence), [1, 2, 3]);
  assert.ok(a.orders.every(order => order.orderId.includes('11-lampung-')));
});
test('NPC sell proposals use marketable inventory, not gross production or government reserves', () => {
  const result = context.AgroNpcOrderGenerator.buildDailyOrders({
    day: 3, provinces: [province({ inventory: { jagung: 0, padi: 0 }, reserve: { jagung: 999999 }, dailyProduction: { jagung: 999999 }, unmetDemand: { jagung: 0, padi: 0 } })],
    catalog, getPrice
  });
  assert.equal(result.orders.length, 0);
});
test('NPC proposals clamp local prices to commodity bounds and omit missing prices', () => {
  const result = context.AgroNpcOrderGenerator.buildDailyOrders({
    day: 2, provinces: [province({ prices: { jagung: 9, padi: 0.1 }, dailyProduction: { jagung: 2, padi: 2 }, unmetDemand: {} })],
    catalog, getPrice: id => id === 'jagung' ? 6000 : null
  });
  assert.equal(result.orders.length, 1);
  assert.equal(result.orders[0].limitPrice, 10000);
});
test('invalid day is rejected and duplicate regions are ignored', () => {
  const invalid = context.AgroNpcOrderGenerator.buildDailyOrders({ day: 1.5, provinces: [province()], catalog, getPrice });
  assert.equal(invalid.ok, false);
  const duplicate = context.AgroNpcOrderGenerator.buildDailyOrders({ day: 1, provinces: [province(), province()], catalog, getPrice });
  assert.equal(duplicate.summary.regionCount, 1);
  assert.equal(new Set(duplicate.orders.map(order => order.orderId)).size, duplicate.orders.length);
});


test('NPC bid and ask use an explicit bounded experimental spread and preserve the local quote midpoint', () => {
  const result = context.AgroNpcOrderGenerator.buildDailyOrders({
    day: 5, provinces: [province({ prices: { jagung: 1 }, inventory: { jagung: 10 }, unmetDemand: { jagung: 10 } })], catalog, getPrice
  });
  const ask = result.orders.find(order => order.side === 'sell');
  const bid = result.orders.find(order => order.side === 'buy');
  assert.equal(result.summary.npcSpreadBps, 100);
  assert.equal(ask.midPrice, 6000);
  assert.equal(ask.limitPrice, 6060);
  assert.equal(bid.midPrice, 6000);
  assert.equal(bid.limitPrice, 5940);
  assert.equal(ask.limitPrice > bid.limitPrice, true);
  assert.equal(ask.pricingBasis, bid.pricingBasis);
});

test('NPC spread remains inside commodity bounds at floor and ceiling', () => {
  const result = context.AgroNpcOrderGenerator.buildDailyOrders({
    day: 6,
    provinces: [province({ prices: { jagung: 99 }, inventory: { jagung: 1 }, unmetDemand: { jagung: 1 } })],
    catalog,
    getPrice: id => id === 'jagung' ? 6000 : null
  });
  const ask = result.orders.find(order => order.side === 'sell');
  const bid = result.orders.find(order => order.side === 'buy');
  assert.equal(ask.limitPrice, 10000);
  assert.equal(bid.limitPrice, 9900);
  const floorResult = context.AgroNpcOrderGenerator.buildDailyOrders({
    day: 7,
    provinces: [province({ prices: { jagung: 0.1 }, inventory: { jagung: 1 }, unmetDemand: { jagung: 1 } })],
    catalog,
    getPrice: id => id === 'jagung' ? 6000 : null
  });
  const floorAsk = floorResult.orders.find(order => order.side === 'sell');
  const floorBid = floorResult.orders.find(order => order.side === 'buy');
  assert.equal(floorAsk.limitPrice, 1010);
  assert.equal(floorBid.limitPrice, 1000);
});
