# Kementan Statistik Pertanian 2025 — Production/Yield Source Register

Date: 2026-10-20
Branch: `feat/production-tier-taxonomy`
Official source: https://satudata.pertanian.go.id/assets/docs/publikasi/7ac141132b916c67eeac812c81d140e3.pdf

## Source verified

The official Ministry of Agriculture publication *Statistik Pertanian / Agricultural Statistics 2025* was located and its searchable source text was checked. The foreword states that the book provides five-year series across upstream agribusiness inputs, farming (production and population), downstream agribusiness, trade, prices and consumption. It compiles information from directorates within the Ministry, BPS, investment, meteorology and land agencies. This is a suitable bulk source family for production/population and sector context, but every specific series still needs table-level extraction and unit reconciliation.

## Evidence use policy

- Production volume is not farm yield unless the corresponding harvested area or population denominator matches.
- Production totals do not establish unit production cost, farm-gate revenue, or net profit.
- Keep commodity form and stage distinct: fresh crop vs dry/processed product; liveweight vs carcass; TBS vs processed palm oil; wet latex vs thick rubber; green coffee bean vs cherry.
- Preserve year, geography, source table, unit, denominator and revision notes for every extracted value.
- Do not infer missing rows from national totals, neighboring provinces, or another commodity.
- Do not promote any observation to game runtime without a matched production cycle, yield, saleable output, input costs, labor, losses, overhead/fixed costs and comparable farm-gate price.

## Next bulk extraction batch

Extract the five-year series and table metadata for all relevant owner rows in one pass: food crops, horticulture, plantation crops, livestock, aquaculture/capture fisheries, and then separate mining/energy/manufacturing source families. Cross-link extracted rows to `docs/COMMODITY_60_BULK_AUDIT.md` and `docs/COMMODITY_60_BULK_DATA_REGISTER.md`.

## Current coverage statement

This register documents source discovery and scope, not completed numeric extraction. It does not increase the count of exact observations. Current accepted checkpoint remains: 60/60 owner rows in the audit matrix; 27 owner rows with category-level historical producer-price series in the Kementan price crosswalk; 0/60 complete validated economic models; 0/60 runtime approvals. No runtime or canonical commodity ID changes are authorized by this source register.


## Bulk table locator pass — 2026-10-20

A table-of-contents pass was completed against the official searchable text of *Statistik Pertanian 2025*. These are extraction targets, not numeric observations:

| Owner rows / family | Official table locator | Published scope | Extraction gate |
|---|---|---|---|
| #3 Padi, #4 Jagung, #13 Kedelai, #15 Kacang Tanah | Tables 2.1.1–2.1.13, printed pp.109–121 | Production, harvested area and/or yield for paddy and secondary crops; several provincial series 2020–2024 | Preserve paddy GKG/GKP conversion and moisture basis; do not merge crop forms |
| #10 Singkong, #9 Ubi Jalar | Tables 2.1.8–2.1.9, printed pp.116–117 | Cassava and sweet potato production by province, 2019–2024 | Production only is not unit yield; locate matching area/denominator series |
| #27 Sapi Potong, #28 Sapi Perah, #29 Kambing, #25 Ayam Petelur, #26 Ayam Pedaging, #33 Telur Bebek, #36 Ayam Kampung | Table 2.4.1, printed p.270; population tables 2.4.2–2.4.15, pp.271–284 | Livestock population and production 2020–2024; separate provincial population series for cattle, goats, native chicken, layers, broilers and ducks | Separate animal population from meat/egg/milk output; no per-animal productivity without matching production class and period |
| #37 Kopi Robusta, #38 Kopi Arabika, #39 Kakao, #40 Sawit/TBS, #41 Cengkeh, #42 Pala, #43 Vanili Kering, #45 Teh Pucuk Basah, #46 Lada Putih, #47 Lada Hitam, #48 Karet | Plantation production tables 2.3.x and productivity tables 2.3.34–2.3.39, printed pp.254–259 for rubber, coconut, palm oil, coffee, tea and pepper productivity; nutmeg production table 2.3.30, p.250 | Production/population/area series by plantation class and province, generally 2020–2024 | Plantation aggregate classes may not distinguish species/cultivar or output stage; match planted/harvested area and product form before deriving yield |
| #5 Cabai Rawit, #6 Bawang Merah, #7 Kentang, #8 Tomat, #11 Pisang, #12 Mangga, #14 Pepaya, #16 Kubis, #17 Wortel, #19 Timun | Horticulture chapter table family; table-level locators still need extraction | Production and area series where covered | Do not assign a table number until verified from the source contents or table itself |

Source: official Kementan PDF https://satudata.pertanian.go.id/assets/docs/publikasi/7ac141132b916c67eeac812c81d140e3.pdf. Table numbers/pages above were taken from its searchable contents, not inferred from another edition. The PDF is too large for the web extraction viewer to open in full, so the underlying numeric rows have not yet been transcribed in this pass.

### Additional official cross-check source

BPS released *Statistik Tanaman Perkebunan Tahunan Indonesia 2025* on 2026-08-31, revised 2026-09-16. Its stated coverage includes area, production and export/import for oil palm, coffee, cocoa, rubber, tea, cloves, coconut, cashew, sago, nutmeg and pepper, using plantation-company survey data plus smallholder data from Ditjen Perkebunan. Official page: https://www.bps.go.id/id/publication/2026/08/31/917571f773e8dde67bf24f13/statistik-tanaman-perkebunan-tahunan-indonesia-2025-kelapa-sawit-kopi-kakao-karet-teh-dan-komoditas-perkebunan-unggulan.html. This is a promising focused source for rows #37–48 but still requires table-level numeric extraction and product-form reconciliation.

### Checkpoint after locator pass

No numeric observation was added by this pass. Do not increment extracted observation counts. It only reduces source-navigation work and defines bulk extraction targets. Complete models remain 0/60; runtime approvals remain 0/60. Documentation-only; tests not run.


## BPS source expansion for horticulture and sugarcane — 2026-10-20

The source search identified two official BPS publications that should be used alongside Kementan *Statistik Pertanian 2025* rather than forcing every crop through one large PDF:

1. **Horticulture:** BPS, *Statistik Hortikultura 2025*, released 2026-06-12 (Catalogue 5204003; Publication 05100.26011). The official abstract describes ATAP 2025 for 18 strategic horticultural commodities, with production, harvested area, number of productive plants and supporting consumption/trade indicators. Source: https://www.bps.go.id/id/publication/2026/06/12/43da5ec30fc7d87985e108a5/statistik-hortikultura-2025.html. Use this for matching owner rows #5–#8, #11–#12, #14, #16–#20 only where the specific commodity is actually represented.
2. **Seasonal estate crops:** BPS, *Statistik Tanaman Perkebunan Semusim Indonesia 2025 (Tebu dan Tembakau)*, released 2026-08-31 and revised 2026-09-16 (Catalogue 5501009; Publication 05100.26022). The official abstract describes area and production by province and management status plus export/import data. Source: https://www.bps.go.id/id/publication/2026/08/31/aa1f04245928352fdf4cb63f/statistik-tanaman-perkebunan-semusim-indonesia-2025-tebu-dan-tembakau.html. For owner row #44 Tebu, cane tonnage must not be treated as sugar output; mill recovery and payment basis remain separate model inputs.

The BPS permanent-estate publication *Statistik Tanaman Perkebunan Tahunan Indonesia 2025* was also verified as covering area/production by province and export/import for oil palm, coffee, cocoa, rubber, tea, clove, coconut, cashew, sago, nutmeg, pepper and kemiri sunan. Source: https://www.bps.go.id/id/publication/2026/08/31/917571f773e8dde67bf24f13/statistik-tanaman-perkebunan-tahunan-indonesia-2025-kelapa-sawit-kopi-kakao-karet-teh-dan-komoditas-perkebunan-unggulan.html.

**Extraction status:** source scope verified, but this update did not transcribe numeric rows from these publications. Therefore exact observation counts, yield counts and complete-model counts must not increase. Numeric extraction still requires table/figure locator, period, geography, unit, product form and denominator. Tests not run; no runtime changes.


## Numeric extraction tranche — BPS food-crop aggregates, 2024

This tranche records numeric observations from official BPS releases/table search results. Values are **national annual aggregates**, not farm-level economics and not runtime parameters.

| Owner row | Indicator | Value as published | Period / geography | Unit / product basis | Source |
|---|---|---:|---|---|---|
| #3 Padi | Harvested area | approximately 10.05 million | 2024 / Indonesia | ha | BPS, *Panen dan Produksi Padi Nasional (ATEP) 2024*, released 2025-02-13: https://kupangkota.bps.go.id/id/pressrelease/2025/02/13/488/pada-2024--luas-panen-padi-di-indonesia-mencapai-sekitar-10-05-juta-hektare-dengan-produksi-padi-sebanyak-53-14-juta-ton-gabah-kering-giling--gkg--.html |
| #3 Padi | Paddy production | 53.14 million | 2024 / Indonesia | tonnes, gabah kering giling (GKG) | Same BPS release above |
| #3 Padi | Rice production for food consumption | 30.62 million | 2024 / Indonesia | tonnes, rice equivalent as reported by BPS | Same BPS release above |
| #4 Jagung | Harvested area | 2.55 million | 2024 / Indonesia | ha | BPS, *Luas Panen dan Produksi Jagung di Indonesia 2024*, released 2025-08-15: https://www.bps.go.id/id/publication/2025/08/15/2bb49a0af17ec89ac16971de/luas-panen-dan-produksi-jagung-di-indonesia-2024.html |
| #4 Jagung | Production | 20.48 million | 2024 / Indonesia | tonnes, shelled dry maize at 28% moisture content | Same BPS publication above |

**Evidence classification and limits**

- Extraction count for this tranche: **2 commodity records / 5 numeric indicators** (three paddy indicators, two maize indicators). Published rounded values are preserved as rounded; do not manufacture extra precision.
- BPS reports the maize series as dry shelled maize at 28% moisture. Do not compare it directly with a different moisture basis without a documented conversion.
- The paddy GKG series and rice-equivalent output are different product bases; do not combine or treat rice output as paddy output.
- National annual aggregates do not identify provincial or farm-level yield, costs, sale price, loss rates, or profit. No yield has been derived in this tranche, and no economic model is validated by these figures alone.
- These are 2024 observations, not current 2026 prices or output. No game data, canonical IDs, or runtime parameters changed. Tests not run (documentation-only).


## Numeric extraction tranche — BPS seasonal vegetables, 2024

Extracted eight national production values from the official BPS statistics table *Produksi Tanaman Sayuran dan Buah-Buahan Semusim Menurut Jenis Tanaman, 2024* (last updated 2025-06-10). Source table: https://www.bps.go.id/id/statistics-table/3/VFV4MmQxaG9kakZrVUdWeEx6aDFUMnN6WmpocVp6MDkjMw%3D%3D/produksi-tanaman-sayuran-dan-buah---buahan-semusim-menurut-jenis-tanaman--2024.html?year=2024

| Owner row | Crop as published by BPS | Production | Period / geography | Published unit |
|---|---|---:|---|---|
| #6 | Bawang merah / shallots | 20,857,208.27 | 2024 / Indonesia | kuintal (kw/qui) |
| #21 | Bawang putih / garlic | 394,380.19 | 2024 / Indonesia | kuintal (kw/qui) |
| #5 | Cabai rawit / cayenne pepper | 15,687,569.77 | 2024 / Indonesia | kuintal (kw/qui) |
| #7 | Kentang / potato | 12,704,492.21 | 2024 / Indonesia | kuintal (kw/qui) |
| #19 | Ketimun / cucumber | 3,991,993.48 | 2024 / Indonesia | kuintal (kw/qui) |
| #16 | Kubis / cabbage | 14,559,335.48 | 2024 / Indonesia | kuintal (kw/qui) |
| #8 | Tomat / tomato | 11,527,914.77 | 2024 / Indonesia | kuintal (kw/qui) |
| #17 | Wortel / carrot | 6,816,552.67 | 2024 / Indonesia | kuintal (kw/qui) |

**Interpretation gates**

- Extraction count in this tranche: **8 crop records / 8 production indicators**. Values are copied as published; unit is retained as quintal rather than silently relabelled tonnes.
- These are national production totals, not farm-level yields. No yield calculation is made because the matching harvested-area denominator is not recorded in this tranche.
- Production totals alone do not establish saleable grade, harvest losses, costs, farm-gate price, or profit. Product-level models remain unvalidated and no values are approved for runtime.
- Data year is 2024; this is not a current-price series. No game data, canonical IDs or runtime parameters changed. Documentation-only; tests not run.


## Numeric extraction tranche — BPS annual plantation crops, 2024

Extracted the national Indonesia row from BPS, *Produksi Tanaman Perkebunan Menurut Provinsi dan Jenis Tanaman (Ribu Ton), 2024*, last updated 2026-08-27. Official table: https://www.bps.go.id/id/statistics-table/2/MjU2NiMy/produksi-tanaman-perkebunan-menurut-provinsi-dan-jenis-tanaman--ribu-ton-.html

| Crop as published by BPS | Production | Period / geography | Published unit | Owner-row matching note |
|---|---:|---|---|---|
| Kelapa sawit | 45,436.20 | 2024 / Indonesia | thousand tonnes | #40 candidate; preserve the source's production form and confirm it before use as TBS output |
| Kelapa | 2,792.23 | 2024 / Indonesia | thousand tonnes | Generic coconut only; does not separate owner-locked coconut cultivars or fresh-nut unit basis (#1/#2) |
| Karet | 2,132.09 | 2024 / Indonesia | thousand tonnes | #48 candidate; do not assume equivalence to wet latex or thick rubber without the source's product-form definition |
| Kopi | 813.35 | 2024 / Indonesia | thousand tonnes | Generic coffee; not robusta-specific, so comparator only for #37 until cultivar/form is matched |
| Kakao | 617.11 | 2024 / Indonesia | thousand tonnes | Cocoa production aggregate; product form/stage must be confirmed before matching an owner row |
| Teh | 118.90 | 2024 / Indonesia | thousand tonnes | Tea aggregate; product form/stage must be confirmed before matching an owner row |
| Tebu | 2,465.51 | 2024 / Indonesia | thousand tonnes | Cane production, not sugar output or farmer net revenue |

**Evidence classification and limits**

- Extraction count: **7 crop records / 7 numeric production indicators**. Values are transcribed from the BPS table's national row; decimal comma notation is normalized to decimal points while retaining the published unit of thousand tonnes.
- This table is distinct from BPS's separate *Produksi Perkebunan Besar Tahunan* table, which covers large plantations only. The values above come from the provincial table whose publication notes combine plantation-company survey data with smallholder plantation data to obtain Indonesian totals. Do not substitute the large-plantation-only figures.
- These are annual national production aggregates, not yields or saleable output. No harvested-area denominator, grade/rejection rate, matched farm-gate price or cost bundle is inferred here. Owner-row matches with different commodity forms remain provisional/comparator-only.
- No game data, canonical IDs or runtime parameters changed. Documentation-only; tests not run.


## Matched harvested-area denominators and derived productivity — BPS seasonal vegetables, 2024

Matched the eight production observations above with BPS, *Luas Panen Tanaman Sayuran dan Buah-Buahan Semusim Menurut Jenis Tanaman, 2024*, last updated 2025-06-10: https://www.bps.go.id/id/statistics-table/3/VTNWM01VdGhTelZTTTNSS1NFSkVZazkzWjJKcWR6MDkjMw%3D%3D/harvested-area-of-temporary-vegetable-and-fruit-crops-by-type-of-crops----2024.html?year=2024. Production and area are both national 2024 values for the same named crop categories. Derived productivity = published production (quintals) / harvested area (ha); 1 quintal = 100 kg.

| Owner row | Crop | Production (quintals) | Harvested area (ha) | Derived productivity (quintals/ha) | Derived productivity (kg/ha) |
|---:|---|---:|---:|---:|---:|
| #6 | Bawang merah | 20,857,208.27 | 188,796.36 | 110.47 | 11,047 |
| #21 | Bawang putih | 394,380.19 | 5,317.78 | 74.16 | 7,416 |
| #5 | Cabai rawit | 15,687,569.77 | 191,884.29 | 81.76 | 8,176 |
| #7 | Kentang | 12,704,492.21 | 67,487.54 | 188.25 | 18,825 |
| #19 | Ketimun | 3,991,993.48 | 38,246.93 | 104.37 | 10,437 |
| #16 | Kubis | 14,559,335.48 | 63,672.35 | 228.66 | 22,866 |
| #8 | Tomat | 11,527,914.77 | 58,995.13 | 195.40 | 19,540 |
| #17 | Wortel | 6,816,552.67 | 37,162.65 | 183.42 | 18,342 |

**Classification:** 8 matched production-area pairs and 8 derived productivity indicators. The kg/ha column is a unit conversion from the derived quintals/ha, not an independent BPS observation. Values are rounded to two decimals in quintals/ha and whole kg/ha; underlying ratios use the published totals. These are national aggregate ratios, not necessarily representative farm-level yields or saleable yield. Survey definitions, multi-harvest accounting, grade/rejection, losses, costs and farm-gate revenue remain unvalidated. No unit economics or runtime approval follows from this calculation.


## Matched total-area denominators — BPS plantation crops, 2024 (not yield)

Matched the seven national 2024 plantation production categories already recorded above to the BPS national 2024 total-area table. Production and area both report Indonesia and the same crop categories. Production source: BPS, *Produksi Tanaman Perkebunan Menurut Provinsi dan Jenis Tanaman (Ribu Ton)*, updated 2026-08-27: https://www.bps.go.id/id/statistics-table/2/MjU2NiMy/produksi-tanaman-perkebunan-menurut-provinsi-dan-jenis-tanaman--ribu-ton-.html. Area source: BPS, *Luas Areal Tanaman Perkebunan Menurut Provinsi dan Jenis Tanaman (Ribu Hektar)*, updated 2026-03-06: https://www.bps.go.id/id/statistics-table/2/MjU2NSMy/luas-areal-tanaman-perkebunan-menurut-provinsi-dan-jenis-tanaman.html.

| Crop as published by BPS | Production (thousand tonnes) | Total planted area (thousand ha) | Status of denominator |
|---|---:|---:|---|
| Kelapa sawit | 45,436.20 | 16,013.04 | Total area; not verified as mature/harvested area |
| Kelapa | 2,792.23 | 3,290.95 | Total area; not verified as mature/harvested area |
| Karet | 2,132.09 | 3,149.28 | Total area; not verified as mature/harvested area |
| Kopi | 813.35 | 1,273.92 | Total area; generic coffee, not robusta-only |
| Kakao | 617.11 | 1,367.43 | Total area; product stage still needs matching |
| Teh | 118.90 | 97.54 | Total area; product stage still needs matching |
| Tebu | 2,465.51 | 520.82 | Total area; cane output is not sugar output |

**Classification:** 7 matched production/total-area pairs. These denominator values are useful source matches but **must not be described as productivity or farm yield**. BPS metadata for the plantation-productivity indicator defines productivity as production divided by harvested area / area of producing plants, not total planted area. Retrieve the mature-producing-area series (TM / tanaman menghasilkan or the exact applicable harvested area) before calculating productivity. Do not calculate economic margins from these aggregates. The product-form caveats above remain active; no runtime values or canonical IDs changed. Documentation-only; tests not run.


## Verified producing-area denominator — coffee, 2024

A follow-up search found an official Ditjen Perkebunan actual-data series that separates producing area (TM), immature area (TBM), and non-producing/damaged area (TTM/TR). For coffee in 2024, the source reports: TM 976,435 ha; TBM 186,453 ha; TTM/TR 111,030 ha; total area 1,273,918 ha; production 813,346 tonnes; published productivity 833 kg/ha. Source: Ditjen Perkebunan, *Laporan Kinerja Ditjen Perkebunan 2025*, Table 48, official PDF https://ditjenbun.pertanian.go.id/template/uploads/2026/03/LAKIN-DITJENBUN-2025.pdf. A separate official release repeats the 2024 coffee area composition: https://ditjenbun.pertanian.go.id/kementan-perkuat-budidaya-kopi-adaptif-iklim-hadapi-potensi-musim-kering/.

**Calculation check:** 813,346 tonnes ÷ 976,435 ha = approximately 833.17 kg/ha, consistent with the published whole-number 833 kg/ha. This is a national aggregate for generic coffee, not a Robusta-only value and not a farm-level guarantee. Do not silently relabel it as Robusta productivity.

For the other six matched plantation categories (oil palm, coconut, rubber, cocoa, tea, sugarcane), the same-year national TM denominator has **not yet been independently verified in the source evidence collected in this pass**. Their production/total-area pairs remain registered but are not productivity observations. Do not use projected TM targets as actual area or calculate yield from total planted area.


### 2026-10-20 — verified 2024 TM denominators: oil palm and rubber

Official Ditjen Perkebunan, *Laporan Kinerja Ditjen Perkebunan 2025*, provides these actual 2024 national values:

- **Oil palm:** TM 12,876,487 ha; production 45,436,197 tonnes; published productivity 3,529 kg/ha; total area 16,833,985 ha. Table 12, production label is **CPO**, so retain the product-form caveat: this is not fresh fruit bunch (TBS) yield and must not be silently used as TBS productivity. Source: https://ditjenbun.pertanian.go.id/template/uploads/2026/03/LAKIN-DITJENBUN-2025.pdf.
- **Rubber:** TM 2,242,887 ha; production 2,132,088 tonnes; published productivity 951 kg/ha; total area 3,149,277 ha. Table 58. Calculation check: 2,132,088,000 kg / 2,242,887 ha ≈ 950.6 kg/ha, consistent with rounded 951 kg/ha. Source: https://ditjenbun.pertanian.go.id/template/uploads/2026/03/LAKIN-DITJENBUN-2025.pdf.

**Still unverified in this pass:** 2024 actual national TM denominator for coconut, cocoa, tea and sugarcane. Do not fill those with projections, targets, or total planted area. These two new denominator records do not resolve all product-form, farm-level, price/cost, or owner-row gates. No runtime/model approval follows.
