// Run with: node tests/accounting_ledger.test.js
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "js", "akuntansi.js"), "utf8");
const acc = { innerHTML: "" };
const S = {
  day: 2,
  gold: 4985000,
  stock: { biasa: 0, super: 0 },
  warung: { ice: 0, sugar: 0, cups: 0, fridge: false },
  trees: [],
  landSystem: { lands: [] },
  finance: { debt: 0, payablesPayroll: 0, loans: [] },
  ledger: [
    { day: 1, cat: "HIDUP", desc: "Beli Lauk tambahan (otomatis)", amt: -15000, detail: { item: "Lauk tambahan", amt: 15000 } }
  ],
  reports: [
    { day: 1, gross: 0, expense: 15000, net: -15000, cashIn: 0, cashOut: 15000, cashflow: -15000, weather: "panas", buyers: 0 }
  ]
};
const context = {
  document: { getElementById(id) { return id === "acc" ? acc : null; } },
  loadSaved() {},
  S,
  DATA: { matureDays: 1080, weather: { panas: { name: "Panas" } } },
  monthOf(day) { return Math.floor((day - 1) / 30) + 1; },
  stockQty() { return (S.stock.biasa || 0) + (S.stock.super || 0); },
  rp(n) { return "Rp " + Math.round(n).toLocaleString("id-ID"); }
};
vm.createContext(context);
vm.runInContext(source, context, { filename: "js/akuntansi.js" });

assert.match(acc.innerHTML, /Jurnal Transaksi/, "accounting page renders a transaction journal");
assert.match(acc.innerHTML, /HIDUP/, "household expense category is visible");
assert.match(acc.innerHTML, /Beli Lauk tambahan \(otomatis\)/, "household transaction description is visible");
assert.match(acc.innerHTML, /Rp -15\.000/, "household expense amount is visible");
assert.match(acc.innerHTML, /Lauk tambahan/, "transaction detail is visible");
assert.match(acc.innerHTML, /Ringkasan Harian/, "existing daily report remains rendered");

console.log("PASS: accounting journal renders household transactions, amounts, details, and daily summary.");
