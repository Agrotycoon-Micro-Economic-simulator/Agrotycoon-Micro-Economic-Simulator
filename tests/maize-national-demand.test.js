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

const data = window.REAL_ECONOMIC_DATA.maizeNationalDemand;
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
