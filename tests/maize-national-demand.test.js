// Run with: node tests/maize-national-demand.test.js
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const window = {};
const context = { window };
vm.createContext(context);
vm.runInContext(
  fs.readFileSync(path.join(__dirname, "..", "js", "real_economic_data.js"), "utf8"),
  context,
  { filename: "js/real_economic_data.js" }
);

const production2025 = window.REAL_ECONOMIC_DATA.maizeProduction2025;
assert.ok(production2025, "final official maize production for 2025 is registered");
assert.equal(production2025.referenceYear, 2025);
assert.equal(production2025.harvestedAreaHa, 2710000);
assert.equal(production2025.productionAt14MoistureTon, 16160000);
assert.equal(production2025.moisturePct, 14);
assert.match(production2025.source.url, /bps\\.go\\.id/);
assert.equal(production2025.source.qualityStatus, "official_statistic_final");
assert.equal(window.REAL_ECONOMIC_DATA.maizeNationalBalanceEstimate2025, null, "do not infer a national balance without stocks, trade, losses and aligned scope");

const data = window.REAL_ECONOMIC_DATA.maizeNationalDemand;

const production = window.REAL_ECONOMIC_DATA.maizeProduction2024;
assert.ok(production, "official maize production series exists");
assert.equal(production.harvestedAreaHa, 2550000);
assert.equal(production.productionAt28MoistureTon, 20480000);
assert.equal(production.productionAt14MoistureTon, 15140000);
assert.match(production.source.url, /bps\.go\.id/);
assert.equal(production.source.qualityStatus, "official_statistic");
assert.equal(production.derivedAudit.simpleMoistureOnlyEstimateAt14MoistureTon, 17146047);
assert.notEqual(
  production.derivedAudit.simpleMoistureOnlyEstimateAt14MoistureTon,
  production.productionAt14MoistureTon,
  "simple moisture-only conversion must not overwrite BPS's published 14%-moisture estimate"
);
assert.match(production.note, /same BPS 2024 publication/i);

assert.ok(data, "national maize demand registry exists");
assert.equal(data.directFoodConsumption2024.value, 1.5);
assert.equal(data.directFoodConsumption2024.unit, "kg/person/year");
assert.equal(data.directFoodConsumption2024.status, "official_statistic_provisional");
assert.match(data.sources.bapanasDirectConsumption2024.url, /data\.badanpangan\.go\.id/);
assert.equal(data.nationalDemandProjection2025.totalNeedTon, 14720000);
assert.equal(data.nationalDemandProjection2025.feedNeedTon, 13603000);
assert.equal(data.nationalDemandProjection2025.otherUsesNeedTon, 1117000);
assert.equal(
  data.nationalDemandProjection2025.feedNeedTon + data.nationalDemandProjection2025.otherUsesNeedTon,
  data.nationalDemandProjection2025.totalNeedTon,
  "rounded national demand components reconcile to the rounded total"
);
assert.equal(data.nationalDemandProjection2025.status, "official_projection_rounded");
assert.equal(data.feedIndustryDemandProjection2025.value, 8844096);
assert.equal(data.feedIndustryDemandProjection2025.status, "official_projection");
assert.match(data.sources.feedIndustryDemand2025.url, /ditjenpkh\.pertanian\.go\.id/);
assert.equal(data.alternativeFeedIndustryProjection2025.value, 8250000);
assert.equal(data.feedIndustryProjectionReconciliationStatus, "unresolved_source_scope_or_vintage_difference");
assert.equal(data.directHouseholdConsumptionTonnage, null, "do not infer national household tonnage without an explicitly aligned denominator");
assert.match(data.nationalDemandProjection2025.note, /not realized final data/i);
assert.match(data.feedIndustryDemandProjection2025.note, /do not confuse with or add/i);

console.log("PASS: maize direct-consumption data and national/feed demand projections preserve source scope, units, rounding and non-comparable denominators.");
