// Run with: node tests/double_entry_transactions.test.js
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "js", "economy.js"), "utf8");
const S = {
  day: 1,
  gold: 1000000,
  ledger: [],
  dayLog: { expense: 0, cashOut: 0, gross: 0, cashIn: 0, shopping: 0, living: 0 }
};
const context = {
  S,
  DATA: { living: { lauk: { name: "Lauk tambahan" } } },
  ledger(cat, desc, amt, detail, accounting) {
    S.ledger.push({ day: S.day, cat, desc, amt, detail: detail || null, accounting: accounting || null });
  },
  gainXP() {},
  checkAllAchievements() {}
};
vm.createContext(context);
vm.runInContext(source, context, { filename: "js/economy.js" });

context.earn("PENJUALAN", "Penjualan tunai", 400000);
context.spend("BELANJA", "Belanja bahan (manual)", 50000, "shopping");
context.spend("HIDUP", "Beli Lauk tambahan (otomatis)", 62000, "living");

assert.equal(S.gold, 1288000, "cash balance reflects sales less business and household purchases");
assert.equal(S.dayLog.cashIn, 400000, "sales are recorded as cash inflow");
assert.equal(S.dayLog.cashOut, 112000, "both purchases are recorded as cash outflow");
assert.equal(S.ledger.length, 3, "each transaction creates one ledger row");
assert.deepEqual(
  JSON.parse(JSON.stringify(S.ledger.map(row => ({
    classification: row.accounting.classification,
    debitAccount: row.accounting.debitAccount,
    creditAccount: row.accounting.creditAccount,
    debit: row.accounting.debit,
    credit: row.accounting.credit
  })))),
  [
    { classification: "business_revenue", debitAccount: "Kas", creditAccount: "Penjualan", debit: 400000, credit: 400000 },
    { classification: "business_purchase", debitAccount: "Pembelian Bahan Baku", creditAccount: "Kas", debit: 50000, credit: 50000 },
    { classification: "household_kitchen", debitAccount: "Beban Dapur", creditAccount: "Kas", debit: 62000, credit: 62000 }
  ],
  "each transaction has the expected debit/credit accounts and equal amounts"
);
console.log("PASS: sales, raw-material purchases, and kitchen purchases post balanced entries and reconcile cash.");
