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
    priceTengkulak: { biasa: 3500, super: 5000 },
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
    stockClass: () => (Number(S.stock.super) || 0) > 0
      ? 'tua'
      : (Number(S.stock.biasa) || 0) > 0
        ? 'muda'
        : 'kosong',
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

test('live es kelapa sale uses unit economics as a pre-posting consistency guard', () => {
  const { S, DATA, context, journal } = makeHarness();
  const unitEconomics = require('../js/unit_economics.js');
  context.AgroUnitEconomics = unitEconomics;

  assert.equal(context.trySellEs(), true);
  assert.equal(S.dayLog.cogs, 2075);
  assert.equal(S.gold, 105000);
  assert.equal(journal.filter(row => row[0] === 'HPP').length, 1);
  assert.equal(journal.filter(row => row[0] === 'PENJUALAN').length, 1);

  DATA.es.price = NaN;
  assert.equal(context.trySellEs(), false);
  assert.equal(journal.filter(row => row[0] === 'HPP').length, 1);
});

test('whole coconut sale uses unit economics before any HPP or inventory mutation', () => {
  const { S, DATA, context, journal } = makeHarness();
  const unitEconomics = require('../js/unit_economics.js');
  context.AgroUnitEconomics = unitEconomics;

  assert.equal(context.trySellWhole(), true);
  assert.equal(S.dayLog.cogs, 3500);
  assert.equal(S.gold, 113000);
  assert.equal(S.stock.biasa + S.stock.super, 0);
  assert.equal(S.stockCostValue, 0);
  assert.equal(journal.filter(row => row[0] === 'HPP').length, 1);
  assert.equal(journal.filter(row => row[0] === 'PENJUALAN').length, 1);

  const fresh = makeHarness();
  fresh.context.AgroUnitEconomics = unitEconomics;
  fresh.DATA.wholePrice = NaN;
  assert.equal(fresh.context.trySellWhole(), false);
  assert.equal(fresh.S.gold, 100000);
  assert.equal(fresh.S.dayLog.cogs, 0);
  assert.equal(fresh.S.stock.biasa, 1);
  assert.equal(fresh.S.stockCostValue, 3500);
  assert.equal(fresh.journal.length, 0);
});

test('young coconut tengkulak sale uses unit economics before HPP or inventory mutation', () => {
  const { S, DATA, context, journal } = makeHarness();
  const unitEconomics = require('../js/unit_economics.js');
  context.AgroUnitEconomics = unitEconomics;
  context.stockClass = () => 'muda';

  assert.equal(context.confirmSellTengkulak(true, 999999), undefined);
  assert.equal(S.gold, 103500);
  assert.equal(S.stock.biasa + S.stock.super, 0);
  assert.equal(S.stockCostValue, 0);
  assert.equal(S.dayLog.cogs, 3500);
  assert.equal(journal.filter(row => row[0] === 'HPP').length, 1);
  assert.equal(journal.filter(row => row[0] === 'PENJUALAN').length, 1);

  const fresh = makeHarness();
  fresh.context.AgroUnitEconomics = unitEconomics;
  fresh.context.stockClass = () => 'muda';
  fresh.DATA.priceTengkulak.biasa = NaN;
  assert.equal(fresh.context.confirmSellTengkulak(true, 3500), undefined);
  assert.equal(fresh.S.gold, 100000);
  assert.equal(fresh.S.stock.biasa, 1);
  assert.equal(fresh.S.stockCostValue, 3500);
  assert.equal(fresh.S.dayLog.cogs, 0);
  assert.equal(fresh.journal.length, 0);
});

test('old coconut market sale uses unit economics before HPP or inventory mutation', () => {
  const { S, DATA, context, journal } = makeHarness();
  const unitEconomics = require('../js/unit_economics.js');
  context.AgroUnitEconomics = unitEconomics;

  S.stock.biasa = 0;
  S.stock.super = 2;
  S.stockCostValue = 7000;
  DATA.pricePasarTua = 6000;
  assert.equal(context.sellPasar(), undefined);
  assert.equal(S.gold, 112000);
  assert.equal(S.stock.biasa + S.stock.super, 0);
  assert.equal(S.stockCostValue, 0);
  assert.equal(S.dayLog.cogs, 7000);
  assert.equal(journal.filter(row => row[0] === 'HPP').length, 1);
  assert.equal(journal.filter(row => row[0] === 'PENJUALAN').length, 1);

  const fresh = makeHarness();
  fresh.context.AgroUnitEconomics = unitEconomics;
  fresh.S.stock.biasa = 0;
  fresh.S.stock.super = 2;
  fresh.S.stockCostValue = 7000;
  fresh.DATA.pricePasarTua = NaN;
  assert.equal(fresh.context.sellPasar(), undefined);
  assert.equal(fresh.S.gold, 100000);
  assert.equal(fresh.S.stock.super, 2);
  assert.equal(fresh.S.stockCostValue, 7000);
  assert.equal(fresh.S.dayLog.cogs, 0);
  assert.equal(fresh.journal.length, 0);
});
 
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

  // Component HPP must remain separate: coconut, ice, syrup, and cup are distinct inventory accounts.
  const firstHppLines = hppEntries[0][4].lines;
  assert.equal(firstHppLines.find(line => line.account === 'Persediaan Kelapa').credit, 875);
  assert.equal(firstHppLines.find(line => line.account === 'Persediaan Es').credit, 500);
  assert.equal(firstHppLines.find(line => line.account === 'Persediaan Gula').credit, 400);
  assert.equal(firstHppLines.find(line => line.account === 'Persediaan Cup').credit, 300);
  assert.equal(firstHppLines.filter(line => line.credit > 0).length, 4);

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

test('tengkulak sale recomputes revenue from current stock instead of trusting stale modal amount', () => {
  const { S, DATA, context, journal } = makeHarness();
  DATA.priceTengkulak = { biasa: 3500, super: 5000 };
  context.stockClass = () => 'muda';
  context.confirmSellTengkulak(true, 999999999);

  assert.equal(S.gold, 103500);
  assert.equal(S.dayLog.gross, 3500);
  assert.equal(S.dayLog.cogs, 3500);
  assert.equal(S.stock.biasa + S.stock.super, 0);
  assert.equal(S.stockCostValue, 0);
  assert.equal(S.dayLog.sales.tengkulak, 1);
  assert.equal(S.dayLog.sales.tengkulakRev, 3500);
  assert.equal(journal.filter(row => row[0] === 'PENJUALAN').length, 1);
});

test('tengkulak sale rejects confirmation after stock has disappeared', () => {
  const { S, DATA, context, journal } = makeHarness({ stock: { biasa: 0, super: 0 }, stockCostValue: 0 });
  DATA.priceTengkulak = { biasa: 3500, super: 5000 };
  context.stockClass = () => null;
  context.confirmSellTengkulak(true, 999999999);

  assert.equal(S.gold, 100000);
  assert.equal(S.dayLog.gross, 0);
  assert.equal(S.dayLog.cogs, 0);
  assert.equal(S.dayLog.sales.tengkulak, 0);
  assert.equal(journal.length, 0);
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

test('spend rejects negative and non-finite amounts before any accounting mutation', () => {
  const { S, journal, context } = makeHarness();
  const before = {
    gold: S.gold,
    gross: S.dayLog.gross,
    expense: S.dayLog.expense,
    businessExpense: S.dayLog.businessExpense,
    livingExpense: S.dayLog.livingExpense,
    businessPurchases: S.dayLog.businessPurchases,
    cashOut: S.dayLog.cashOut,
    journalLength: journal.length
  };

  for (const invalid of [-1, NaN, Infinity, -Infinity, 'not-a-number']) {
    assert.equal(context.spend('BELANJA', 'Bahan baku uji', invalid, 'shopping', {}), false);
    assert.equal(S.gold, before.gold);
    assert.equal(S.dayLog.gross, before.gross);
    assert.equal(S.dayLog.expense, before.expense);
    assert.equal(S.dayLog.businessExpense, before.businessExpense);
    assert.equal(S.dayLog.livingExpense, before.livingExpense);
    assert.equal(S.dayLog.businessPurchases, before.businessPurchases);
    assert.equal(S.dayLog.cashOut, before.cashOut);
    assert.equal(journal.length, before.journalLength);
  }
});

test('CAPEX reduces cash but is not immediately recognized as expense', () => {
  const { S, context } = makeHarness();
  context.spend('CAPEX', 'Paket perlengkapan warung', 10000, 'capex', {});

  assert.equal(S.gold, 90000);
  assert.equal(S.dayLog.expense, 0);
  assert.equal(S.dayLog.businessExpense, 0);
  assert.equal(S.dayLog.cashOut, 10000);
});


test('material recommendations never exceed the 150% stock target with whole packages', () => {
  const { S, DATA, context } = makeHarness();
  DATA.weather = { panas: { name: 'Panas' } };
  S.cuaca = 'panas';
  context.demandToday = () => 100; // target = 150 units per material
  S.warung.ice = 0; S.warung.sugar = 0; S.warung.cups = 0;
  let plan = context.materialPlan();
  assert.deepEqual(JSON.parse(JSON.stringify(plan.need)), { ice: 3, sugar: 3, cups: 3 });
  assert.ok(S.warung.ice + plan.need.ice * DATA.shop.iceKarung.portions <= plan.target);
  assert.ok(S.warung.sugar + plan.need.sugar * DATA.shop.sugarBloc.portions <= plan.target);
  assert.ok(S.warung.cups + plan.need.cups * DATA.shop.cupPack.pcs <= plan.target);

  // Even one complete package must be rejected if it would exceed the cap.
  context.demandToday = () => 10; // target = 15
  plan = context.materialPlan();
  assert.deepEqual(JSON.parse(JSON.stringify(plan.need)), { ice: 0, sugar: 0, cups: 0 });

  // A near-cap stock level cannot trigger an oversized package.
  context.demandToday = () => 100;
  S.warung.ice = 130; S.warung.sugar = 130; S.warung.cups = 130;
  plan = context.materialPlan();
  assert.deepEqual(JSON.parse(JSON.stringify(plan.need)), { ice: 0, sugar: 0, cups: 0 });
});


test('manual warung purchases reject fractional, negative, empty, nonnumeric, and over-limit package counts without mutation', () => {
  for (const field of ['m-ice', 'm-sugar', 'm-cup']) {
    for (const invalidValue of ['1.5', '-1', '1001', '', 'abc']) {
      const { S, context, journal } = makeHarness();
      const values = { 'm-ice': '0', 'm-sugar': '0', 'm-cup': '0', [field]: invalidValue };
      context.el = id => ({ value: values[id] });
      context.buyManual();
      assert.equal(S.gold, 100000, field + ' invalid value must not spend cash: ' + JSON.stringify(invalidValue));
      assert.equal(S.warung.ice, 4);
      assert.equal(S.warung.sugar, 4);
      assert.equal(S.warung.cups, 4);
      assert.equal(S.warung.iceCost, 2000);
      assert.equal(S.warung.sugarCost, 1600);
      assert.equal(S.warung.cupsCost, 1200);
      assert.equal(S.dayLog.businessPurchases, 0);
      assert.equal(S.dayLog.cashOut, 0);
      assert.equal(journal.length, 0);
    }
  }
});

test('manual warung purchases accept valid whole-package quantities', () => {
  const { S, context, journal } = makeHarness();
  const values = { 'm-ice': '1', 'm-sugar': '0', 'm-cup': '0' };
  context.el = id => ({ value: values[id] });
  context.buyManual();
  assert.equal(S.gold, 80000);
  assert.equal(S.warung.ice, 44);
  assert.equal(S.warung.iceCost, 22000);
  assert.equal(S.warung.sugar, 4);
  assert.equal(S.warung.cups, 4);
  assert.equal(S.dayLog.businessPurchases, 20000);
  assert.equal(S.dayLog.cashOut, 20000);
  assert.equal(journal.length, 1);
});

test('external coconut purchase enforces integer quantity bounds from 1 through 200', () => {
  for (const invalidQty of ['0', '-1', '201', '1.5', '', 'abc']) {
    const { S, context, journal } = makeHarness();
    context.el = () => ({ value: invalidQty });
    context.confirmBuyKelapa('tengkulak');
    assert.equal(S.gold, 100000, 'invalid quantity must not spend cash: ' + JSON.stringify(invalidQty));
    assert.equal(S.stock.biasa + S.stock.super, 1, 'invalid quantity must not add stock: ' + JSON.stringify(invalidQty));
    assert.equal(S.stockCostValue, 3500, 'invalid quantity must not alter inventory value: ' + JSON.stringify(invalidQty));
    assert.equal(S.purchases.externalCoconutMonth, 0, 'invalid quantity must not consume the monthly purchase allowance');
    assert.equal(journal.length, 0, 'invalid quantity must not create a ledger entry');
  }

  for (const validQty of ['1', '200']) {
    const { S, context } = makeHarness({ gold: 1100000 });
    context.el = () => ({ value: validQty });
    context.confirmBuyKelapa('tengkulak');
    const qty = Number(validQty);
    assert.equal(S.gold, 1100000 - qty * 5000);
    assert.equal(S.stock.biasa + S.stock.super, 1 + qty);
    assert.equal(S.stockCostValue, 3500 + qty * 5000);
    assert.equal(S.purchases.externalCoconutMonth, 1);
  }
});


test('recommended warung purchase rejects stale package counts without any transaction mutation', () => {
  const { S, DATA, context, journal } = makeHarness({ gold: 500000 });
  DATA.weather = { panas: { name: 'Panas', minBuyers: 100 } };
  S.cuaca = 'panas';
  S.warung.ice = 0; S.warung.sugar = 0; S.warung.cups = 0;
  context.demandToday = () => 100; // target 150 => 3 packages each
  context.buyRecommended(4, 3, 3); // modal count is stale/over cap for ice

  assert.equal(S.gold, 500000);
  assert.equal(S.warung.ice, 0);
  assert.equal(S.warung.sugar, 0);
  assert.equal(S.warung.cups, 0);
  assert.equal(S.warung.iceCost, 2000);
  assert.equal(S.warung.sugarCost, 1600);
  assert.equal(S.warung.cupsCost, 1200);
  assert.equal(S.dayLog.businessPurchases, 0);
  assert.equal(S.dayLog.cashOut, 0);
  assert.equal(journal.length, 0);
});

test('recommended warung purchase accepts current whole-package plan within the stock cap', () => {
  const { S, DATA, context, journal } = makeHarness({ gold: 500000 });
  DATA.weather = { panas: { name: 'Panas', minBuyers: 100 } };
  S.cuaca = 'panas';
  S.warung.ice = 0; S.warung.sugar = 0; S.warung.cups = 0;
  context.demandToday = () => 100; // target 150 => 3 packages each
  context.buyRecommended(3, 3, 3);

  assert.equal(S.gold, 335000);
  assert.equal(S.warung.ice, 120);
  assert.equal(S.warung.sugar, 150);
  assert.equal(S.warung.cups, 150);
  assert.equal(S.dayLog.businessPurchases, 165000);
  assert.equal(S.dayLog.cashOut, 165000);
  assert.equal(journal.length, 1);
});


test('business COGS rejects an incomplete component set without posting partial cost', () => {
  const invalidSets = [
    [{ account: 'Persediaan Kelapa', amount: 875 }, { account: 'Persediaan Es', amount: NaN }],
    [{ account: 'Persediaan Kelapa', amount: 875 }, { account: 'Persediaan Gula', amount: -1 }],
    [{ account: 'Persediaan Kelapa', amount: 875 }, { amount: 300 }],
    []
  ];
  for (const components of invalidSets) {
    const { S, context, journal } = makeHarness();
    assert.equal(context.recordBusinessCogs('HPP tidak lengkap', components), 0);
    assert.equal(S.dayLog.cogs, 0);
    assert.equal(S.dayLog.expense, 0);
    assert.equal(S.dayLog.cogsByAccount, undefined);
    assert.equal(journal.length, 0);
  }
});

test('business COGS accepts complete positive components and balances the posting', () => {
  const { S, context, journal } = makeHarness();
  assert.equal(context.recordBusinessCogs('HPP lengkap', [
    { account: 'Persediaan Kelapa', amount: 875 },
    { account: 'Persediaan Es', amount: 500 },
    { account: 'Persediaan Gula', amount: 400 },
    { account: 'Persediaan Cup', amount: 300 }
  ]), 2075);
  assert.equal(S.dayLog.cogs, 2075);
  assert.equal(S.dayLog.expense, 2075);
  assert.deepEqual(JSON.parse(JSON.stringify(S.dayLog.cogsByAccount)), {
    'Persediaan Kelapa': 875,
    'Persediaan Es': 500,
    'Persediaan Gula': 400,
    'Persediaan Cup': 300
  });
  assert.equal(journal.length, 1);
  const posting = journal[0][4];
  assert.equal(posting.debit, 2075);
  assert.equal(posting.credit, 2075);
});


test('es kelapa sale rejects invalid component HPP before consuming any stock or posting revenue', () => {
  const { S, DATA, context, journal } = makeHarness();
  DATA.shop.iceKarung.price = NaN;
  S.warung.iceCost = 0;
  const before = {
    gold: S.gold, stock: { ...S.stock }, stockCostValue: S.stockCostValue,
    quarterUsed: S.quarterUsed, quarterCost: S.quarterCost,
    warung: { ...S.warung }, materials: { ...S.dayLog.materials },
    gross: S.dayLog.gross, cogs: S.dayLog.cogs, sales: { ...S.dayLog.sales }
  };

  assert.equal(context.trySellEs(), false);
  assert.equal(S.gold, before.gold);
  assert.deepEqual(JSON.parse(JSON.stringify(S.stock)), before.stock);
  assert.equal(S.stockCostValue, before.stockCostValue);
  assert.equal(S.quarterUsed, before.quarterUsed);
  assert.equal(S.quarterCost, before.quarterCost);
  assert.deepEqual(JSON.parse(JSON.stringify(S.warung)), before.warung);
  assert.deepEqual(JSON.parse(JSON.stringify(S.dayLog.materials)), before.materials);
  assert.equal(S.dayLog.gross, before.gross);
  assert.equal(S.dayLog.cogs, before.cogs);
  assert.deepEqual(JSON.parse(JSON.stringify(S.dayLog.sales)), before.sales);
  assert.equal(journal.length, 0);
});

test('whole-coconut sale rejects non-positive HPP before consuming stock or recording revenue', () => {
  const { S, context, journal } = makeHarness({ stockCostValue: 0 });
  const stockBefore = { ...S.stock };
  assert.equal(context.trySellWhole(), false);
  assert.deepEqual(JSON.parse(JSON.stringify(S.stock)), stockBefore);
  assert.equal(S.stockCostValue, 0);
  assert.equal(S.gold, 100000);
  assert.equal(S.dayLog.gross, 0);
  assert.equal(S.dayLog.cogs, 0);
  assert.equal(S.dayLog.sales.whole, 0);
  assert.equal(journal.length, 0);
});


test('wholesale coconut channels reject zero inventory valuation without consuming stock or posting revenue', () => {
  {
    const { S, DATA, context, journal } = makeHarness({ stockCostValue: 0 });
    DATA.priceTengkulak = { biasa: 3500, super: 5000 };
    context.stockClass = () => 'muda';
    context.confirmSellTengkulak(true, 3500);
    assert.equal(S.gold, 100000);
    assert.equal(S.stock.biasa, 1);
    assert.equal(S.stockCostValue, 0);
    assert.equal(S.dayLog.gross, 0);
    assert.equal(S.dayLog.cogs, 0);
    assert.equal(S.dayLog.sales.tengkulak, 0);
    assert.equal(journal.length, 0);
  }
  {
    const { S, DATA, context, journal } = makeHarness({ stockCostValue: 0 });
    DATA.pricePasarTua = 8000;
    context.stockClass = () => 'tua';
    context.sellPasar();
    assert.equal(S.gold, 100000);
    assert.equal(S.stock.biasa, 1);
    assert.equal(S.stockCostValue, 0);
    assert.equal(S.dayLog.gross, 0);
    assert.equal(S.dayLog.cogs, 0);
    assert.equal(S.dayLog.sales.pasar, 0);
    assert.equal(journal.length, 0);
  }
});


test('all retail and market sale channels reject invalid sale prices before HPP or stock mutation', () => {
  {
    const { S, DATA, context, journal } = makeHarness();
    DATA.es.price = NaN;
    assert.equal(context.trySellEs(), false);
    assert.equal(S.gold, 100000);
    assert.equal(S.stock.biasa, 1);
    assert.equal(S.warung.ice, 4);
    assert.equal(S.dayLog.cogs, 0);
    assert.equal(S.dayLog.gross, 0);
    assert.equal(journal.length, 0);
  }
  {
    const { S, DATA, context, journal } = makeHarness();
    DATA.wholePrice = 0;
    assert.equal(context.trySellWhole(), false);
    assert.equal(S.gold, 100000);
    assert.equal(S.stock.biasa, 1);
    assert.equal(S.dayLog.cogs, 0);
    assert.equal(S.dayLog.sales.whole, 0);
    assert.equal(journal.length, 0);
  }
  {
    const { S, DATA, context, journal } = makeHarness();
    DATA.pricePasarTua = NaN;
    context.stockClass = () => 'tua';
    context.sellPasar();
    assert.equal(S.gold, 100000);
    assert.equal(S.stock.biasa, 1);
    assert.equal(S.dayLog.cogs, 0);
    assert.equal(S.dayLog.gross, 0);
    assert.equal(S.dayLog.sales.pasar, 0);
    assert.equal(journal.length, 0);
  }
});
