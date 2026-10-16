# Es Kelapa Owner Benchmark — Preserve the Field Business Model

Status: corrected the cup-pack inconsistency on `feat/production-tier-taxonomy`. Owner-entered business values are authoritative for this scenario and must not be replaced with national producer/collector prices.

## Owner standards — do not change

- Direct sale of one whole coconut to a customer: **Rp13,000/butir**.
- Es kelapa selling price: **Rp5,000/gelas**.
- One coconut yields **4 glasses** in this model.
- No milk is used. Do not add milk or its cost.
- One approximately 1 L Tupperware of palm-sugar syrup serves **50 glasses**, at one small ladle per glass.
- The syrup batch currently has a **Rp20,000 cost allowance**, or Rp400/glass. This is a provisional cost basis, not a verified recipe mass: the online reference found Rp20,000/kg for gula merah. The actual grams of gula merah used to fill the 1 L Tupperware have not been supplied, so the agent must not claim that every 1 L batch always consumes exactly 1 kg. Water and cooking fuel are not included in the current allowance.
- Ice: Rp20,000 per sack for 40 portions = Rp500/glass.

## Cup cost correction

Previous configuration disagreed with itself:
- Shop input: Rp8,000 / 20 cups = Rp400/cup.
- Existing economical/standard starter packs: Rp15,000 / 50 cups = Rp300/cup.

Marketplace price pages checked on 2026-10-17 show 16 oz cups in 50-piece packs around Rp12,100–Rp18,246 (seller, shape, material and shipping can differ):
- Blibli 16 oz / 50 pcs: https://www.blibli.com/jual/cup-16-oz-50-pcs
- Blibli plastic cups: https://www.blibli.com/jual/cup-plastik

The game configuration now consistently uses the already-present starter-pack reference of **Rp15,000 / 50 cups = Rp300/cup**. This is a market reference/game benchmark, not a claim that the owner's supplier invoice has been verified. If the owner provides their actual purchase receipt, prefer that price.

## Corrected listed consumables subtotal

| Component | Basis | Cost per glass |
|---|---:|---:|
| Ice | Rp20,000 / 40 portions | Rp500 |
| Palm-sugar syrup allowance | Rp20,000 / 50 portions | Rp400 |
| Cup | Rp15,000 / 50 cups | Rp300 |
| **Listed non-coconut consumables subtotal** | | **Rp1,200** |

The old lesson stated Rp1,525 for ice, sugar and cup; no source for the extra Rp325 under the corrected cup price is available. Replace that figure with **Rp1,200 for the three listed non-coconut consumables only**. This is not full HPP: it excludes coconut, labor, water, cooking fuel, spoilage, transport, utilities, and any stand rent or other fixed costs.

## Preserve the difference between direct sale and processing

Using only the owner's game values:
- Four glasses × Rp5,000 = **Rp20,000 sales revenue** from one coconut.
- Selling that same whole coconut directly yields **Rp13,000**.
- Processing therefore creates **Rp7,000 additional revenue before stand consumables and other costs**.
- Four glasses consume listed non-coconut consumables of 4 × Rp1,200 = **Rp4,800**.
- Relative to selling the fruit whole, the processing route leaves **Rp2,200 per coconut before labor, water, cooking fuel, spoilage, transport, utilities, and fixed costs**.

This Rp2,200 is a comparison subtotal, not net profit. If the coconut was bought from a farmer or collector, use the actual purchase cost for that sourcing scenario. If it came from the owner's orchard, show both cash costs of growing/harvesting and the Rp13,000 direct-sale opportunity that was given up. Do not treat the orchard fruit as free, but do not replace the owner's Rp13,000 customer price with a national producer price either.

## Official/market source separation

- The Rp13,000 whole-coconut customer price is an owner-provided direct-sale standard.
- National producer/consumer coconut prices from the Ministry of Agriculture outlook describe different market stages and are comparison data only.
- The Rp20,000/kg gula merah reference is a catalog listing, not proof of the owner's exact ingredient quantity per syrup batch: https://eorder-bppbj.jakarta.go.id/eorder/product/gula-merah-1-kg-29927
- The published syrup recipe is a general comparison, not the owner's recipe: https://food.detik.com/info-kuliner/d-4984817/resep-sirop-gula-merah-yang-kental-dan-harum

## Regression protection

Run:
```sh
node tests/es_kelapa_benchmark.test.js
```

This test locks the owner-entered Rp13,000 whole-coconut price, Rp5,000 glass price, four-glass yield, no-milk rule, 50-serving syrup batch and corrected Rp1,200 listed consumables subtotal. Do not change these standards without explicit owner approval. Keep actual cost, external price comparison, and unverified assumption as separate fields/labels.
