const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const economySource = fs.readFileSync(path.join(__dirname, '..', 'js', 'economy.js'), 'utf8');

function makeHarness(overrides = {}) {
  const S = {
    gold: 100000,
    day: 1,
    stock: { biasa: 1, super: 0 },
    stockCostValue: 3500,
    quarterUsed: 0,
    quarterCost: 0,
    purchases: { externalCoconutMonth: 0 },
    warung: {
      ice: 4, sugar: 4, cups: 4,
      iceCost: 2000, sugarCost: 1600, cupsCost: 1200,
      successfulSales: 0
    },
    dayLog: {
      gross: 0, expense: 0, businessExpense: 0, livingExpense: 0,
      businessPurchases: 0, cogs: 0, cashIn: 0, cashOut: 0,
      shopping: 0, capex: 0, labor: 0, living: 0, bills: 0,
      materials: { kelapa: 0, ice: 0, sugar: 0, cup: 0 },
      sales: {
        es: 0, esRev: 0, whole: 0, wholeRev: 0,
        tengkulak: 0, tengkulakRev: 0, pasar: 0, pasarRev: 0
      }
    },
    stats: { es: 0, whole: 0, tengkulak: 0, rotten: 0 },
    ...overrides
  };
  const DATA = {
    buyFromFarmer: 3500,
    buyFromTengkulak: 5000,
    wholePrice: 13000,
    es: { price: 5000, glassesPerCoconut: 4 },
    shop: {
      iceKarung: { price: 20000, portions: 40 },
      sugarBloc: { price: 20000, portions: 50 },
      cupPack: { price: 15000, pcs: 50 }
    }
  };
  const journal = [];
  const context = vm.createContext({
    S,
    DATA,
    ledger: (...args) => journal.push(args),
    gainXP: () => {},
    stockQty: () => (Number(S.stock.biasa) || 0) + (Number(S.stock.super) || 0),
    msg: () => {},
    save: () => {},
    render: () => {},
    say: () => {},
    closeModal: () => {},
    el: () => ({ value: '1' }),
    monthOf: () => 1
  });
  vm.runInContext(economySource, context, { filename: 'js/economy.js' });
  return { S, DATA, journal, context };
}

test('four es kelapa sales recognize HPP once and do not create cash outflow', () => {
  const { S, journal, context } = makeHarness();

  for (let i = 0; i < 4; i++) assert.equal(context.trySellEs(), true);

  assert.equal(S.dayLog.gross, 20000);
  assert.equal(S.dayLog.cogs, 8300); // coconut Rp3,500 + ice Rp2,000 + syrup Rp1,600 + cups Rp1,200
  assert.equal(S.gold, 120000); // only sales revenue changes cash
  assert.equal(S.dayLog.cashOut, 0);
  assert.equal(S.stock.biasa + S.stock.super, 0);
  assert.equal(S.stockCostValue, 0);
  assert.equal(S.quarterUsed, 0);
  assert.equal(S.warung.ice + S.warung.sugar + S.warung.cups, 0);
  assert.equal(S.warung.iceCost + S.warung.sugarCost + S.warung.cupsCost, 0);

  const hppEntries = journal.filter(row => row[0] === 'HPP');
  assert.equal(hppEntries.length, 4);
  for (const row of hppEntries) {
    const posting = row[4];
    assert.equal(posting.basis, 'noncash');
    assert.equal(posting.debit, posting.credit);
    const debit = posting.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const credit = posting.lines.reduce((sum, line) => sum + (line.credit || 0), 0);
    assert.equal(debit, credit);
  }

  const transfers = journal.filter(row => row[4] && row[4].classification === 'inventory_transfer');
  assert.equal(transfers.length, 1);
  assert.equal(transfers[0][4].debitAccount, 'Persediaan Kelapa Dalam Proses');
  assert.equal(transfers[0][4].creditAccount, 'Persediaan Kelapa');
  assert.equal(transfers[0][4].debit, 2625);
  assert.equal(transfers[0][4].credit, 2625);

  const coconutHppAccounts = hppEntries.map(row =>
    row[4].lines.find(line => (line.account === 'Persediaan Kelapa' || line.account === 'Persediaan Kelapa Dalam Proses') && line.credit > 0).account
  );
  assert.deepEqual(coconutHppAccounts, [
    'Persediaan Kelapa',
    'Persediaan Kelapa Dalam Proses',
    'Persediaan Kelapa Dalam Proses',
    'Persediaan Kelapa Dalam Proses'
  ]);
});

test('external coconut purchase adds actual cost to existing inventory without immediate expense', () => {
  const { S, context } = makeHarness();
  context.confirmBuyKelapa('tengkulak');

  assert.equal(S.gold, 95000);
  assert.equal(S.stock.biasa + S.stock.super, 2);
  assert.equal(S.stockCostValue, 8500); // existing Rp3,500 + purchased coconut Rp5,000
  assert.equal(S.dayLog.businessPurchases, 5000);
  assert.equal(S.dayLog.expense, 0);
  assert.equal(S.dayLog.cashOut, 5000);
});

test('CAPEX reduces cash but is not immediately recognized as expense', () => {
  const { S, context } = makeHarness();
  context.spend('CAPEX', 'Paket perlengkapan warung', 10000, 'capex', {});

  assert.equal(S.gold, 90000);
  assert.equal(S.dayLog.expense, 0);
  assert.equal(S.dayLog.businessExpense, 0);
  assert.equal(S.dayLog.cashOut, 10000);
});
