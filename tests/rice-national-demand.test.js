// Rice baseline data contract; run with: node tests/rice-national-demand.test.js
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "js", "real_economic_data.js"), "utf8");
const window = {};
vm.runInNewContext(source, { window, Number, String, Object, Array, Math });
const rice = window.REAL_ECONOMIC_DATA.riceNationalFoodDemand;

assert.ok(rice, "rice national-demand dataset is registered");
assert.equal(rice.geography, "Indonesia");
assert.equal(rice.referenceYear, 2024);
assert.equal(rice.observed.weeklyPerCapitaKg, 1.521);
assert.equal(rice.observed.unit, "kg/person/week");
assert.equal(rice.derived.annualPerCapitaKg, 79.092);
assert.equal(1.521 * 52, rice.derived.annualPerCapitaKg, "annualized value must match its stated formula");
assert.equal(rice.derived.status, "derived_from_official_statistic");
assert.equal(rice.production.harvestedAreaHa, 10050000);
assert.equal(rice.production.paddyProductionGkgTon, 53140000);
assert.equal(rice.production.riceProductionForFoodTon, 30620000);
assert.equal(rice.nationalAnnualConsumptionEstimateTon, null, "do not invent a national total without a compatible population denominator");
assert.equal(rice.populationDenominator, null);
assert.equal(rice.status, "partial_official_data_population_and_full_demand_definition_required");
assert.ok(rice.sources.perCapitaConsumption.url.startsWith("https://www.bps.go.id/"));
assert.ok(rice.sources.production.url.startsWith("https://www.bps.go.id/"));
assert.equal(rice.sources.perCapitaConsumption.qualityStatus, "official_statistic");
assert.equal(rice.sources.production.qualityStatus, "official_statistic");

console.log("PASS: rice baseline provenance, units, annualization and null national-demand guard.");
