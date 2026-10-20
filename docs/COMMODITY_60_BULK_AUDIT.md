# 60-Commodity Bulk Evidence Audit

Status: **bulk audit initiated; no economic parameters promoted to runtime**. Date: 2026-10-19. Branch: `feat/production-tier-taxonomy`.

## Operating rule

Research all 60 owner-listed commodities in one coordinated matrix. Do not serialize work as one completed commodity per session. Use shared official datasets across all applicable rows, then mark each row independently by evidence coverage. A missing value is recorded as `not found / not comparable / needs targeted source`, never guessed. This is a research workflow change only; it does not authorize runtime price, yield, recipe, cost, margin, or ID changes.

## Shared-source bundles (apply in parallel to every relevant row)

1. **Food crops, horticulture, smallholder plantations:** BPS, *Statistik Harga Produsen Pertanian Subsektor Tanaman Pangan, Hortikultura, dan Tanaman Perkebunan Rakyat 2025*, released 2026-04-24. Monthly producer prices across 37 provinces; use exact commodity, month, province, unit, grade, and product form. https://www.bps.go.id/id/publication/2026/04/24/ab557ad3c44be1254c87c5aa/statistik-harga-produsen-pertanian-subsektor-tanaman-pangan-hortikultura-dan-tanaman-perkebunan-rakyat-2025.html
2. **Livestock and fishery prices:** BPS, *Statistik Harga Produsen Pertanian Subsektor Peternakan dan Perikanan 2025*, released 2026-04-24; monthly rural producer-price survey across 38 provinces. Distinguish live weight, carcass, eggs, milk, landed fish and farmed harvest. https://www.bps.go.id/id/publication/2026/04/24/471c9fc5982e7c8927c362f8/statistik-harga-produsen-pertanian-subsektor-peternakan-dan-perikanan-2025.html
3. **Agricultural costs:** BPS, *Hasil Survei Ekonomi Pertanian (SEP) 2024: Nilai dan Biaya Produksi Beberapa Komoditas Utama...*, released 2025-01-24. Apply only to commodities and production systems actually covered; do not extrapolate a surveyed farm cost to every cultivar or region. https://www.bps.go.id/id/publication/2025/01/24/8faa8436999bb9b54ba0b7a9/hasil-survei-ekonomi-pertanian--sep--2024--nilai-dan-biaya-produksi-beberapa-komoditas-utama-pada-subsektor-tanaman-pangan--hortikultura--dan-perkebunan.html
4. **Production/population and area:** Kementerian Pertanian, *Statistik Pertanian 2025*, and relevant directorate statistics. Production volume is not itself unit cost, yield guarantee, or profit. https://repository.pertanian.go.id/handle/123456789/29539
5. **Mining/energy/manufacturing:** commodity-specific ESDM, Ditjen Minerba, BPS industrial statistics, SKK Migas/ESDM, and official benchmark-price regulations where applicable. Distinguish mine gate/wellhead from export, smelter, refinery, factory-gate and delivered prices. Benchmark price is not automatically realized netback.
6. **Owner blueprint:** `Agrotycoon file blueprint/harga komoditi.docx` controls the 60 names and intended chain. It is an inventory/chain blueprint, not empirical proof of prices, yields, costs or margins.
7. **Runtime crosswalk:** `docs/COMMODITY_INVENTORY_CROSSWALK.md`; maintain separate canonical node IDs for different cultivars, product forms and stages. No silent aliasing.

## Unified 60-row coverage matrix

Evidence labels:
- **PENDING**: row-level evidence still needs extraction/reconciliation.
- **PARTIAL**: some usable category-level evidence exists, but the row is not ready for game parameters.
- **LOCKED**: only the owner-approved es kelapa benchmark is locked; no other commodity inherits its values.

| # | Owner commodity | Primary evidence bundle | Key unit/form gate | Current status |
|---:|---|---|---|---|
| 1 | Kelapa Super | BPS plantation + owner benchmark | grade, butir, harvest cycle | LOCKED benchmark only; split grade pending |
| 2 | Kelapa Biasa | BPS plantation | butir, grade, farmgate | PARTIAL; no parameter promotion |
| 3 | Padi | BPS producer price + BPS/Kementan production/cost | GKP vs GKG vs milled rice | PARTIAL; stage separation required |
| 4 | Jagung | BPS producer price + crop stats | fresh cob vs dry shelled grain, moisture | PARTIAL |
| 5 | Cabai Rawit | BPS producer price + SEP/crop studies | cultivar, kg, season, spoilage | PARTIAL; historical producer evidence only |
| 6 | Bawang Merah | BPS/Kementan historical producer prices + crop stats | seed bulb vs cured harvest | PARTIAL; 2021–2024 national producer-price series, exact form/grade still pending |
| 7 | Kentang | BPS/Kementan historical producer prices + crop stats | variety, grade, altitude | PARTIAL; 2021–2024 national producer-price series, variety/grade still pending |
| 8 | Tomat | Kementan/BPS producer price + crop stats | grade, season, post-harvest loss | PARTIAL; table 2.20 p.38 has 2020–2024 provincial producer prices |
| 9 | Ketela Rambat / Ubi Jalar | BPS/Kementan historical producer prices + crop stats | fresh tuber, variety | PARTIAL; 2021–2024 national producer-price series, variety still pending |
| 10 | Singkong | BPS/Kementan historical producer prices + crop stats | fresh roots vs industrial/starch basis | PARTIAL; 2021–2024 national producer-price series, buyer/product basis pending |
| 11 | Pisang | BPS/Kementan historical producer prices + crop stats | cultivar, bunch/kg, grade | PARTIAL; generic banana price is Rp/sisir; cultivar/runtime collision remains |
| 12 | Mangga | BPS/Kementan historical producer prices + orchard studies | cultivar, bearing age, kg/tree | PARTIAL; national annual producer-price series exists, cultivar/grade still pending |
| 13 | Kedelai | BPS producer price + crop stats | moisture, grade, seed vs consumption | PARTIAL; national producer price sample exists |
| 14 | Pepaya | Kementan/BPS producer price + crop stats | cultivar, harvest frequency | PARTIAL; table 2.24 p.42 has 2020–2024 provincial producer prices |
| 15 | Kacang Tanah | BPS/Kementan historical producer prices + crop stats | in-shell vs shelled | PARTIAL; national annual price series exists, in-shell/shelled basis pending |
| 16 | Kubis / Kol | Kementan/BPS producer price + crop stats | grade, altitude, spoilage | PARTIAL; table 2.18 p.36 has 2020–2024 provincial producer prices |
| 17 | Wortel | Kementan/BPS producer price + crop stats | grade, altitude, washed/unwashed | PARTIAL; table 2.21 p.39 has 2020–2024 provincial producer prices |
| 18 | Buncis | Kementan/BPS producer price + crop stats | fresh pods, grade | PARTIAL; table 2.11 p.29 has 2020–2024 provincial producer prices; runtime ID missing |
| 19 | Timun | Kementan/BPS producer price + crop stats | fresh cucumber, grade | PARTIAL; table 2.17 p.35 has 2020–2024 provincial producer prices |
| 20 | Jambu Biji | BPS producer price + crop stats | cultivar, grade, harvest frequency | PENDING; runtime ID missing |
| 21 | Bawang Putih | BPS/Kementan historical producer prices + import/trade data | local/imported, cured bulbs | PARTIAL; national annual producer-price series exists, local/imported split pending |
| 22 | Porang | BPS/Ministry + peer-reviewed agronomy | corm age/size, wet/dry chips, glucomannan | PENDING; runtime ID missing |
| 23 | Jahe Merah | BPS producer price + crop studies | red ginger vs generic ginger, fresh/dry | PENDING |
| 24 | Pisang Cavendish | BPS + export/contract evidence | cultivar, export grade, carton/kg | PENDING; separate from generic banana |
| 25 | Ayam Petelur | BPS/Kementan historical producer prices + poultry production data | egg grade, hen cycle, feed/FCR, spent hen | PARTIAL; egg price per kg exists, no matched layer cost/yield bundle |
| 26 | Ayam Pedaging | BPS livestock prices + poultry production data | DOC, live weight, carcass yield, mortality | PENDING |
| 27 | Sapi Potong | BPS/Kementan historical producer prices + livestock cost studies | liveweight vs carcass; breeding vs fattening | PARTIAL; liveweight price series exists, production-system costs pending |
| 28 | Sapi Perah | BPS livestock prices + dairy production data | liters/kg milk, lactation, feed, replacement | PARTIAL; national milk production exists |
| 29 | Kambing | BPS/Kementan historical producer prices + husbandry studies | liveweight, age, breeding vs meat | PARTIAL; liveweight price series exists, age/system costs pending |
| 30 | Lele | BPS fishery prices + aquaculture studies | pond system, stocking, FCR, harvest grade | PENDING |
| 31 | Udang | BPS fishery prices + aquaculture studies | vannamei species, size count, survival, FCR | PENDING |
| 32 | Nila | BPS fishery prices + aquaculture studies | pond/cage, grade, FCR | PENDING |
| 33 | Telur Bebek | BPS livestock prices + poultry stats | eggs per duck, grade; not live duck | PARTIAL; production table available |
| 34 | Ikan Tuna | BPS fishery + capture-fisheries statistics | species, landed weight, grade, vessel cost | PENDING |
| 35 | Ikan Bandeng | BPS fishery + aquaculture studies | pond cycle, size, survival, grade | PENDING |
| 36 | Ayam Kampung (Daging) | BPS livestock + native chicken studies | native chicken vs broiler, live/carcass | PARTIAL; native-chicken egg series is not meat evidence |
| 37 | Kopi Robusta | BPS/Kementan historical producer prices + trade/quality sources | Robusta, cherry/green bean/roasted | PARTIAL; national price series exists, cherry/green-bean basis pending |
| 38 | Kopi Arabika | BPS plantation + trade/quality sources | Arabica, cherry/green bean/roasted | PENDING |
| 39 | Kakao | Kementan/BPS plantation + processing/trade sources | wet bean, fermented dry bean, cocoa liquor | PARTIAL; table 2.33 p.51 has 2020–2024 provincial prices; moisture/fermentation basis unresolved |
| 40 | Sawit (TBS) | Kementan/BPS plantation + provincial FFB pricing rules | FFB/TBS, age, extraction rate | PARTIAL; table 2.30 p.48 has provincial prices; confirm equivalence to TBS pricing formula |
| 41 | Cengkeh | BPS/Kementan historical producer prices + production stats | wet vs dry cloves, moisture/grade | PARTIAL; dry-clove national price series exists, moisture/grade basis pending |
| 42 | Pala (Biji) | Kementan/BPS plantation price + production stats | wet fruit, dried seed, kernel, mace | PARTIAL; table 2.36 p.54 has provincial prices, but product form unresolved |
| 43 | Vanili Kering | BPS plantation + curing studies | cured dry beans, recovery rate, grade | PENDING |
| 44 | Tebu | BPS plantation + sugar-industry sources | cane tonnage, sugar recovery, mill payment | PENDING |
| 45 | Teh Pucuk Basah | BPS plantation + tea factory data | fresh leaf, plucking standard, factory yield | PENDING |
| 46 | Lada Putih | BPS plantation + trade sources | white pepper, moisture, grade | PENDING |
| 47 | Lada Hitam | BPS plantation + trade sources | black pepper, moisture, grade | PENDING |
| 48 | Karet (Lateks) | Kementan/BPS plantation + rubber market sources | latex, wet slab, dry rubber content | PARTIAL; table 2.31 p.49 covers thick rubber, not automatically liquid latex |
| 49 | Cokelat Olahan | BPS industry + manufacturer cost evidence | product recipe, cocoa content, packaging | PENDING; Tier 3/4 output |
| 50 | Gula Aren (Cair) | Kementan/technical studies + market sources | sap volume, Brix/concentration, yield | PENDING |
| 51 | Bijih Besi | ESDM/mining reports + official benchmark | ore grade, moisture, recovery, mine gate | PENDING |
| 52 | Batu Bara | ESDM + HBA/benchmark and realized sales | calorie, sulfur, ash, moisture, netback | PENDING |
| 53 | Emas | ESDM + refinery/market sources | ore, doré, refined bullion; recovery | PENDING |
| 54 | Nikel | ESDM + HPM/benchmark and mine reports | laterite grade, moisture, ore product | PENDING |
| 55 | Bauksit | ESDM + benchmark and processing sources | grade, silica/alumina, washed ore | PENDING |
| 56 | Gas Alam Cair (LNG) | ESDM/SKK Migas + LNG chain sources | upstream gas vs liquefaction/export LNG | PENDING |
| 57 | Minyak Mentah | ESDM/SKK Migas + ICP and production reports | wellhead quality vs benchmark vs netback | PENDING |
| 58 | Plastik (Bahan Baku) | BPS industry + resin market sources | resin type (PE/PP/PVC/PET), grade, factory gate | PENDING |
| 59 | Semen | BPS manufacturing + industry energy/cost sources | cement vs clinker, bag/bulk, delivered/factory gate | PENDING |
| 60 | Tembaga | ESDM + benchmark/producer reports | ore, concentrate, cathode, recovery | PENDING |

## Current cross-cutting evidence available

- BPS 2025 agricultural producer-price publication provides monthly producer prices for food crops, horticulture and smallholder estate crops in 37 provinces (excluding DKI Jakarta).
- BPS 2025 animal-husbandry/fishery producer-price publication provides monthly producer prices across 38 provinces.
- BPS SEP 2024 provides production value and production cost for **selected main commodities**, not every one of the 60 rows.
- Kementan *Statistik Pertanian 2025* supplies five-year agriculture series across upstream inputs, production/population, downstream trade/prices and support sectors.
- Example values already captured in the research ledger include June 2025 national producer prices for GKP paddy (Rp6,714/kg), dry shelled maize (Rp4,883/kg), dry soybean seed (Rp9,258/kg), curly red chili (Rp21,216/kg) and red bird's-eye chili (Rp37,245/kg). These are dated producer-price observations, not full unit economics and must not be silently generalized across provinces or periods.

## Required row fields before any value can be marked game-ready

For each owner row capture: source URL/title/table/page; release and observation date; province/region; exact commodity/cultivar/grade; product form and moisture; unit and conversion basis; farmgate/mine-gate/factory-gate/export stage; production yield and cycle; input quantities; labor; feed/energy/water; capital/fixed cost; mortality/spoilage/rejected output; transport/fees/tax; uncertainty range; and calculation trail. Keep observed data, derived estimates and game-balance assumptions in separate columns.

## Acceptance and reporting

- Bulk coverage is measured across all 60 rows; individual rows can remain incomplete without blocking extraction for others.
- Never label a row complete based on a category-level source alone.
- Never calculate “net profit” from selling price minus variable inputs if labor, fixed costs, losses and transport are omitted.
- Keep `productionTier` separate from `marketStage`.
- Do not alter runtime catalogue IDs, prices, yields, recipes, costs or margins until the owner mapping and save-migration gates in `docs/COMMODITY_INVENTORY_CROSSWALK.md` are satisfied.
- Update this file, `docs/REAL_COMMODITY_RESEARCH_PROGRAM.md`, `docs/REAL_COMMODITY_TIER1_RESEARCH.md`, and `docs/AGENT_HANDOFF.md` at bulk checkpoints; report evidence coverage across the whole set, not only the last row worked.


## 2026-10-20 — bulk producer-price extraction checkpoint

This checkpoint adds concrete dated observations from the national producer-price dataset to the shared evidence pool. These are historical observations for cross-row calibration and source matching, not automatic game prices. Dataset pages:
- Bapanas monthly national producer prices, published update “Angka November 2025”: https://data.badanpangan.go.id/datasetpublications/no2/rata-rata-harga-pangan-bulanan-produsen-nasional
- BPS agricultural producer prices 2025, released 2026-04-24: https://www.bps.go.id/id/publication/2026/04/24/ab557ad3c44be1254c87c5aa/statistik-harga-produsen-pertanian-subsektor-tanaman-pangan-hortikultura-dan-tanaman-perkebunan-rakyat-2025.html
- BPS livestock/fishery producer prices 2025, released 2026-04-24: https://www.bps.go.id/id/publication/2026/04/24/471c9fc5982e7c8927c362f8/statistik-harga-produsen-pertanian-subsektor-peternakan-dan-perikanan-2025.html

### National producer-price observations found in the Bapanas dataset

| Commodity / stage | Period | Observation | Unit | Potential owner row(s) | Caveat |
|---|---|---:|---|---|---|
| GKP, farmer level | 2025-06 | Rp6,714 | Rp/kg | #3 Padi | GKP only; not milled rice or GKG |
| Dry shelled maize, farmer | 2025-06 | Rp4,883 | Rp/kg | #4 Jagung | Dry shelled grain; not sweet corn/cob |
| Dry soybean seed, farmer | 2025-06 | Rp9,258 | Rp/kg | #13 Kedelai | Dry seed basis |
| Curly red chili, farmer | 2025-06 | Rp21,216 | Rp/kg | adjacent comparator for #5 Cabai Rawit | Not rawit; do not substitute |
| Red bird's-eye chili, farmer | 2025-06 | Rp37,245 | Rp/kg | #5 Cabai Rawit | National mean; date and market scope remain attached |
| Shallot, farmer | 2025-06 | Rp24,559 | Rp/kg | #6 Bawang Merah | National mean; grade/region spread not yet extracted |
| Live cattle | 2025-06 | Rp52,777 | Rp/kg live weight | #27 Sapi Potong | Liveweight, not carcass/meat price |
| Ayam Ras (live) | 2025-06 | Rp20,073 | Rp/ekor hidup (per bird) | #26 Ayam Pedaging | Bapanas dataset metadata explicitly states per bird; NOT Rp/kg and cannot be compared to liveweight cattle without a bird-weight conversion source |
| Eggs from layer chickens | 2025-06 | Rp24,595 | Rp/kg | #25 Ayam Petelur | Egg output price, not full layer-farm economics |
| GKP, farmer level | 2025-11 | Rp6,748 | Rp/kg | #3 Padi | Different period from June observation |
| Dry shelled maize, farmer | 2025-11 | Rp5,992 | Rp/kg | #4 Jagung | Different period from June observation |
| Dry soybean seed, farmer | 2025-11 | Rp9,385 | Rp/kg | #13 Kedelai | Different period from June observation |
| Curly red chili, farmer | 2025-11 | Rp44,158 | Rp/kg | comparator only | Not rawit; seasonal variation substantial |
| Red bird's-eye chili, farmer | 2025-11 | Rp25,203 | Rp/kg | #5 Cabai Rawit | National mean; do not use as current 2026 price |
| Shallot, farmer | 2025-11 | Rp24,925 | Rp/kg | #6 Bawang Merah | National mean |
| Live cattle | 2025-11 | Rp52,496 | Rp/kg live weight | #27 Sapi Potong | Liveweight basis |
| Ayam Ras (live) | 2025-11 | Rp22,221 | Rp/ekor hidup (per bird) | #26 Ayam Pedaging | Bapanas metadata explicitly states per bird; not a per-kg liveweight price |
| Eggs from layer chickens | 2025-11 | Rp26,185 | Rp/kg | #25 Ayam Petelur | Not net margin or feed-cost evidence |

Source metadata distinguishes Rp/kg from Rp/kg live weight for cattle and **Rp/ekor hidup (per bird) for Ayam Ras**. This is a critical unit correction: the chicken values must not be described as Rp/kg. The official national dataset page now exposes January 2026 observations as well; values below are national sampled averages, not game prices. Source page: https://data.badanpangan.go.id/datasetpublications/no2/rata-rata-harga-pangan-bulanan-produsen-nasional

### Shared source coverage refinement

- **Direct dated producer-price observations now recorded:** rice paddy, maize, soybean, red bird's-eye chili, shallot, live cattle, broiler chicken, layer eggs.
- **Comparable but not interchangeable:** curly red chili provides a seasonal comparison, not a substitute for bird's-eye chili.
- **Other owner rows:** still need row-level extraction from BPS publications or sector-specific official sources. A source being identified does not count as a commodity value extracted.
- **Costs/yields:** no cost or yield values are inferred from these selling prices. Each row still requires its own physical production model and cost coverage.

### Bulk progress accounting

- Inventory coverage: 60/60 rows present in the matrix.
- Concrete dated producer-price observations recorded: 29 listed entries across June/November 2025 and January 2026 (includes separate rice stages and explicitly marked comparator entries; chicken is per bird, not per kg).
- Rows with directly relevant price observations among the 60: 8 owner rows (#3, #4, #5, #6, #13, #25, #26, #27). For #26, the observation is per bird and is not comparable to a per-kg liveweight price without further evidence.
- Rows with fully validated price + cost + yield + loss + fixed-cost model: **0 confirmed by this checkpoint**.
- Runtime parameter changes: none.
- Tests: not run; documentation-only update.


### Additional national producer-price observations — January 2026

The official Bapanas national dataset page also exposes January 2026. The following are additional exact values visible in the published table; preserve the stated stage and units:

| Commodity / stage | Period | Observation | Unit | Potential owner row(s) | Caveat |
|---|---|---:|---|---|---|
| GKP, farmer level | 2026-01 | Rp6,884 | Rp/kg | #3 Padi | GKP, not GKG or milled rice |
| GKG, mill level | 2026-01 | Rp7,980 | Rp/kg | #3 Padi, downstream comparator | Mill-stage GKG; not farmgate GKP |
| Medium rice, mill level | 2026-01 | Rp13,012 | Rp/kg | #3 Padi, downstream comparator | Milled rice, different stage and product form |
| Premium rice, mill level | 2026-01 | Rp14,370 | Rp/kg | #3 Padi, downstream comparator | Milled rice, different stage and product form |
| Dry shelled maize, farmer | 2026-01 | Rp5,810 | Rp/kg | #4 Jagung | Dry grain, not fresh cob |
| Dry soybean seed, farmer | 2026-01 | Rp9,418 | Rp/kg | #13 Kedelai | Dry seed basis |
| Red bird's-eye chili, farmer | 2026-01 | Rp34,122 | Rp/kg | #5 Cabai Rawit | National sampled average; not a local quote |
| Shallot, farmer | 2026-01 | Rp23,915 | Rp/kg | #6 Bawang Merah | National sampled average |
| Live cattle | 2026-01 | Rp52,883 | Rp/kg live weight | #27 Sapi Potong | Not carcass/meat price |
| Ayam Ras (live) | 2026-01 | Rp22,971 | Rp/ekor hidup (per bird) | #26 Ayam Pedaging | Per-bird basis, not per kg; must not convert without matching liveweight data |
| Layer eggs | 2026-01 | Rp26,027 | Rp/kg | #25 Ayam Petelur | Egg output price only |

Source: Bapanas, *Rata-rata Harga Pangan Bulanan Tingkat Produsen Nasional (Angka Januari 2026)*, https://data.badanpangan.go.id/datasetpublications/3iw/rata-rata-harga-pangan-bulanan-produsen-nasional. Dataset metadata says the price unit is Rp/kg, except live cattle (Rp/kg live weight) and Ayam Ras (Rp/ekor hidup). The data is sampled national producer price, not universal regional farmgate price or full unit economics.

### Unit-quality correction

- Earlier text in this file described Ayam Ras values Rp20,073 (June 2025) and Rp22,221 (November 2025) as Rp/kg live weight. That was incorrect. The source metadata explicitly defines Ayam Ras as **Rp/ekor hidup**. This correction supersedes those earlier unit labels.
- As a result, #26 has a dated price observation but does **not** yet have a comparable per-kg price. A conversion would require contemporaneous average liveweight per bird and a matched basis; no such conversion is made here.
- Bapanas dataset page: https://data.badanpangan.go.id/datasetpublications/3iw/rata-rata-harga-pangan-bulanan-produsen-nasional; provincial series: https://data.badanpangan.go.id/datasetpublications/u7t/rata-rata-harga-pangan-bulanan-produsen-provinsi.

## 2026-10-20 — BPS SEP 2024 bulk extraction checkpoint

### Source actually extracted

BPS, *Hasil Survei Ekonomi Pertanian (SEP) 2024 — Nilai dan Biaya Produksi Beberapa Komoditas Utama pada Subsektor Tanaman Pangan, Hortikultura, dan Perkebunan*, Catalogue 5101026, publication 05100.25001, released 2025-01-24. Official publication page: https://www.bps.go.id/id/publication/2025/01/24/8faa8436999bb9b54ba0b7a9/hasil-survei-ekonomi-pertanian--sep--2024--nilai-dan-biaya-produksi-beberapa-komoditas-utama-pada-subsektor-tanaman-pangan--hortikultura--dan-perkebunan.html. The PDF was opened and its table of contents, technical product-form notes, and Tables 2.1–2.3, 2.7–2.10 were read. Values below are national 2024 averages for self-harvested individual agricultural holdings (UTP), not 2025 prices and not game parameters. Table/page references are the printed page numbers in the publication.

| Owner row | BPS table / printed page | Product form stated by BPS | Production value (000 Rp per table basis) | Production cost (000 Rp per table basis) | Income (000 Rp per table basis) | Reported producer price (000 Rp/kg) | Reported cost per unit (000 Rp/kg) | Reported productivity |
|---:|---|---|---:|---:|---:|---:|---:|---|
| #3 Padi | Table 2.1 / p.15 | GKP (gabah kering panen) | 26,369.86/ha | 15,287.59/ha | 11,082.11/ha | 5.76 | 3.59 | 46.35 ku/ha (= 4,635 kg/ha, derived unit conversion) |
| #4 Jagung | Table 2.2 / p.16 | Pipilan kering | 20,943.60/ha | 11,486.06/ha | 9,457.54/ha | 4.97 | 3.13 | 42.94 ku/ha (= 4,294 kg/ha, derived unit conversion) |
| #6 Bawang Merah | Table 2.3 / p.17 | Umbi kering panen dengan daun | 141,997.49/ha | 75,286.09/ha | 66,711.41/ha | 20.63 | 11.62 | 0.73 kg/m² (= 7,300 kg/ha, derived unit conversion) |
| #5 Cabai Rawit | Table 2.7 / p.21 | Buah segar | 103,548.29/ha | 34,607.54/ha | 68,940.75/ha | 28.35 | 15.73 | 0.37 kg/m² (= 3,700 kg/ha, derived unit conversion) |
| #40 Sawit / TBS | Table 2.8 / p.22 | Tandan buah segar (TBS/FFB) | 24,378.94/100 pohon | 10,112.64/100 pohon | 14,266.32/100 pohon | 2.12 | 1.06 | 12,437.86 kg/100 pohon |
| #48 Karet / Lateks | Table 2.9 / p.23 | Lateks | 5,438.61/100 pohon | 1,643.87/100 pohon | 3,794.75/100 pohon | 7.30 | 2.40 | 842.57 kg/100 pohon |
| #1/#2 Kelapa (generic only; not cultivar-separated) | Table 2.10 / p.24 | Buah kelapa segar | 12,788.56/100 pohon | 4,642.55/100 pohon | 8,146.04/100 pohon | 2.65 | 1.11 | 6,072.41 kg/100 pohon |

The price and unit-cost columns are reported by the source in thousand rupiah per kg; multiply by 1,000 for Rp/kg (e.g. paddy Rp5,760/kg and cost Rp3,590/kg). Total value/cost/income are in thousand rupiah on the table's hectare or 100-tree basis. The coconut table is generic fresh coconut in kg, does not split Kelapa Super from Kelapa Biasa, and is not comparable to the owner-locked Rp13,000/butir customer sale benchmark without sourced mass/unit and market-stage reconciliation. Do not overwrite that benchmark.

### Evidence limits and classifications

- marketStage=producer/farm; productionTier=raw (kept separate; the commercial Tier 1–4 sequence is not a production transformation tier).
- Seven source tables yielded seven reported producer-price metrics, seven total-cost metrics, seven per-unit cost metrics, and seven productivity metrics. These are distinct fields from seven tables, not 28 independent studies.
- The tables include input, labor/agricultural-service, fuel, utility and land-rent categories, including imputed rent for owned/rent-free land. BPS notes that some cost/subsidy imputations have not yet been estimated. The tables do not establish complete loss, rejection, unsold-output, depreciation/capex and logistics coverage; do not mark any row as a complete or verified net-profit model.
- Exact product-form definitions are stated in the publication's technical notes (printed pages 2–3); table values are on printed pages 15–24. Evidence class: official_observation; derived kg/ha conversions are derived_from_source.

### 2025 producer-price publication access status

The BPS 2025 crop/horticulture/smallholder-estate publication page was verified (Catalogue 7103012, released 2026-04-24; 19.36 MB): https://www.bps.go.id/id/publication/2026/04/24/ab557ad3c44be1254c87c5aa/statistik-harga-produsen-pertanian-subsektor-tanaman-pangan-hortikultura-dan-tanaman-perkebunan-rakyat-2025.html. Its download endpoint returned a cache-miss error in this research environment; no numeric table from that PDF is claimed extracted in this checkpoint.

The BPS 2025 livestock/fishery producer-price publication page was verified (Catalogue 7103013, released 2026-04-24; 16.32 MB): https://www.bps.go.id/id/publication/2026/04/24/471c9fc5982e7c8927c362f8/statistik-harga-produsen-pertanian-subsektor-peternakan-dan-perikanan-2025.html. The PDF endpoint exceeded the web extraction limit (>10 MiB); no numeric table from that PDF is claimed extracted in this checkpoint. The SEP 2024 livestock publication page (8.14 MB) was found but its download endpoint returned a cache miss; SEP livestock/fishery table rows remain pending.

### Updated coverage counts

- Owner inventory in matrix: 60/60.
- Official source families/publication pages identified in this pass: 7 (Bapanas national producer-price dataset; BPS 2025 crop/estate prices; BPS 2025 livestock/fishery prices; BPS SEP 2024 crop/estate costs; BPS SEP 2024 livestock costs; BPS SEP 2024 fishery costs; Kementan Statistik Pertanian 2025). This is not a count of fully extracted publications.
- Exact producer-price records in the audit ledger: 36 total (29 previously recorded Bapanas observations plus 7 newly extracted SEP 2024 table-level producer-price values; different periods/surveys and product bases remain separate).
- Exact production-cost metrics extracted from SEP tables: 14 (7 table-basis total costs + 7 per-unit costs); exact productivity metrics extracted: 7.
- Owner rows with some price evidence: 12/60, including generic coconut evidence for #1/#2 that is not cultivar-specific; six rows have a directly comparable farm-stage output unit in the extracted SEP table (#3, #4, #5, #6, #40, #48).
- Rows with a price record but still lacking a matched row-level cost/yield bundle: 6 (#1, #2 cultivar-specific match missing; #13; #25; #26 per-bird unit not comparable to kg; #27).
- Complete price + cost + yield + losses + fixed-cost model: 0/60. Economically verified: 0/60. Approved for runtime: 0/60.
- Runtime changes: none. Tests: not run (documentation-only checkpoint).


## 2026-10-20 — Kementan historical producer-price bulk tranche

Added `docs/KEMENTAN_2025_PRICE_BULK_EXTRACTION.md` with the national annual producer-price table from Kementan Pusdatin *Statistik Harga Komoditas Pertanian 2025*. Extracted 104 exact values from Table 2.1 (26 commodity categories × 2021–2024) and 27 non-dash values from Table 1.1 (paddy by farmer/mill stage, quality and year, including limited Jan–Nov 2025 data). Source links, exact series, unit and period limitations are recorded in the extraction ledger.

Interpretation gate: this source adds historical producer-price coverage but does not provide matched costs/yields and does not validate 26 owner rows. Most recent Table 2.1 values are for 2024. Stage/form checks still apply: liveweight animal price is not meat price, kelapa tua per nut does not distinguish owner cultivars, and coffee/rubber processing form must be matched. No game values or IDs changed; no tests run.


### Owner-row matching update — Kementan Table 2.1 / Table 1.1

The extracted historical producer-price tables now provide category-level price series for 17 owner rows: #3 Padi (Table 1.1 GKP/GKG by stage), #4 Jagung, #5 Cabai Rawit, #6 Bawang Merah, #7 Kentang, #9 Ubi Jalar, #10 Singkong, #11 Pisang (generic; Rp/sisir), #12 Mangga, #13 Kedelai, #15 Kacang Tanah, #21 Bawang Putih, #25 Ayam Petelur (egg price, Rp/kg), #27 Sapi Potong (liveweight), #29 Kambing (liveweight), #37 Kopi Robusta, and #41 Cengkeh Biji Kering. The source series is historical (Table 2.1 through 2024); it does not supply matched cost/yield bundles. Other source categories are only generic comparators or have product-form mismatch. Therefore this expands historical price coverage, not economic verification: complete models 0, economically verified rows 0, runtime approvals 0.


### 2026-10-20 — detailed Kementan provincial tables

A second crosswalk records table numbers and printed pages from *Statistik Harga Komoditas Pertanian 2025*. Category-level historical price series now map to 27 owner rows, including newly confirmed #8, #14, #16, #17, #18, #19, #39, #40, #42 and #48. This is price-evidence coverage only. #1/#2 generic coconut, #24 Cavendish versus Ambon, #33 duck eggs versus live ducks, #36 native chicken versus generic live chicken, and #46/#47 white versus black pepper remain product-form mismatches. See `docs/KEMENTAN_PROVINCE_PRICE_CROSSWALK.md` for exact table/page/unit crosswalk and selected province values.


### 2026-10-20 — Kementan production-statistics source registered

Located the official *Statistik Pertanian / Agricultural Statistics 2025* source, covering five-year series across farming production/population, upstream inputs, downstream trade, prices and consumption. Scope and evidence-use limits are recorded in `docs/KEMENTAN_PRODUCTION_STATISTICS_2025_REGISTER.md`. This is source discovery, not numeric extraction; counts of exact observations, cost metrics, productivity metrics and validated models do not increase. Production totals must not be treated as yield without a matching harvested-area/population denominator. Complete models remain 0/60 and runtime approvals remain 0/60. Documentation-only; tests not run.


### 2026-10-20 — production source locator pass

A table-of-contents locator pass was recorded in `docs/KEMENTAN_PRODUCTION_STATISTICS_2025_REGISTER.md`. It identifies Kementan production/area targets for secondary crops (Tables 2.1.1–2.1.13, printed pp.109–121), livestock production/population (Table 2.4.1 and population Tables 2.4.2–2.4.15, pp.270–284), and plantation production/productivity (including Tables 2.3.30 and 2.3.34–2.3.39, pp.250, 254–259). BPS *Statistik Tanaman Perkebunan Tahunan Indonesia 2025* is also registered as a focused source for the plantation rows. This work located tables but did not transcribe numeric rows because the 11.57 MB Kementan PDF could not be opened in full by the extraction viewer. No observation counts are increased by source navigation.

Checkpoint remains: 60/60 owner rows in the audit matrix; 27 owner rows mapped to category-level historical price evidence; 0/60 complete validated economic models; 0/60 runtime approvals. No canonical IDs or game parameters changed. Documentation-only; tests not run.


### 2026-10-20 — BPS horticulture and seasonal-estate source expansion

Registered two additional official source families in `docs/COMMODITY_60_BULK_DATA_REGISTER.md` and `docs/KEMENTAN_PRODUCTION_STATISTICS_2025_REGISTER.md`:

- BPS *Statistik Hortikultura 2025* (released 2026-06-12): production, harvested area and productive-plant counts for 18 strategic horticultural commodities. Apply only where an owner commodity is explicitly included.
- BPS *Statistik Tanaman Perkebunan Semusim Indonesia 2025 (Tebu dan Tembakau)* (released 2026-08-31, revised 2026-09-16): area and production by province and management status; relevant to #44 Tebu. Cane tonnage is not equivalent to sugar output or farmer net revenue.

This is source registration, not numeric extraction. No exact observation counts are added and no owner row changes to economically verified. Current gate remains 60/60 inventory rows, 27 owner rows with category-level historical price evidence, 0/60 complete validated economic models and 0/60 runtime approvals. No runtime parameters or canonical IDs changed. Documentation-only; tests not run.


### 2026-10-20 — first numeric production tranche (BPS food crops)

Added five rounded national annual indicators covering two owner rows (#3 padi and #4 maize) to `docs/KEMENTAN_PRODUCTION_STATISTICS_2025_REGISTER.md`: paddy harvested area (~10.05 million ha), paddy production (53.14 million tonnes GKG), rice output for food consumption (30.62 million tonnes), maize harvested area (~2.55 million ha), and maize production (20.48 million tonnes at 28% moisture). The source URLs, release dates, geography, product bases and limits are recorded in the production register.

Classification: **2 commodity records / 5 numeric indicators**, with published rounding preserved. These are national 2024 aggregates; no farm-level yield, costs, farm-gate price, loss rate or profit is inferred. Paddy GKG and rice-equivalent output remain separate bases; maize moisture basis remains explicit. This is numeric production extraction, not economic validation. The checkpoint remains 60/60 inventory rows, 27 owner rows with category-level historical price evidence, 0/60 complete validated economic models, 0/60 economically verified rows and 0/60 runtime approvals. No game data or canonical IDs changed. Documentation-only; tests not run.


### 2026-10-20 — second numeric production tranche (BPS seasonal vegetables)

Recorded eight 2024 national production indicators from the BPS table *Produksi Tanaman Sayuran dan Buah-Buahan Semusim Menurut Jenis Tanaman*: owner rows #5 cabai rawit, #6 bawang merah, #7 kentang, #8 tomat, #16 kubis, #17 wortel, #19 ketimun, and #21 bawang putih. Values, source URL, period, geography and the published unit (kuintal) are in `docs/KEMENTAN_PRODUCTION_STATISTICS_2025_REGISTER.md`.

This adds 8 crop records / 8 production indicators to the numeric production register. Values are preserved in the published unit; no conversion to tonnes or yield is silently performed. Matching harvested-area denominators, costs, product-grade losses and farm-gate revenue remain separate evidence requirements. Current gate: 60/60 owner inventory rows, 27 rows with category-level historical price evidence, 0/60 complete validated economic models, 0/60 economically verified rows and 0/60 runtime approvals. No runtime or canonical ID changes. Documentation-only; tests not run.


### 2026-10-20 — third numeric production tranche (BPS annual plantation crops)

Transcribed seven national 2024 production indicators from the BPS table *Produksi Tanaman Perkebunan Menurut Provinsi dan Jenis Tanaman (Ribu Ton)* into `docs/KEMENTAN_PRODUCTION_STATISTICS_2025_REGISTER.md`: oil palm 45,436.20; coconut 2,792.23; rubber 2,132.09; coffee 813.35; cocoa 617.11; tea 118.90; and sugarcane 2,465.51, all in thousand tonnes. Source: https://www.bps.go.id/id/statistics-table/2/MjU2NiMy/produksi-tanaman-perkebunan-menurut-provinsi-dan-jenis-tanaman--ribu-ton-.html

The source is the national row of the provincial plantation-production table, not the separate large-plantation-only series. Product-form gates remain active: generic coconut is not cultivar-specific; generic coffee is not a robusta-only series; rubber, palm, cocoa and tea need explicit output-stage matching; sugarcane tonnage is not sugar output. This tranche adds 7 crop records / 7 production indicators, but does not add verified economic models or runtime approvals. No game data or canonical IDs changed. Documentation-only; tests not run.


### 2026-10-20 — matched BPS seasonal-vegetable production and harvested area

Matched all eight national 2024 seasonal-vegetable production records against the corresponding BPS harvested-area table. The production and area observations are both for Indonesia, 2024, and the same crop categories. Derived aggregate ratios (production quintals ÷ harvested hectares) are: #5 cabai rawit 81.76 q/ha; #6 bawang merah 110.47 q/ha; #7 kentang 188.25 q/ha; #8 tomat 195.40 q/ha; #16 kubis 228.66 q/ha; #17 wortel 183.42 q/ha; #19 ketimun 104.37 q/ha; #21 bawang putih 74.16 q/ha. The equivalent kg/ha figures are unit conversions, not separate observations.

Production source: https://www.bps.go.id/id/statistics-table/3/VFV4MmQxaG9kakZrVUdWeEx6aDFUMnN6WmpocVp6MDkjMw%3D%3D/produksi-tanaman-sayuran-dan-buah---buahan-semusim-menurut-jenis-tanaman--2024.html?year=2024. Harvested-area source: https://www.bps.go.id/id/statistics-table/3/VTNWM01VdGhTelZTTTNSS1NFSkVZazkzWjJKcWR6MDkjMw%3D%3D/harvested-area-of-temporary-vegetable-and-fruit-crops-by-type-of-crops----2024.html?year=2024.

These are national aggregate production-to-area ratios, not verified farm-level or saleable yields. Losses, grade, costs, price, farm geography and production-cycle definitions remain unmatched. No runtime values or canonical IDs changed; no complete economic model is approved. Documentation-only; tests not run.


### 2026-10-20 — BPS plantation production matched to total planted area (denominator gate remains open)

Matched the seven 2024 national production values for oil palm, coconut, rubber, coffee, cocoa, tea and sugarcane to the BPS 2024 national total-area values. Production values are in thousand tonnes and total planted area is in thousand hectares, both at Indonesia level. Exact area values and source URLs are recorded in `docs/KEMENTAN_PRODUCTION_STATISTICS_2025_REGISTER.md`.

Sources:
- Production: https://www.bps.go.id/id/statistics-table/2/MjU2NiMy/produksi-tanaman-perkebunan-menurut-provinsi-dan-jenis-tanaman--ribu-ton-.html (BPS table updated 2026-08-27).
- Total area: https://www.bps.go.id/id/statistics-table/2/MjU2NSMy/luas-areal-tanaman-perkebunan-menurut-provinsi-dan-jenis-tanaman.html (BPS table updated 2026-03-06).

This adds **7 matched production/total-area pairs**, not seven validated productivity metrics. BPS metadata says plantation productivity is production divided by harvested area / area of producing plants; total planted area is not an acceptable substitute. The next denominator task is to extract the matching producing-area (TM) series for the same crops, year, geography and production basis. Generic coffee remains non-Robusta-specific; coconut, rubber, palm, cocoa, tea and cane product-form gates remain unresolved. No unit economics, owner-row validation, or runtime approvals follow from this match. No runtime or canonical-ID changes; documentation-only; tests not run.


### 2026-10-20 — verified TM denominator for coffee, 2024

Official Ditjen Perkebunan *Laporan Kinerja Ditjen Perkebunan 2025*, Table 48, provides a matched 2024 coffee production/producing-area pair: production 813,346 tonnes; TM 976,435 ha; TBM 186,453 ha; TTM/TR 111,030 ha; total area 1,273,918 ha; reported productivity 833 kg/ha. Source: https://ditjenbun.pertanian.go.id/template/uploads/2026/03/LAKIN-DITJENBUN-2025.pdf. The reported value is consistent with 813,346 / 976,435 = approximately 833.17 kg/ha rounded to a whole number.

This is one verified national aggregate for generic coffee, not a Robusta-only yield and not farm-level saleable yield. For oil palm, coconut, rubber, cocoa, tea and sugarcane, matching 2024 actual TM denominators remain unverified. Do not substitute total planted area or projected TM targets. No runtime/model approval follows; documentation-only, tests not run.


### 2026-10-20 — additional actual 2024 plantation TM denominators verified

From official Ditjen Perkebunan *Laporan Kinerja Ditjen Perkebunan 2025* (https://ditjenbun.pertanian.go.id/template/uploads/2026/03/LAKIN-DITJENBUN-2025.pdf):

- Oil palm, Table 12: TM 12,876,487 ha; production 45,436,197 t; published productivity 3,529 kg/ha; total area 16,833,985 ha. Production is explicitly labelled CPO; do not equate this with TBS yield.
- Rubber, Table 58: TM 2,242,887 ha; production 2,132,088 t; published productivity 951 kg/ha; total area 3,149,277 ha. Production/TM arithmetic yields approximately 950.6 kg/ha, consistent with the published rounded figure.

Coffee remains verified separately (TM 976,435 ha; production 813,346 t; productivity 833 kg/ha; generic coffee, not Robusta-only). Coconut, cocoa, tea and sugarcane still have no verified actual 2024 national TM denominator in the evidence gathered here. Exclude projected/target TM values and do not derive productivity from total area. Product form, price/cost and economic model gates remain open; no runtime or canonical IDs changed. Documentation-only; tests not run.
