// Run with: node tests/utl-oil-palm-benchmark.test.js
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

const b = window.REAL_ECONOMIC_DATA.utlOilPalmBenchmark2024;
assert.ok(b, "research-only UTL oil-palm benchmark is registered");
assert.equal(b.unitType, "UTL");
assert.equal(b.denominator, "per 100 trees harvested by Other Agricultural Holdings (UTL)");
assert.equal(b.reported.productionValueThousandRp, 25143.89);
assert.equal(b.reported.productionCostThousandRp, 13218.16);
assert.equal(b.reported.publishedIncomeThousandRp, 12046.95);
assert.equal(b.reported.productivityKgPer100Trees, 12443.49);
assert.equal(b.costComponentsThousandRp.fertilizer, 3026.97);
assert.equal(b.derivedAudit.costComponentSumThousandRp, 13212.48);
assert.equal(b.derivedAudit.costComponentSumMinusPublishedCostThousandRp, -5.68);
assert.equal(b.derivedAudit.productionMinusPublishedCostThousandRp, 11925.73);
assert.equal(b.derivedAudit.publishedIncomeMinusProductionMinusCostThousandRp, 121.22);
assert.equal(b.derivedAudit.status, "source_component_and_income_gap_unresolved");
assert.match(b.source.officialPublisherPageUrl, /bps\.go\.id/);
assert.match(b.source.mirrorUrl, /scribd\.com/);
assert.equal(b.sourceNotes.originalTableImageStatus, "visually_verified_official_pdf_image");
assert.equal(b.source.qualityStatus, "official_pdf_text_and_table_image_verified");
assert.match(b.sourceNotes.imputationNote, /not yet been estimated/i);
assert.equal(b.status, "research_reference_only");

console.log("PASS: UTL oil-palm source values, cost-component sum, income gap and visual-verification caveat are preserved.");
