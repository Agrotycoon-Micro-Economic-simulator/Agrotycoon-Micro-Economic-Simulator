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
assert.equal(state.gold, 1299900, "cash must reflect conversion purchase, sale proceeds, and distribution");
assert.equal(state.dayLog.cogs, 105000, "HPP must include raw inventory cost plus conversion cost");
assert.equal(state.dayLog.cogsByAccount["Persediaan Cabai Merah"], 5000);
assert.equal(state.dayLog.cogsByAccount["Bahan Tambahan Proses"], 100000);
assert.equal(state.dayLog.businessPurchases, 100000);
assert.equal(state.dayLog.cashOut, 100100);
assert.equal(state.dayLog.gross, 400000);

state.gold = 50000;
state.landSystem.inventory.cabai_merah = 10;
state.landSystem.inventoryCost.cabai_merah = 5000;
const beforeInsufficient = JSON.stringify({
  gold: state.gold,
  inventory: state.landSystem.inventory.cabai_merah,
  inventoryCost: state.landSystem.inventoryCost.cabai_merah,
  cogs: state.dayLog.cogs,
  gross: state.dayLog.gross
});
sandbox.processCommodity("cabai_merah");
assert.equal(JSON.stringify({
  gold: state.gold,
  inventory: state.landSystem.inventory.cabai_merah,
  inventoryCost: state.landSystem.inventoryCost.cabai_merah,
  cogs: state.dayLog.cogs,
  gross: state.dayLog.gross
}), beforeInsufficient, "insufficient cash must not mutate processing state");

console.log("PASS: live commodity processing consumes weighted-average raw inventory, posts HPP once, charges conversion/distribution cash, and prevents execution without cash.");
