// Run with: node tests/market_chain_contract.test.js
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const window = {};
const source = fs.readFileSync(path.join(__dirname, "..", "js", "market_chain.js"), "utf8");
vm.runInNewContext(source, { window });
const rows = window.MARKET_CHAIN_DATA.rows;
const coconut = rows.find(row => row.id === "kelapa");

assert.ok(coconut, "coconut market chain exists");
assert.equal(coconut.producer.value, 3400, "owner field price farmer-to-collector remains Rp3,400");
assert.equal(coconut.producer.type, "owner_verified_field_price", "field price is not mislabeled as a national observation");
assert.equal(coconut.middleman.value, 5000, "existing game sourcing parameter is preserved");
assert.equal(coconut.middleman.type, "game_parameter", "game parameter is not misrepresented as sourced data");
assert.equal(coconut.processorPurchase.value, null, "collector-to-es-kelapa/santan input price remains unknown until verified");
assert.equal(coconut.direct.value, 13000, "owner direct-to-customer whole-coconut price remains Rp13,000");
assert.equal(coconut.direct.type, "owner_verified_field_price");
assert.equal(coconut.retailConsumer.value, null, "household final-consumer price is a separate market stage");
assert.match(window.MARKET_CHAIN_DATA.snapshotNote, /buyer\/seller transaction/);
assert.match(window.MARKET_CHAIN_DATA.missingDataPolicy, /cannot be substituted for collector-to-processor prices/);
const latestCorn = window.MARKET_CHAIN_DATA.officialSnapshots.find(x => x.commodityId === "jagung");
const latestChili = window.MARKET_CHAIN_DATA.officialSnapshots.find(x => x.commodityId === "cabai_merah");
assert.equal(latestCorn.value, 5810);
assert.equal(latestCorn.period, "2026-01");
assert.equal(latestCorn.stage, "producer");
assert.equal(latestChili.value, 24578);
assert.equal(latestChili.period, "2026-01");
assert.equal(latestChili.stage, "producer");
const historicalChiliWholesale = window.MARKET_CHAIN_DATA.officialSnapshots.find(x => x.commodityId === "cabai_merah" && x.stage === "wholesale");
const historicalCornWholesale = window.MARKET_CHAIN_DATA.officialSnapshots.find(x => x.commodityId === "jagung" && x.stage === "wholesale");
assert.equal(historicalChiliWholesale.value, 23900, "Bapanas October 2024 wholesale chili observation is retained");
assert.equal(historicalChiliWholesale.period, "2024-10");
assert.equal(historicalChiliWholesale.marketChannel, "pedagang_grosir");
assert.equal(historicalChiliWholesale.status, "official_historical_observation");
assert.equal(historicalCornWholesale.value, 5850, "Bapanas October 2024 corn panel value is retained without broadening its channel");
assert.equal(historicalCornWholesale.period, "2024-10");
assert.equal(historicalCornWholesale.sourceLabel, "Jagung Tk Peternak");
assert.equal(historicalCornWholesale.marketChannel, "jagung_tingkat_peternak");
assert.equal(historicalCornWholesale.status, "official_historical_observation");
const chiliWholesaleCoverage = window.MARKET_CHAIN_DATA.officialCoverage.find(x => x.commodityId === "cabai_merah");
const cornWholesaleCoverage = window.MARKET_CHAIN_DATA.officialCoverage.find(x => x.commodityId === "jagung");
assert.equal(chiliWholesaleCoverage.stage, "wholesale");
assert.equal(chiliWholesaleCoverage.status, "official_panel_coverage");
assert.equal(chiliWholesaleCoverage.observationValue, null, "coverage metadata is not a price observation");
assert.match(chiliWholesaleCoverage.scope, /ibukota provinsi/);
assert.equal(cornWholesaleCoverage.stage, "wholesale");
assert.equal(cornWholesaleCoverage.observationValue, null, "special corn panel coverage is not a price observation");
assert.match(cornWholesaleCoverage.scope, /Jawa Tengah dan Jawa Timur/);
assert.match(cornWholesaleCoverage.note, /bukan harga nasional/);
for (const row of rows) {
  assert.equal(row.distributionMarket.value, null, "unverified Tier 2 distributor price must remain null");
  assert.equal(row.distributionMarket.type, "missing");
  assert.match(row.distributionMarket.note, /Jangan isi|bukan harga/);
}

console.log("PASS: owner field prices are immutable; processor purchase and household consumer stages remain separate.");
