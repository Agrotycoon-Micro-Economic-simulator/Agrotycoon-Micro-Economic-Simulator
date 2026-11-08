const assert = require("node:assert/strict");
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
    cabai_merah: { id: "cabai_merah", name: "Cabai Merah" }
  },
  COMMODITY_ECONOMICS: {
    cabai_merah: {
      unit: "kg",
      tengkulakPrice: 25000,
      farmerPrice: 27810,
      processed: { name: "Sambal kemasan 250 g", inputKg: 0.25, price: 18000, otherCost: 2500 }
    }
  },
  AgroCommodityTransformation: transformation,
  AgroUnitEconomics: unitEconomics,
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
  spend: (cat, desc, amt, field) => {
    if (!Number.isFinite(amt) || amt < 0 || state.gold < amt) return false;
    state.gold -= amt;
    if (cat === "BELANJA") state.dayLog.businessPurchases += amt;
    state.dayLog.cashOut += amt;
    if (field) state.dayLog[field] = (state.dayLog[field] || 0) + amt;
    return true;
  },
  earn: (_cat, _desc, amt) => {
    state.gold += amt;
    state.dayLog.gross += amt;
  },
  businessCogsTotal: components => components.reduce((sum, x) => sum + x.amount, 0),
  recordBusinessCogs: (_desc, components) => {
    const total = components.reduce((sum, x) => sum + x.amount, 0);
    state.dayLog.cogs += total;
    state.dayLog.cogsByAccount = state.dayLog.cogsByAccount || {};
    components.forEach(x => {
      state.dayLog.cogsByAccount[x.account] = (state.dayLog.cogsByAccount[x.account] || 0) + x.amount;
    });
    return total;
  },
  COMMODITIES: [],
  LAND_MARKET_PROFILES: [],
  LAND_TIERS: [],
  LAND_USE_PROFILES: [],
  REAL_ECONOMIC_DATA: { tollSegments: [] }
};

vm.runInNewContext(landSource, sandbox, { filename: "js/land.js" });
assert.equal(typeof sandbox.processCommodity, "function");

sandbox.processCommodity("cabai_merah");

assert.equal(state.landSystem.inventory.cabai_merah, 0);
assert.equal(state.landSystem.inventoryCost.cabai_merah, 0);
assert.equal(state.landSystem.finishedInventory.sambal_cabai_250g, 10, "finished goods must be held in inventory, not auto-sold");
assert.equal(state.landSystem.finishedInventoryCost.sambal_cabai_250g, 105000, "finished goods carrying value must include raw input plus conversion");
assert.equal(state.gold, 899900, "cash must reflect conversion purchase and distribution only");
assert.equal(state.dayLog.cogs, 0, "processing alone must not recognize COGS before finished goods are sold");
assert.equal(state.dayLog.businessPurchases, 100000);
assert.equal(state.dayLog.cashOut, 100100);
assert.equal(state.dayLog.gross, 0);

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
state.landSystem.finishedInventory.sambal_cabai_250g = 10;
state.landSystem.finishedInventoryCost.sambal_cabai_250g = 105000;
const saleLedgerBefore = state.ledger.length;
const saleOk = sandbox.sellFinishedCommodity("sambal_cabai_250g", 2);
assert.equal(saleOk, true);
assert.equal(state.landSystem.finishedInventory.sambal_cabai_250g, 8);
assert.equal(state.landSystem.finishedInventoryCost.sambal_cabai_250g, 84000);
assert.equal(state.gold, 935900);
assert.equal(state.dayLog.cogs, 21000);
assert.equal(state.dayLog.gross, 36000);
assert.equal(state.dayLog.cogsByAccount["Persediaan Produk Jadi"], 21000);
assert.equal(state.ledger.length, saleLedgerBefore + 2);

const beforeInvalidPrice = JSON.stringify({gold:state.gold,qty:state.landSystem.finishedInventory.sambal_cabai_250g,cost:state.landSystem.finishedInventoryCost.sambal_cabai_250g,cogs:state.dayLog.cogs,gross:state.dayLog.gross,ledger:state.ledger.length});
sandbox.COMMODITY_ECONOMICS.cabai_merah.processed.price = NaN;
assert.equal(sandbox.sellFinishedCommodity("sambal_cabai_250g", 1), false);
assert.equal(JSON.stringify({gold:state.gold,qty:state.landSystem.finishedInventory.sambal_cabai_250g,cost:state.landSystem.finishedInventoryCost.sambal_cabai_250g,cogs:state.dayLog.cogs,gross:state.dayLog.gross,ledger:state.ledger.length}), beforeInvalidPrice);

sandbox.COMMODITY_ECONOMICS.cabai_merah.processed.price = 18000;
const beforeBadQty = JSON.stringify({gold:state.gold,qty:state.landSystem.finishedInventory.sambal_cabai_250g,cost:state.landSystem.finishedInventoryCost.sambal_cabai_250g,cogs:state.dayLog.cogs,gross:state.dayLog.gross,ledger:state.ledger.length});
assert.equal(sandbox.sellFinishedCommodity("sambal_cabai_250g", 1.5), false);
assert.equal(JSON.stringify({gold:state.gold,qty:state.landSystem.finishedInventory.sambal_cabai_250g,cost:state.landSystem.finishedInventoryCost.sambal_cabai_250g,cogs:state.dayLog.cogs,gross:state.dayLog.gross,ledger:state.ledger.length}), beforeBadQty);

console.log("PASS: live commodity processing consumes weighted-average raw inventory, posts HPP once, charges conversion/distribution cash, and prevents execution without cash.");
