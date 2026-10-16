# Production Tier Contract (Tier 1–4)

Status: implemented as a small, dependency-free metadata module on `feat/production-tier-taxonomy`. The definitions below are transcribed from the owner's Library document `data game.docx`; examples are design examples from that blueprint, not universal scientific classifications.

## Canonical production-transformation tiers

| Tier | Blueprint label | Meaning | Blueprint examples | National School buff |
|---|---|---|---|---:|
| 1 | Mentah | Raw production/material | Beras, besi, karet | 0% |
| 2 | Semi-olahan | Semi-processed input/material | Tepung, baja, plastik | +10% for the related major |
| 3 | Industri | Industrial/manufactured product | Mobil, elektronik, makanan kaleng | +15% for the related major |
| 4 | Spesialisasi Nasional | Advanced/national-specialization product | Teknologi, alat berat, energi bersih | +20% for the related major |

Blueprint rules:
- Upgrading a tier requires an approval proposal and substantial costs; exact costs are not specified by this table and must not be invented.
- Tier 4 opens cross-world contracts or alliances.
- The related school/major bonus is a game-design parameter stated in the blueprint, not a verified real-world productivity effect.

## Important distinction: production tier vs. market channel

The Library file `harga komoditi.docx` also has commodity tables with columns such as Tier 1 (farm/pond/producer), Tier 2 (distributor), and Tier 3 (retail/processed). These columns describe a commercial/market-stage progression in that table. They are **not the same axis** as the production-transformation taxonomy above. Some rows also refer to Tier 4 manufacturing/processing products. Do not use a market stage as a production tier, or overwrite producer/wholesale/retail prices with one another.

Represent these as separate fields:
- `productionTier`: integer 1–4, according to the production transformation.
- `marketStage`: a separate value such as `producer`, `collector`, `wholesale`, `retail`, `factory`, or `direct`; only use a stage when the underlying record actually supports it.

## Implementation

`js/production_tiers.js` exports `AgroProductionTiers`:
- `tiers`: immutable metadata for tiers 1–4.
- `normalizeTier(value)`: accepts 1–4 or labels like `TIER_2`, returns null for invalid values.
- `getTier(value)`: returns tier metadata or null.
- `canAdvance(fromTier, toTier)`: true only for valid strictly upward transitions.
- `validateDefinition({productId, tier})`: validates a minimal product definition; it does not assert real-world provenance or profitability.

Test file: `tests/production_tiers.test.js`; run with `node tests/production_tiers.test.js`.

## Not implemented yet

This commit deliberately does not invent per-commodity recipes, costs, yields, land suitability, cycle duration, factory conversion ratios, or historical prices. Those require a per-commodity source-backed vertical slice and explicit mappings. Existing `js/market_chain.js` remains the separate market-stage price reference. A production tier assignment alone must not create a market price or claim an item is empirically validated.
