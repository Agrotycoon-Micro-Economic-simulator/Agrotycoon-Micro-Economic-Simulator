// Run with: node tests/unit_economics.test.js
const assert = require("node:assert/strict");
const economics = require("../js/unit_economics.js");

const gameEvidence = { kind: "game_parameter", sourceUrl: "js/data.js", period: "current game config", geography: "game scenario" };
const scenario = {
  id: "coconut-ice-buy-from-farmer",
  name: "Stand es kelapa membeli kelapa",
  currency: "IDR",
  sellPricePerUnit: 5000,
  plannedSalesUnitsPerMonth: 1000,
  wasteRate: 0,
  inputs: [{
    id: "coconut",
    quantityPerOutput: 0.25,
    sourcingMode: "buy",
    purchasePricePerUnit: 3500,
    evidence: gameEvidence
  }],
  variableCosts: [{ id: "ice-sugar-cup", costPerProducedUnit: 1300, evidence: gameEvidence }],
  fixedCostsMonthly: [{ id: "home-stand", amountPerMonth: 0, evidence: gameEvidence }],
  capex: [{ id: "economical-stand-kit", amount: 160000, usefulLifeMonths: 24, evidence: gameEvidence }]
};

{
  const result = economics.calculate(scenario);
  assert.equal(result.ok, true);
  assert.equal(result.complete, true);
  assert.equal(result.evidenceStatus, "assumption-containing", "game parameters are not mistaken for official data");
  assert.equal(result.metrics.revenueMonthly, 5000000);
  assert.equal(result.metrics.integratedInputCostMonthly, 875000);
  assert.equal(result.metrics.otherVariableCostMonthly, 1300000);
  assert.equal(result.metrics.integratedChainOperatingCashProfitMonthly, 2825000);
  assert.equal(result.metrics.integratedChainAccountingProfitMonthly, 2818333.3333333335);
  assert.equal(result.metrics.capexInitialCashOutflow, 160000);
  assert.equal(result.inputBreakdown[0].standCashCost, 875000);
}

{
  const own = structuredClone(scenario);
  own.id = "coconut-ice-integrated";
  own.name = "Stand es kelapa terintegrasi dengan kebun";
  own.inputs[0] = {
    id: "coconut",
    quantityPerOutput: 0.25,
    sourcingMode: "own",
    ownProductionCostPerUnit: 1000,
    marketOpportunityPricePerUnit: 3500,
    evidence: { kind: "experimental_assumption", sourceUrl: "test fixture", period: "test only" }
  };
  const result = economics.calculate(own);
  assert.equal(result.ok, true);
  assert.equal(result.metrics.standOnlyOperatingCashProfitMonthly, 3700000,
    "stand-only view excludes upstream cash cost");
  assert.equal(result.metrics.integratedChainOperatingCashProfitMonthly, 3450000,
    "integrated chain counts the upstream production cost exactly once");
  assert.equal(result.metrics.opportunityAdjustedProfitMonthly, 2825000,
    "opportunity-adjusted result values own fruit at its external sale alternative");
  assert.equal(result.inputBreakdown[0].standCashCost, 0);
  assert.equal(result.inputBreakdown[0].integratedChainCost, 250000);
  assert.equal(result.inputBreakdown[0].opportunityValue, 875000);
}

{
  const incomplete = structuredClone(scenario);
  incomplete.inputs[0].purchasePricePerUnit = null;
  const result = economics.calculate(incomplete);
  assert.equal(result.ok, false);
  assert.equal(result.complete, false);
  assert.equal(result.metrics, null, "unknown costs are not silently treated as zero");
  assert.ok(result.errors.some(error => error.includes("purchasePricePerUnit")));
}

{
  const invalid = structuredClone(scenario);
  invalid.wasteRate = 1;
  assert.equal(economics.validateScenario(invalid).ok, false);
}

{
  assert.equal(economics.evidenceStatus({ kind: "official_observation", sourceUrl: "https://example.test/data", period: "2025-01" }), "source-backed");
  assert.equal(economics.evidenceStatus(gameEvidence), "assumption");
  assert.equal(economics.evidenceStatus(null), "unknown");
}

console.log("PASS: unit economics, own-vs-buy sourcing, internal chain costing, opportunity cost, capex depreciation and missing-data guards.");
