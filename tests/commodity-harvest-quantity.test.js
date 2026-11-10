const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync(require.resolve("../js/land.js"), "utf8");
function makeSandbox(receiptResult) {
  const state = {
    day: 10, gold: 1000, cuaca: "cerah",
    landSystem: {
      inventory: { tomat: 2 }, inventoryCost: { tomat: 200 },
      lands: [{ id: "farm-1", plots: [{ id: "plot-1", commodity: "tomat", count: 1, plantedDay: 1, health: 100, wipCost: 500 }] }]
    },
    dayLog: { commodityHarvests: [] }
  };
  const sandbox = {
    console, window: {}, S: state,
    COMMODITY_BY_ID: { tomat: { id: "tomat", name: "Tomat", growDays: 5, category: "hortikultura", yieldQty: 8 } },
    COMMODITY_ECONOMICS: { tomat: { unit: "kg" } },
    COMMODITY_ECONOMICS_BY_ID: {},
    AgroCommodityTransformation: { addInventoryCost: (q, c, addQ, addC) => ({ ok: true, quantity: q + addQ, costValue: c + addC }) },
    AgroCommodityStorage: { receiveLot: (_state, input) => { sandbox.received = input; return receiptResult; } },
    AgroCommodityUnits: { getQuantityContract: () => ({ transactionUnit: "kg", transactionProductForm: "tomat segar" }) },
    ensureAgriState: () => {}, getCommodityPrice: () => 100,
    msg: message => { sandbox.lastMessage = message; }, save: () => {},
    showCommodityEconomics: () => {}, render: () => {}
  };
  vm.runInNewContext(source, sandbox, { filename: "js/land.js" });
  return { sandbox, state };
}

const failed = makeSandbox({ ok: false, reason: "quantity_contract_not_enabled" });
failed.sandbox.harvestCommodity("farm-1", "plot-1");
assert.equal(failed.state.landSystem.inventory.tomat, 2);
assert.equal(failed.state.landSystem.inventoryCost.tomat, 200);
assert.equal(failed.state.landSystem.lands[0].plots[0].wipCost, 500);
assert.equal(failed.state.dayLog.commodityHarvests.length, 0);
assert.match(failed.sandbox.lastMessage, /persediaan dan hasil panen tidak diubah/);

const succeeded = makeSandbox({ ok: true, lot: { id: "harvest-lot" } });
succeeded.sandbox.harvestCommodity("farm-1", "plot-1");
assert.ok(succeeded.sandbox.received);
assert.equal(succeeded.sandbox.received.quantityBasis, "agronomy_yield_model");
assert.equal(succeeded.sandbox.received.quantityUnit, "unconverted_simulation_market_units");
assert.equal(succeeded.sandbox.received.quantityScaleStatus, "unconverted_legacy_simulation_index");
assert.equal(succeeded.state.landSystem.inventory.tomat, 10);
assert.equal(succeeded.state.landSystem.inventoryCost.tomat, 700);
assert.equal(succeeded.state.dayLog.commodityHarvests[0].quantityScaleStatus, "unconverted_legacy_simulation_index");

console.log("PASS: harvest quantity provenance is explicit and failed lot receipt cannot partially mutate inventory or plot WIP.");
