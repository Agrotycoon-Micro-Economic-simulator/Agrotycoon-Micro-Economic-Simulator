// Run with: node tests/es_kelapa_benchmark.test.js
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "js", "data.js"), "utf8");
const window = {};
vm.runInNewContext(source + "\nwindow.__benchmark = { DATA, LEARN };", { window });
const { DATA, LEARN } = window.__benchmark;

assert.equal(DATA.wholePrice, 13000, "preserve owner's direct whole-coconut sale price");
assert.equal(DATA.es.price, 5000, "preserve owner's es-kelapa sale price");
assert.equal(DATA.es.glassesPerCoconut, 4, "preserve four glasses per coconut");
assert.equal(DATA.shop.iceKarung.price / DATA.shop.iceKarung.portions, 500, "ice cost per glass");
assert.equal(DATA.shop.sugarBloc.price / DATA.shop.sugarBloc.portions, 400, "syrup batch cost per glass");
assert.equal(DATA.shop.sugarBloc.unit, "batch", "syrup is modeled as a prepared batch, not a block count");
assert.ok(DATA.shop.sugarBloc.name.includes("Tupperware") && DATA.shop.sugarBloc.name.includes("1 L"), "syrup batch matches owner's approximate 1 L container");
assert.equal(DATA.shop.cupPack.price, 15000, "cup price aligns with existing 50-piece starter pack");
assert.equal(DATA.shop.cupPack.pcs, 50, "cup pack count");
assert.equal(DATA.shop.cupPack.price / DATA.shop.cupPack.pcs, 300, "cup cost per glass");

const nonCoconutConsumables =
  DATA.shop.iceKarung.price / DATA.shop.iceKarung.portions +
  DATA.shop.sugarBloc.price / DATA.shop.sugarBloc.portions +
  DATA.shop.cupPack.price / DATA.shop.cupPack.pcs;
assert.equal(nonCoconutConsumables, 1200, "corrected non-coconut consumable subtotal");

const revenueFromFourGlasses = DATA.es.price * DATA.es.glassesPerCoconut;
const wholeFruitRevenue = DATA.wholePrice;
const consumablesForFourGlasses = nonCoconutConsumables * DATA.es.glassesPerCoconut;
assert.equal(revenueFromFourGlasses, 20000);
assert.equal(wholeFruitRevenue, 13000);
assert.equal(revenueFromFourGlasses - wholeFruitRevenue, 7000, "processing uplift before stand consumables");
assert.equal(revenueFromFourGlasses - wholeFruitRevenue - consumablesForFourGlasses, 2200,
  "processing advantage after listed consumables, before labor/water/fuel/waste/other costs");

assert.ok(LEARN.some(line => line.includes("Rp1.200/gelas") && line.includes("belum termasuk kelapa")),
  "lesson must state the corrected subtotal and clearly exclude coconut and omitted costs");
assert.ok(!LEARN.some(line => /susu|milk/i.test(line)), "lesson must not add milk to the owner's recipe");
assert.ok(!Object.keys(DATA.shop).some(key => /milk|susu/i.test(key)), "no milk is added to the owner's recipe");

console.log("PASS: owner es-kelapa prices preserved; cup cost corrected; non-coconut subtotal and processing comparison reconciled.");
