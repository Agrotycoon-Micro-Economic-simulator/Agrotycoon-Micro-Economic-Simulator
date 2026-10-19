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
| 6 | Bawang Merah | BPS producer price + crop stats | seed bulb vs cured harvest | PENDING |
| 7 | Kentang | BPS producer price + crop stats | variety, grade, altitude | PENDING |
| 8 | Tomat | BPS producer price + crop stats | grade, season, post-harvest loss | PENDING |
| 9 | Ketela Rambat / Ubi Jalar | BPS producer price + crop stats | fresh tuber, variety | PENDING |
| 10 | Singkong | BPS producer price + crop stats | fresh roots vs industrial/starch basis | PENDING |
| 11 | Pisang | BPS producer price + crop stats | cultivar, bunch/kg, grade | PENDING; generic runtime collision |
| 12 | Mangga | BPS producer price + orchard studies | cultivar, bearing age, kg/tree | PENDING |
| 13 | Kedelai | BPS producer price + crop stats | moisture, grade, seed vs consumption | PARTIAL; national producer price sample exists |
| 14 | Pepaya | BPS producer price + crop stats | cultivar, harvest frequency | PENDING |
| 15 | Kacang Tanah | BPS producer price + crop stats | in-shell vs shelled | PENDING |
| 16 | Kubis / Kol | BPS producer price + crop stats | grade, altitude, spoilage | PENDING |
| 17 | Wortel | BPS producer price + crop stats | grade, altitude, washed/unwashed | PENDING |
| 18 | Buncis | BPS producer price + crop stats | fresh pods, grade | PENDING; runtime ID missing |
| 19 | Timun | BPS producer price + crop stats | fresh cucumber, grade | PENDING |
| 20 | Jambu Biji | BPS producer price + crop stats | cultivar, grade, harvest frequency | PENDING; runtime ID missing |
| 21 | Bawang Putih | BPS producer price + import/trade data | local/imported, cured bulbs | PENDING |
| 22 | Porang | BPS/Ministry + peer-reviewed agronomy | corm age/size, wet/dry chips, glucomannan | PENDING; runtime ID missing |
| 23 | Jahe Merah | BPS producer price + crop studies | red ginger vs generic ginger, fresh/dry | PENDING |
| 24 | Pisang Cavendish | BPS + export/contract evidence | cultivar, export grade, carton/kg | PENDING; separate from generic banana |
| 25 | Ayam Petelur | BPS livestock prices + poultry production data | egg grade, hen cycle, feed/FCR, spent hen | PENDING |
| 26 | Ayam Pedaging | BPS livestock prices + poultry production data | DOC, live weight, carcass yield, mortality | PENDING |
| 27 | Sapi Potong | BPS livestock prices + livestock cost studies | liveweight vs carcass; breeding vs fattening | PENDING |
| 28 | Sapi Perah | BPS livestock prices + dairy production data | liters/kg milk, lactation, feed, replacement | PARTIAL; national milk production exists |
| 29 | Kambing | BPS livestock prices + husbandry studies | liveweight, age, breeding vs meat | PENDING |
| 30 | Lele | BPS fishery prices + aquaculture studies | pond system, stocking, FCR, harvest grade | PENDING |
| 31 | Udang | BPS fishery prices + aquaculture studies | vannamei species, size count, survival, FCR | PENDING |
| 32 | Nila | BPS fishery prices + aquaculture studies | pond/cage, grade, FCR | PENDING |
| 33 | Telur Bebek | BPS livestock prices + poultry stats | eggs per duck, grade; not live duck | PARTIAL; production table available |
| 34 | Ikan Tuna | BPS fishery + capture-fisheries statistics | species, landed weight, grade, vessel cost | PENDING |
| 35 | Ikan Bandeng | BPS fishery + aquaculture studies | pond cycle, size, survival, grade | PENDING |
| 36 | Ayam Kampung (Daging) | BPS livestock + native chicken studies | native chicken vs broiler, live/carcass | PARTIAL; native-chicken egg series is not meat evidence |
| 37 | Kopi Robusta | BPS plantation + trade/quality sources | Robusta, cherry/green bean/roasted | PENDING |
| 38 | Kopi Arabika | BPS plantation + trade/quality sources | Arabica, cherry/green bean/roasted | PENDING |
| 39 | Kakao | BPS plantation + processing/trade sources | wet bean, fermented dry bean, cocoa liquor | PENDING |
| 40 | Sawit (TBS) | BPS plantation + provincial FFB pricing rules | FFB/TBS, age, extraction rate | PENDING |
| 41 | Cengkeh | BPS plantation price + production stats | wet vs dry cloves, moisture/grade | PENDING |
| 42 | Pala (Biji) | BPS plantation price + production stats | wet fruit, dried seed, kernel, mace | PARTIAL; production context only |
| 43 | Vanili Kering | BPS plantation + curing studies | cured dry beans, recovery rate, grade | PENDING |
| 44 | Tebu | BPS plantation + sugar-industry sources | cane tonnage, sugar recovery, mill payment | PENDING |
| 45 | Teh Pucuk Basah | BPS plantation + tea factory data | fresh leaf, plucking standard, factory yield | PENDING |
| 46 | Lada Putih | BPS plantation + trade sources | white pepper, moisture, grade | PENDING |
| 47 | Lada Hitam | BPS plantation + trade sources | black pepper, moisture, grade | PENDING |
| 48 | Karet (Lateks) | BPS plantation + rubber market sources | latex, wet slab, dry rubber content | PENDING |
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
