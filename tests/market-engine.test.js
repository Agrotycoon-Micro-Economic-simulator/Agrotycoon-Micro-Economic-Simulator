const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = vm.createContext({ console });
context.window = context;
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
