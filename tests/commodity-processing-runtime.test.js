const assert = require("node:assert/strict");
const test = (_name, run) => run();
const fs = require("node:fs");
const vm = require("node:vm");

const transformation = require("../js/commodity_transformation.js");
const unitEconomics = require("../js/unit_economics.js");
const landSource = fs.readFileSync(require.resolve("../js/land.js"), "utf8");

const state = {
  day: 1,
  gold: 1000000,
  cuaca: "panas",
  landSystem: {
    inventory: { cabai_merah: 10 },
    inventoryCost: { cabai_merah: 5000 },
    finishedInventory: {},
    finishedInventoryCost: {},
    lands: [],
    market: {}
  },
  dayLog: { gross: 0, expense: 0, businessPurchases: 0, cashOut: 0, shopping: 0, cogs: 0, cogsByAccount: {} },
  ledger: []
};

const prompts = ["10", "pickup", "tidak"];
const sandbox = {
  console,
  window: { REAL_ECONOMIC_DATA: { tollSegments: [] } },
  S: state,
  COMMODITY_BY_ID: {
    cabai_merah: { id: "cabai_merah", name: "Cabai Merah", basePrice: 25000 }
  },
  COMMODITY_ECONOMICS: {
    cabai_merah: {
      unit: "kg",
      tengkulakPrice: 25000,
      farmerPrice: 27810,
      processed: { id: "sambal_cabai_250g", name: "Sambal kemasan 250 g", inputKg: 0.25, price: 18000, otherCost: 2500, inputTier: 1, outputTier: 4, routeId: "cabai-to-sambal", outputUnit: "unit" }
    }
  },
  AgroCommodityTransformation: transformation,
  AgroUnitEconomics: unitEconomics,
  AgroCommodityStorage: {
    planAllowed: true,
    calls: [],
    failConsumeAfterMutation: false,
    planLotConsumption: function(_state, commodityId, quantity) {
      this.calls.push({ type: "plan", commodityId, quantity });
      return this.planAllowed ? { ok: true, plannedQuantity: quantity, available: quantity, consumedCost: quantity * 500 } : { ok: false, reason: "lot_quantity_shortfall" };
    },
    consumeLots: function(_state, commodityId, quantity) {
      this.calls.push({ type: "consume", commodityId, quantity });
      if (this.failConsumeAfterMutation) {
        const lot = (_state.landSystem.storageLots || []).find(x => x.commodityId === commodityId);
        if (lot) lot.quantity = Math.max(0, lot.quantity - quantity);
        return { ok: false, reason: "injected_consume_failure_after_mutation" };
      }
      return { ok: true, consumedQuantity: quantity };
    }
  },
  ensureAgriState: () => {},
  prompt: () => prompts.shift() || "tidak",
  confirm: () => true,
  logisticsPrompt: () => ({ total: 100 }),
  logisticsBreakdown: () => "Distribusi Rp 100",
  safeRp: n => "Rp " + Math.round(n),
  msg: message => { sandbox.lastMessage = message; },
  save: () => {},
  showCommodityEconomics: () => {},
  render: () => {},
  el: () => null,
  ledger: (cat, desc, amt, detail, accounting) => state.ledger.push({ cat, desc, amt, detail, accounting }),
  spend: (cat, desc, amt, field, detail) => {
    if (!Number.isFinite(amt) || amt < 0 || state.gold < amt) return false;
    state.gold -= amt;
    if (cat === "BELANJA") state.dayLog.businessPurchases += amt;
    state.dayLog.cashOut += amt;
    if (field) state.dayLog[field] = (state.dayLog[field] || 0) + amt;
    state.ledger.push({ cat, desc, amt: -amt, detail });
    return true;
  },
  earn: (_cat, _desc, amt, detail) => {
    state.gold += amt;
    state.dayLog.gross += amt;
    state.dayLog.cashIn = (state.dayLog.cashIn || 0) + amt;
    state.ledger.push({ cat: _cat, desc: _desc, amt, detail });
  },
  businessCogsTotal: components => components.reduce((sum, x) => sum + x.amount, 0),
  recordBusinessCogs: (_desc, components) => {
    const total = components.reduce((sum, x) => sum + x.amount, 0);
    state.dayLog.cogs += total;
    state.dayLog.cogsByAccount = state.dayLog.cogsByAccount || {};
    components.forEach(x => {
      state.dayLog.cogsByAccount[x.account] = (state.dayLog.cogsByAccount[x.account] || 0) + x.amount;
    });
    state.ledger.push({ cat: "HPP", desc: _desc, amt: -total, detail: { components } });
    return total;
  },
  COMMODITIES: [],
  LAND_MARKET_PROFILES: [],
  LAND_TIERS: [],
  LAND_USE_PROFILES: [],
  REAL_ECONOMIC_DATA: { tollSegments: [] }
};

vm.runInNewContext(landSource, sandbox, { filename: "js/land.js" });
// Override the real logistics prompt after loading land.js, which declares its own function.
sandbox.logisticsPrompt = () => ({ total: 100 });
sandbox.showCommodityEconomics = () => {};

test("inventory lot reconciliation detects aggregate and lot-book divergence",()=>{
  state.landSystem.storageLots=[
    {id:"raw-1",commodityId:"jagung",quantity:4,unitCost:500},
    {id:"raw-2",commodityId:"jagung",quantity:1,unitCost:600}
  ];
  state.landSystem.inventory={jagung:5};
  state.landSystem.inventoryCost={jagung:2600};
  state.landSystem.finishedInventory={jagung_bakar:5};
  state.landSystem.finishedInventoryCost={jagung_bakar:1100};
  state.landSystem.finishedInventoryLots={
    jagung_bakar:[
      {id:"fg-1",commodityId:"jagung_bakar",quantity:2,unitCost:100},
      {id:"fg-2",commodityId:"jagung_bakar",quantity:3,unitCost:300}
    ]
  };
  const ok=sandbox.reconcileInventoryLotBooks(state);
  assert.equal(ok.ok,true);
  assert.equal(ok.raw[0].status,"ok");
  assert.equal(ok.finished[0].status,"ok");

  state.landSystem.finishedInventoryCost.jagung_bakar=1000;
  const mismatch=sandbox.reconcileInventoryLotBooks(state);
  assert.equal(mismatch.ok,false);
  assert.equal(mismatch.finished[0].status,"cost_mismatch");
  state.landSystem.finishedInventoryCost.jagung_bakar=1100;
});

state.landSystem.inventory={cabai_merah:10};
state.landSystem.inventoryCost={cabai_merah:5000};
state.landSystem.finishedInventory={};
state.landSystem.finishedInventoryCost={};
delete state.landSystem.finishedInventoryLots;
delete state.landSystem.storageLots;
state.dayLog={gross:0,expense:0,businessPurchases:0,cashOut:0,shopping:0,cogs:0,cogsByAccount:{}};
state.ledger=[];

test("commodity transactions are blocked when lot-book reconciliation fails",()=>{
  state.landSystem.inventory={cabai_merah:5};
  state.landSystem.inventoryCost={cabai_merah:2500};
  state.landSystem.storageLots=[{id:"broken",commodityId:"cabai_merah",quantity:4,unitCost:500}];
  state.dayLog.inventoryReconciliationErrors=[];
  const before=JSON.stringify({inventory:state.landSystem.inventory,inventoryCost:state.landSystem.inventoryCost,ledger:state.ledger.length});
  assert.equal(sandbox.sellCommodity("cabai_merah","retail"),false);
  assert.equal(JSON.stringify({inventory:state.landSystem.inventory,inventoryCost:state.landSystem.inventoryCost,ledger:state.ledger.length}),before);
  assert.equal(state.dayLog.inventoryReconciliationErrors.length,1);
  delete state.landSystem.storageLots;
  state.landSystem.inventory={cabai_merah:10};
  state.landSystem.inventoryCost={cabai_merah:5000};
  state.dayLog.inventoryReconciliationErrors=[];
});

assert.equal(typeof sandbox.processCommodity, "function");

sandbox.processCommodity("cabai_merah");

assert.equal(state.landSystem.inventory.cabai_merah, 0);
assert.equal(state.landSystem.inventoryCost.cabai_merah, 0);
assert.equal(state.landSystem.finishedInventory.sambal_cabai_250g, 40, "10 kg raw input at 0.25 kg per pack must yield 40 finished packs");
assert.equal(state.landSystem.finishedInventoryCost.sambal_cabai_250g, 105000, "finished goods carrying value must include raw input plus conversion");
assert.equal(state.landSystem.finishedInventoryQuantityMeta.sambal_cabai_250g.quantityUnit, "unconverted_simulation_market_units");
assert.equal(state.landSystem.finishedInventoryQuantityMeta.sambal_cabai_250g.quantityScaleStatus, "unconverted_legacy_simulation_index");
assert.equal(state.dayLog.commodityProduction[0].inputQuantityUnit, "unconverted_simulation_market_units");
assert.equal(state.dayLog.commodityProduction[0].outputQuantityUnit, "unconverted_simulation_market_units");
assert.equal(state.dayLog.commodityProduction[0].declaredOutputRecipeUnit, "unit");
assert.equal(state.gold, 899900, "cash must reflect conversion purchase and distribution only");
assert.equal(state.dayLog.cogs, 0, "processing alone must not recognize COGS before finished goods are sold");
assert.equal(state.dayLog.businessPurchases, 100000);
assert.equal(state.dayLog.cashOut, 100100);
assert.equal(state.dayLog.gross, 0);
assert.deepEqual(sandbox.AgroCommodityStorage.calls.slice(0,2).map(x => x.type), ["plan", "consume"], "processing must preflight lots before consuming them");

state.gold = 50000;
state.landSystem.inventory.cabai_merah = 10;
state.landSystem.inventoryCost.cabai_merah = 5000;
const beforeInsufficient = JSON.stringify({
  gold: state.gold,
  inventory: state.landSystem.inventory.cabai_merah,
  inventoryCost: state.landSystem.inventoryCost.cabai_merah,
  finishedInventory: state.landSystem.finishedInventory.sambal_cabai_250g,
  finishedInventoryCost: state.landSystem.finishedInventoryCost.sambal_cabai_250g,
  cogs: state.dayLog.cogs,
  gross: state.dayLog.gross
});
sandbox.AgroCommodityStorage.planAllowed = false;
const beforeLotPlanFailure = JSON.stringify({
  gold: state.gold,
  inventory: state.landSystem.inventory.cabai_merah,
  inventoryCost: state.landSystem.inventoryCost.cabai_merah,
  finishedInventory: state.landSystem.finishedInventory.sambal_cabai_250g,
  finishedInventoryCost: state.landSystem.finishedInventoryCost.sambal_cabai_250g,
  ledger: state.ledger.length
});
sandbox.processCommodity("cabai_merah");
assert.equal(JSON.stringify({
  gold: state.gold,
  inventory: state.landSystem.inventory.cabai_merah,
  inventoryCost: state.landSystem.inventoryCost.cabai_merah,
  finishedInventory: state.landSystem.finishedInventory.sambal_cabai_250g,
  finishedInventoryCost: state.landSystem.finishedInventoryCost.sambal_cabai_250g,
  ledger: state.ledger.length
}), beforeLotPlanFailure, "processing lot preflight failure must leave cash/accounting/inventory unchanged");
sandbox.AgroCommodityStorage.planAllowed = true;

sandbox.processCommodity("cabai_merah");
assert.equal(JSON.stringify({
  gold: state.gold,
  inventory: state.landSystem.inventory.cabai_merah,
  inventoryCost: state.landSystem.inventoryCost.cabai_merah,
  finishedInventory: state.landSystem.finishedInventory.sambal_cabai_250g,
  finishedInventoryCost: state.landSystem.finishedInventoryCost.sambal_cabai_250g,
  cogs: state.dayLog.cogs,
  gross: state.dayLog.gross
}), beforeInsufficient, "insufficient cash must not mutate processing state");


assert.equal(typeof sandbox.sellFinishedCommodity, "function");

state.gold = 899900;
state.landSystem.finishedInventory.sambal_cabai_250g = 40;
state.landSystem.finishedInventoryCost.sambal_cabai_250g = 105000;
const saleLedgerBefore = state.ledger.length;
const saleOk = sandbox.sellFinishedCommodity("sambal_cabai_250g", 2);
assert.equal(saleOk, true);
assert.equal(state.landSystem.finishedInventory.sambal_cabai_250g, 38);
assert.equal(state.landSystem.finishedInventoryCost.sambal_cabai_250g, 99750);
assert.equal(state.gold, 935900);
assert.equal(state.dayLog.cogs, 5250);
assert.equal(state.dayLog.gross, 36000);
assert.equal(state.dayLog.cogsByAccount["Persediaan Produk Jadi"], 5250);
assert.equal(state.ledger.length, saleLedgerBefore + 2);

const beforeInvalidPrice = JSON.stringify({gold:state.gold,qty:state.landSystem.finishedInventory.sambal_cabai_250g,cost:state.landSystem.finishedInventoryCost.sambal_cabai_250g,cogs:state.dayLog.cogs,gross:state.dayLog.gross,ledger:state.ledger.length});
sandbox.COMMODITY_ECONOMICS.cabai_merah.processed.price = NaN;
assert.equal(sandbox.sellFinishedCommodity("sambal_cabai_250g", 1), false);
assert.equal(JSON.stringify({gold:state.gold,qty:state.landSystem.finishedInventory.sambal_cabai_250g,cost:state.landSystem.finishedInventoryCost.sambal_cabai_250g,cogs:state.dayLog.cogs,gross:state.dayLog.gross,ledger:state.ledger.length}), beforeInvalidPrice);

sandbox.COMMODITY_ECONOMICS.cabai_merah.processed.price = 18000;
const originalRecordCogs = sandbox.recordBusinessCogs;
const finishedBeforeCogsFailure = JSON.stringify({
  gold: state.gold,
  qty: state.landSystem.finishedInventory.sambal_cabai_250g,
  cost: state.landSystem.finishedInventoryCost.sambal_cabai_250g,
  cogs: state.dayLog.cogs,
  gross: state.dayLog.gross,
  ledger: state.ledger.length
});
sandbox.recordBusinessCogs = () => 0;
assert.equal(sandbox.sellFinishedCommodity("sambal_cabai_250g", 1), false);
assert.equal(JSON.stringify({
  gold: state.gold,
  qty: state.landSystem.finishedInventory.sambal_cabai_250g,
  cost: state.landSystem.finishedInventoryCost.sambal_cabai_250g,
  cogs: state.dayLog.cogs,
  gross: state.dayLog.gross,
  ledger: state.ledger.length
}), finishedBeforeCogsFailure, "finished-goods HPP failure must leave inventory and cash unchanged");
sandbox.recordBusinessCogs = originalRecordCogs;

const originalTransformationApi = sandbox.AgroCommodityTransformation;
const receiptFailureBefore = JSON.stringify({
  gold: state.gold,
  inventory: state.landSystem.inventory.cabai_merah,
  inventoryCost: state.landSystem.inventoryCost.cabai_merah,
  finishedInventory: state.landSystem.finishedInventory.sambal_cabai_250g,
  finishedInventoryCost: state.landSystem.finishedInventoryCost.sambal_cabai_250g,
  cogs: state.dayLog.cogs,
  gross: state.dayLog.gross,
  ledger: state.ledger.length
});
sandbox.AgroCommodityTransformation = { ...originalTransformationApi, addInventoryCost: () => ({ ok: false }) };
sandbox.prompt = () => "0";
sandbox.logisticsPrompt = () => ({ total: 100 });
sandbox.processCommodity("cabai_merah");
assert.equal(JSON.stringify({
  gold: state.gold,
  inventory: state.landSystem.inventory.cabai_merah,
  inventoryCost: state.landSystem.inventoryCost.cabai_merah,
  finishedInventory: state.landSystem.finishedInventory.sambal_cabai_250g,
  finishedInventoryCost: state.landSystem.finishedInventoryCost.sambal_cabai_250g,
  cogs: state.dayLog.cogs,
  gross: state.dayLog.gross,
  ledger: state.ledger.length
}), receiptFailureBefore, "processing receipt failure must leave cash and inventory unchanged");
sandbox.AgroCommodityTransformation = originalTransformationApi;

const beforeBadQty = JSON.stringify({gold:state.gold,qty:state.landSystem.finishedInventory.sambal_cabai_250g,cost:state.landSystem.finishedInventoryCost.sambal_cabai_250g,cogs:state.dayLog.cogs,gross:state.dayLog.gross,ledger:state.ledger.length});
assert.equal(sandbox.sellFinishedCommodity("sambal_cabai_250g", 1.5), false);
assert.equal(JSON.stringify({gold:state.gold,qty:state.landSystem.finishedInventory.sambal_cabai_250g,cost:state.landSystem.finishedInventoryCost.sambal_cabai_250g,cogs:state.dayLog.cogs,gross:state.dayLog.gross,ledger:state.ledger.length}), beforeBadQty);


state.gold = 1000000;
state.landSystem.inventory.cabai_merah = 10;
state.landSystem.inventoryCost.cabai_merah = 5000;
state.dayLog.cogs = 0;
state.dayLog.gross = 0;
state.dayLog.expense = 0;
state.dayLog.businessPurchases = 0;
state.dayLog.cashOut = 0;
state.dayLog.commoditySales = [];
state.ledger = [];
sandbox.prompt = () => "0";
sandbox.confirm = () => true;
sandbox.logisticsPrompt = () => ({ total: 100 });
sandbox.AgroCommodityStorage.planAllowed = false;
const rawBeforeLotPlanFailure = JSON.stringify({
  gold: state.gold,
  inventory: state.landSystem.inventory.cabai_merah,
  inventoryCost: state.landSystem.inventoryCost.cabai_merah,
  cogs: state.dayLog.cogs,
  gross: state.dayLog.gross,
  expense: state.dayLog.expense,
  ledger: state.ledger.length
});
assert.equal(sandbox.sellCommodity("cabai_merah", "b2b"), false);
assert.equal(JSON.stringify({
  gold: state.gold,
  inventory: state.landSystem.inventory.cabai_merah,
  inventoryCost: state.landSystem.inventoryCost.cabai_merah,
  cogs: state.dayLog.cogs,
  gross: state.dayLog.gross,
  expense: state.dayLog.expense,
  ledger: state.ledger.length
}), rawBeforeLotPlanFailure, "raw-sale lot preflight failure must leave cash/accounting/inventory unchanged");
sandbox.AgroCommodityStorage.planAllowed = true;
sandbox.AgroCommodityStorage.planLotConsumption = function(_state, commodityId, quantity) {
  this.calls.push({ type: "plan", commodityId, quantity });
  return { ok: true, plannedQuantity: quantity, available: quantity - 1, consumedCost: quantity * 500 };
};
const beforeLotAggregateMismatch = JSON.stringify({
  gold: state.gold,
  inventory: state.landSystem.inventory.cabai_merah,
  inventoryCost: state.landSystem.inventoryCost.cabai_merah,
  cogs: state.dayLog.cogs,
  gross: state.dayLog.gross,
  expense: state.dayLog.expense,
  ledger: state.ledger.length
});
assert.equal(sandbox.sellCommodity("cabai_merah", "b2b"), false);
assert.equal(JSON.stringify({
  gold: state.gold,
  inventory: state.landSystem.inventory.cabai_merah,
  inventoryCost: state.landSystem.inventoryCost.cabai_merah,
  cogs: state.dayLog.cogs,
  gross: state.dayLog.gross,
  expense: state.dayLog.expense,
  ledger: state.ledger.length
}), beforeLotAggregateMismatch, "aggregate/lot mismatch must block raw sale before mutation");
sandbox.AgroCommodityStorage.planLotConsumption = function(_state, commodityId, quantity) {
  this.calls.push({ type: "plan", commodityId, quantity });
  return { ok: true, requested: quantity, plannedQuantity: quantity, available: quantity, consumedCost: quantity * 500 };
};
const rawSaleOk = sandbox.sellCommodity("cabai_merah", "b2b");
assert.equal(rawSaleOk, true);
assert.equal(state.landSystem.inventory.cabai_merah, 0);
assert.equal(state.landSystem.inventoryCost.cabai_merah, 0);
assert.equal(state.gold, 1249900);
assert.equal(state.dayLog.cogs, 5000);
assert.equal(state.dayLog.gross, 250000);
assert.equal(state.dayLog.expense, 100);
assert.equal(state.dayLog.commoditySales[0].grossProfit, 245000);
assert.equal(state.ledger.length, 3, "raw sale must post HPP, distribution expense, and revenue ledger entries");

state.gold = 1000000;
state.landSystem.inventory.cabai_merah = 10;
state.landSystem.inventoryCost.cabai_merah = 5000;
state.dayLog.cogs = 0;
state.dayLog.gross = 0;
state.dayLog.expense = 0;
state.dayLog.commoditySales = [];
state.ledger = [];
const originalRawRecordCogs = sandbox.recordBusinessCogs;
const rawBeforeCogsFailure = JSON.stringify({
  gold: state.gold,
  inventory: state.landSystem.inventory.cabai_merah,
  inventoryCost: state.landSystem.inventoryCost.cabai_merah,
  cogs: state.dayLog.cogs,
  gross: state.dayLog.gross,
  expense: state.dayLog.expense,
  ledger: state.ledger.length
});
sandbox.recordBusinessCogs = () => 0;
assert.equal(sandbox.sellCommodity("cabai_merah", "b2b"), false);
assert.equal(JSON.stringify({
  gold: state.gold,
  inventory: state.landSystem.inventory.cabai_merah,
  inventoryCost: state.landSystem.inventoryCost.cabai_merah,
  cogs: state.dayLog.cogs,
  gross: state.dayLog.gross,
  expense: state.dayLog.expense,
  ledger: state.ledger.length
}), rawBeforeCogsFailure, "raw agricultural HPP failure must leave cash and inventory unchanged");
sandbox.recordBusinessCogs = originalRawRecordCogs;

// Failure injection: storage mutates a lot and then reports failure. The sale wrapper
// must restore the complete pre-transaction state, including the lot book and ledger.
state.gold = 1000000;
state.landSystem.inventory = { cabai_merah: 10 };
state.landSystem.inventoryCost = { cabai_merah: 5000 };
state.landSystem.storageLots = [{ id: "raw-atomic", commodityId: "cabai_merah", quantity: 10, unitCost: 500 }];
state.landSystem.market = { cabai_merah: { sold: 0, price: 25000 } };
state.dayLog = { gross: 0, expense: 0, businessPurchases: 0, cashOut: 0, shopping: 0, cogs: 0, cogsByAccount: {} };
state.ledger = [];
const rawBeforeConsumeFailure = JSON.stringify(state);
sandbox.AgroCommodityStorage.failConsumeAfterMutation = true;
assert.equal(sandbox.sellCommodity("cabai_merah", "b2b"), false);
assert.equal(JSON.stringify(state), rawBeforeConsumeFailure, "failed raw lot commit must roll back all state after partial lot mutation");
sandbox.AgroCommodityStorage.failConsumeAfterMutation = false;
delete state.landSystem.storageLots;

sandbox.COMMODITY_ECONOMICS.cabai_merah.tengkulakPrice = NaN;
sandbox.COMMODITY_ECONOMICS.cabai_merah.farmerPrice = NaN;
sandbox.COMMODITY_BY_ID.cabai_merah.basePrice = NaN;
assert.equal(sandbox.sellCommodity("cabai_merah", "b2b"), false);
assert.equal(state.landSystem.inventory.cabai_merah, 10);
assert.equal(state.landSystem.inventoryCost.cabai_merah, 5000);
assert.equal(state.gold, 1000000);
assert.equal(state.dayLog.cogs, 0);
assert.equal(state.dayLog.gross, 0);
assert.equal(state.ledger.length, 0);
sandbox.COMMODITY_ECONOMICS.cabai_merah.tengkulakPrice = 25000;
sandbox.COMMODITY_ECONOMICS.cabai_merah.farmerPrice = 27810;
sandbox.COMMODITY_BY_ID.cabai_merah.basePrice = 25000;

state.gold = 1000000;
state.landSystem.inventory = { jagung: 5 };
state.landSystem.inventoryCost = { jagung: 5000 };
state.landSystem.finishedInventory = {};
state.landSystem.finishedInventoryCost = {};
state.dayLog = { gross: 0, expense: 0, businessPurchases: 0, cashOut: 0, shopping: 0, cogs: 0, cogsByAccount: {} };
state.ledger = [];
sandbox.COMMODITY_BY_ID.jagung = { id: "jagung", name: "Jagung" };
sandbox.COMMODITY_ECONOMICS.jagung = {
  unit: "kg pipilan kering",
  farmerPrice: 5992,
  processed: {
    id: "jagung_bakar",
    name: "Jagung bakar",
    inputKg: 0.25,
    price: 10000,
    otherCost: 2500,
    outputQty: 1,
    outputUnit: "porsi",
    inputTier: 1,
    outputTier: 4,
    routeId: "jagung-kering-to-jagung-bakar"
  }
};
sandbox.prompt = () => "0";
sandbox.logisticsPrompt = () => ({ total: 100 });
sandbox.processCommodity("jagung");
assert.equal(state.landSystem.inventory.jagung, 0);
assert.equal(state.landSystem.inventoryCost.jagung, 0);
assert.equal(state.landSystem.finishedInventory.jagung_bakar, 20);
assert.equal(state.landSystem.finishedInventoryCost.jagung_bakar, 55000);
assert.equal(state.landSystem.finishedInventoryLots.jagung_bakar.length, 1);
assert.equal(state.landSystem.finishedInventoryLots.jagung_bakar[0].quantity, 20);
assert.equal(state.landSystem.finishedInventoryLots.jagung_bakar[0].unitCost, 2750);
assert.equal(state.dayLog.cogs, 0);
assert.equal(state.gold, 949900);
assert.equal(sandbox.sellFinishedCommodity("jagung_bakar", 2), true);
assert.equal(state.landSystem.finishedInventory.jagung_bakar, 18);
assert.equal(state.landSystem.finishedInventoryCost.jagung_bakar, 49500);
assert.equal(state.dayLog.cogs, 5500);
assert.equal(state.dayLog.gross, 20000);
assert.equal(state.ledger.length, 2);

// Finished-goods FIFO regression: aggregate cost must follow the actual lot removed.
state.gold = 1000000;
state.landSystem.finishedInventory = { jagung_bakar: 5 };
state.landSystem.finishedInventoryCost = { jagung_bakar: 1100 };
state.landSystem.finishedInventoryQuantityMeta = {
  jagung_bakar: {
    quantityUnit: "unconverted_simulation_market_units",
    quantityCalibrationStatus: "legacy_index_to_physical_unit_conversion_pending",
    quantityScaleStatus: "unconverted_legacy_simulation_index"
  }
};
state.landSystem.finishedInventoryLots = {
  jagung_bakar: [
    { id: "fg-cheap", commodityId: "jagung_bakar", quantity: 2, unitCost: 100, costValue: 200 },
    { id: "fg-expensive", commodityId: "jagung_bakar", quantity: 3, unitCost: 300, costValue: 900 }
  ]
};
state.dayLog = { gross: 0, expense: 0, businessPurchases: 0, cashOut: 0, shopping: 0, cogs: 0, cogsByAccount: {} };
state.ledger = [];
assert.equal(sandbox.sellFinishedCommodity("jagung_bakar", 2), true);
assert.equal(state.landSystem.finishedInventory.jagung_bakar, 3);
assert.equal(state.landSystem.finishedInventoryCost.jagung_bakar, 900);
assert.equal(state.landSystem.finishedInventoryLots.jagung_bakar.length, 1);
assert.equal(state.landSystem.finishedInventoryLots.jagung_bakar[0].id, "fg-expensive");
assert.equal(state.dayLog.cogs, 200);
assert.equal(state.dayLog.commoditySales[0].cogs, 200);

// Finished-goods lot consumer mutates FIFO lots and then reports failure.
// Transaction rollback must restore inventory, lot book, HPP journal, and cash.
const originalFinishedLotConsumer = sandbox.consumeFinishedGoodsLots;
const finishedBeforeConsumeFailure = JSON.stringify(state);
sandbox.consumeFinishedGoodsLots = (productId, plan) => {
  originalFinishedLotConsumer(productId, plan);
  return false;
};
assert.equal(sandbox.sellFinishedCommodity("jagung_bakar", 1), false);
assert.equal(JSON.stringify(state), finishedBeforeConsumeFailure, "failed finished-goods lot commit must roll back all transaction state");
sandbox.consumeFinishedGoodsLots = originalFinishedLotConsumer;

const jagungRouteBefore = JSON.stringify({
  gold: state.gold,
  qty: state.landSystem.finishedInventory.jagung_bakar,
  cost: state.landSystem.finishedInventoryCost.jagung_bakar,
  ledger: state.ledger.length
});
const validInputTier = sandbox.COMMODITY_ECONOMICS.jagung.processed.inputTier;
sandbox.COMMODITY_ECONOMICS.jagung.processed.inputTier = 4;
assert.equal(sandbox.processCommodity("jagung"), undefined);
assert.equal(JSON.stringify({
  gold: state.gold,
  qty: state.landSystem.finishedInventory.jagung_bakar,
  cost: state.landSystem.finishedInventoryCost.jagung_bakar,
  ledger: state.ledger.length
}), jagungRouteBefore);
sandbox.COMMODITY_ECONOMICS.jagung.processed.inputTier = validInputTier;

console.log("PASS: live commodity processing consumes weighted-average raw inventory, posts HPP once, charges conversion/distribution cash, and prevents execution without cash.");


test('processing runtime keeps recipe units as labels and records legacy quantity contract', () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'js', 'land.js'), 'utf8');
  assert.match(source, /quantityBasis:"legacy_transformation_output"/);
  assert.match(source, /quantityUnit:"unconverted_simulation_market_units"/);
  assert.match(source, /quantityCalibrationStatus:"legacy_index_to_physical_unit_conversion_pending"/);
  assert.match(source, /quantityScaleStatus:"unconverted_legacy_simulation_index"/);
  assert.match(source, /physicalConversionEnabled:false/);
});
