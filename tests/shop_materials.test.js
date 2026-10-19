// Run with: node tests/shop_materials.test.js
// Focused regression tests for the stock recommendation calculation and its UI explanation.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "js", "economy.js"), "utf8");
const start = source.indexOf("function materialPlan(){");
const end = source.indexOf("function shopMaterials(){", start);
assert.notEqual(start, -1, "materialPlan() exists");
assert.notEqual(end, -1, "shopMaterials() follows materialPlan()");
const functionSource = source.slice(start, end).trim();

function planFor({ demand, cuaca = "panas", ice = 0, sugar = 0, cups = 0 }) {
  const context = {
    S: { cuaca, warung: { ice, sugar, cups } },
    DATA: { weather: { panas: { name: "Panas" }, berawan: { name: "Berawan" } } },
    demandToday: () => demand,
    Math,
    Number
  };
  vm.runInNewContext(functionSource + "\nthis.materialPlan = materialPlan;", context);
  return JSON.parse(JSON.stringify(context.materialPlan()));
}

{
  const plan = planFor({ demand: 45, cuaca: "berawan" });
  assert.equal(plan.target, 68, "target is ceil(150% of daily demand)");
  assert.deepEqual(plan.need, { ice: 2, sugar: 2, cups: 4 },
    "full packages must cover the target for each consumable");
}
{
  const plan = planFor({ demand: 45, ice: 90, sugar: 90, cups: 90 });
  assert.deepEqual(plan.need, { ice: 0, sugar: 0, cups: 0 },
    "no additional packages are recommended when each stock exceeds target");
}
{
  const plan = planFor({ demand: 45, ice: 40, sugar: 50, cups: 60 });
  assert.deepEqual(plan.need, { ice: 1, sugar: 1, cups: 1 },
    "recommendations use the remaining deficit and each package size");
}
assert.ok(source.includes("Pembelian dibulatkan ke paket utuh; stok akhir dapat sedikit melampaui target 150% karena ukuran paket."),
  "UI must disclose package-rounding overshoot instead of claiming packages are blocked");
assert.ok(!source.includes("Item juga dikunci ke 0 bila satu paket utuh akan melampaui batas stok 150% target."),
  "obsolete and inaccurate UI claim must be removed");

console.log("PASS: smart-shop target, stock deficit, package rounding, and explanatory copy.");
