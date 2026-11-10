const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = vm.createContext({ console });
context.window = context;
for (const file of ['js/commodities.js', 'js/commodity_transformation.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, { filename: file });
}

test('recipe unit labels never silently convert legacy quantities to physical units', () => {
  const recipe = {
    id: 'test-rice-processing',
    inputs: [{ commodityId: 'padi', unit: 'kg', qtyPerBatch: 10 }],
    outputs: [{ commodityId: 'padi', unit: 'kg', role: 'primary', saleable: false, qtyPerBatch: 8 }],
    costs: [{ id: 'labor', category: 'labor', unit: 'IDR/batch', amountPerBatch: 1000, evidence: { kind: 'game_parameter', source: 'test', period: '2026', geography: 'game' } }]
  };
  const result = context.AgroCommodityTransformation.planProduction(recipe, 2, { padi: 20 });
  assert.equal(result.ok, true);
  assert.equal(result.quantityContractStatus, 'legacy_quantity_contract_explicit');
  assert.equal(result.inputRequirements[0].quantity, 20);
  assert.equal(result.inputRequirements[0].quantityContract.declaredUnit, 'kg');
  assert.equal(result.inputRequirements[0].quantityContract.declaredUnitSemantics, 'recipe_label_not_physical_quantity');
  assert.equal(result.inputRequirements[0].quantityContract.physicalConversionEnabled, false);
  assert.equal(result.canExecute, true);
});

test('unknown physical conversion cannot be enabled by a recipe unit label', () => {
  const contract = context.AgroCommodityTransformation.quantityContractFor('padi', 'kg');
  assert.equal(contract.quantityUnit, 'unconverted_simulation_market_units');
  assert.equal(contract.physicalConversionEnabled, false);
  assert.notEqual(contract.conversionStatus, 'verified');
});

test('missing conversion evidence blocks physical execution instead of guessing a factor', () => {
  const recipe = {
    id: 'physical-input-without-factor',
    inputs: [{ commodityId: 'padi', unit: 'kg', qtyPerBatch: 10, quantityUnit: 'kg' }],
    outputs: [{ commodityId: 'padi', unit: 'kg', role: 'primary', saleable: false, qtyPerBatch: 8 }],
    costs: [{ id: 'labor', category: 'labor', unit: 'IDR/batch', amountPerBatch: 1000, evidence: { kind: 'game_parameter', source: 'test', period: '2026', geography: 'game' } }]
  };
  const result = context.AgroCommodityTransformation.planProduction(recipe, 1, { padi: 10 });
  assert.equal(result.ok, true);
  assert.equal(result.canExecute, false);
  assert.ok(result.errors.includes('physical quantity execution is not enabled'));
});

console.log('PASS: transformation quantity-contract guard');
