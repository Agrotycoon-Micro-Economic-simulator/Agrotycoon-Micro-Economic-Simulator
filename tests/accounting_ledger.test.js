// Run with: node tests/accounting_ledger.test.js
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "js", "akuntansi.js"), "utf8");
const acc = { innerHTML: "" };
const S = {
  day: 2,
  gold: 1288000,
  stock: { biasa: 0, super: 0 },
  warung: { ice: 0, sugar: 0, cups: 0, fridge: false },
  trees: [],
  landSystem: { lands: [] },
  finance: { debt: 0, payablesPayroll: 0, loans: [] },
  ledger: [
    { day: 1, cat: "PENJUALAN", desc: "Penjualan tunai", amt: 400000, accounting: {
      classification: "business_revenue", debitAccount: "Kas", creditAccount: "Penjualan", debit: 400000, credit: 400000, basis: "cash"
    } },
    { day: 1, cat: "BELANJA", desc: "Belanja bahan (manual)", amt: -50000, accounting: {
      classification: "business_purchase", debitAccount: "Pembelian Bahan Baku", creditAccount: "Kas", debit: 50000, credit: 50000, basis: "cash"
    } },
    { day: 1, cat: "HIDUP", desc: "Beli Lauk tambahan (otomatis)", amt: -62000, detail: { item: "Lauk tambahan", amt: 62000 }, accounting: {
      classification: "household_kitchen", debitAccount: "Beban Dapur", creditAccount: "Kas", debit: 62000, credit: 62000, basis: "cash"
    } }
  ],
  reports: [
    { day: 1, gross: 400000, expense: 112000, net: 288000, cashIn: 400000, cashOut: 112000, cashflow: 288000, weather: "panas", buyers: 0 }
  ]
};
const context = {
  document: { getElementById(id) { return id === "acc" ? acc : null; } },
  loadSaved() {},
  S,
  DATA: {
    matureDays: 1080,
    weather: { panas: { name: "Panas" } },
    living: { lauk: { name: "Lauk tambahan" } },
    shop: {
      iceKarung: { price: 20000, portions: 40 },
      sugarBloc: { price: 20000, portions: 50 },
      cupPack: { price: 15000, pcs: 50 }
    }
  },
  monthOf(day) { return Math.floor((day - 1) / 30) + 1; },
  stockQty() { return (S.stock.biasa || 0) + (S.stock.super || 0); },
  rp(n) { return "Rp " + Math.round(n).toLocaleString("id-ID"); }
};
vm.createContext(context);
vm.runInContext(source, context, { filename: "js/akuntansi.js" });

assert.match(acc.innerHTML, /Jurnal Umum/, "accounting page renders a double-entry journal");
assert.match(acc.innerHTML, /Akun debit/, "journal exposes debit account and amount");
assert.match(acc.innerHTML, /Akun kredit/, "journal exposes credit account and amount");
assert.match(acc.innerHTML, /Penjualan tunai/, "sales transaction is visible");
assert.match(acc.innerHTML, /Pembelian Bahan Baku/, "raw-material purchase is posted to its own debit account");
assert.match(acc.innerHTML, /Beban Dapur/, "household food expense is separated from business expenses");
assert.match(acc.innerHTML, /Rp 400\.000/, "business result excludes kitchen spending and unconsumed inventory purchases");
assert.match(acc.innerHTML, /Rp 62\.000/, "kitchen expense is shown separately");
assert.match(acc.innerHTML, /Rp 1\.288\.000/, "closing cash reconciles to the actual cash balance");
assert.match(acc.innerHTML, /Rp 1\.000\.000/, "opening cash reconciles from cash movements");
assert.match(acc.innerHTML, /Ringkasan Harian/, "existing daily report remains rendered");

for (const entry of S.ledger) {
  assert.equal(entry.accounting.debit, entry.accounting.credit, "each cash transaction has balanced debit and credit");
}
console.log("PASS: sales, raw-material purchases, kitchen expense, balanced postings, and cash reconciliation render correctly.");
