const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = vm.createContext({ console, Math, Number, Object, Array, Set, String, Error });
context.window = context;
for (const file of ['js/commodities.js', 'js/market_engine.js', 'js/background_economy.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, { filename: file });
}

test('data-only NPC actors create buy and sell flows for the 60 commodities', () => {
  const flow = context.BACKGROUND_ECONOMY.buildNpcFlow({ day: 10, activePlayers: 9 });
  assert.equal(flow.length, 120);
  assert.ok(flow.every(tx => tx.actorType === 'npc'));
  assert.ok(flow.every(tx => tx.quantity > 0 && tx.price > 0));
  assert.equal(flow.filter(tx => tx.side === 'buy').length, 60);
  assert.equal(flow.filter(tx => tx.side === 'sell').length, 60);
});

test('political policy changes supply and food-reserve policy changes food demand', () => {
  const econ = context.BACKGROUND_ECONOMY;
  const baseline = econ.buildNpcFlow({ day: 10, catalog: [context.COMMODITY_BY_ID.padi] });
  const tax = econ.buildNpcFlow({ day: 10, catalog: [context.COMMODITY_BY_ID.padi], policies: { productionTax: 0.4 } });
  const subsidy = econ.buildNpcFlow({ day: 10, catalog: [context.COMMODITY_BY_ID.padi], policies: { inputSubsidy: 0.4 } });
  const reserve = econ.buildNpcFlow({ day: 10, catalog: [context.COMMODITY_BY_ID.padi], policies: { foodReserveDemand: 0.4 } });
  const baseSell = baseline.find(tx => tx.side === 'sell').quantity;
  assert.ok(tax.find(tx => tx.side === 'sell').quantity < baseSell);
  assert.ok(subsidy.find(tx => tx.side === 'sell').quantity > baseSell);
  assert.ok(reserve.find(tx => tx.side === 'buy').quantity > baseline.find(tx => tx.side === 'buy').quantity);
});

test('market tick reports local simulation honestly and updates bounded prices', () => {
  const econ = context.BACKGROUND_ECONOMY;
  const result = econ.tick({ day: 11, playerTransactions: [{ commodityId: 'jagung', side: 'buy', quantity: 1000, price: context.COMMODITY_BY_ID.jagung.marketPrice }] });
  assert.equal(result.marketIsGloballyShared, false);
  assert.equal(result.scope, 'local-player-feed-plus-npc');
  assert.equal(result.npcTransactionCount, 120);
  assert.ok(result.priceUpdates.length > 0);
  for (const item of context.MARKET_ENGINE.catalog) {
    assert.ok(item.marketPrice >= item.marketFloor && item.marketPrice <= item.marketCeiling);
  }
});

test('national politics and presidential candidacy have explicit economic thresholds', () => {
  const eligibility = context.BACKGROUND_ECONOMY.politicalEligibility;
  assert.equal(eligibility({ companyLevel: 9, annualRevenue: 20000000000, reputation: 100 }).canEnterNationalPolitics, false);
  assert.equal(eligibility({ companyLevel: 10, annualRevenue: 1000000000, reputation: 60 }).canEnterNationalPolitics, true);
  assert.equal(eligibility({ companyLevel: 10, annualRevenue: 1000000000, reputation: 60 }).canRunForPresident, false);
  assert.equal(eligibility({ companyLevel: 15, annualRevenue: 10000000000, reputation: 75 }).canRunForPresident, true);
});
