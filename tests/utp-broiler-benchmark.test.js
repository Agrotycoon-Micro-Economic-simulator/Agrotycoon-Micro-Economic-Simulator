// Run with: node tests/utp-broiler-benchmark.test.js
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

const b = window.REAL_ECONOMIC_DATA.utpBroilerBenchmark2024;
assert.ok(b, "research-only UTP broiler benchmark is registered");
assert.equal(b.unitType, "UTP");
assert.equal(b.referencePeriod, "2023-06-01/2024-05-31");
assert.equal(b.denominator, "per 5,000 final-stock heads");
assert.equal(b.source.title, "Peternakan Dalam Angka 2025");
assert.equal(b.source.releaseDate, "2026-01-09");
assert.match(b.source.url, /bps\.go\.id/);
assert.equal(b.reported.productionValueThousandRp, 152008.05);
assert.equal(b.reported.productionCostThousandRp, 126445.06);
assert.equal(b.reported.publishedIncomeThousandRp, 25563.00);
assert.equal(b.reported.feedCostThousandRp, 81754.62);
assert.equal(b.reported.feedCostSharePct, 64.66);
assert.equal(b.derived.productionMinusCostThousandRp, 25562.99);
assert.equal(b.derived.publishedIncomeMinusDerivedThousandRp, 0.01);
assert.equal(b.reconciliation.earlierSepTable2_10Transcription.publishedIncomeThousandRp, 28639.72);
assert.equal(b.reconciliation.originalSepTableTextStatus, "verified_in_official_pdf_text");
assert.equal(b.reconciliation.originalSepTableImageStatus, "not_yet_visually_verified");
assert.match(b.note, /official BPS SEP 2024 livestock PDF text was opened directly/i);
assert.equal(b.status, "research_reference_only");
assert.match(b.note, /Do not overwrite the original Table 2.10 transcription/i);

console.log("PASS: BPS UTP broiler benchmark preserves later-source values, unit, rounding and original-table verification caveat.");
