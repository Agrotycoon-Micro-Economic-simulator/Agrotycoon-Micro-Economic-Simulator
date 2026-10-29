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

for (const record of Object.values(dataset.records)) {
  const componentSum = Object.values(record.costComponentsThousandRp).reduce((sum, value) => sum + value, 0);
  assert.equal(Math.round(componentSum * 100) / 100, record.derived.costComponentSumThousandRp);
}
assert.match(dataset.note, /not Tier 1–4 recipes/i);
assert.match(dataset.note, /not visually verified/i);
console.log("PASS: UTP cattle benchmarks preserve source provenance, denominators, arithmetic deltas and primary-PDF verification gate.");
