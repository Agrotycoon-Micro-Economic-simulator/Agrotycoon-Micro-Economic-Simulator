/* Production transformation tiers from the owner's Library blueprints.
 * IMPORTANT: production tier != market channel. See docs/PRODUCTION_TIERS.md.
 * This metadata is a game design contract, not a claim about real-world classifications.
 */
(function(root) {
  "use strict";

  const tiers = [
    { id: 1, key: "TIER_1", name: "Mentah", description: "Produksi bahan mentah.", examples: ["beras", "besi", "karet"], schoolBuffPercent: 0 },
    { id: 2, key: "TIER_2", name: "Semi-olahan", description: "Bahan yang telah mengalami pengolahan awal.", examples: ["tepung", "baja", "plastik"], schoolBuffPercent: 10 },
    { id: 3, key: "TIER_3", name: "Industri", description: "Produk industri atau produk olahan lanjutan.", examples: ["mobil", "elektronik", "makanan kaleng"], schoolBuffPercent: 15 },
    { id: 4, key: "TIER_4", name: "Spesialisasi Nasional", description: "Produk spesialisasi tingkat lanjut.", examples: ["teknologi", "alat berat", "energi bersih"], schoolBuffPercent: 20 }
  ].map(tier => Object.freeze({ ...tier, examples: Object.freeze(tier.examples) }));

  function normalizeTier(value) {
    if (typeof value === "string") {
      const match = value.trim().toUpperCase().match(/^(?:TIER[_ -]?)?([1-4])$/);
      return match ? Number(match[1]) : null;
    }
    return Number.isInteger(value) && value >= 1 && value <= 4 ? value : null;
  }

  function getTier(value) {
    const id = normalizeTier(value);
    return id === null ? null : tiers[id - 1];
  }

  function canAdvance(fromTier, toTier) {
    const from = normalizeTier(fromTier);
    const to = normalizeTier(toTier);
    return from !== null && to !== null && to > from;
  }

  function validateDefinition(definition) {
    if (!definition || typeof definition !== "object") return { ok: false, error: "definition harus berupa objek" };
    const tier = normalizeTier(definition.tier);
    if (tier === null) return { ok: false, error: "tier wajib berupa angka 1-4 atau label TIER_1 sampai TIER_4" };
    if (typeof definition.productId !== "string" || !definition.productId.trim()) {
      return { ok: false, error: "productId wajib diisi" };
    }
    return { ok: true, tier, metadata: getTier(tier) };
  }

  const api = Object.freeze({ tiers: Object.freeze(tiers), normalizeTier, getTier, canAdvance, validateDefinition });
  root.AgroProductionTiers = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
