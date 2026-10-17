(function(root) {
  "use strict";

  function isNonNegativeNumber(value) {
    return typeof value === "number" && Number.isFinite(value) && value >= 0;
  }

  function hasEvidence(evidence) {
    if (!evidence || typeof evidence !== "object" || !evidence.kind) return false;
    return Boolean(evidence.source && evidence.period && evidence.geography);
  }

  function validateRecipe(recipe) {
    const errors = [];
    const missing = [];
    if (!recipe || typeof recipe !== "object") {
      return { ok: false, complete: false, errors: ["recipe must be an object"], missing };
    }
    if (!recipe.id || typeof recipe.id !== "string") errors.push("recipe.id is required");
    if (!Array.isArray(recipe.inputs) || recipe.inputs.length === 0) errors.push("recipe.inputs must contain at least one input");
    if (!Array.isArray(recipe.outputs) || recipe.outputs.length === 0) errors.push("recipe.outputs must contain at least one output");
    if (!Array.isArray(recipe.costs)) errors.push("recipe.costs must be an array");

    (Array.isArray(recipe.inputs) ? recipe.inputs : []).forEach((input, index) => {
      const prefix = "inputs[" + index + "]";
      if (!input || !input.commodityId || !input.unit) errors.push(prefix + " requires commodityId and unit");
      if (input && input.qtyPerBatch !== null && !isNonNegativeNumber(input.qtyPerBatch)) errors.push(prefix + ".qtyPerBatch must be a non-negative number or null");
      if (input && input.qtyPerBatch == null) missing.push(prefix + ".qtyPerBatch");
    });

    (Array.isArray(recipe.outputs) ? recipe.outputs : []).forEach((output, index) => {
      const prefix = "outputs[" + index + "]";
      if (!output || !output.commodityId || !output.unit) errors.push(prefix + " requires commodityId and unit");
      if (output && !["primary", "byproduct", "waste"].includes(output.role)) errors.push(prefix + ".role must be primary, byproduct, or waste");
      if (output && output.role === "waste" && output.saleable === true) errors.push(prefix + " waste cannot be marked saleable; classify recoverable material as byproduct");
      if (output && output.qtyPerBatch !== null && !isNonNegativeNumber(output.qtyPerBatch)) errors.push(prefix + ".qtyPerBatch must be a non-negative number or null");
      if (output && output.qtyPerBatch == null) missing.push(prefix + ".qtyPerBatch");
      if (output && output.saleable === true) {
        if (!isNonNegativeNumber(output.salePricePerUnit)) missing.push(prefix + ".salePricePerUnit");
        if (!hasEvidence(output.priceEvidence)) missing.push(prefix + ".priceEvidence");
      }
    });

    if (Array.isArray(recipe.costs)) {
      if (recipe.costs.length === 0) missing.push("costs (no cost schedule supplied)");
      recipe.costs.forEach((cost, index) => {
        const prefix = "costs[" + index + "]";
        if (!cost || !cost.id || !cost.category || !cost.unit) errors.push(prefix + " requires id, category, and unit");
        if (cost && cost.amountPerBatch !== null && !isNonNegativeNumber(cost.amountPerBatch)) errors.push(prefix + ".amountPerBatch must be a non-negative number or null");
        if (cost && cost.required !== false && cost.amountPerBatch == null) missing.push(prefix + ".amountPerBatch");
        if (cost && cost.amountPerBatch != null && !hasEvidence(cost.evidence)) missing.push(prefix + ".evidence");
      });
    }

    if (recipe.capacityBatches != null && (!Number.isInteger(recipe.capacityBatches) || recipe.capacityBatches < 0)) {
      errors.push("capacityBatches must be a non-negative integer or null");
    }
    return { ok: errors.length === 0, complete: errors.length === 0 && missing.length === 0, errors, missing };
  }

  function planProduction(recipe, batchCount, inventory) {
    const validation = validateRecipe(recipe);
    if (!Number.isInteger(batchCount) || batchCount <= 0) {
      return { ok: false, complete: false, errors: ["batchCount must be a positive integer"], missing: validation.missing };
    }
    if (!validation.ok) return { ok: false, complete: false, errors: validation.errors, missing: validation.missing };
    if (recipe.capacityBatches != null && batchCount > recipe.capacityBatches) {
      return { ok: false, complete: false, errors: ["batchCount exceeds recipe capacityBatches"], missing: validation.missing };
    }

    const inputRequirements = recipe.inputs.map((input) => ({
      commodityId: input.commodityId,
      unit: input.unit,
      quantity: input.qtyPerBatch == null ? null : input.qtyPerBatch * batchCount
    }));
    const outputPlan = recipe.outputs.map((output) => ({
      commodityId: output.commodityId,
      unit: output.unit,
      role: output.role,
      saleable: output.saleable === true,
      quantity: output.qtyPerBatch == null ? null : output.qtyPerBatch * batchCount
    }));
    const shortages = [];
    const inventoryChecked = Boolean(inventory && typeof inventory === "object");
    if (inventoryChecked) {
      inputRequirements.forEach((required) => {
        if (required.quantity == null) {
          shortages.push({ commodityId: required.commodityId, required: null, available: null, shortage: null, unknown: true });
          return;
        }
        const available = isNonNegativeNumber(inventory[required.commodityId]) ? inventory[required.commodityId] : 0;
        if (available < required.quantity) shortages.push({
          commodityId: required.commodityId,
          required: required.quantity,
          available,
          shortage: required.quantity - available,
          unknown: false
        });
      });
    }

    const requiredCosts = recipe.costs.filter((cost) => cost.required !== false);
    const costComplete = requiredCosts.length > 0 && requiredCosts.every((cost) =>
      isNonNegativeNumber(cost.amountPerBatch) && hasEvidence(cost.evidence)
    );
    const totalCost = costComplete
      ? recipe.costs.filter((cost) => isNonNegativeNumber(cost.amountPerBatch) && hasEvidence(cost.evidence))
        .reduce((sum, cost) => sum + cost.amountPerBatch * batchCount, 0)
      : null;
    return {
      ok: true,
      complete: validation.complete && costComplete,
      errors: [],
      missing: validation.missing.slice(),
      batchCount,
      inputRequirements,
      outputs: outputPlan,
      shortages,
      inventoryChecked,
      costLines: recipe.costs.map((cost) => ({
        id: cost.id,
        category: cost.category,
        unit: cost.unit,
        total: cost.amountPerBatch == null ? null : cost.amountPerBatch * batchCount,
        required: cost.required !== false
      })),
      totalCost,
      canExecute: inventoryChecked && shortages.length === 0 && inputRequirements.every((x) => x.quantity != null) &&
        outputPlan.every((x) => x.quantity != null) && costComplete
    };
  }

  function calculateEconomics(recipe, batchCount) {
    const plan = planProduction(recipe, batchCount);
    if (!plan.ok) return { ok: false, complete: false, errors: plan.errors, missing: plan.missing };
    const saleable = recipe.outputs.filter((output) => output.saleable === true);
    const revenueComplete = saleable.length > 0 && saleable.every((output) =>
      isNonNegativeNumber(output.qtyPerBatch) &&
      isNonNegativeNumber(output.salePricePerUnit) &&
      hasEvidence(output.priceEvidence)
    );
    const revenue = revenueComplete
      ? saleable.reduce((sum, output) => sum + output.qtyPerBatch * batchCount * output.salePricePerUnit, 0)
      : null;
    const profit = revenue != null && plan.totalCost != null ? revenue - plan.totalCost : null;
    const missing = plan.missing.slice();
    if (!revenueComplete) missing.push("saleable output price and provenance");
    if (plan.totalCost == null) missing.push("complete required cost schedule");
    return {
      ok: true,
      complete: plan.complete && revenueComplete && plan.totalCost != null,
      batchCount,
      revenue,
      totalCost: plan.totalCost,
      operatingResult: profit,
      outputs: plan.outputs,
      missing
    };
  }

  const api = Object.freeze({ validateRecipe, planProduction, calculateEconomics });
  root.AgroCommodityTransformation = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
