// Run with: node tests/real_economic_data.test.js
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "js", "real_economic_data.js"), "utf8");
const window = {};
vm.runInNewContext(source, { window, Number, String, Object, Array, Math });
const data = window.REAL_ECONOMIC_DATA;
assert.ok(data, "economic data registry initializes");
assert.equal(data.coconutPrices.length, 46, "23 annual years x producer/consumer observations");
assert.equal(data.sources.coconutOutlook.period, "2002-2024");
assert.equal(data.sources.coconutOutlook.url, "https://satudata.pertanian.go.id/assets/docs/publikasi/OUTLOOK_KELAPA_2025_sign.pdf");
const producer2024 = data.coconutPrices.find(row => row.period === "2024" && row.marketStage === "producer");
const consumer2024 = data.coconutPrices.find(row => row.period === "2024" && row.marketStage === "consumer");
assert.equal(producer2024.value, 3422);
assert.equal(consumer2024.value, 6061);
assert.equal(producer2024.unit, "Rp/butir");
assert.equal(consumer2024.unit, "Rp/butir");
assert.equal(producer2024.geographyName, "Indonesia");
assert.equal(producer2024.source, "coconutOutlook");
assert.notEqual(producer2024.marketStage, consumer2024.marketStage, "producer and consumer prices remain separate series");
assert.equal(new Set(data.coconutPrices.map(row => row.period + ":" + row.marketStage)).size, 46, "no duplicate year/stage keys");
assert.ok(data.coconutPrices.every(row => row.qualityStatus === "verified" && row.frequency === "annual"));
console.log("PASS: official coconut price history, source provenance, units, coverage and market-stage separation.");
