// Run with: node tests/utp-livestock-benchmarks.test.js
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const window = {};
const context = { window };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "js", "real_economic_data.js"), "utf8"), context, { filename: "js/real_economic_data.js" });

const dataset = window.REAL_ECONOMIC_DATA.livestockBenchmarksUtp2024;
assert.ok(dataset, "research-only BPS UTP livestock benchmarks are registered");
assert.equal(dataset.unitType, "UTP");
assert.equal(dataset.referencePeriod, "2023-06-01/2024-05-31");
assert.equal(dataset.source.title, "Peternakan Dalam Angka 2025");
assert.equal(dataset.source.releaseDate, "2026-01-09");
assert.match(dataset.source.url, /bps\.go\.id/);
assert.match(dataset.source.mirrorUrl, /scribd\.com/);
assert.equal(dataset.source.qualityStatus, "official_catalog_confirmed_secondary_table_transcription_not_primary_pdf_verified");
assert.equal(dataset.status, "research_reference_only");
assert.equal(dataset.visualVerificationStatus, "official_pdf_table_images_not_yet_verified");

const beef = dataset.records.beefCattlePerHead;
assert.equal(beef.table, "Table 8.3.1, printed p.114");
assert.equal(beef.reported.productionValueThousandRp, 3290.37);
assert.equal(beef.reported.productionCostThousandRp, 716.12);
assert.equal(beef.reported.publishedIncomeThousandRp, 2574.26);
assert.equal(beef.derived.productionMinusCostThousandRp, 2574.25);
assert.equal(beef.derived.publishedIncomeMinusDerivedThousandRp, 0.01);
assert.equal(beef.derived.costComponentSumThousandRp, 716.13);
assert.equal(beef.derived.costComponentSumMinusPublishedCostThousandRp, 0.01);

const dairy = dataset.records.dairyCattlePerHead;
assert.equal(dairy.table, "Table 8.3.2, printed p.115");
assert.equal(dairy.reported.productionValueThousandRp, 10141.12);
assert.equal(dairy.reported.productionCostThousandRp, 5094.66);
assert.equal(dairy.reported.publishedIncomeThousandRp, 5046.46);
assert.equal(dairy.derived.productionMinusCostThousandRp, 5046.46);
assert.equal(dairy.derived.costComponentSumThousandRp, 5094.65);
assert.equal(dairy.derived.costComponentSumMinusPublishedCostThousandRp, -0.01);

const buffalo = dataset.records.meatBuffaloPerHead;
assert.equal(buffalo.table, "Table 8.3.3, printed p.116");
assert.equal(buffalo.reported.productionValueThousandRp, 3697.39);
assert.equal(buffalo.reported.productionCostThousandRp, 533.97);
assert.equal(buffalo.reported.publishedIncomeThousandRp, 3163.42);
assert.equal(buffalo.derived.productionMinusCostThousandRp, 3163.42);
assert.equal(buffalo.derived.costComponentSumThousandRp, 427.32);
assert.equal(buffalo.derived.costComponentSumMinusPublishedCostThousandRp, -106.65);

const goat = dataset.records.meatGoatPerHead;
assert.equal(goat.table, "Table 8.3.5");
assert.equal(goat.reported.productionValueThousandRp, 660.93);
assert.equal(goat.reported.productionCostThousandRp, 155.39);
assert.equal(goat.reported.publishedIncomeThousandRp, 505.54);
assert.equal(goat.reported.feedCostThousandRp, 57.85);
assert.equal(goat.derived.productionMinusCostThousandRp, 505.54);
assert.equal(goat.derived.costComponentSumThousandRp, 155.38);
assert.equal(goat.derived.costComponentSumMinusPublishedCostThousandRp, -0.01);

const nativeChicken = dataset.records.nativeChickenPerHead;
assert.equal(nativeChicken.table, "Table 8.3.7");
assert.equal(nativeChicken.reported.productionValueThousandRp, 34.15);
assert.equal(nativeChicken.reported.productionCostThousandRp, 15.61);
assert.equal(nativeChicken.reported.publishedIncomeThousandRp, 18.53);
assert.equal(nativeChicken.reported.feedCostThousandRp, 10.94);
assert.equal(nativeChicken.derived.productionMinusCostThousandRp, 18.54);
assert.equal(nativeChicken.derived.publishedIncomeMinusDerivedThousandRp, -0.01);
assert.equal(nativeChicken.derived.costComponentSumThousandRp, 15.62);
assert.equal(nativeChicken.derived.costComponentSumMinusPublishedCostThousandRp, 0.01);

const manilaDuck = dataset.records.manilaDuckPerHead;
assert.equal(manilaDuck.table, "Table 8.3.9, printed p.122");
assert.equal(manilaDuck.denominator, "per head");
assert.equal(manilaDuck.reported.productionValueThousandRp, 39.80);
assert.equal(manilaDuck.reported.productionCostThousandRp, 20.75);
assert.equal(manilaDuck.reported.publishedIncomeThousandRp, 19.06);
assert.equal(manilaDuck.reported.feedCostThousandRp, 15.56);
assert.equal(manilaDuck.reported.feedCostSharePct, 74.98);
assert.equal(manilaDuck.derived.productionMinusCostThousandRp, 19.05);
assert.equal(manilaDuck.derived.publishedIncomeMinusDerivedThousandRp, 0.01);
assert.equal(manilaDuck.derived.costComponentSumThousandRp, 20.75);
assert.equal(manilaDuck.derived.costComponentSumMinusPublishedCostThousandRp, 0);

const ducks = dataset.records.layingDuckPer1000Heads;
assert.equal(ducks.table, "Table 8.3.8, printed p.121");
assert.equal(ducks.denominator, "per 1,000 heads");
assert.equal(ducks.reported.productionValueThousandRp, 140316.23);
assert.equal(ducks.reported.productionCostThousandRp, 75420.46);
assert.equal(ducks.reported.publishedIncomeThousandRp, 64895.77);
assert.equal(ducks.reported.feedCostThousandRp, 60009.13);
assert.equal(ducks.reported.feedCostSharePct, 79.57);
assert.equal(ducks.derived.productionMinusCostThousandRp, 64895.77);
assert.equal(ducks.derived.costComponentSumThousandRp, 75420.46);
assert.equal(ducks.derived.costComponentSumMinusPublishedCostThousandRp, 0);

for (const [recordKey, record] of Object.entries(dataset.records)) {
  assert.ok(record.costComponentsThousandRp && record.derived, `${recordKey} retains source components and audit fields`);

  const componentSum = Object.values(record.costComponentsThousandRp).reduce((sum, value) => sum + value, 0);
  const roundedComponentSum = Math.round(componentSum * 100) / 100;
  assert.equal(roundedComponentSum, record.derived.costComponentSumThousandRp, `${recordKey} component sum is reproducible`);
  assert.equal(
    Math.round((roundedComponentSum - record.reported.productionCostThousandRp) * 100) / 100,
    record.derived.costComponentSumMinusPublishedCostThousandRp,
    `${recordKey} preserves the cost-component delta`
  );

  const calculatedIncome = Math.round((record.reported.productionValueThousandRp - record.reported.productionCostThousandRp) * 100) / 100;
  assert.equal(calculatedIncome, record.derived.productionMinusCostThousandRp, `${recordKey} production-minus-cost is reproducible`);
  assert.equal(
    Math.round((record.reported.publishedIncomeThousandRp - calculatedIncome) * 100) / 100,
    record.derived.publishedIncomeMinusDerivedThousandRp,
    `${recordKey} preserves the published-income delta`
  );
  assert.equal(record.status ?? dataset.status, "research_reference_only", `${recordKey} remains research-only and cannot be promoted implicitly`);
}
assert.match(dataset.note, /not Tier 1–4 recipes/i);
assert.match(dataset.note, /not visually verified/i);
console.log("PASS: UTP cattle benchmarks preserve source provenance, denominators, arithmetic deltas and primary-PDF verification gate.");
