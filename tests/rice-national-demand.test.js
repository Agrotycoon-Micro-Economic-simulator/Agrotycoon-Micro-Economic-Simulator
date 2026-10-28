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
assert.equal(rice.perCapitaAnnualBapanas.value, 92.1);
assert.equal(rice.perCapitaAnnualBapanas.unit, "kg/person/year");
assert.equal(rice.populationDenominator.value, 284438800);
assert.equal(rice.populationDenominator.year, 2025);
assert.equal(rice.nationalAnnualConsumptionEstimateTon, null, "national balance need includes non-household demand and is not a household consumption estimate");
assert.equal(rice.nationalDemandProjection.householdNeedTon, 22527000);
assert.equal(rice.nationalDemandProjection.nonHouseholdNeedTon, 8448844);
assert.equal(rice.nationalDemandProjection.householdNeedTon + rice.nationalDemandProjection.nonHouseholdNeedTon, rice.nationalDemandProjection.totalNeedTon + 1, "source has a one-tonne discrepancy; preserve the original total");
assert.equal(rice.nationalBalanceProjection2025.totalAvailabilityTon, 40293371);
assert.equal(rice.nationalBalanceProjection2025.projectedBalanceTon, 9317528);
assert.equal(rice.nationalDemandProjection.status, "official_projection");
assert.equal(rice.status, "official_2025_balance_projection_plus_2024_observations");
assert.ok(rice.sources.bapanasConsumption2024.url.startsWith("https://data.badanpangan.go.id/"));
assert.ok(rice.sources.nationalFoodBalance2025.url.endsWith("Buletin_Konsumsi_Pangan_Smtr1-2025-Ok.pdf"));
assert.equal(rice.sources.nationalFoodBalance2025.qualityStatus, "official_projection");
assert.ok(rice.sources.perCapitaConsumption.url.startsWith("https://www.bps.go.id/"));
assert.ok(rice.sources.production.url.startsWith("https://www.bps.go.id/"));
assert.equal(rice.sources.perCapitaConsumption.qualityStatus, "official_statistic");
assert.equal(rice.sources.production.qualityStatus, "official_statistic");

console.log("PASS: rice baseline provenance, units, annualization and official 2025 demand-balance projection.");
