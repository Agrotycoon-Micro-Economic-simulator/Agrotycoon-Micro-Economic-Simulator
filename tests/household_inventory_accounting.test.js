// Run with: node tests/household_inventory_accounting.test.js
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const S = {
  day: 1,
  gold: 1000000,
  ledger: [],
  livingStock: { rice: 1, egg: 0, oil: 0, mie: 0, tempe: 0, sayur: 0, lauk: 0 },
  livingUseDays: { rice: 0, egg: 0, oil: 0, mie: 0, tempe: 0, sayur: 0, lauk: 0 },
  dayLog: { expense: 0, cashOut: 0, cashIn: 0, gross: 0, living: 0 }
};
const DATA = {
  living: {
    rice: { name: "Beras 5 liter", price: 65000, period: 1 },
    egg: { name: "Telur 1 kg", price: 28000, period: 5 },
    oil: { name: "Minyak goreng 2 liter", price: 32000, period: 30 },
    mie: { name: "Mie instan 5 bungkus", price: 15000, period: 3 },
    tempe: { name: "Tempe 2 potong", price: 8000, period: 2 },
    sayur: { name: "Sayur harian", price: 7000, period: 1 },
    lauk: { name: "Lauk tambahan", price: 15000, period: 2 }
  }
};
const context = {
  S, DATA,
  ledger(cat, desc, amt, detail, accounting) {
    S.ledger.push({ day: S.day, cat, desc, amt, detail: detail || null, accounting: accounting || null });
  },
  gainXP() {},
  checkAllAchievements() {},
  el() { return null; },
  save() {},
  render() {},
  console
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "js", "economy.js"), "utf8"), context, { filename: "js/economy.js" });
vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "js", "day.js"), "utf8"), context, { filename: "js/day.js" });

context.buyLivingItem("rice");
assert.equal(S.gold, 935000, "purchase reduces cash");
assert.equal(S.dayLog.cashOut, 65000, "purchase records cash outflow");
assert.equal(S.dayLog.expense, 0, "inventory purchase is not expensed immediately");
assert.equal(S.livingStock.rice, 1, "purchase adds one package to household stock");
assert.equal(S.ledger[0].accounting.classification, "household_inventory_purchase");
assert.equal(S.ledger[0].accounting.debitAccount, "Persediaan Rumah Tangga");
assert.equal(S.ledger[0].accounting.creditAccount, "Kas");
assert.equal(S.ledger[0].accounting.debit, S.ledger[0].accounting.credit);

const consumed = context.consumeLivingStockForDay();
assert.deepEqual(Array.from(consumed), ["rice"], "one rice package is consumed after its configured period");
assert.equal(S.livingStock.rice, 0, "consumption reduces the purchased package stock once");
context.recordLivingStockConsumption(consumed);
assert.equal(S.dayLog.expense, 65000, "consumption recognizes kitchen expense");
assert.equal(S.dayLog.cashOut, 65000, "consumption does not create a second cash outflow");
assert.equal(S.ledger[1].accounting.classification, "household_kitchen");
assert.equal(S.ledger[1].accounting.debitAccount, "Beban Dapur");
assert.equal(S.ledger[1].accounting.creditAccount, "Persediaan Rumah Tangga");
assert.equal(S.ledger[1].accounting.basis, "noncash");
assert.equal(S.ledger[1].accounting.debit, S.ledger[1].accounting.credit);
assert.equal(S.gold, 935000, "consumption leaves cash unchanged");

console.log("PASS: household food purchases capitalize inventory; consumption posts kitchen expense without double-counting cash.");
