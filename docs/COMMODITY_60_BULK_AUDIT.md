

## Methodology gate — SEP 2024 holding types remain separate (2026-10-24)

The BPS technical notes define three distinct agricultural-holding strata: UTP (an individual holding managed by one person with technical, legal and economic responsibility, without a separate legal entity), UPB (an agricultural corporation with legal entity), and UTL (other agricultural holdings). SEP 2024 sampling design is not interchangeable across these strata: UTP uses a stratified two-stage sample because holdings tend to cluster in settlements, while UPB uses complete enumeration of the identified list frame because the population is limited and more dispersed. Source: BPS, *Penjelasan Teknis Survei Ekonomi Pertanian 2024*, official BPS-hosted copy discoverable at https://web-api.bps.go.id/download.php?f=zGrhkeTcLs1vRIKvSznvQWhQUk1LUVFsc2NaVndZZjl2NHc2dCtwNloveDBQZUxrd3FZRTRjdmZUbUREaGRBK2M5amVEZDNWc1V2L1BVOVMyYy84b3I5WmRGZUxTZXZKN216RDFhS1N3YUh5VnBGNDNpcTF3VDRJRGh3RkgrN3pBamNONE1SbHpwSjJZM2VzS1lkeGV2T1I4NDNRVDF3UnJGZFVveDRab3pwTk9QSFNPenVTVUVqYUZna3pBdU93SmpodGJ6SlNmS1dPQU5jZlA5NUsyYUQ4MVJ2WVFZNVZTbHV2YktEMjdqUE5yMEYvL2tnVEdYQUhwaGJOUmRFZ05xb3o2a0F4S2thTmZJd3RyRzFySE9vNy9sL3VqMmJaWEVuTDVDTnkxbU5JTGJUUWcwaml4TFdnQnYwPQ%3D%3D.

**Interpretation rule:** do not pool UTP, UPB and UTL cost/profit values into one “national average” or treat differences as pure scale effects. Preserve holding type, reference period, commodity/product form, table/page, denominator, production stage, and reported income. The existing UTP livestock rows are not UPB/UTL evidence. UPB Tables 3.1–3.6 and UTL Table 4.1 remain open until their actual table values and page references are captured from the official livestock publication. Search-result snippets alone are not accepted as extraction. No runtime changes; no tests run.
## Checkpoint — livestock table reconciliation and remaining UTP coverage (2026-10-22)

### New verification status
The official BPS SEP 2024 livestock publication page confirms the publication scope: it reports livestock-subsector production-cost structure by agricultural business unit. Catalogue 5301012, publication 05200.25001, release 2025-01-24, 8.14 MB. Official page: https://www.bps.go.id/id/publication/2025/01/24/52f47865afe337fd047404a8/hasil-survei-ekonomi-pertanian--sep--2024-subsektor-peternakan.html. The BPS page returned HTTP 403 to a fresh page-open attempt; search-index metadata confirms the bibliographic record but not any new numerical table. Do not claim the remaining UTP tables have been extracted.

### Known numerical cross-check
Existing extraction records UTP beef cattle (Table 2.1), native chicken (Table 2.7) and broiler final stock (Table 2.10). Beef cattle and native chicken production minus cost reconcile to reported income within rounding. Broiler Table 2.10 does not: reported production 152,008.05 thousand Rp minus cost 126,445.08 thousand Rp equals 25,562.97 thousand Rp, whereas the table reports income 28,639.72 thousand Rp. Flag for visual inspection of the source PDF page or a second independent official extract; do not silently replace the source value or promote the margin to runtime.

### Remaining extraction queue
Still unextracted from the original BPS SEP 2024 livestock PDF: UTP tables for dairy cattle, buffalo, pig, goat, sheep, layer duck and Muscovy duck; then relevant UPB tables. Search results include a secondary Scribd text snippet showing some 2017-versus-2024 income chart values, but that is not a substitute for the original table and does not establish a complete cost breakdown. No values from that secondary snippet were promoted. Official publication reference remains the primary source.

No runtime changes. Tests not run. Next: access the original PDF through the official download link or a verifiable mirrored copy, inspect the relevant table images/pages, reconcile Table 2.10, and record each table's exact page, unit, product class, denominator, costs and income before any tier crosswalk.

## Checkpoint — BPS SEP 2024 household livestock cost tables extracted (2026-10-22)

Official source: BPS, *Hasil Survei Ekonomi Pertanian (SEP) 2024 Subsektor Peternakan*, Catalogue 5301012 / Publication 05200.25001, released 24 January 2025. Official publication page: https://www.bps.go.id/assets/publication/2025/01/24/52f47865afe337fd047404a8/hasil-survei-ekonomi-pertanian--sep--2024-subsektor-peternakan.html. Direct PDF linked from that page. The publication distinguishes individual agricultural holdings (UTP), legal agricultural corporations (UPB), and other agricultural holdings (UTL); national survey coverage is 38 provinces and 514 districts/cities. Reference period for UTP/UTL is 1 June 2023–31 May 2024.

### Extracted UTP benchmarks

| BPS table / printed page | Unit and commodity | Production (thousand Rp) | Production cost (thousand Rp) | Reported income (thousand Rp) | Feed cost (thousand Rp; share of costs) | Other relevant cost anchors |
|---|---|---:|---:|---:|---:|---|
| Table 2.1 / p.14 | per head, beef cattle | 3,290.37 | 716.12 | 2,574.26 | 342.25 (47.79%) | health 35.80 (5.00%); labor 70.87 (9.90%); fuel/lubricants 107.92 (15.07%); land 85.69 (11.97%) |
| Table 2.7 / p.20 | per head, ordinary native chicken | 34.15 | 15.61 | 18.53 | 10.94 (70.05%) | health 0.27 (1.74%); labor 0.41 (2.66%); land 2.59 (16.58%) |
| Table 2.10 / p.23 | per 5,000 heads, broiler final stock (FS) | 152,008.05 | 126,445.08 | 28,639.72 | 81,754.62 (64.66%) | DOC purchase 32,089.37 (25.38%); health 2,616.79 (2.07%); wages 3,932.75 (3.11%); electricity/water 2,114.58 (1.67%); land 1,198.09 (0.95%) |

All monetary values above are in thousand rupiah as printed by BPS; they have not been silently converted into rupiah or per-head values. For the broiler FS table, divide by 5,000 only for a separately labelled arithmetic normalization, and retain the original source denominator in the register. The table says income is production minus production costs, but the printed figures do not reconcile: 152,008.05 − 126,445.08 = 25,562.97, not the reported 28,639.72. Treat the broiler income figure as a source-reconciliation exception and do not promote it as a validated margin until visually checked against the original table/image or clarified by BPS. Table 2.1 and 2.7 reconcile to within rounding.

### Modeling gate and next action

These UTP observations are national survey averages for defined livestock types and units, not breed/region/scale-specific recipes. Keep native chicken distinct from commercial broiler; keep beef-cattle “per head” unit separate from production-cycle or liveweight price denominators. No Tier 1–4 runtime values promoted. Next: visually QA the broiler Table 2.10 source image/number inconsistency, extract the remaining UTP livestock tables (dairy cattle, buffalo, pig, goat, sheep, layer duck, Muscovy duck) and relevant UPB tables, then crosswalk only to exact owner inventory rows.

## Checkpoint — BPS poultry company economics extracted (2026-10-22)

Official source: BPS, *Statistik Perusahaan Peternakan Unggas 2024 / Poultry Establishment Statistics 2024*, Catalogue 5304004, publication 05200.25009, released 15 August 2025. Direct official PDF: https://web-api.bps.go.id/download.php?f=YtBCB0OvFoTnPMMwAsS1E1pnY2VCWkxudmJmRU1rbVNnN0MxTGYzWjNRakFyeXlGLzRVOXU1UjZabVdnVm5OVUZ5YkdvVHV1cVYzamR4d1ZidUhFWE94N0Z3bFJjNzdtcmZmRHJpOWNmYVFUT3BTZjMvUisxNGRNLzhaZ0s0aDlqRGlIWUtVMVlWMUdRS0I3UmlNb2FsYUM3b2VXZUxSbStrc2R5bjJub0VZUkNQSVRDMEYvd3FERXllYjZHSloxNDkvWldOSWhvRCtpcEwvTkhRYzB2RE5nODcyZ0hyK0ZKcXBXOVJuTmNVanFLNG00S3RNdDJPeEJnWTltSHNTSVVIbi9iRTFMeitSY0luY0VjTURzN3B3NGRkaUpKYWZFNXFDY3VBPT0%3D

### Exact BPS 2024 company-level unit economics (preliminary figures)

BPS Figure 2.3, printed page 16 / PDF page 31, reports:
- **Broiler company:** production value Rp33,053/head; total cost Rp28,837/head; average profit Rp4,216/head/cycle.
- Broiler cost shares: concentrate 67.33%; DOC 20.97%; wages 6.40%; medicines 1.64%; electricity/water 1.12%; fuel/lubricants 0.49%; corn 0.26%; other feed 0.22%; other expenses 1.56%; paddy grain 0.01%.
- **Layer company:** production value Rp925,584/head/year; total cost Rp583,491/head/year; average profit Rp342,093/head/year.
- Layer cost shares: concentrate 50.06%; corn 17.43%; wages 14.96%; other feed 6.46%; medicines 4.92%; other expenses 2.95%; electricity/water 1.46%; fuel/lubricants 0.54%; DOC 0.51%; paddy grain 0.71%.
- Source labels the figures preliminary. The publication covers formal/legal poultry establishments, with a complete census of active legal entities; it is not automatically representative of small household farms or independent smallholder broiler growers.
- These company-level averages are useful benchmark anchors, not a matched farm budget for every scale. Do not combine with the separate Kementan SPORA feed-mill producer prices or regulated DOC prices as though they were a single transaction or identical cohort. No breed-specific cycle length, mortality, FCR, carcass conversion, farmgate price, or smallholder production system is inferred from this figure.
- No runtime values promoted; commodity Tier 1–4 models remain gated on matched system-specific evidence.

Next: obtain and extract the BPS SEP 2024 livestock-subsector publication for individual agricultural units (UTP), to distinguish household/smallholder farm cost structures from formal company statistics; crosswalk each table only to supported owner commodity rows.

## Checkpoint — official poultry input-price anchors recorded (2026-10-22)

- Added five feed-price observations from Kementan/ Ditjen PKH reporting SPORA: BR1 Rp8,010/kg; BR0 Rp8,451/kg; BR2 Rp7,967/kg; layer P3 Rp6,803/kg; layer concentrate KP3 Rp7,735/kg. Report dated 11 March 2026 and describes February–early March producer-level observations from different counts of feed mills (14–33 depending on feed type).
- Added DOC price-stage reference reported by Ditjen PKH on 25 January 2026: Kepbadan Pangan Nasional No. 524/2025, Rp7,000/DOC at farmer level and Rp11,000/DOC loco factory. Keep the stages separate.
- These are input-price anchors, not a matched farm budget. Feed share (reported as roughly 60–70% of poultry cost) is contextual only; no HPP or margin inferred. No runtime change.
- Sources: https://betcipelang.ditjenpkh.pertanian.go.id/berita/harga-pakan-ternak-catat-penurunan-harga ; https://ditjenpkh.pertanian.go.id/index.php/berita/kementan-perketat-pengawasan-doc-dan-pakan-demi-lindungi-peternak-ayam.



## Checkpoint — Table 49 livestock producer-price series extracted (2026-10-22)

- Extracted 5 livestock/egg categories × 13 monthly observations (Jan–Dec 2025 and Jan 2026) from Kementan Pusdatin *Statistik Terkini Ekonomi Pertanian Februari 2026*, Table 49, printed p.58/PDF p.70: cattle liveweight, broiler liveweight, native chicken liveweight, layer eggs (Rp/kg), and native-chicken eggs (Rp/butir).
- Source cited: Ditjen PKH / Simponi Ternak; bulletin notes Jan 2026 download on 18 February 2026. Monthly values and growth columns are recorded in the data register.
- Selling-price evidence only. No costs, FCR, mortality, cycle length, carcass conversion, capital or profit established. Do not treat generic animal categories as breed-specific models or promote to runtime.
- Official PDF: https://satudata.pertanian.go.id/assets/docs/publikasi/Statistik_Terkini_EKonomi_Pertanian_Februari_2026_sign.pdf.
## Checkpoint — newer monthly producer-price evidence (2026-10-22)

- Official Kementan Pusdatin February 2026 statistical bulletin added to the data register: Table 47 (6 food-crop rows, monthly 2025 and published annual average) and Table 48 (29 estate-crop product forms with January 2026 values and growth fields). Source PDF: https://satudata.pertanian.go.id/assets/docs/publikasi/8dd032702c6674502575a41b8020ecba.pdf.
- This expands price chronology only. It does not establish farm costs, yields, mortality, FCR, processing conversion, fixed capital, losses, or profit. Table 48 extracted text has row/column alignment risk and requires visual QA before any runtime consideration.
- Coconut producer price is shown per kg, not per whole coconut. Owner-locked Rp13,000/butir direct retail and es kelapa parameters remain unchanged. No runtime promotion; tests not run.

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


### 2026-10-20 — coconut and cocoa TM checks; tea/sugarcane qualifications

Official Ditjen Perkebunan *Laporan Kinerja Ditjen Perkebunan 2025* (https://ditjenbun.pertanian.go.id/template/uploads/2026/03/LAKIN-DITJENBUN-2025.pdf) reports for 2024:
- Coconut, Table 18: TM 2,502,062 ha; production 2,792,228 t; productivity 1,116 kg/ha; computed ratio ≈1,115.96 kg/ha.
- Cocoa, Table 63: TM 863,095 ha; production 617,112 t; productivity 715 kg/ha; computed ratio ≈715.1 kg/ha.

Tea remains **unverified pending source reconciliation**: an indexed LAKIN excerpt gives production 116,030 t and TM 75,447 ha, whereas BPS total-area table lists 2024 production 118.90 thousand t. Do not publish the derived ratio until this difference is resolved directly against the source tables. Sugarcane's LAKIN table provides 2024 harvested area 520,823 ha and separate outputs of GKP 2,465,514 t and cane 33,216,613 t; it does not establish a TM denominator in this evidence. Do not treat harvested area as TM or cane as sugar output. BPS total-area figures (including sugarcane 520.82 thousand ha) remain total-area, not productivity denominators: https://www.bps.go.id/id/statistics-table/2/MjU2NSMy/luas-areal-tanaman-perkebunan-menurut-provinsi-dan-jenis-tanaman.html.

No runtime/code/canonical IDs or economic approvals changed. Documentation-only; tests not run. Price/cost and product-form validation gates remain open.


### Tea denominator — direct verification and source-series caveat (2026-10-20)

Direct search of official Ditjen Perkebunan *Laporan Kinerja Ditjen Perkebunan 2025*, Table 68 (printed p. 206 / PDF p. 221), verifies 2024 tea TM 75,447 ha, production 116,030 t and productivity 1,538 kg/ha; the ratio is ≈1,538.2 kg/ha. Source: https://ditjenbun.pertanian.go.id/template/uploads/2026/03/LAKIN-DITJENBUN-2025.pdf. However, BPS's 2024 national production table reports 118.90 thousand t. Treat these as separate source series until definitions and compilation are reconciled; do not calculate a hybrid productivity from one source's production and the other's TM. Sugarcane's LAKIN 2024 harvested-area metrics are 520,823 ha, GKP 2,465,514 t (4.73 t/ha) and cane 33,216,613 t (63.78 t/ha); harvested area is not TM, and cane is not GKP. No runtime/canonical IDs/economic approvals changed; tests not run.


### Sugarcane denominator gate — harvested area verified (2026-10-20)

For sugarcane, a TM denominator is not required to use the official harvested-area productivity series. Pusdatin Kementan *Outlook Tebu 2025* reports 2024 (temporary) harvested area 520,823 ha, GKP production 2,465,514 t, cane production 33,216,613 t, GKP productivity 4.73 t/ha, cane productivity 63.78 t/ha and rendemen 7.42%. Ratios check within rounding: GKP ≈4.733 t/ha and cane ≈63.77 t/ha. Source: https://satudata.pertanian.go.id/assets/docs/publikasi/OUTLOOK_TEBU_2025_sign_compressed.pdf.

BPS's 2024 seasonal estate-crops publication records sugar production from sugarcane and area 520.82 thousand ha; Pusdatin/Ditjenbun also reports cane mass separately. Keep sugar (GKP) and raw cane as separate output forms and use harvested area, not projected TM, as the denominator for this annual crop. These are national provisional aggregates, not farm-level yields or unit economics. No runtime/code/canonical IDs or economic approvals changed; tests not run.


## Bulk price extraction checkpoint — Kementan Pusdatin 2025 (2026-10-22)

The official Kementan Pusdatin *Statistik Harga Komoditas Pertanian Tahun 2025* PDF is now accessible through the official satudata.pertanian.go.id endpoint. It republishes BPS producer-price series and explicitly defines farm-gate price as a farmer-to-collector/tengkulak transaction; see printed pp. xix–xxi. This is a distinct market stage from retail and must not be conflated with the owner's direct-to-customer coconut benchmark.

Exact national-row series extracted from Tables 2.6–2.8:
- **Singkong / ketela pohon**, Table 2.6, p. 24: 2020 Rp3,121/kg; 2021 Rp3,158/kg; 2022 Rp3,250/kg; 2023 Rp3,539/kg; 2024 Rp4,826/kg.
- **Ubi jalar / ketela rambat**, Table 2.7, p. 25: 2020 Rp4,626/kg; 2021 Rp4,519/kg; 2022 Rp4,815/kg; 2023 Rp5,023/kg; 2024 Rp6,401/kg.
- **Bawang merah**, Table 2.8, p. 26: 2020 Rp26,684/kg; 2021 Rp23,914/kg; 2022 Rp27,084/kg; 2023 Rp26,919/kg; 2024 Rp31,673/kg.

Each is an annual historical producer-price series, not a live 2026 quote, owner observation, retail price, or cost/profit model. Variety/grade details are not fully specified by these table titles; preserve that limitation. Exact provenance and source URL are in `docs/COMMODITY_60_BULK_DATA_REGISTER.md`.

Coverage effect: 3 additional owner-row candidate price series now have five annual values each. This does **not** change the global 60-row matrix or establish any complete Tier 1–4 model. No runtime parameters, recipes, canonical IDs, or owner-locked coconut/es-kelapa values changed. Tests not run; documentation-only update.


### Additional producer-price rows from the same official PDF (2026-10-22)

Extracted three more annual national summary series, all Rp/kg and sourced by the publication to BPS:
- **Tomat sayur**, Table 2.20, printed p. 38: 2020 7,331; 2021 7,546; 2022 7,817; 2023 8,522; 2024 11,955.
- **Wortel**, Table 2.21, printed p. 39: 2020 8,915; 2021 8,604; 2022 9,217; 2023 9,592; 2024 13,071.
- **Mangga**, Table 2.23, printed p. 41: 2020 9,669; 2021 9,852; 2022 10,931; 2023 11,251; 2024 14,607.

The full register contains source IDs and annual series. All six candidate crop rows extracted across the two checkpoints remain **price-evidence only**; they do not complete a Tier 1–4 business model. Grade/variety specificity, matched farm costs, yield, post-harvest loss and processing conversion remain separate evidence gates. No runtime values changed; owner coconut benchmark remains locked; tests not run.


## Consolidated producer-price extraction — Table 2.1 (2026-10-22)

Extracted the full 26-row national annual summary from Kementan Pusdatin, *Statistik Harga Komoditas Pertanian Tahun 2025*, Table 2.1, printed p. 19 / PDF p. 45, source credited to BPS. The table reports 2021–2024 prices and 2023–2024 growth. The exact 26 rows × 4 annual values (104 observations), units, growth and source IDs are recorded in `docs/COMMODITY_60_BULK_DATA_REGISTER.md`.

The consolidated table adds comparable producer-stage evidence across grains/legumes, roots, horticulture, plantation crops and livestock: maize, mung bean, soybean, peanut, potato, red chili, bird's-eye chili, garlic, banana, citrus, salak, robusta coffee, pepper, rubber, dried clove, cattle, buffalo, goat, pig, generic live chicken and layer eggs, while also independently cross-checking previously recorded singkong, ubi jalar, shallot, mango and coconut observations. Source units are preserved: Rp/kg for most crops, Rp/sisir for banana, Rp/butir for mature coconut, Rp/kg liveweight for livestock, and Rp/kg for eggs.

**Important:** Table 2.1 is a national producer-price summary, not retail price, farm cost, yield, loss, FCR, processing conversion or profit evidence. Generic chicken/cattle/banana labels do not automatically map to specific production systems/cultivars. The 2024 national producer coconut value Rp3,422/butir remains separate from the owner's Rp13,000 direct-retail whole coconut and all other owner-locked es kelapa parameters. No owner values are overwritten. No runtime parameters or canonical IDs changed; tests not run.


## Audit addendum — direct extraction from BPS SEP 2024 UTP tables (2026-10-24)

The official BPS SEP 2024 livestock PDF is accessible via the publication page's “Unduh Publikasi” link (134 pages). This corrects the earlier access limitation: the page fetch had failed, but the PDF download link itself resolves and its text is extractable. Official publication page: https://www.bps.go.id/id/publication/2025/01/24/52f47865afe337fd047404a8/hasil-survei-ekonomi-pertanian-sep-2024-subsektor-peternakan.html.

Additional 2024 national UTP results transcribed from the table totals:
- Dairy cattle (Table 2.2; printed p.15): production Rp10,141.12 thousand/head; cost Rp5,094.66 thousand/head; derived difference Rp5,046.46 thousand/head; feed cost Rp4,074.74 thousand/head (79.98% of cost).
- Beef buffalo (Table 2.3; printed p.16): production Rp3,697.39 thousand/head; cost Rp533.97 thousand/head; derived difference Rp3,163.42 thousand/head; feed cost Rp143.84 thousand/head (26.94%).
- Meat goat (Table 2.5; printed p.18): production Rp660.93 thousand/head; cost Rp155.39 thousand/head; derived difference Rp505.54 thousand/head; feed cost Rp57.85 thousand/head (37.23%).

“Derived difference” is explicitly calculated as published production minus published cost, not an independently transcribed income row. These figures are national survey averages per head in UTP, not Tier-specific live production recipes or local transaction prices. Keep the UTP sample separate from formal agricultural corporations (UPB) and other agricultural holdings (UTL). Do not infer feed quantity/FCR, cycle duration, mortality, weight, housing or price stage from these totals alone.

Open arithmetic/data-quality issue remains for UTP broiler Table 2.10 (printed p.23): production Rp152,008.05 thousand per 5,000 final-stock heads minus cost Rp126,445.08 thousand = Rp25,562.97 thousand, while the previously transcribed published income value is Rp28,639.72 thousand. This is unresolved; no margin promotion until the displayed table is visually checked. No runtime changes; owner coconut benchmark unchanged; tests not run.


## Audit addendum — sheep and poultry UTP tables (2026-10-24)

Verified additional 2024 national UTP values from the official BPS SEP livestock PDF:
- Meat sheep, Table 2.6, per head: production Rp689.79k; cost Rp242.91k; published income Rp446.88k; feed Rp135.42k (55.75% of cost). Arithmetic reconciles.
- Native chicken, Table 2.7, per head: production Rp34.15k; cost Rp15.61k; published income Rp18.53k; feed Rp10.94k (70.05%). Production minus cost is Rp18.54k, a Rp0.01k rounding gap; preserve the published income.
- Layer duck, Table 2.8, per 1,000 heads: production Rp140,316.23k; cost Rp75,420.46k; published income Rp64,895.77k; feed Rp60,009.13k (79.57%). Arithmetic reconciles.
- Muscovy duck / itik Manila, Table 2.9, per head: production Rp39.80k; cost Rp20.75k; published income Rp19.06k; feed Rp15.56k (74.98%). Production minus cost is Rp19.05k, a Rp0.01k rounding gap; preserve the published income.
- Broiler final stock, Table 2.10, per 5,000 heads: production Rp152,008.05k; cost Rp126,445.08k; published income Rp28,639.72k; feed Rp81,754.62k (64.66%). Production minus cost is Rp25,562.97k, leaving an unresolved Rp3,076.75k discrepancy versus the published income.

Source tables are printed pp.19–23 (PDF pp.36–40) of the official BPS SEP 2024 livestock publication. These are UTP national averages, not UPB formal-company data or farm-specific Tier models. Preserve distinct denominators (per head, per 1,000 heads, per 5,000 final-stock heads) and the BPS-reported income values; do not silently overwrite source figures with calculated differences. Broiler discrepancy stays an explicit data-quality blocker pending visual/source QA. No runtime changes; owner benchmark unchanged; tests not run.


## Audit addendum — pig UTP Table 2.4 (2026-10-24)

BPS SEP 2024 Table 2.4, printed p.17 / PDF p.34: per-head production Rp1,732.79k, cost Rp518.55k, published income Rp1,214.24k, feed cost Rp377.24k (72.75% of cost). Arithmetic reconciles exactly. Published feed components include corn Rp24.21k, forage Rp38.26k, concentrate/manufactured feed Rp143.92k, and other feeds Rp170.86k. This closes the previously queued UTP pig-table extraction; it does not provide the missing cycle, liveweight, mortality or farm-level cost structure needed for a complete tier model. No runtime changes; tests not run.


## Aquaculture output/value anchors added to the 60-row matrix (2026-10-24)

BPS's 2024 statistical tables sourced to KKP provide national aquaculture production volumes and production values by main commodity. The crosswalk is recorded in `docs/COMMODITY_60_BULK_DATA_REGISTER.md` with the original units and calculated implied Rp/kg values for patin, lele, nila, ikan mas, kakap, bandeng, rumput laut, kerapu, udang and “ikan lainnya.”

These calculated ratios are **implied production value per kg**, not observed transaction prices, profit, or farm-gate price quotes. The production table reports tonnes and the value table thousand rupiah, so the quotient is numerically Rp/kg; it still requires product-stage and methodology reconciliation before it can support a game price. “Gurame” is shown as a dash in the national row in both tables and is treated as unavailable, not zero.

Official sources:
- BPS, *Produksi Perikanan Budidaya Menurut Komoditas Utama (Ton), 2024*: https://www.bps.go.id/id/statistics-table/2/MTUxMyMy/produksi-perikananbudidayamenurut-komoditas-utama.html
- BPS, *Nilai Produksi Perikanan Budidaya Menurut Komoditas Utama (Ribu Rupiah), 2024*: https://www.bps.go.id/id/statistics-table/2/MTUxNCMy/nilai-produksi-perikanan-budidaya-menurut-komoditas-utama.html
- BPS, *Volume Produksi dan Nilai Produksi Perikanan Budidaya Menurut Provinsi dan Komoditas Utama, 2024*: https://www.bps.go.id/id/statistics-table/3/YUVSTWJDOUlaRFpXYWsxcmVUY3hkMWxpY0hoVFVUMDkjMyMwMDAw/volume-produksi-dan-nilai-produksi-perikanan-budidaya-menurut-provinsi-dan-komoditas-utama.html

This expands output/value evidence only; it does not change 60-row economic-model completeness, tier recipes, costs, yields, or runtime approvals. The official SEP 2024 fishery cost publication remains queued for direct table extraction. No runtime changes; no tests run.


## Official formal-aquaculture company source queued (2026-10-24)

Indexed BPS *Statistik Perusahaan Budidaya Ikan 2024* (Catalogue 5403011 / Publication 05200.25013; released 5 Dec 2025). Its official abstract confirms coverage of company inputs/outputs, workers and wages, production volume/value, and production costs. The 2024 frame contains 654 active legal-entity aquaculture companies: 444 mainly brackish-water grow-out, 43 marine grow-out, 99 hatcheries, and 68 freshwater grow-out. Official source: https://www.bps.go.id/id/publication/2025/12/05/9e66e7740d8ef066adb18bfc/statistik-perusahaan-budidaya-ikan-2024.html.

This source is a promising company-level evidence lane for formal/larger-scale aquaculture, not a proxy for UTP household farms. The official PDF download route currently returns a web cache miss, so this step records source metadata only; it does not claim table-level costs or commodity economics have been extracted. Capture-fishery companies are a separate source and must not be pooled with aquaculture.

Next extraction priority: obtain the BPS company publication through an alternate official endpoint or table-indexed text; meanwhile continue attempts to access the SEP 2024 fishery cost tables. No runtime promotion, no complete model count increase, tests not run.


## Audit note — fish producer-price metadata scope (2026-10-24)

BPS metadata variable https://sirusa.bps.go.id/metadata/variabel/308935 is associated with the activity “Survei Data Perikanan Kota Tangerang 2025.” Its first-sale producer-price definition may inform transaction-stage interpretation, but that specific metadata record does not prove national 38-province coverage. Keep it separate from the national BPS 2025 producer-price publication until a table-level linkage is verified. The publication page confirms monthly rural producer-price coverage across 38 provinces, but numeric fish observations remain unextracted. BPS's separate company-count table confirms 654 active aquaculture companies in 2024, only a frame count—not cost/profit evidence. No runtime or model-validation status changes.


## Fish producer-price fallback recovered from indexed BPS 2024 table (2026-10-24)

A search-indexed extraction of BPS *Statistik Harga Produsen Pertanian Subsektor Peternakan dan Perikanan 2024*, Table 2.1.4, gives the national producer-price row for ikan belanak at Rp24,226/kg (Jan), Rp24,337/kg (Feb), Rp24,372/kg (Mar), and Rp24,386/kg (Apr). The source publication is the BPS 2024 volume (data year 2024; released 22 April 2025): https://www.bps.go.id/id/publication/2025/04/22/a193ac1aa4e9cb09fbd82001/statistik-harga-produsen-pertanian-subsektor-peternakan-dan-perikanan-2024.html. The table was found through an indexed PDF mirror; direct retrieval returned 403, so visually verify the original table before any production use. These values are historical and species-specific; they do not fill the 2025 series or substitute for other fish species/aquaculture. No completeness or runtime status changes.

## 2026-10-24 — mullet price evidence and aquaculture source gate

- Added four indexed BPS national monthly producer-price observations for mullet in 2024: January Rp24,226/kg; February Rp24,337/kg; March Rp24,372/kg; April Rp24,386/kg. These are historical producer prices only. The indexed table should be visually checked against the original PDF before production use; this does not provide an aquaculture price, matched cost, yield, or profit bundle. Official publication: https://www.bps.go.id/id/publication/2025/04/22/a193ac1aa4e9cb09fbd82001/statistik-harga-produsen-pertanian-subsektor-peternakan-dan-perikanan-2024.html .
- BPS *Statistik Perusahaan Budidaya Ikan 2024* confirms 654 active incorporated aquaculture companies (444 brackish grow-out, 99 hatcheries, 68 freshwater grow-out, 43 marine grow-out) and says the publication contains inputs/outputs, labor/wages, production volume/value and costs. Counts alone are not unit-economics evidence, and incorporated-company data must not be silently pooled with UTP/household holdings. Source: https://www.bps.go.id/id/publication/2025/12/05/9e66e7740d8ef066adb18bfc/statistik-perusahaan-budidaya-ikan-2024.html .
- BPS's 2025 producer-price publication is available as a source lead but no numeric fish series was extracted in this pass: https://www.bps.go.id/id/publication/2026/04/24/471c9fc5982e7c8927c362f8/statistik-harga-produsen-pertanian-subsektor-peternakan-dan-perikanan-2025.html . SEP 2024 fishery cost tables also remain unextracted: https://www.bps.go.id/id/publication/2025/01/23/9d6edb0cfc82283e01d19a77/hasil-survei-ekonomi-pertanian-sep-2024-subsektor-perikanan.html .
- No complete economic model, economically verified row, or runtime approval is added from this evidence. Preserve missing values as missing; do not infer cost/HPP/profit from producer prices or company counts.


## 2026-10-25 — official source access QA: fishery extraction still blocked

- Official BPS metadata for the 2025 producer-price publication was confirmed (catalogue 7103013, publication 06200.26009, released 24 April 2026; monthly rural observations across 38 provinces). The official PDF retrieval failed with a response-size error (>10 MiB), so no 2025 fish values are added.
- Official metadata for *Statistik Perusahaan Budidaya Ikan 2024* confirms that company input/output, labor/wages, production volume/value and production costs are covered. Its official PDF retrieval returned a cache-miss error; no numerical table was extracted.
- The SEP 2024 fisheries publication is confirmed to contain cost structures by agricultural holding unit, but its page retrieval also returned a cache miss; no numerical cost table was extracted.
- Official links: https://www.bps.go.id/id/publication/2026/04/24/471c9fc5982e7c8927c362f8/statistik-harga-produsen-pertanian-subsektor-peternakan-dan-perikanan-2025.html ; https://www.bps.go.id/id/publication/2025/12/05/9e66e7740d8ef066adb18bfc/statistik-perusahaan-budidaya-ikan-2024.html ; https://www.bps.go.id/id/publication/2025/01/23/9d6edb0cfc82283e01d19a77/hasil-survei-ekonomi-pertanian-sep-2024-subsektor-perikanan.html .
- Disposition: access failures are not evidence that data are absent. Keep the datasets pending; no economic model or runtime approval is created. Continue via indexed individual tables or an accessible official download route and visually validate numeric rows.


## 2026-10-26 — Historical BPS aquaculture table extraction (regional evidence only)

New numeric evidence extracted from the official BPS Provinsi Kalimantan Tengah household-aquaculture publication, *Hasil Survei ST2013 — Subsektor Rumah Tangga Usaha Budidaya Ikan, 2014*, Tables 17.1–17.4, printed pp.23–26 / PDF pp.43–46. This is a **2014 regional survey**, not a current or national benchmark.

- Bandeng, Table 17.1, per hectare/cycle: output 287.62 kg; production value Rp2,949.60 thousand; cost Rp2,169.73 thousand; surplus Rp779.87 thousand; feed Rp65.96 thousand (3.04%); seed Rp450.25 thousand (20.75%); labor Rp599.41 thousand (27.63%).
- Nila, Table 17.2, per 100 m²/cycle: output 233.73 kg plus small broodstock output; production value Rp8,353.03 thousand; cost Rp5,565.87 thousand; surplus Rp2,787.16 thousand; feed Rp2,012.54 thousand (36.16%); seed Rp681.22 thousand (12.24%); labor Rp1,544.53 thousand (27.75%).
- Lele, Table 17.3, per 100 m²/cycle: output 178.91 kg plus broodstock output; production value Rp3,921.06 thousand; cost Rp3,461.26 thousand; surplus Rp459.80 thousand; feed Rp1,362.77 thousand (39.37%); seed Rp659.92 thousand (19.07%); labor Rp856.01 thousand (24.73%).
- Patin, Table 17.4, per m²/cycle and explicitly broodstock output: 402.18 kg; production value Rp6,749.07 thousand; cost Rp5,230.24 thousand; surplus Rp1,518.83 thousand; feed Rp3,070.44 thousand (58.71%); seed Rp513.17 thousand (9.82%); labor Rp1,047.70 thousand (20.03%).

Arithmetic check: reported surplus reconciles to production value minus production cost for all four tables. Reported surplus percentages are 26.44%, 33.37%, 11.73%, and 22.50% respectively. The report's cost totals include estimated unpaid labor and other costs; surplus is not a cash-only margin. Denominators are non-interchangeable (hectare, 100 m², m²) and the patin row is broodstock, not table-size fish. Treat this as a regional historical cross-check and method template; do not promote directly into the 60-commodity runtime or conflate with 2024 national aquaculture output/value ratios or formal-company statistics.

Official source PDF: https://web-api.bps.go.id/download.php?f=afbY+JcKhB4Q9ggMv1ZrvXlIU20wTE0wOTduVUV2Y1pLdkhEcnMzem9EOHZVWmoxS04yNEdqQ0RsVTk0OTVHN295bFVwVlVjbHlVdnpkenV4TiswTmd5NURlUWd0MzdzK0w4c3QyNW1NZkdiSGlROEtRSCtBWWFGTllTMU5neHV3QWRONjJhNTRXVytpQ0padlEyY3FpSlk1bG9obEdDaDJMU3JldzNzbC9TVzB3UTh0YmtRZUpHdDBKMFdmRjFkTXB3alVlcmEwMEpldlhXcVpNM3ZKdmc2UUY3ck5LTTZpL016RHRlbTJuOTJWcVYydnZJM2pZbUZtVVdTMzdwR0lSOC9heTZBeHBBTlQrdTVYcmJaVitjL2YvOHdPSW5SS2tIOGJtM1VLYldIL3FVc2ZoQW1kU0VnVTZGelpXK0FjSTJUMGc5OHQ3WmdOTks2bFpRbUZFdmdYdndCWFZIbXl5d041Zz09

## 2026-10-26 — SEP 2024 UTP crop and estate tables extracted, with reconciliation QA

Ten official BPS SEP 2024 tables were directly read from the 124-page official PDF: UTP Tables 2.1–2.10, printed pp.15–24. These provide national-average 2024 production value and cost structure for paddy, maize, shallot, green chili, big red chili, curly red chili, cayenne pepper, oil palm, rubber and coconut. Full source rows, denominator, unit-price fields and cost shares are recorded in the bulk data register.

| Commodity | Production value (000 Rp) | Cost (000 Rp) | Published income (000 Rp) | Income/value |
|---|---:|---:|---:|---:|
| Paddy, per ha | 26,369.86 | 15,287.59 | 11,082.11 | 42.03% |
| Maize, per ha | 20,943.60 | 11,486.06 | 9,457.54 | 45.16% |
| Shallot, per ha | 141,997.49 | 75,286.09 | 66,711.41 | 46.98% |
| Green chili, per ha | 96,295.28 | 40,216.90 | 56,078.37 | 58.24% |
| Big red chili, per ha | 159,090.37 | 60,775.69 | 98,314.68 | 61.80% |
| Curly red chili, per ha | 135,680.79 | 54,709.62 | 80,971.17 | 59.67% |
| Cayenne pepper, per ha | 103,548.29 | 34,607.54 | 68,940.75 | 66.58% |
| Oil palm, per 100 trees | 24,378.94 | 10,112.64 | 14,266.32 | 58.51% |
| Rubber, per 100 trees | 5,438.61 | 1,643.87 | 3,794.75 | 69.77% |
| Coconut, per 100 trees | 12,788.56 | 4,642.55 | 8,146.04 | 63.70% |

Percentages above are calculated as the source's published income divided by production value; they are not a claim of net profit after every economic opportunity cost beyond the survey's cost definition. Green chili has a 0.01 thousand Rp mismatch between displayed production-minus-cost and published income; preserve source income rather than silently correcting it. BPS notes some cost/subsidy imputations are not yet estimated. Keep these UTP records separate from UPB/UTL and do not infer harvest cycles, per-plant yield, current local prices or transformation recipes from annual averages. No runtime values approved.

Official source: https://www.bps.go.id/id/publication/2025/01/24/8faa8436999bb9b54ba0b7a9/hasil-survei-ekonomi-pertanian--sep--2024--nilai-dan-biaya-produksi-beberapa-komoditas-utama-pada-subsektor-tanaman-pangan--hortikultura--dan-perkebunan.html
PDF: https://web-api.bps.go.id/download.php?f=c8PKr3LM32mtv1hwb+JMyW1SOTRVdy9JeXpENmNBK2ozMEkzaVFyZUtHeWpRb3RQUmNPMnA3TDBoT3lWV0MySFNoRTNISlFrdmd4SEhNd2oxWXY4UU9jZEcydXBFeUV6djY2NEEyay9XSXdiQ0NZWVlOcmpESkxBV2tJUjB0T0VOd0NFOG1UZUhBSEJVekdibzZ2M2xzcTdsZ0VscERjRnZHWUtoV3JyKzZlblZXRHgrQzh6ci9BcjMzNWRYblhaeG90aGs3NzZJUHk0VGNtQlo1YlVjT2lsWG16RlJDTDE4dWJJVXk1V2QwL0lYd3M5MHpNMnRvMmcxL3dFd0tiNnFIRzJvL3VmdDVVT2ZDZTJaLzFWSEtLTWpGbTEwMjdXSkZSWElkeDlsOXhnc3NydkdTMThUVU1kS0pOQjkxV01RWHVCNUx6cmN0V1pNQTdXWTFNazE0Y0g2Q1VrOGZLRERoRytybTd4SDRNQU4zMm1XM2JsYXJKMndSazNrcGR3MlY0enpHRHc2WUZpcENucE1kczRMb0t2ZUNYUUN6cDgvaFZUL0s2anlYb01Xa042eHlIWElaWjQ1YTg9
\n\n

## SEP 2024 — UPB and UTL comparison checkpoint (2026-10-26)

Official BPS publication: [Hasil Survei Ekonomi Pertanian (SEP) 2024 — Nilai dan Biaya Produksi Beberapa Komoditas Utama pada Subsektor Tanaman Pangan, Hortikultura, dan Perkebunan](https://www.bps.go.id/id/publication/2025/01/24/8faa8436999bb9b54ba0b7a9/hasil-survei-ekonomi-pertanian--sep--2024--nilai-dan-biaya-produksi-beberapa-komoditas-utama-pada-subsektor-tanaman-pangan--hortikultura--dan-perkebunan.html), Catalogue 5101026, publication 05100.25001. The indexed table text was cross-checked against the same publication PDF. All values below are **thousand rupiah (000 Rp)** and are survey averages, not a retail price list.

| Survey stratum / table | Commodity and denominator | Production value | Production cost | Published income | Producer price (000 Rp/kg) | Unit cost (000 Rp/kg) | Productivity |
|---|---|---:|---:|---:|---:|---:|---:|
| UPB, Table 3.1 (printed p.27) | Oil palm, per 100 trees | 29,772.24 | 14,435.11 | 15,453.08 | 2.25 | 1.38 | 13,502.29 kg/100 trees |
| UTL, Table 4.1 (printed p.31) | Cayenne pepper, per hectare | 207,483.01 | 99,094.45 | 108,388.56 | 37.67 | 22.95 | 0.56 kg/m² |
| UTL, Table 4.2 (printed p.32) | Oil palm, per 100 trees | 25,143.89 | 13,218.16 | 12,046.95 | 2.07 | 1.29 | 12,443.49 kg/100 trees |

Cost structure highlights:
- **UPB oil palm:** fertilizer 3,619.73 (25.08% of costs); wages/agricultural services 5,666.89 (39.26%); fuel/lubricants 795.38 (5.51%); rent and estimated rent for own/rent-free land 2,256.19 (15.63%).
- **UTL cayenne pepper:** seeds 9,422.05 (9.51%); fertilizer 12,582.54 (12.70%); pesticides 5,653.63 (5.71%); wages/agricultural services 15,373.35 (15.51%); rent/estimated rent 44,069.58 (44.47%).
- **UTL oil palm:** fertilizer 3,026.97 (22.90%); wages/agricultural services 4,598.78 (34.79%); fuel/lubricants 175.62 (1.33%); rent/estimated rent 3,927.80 (29.72%).

Interpretation rules:
1. Do not pool UTP, UPB, and UTL averages. The oil-palm observations are a useful stratum comparison, not evidence that one stratum's costs can be substituted into another's game recipe.
2. The table's unit is **per 100 trees** for oil palm and **per hectare** for cayenne pepper. Do not compare totals without normalizing denominator and production stage.
3. UTL Table 4.2 published income (12,046.95) is preserved as printed; production value minus production cost gives 11,925.73, a 121.22 thousand Rp difference. Flag for source/table QA; do not silently replace the published figure. The other tables' displayed income should likewise be kept source-faithful.
4. These are 2024 survey estimates of production value/cost, not collector, wholesale, or retail transaction prices, and not approved runtime Tier 1–4 prices or HPP recipes.
5. BPS notes rounding differences and that some cost/subsidy imputations are not yet estimated.

Next research step: extract comparable producer/collector/wholesale/retail price observations with date, geography, unit, quality/grade, and market stage; keep the user's locked coconut/es-kelapa business anchors separate from national survey averages.


## 2026-10-26 — UTL Table 4.2 source-level QA: oil-palm income discrepancy remains open

The official BPS SEP 2024 PDF's indexed text for Table 4.2 was checked directly (printed page 32; other records had incorrectly labelled it page 31). The table reports, for other agricultural holdings (UTL), self-harvested oil palm per 100 trees: production value 25,143.89 thousand Rp; production cost 13,218.16 thousand Rp; published income 12,046.95 thousand Rp; producer price 2.07 thousand Rp/kg; unit cost 1.29 thousand Rp/kg; productivity 12,443.49 kg/100 trees. Source table text also shows income as 91.14% in its percentage column.

Arithmetic QA: 25,143.89 − 13,218.16 = 11,925.73 thousand Rp, which is 121.22 thousand Rp below the published income. This gap is too large to describe as display rounding. The indexed PDF text confirms the displayed published value but does not establish whether the source table has an arithmetic, transcription, or definition issue. Preserve all printed values, flag the discrepancy, and do not silently substitute the calculated difference or promote the income/margin to runtime.

Primary source: BPS, *Hasil Survei Ekonomi Pertanian (SEP) 2024 — Nilai dan Biaya Produksi Beberapa Komoditas Utama pada Subsektor Tanaman Pangan, Hortikultura, dan Perkebunan*, Table 4.2, printed p.32, official PDF https://web-api.bps.go.id/download.php?f=c8PKr3LM32mtv1hwb+JMyW1SOTRVdy9JeXpENmNBK2ozMEkzaVFyZUtHeWpRb3RQUmNPMnA3TDBoT3lWV0MySFNoRTNISlFrdmd4SEhNd2oxWXY4UU9jZEcydXBFeUV6djY2NEEyay9XSXdiQ0NZWVlOcmpESkxBV2tJUjB0T0VOd0NFOG1UZUhBSEJVekdibzZ2M2xzcTdsZ0VscERjRnZHWUtoV3JyKzZlblZXRHgrQzh6ci9BcjMzNWRYblhaeG90aGs3NzZJUHk0VGNtQlo1YlVjT2lsWG16RlJDTDE4dWJJVXk1V2QwL0lYd3M5MHpNMnRvMmcxL3dFd0tiNnFIRzJvL3VmdDVVT2ZDZTJaLzFWSEtLTWpGbTEwMjdXSkZSWElkeDlsOXhnc3NydkdTMThUVU1kS0pOQjkxV01RWHVCNUx6cmN0V1pNQTdXWTFNazE0Y0g2Q1VrOGZLRERoRytybTd4SDRNQU4zMm1XM2JsYXJKMndSazNrcGR3MlY0enpHRHc2WUZpcENucE1kczRMb0t2ZUNYUUN6cDgvaFZUL0s2anlYb01Xa042eHlIWElaWjQ1YTg9

Next verification: inspect the rendered PDF page/table image and technical notes for the definition of “income”; if the table layout still gives no explanation, seek an independent official BPS extract or clarification. Until then, mark the value as source-reported / arithmetic-unreconciled.


## 2026-10-26 follow-up — Technical definition checked against Table 4.2

Follow-up verification opened the official BPS SEP 2024 PDF and searched the technical definitions. The technical explanation states: “Pendapatan adalah selisih nilai produksi dengan biaya produksi” (income is the difference between production value and production cost), printed page 7 / PDF text page 23, lines 793–794 in the indexed extraction. Source: https://web-api.bps.go.id/download.php?f=c8PKr3LM32mtv1hwb+JMyW1SOTRVdy9JeXpENmNBK2ozMEkzaVFyZUtHeWpRb3RQUmNPMnA3TDBoT3lWV0MySFNoRTNISlFrdmd4SEhNd2oxWXY4UU9jZEcydXBFeUV6djY2NEEyay9XSXdiQ0NZWVlOcmpESkxBV2tJUjB0T0VOd0NFOG1UZUhBSEJVekdibzZ2M2xzcTdsZ0VscERjRnZHWUtoV3JyKzZlblZXRHgrQzh6ci9BcjMzNWRYblhaeG90aGs3NzZJUHk0VGNtQlo1YlVjT2lsWG16RlJDTDE4dWJJVXk1V2QwL0lYd3M5MHpNMnRvMmcxL3dFd0tiNnFIRzJvL3VmdDVVT2ZDZTJaLzFWSEtLTWpGbTEwMjdXSkZSWElkeDlsOXhnc3NydkdTMThUVU1kS0pOQjkxV01RWHVCNUx6cmN0V1pNQTdXWTFNazE0Y0g2Q1VrOGZLRERoRytybTd4SDRNQU4zMm1XM2JsYXJKMndSazNrcGR3MlY0enpHRHc2WUZpcENucE1kczRMb0t2ZUNYUUN6cDgvaFZUL0s2anlYb01Xa042eHlIWElaWjQ1YTg9

Therefore, Table 4.2's displayed values remain internally unreconciled under the publication's own stated definition: 25,143.89 − 13,218.16 = 11,925.73 thousand Rp, whereas the table prints income of 12,046.95 thousand Rp. Difference = 121.22 thousand Rp per 100 trees. The table's income percentage 91.14% also does not equal 12,046.95 / 25,143.89; it is approximately 91.14% of production cost (12,046.95 / 13,218.16), suggesting a possible denominator/column issue, but this is an inference, not a confirmed explanation.

Disposition: stronger evidence of an internal table inconsistency is now available, but do not silently correct the source data. Preserve the source-reported value and calculated value separately; flag the record as source-inconsistent and unsuitable for runtime calibration pending BPS clarification or an independent official correction.


### Visual table validation — BPS SEP 2024 UTL Table 4.2 (2026-10-26)

The rendered official PDF page image was inspected (zero-indexed PDF page 45; printed page number 32). The image visibly confirms Table 4.2 and the printed rows: production value 25,143.89; production cost 13,218.16; income 12,046.95; income percentage 91.14; producer price 2.07 thousand Rp/kg; cost per unit 1.29 thousand Rp/kg; productivity 12,443.49 kg/100 trees. This rules out an OCR-only misread of the displayed income value. It does **not** resolve the internal arithmetic discrepancy: under BPS's own definition, production value minus production cost equals 11,925.73, not 12,046.95. The percentage 91.14 corresponds approximately to published income divided by production cost, but that remains an inference about a possible denominator/column issue, not an official explanation. Preserve both values and block runtime calibration pending clarification.

Primary evidence: official BPS PDF, Table 4.2, printed p.32 / PDF page image P45: https://web-api.bps.go.id/download.php?f=c8PKr3LM32mtv1hwb+JMyW1SOTRVdy9JeXpENmNBK2ozMEkzaVFyZUtHeWpRb3RQUmNPMnA3TDBoT3lWV0MySFNoRTNISlFrdmd4SEhNd2oxWXY4UU9jZEcydXBFeUV6djY2NEEyay9XSXdiQ0NZWVlOcmpESkxBV2tJUjB0T0VOd0NFOG1UZUhBSEJVekdibzZ2M2xzcTdsZ0VscERjRnZHWUtoV3JyKzZlblZXRHgrQzh6ci9BcjMzNWRYblhaeG90aGs3NzZJUHk0VGNtQlo1YlVjT2lsWG16RlJDTDE4dWJJVXk1V2QwL0lYd3M5MHpNMnRvMmcxL3dFd0tiNnFIRzJvL3VmdDVVT2ZDZTJaLzFWSEtLTWpGbTEwMjdXSkZSWElkeDlsOXhnc3NydkdTMThUVU1kS0pOQjkxV01RWHVCNUx6cmN0V1pNQTdXWTFNazE0Y0g2Q1VrOGZLRERoRytybTd4SDRNQU4zMm1XM2JsYXJKMndSazNrcGR3MlY0enpHRHc2WUZpcENucE1kczRMb0t2ZUNYUUN6cDgvaFZUL0s2anlYb01Xa042eHlIWElaWjQ1YTg9


## 2026-10-27 — Coconut price benchmark: official producer and consumer series

### Primary-source evidence
Source: Ministry of Agriculture, Pusdatin, *Analisis Kinerja Perdagangan Komoditas Kelapa*, Volume 15 No. 1D (2025), PDF pp. 20–23 (printed pages), Tables 4.2–4.6. Official PDF: https://satudata.pertanian.go.id/assets/docs/publikasi/Buku_Analisis_Kinerja_Perdagangan_Kelapa_2025_-_tte_sign.pdf

- Table 4.2, citing BPS *Statistik Harga Produsen Pertanian*: national monthly producer price for whole coconut, Rp/butir: annual average 2022 Rp3,283; 2023 Rp3,291; 2024 Rp3,422. In 2024 monthly values span Rp3,320 (Jan) to Rp3,692 (Dec).
- Table 4.4, citing BPS *Statistik Harga Konsumen Perdesaan Kelompok Makanan*: national monthly rural consumer price for whole coconut, Rp/butir: annual average 2022 Rp5,268; 2023 Rp5,308; 2024 Rp6,061. In 2024 monthly values span Rp5,847 (Jan) to Rp6,417 (Dec).
- Table 4.6 reports monthly marketing spread (consumer minus producer) in Rp/butir. In 2024 it ranges from Rp2,527 (Jan) to Rp2,725 (Dec); December arithmetic: Rp6,417 − Rp3,692 = Rp2,725.
- Table 4.3 also reports provincial variation among production centers in 2024: annual average producer price in East Java Rp5,122/butir, Riau Rp4,685, Central Java Rp4,162, North Sumatra Rp4,023, Central Sulawesi Rp2,025, and North Sulawesi Rp2,192. Keep provincial values separate from the national average.

### Fit and exclusions for Agrotycoon
These are valid historical macro benchmarks for whole coconut in rural price statistics, not live quotes or a universal retail price. The user's observed procurement reference of Rp3,400/butir is close to the 2024 national producer average (difference −Rp22, or −0.64%), but the comparison is contextual only; it does not establish identical location, quality, contract, or transaction stage. The user's own whole-coconut retail price Rp13,000/butir is intentionally retained as a business-specific prototype input and must not be replaced by the BPS rural consumer average Rp6,061. A premium retail outlet/product/market can differ from the survey's rural consumer price scope.

Do not infer intermediary purchase prices from the producer-consumer spread: the spread is a difference between two aggregate survey series, not an observed middleman margin net of transport, loss, labor, sorting, tax, and capital costs. Do not derive coconut-water/ice-coconut costs from whole-coconut prices without an explicit product-yield and grade model. These benchmark series are suitable for historical market calibration and scenario boundaries, not direct replacement of the user's own baseline.

### Next evidence tasks
1. Extract and verify all 12 monthly rows in Tables 4.2, 4.4 and 4.6 against the rendered PDF table image; retain original values and the source's rounding.
2. Find the 2025/2026 monthly producer series for coconut and an equivalent consumer series, with direct table/period and scope; do not present the Bapanas national staple-price dataset as a coconut source unless coconut is explicitly included. Bapanas's published national producer/consumer monthly datasets describe a restricted dataset accessed through SAPA and their metadata states Rp/kg units, so they are not currently usable for coconut-per-piece calibration without confirming commodity coverage and gaining the data.
3. Continue mapping price stages for other commodities using Ministry of Agriculture *Statistik Harga Komoditas Pertanian 2025* (published 2025-12-29) and BPS 2025 producer-price publications, verifying the exact commodity, unit, province, period and table before adding any numeric point.

References: official Ministry of Agriculture coconut report, Tables 4.2–4.6: https://satudata.pertanian.go.id/assets/docs/publikasi/Buku_Analisis_Kinerja_Perdagangan_Kelapa_2025_-_tte_sign.pdf ; publication metadata for *Statistik Harga Komoditas Pertanian 2025*: https://satudata.pertanian.go.id/details/publikasi/947 ; BPS producer price publication 2025: https://www.bps.go.id/id/publication/2026/04/24/ab557ad3c44be1254c87c5aa/statistik-harga-produsen-pertanian-subsektor-tanaman-pangan-hortikultura-dan-tanaman-perkebunan-rakyat-2025.html ; Bapanas producer dataset metadata: https://data.badanpangan.go.id/datasetpublications/cig/rata-rata-harga-pangan-bulanan-produsen-nasional ; Bapanas consumer dataset metadata: https://data.badanpangan.go.id/datasetpublications/7pm/rata-rata-harga-pangan-bulanan-konsumen-nasional .


## 2026-10-28 — Provincial price spread and publication-year control for coconut

### Verified official series
The Ministry of Agriculture/Pusdatin publication *Statistik Harga Komoditas Pertanian Tahun 2025* is dated December 2025 but its rural producer and rural consumer coconut tables report annual data for 2020–2024. Do not mistake the publication year for the data year. In the PDF (https://satudata.pertanian.go.id/assets/docs/publikasi/c9c87ec57f8a22249659ace0dc306047.pdf):

- Table 2.29, printed p.47 / PDF page 73, producer price for mature unhulled coconut, Rp/butir: national 2020 Rp3,003; 2021 Rp3,248; 2022 Rp3,283; 2023 Rp3,291; 2024 Rp3,422 (growth 2023–2024 +3.97%). Provincial 2024 examples: Riau Rp4,685 (+21.45%); North Sumatra Rp4,023 (+4.90%); West Sumatra Rp3,719 (+5.38%); Jambi Rp3,825 (+3.74%); South Sumatra Rp2,912 (−26.49%); Lampung Rp3,458 (−2.82%).
- Table 5.35, printed p.137 / PDF page 163, rural consumer price for mature coconut, Rp/butir: national 2020 Rp4,815; 2021 Rp5,139; 2022 Rp5,268; 2023 Rp5,308; 2024 Rp6,061 (growth 2023–2024 +14.19%). Provincial 2024 examples: North Sumatra Rp5,326; Riau Rp5,032; South Sumatra Rp5,930. The full province table includes large outliers (for example Papua Pegunungan Rp21,921); do not collapse province-level data to a simple national midpoint or use outliers without verifying collection context.

The producer and consumer series use different survey concepts and should be treated as macro reference series, not a transaction-level supply chain margin. Producer price refers to mature unhulled coconut; product grade and market stage must be aligned before comparing to a user's business purchase/sale price.

### Freshness status
BPS's *Statistik Harga Produsen Pertanian ... 2025* page states that the publication was released 24 April 2026 and covers monthly producer prices in 37 provinces for the 2025 data year: https://www.bps.go.id/id/publication/2026/04/24/ab557ad3c44be1254c87c5aa/statistik-harga-produsen-pertanian-subsektor-tanaman-pangan--hortikultura--dan-tanaman-perkebunan-rakyat-2025.html. The direct PDF link returned a cache-miss error in this retrieval attempt, so no 2025 coconut numeric point is recorded yet. This is a retrieval limitation, not evidence the data do not exist. The Ministry's *Statistik Harga Komoditas Pertanian 2025* is a different publication with many tables through 2024 and selected monthly series for 2025; only use its 2025 values where the individual table explicitly covers that year.

### Data governance action
Keep the validated 2020–2024 coconut benchmark as historical/reference data. Do not label it "current 2025/2026 price." Next, retrieve the BPS 2025 PDF or an official BPS table with a direct coconut row and monthly values; then reconcile scope/unit before adding data to the 60-commodity Tier 1–4 matrix. Existing owner-specific values (whole coconut retail Rp13,000/butir, observed purchase reference Rp3,400/butir, es kelapa Rp5,000/glass and roughly four glasses per coconut) remain separate, business-specific inputs.

Sources: official Ministry of Agriculture PDF Tables 2.29 and 5.35, https://satudata.pertanian.go.id/assets/docs/publikasi/c9c87ec57f8a22249659ace0dc306047.pdf ; BPS 2025 producer-price publication metadata, https://www.bps.go.id/id/publication/2026/04/24/ab557ad3c44be1254c87c5aa/statistik-harga-produsen-pertanian-subsektor-tanaman-pangan--hortikultura--dan-tanaman-perkebunan-rakyat-2025.html .


## Rice national-demand baseline — data-quality gate (2026-10-28)

- Accepted for runtime as official-source observations: BPS 2024 household weekly per-capita “Beras lokal/ketan” consumption = 1.521 kg/person/week; BPS final 2024 annual harvested paddy area ≈10.05 million ha; paddy production ≈53.14 million tonnes GKG; rice production for food consumption ≈30.62 million tonnes.
- Derived, not official: 1.521 × 52 = 79.092 kg/person/year. This annualization is an arithmetic transformation of a weekly survey metric.
- Not calculated: national annual consumption tonnage remains null because a matching official population denominator and a defensible alignment between household consumption category and national rice-demand definition have not yet been sourced. Do not multiply by an unverified population estimate.
- Non-comparable product forms: GKG paddy, rice production for food consumption, and household consumption of “Beras lokal/ketan” are different metrics. Do not use them interchangeably or infer a surplus/deficit by direct subtraction.
- Seasonality: annual totals divided by 365 would be a derived daily mean, not official daily demand; seasonal harvest, stock changes, losses, and distribution must be modeled before translating national quantities into daily NPC market flows.
- Primary sources: BPS consumption table (updated 2026-07-17), https://www.bps.go.id/id/statistics-table/1/MjMxNiMx/rata-rata-konsumsi-per-kapita-seminggu-beberapa-macam-bahan-makanan-penting--2015-2024.html; BPS final paddy/rice 2024 release (2025-02-03), https://www.bps.go.id/id/pressrelease/2025/02/03/2414/pada-2024--luas-panen-padi-mencapai-sekitar-10-05-juta-hektare-dengan-produksi-padi-sebanyak-53-14-juta-ton-gabah-kering-giling--gkg--.html.


## Rice-demand source reconciliation — 2026-10-28

A stronger compatible source for national demand was found after the initial BPS weekly household metric was registered:

- Bapanas 2024 national per-capita rice consumption: 92.1 kg/person/year (row 224, published 2025-01-31), distinct from BPS weekly “beras lokal/ketan” = 1.521 kg/person/week.
- Kementan Pusdatin/Bapanas national balance projection for 2025 (data updated 2025-06-02): beginning stock 8,402,277 t; projected rice production 31,376,296 t; imports 514,804 t; total availability 40,293,371 t; total need 30,975,843 t; published balance 9,317,528 t. This is a forecast, not a realized final 2025 balance.
- The same Table 4.6 displays household need 22,527,000 t and non-household need 8,448,844 t. Their arithmetic sum is 30,975,844 t, one tonne above the published total 30,975,843 t. Runtime retains the published total and components unchanged; discrepancy is not silently corrected.
- Population 284,438,800 is the 2025 mid-year projection cited to BPS Proyeksi Penduduk Indonesia 2020–2050 based on SP2020. It is a projection denominator, not a census count.
- Sources: Bapanas consumption dataset https://data.badanpangan.go.id/datasetpublications/o5x/konsumsi_nasional; Kementan Pusdatin, Buletin Konsumsi Pangan Vol. 16 No. 1 Tahun 2025, Tables 4.5–4.6, https://satudata.pertanian.go.id/assets/docs/publikasi/Buletin_Konsumsi_Pangan_Smtr1-2025-Ok.pdf.
- Keep annual household per-capita consumption, total national demand (household + non-household), stock, production, imports, and projected balance as distinct metrics. Do not use 2024 production numbers as though they describe the 2025 forecast.

- Schema correction after review: `nationalAnnualConsumptionEstimateTon` remains `null` because the official 30,975,843-ton figure includes both household and non-household demand and should not be mislabeled as household consumption. The published total is stored in `nationalDemandProjection.totalNeedTon`.

## Validation blocker — CI accounting report failure (2026-10-28)

Recent GitHub Actions run 40711465568 failed at the first Node regression test, `tests/accounting_ledger.test.js`, with a TypeError at `js/akuntansi.js:65` while reading `iceKarung` from missing `DATA.shop`. Thus the rice-demand test and later tests were not reached; this run is not evidence of a rice-data failure or success. A defensive catalog guard was committed as `450dcfb7367718c52c05bcef5eba91e15b9701d2`. CI must be rerun and its actual log reviewed before the national rice data or any commodity model is considered test-validated. Missing catalog metadata is not replaced with invented market prices; the accounting asset display treats unsupported component value as zero until metadata is available.


## Maize demand: scope and source-vintage reconciliation — 2026-10-28

Official sources provide distinct measures that must not be conflated:

- Bapanas row 225 reports 2024 direct food consumption of maize at 1.5 kg/person/year; the value is provisional. This is not total demand because most national maize use is feed.
- Kementan Pusdatin *Buletin Konsumsi Pangan Vol. 16 No. 1 Tahun 2025*, Figure 5.3 (printed p.34), estimates 2025 total maize need at approximately 14.72 million tonnes, including 13.603 million tonnes for feed (industry plus independent farmers) and 1.117 million tonnes for other uses. These are rounded projections.
- Ditjen PKH *Buku Jagung 2025*, Table 26, projects 8,844,096 tonnes for the feed industry in 2025. The Kementan Pusdatin bulletin's Figure 5.4 cites approximately 8.25 million tonnes for feed-industry demand. The figures differ despite describing the same broad industry-demand category. Source vintage, reporting frame, or definition has not yet been reconciled. Keep both source-linked records and mark the conflict unresolved; do not choose one as final or add them together.
- The 13.603 Mt feed total is a broader category that includes feed industry and independent farmers; it is not directly comparable with the narrower industry-only figures.
- National demand is not calculated from the per-capita metric; `directHouseholdConsumptionTonnage` remains null because no aligned denominator is used for that field. The rounded total-demand components reconcile arithmetically (13.603 + 1.117 = 14.720 Mt), but this is only consistency of rounded displayed values, not proof of realized supply-demand balance.
- Existing 2024 production references include different source totals and moisture bases. Do not compute a national surplus/deficit by subtracting 2025 projected need from 2024 production without reconciling period, moisture content, losses and product definition.

Sources: https://data.badanpangan.go.id/datasetpublications/o5x/konsumsi_nasional; https://satudata.pertanian.go.id/assets/docs/publikasi/Buletin_Konsumsi_Pangan_Smtr1-2025-Ok.pdf; https://ditjenpkh.pertanian.go.id/storage/master/file/8EG4sdWw_2025_Buku_Jagung_%281%29.pdf. Runtime fields and the regression guard are in `js/real_economic_data.js` and `tests/maize-national-demand.test.js`. No tier-level unit economics promoted.


## Validation note — maize demand schema passed, source reconciliation remains open (2026-10-28)

Run 40717841286 passed, including `tests/maize-national-demand.test.js`; this validates the registry's units, provenance, rounded component arithmetic and explicit flag for the unresolved feed-industry projection conflict. It does not resolve that conflict or validate maize Tier 1–4 economics. Keep 8.25 Mt (Kementan Pusdatin bulletin) and 8.844096 Mt (Ditjen PKH Buku Jagung 2025 Table 26) as separate official projections until source period/frame/definition is reconciled.


## Latest CI verification and research gate — 2026-10-28

GitHub Actions run [40717841286](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40717841286) passed on code/test commit `f790d8058542273fe5af7dc95cbb87d3e6d9fc42`. The three newly added Node test-runner suites passed 13/13 subtests: NPC background flows/policies and regional capacity; 60-item market price bounds; and inventory/HPP accounting. The standalone Node and browser/E2E commands in the same workflow also passed, including rice and maize provenance/scope tests.

This supersedes the earlier CI-blocker notes that refer to the accounting fixture/margin expectation as unresolved. Those were real failures in earlier runs; they were corrected and the complete current workflow is green. It does not supersede the research limitations below: maize feed-industry projections remain in conflict (~8.25 Mt vs 8.844096 Mt), maize 2024 production sources/moisture bases remain unaligned, and BPS SEP 2024 livestock table extraction/definition issues remain open. Keep those data-quality flags active despite green software tests.

Next evidence task: reconcile maize source vintage, product moisture basis and losses before deriving any national balance. After that, visually inspect BPS SEP UTP broiler Table 2.10; resolve the UTL oil-palm income-definition mismatch; extract remaining UPB/UTL table rows. No national demand statistic alone authorizes Tier 1–4 farm-level costs, yields or margins.


## Maize production basis clarification — same official BPS publication (2026-10-28)

The 20.48 Mt (28% moisture) and 15.14 Mt (14% moisture) 2024 figures are both reported in the same BPS publication *Luas Panen dan Produksi Jagung di Indonesia 2024*, released 15 August 2025, not competing estimates of the same moisture basis. BPS describes the estimates as combining KSA, the 2024 Ubinan survey and the SKJG2020 conversion survey. The official report also gives 2.55 million ha harvested area. Source: https://www.bps.go.id/id/publication/2025/08/15/2bb49a0af17ec89ac16971de/luas-panen-dan-produksi-jagung-di-indonesia-2024.html.

Audit-only arithmetic: a simple moisture mass-balance gives 20.48 × (1−0.28)/(1−0.14) ≈ 17.146 Mt at 14% moisture, which does not match the source's 15.14 Mt. Do not “correct” the official value using the simple formula; it is not a substitute for the source's conversion-survey method. Retain both official figures and the derived audit value separately. Before building a surplus/deficit comparison, align production moisture basis, post-harvest losses, feed/food demand definition and the 2025 projection period. The runtime and maize regression now preserve this distinction.


## Maize — same-year production observation added; national balance still blocked (2026-10-28)

BPS's final 2025 maize release (2026-02-02) reports harvested area 2.71 million ha and dry shelled maize production of 16.16 million tonnes at 14% moisture: https://www.bps.go.id/id/pressrelease/2026/02/02/2538/luas-panen-dan-produksi-jagung.html. Runtime mirror: `REAL_ECONOMIC_DATA.maizeProduction2025`; regression guard: `tests/maize-national-demand.test.js`.

This observation aligns the production year with the Kementan 2025 rounded national-need projection, but **does not authorize** a surplus calculation. The demand projection's full product form and losses, stock carry-over, imports/exports, feed/seed/industrial balance definitions and post-harvest loss factors still require source-matched evidence. `maizeNationalBalanceEstimate2025` remains null. Preserve the 2024 28%- and 14%-moisture observations separately: a simple moisture-only conversion of 20.48 Mt at 28% gives about 17.146 Mt at 14%, which does not reproduce BPS's published 15.14 Mt; BPS production estimates combine KSA, Ubinan 2024 and SKJG2020, so do not silently replace the published value.


## Final 2025 maize output and balance guard (2026-10-28)

BPS final statistics report 2.71 million ha harvested area and 16.16 million tonnes of dry shelled maize at 14% moisture for 2025 (released 2026-02-02): https://www.bps.go.id/id/pressrelease/2026/02/02/2538/luas-panen-dan-produksi-jagung.html. Compared with 2024 final output of 15.14 Mt at the same 14% moisture basis, the increase is 1.02 Mt, approximately 6.74%. Preserve the exact source values. This does not establish surplus: 2025 need is a rounded projection and feed-industry projections conflict (~8.25 Mt vs 8.844096 Mt), while stocks, trade and post-harvest losses are not reconciled. Runtime intentionally keeps `maizeNationalBalanceEstimate2025: null`.


## Correction — official projected maize balance found; realized balance remains null (2026-10-28)

The earlier note that no official maize balance was available is superseded for **projections**: Kementan Pusdatin's *Buletin Konsumsi Pangan Vol. 16 No. 1 Tahun 2025*, Table 5.6 (printed p.33 / PDF p.37), reproduces the Bapanas food balance updated 2 June 2025. It projects beginning stock 3,579,102 t; JPK production at 14% moisture 16,194,055 t; losses/spillage 748,165 t (4.62%); net production 15,445,889 t; imports 906,040 t; exports 76,959 t; total availability 19,854,073 t; need 14,720,163 t; and ending balance 5,133,909 t. Source: https://satudata.pertanian.go.id/assets/docs/publikasi/Buletin_Konsumsi_Pangan_Smtr1-2025-Ok.pdf. Runtime field: `maizeNationalDemand.nationalBalanceProjection2025`; regression test checks the published fields and audit guard.

The table itself contains three 1-tonne arithmetic discrepancies: gross production minus loss yields 15,445,890 t versus published net 15,445,889 t; published availability components sum to 19,854,072 t versus published availability 19,854,073 t; and published availability minus need yields 5,133,910 t versus published balance 5,133,909 t. Runtime preserves all published values and records these deltas. Keep `maizeNationalBalanceEstimate2025: null` because this is a forecast, not a final realized balance. BPS final 2025 output at 14% moisture is 16.16 Mt, 34,055 t below the Bapanas projection input of 16.194055 Mt; do not replace the forecast balance with a one-line production-minus-need calculation.


## Maize 2025 balance — Table 5.6 exact source values and arithmetic QA

Kementan Pusdatin *Buletin Konsumsi Pangan Vol. 16 No. 1 Tahun 2025*, Table 5.6, printed p.33 / PDF page 37, sourced to Bapanas's 2 June 2025 projection, reports (tonnes): beginning stock 3,579,102; gross JPK production at 14% moisture 16,194,055; losses/spillage 748,165; net production 15,445,889; imports 906,040; exports 76,959; total availability 19,854,073; total need 14,720,163; ending balance 5,133,909. Source: https://satudata.pertanian.go.id/assets/docs/publikasi/Buletin_Konsumsi_Pangan_Smtr1-2025-Ok.pdf.

Arithmetic QA preserves three source discrepancies of one tonne each:
- 16,194,055 − 748,165 = 15,445,890, while published net production is 15,445,889 (−1 t relative to the arithmetic result).
- 3,579,102 + 15,445,889 + 906,040 − 76,959 = 19,854,072, while published availability is 19,854,073 (+1 t relative to component sum).
- 19,854,073 − 14,720,163 = 5,133,910, while published ending balance is 5,133,909 (−1 t relative to arithmetic result).

These are likely display/source arithmetic inconsistencies, not meaningful economic gaps; preserve source figures and explicit audit fields. The projection's production inputs are mixed-vintage: BPS KSA for January–July 2025 and Kementan crop potential for August–December. Final BPS 2025 production at 14% moisture is 16,160,000 t, 34,055 t below the projection input of 16,194,055 t. Do not overwrite the official projection or recompute its balance with the later final production unless all balance components are rebuilt consistently. Official ending balance ~5.13 Mt is a projected stock balance that includes stocks held by factories, traders, farmers and other sources, not proof of freely available retail supply. The independent estimate field remains null.


## Library note quality gate — historical DOCX design/scenario records (2026-10-28)

The three substantive Library DOCX notes were cross-checked against the current source-ledger approach: `data game.docx` is a 223-page historical design archive; `harga komoditi.docx` is a 45-page worked chain-economics scenario file; `data peternakan dan pertanian.docx` is a 17-page mixed-source commodity summary. These files contain useful owner assumptions and feature ideas, but not every number is a matched official observation. In particular, batch sizes, coproduct yields, farm cost totals, BEP and profit estimates must be independently reconciled before runtime use. They do not supersede current branch contracts, owner-locked coconut business values, or official-source entries. No figures were promoted from these documents in this checkpoint.


## Feed-industry projection discrepancy — source identity clarified (2026-10-28)

The 8,844,096 t source is the Direktorat Pakan Ditjen PKH publication *Pemanfaatan Jagung Lokal oleh Industri Pakan Tahun 2024* (Vol. 6, 2025), Table 26, a 2025 feed-industry requirement projection reported through SiJagung. The separate ~8.25 Mt value in Kementan Pusdatin's *Buletin Konsumsi Pangan* Figure 5.4 is a projection from the industry purchase/absorption series. This makes method/vintage difference plausible, but the source does not establish that the series are fully comparable or which is the definitive planning number. Keep `feedIndustryProjectionReconciliationStatus` unresolved, retain both values and provenance, and never add either industry-only projection to the 13.603 Mt all-channel feed-use estimate (which also includes independent farmers).

Runtime metadata in `maizeNationalDemand.sources.feedIndustryDemand2025` now uses the exact publication title, volume, publication year 2025 and reference-data year 2024. The regression test verifies these fields and the SiJagung provenance note.


## New arithmetic discrepancy in SiJagung feed-industry projection prose (2026-10-28)

Table 26 of *Pemanfaatan Jagung Lokal oleh Industri Pakan Tahun 2024* (Direktorat Pakan Ditjen PKH, Vol. 6, 2025) has quarterly projections summing to the annual total 8,844,096 t. Yet the prose says the average monthly requirement is 727.01 thousand t. The annual total divided by 12 is 737,008 t/month, not 727,010 t/month; difference = -9,998 t/month (published prose minus derived average). Runtime field `maizeNationalDemand.sources.feedIndustryDemand2025.sourceArithmeticAudit` records both values and the mismatch. Tests assert that the source's annual/quarterly totals reconcile while the prose average remains flagged. This source arithmetic issue is separate from the larger ~8.25 Mt vs 8.844096 Mt methodology/vintage difference.


## UTP broiler Table 2.10 — later BPS corroboration narrows the discrepancy (2026-10-28)

The previous audit flagged a large mismatch in the extracted UTP broiler values from SEP 2024 Table 2.10: production Rp152,008.05k per 5,000 heads, cost Rp126,445.08k, published income Rp28,639.72k. A later BPS publication, *Peternakan Dalam Angka 2025*, Table 8.3.10 (printed p.122), reproduces the 2024 UTP broiler benchmark with production Rp152,008.05k, cost Rp126,445.06k, published income Rp25,563.00k and feed cost Rp81,754.62k (64.66%). Source metadata is confirmed on the official BPS publication page (released 2026-01-09): https://www.bps.go.id/id/publication/2026/01/09/50771bc6f5761886458558ba/livestock-in-figures-2025.html. The table text is accessible in a public mirror: https://id.scribd.com/document/1009902102/Peternakan-Dalam-Angka-2025-Menurut-Bps.

In the later table, production minus cost is Rp25,562.99k versus published income Rp25,563.00k, a Rp0.01k rounding difference. This strongly suggests the earlier Table 2.10 income/cost transcription should not be trusted as currently written, but the original SEP PDF image still has not been visually inspected. The runtime therefore stores the later values under a clearly labeled research-only benchmark and records the earlier transcription conflict; it does not silently overwrite or promote the old record. CI guard: `tests/utp-broiler-benchmark.test.js`.


## UTL oil-palm Table 4.2 — cost components and income gap preserved (2026-10-28)

The accessible BPS SEP 2024 Table 4.2 text reports UTL oil-palm production value 25,143.89, total cost 13,218.16 and income 12,046.95 (all thousand Rp per 100 trees). Listed cost components sum to 13,212.48, 5.68 below the published cost. Production minus published cost is 11,925.73, 121.22 below published income. The source note states decimals may differ due to rounding and that cost/subsidy imputation has not yet been estimated for some expenditure variables; it does not explicitly reconcile these two differences. Preserve the published values and audit deltas; do not attribute the entire gap to rounding without evidence.

Official BPS publication page: https://www.bps.go.id/id/publication/2025/01/24/52f47865afe337fd047404a8/hasil-survei-ekonomi-pertanian-sep-2024-nilai-dan-biaya-produksi-beberapa-komoditas-utama-pada-subsektor-tanaman-pangan-hortikultura-dan-perkebunan.html. Table text inspected in public mirror: https://id.scribd.com/document/1007237393/hasil-survei-ekonomi-pertanian-sep-2024-nilai-dan-biaya-produksi-beberapa-komoditas-utama-pada-subsektor-tanaman-pangan-hortikultura-dan-perkebun. Runtime benchmark `utlOilPalmBenchmark2024` and test `tests/utl-oil-palm-benchmark.test.js` preserve the source values; original table image verification remains open.


## Official PDF inspection update (2026-10-29)

The official BPS SEP 2024 crop/estate PDF was opened directly and Table 4.2 (printed p.32) visually inspected. The displayed UTL oil-palm values match the registered source values and cost components; image verification is complete, but the Rp5.68k cost-component gap and Rp121.22k income gap remain unresolved. The official BPS SEP 2024 livestock PDF text was also opened directly: Table 2.10 confirms the source text layer reports production Rp152,008.05k, cost Rp126,445.08k and income Rp28,639.72k per 5,000 final-stock heads. The calculated production-minus-cost value is Rp25,562.97k; this discrepancy exists in the official PDF text extraction. Screenshot rendering of the page timed out, so visual verification remains open. A later BPS publication differs and reconciles within rounding; keep both series separately recorded until clarified.


## BPS income-definition gate — UTL oil palm and UTP broiler (2026-10-29)

The official BPS SEP 2024 technical notes define “income” as the difference between production value and production cost (official crop/estate PDF, PDF page P23, lines 759–760 in the extracted text). Therefore the UTL Table 4.2 printed income Rp12,046.95k differs from the derived production-minus-cost Rp11,925.73k by Rp121.22k, a real unresolved source discrepancy, not something we can explain solely by rounding. The table image is now visually verified; retain the printed value and the derived value separately. The listed cost components sum to Rp13,212.48k, Rp5.68k below published cost Rp13,218.16k. BPS also notes some cost/subsidy imputations were not estimated; whether that explains either gap is not established.

For UTP broiler Table 2.10, the official PDF text layer confirms production Rp152,008.05k, cost Rp126,445.08k, income Rp28,639.72k per 5,000 final-stock heads. Under BPS's own income definition, derived income is Rp25,562.97k, leaving a Rp3,076.75k mismatch. The official table image still could not be rendered due repeated timeout. Later BPS *Peternakan Dalam Angka 2025* uses cost Rp126,445.06k and income Rp25,563.00k, which reconciles within Rp0.01k; retain both publications independently and do not silently correct the earlier table. No game/Tier parameter is changed.


## Latest source verification and regression checkpoint (2026-10-29)

GitHub Actions run [40792046198](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40792046198) passed the current regression workflow at test commit `91a196490a005f47fc84f09819281878860db7b6`, including 13/13 Node test-runner subtests, both livestock benchmark tests, standalone Node tests, browser smoke and E2E suites.

- UTL oil-palm Table 4.2 image status is `visually_verified_official_pdf_image`; do not retain the former “not yet verified” status. The source arithmetic gaps remain unresolved and separately guarded by `tests/utl-oil-palm-benchmark.test.js`.
- UTP broiler Table 2.10 is verified in the original official PDF text layer, but the table image is not verified. Keep its original reported income and derived income separate from the later *Peternakan Dalam Angka 2025* record, which reconciles within Rp0.01k. The regression now guards that distinction.
- Next extraction queue: remaining UTP livestock commodities and relevant UPB/UTL tables, only with exact table/page and denominator/source verification. No Tier 1–4 production recipe is authorized by these research-only rows.


## 2026-10-29 — Additional UTP cattle table transcription and arithmetic gate

Added research-only BPS *Peternakan Dalam Angka 2025* Table 8.3.1–8.3.3 data for beef cattle, dairy cattle and meat buffalo to `js/real_economic_data.js`, with regression guard `tests/utp-livestock-benchmarks.test.js`. The official publication metadata is confirmed, but the BPS download endpoint timed out and table figures in this pass were transcribed from a public mirror. These rows are **not primary-PDF visually verified** and remain `research_reference_only`.

- Beef cattle (per head): production 3,290.37; cost 716.12; income 2,574.26; production minus cost 2,574.25; listed cost components 716.13. Each discrepancy is 0.01 thousand Rp.
- Dairy cattle (per head): production 10,141.12; cost 5,094.66; income 5,046.46; production minus cost 5,046.46; listed components 5,094.65, 0.01 below reported cost.
- Meat buffalo (per head): production 3,697.39; cost 533.97; income 3,163.42; production minus cost matches; listed components sum 427.32, 106.65 below reported cost. This is a material source/transcription/component gap and blocks promotion.

CI now includes the new standalone regression. Do not claim it passed until the workflow triggered by the new code/test/CI commits finishes green. Next research action is to obtain and visually inspect the official PDF tables (especially buffalo) or explicitly retain the blocker; then continue UTP Tables 8.3.4–8.3.10 and matched UPB/UTL tables. Do not promote any of these research rows into Tier 1–4 recipes.


## CI confirmation — UTP cattle benchmark regression (2026-10-29)

GitHub Actions run [40857528843](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40857528843) passed at code/test/CI commit `92fcef854c2219d1c68a51c7d3fc4b786296409f`. The new UTP cattle benchmark test passed along with all existing Node, browser smoke and E2E steps. This confirms structural/provenance/arithmetic assertions only; it does not independently verify the underlying secondary-transcribed table figures against original BPS PDF images. Latest HEAD `8a7ed1716aa244d22fd150fdce653778cc9a4d7c` includes documentation-only commits after the tested code SHA.


### Additional UTP records — goat and native chicken (2026-10-29)

Extended the same research-only dataset with BPS *Peternakan Dalam Angka 2025* Table 8.3.5 (meat goat) and Table 8.3.7 (native chicken). Goat production/cost/income are Rp660.93k/Rp155.39k/Rp505.54k per head; components total Rp155.38k. Native chicken production/cost/income are Rp34.15k/Rp15.61k/Rp18.53k per head; production minus cost is Rp18.54k and components total Rp15.62k. These small but explicit differences are retained rather than silently rounded away. Numeric table data still comes from a public mirror; official PDF visual verification is open. The updated regression asserts these values and all component sums.


### Regression status for expanded UTP livestock set (2026-10-29)

The expanded UTP livestock benchmark test passed in [run 40857810264](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40857810264) at test commit `91e0e1cb5baa7f712199b9e020814b19aebab329`; full workflow is green. Five benchmark records are now guarded. This is a code/provenance/arithmetic test, not primary-source validation: official PDF images remain unverified and the buffalo cost-component gap remains open.


### Laying-duck table added (2026-10-29)

Added UTP Table 8.3.8 from the BPS publication's accessible mirror: per 1,000 heads, production Rp140,316.23k, cost Rp75,420.46k, income Rp64,895.77k, feed Rp60,009.13k (79.57%). Aggregate arithmetic and listed component sum reconcile. Keep the row research-only because the official PDF/table image was not visually verified; do not divide it into per-head or per-egg economics without a validated production denominator/yield.


### Itik Manila benchmark and Table 8.3.10 pagination correction (2026-10-29)

Added Table 8.3.9 Itik Manila per head: production Rp39.80k, cost Rp20.75k, income Rp19.06k, feed Rp15.56k / 74.98%; derived income is Rp19.05k (published value +Rp0.01k), while listed components sum to cost. The original PDF image remains unverified.

A pagination audit of the accessible publication table of contents places Table 8.3.9 at printed p.122. The following Table 8.3.10 broiler table is therefore registered as printed p.123 rather than p.122. Updated runtime metadata and test guard accordingly; this fixes a documentation/source locator mismatch and does not close visual verification.



### Latest regression and failure/fix trail (2026-10-29)

The seven-record UTP livestock dataset and broiler table-page correction passed full regression in run [40858451709](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40858451709), test commit `f0367036cb40b7d124a0119d1e4c288c5f89f6ee`. Two interim runs failed because the new laying-duck insertion left an extra closing brace; corrected in `2e4d7ca8c7318a55403a324b1efe72ed1095206d`, whose full run [40858229396](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40858229396) passed. These are resolved implementation failures, but source-table image verification and buffalo's Rp106.65k component gap remain open.


## Current HEAD and renewed 100-commit audit checkpoint (2026-10-29 10:35 UTC)

- Re-fetched the current latest 100 commits after the livestock implementation. Range: HEAD `ed19a1653438ddcdedf6b7adda4aaa20d492c3d4` (2026-10-29 10:34:37 UTC) back to `97d05155cb76e423eb055f03c3bbfbb5ddcf5f33` (2026-10-28 15:45:10 UTC). Themes include national maize production/demand/source-vintage QA, NPC market/economy regression, rice balance and semantics, livestock cost benchmarks, source provenance and CI/handoff corrections. The newest five commits are documentation checkpoints following a successful code/test run.
- Branch heads: `feat/production-tier-taxonomy` = `ed19a1653438ddcdedf6b7adda4aaa20d492c3d4`; `fix/core-auto-warung-accounting-ui` = `fc951b248eea487f09c8b683c782aff1dfc6c222`; `main` = `fc2f908b309b9864e8b24737f3b5f848f32d1392`. Work remains on the feature branch only; no map files changed.
- Latest green test run for current data/test implementation: [40858451709](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40858451709), test commit `f0367036cb40b7d124a0119d1e4c288c5f89f6ee`. The new seven-record UTP livestock test and all existing regression/E2E steps passed. Latest HEAD commits after the test SHA are documentation-only.
- Source evidence gate remains open: the new cattle, goat, native chicken, laying duck and Manila duck records are secondary-transcribed from a public mirror of BPS `Peternakan Dalam Angka 2025`; official catalogue metadata is verified but original table images are not. Do not promote these to Tier recipes. Buffalo component sum remains Rp106.65 thousand below the reported total cost.
- Next work item: continue official primary-source table verification and remaining UTP/UPB/UTL extraction; if the official PDF remains inaccessible, record the exact blocker and proceed to other verifiable primary tables. Then return to the unresolved maize feed-industry projection method/vintage conflict. Maintain code + register + audit + plan + handoff updates for every data addition.


## 2026-10-30 — Renewed commit-window and BPS source-access audit

- Reviewed the newest 100 commits on feat/production-tier-taxonomy, HEAD 2aae7b164db94c3169cf54d7b86dc17e69e4ea57 through the maize handoff window beginning at 0225185302f3... The livestock benchmark sequence includes seven research-only UTP rows and table-page/source corrections; all rows remain secondary-transcribed pending original table verification.
- Primary-source access attempt: official BPS catalogue metadata for Peternakan Dalam Angka 2025 is confirmed (catalogue 5301008; publication 05200.26001; release 2026-01-09; file 19.34 MB). Direct browser retrieval of the publication page returned 403; official BPS SEP 2024 livestock download timed out. Therefore no fresh original-table image verification is claimed. This is a source-access limitation, not a new data discrepancy.
- Keep the buffalo component gap explicit: listed cost components sum Rp427.32 thousand versus reported total cost Rp533.97 thousand (difference -Rp106.65 thousand). Do not invent or proportionally allocate the missing component.
- Full regression remains green on tested code commit f0367036cb40b7d124a0119d1e4c288c5f89f6ee (run [40858451709](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40858451709)); later commits in this reviewed window are documentation-only. This is not a new test of the documentation HEAD.
- Next audit target: resolve the maize feed-industry projection difference between 8,844,096 t/year and the separate rounded 8.25 million t/year figure using source vintage, table, unit, channel coverage and methodology. Keep feedIndustryProjectionReconciliationStatus unresolved unless evidence establishes a defensible reconciliation.


## 2026-10-30 — maize feed projection scope reconciliation from primary PDFs

Official PDFs were inspected directly. Ditjen PKH, Pemanfaatan Jagung Lokal oleh Industri Pakan Tahun 2024 Vol. 6/2025, Table 26 (printed p.44), reports 8,844,096 t for the 2025 SiJagung-reported industry need projection; its quarterly values sum exactly to the annual total. The prose monthly average 727.01 kt conflicts with the annual total divided by 12 (737.008 kt/month), so the 9.998 kt/month error remains flagged.

Kementan Pusdatin, Buletin Konsumsi Pangan Vol. 16 No. 1/2025 (printed p.32 and Figure 5.4 on p.35), describes approximately 8.25 Mt as the factory purchase/absorption projection and approximately 5.36 Mt for independent/self-mixing farmers. Thus 8.25 Mt is a different reporting series from the 8.844096 Mt SiJagung-reported need projection, not a replacement for it. The two factory figures differ by 594,096 t; adding the rounded factory purchase estimate and independent-farmer estimate yields 13.61 Mt, 7,000 t above the rounded 13.603 Mt national feed-use estimate. This supports broad consistency but does not prove exact equivalence.

Runtime now stores this distinction under feedIndustryProjectionReconciliation2025 and changes the status to distinct_series_scope_documented_not_directly_comparable, while explicitly retaining the small rounded-series gap. No value is silently overwritten, summed as if independent, or promoted to the national total need. Test commit ceed808abbe6a0f05bfc31d5c369cb0c853497a2 must pass the full CI workflow before the updated guard is reported green.


## CI result — feed projection series guard (2026-10-30)

The updated maize series distinction guard passed in GitHub Actions run [41009050507](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/41009050507), test commit ceed808abbe6a0f05bfc31d5c369cb0c853497a2. The complete node-regression job passed. The prior data-only commit run [41009037960](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/41009037960) failed on the old expected status value before the test commit was updated; the test commit corrected that stale expectation and added reconciliation guards. This is an expected sequencing failure that remains in the history. A green test proves the status/derived arithmetic assertions, not that the two official projections are exactly equivalent. The 9,998 t/month source prose discrepancy and 7,000 t rounded-series gap remain documented.
