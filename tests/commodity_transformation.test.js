const assert = require("node:assert/strict");
const engine = require("../js/commodity_transformation.js");

const evidence = { kind: "synthetic_test_fixture", source: "unit test only", period: "test-only", geography: "not real market data" };
const recipe = {
  id: "synthetic_residue_test",
  capacityBatches: 5,
  inputs: [{ commodityId: "raw_a", qtyPerBatch: 2, unit: "unit" }],
  outputs: [
    { commodityId: "finished_a", qtyPerBatch: 1, unit: "unit", role: "primary", saleable: true, salePricePerUnit: 300, priceEvidence: evidence },
    { commodityId: "residue_a", qtyPerBatch: 0.5, unit: "unit", role: "byproduct", saleable: false, salePricePerUnit: null, priceEvidence: null },
    { commodityId: "waste_a", qtyPerBatch: 0.5, unit: "unit", role: "waste", saleable: false, salePricePerUnit: null, priceEvidence: null }
  ],
  costs: [{ id: "process", category: "energy_and_labor", unit: "currency_per_batch", amountPerBatch: 100, evidence }]
};

assert.equal(engine.validateRecipe(recipe).ok, true);
assert.equal(engine.validateRecipe(recipe).complete, true);
const plan = engine.planProduction(recipe, 2, { raw_a: 3 });
assert.equal(plan.ok, true);
assert.equal(plan.inputRequirements[0].quantity, 4);
assert.equal(plan.outputs[0].quantity, 2);
assert.equal(plan.outputs[1].quantity, 1);
assert.equal(plan.outputs[2].quantity, 1);
assert.deepEqual(plan.shortages[0], { commodityId: "raw_a", required: 4, available: 3, shortage: 1, unknown: false });
assert.equal(plan.totalCost, 200);
assert.equal(plan.canExecute, false);
assert.equal(plan.inventoryChecked, true);
assert.equal(engine.planProduction(recipe, 2).canExecute, false, "execution must require an inventory snapshot");
assert.equal(engine.planProduction(recipe, 2, { raw_a: 10 }).canExecute, true, "execution may proceed when inventory, outputs and costs are complete");

const economics = engine.calculateEconomics(recipe, 2);
assert.equal(economics.revenue, 600);
assert.equal(economics.totalCost, 200);
assert.equal(economics.operatingResult, 400);
assert.equal(economics.complete, true);

assert.equal(engine.planProduction(recipe, 6).ok, false);
assert.equal(engine.planProduction(recipe, 0).ok, false);

const unknownRecipe = {
  id: "unknown_yield",
  inputs: [{ commodityId: "raw_b", qtyPerBatch: null, unit: "kg" }],
  outputs: [{ commodityId: "product_b", qtyPerBatch: null, unit: "kg", role: "primary", saleable: true, salePricePerUnit: null, priceEvidence: null }],
  costs: [{ id: "labor", category: "labor", unit: "currency_per_batch", amountPerBatch: null, evidence: null }]
};
const unknownPlan = engine.planProduction(unknownRecipe, 1, { raw_b: 10 });
assert.equal(unknownPlan.ok, true);
assert.equal(unknownPlan.complete, false);
assert.equal(unknownPlan.inputRequirements[0].quantity, null);
assert.equal(unknownPlan.totalCost, null);
assert.equal(unknownPlan.canExecute, false);
assert.equal(engine.calculateEconomics(unknownRecipe, 1).operatingResult, null);

const invalid = engine.validateRecipe({ id: "broken", inputs: [], outputs: [], costs: [] });
assert.equal(invalid.ok, false);
const unsafeWaste = { ...recipe, outputs: [{ commodityId: "waste_a", qtyPerBatch: 1, unit: "unit", role: "waste", saleable: true, salePricePerUnit: 1, priceEvidence: evidence }] };
assert.equal(engine.validateRecipe(unsafeWaste).ok, false, "waste cannot be monetized as a saleable output");
console.log("PASS: generic transformation schema, input/output quantities, stock shortage, cost/provenance gating, and no invented revenue.");
