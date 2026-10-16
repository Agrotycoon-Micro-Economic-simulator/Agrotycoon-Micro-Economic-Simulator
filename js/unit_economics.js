/* Unit economics for production and multi-stage businesses.
 * Currency values are integer IDR unless explicitly stated otherwise.
 * Unknown inputs are never silently treated as zero.
 *
 * Input sourcingMode:
 * - "buy": external purchase price is the chain's cost.
 * - "own": own production cost is counted in the integrated chain; market
 *   opportunity price is reported separately to show the value forgone by
 *   consuming an internally produced item instead of selling it externally.
 */
(function(root) {
  "use strict";

  const finiteNonNegative = value => typeof value === "number" && Number.isFinite(value) && value >= 0;
  const evidenceKinds = new Set(["official_observation", "derived_from_source", "game_parameter", "experimental_assumption"]);

  function evidenceStatus(evidence) {
    if (!evidence || !evidence.kind || !evidenceKinds.has(evidence.kind)) return "unknown";
    if ((evidence.kind === "official_observation" || evidence.kind === "derived_from_source") &&
        typeof evidence.sourceUrl === "string" && evidence.sourceUrl.trim() &&
        typeof evidence.period === "string" && evidence.period.trim()) return "source-backed";
    if (evidence.kind === "game_parameter" || evidence.kind === "experimental_assumption") return "assumption";
    return "incomplete-provenance";
  }

  function validateScenario(scenario) {
    const errors = [];
    if (!scenario || typeof scenario !== "object") return { ok: false, errors: ["scenario harus berupa objek"] };
    if (typeof scenario.id !== "string" || !scenario.id.trim()) errors.push("id wajib diisi");
    if (typeof scenario.name !== "string" || !scenario.name.trim()) errors.push("name wajib diisi");
    if (!finiteNonNegative(scenario.sellPricePerUnit)) errors.push("sellPricePerUnit wajib berupa angka >= 0");
    if (!finiteNonNegative(scenario.plannedSalesUnitsPerMonth)) errors.push("plannedSalesUnitsPerMonth wajib berupa angka >= 0");
    if (!finiteNonNegative(scenario.wasteRate) || scenario.wasteRate >= 1) errors.push("wasteRate wajib berada pada rentang 0 sampai kurang dari 1");
    if (!Array.isArray(scenario.inputs)) errors.push("inputs wajib berupa array; gunakan [] bila tidak ada input");
    if (!Array.isArray(scenario.variableCosts)) errors.push("variableCosts wajib berupa array; gunakan [] bila tidak ada biaya variabel lain");
    if (!Array.isArray(scenario.fixedCostsMonthly)) errors.push("fixedCostsMonthly wajib berupa array; gunakan [] bila tidak ada biaya tetap");
    if (!Array.isArray(scenario.capex)) errors.push("capex wajib berupa array; gunakan [] bila tidak ada aset awal");
    if (Array.isArray(scenario.inputs)) scenario.inputs.forEach((input, i) => {
      if (!input || typeof input.id !== "string" || !input.id.trim()) errors.push("inputs[" + i + "].id wajib diisi");
      if (!finiteNonNegative(input.quantityPerOutput)) errors.push("inputs[" + i + "].quantityPerOutput wajib >= 0");
      if (!["buy", "own"].includes(input.sourcingMode)) errors.push("inputs[" + i + "].sourcingMode wajib buy atau own");
      if (input.sourcingMode === "buy" && !finiteNonNegative(input.purchasePricePerUnit)) errors.push("inputs[" + i + "].purchasePricePerUnit belum diketahui");
      if (input.sourcingMode === "own" && !finiteNonNegative(input.ownProductionCostPerUnit)) errors.push("inputs[" + i + "].ownProductionCostPerUnit belum diketahui");
      if (input.sourcingMode === "own" && !finiteNonNegative(input.marketOpportunityPricePerUnit)) errors.push("inputs[" + i + "].marketOpportunityPricePerUnit belum diketahui");
    });
    if (Array.isArray(scenario.variableCosts)) scenario.variableCosts.forEach((cost, i) => {
      if (!cost || typeof cost.id !== "string" || !cost.id.trim()) errors.push("variableCosts[" + i + "].id wajib diisi");
      if (!finiteNonNegative(cost.costPerProducedUnit)) errors.push("variableCosts[" + i + "].costPerProducedUnit belum diketahui");
    });
    if (Array.isArray(scenario.fixedCostsMonthly)) scenario.fixedCostsMonthly.forEach((cost, i) => {
      if (!cost || typeof cost.id !== "string" || !cost.id.trim()) errors.push("fixedCostsMonthly[" + i + "].id wajib diisi");
      if (!finiteNonNegative(cost.amountPerMonth)) errors.push("fixedCostsMonthly[" + i + "].amountPerMonth belum diketahui");
    });
    if (Array.isArray(scenario.capex)) scenario.capex.forEach((asset, i) => {
      if (!asset || typeof asset.id !== "string" || !asset.id.trim()) errors.push("capex[" + i + "].id wajib diisi");
      if (!finiteNonNegative(asset.amount)) errors.push("capex[" + i + "].amount belum diketahui");
      if (!Number.isInteger(asset.usefulLifeMonths) || asset.usefulLifeMonths <= 0) errors.push("capex[" + i + "].usefulLifeMonths wajib integer > 0");
    });
    return { ok: errors.length === 0, errors };
  }

  function calculate(scenario) {
    const validation = validateScenario(scenario);
    if (!validation.ok) {
      return { ok: false, complete: false, errors: validation.errors, metrics: null };
    }

    const saleableUnits = scenario.plannedSalesUnitsPerMonth;
    const productionUnits = saleableUnits / (1 - scenario.wasteRate);
    const revenue = saleableUnits * scenario.sellPricePerUnit;
    let standInputCost = 0;
    let integratedInputCost = 0;
    let opportunityInputCost = 0;
    const inputBreakdown = [];

    for (const input of scenario.inputs) {
      const qty = input.quantityPerOutput * productionUnits;
      let standUnitCost;
      let integratedUnitCost;
      let opportunityUnitCost;
      if (input.sourcingMode === "buy") {
        standUnitCost = input.purchasePricePerUnit;
        integratedUnitCost = input.purchasePricePerUnit;
        opportunityUnitCost = input.purchasePricePerUnit;
      } else {
        // Stand-only cash view excludes upstream costs; the integrated chain
        // counts actual production cost once, and the opportunity view uses
        // the observed/declared external selling value.
        standUnitCost = 0;
        integratedUnitCost = input.ownProductionCostPerUnit;
        opportunityUnitCost = input.marketOpportunityPricePerUnit;
      }
      standInputCost += qty * standUnitCost;
      integratedInputCost += qty * integratedUnitCost;
      opportunityInputCost += qty * opportunityUnitCost;
      inputBreakdown.push({
        id: input.id, sourcingMode: input.sourcingMode, totalQuantity: qty,
        standCashCost: qty * standUnitCost,
        integratedChainCost: qty * integratedUnitCost,
        opportunityValue: qty * opportunityUnitCost,
        evidenceStatus: evidenceStatus(input.evidence)
      });
    }

    const variableCostPerProducedUnit = scenario.variableCosts.reduce((sum, item) => sum + item.costPerProducedUnit, 0);
    const variableCost = variableCostPerProducedUnit * productionUnits;
    const fixedCost = scenario.fixedCostsMonthly.reduce((sum, item) => sum + item.amountPerMonth, 0);
    const depreciation = scenario.capex.reduce((sum, asset) => sum + asset.amount / asset.usefulLifeMonths, 0);
    const standCashCosts = standInputCost + variableCost + fixedCost;
    const integratedCashCosts = integratedInputCost + variableCost + fixedCost;
    const opportunityCosts = opportunityInputCost + variableCost + fixedCost + depreciation;
    const accountingCosts = integratedInputCost + variableCost + fixedCost + depreciation;
    const capexCashOutflow = scenario.capex.reduce((sum, asset) => sum + asset.amount, 0);
    const evidence = [];
    for (const input of scenario.inputs) evidence.push(evidenceStatus(input.evidence));
    for (const cost of scenario.variableCosts) evidence.push(evidenceStatus(cost.evidence));
    for (const cost of scenario.fixedCostsMonthly) evidence.push(evidenceStatus(cost.evidence));
    for (const asset of scenario.capex) evidence.push(evidenceStatus(asset.evidence));
    const evidenceComplete = evidence.every(status => status === "source-backed");
    const evidenceUnknown = evidence.some(status => status === "unknown" || status === "incomplete-provenance");

    return {
      ok: true,
      complete: true,
      evidenceStatus: evidenceComplete ? "source-backed" : evidenceUnknown ? "incomplete-provenance" : "assumption-containing",
      metrics: {
        revenueMonthly: revenue,
        saleableUnitsMonthly: saleableUnits,
        productionUnitsNeededMonthly: productionUnits,
        wasteUnitsMonthly: productionUnits - saleableUnits,
        standOnlyCashInputCostMonthly: standInputCost,
        integratedInputCostMonthly: integratedInputCost,
        opportunityCostOfInputsMonthly: opportunityInputCost,
        otherVariableCostMonthly: variableCost,
        fixedCostMonthly: fixedCost,
        depreciationMonthly: depreciation,
        capexInitialCashOutflow: capexCashOutflow,
        standOnlyOperatingCashProfitMonthly: revenue - standCashCosts,
        integratedChainOperatingCashProfitMonthly: revenue - integratedCashCosts,
        integratedChainAccountingProfitMonthly: revenue - accountingCosts,
        opportunityAdjustedProfitMonthly: revenue - opportunityCosts,
        hppPerSaleableUnit: (integratedInputCost + variableCost + fixedCost + depreciation) / (saleableUnits || 1),
        grossMarginPercent: revenue === 0 ? null : ((revenue - integratedInputCost - variableCost) / revenue) * 100,
        contributionPerSaleableUnit: saleableUnits === 0 ? null : (revenue - integratedInputCost - variableCost) / saleableUnits,
        breakEvenSaleableUnitsMonthly: (() => {
          const contribution = scenario.sellPricePerUnit - ((integratedInputCost + variableCost) / (saleableUnits || 1));
          return contribution <= 0 ? null : Math.ceil((fixedCost + depreciation) / contribution);
        })()
      },
      inputBreakdown,
      assumptions: {
        currency: scenario.currency || "IDR",
        wasteRate: scenario.wasteRate,
        evidenceKinds,
        note: "Model tidak membuktikan harga/biaya sebagai data riil. Status provenance berasal dari evidence setiap input."
      }
    };
  }

  root.AgroUnitEconomics = Object.freeze({ validateScenario, calculate, evidenceStatus });
  if (typeof module !== "undefined" && module.exports) module.exports = root.AgroUnitEconomics;
})(typeof window !== "undefined" ? window : globalThis);
