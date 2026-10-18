# Real Commodity Research Program — Master Blueprint First

Status: research specification created on 2026-10-18. No commodity prices, yields, costs, recipes, or profitability values are finalized by this document. Research proceeds in owner-requested order: all Tier 1 nodes first, then all Tier 2 nodes, then Tier 3 and Tier 4 transformation routes.

## 1. Controlling blueprint and interpretation

The controlling commercial-chain blueprint is the owner's Library file `Agrotycoon file blueprint/harga komoditi.docx`, especially its "Tabel 50 komoditi final" (pages 38–42) and the earlier commodity-by-commodity calculations. It lists 60 commodities after adding mining/energy (pages 42–45). The owner-validated coconut business model remains the reference pattern for how each chain is costed, but coconut's values are not copied to unrelated commodities.

Use the owner's commercial tier meanings from `docs/COMMODITY_CHAIN_TIER_STANDARD.md`:
- **Tier 1:** primary producer / farm, pond, livestock operation, plantation, mine or raw-material source.
- **Tier 2:** collector, tengkulak, first distributor, wholesaler, mill or intermediate market stage as appropriate to that commodity.
- **Tier 3:** retail, lapak, food service or first directly saleable processed product.
- **Tier 4:** further processed/manufactured product and verified by-product/recovery route.

This is a **commercial value-chain tier**. It is separate from the game's production-transformation taxonomy in `js/production_tiers.js` (Mentah, Semi-olahan, Industri, Spesialisasi Nasional). Every record must store both dimensions separately where relevant: `marketStage` and `productionTier`.

## 2. Blueprint inventory to research

### I. Pangan and horticulture (1–24)
1. Kelapa Super
2. Kelapa Biasa
3. Padi
4. Jagung
5. Cabai Rawit
6. Bawang Merah
7. Kentang
8. Tomat
9. Ketela Rambat / Ubi Jalar
10. Singkong
11. Pisang
12. Mangga
13. Kedelai
14. Pepaya
15. Kacang Tanah
16. Kubis / Kol
17. Wortel
18. Buncis
19. Timun
20. Jambu Biji
21. Bawang Putih
22. Porang
23. Jahe Merah
24. Pisang Cavendish

### II. Peternakan and perikanan (25–36)
25. Ayam Petelur
26. Ayam Pedaging
27. Sapi Potong
28. Sapi Perah
29. Kambing
30. Lele
31. Udang
32. Nila
33. Telur Bebek
34. Ikan Tuna
35. Ikan Bandeng
36. Ayam Kampung (Daging)

### III. Perkebunan and rempah (37–50)
37. Kopi Robusta
38. Kopi Arabika
39. Kakao
40. Sawit / TBS
41. Cengkeh
42. Pala
43. Vanili Kering
44. Tebu
45. Teh Pucuk Basah
46. Lada Putih
47. Lada Hitam
48. Karet / Lateks
49. Cokelat Olahan
50. Gula Aren Cair

### IV. Pertambangan and energy (51–60)
51. Bijih Besi
52. Batu Bara
53. Emas
54. Nikel
55. Bauksit
56. Gas Alam Cair (LNG)
57. Minyak Mentah
58. Plastik / bahan baku
59. Semen
60. Tembaga

The original blueprint includes example Coin-profit figures, crop cycles, yields and margins. Those are **hypotheses/owner game-design inputs until independently verified**, not automatically real-world facts. The existing figures must not be presented as "real data" merely because they are written in the blueprint. Retain the original values in the source document; create separate research-backed records and reconcile discrepancies explicitly.

## 3. Required research sequence

### Phase A — Tier 1 for all 60 commodities
Research farmgate/producer/source data before downstream stages:
- producer selling price and transaction basis (farmgate, live weight, wet/dry, grade, variety, quality);
- production yield and cycle duration for the stated scale, geography and method;
- input bill: seed/seedling/DOC/fingerling/stock, feed, fertilizer, pesticides/medicine, water, electricity/fuel, labor, land rent, machinery, maintenance and mortality/losses;
- production infrastructure and biological/physical constraints (soil, climate, pond/cage stocking density, feed conversion ratio, animal housing/temperature/ventilation/biosecurity, water quality, mine grade/recovery/energy and permit requirements);
- harvest, post-harvest, storage and unsold/waste rate;
- fixed capital and depreciation separately from variable cost.

### Phase B — Tier 2 for all 60 commodities
For each real intermediary node, collect actual purchase and sale price at the same period/geography/grade, plus freight, loading/unloading, sorting, drying/milling, packaging, cold chain, shrinkage, financing, fees, taxes and payment terms. A Tier 2 price is not automatically a percentage markup over Tier 1.

### Phase C — Tier 3 and Tier 4 for all viable routes
For each retail/food-service/manufacturing/by-product route:
- source-backed recipe or mass-balance / conversion yield;
- exact input quantity and grade, water, energy/heat, labor, packaging, sanitation, machinery and throughput/capacity;
- product and by-product yields, quality loss, shelf life, rejection rate, waste handling and verified market demand;
- retail/processor sale prices for comparable unit, package, quality and geography;
- capex, maintenance, depreciation, compliance, distribution and working-capital costs;
- distinguish gross revenue, contribution margin, operating profit, net profit and opportunity-adjusted profit.
Do not assume a residue has positive value or is free input. Food safety, animal-feed safety and environmental compliance must be evidenced for each recovery route.

## 4. Source hierarchy and evidence protocol

Use multiple independent evidence classes for each commodity, not just national averages:
1. **Direct primary evidence:** dated producer/farmer/farm, livestock keeper, fisher/aquaculture operator, collector, market trader, mill, processor, retailer or cooperative price sheet, invoice, field interview or publicly documented business records. Record exact source, date, location, unit and quality. If the owner supplies an invoice/receipt, keep it labeled owner-provided.
2. **Official local/sector data:** provincial/district agricultural services, market price boards, plantation price decisions, fisheries services, SPORA/Ministry of Agriculture, Bapanas, BPS, Ministry of Energy and Mineral Resources, Ministry of Industry, official procurement/auction/stock exchange data, depending on the commodity.
3. **Research and extension:** Indonesian university research, peer-reviewed agronomy/animal science/aquaculture/mining/process engineering papers, government technical guides and cost-of-production studies.
4. **Commercial corroboration:** dated trader listings, processor quotations, marketplace listings and supplier catalogues. Use as corroboration, not as proof of a completed transaction or producer cost.

For every observation preserve:
- `commodityId`, `marketStage`, `productionTier` (if applicable), product form/grade, quantity and unit;
- value, currency, price type (actual transaction, official observation, quotation, asking price, administered price);
- source URL/document and named publisher/person/business (where publicly available);
- observation date, period, geography, farm/market/processor stage;
- methods, sample size, uncertainty/range, tax/shipping inclusion and access date;
- evidence class: `official_observation`, `direct_business_observation`, `research_observation`, `derived_from_source`, `game_parameter`, or `experimental_assumption`.

Never merge incomparable units or stages. Convert only with a documented formula and source-backed yield. Keep point estimate and observed range separately. Record contradictions instead of averaging them blindly. No source or unknown cost/yield = `null`, not zero. A price source does not prove cost, yield or profit. Profit may only be calculated after the complete cost and output balance is supported.

## 5. Initial source leads verified during reconnaissance (2026-10-18)

- BPS, *Statistik Harga Produsen Pertanian Subsektor Tanaman Pangan, Hortikultura, dan Tanaman Perkebunan Rakyat 2025*, released 24 April 2026. Monthly producer prices for food crops, horticulture and smallholder plantations across 37 provinces (DKI excluded): https://www.bps.go.id/id/publication/2026/04/24/ab557ad3c44be1254c87c5aa/statistik-harga-produsen-pertanian-subsektor-tanaman-pangan-hortikultura-dan-tanaman-perkebunan-rakyat-2025.html
- Bapanas, *Rata-rata Harga Pangan Bulanan Tingkat Produsen Nasional*: monthly farmgate/producers for selected crops, livestock and staples; use exact period and product stage, not as current price by default: https://data.badanpangan.go.id/datasetpublications/3iw/rata-rata-harga-pangan-bulanan-produsen-nasional
- Kementan Ditjen PKH, SPORA feed production/price system. Reconnaissance page exposes feed prices and series for broiler/layer stages; verify the exact observation period before use: https://simpakan.ditjenpkh.pertanian.go.id/spora/backend/web/site/landing
- Kementan, 6 March 2026 report of SPORA feed prices: BR1 average Rp8,010/kg, BR0 Rp8,451/kg, BR2 Rp7,967/kg, layer P3 Rp6,803/kg and layer concentrate KP3 Rp7,735/kg, with stated producer-plant samples. These are dated feed-manufacturer averages, not a universal farm-delivered price: https://ditjenpkh.pertanian.go.id/index.php/berita/harga-pakan-terpantau-turun-kementan-biaya-produksi-peternak-diharapkan-lebih-efisien
- Kementan Hortikultura field report quoting a farmer in Langensari, Bandung Barat: reported capital Rp80–100 million and production cost Rp15–18 thousand/kg for red curly chili under that local context; treat as a named/local report requiring date/season and methodology confirmation, not a national cost: https://hortikultura.pertanian.go.id/bandung-barat-penyangga-cabai-merah-keriting-jabodetabek/
- BPS producer-price annual publication should be used alongside the local farm/market/processor evidence, not as the only source. For aquaculture, mines, factories and processed foods, find sector-specific source families; do not extrapolate crop-price sources to them.

## 6. Coconut master blueprint as the reference method, not universal values

Preserve `docs/ES_KELAPA_OWNER_BENCHMARK.md` exactly for owner-entered values: whole coconut sold direct Rp13,000/butir, es kelapa Rp5,000/glass, 4 glasses per coconut, no milk, syrup allowance Rp20,000 per approximately 1 L batch/50 servings, ice Rp20,000/40 portions, cup Rp15,000/50 pieces. The current listed non-coconut consumables subtotal is Rp1,200/glass; four glasses yield Rp20,000 revenue and a Rp7,000 uplift over direct whole-fruit sale before consumables; after the listed four-serving consumables, the comparison subtotal is Rp2,200 before coconut opportunity cost, labor, water, fuel, spoilage, transport, utilities and fixed costs. This is **not net profit**. Do not overwrite the owner price with national coconut averages.

Use the same calculation discipline for every commodity: compare like-for-like product, quantify conversion yield and loss, count all relevant costs once, include internal-input opportunity cost for integrated chains, and do not publish a profit value when required evidence is incomplete.

## 7. Research gate before any data is written as final

A commodity-stage record may be marked `verified` only when:
- at least one direct/sector primary source and one independent corroborating source are present where realistically available;
- date, geography, grade/form, stage and unit are known;
- all calculations reconcile and units/mass balance are checked;
- feed/fertilizer/energy/labor/infrastructure and losses relevant to the production method are represented;
- uncertainty and conflicting observations are recorded;
- source-backed cost/yield coverage is sufficient for the specific claim. Price-only evidence may verify a price observation, never full profitability.

Use statuses `researching`, `price_observed`, `cost_yield_partial`, `economics_reconciled`, `verified_for_game`, and `blocked_missing_evidence`. No tier is "complete" just because every row has a number.

## 8. Work log

- 2026-10-18: read the repository tier contracts and owner coconut benchmark, inspected the complete 60-commodity owner blueprint, and confirmed that many values in the blueprint are labeled assumptions or lack primary citations. Do not ingest those values as verified real data.
- 2026-10-18: initial source reconnaissance located BPS producer prices, Bapanas producer price series, Kementan SPORA feed prices and one local horticulture farmer report. This is a source map, not completed per-commodity research.
- Next: audit and source Tier 1 for commodities 1–60. Store evidence observations in a separate research registry and do not change game prices until each relevant source and calculation is reviewed. Then move to Tier 2, followed by Tier 3/4.


## Work log update — dated price extraction and livestock/feed source triangulation (2026-10-19)

- Extracted January 2026 Bapanas producer-price observations for GKP paddy, GKG at mill, medium/premium rice at mill, dry shelled maize, dry soybean, curly/big/bird's-eye red chili, shallot, live cattle and eggs. Values and stage/unit caveats are recorded in `docs/REAL_COMMODITY_TIER1_RESEARCH.md`; these are national averages from selected representative respondents, not direct invoices or full economics.
- Added the separate BPS 2025 livestock/fisheries producer-price publication (38 provinces, monthly) as a source family, and recorded Kementan's March 2026 sampled feed-mill prices by phase. Feed factory averages are not treated as delivered farm costs.
- Critical data-quality issue: Bapanas table metadata/labels for poultry may not be consistent across page views. Before importing the broiler observation into a machine-readable registry, verify the original CSV/XLSX field unit and whether the observation is per bird or per kg live weight. No silent unit conversion.
- Tier 1 remains incomplete across the 60-commodity blueprint. Direct operator/farmer/trader evidence and full input-yield-cost accounting are still missing for many rows. No game balance or owner-locked coconut values changed.


## Work log update — direct producer/operator and technical evidence (2026-10-19)

- Added commodity-specific source observations to the Tier 1 ledger: named tomato farmer Pangalengan (1 ha, reported Rp100.8m cost, 40t yield, Rp3,000/kg price; historical and incomplete ledger); Candi Mulyo/Wonosari coffee grower-group report (cherry-to-green-bean conversion and separate robusta/arabica price contexts); KKP operator testimony on catfish feed/FCR; KKP technical study for catfish FCR and cycle duration; KKP biofloc project-scale cost scope; and the official SIPASBUN provincial TBS pricing portal.
- Explicitly preserved context differences and uncertainty: none of these observations is treated as a current universal value. Tomat reported gross revenue/cost arithmetic reconciles to Rp19.2m before unreported costs, approximately the article's Rp19m claim. Coffee cherry and green-bean stages remain distinct. Catfish earthen-pond experimental data are not merged with biofloc commercial-scale costs. TBS portal did not return a stable numeric value, so none was invented.
- Tier 1 remains incomplete; no final margin or game value changed. Continue source-by-source coverage for all 60 commodities before Tier 2, then Tier 3/4.


## Work log update — additional producer and production-system evidence (2026-10-19)

- Added a second source-research tranche to the Tier 1 ledger covering a local 2025 rice budget document and a separate 2023 rice-cost study; a Kementan-quoted tomato grower; regulated broiler DOC price stages; phase-specific March 2026 feed-mill averages and a 3,500–5,000-bird layer-farm context; a Demak feed operator/buyer testimony plus KKP catfish technical and biofloc cases; an Indramayu tilapia operator and KKP biofloc planning table; 2024–2025 coffee averages plus a Central Java coffee cooperative's post-harvest case; and the oil-palm provincial TBS price portal and June 2026 policy context.
- Reconciliation safeguards: rice budgets have different year/population and are not averaged; feed mill prices are not farm-delivered prices; DOC loco-factory and farm-level regulated values remain separate; catfish earthen pond and biofloc systems remain separate; tilapia gross/cost arithmetic is shown explicitly and not promoted to verified net profit; coffee cherry and green bean are not merged; TBS current price remains blank until a stable provincial period row is extracted.
- Research-only update. No commodity price/cost/yield/recipe/margin or owner-locked coconut game parameter changed. Tier 1 remains incomplete for all 60 commodities. Continue with source-specific rows and triangulation; do not advance to Tier 2/3/4 final values until Tier 1 is reconciled.


## Work log update — horticulture source triangulation tranche (2026-10-19)

- Added commodity-specific source notes for shallot: Brebes producer price vs Jakarta wholesale-market observation and seed-grown vs bulb-seed yield comparison; red bird's-eye chili: direct farmer-reported glut/grade-sensitive farmgate price plus a distinct one-hectare rainy-season input budget and a separate PM-999 contract-budget example; potato: reported 120-day yield/cost/farmgate-price range; porang: literature-review yield/price/cost ranges with a primary-study traceability warning.
- Key quality flags: the onion prices are dated and stage-specific; the chili price crash was for mixed unsorted grade; the two chili budgets are not comparable; porang review values must be traced to original studies and its profit claims recalculated. None is treated as a current universal game price or verified net margin.
- Research-only documentation update; no game data, recipes, costs, yields or owner-locked coconut parameters changed. Tier 1 across all 60 commodities remains incomplete. Continue primary source extraction and reconcile all cost/yield/grade/stage dimensions before Tier 2/3/4.


## Work log update — soybean, cassava, ginger and animal/aquaculture dependencies (2026-10-19)

- Added a supervised soybean technology package (79 farmers/24 ha, specific variety/season, 2.7 t/ha average and Rp7.726m/ha modeled cost) and separately recorded a 2026 farmgate price policy context; they are not merged into one observed margin.
- Added cassava price/discount evidence: a 2025 industrial purchase reference alongside reported factory deductions of 15–38%, plus a September 2026 Lampung-centre price report. Added a red-ginger grower-reported cost/yield/assumed-price scenario and explicitly flagged a second repository cost table for visual verification because extracted rows are garbled.
- Added dairy-farm feed/forage/water/labor/infrastructure dependency evidence and a KKP milkfish operator cost/output case with explicit missing cycle/capex/land context.
- No game balance values or coconut benchmark changed. Tier 1 remains incomplete; do not infer current prices, complete net profit, or move to Tier 2/3/4 final values from partial evidence.


## Work log update — mining and energy benchmark mapping (2026-10-19)

- Added official March 2026 HBA coal quality-indexed reference prices; January 2026 nickel HMA benchmark with explicit warning that it is metal benchmark, not nickel-ore HPM; September 2026 ICP crude-oil benchmark; and LNG/industrial-gas source mapping distinguishing upstream gas, liquefied LNG, plant-gate gas and export/regasified routes.
- Set explicit blocked/source-needed status for iron ore, gold, bauxite, copper, generic plastics and cement until product form/grade and producer-gate transaction data are located. No mine-gate price or margin was inferred from a metal/energy benchmark.
- Research-only documentation update; no game values or coconut benchmark changed. Tier 1 remains incomplete for the full 60-commodity blueprint; all mining/manufacturing rows need product-node definitions, quality basis and complete costs before Tier 2/3/4.


## Work log update — Bapanas metadata/unit audit (2026-10-19)

- Rechecked the Bapanas producer-price page metadata and visible table. The metadata's unit description for poultry conflicts with the row label/value: chicken is shown as “Rp/Ekor Hidup” (Rp22,971/bird for January 2026), while generic metadata says Rp/kg live weight for cattle/chicken. The chicken observation is quarantined from canonical per-kg use until the original CSV/XLSX schema and calculation are verified.
- Confirmed that the currently visible series runs through January 2026; do not describe it as October 2026 current price. Documented the visible January 2026 observations and dataset method/validity date in the Tier 1 ledger.
- No game data changed. Tier 1 remains in progress; continue raw-file validation and source matching.


## Work log update — vaname shrimp farm variation and downside evidence (2026-10-19)

- Added three KKP-linked sources for vaname grow-out: a Cianjur farm observed in 2025 (99% survival, FCR 1.53; full economics still to extract), a Bangka Selatan farm cycle reporting loss/R/C 0.65 with disease, water-quality and SOP issues, and a West Sumatra company-scale financial abstract whose periods/scales/totals need reconciliation.
- Key design constraint: shrimp economics must include biosecurity, water quality, disease/mortality, aeration, FCR, seed quality and financing; a high selling price does not guarantee a positive cycle. Do not average success and failure cases or turn abstracts into a universal margin.
- No game parameters changed. Tier 1 remains incomplete for the 60-commodity blueprint.


## 2026-10-19 research checkpoint — carrots, Cavendish, tuna and goat operator evidence

- Added source-backed notes to `docs/REAL_COMMODITY_TIER1_RESEARCH.md` (ledger update commit recorded in the Git history) for: a Banjarnegara carrot-glut case with farmer-reported prices below production cost; Cavendish yield and sale-price observations from a primary-data farm study (profit figures quarantined due arithmetic inconsistencies); named tuna species landing prices and a separate Biak cooperative first-sale/cold-chain case; and a Pangandaran goat farmer's reported liveweight-price downturn with feed/housing/labor cost pressure.
- Source links are embedded per commodity in the research ledger. The evidence is deliberately kept as dated/local observations and not merged into a synthetic current price or universal margin.
- No runtime game code, commodity parameters, recipes, yield/cost/margin assumptions, or owner-locked coconut benchmark changed. Tier 1 for all 60 commodities remains incomplete; Tier 2/3/4 remain gated until Tier 1 is reconciled.
- Next: audit the original Cavendish study's cost/revenue tables; extract producer costs and cycle data for remaining food, livestock/fisheries, plantation, and mining/energy rows; then proceed through Tier 2 and Tier 3/4 in the controlling blueprint order.
