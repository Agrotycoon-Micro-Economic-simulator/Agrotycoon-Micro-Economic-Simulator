// Run with: node tests/livestock-prices-2024.test.js
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const context = vm.createContext({ window: {} });
vm.runInContext(
  fs.readFileSync(path.join(__dirname, "..", "js", "real_economic_data.js"), "utf8"),
  context,
  { filename: "js/real_economic_data.js" }
);

const data = context.window.REAL_ECONOMIC_DATA.livestockPrices2024;
assert.ok(data, "official livestock price benchmark is registered");
assert.equal(data.referenceYear, 2024);
assert.equal(data.unit, "Rp/kg");
assert.equal(data.status, "official_statistic_primary_pdf_text_verified");
assert.equal(data.source.publisher, "Direktorat Jenderal Peternakan dan Kesehatan Hewan, Kementerian Pertanian");
assert.equal(data.source.title, "Statistik Peternakan dan Kesehatan Hewan 2025 / Livestock and Animal Health Statistics 2025");
assert.match(data.source.url, /ditjenpkh\.pertanian\.go\.id\/storage\/master\/file\/.*\.pdf$/);
assert.equal(data.source.qualityStatus, "official_ministry_pdf_table_text_verified_not_current_price");
assert.equal(data.source.tables.length, 6);

const expected = {
  liveCattleProducer: { value: 51625, table: "3A.1", page: 33, high: 63663, low: 40800 },
  liveBroilerProducer: { value: 22067, table: "3A.2", page: 33, high: 26173, low: 19944 },
  layerEggProducer: { value: 25539, table: "3A.3", page: 34, high: 28201, low: 23386 },
  beefConsumer: { value: 135290, table: "3B.1", page: 35, high: 162398, low: 99488 },
  broilerMeatConsumer: { value: 37277, table: "3B.2", page: 36, high: 49273, low: 26160 },
  layerEggConsumer: { value: 30275, table: "3B.3", page: 37, high: 37794, low: 25682 }
};

for (const [key, exp] of Object.entries(expected)) {
  const record = data.records[key];
  assert.ok(record, key + " exists");
  assert.equal(record.valueRpPerKg, exp.value, key + " preserves the published national average");
  assert.equal(record.table, exp.table, key + " preserves its source table");
  assert.equal(record.printedPage, exp.page, key + " preserves its printed page");
  assert.equal(record.regionalHigh.valueRpPerKg, exp.high, key + " preserves the published regional high");
  assert.equal(record.regionalLow.valueRpPerKg, exp.low, key + " preserves the published regional low");
  assert.ok(record.regionalHigh.valueRpPerKg >= record.valueRpPerKg, key + " regional high is not below national average");
  assert.ok(record.regionalLow.valueRpPerKg <= record.valueRpPerKg, key + " regional low is not above national average");
  assert.ok(["producer", "consumer"].includes(record.marketStage), key + " keeps market stage explicit");
}
assert.equal(data.records.liveCattleProducer.unit, "Rp/kg live weight");
assert.equal(data.records.liveBroilerProducer.unit, "Rp/kg live weight");
assert.equal(data.records.beefConsumer.unit, "Rp/kg");
assert.match(data.note, /not current quotes/i);
assert.match(data.note, /not.*Tier 1–4 recipes/i);
console.log("PASS: six 2024 livestock price series preserve official source, market stage, units, tables, national averages and regional extrema.");
