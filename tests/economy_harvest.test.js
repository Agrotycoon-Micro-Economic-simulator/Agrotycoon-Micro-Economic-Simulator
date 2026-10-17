const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const sourceRoot = path.join(__dirname, "..");
const context = {
  console: { log() {}, error() {} },
  localStorage: { getItem() { return null; }, setItem() {} },
  DATA: {
    matureDays: 0,
    cycleDays: 1,
    yieldBiasa: 2,
    yieldSuper: 3,
    laborPerFruit: 10,
    levels: { 1: { xpReq: 0 }, 2: { xpReq: 1000 } }
  },
  msg(message) { context.messages.push(message); },
  say() {},
  save() {},
  render() {},
  checkAllAchievements() {},
  messages: []
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(sourceRoot, "js/state.js"), "utf8"), context, { filename: "js/state.js" });
vm.runInContext(fs.readFileSync(path.join(sourceRoot, "js/economy.js"), "utf8"), context, { filename: "js/economy.js" });

function resetWithCash(gold) {
  vm.runInContext(`
    S = defaultState();
    S.day = 5;
    S.gold = ${gold};
    S.trees = [{ slot: 0, type: "biasa", plantedDay: 0, mature: true, lastHarvest: 0 }];
    S.stock = { biasa: 0, super: 0 };
    S.harvestDay = -99;
  `, context);
  context.messages.length = 0;
}

resetWithCash(19);
context.harvest();
let result = vm.runInContext(`({
  gold: S.gold,
  stock: S.stock.biasa + S.stock.super,
  lastHarvest: S.trees[0].lastHarvest,
  ledgerLength: S.ledger.length,
  expense: S.dayLog.expense,
  cashOut: S.dayLog.cashOut
})`, context);
assert.deepEqual(JSON.parse(JSON.stringify(result)), {
  gold: 19, stock: 0, lastHarvest: 0, ledgerLength: 0, expense: 0, cashOut: 0
}, "insufficient cash must not mutate stock, harvest dates, or accounting");
assert.match(context.messages.join(" "), /Uang tidak cukup/, "player receives an explicit cash-shortage message");

resetWithCash(20);
context.harvest();
result = vm.runInContext(`({
  gold: S.gold,
  stock: S.stock.biasa + S.stock.super,
  lastHarvest: S.trees[0].lastHarvest,
  ledgerLength: S.ledger.length,
  expense: S.dayLog.expense,
  cashOut: S.dayLog.cashOut,
  labor: S.dayLog.labor
})`, context);
assert.deepEqual(JSON.parse(JSON.stringify(result)), {
  gold: 0, stock: 2, lastHarvest: 5, ledgerLength: 1, expense: 20, cashOut: 20, labor: 20
}, "valid harvest deducts labor and adds harvested stock exactly once");

resetWithCash(100);
context.DATA.yieldBiasa = 0;
context.harvest();
result = vm.runInContext(`({ gold: S.gold, stock: S.stock.biasa + S.stock.super, lastHarvest: S.trees[0].lastHarvest, ledgerLength: S.ledger.length })`, context);
assert.deepEqual(JSON.parse(JSON.stringify(result)), { gold: 100, stock: 0, lastHarvest: 0, ledgerLength: 0 },
  "invalid/zero yield must not consume a harvest cycle");

console.log("PASS: harvest validates yield and labor affordability before changing trees, inventory, cash, or ledger.");
