// Run with: node tests/production_tiers.test.js
const assert = require("node:assert/strict");
const tiers = require("../js/production_tiers.js");

assert.equal(tiers.tiers.length, 4);
assert.deepEqual(tiers.tiers.map(t => t.name), ["Mentah", "Semi-olahan", "Industri", "Spesialisasi Nasional"]);
assert.deepEqual(tiers.tiers.map(t => t.schoolBuffPercent), [0, 10, 15, 20]);
assert.equal(tiers.getTier("TIER_1").examples.includes("beras"), true);
assert.equal(tiers.getTier("tier-4").examples.includes("alat berat"), true);
assert.equal(tiers.normalizeTier("Tier 3"), 3);
assert.equal(tiers.normalizeTier("TIER_5"), null);
assert.equal(tiers.normalizeTier(0), null);
assert.equal(tiers.canAdvance(1, 2), true);
assert.equal(tiers.canAdvance(2, 2), false);
assert.equal(tiers.canAdvance(4, 3), false);
assert.equal(tiers.validateDefinition({ productId: "flour", tier: 2 }).ok, true);
assert.equal(tiers.validateDefinition({ productId: "flour", tier: 5 }).ok, false);
assert.equal(tiers.validateDefinition({ tier: 2 }).ok, false);
console.log("PASS: production tier taxonomy, normalization, progression and definition validation.");
