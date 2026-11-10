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
assert.equal(engine.weightedAverageUnitCost(10, 500), 50);
assert.equal(engine.weightedAverageUnitCost(0, 500), null);
const consumed = engine.consumeWeightedAverageInventory(10, 500, 4);
assert.deepEqual(consumed, {
  ok: true,
  unitCost: 50,
  consumedCost: 200,
  remainingQuantity: 6,
  remainingCostValue: 300
});
assert.equal(engine.consumeWeightedAverageInventory(3, 100, 4).ok, false);
const received = engine.addInventoryCost(6, 300, 4, 200);
assert.deepEqual(received, { ok: true, quantity: 10, costValue: 500, unitCost: 50 });
assert.equal(engine.addInventoryCost(1, 0, 0, 10).ok, false);

console.log("PASS: generic transformation schema, input/output quantities, stock shortage, cost/provenance gating, weighted-average inventory valuation, and no invented revenue.");


const previousUnits = global.AgroCommodityUnits;
global.AgroCommodityUnits = {
  getQuantityContract: id => id === "raw_a" ? {
    transactionUnit: "100 kg",
    transactionProductForm: "grain lot",
    sourceUnitStatus: "official_reference_unit",
    conversionStatus: "pending_verified_factor_and_product_form"
  } : null
};
const contractPlan = engine.planProduction(recipe, 1, { raw_a: 10 });
assert.equal(contractPlan.quantityUnit, "unconverted_simulation_market_units");
assert.equal(contractPlan.quantityScaleStatus, "unconverted_legacy_simulation_index");
assert.equal(contractPlan.inputRequirements[0].quantityContract.referencePhysicalUnit, "100 kg");
assert.equal(contractPlan.inputRequirements[0].quantityContract.referenceProductForm, "grain lot");
assert.equal(contractPlan.inputRequirements[0].quantityContract.quantityUnit, "unconverted_simulation_market_units");
assert.equal(contractPlan.outputs[0].quantityContract.conversionStatus, "pending_registry_reference");
global.AgroCommodityUnits = previousUnits;
