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

# Bulk Data Extraction Register — 60 Owner Commodities

Date: 2026-10-20
Branch: `feat/production-tier-taxonomy`
Status: **source families verified; exact row extraction in progress**.

This register prevents source discovery from being confused with numeric extraction. A publication is considered “source located” when its official page is verified; an observation is “extracted” only when exact table/page, item, time, geography, unit and product form are recorded. The owner blueprint remains a list of 60 intended commodities, not empirical economics. No runtime values are changed by this register.

## Verified official source families

| Source ID | Official publication | Scope verified | Appropriate owner rows | What it does not prove |
|---|---|---|---|---|
| BPS-HP-TAN-2025 | BPS, *Statistik Harga Produsen Pertanian Subsektor Tanaman Pangan, Hortikultura, dan Tanaman Perkebunan Rakyat 2025*, released 2026-04-24. https://www.bps.go.id/id/publication/2026/04/24/ab557ad3c44be1254c87c5aa/statistik-harga-produsen-pertanian-subsektor-tanaman-pangan-hortikultura-dan-tanaman-perkebunan-rakyat-2025.html | Monthly rural producer prices in 37 provinces (DKI excluded); food crops, horticulture, smallholder estate crops | 1–24, 37–48, plus relevant raw agricultural inputs | Does not provide complete cost ledger, unit yield, all grades/forms, or net profit |
| BPS-HP-TERNAK-2025 | BPS, *Statistik Harga Produsen Pertanian Subsektor Peternakan dan Perikanan 2025*, released 2026-04-24. https://www.bps.go.id/id/publication/2026/04/24/471c9fc5982e7c8927c362f8/statistik-harga-produsen-pertanian-subsektor-peternakan-dan-perikanan-2025.html | Monthly rural producer prices in 38 provinces | 25–36 | Does not by itself establish FCR, mortality, yield, feed cost or vessel economics |
| BPS-SEP-TAN-2024 | BPS, *Hasil Survei Ekonomi Pertanian (SEP) 2024: Nilai dan Biaya Produksi Beberapa Komoditas Utama pada Subsektor Tanaman Pangan, Hortikultura, dan Perkebunan*, released 2025-01-24. https://www.bps.go.id/id/publication/2025/01/24/8faa8436999bb9b54ba0b7a9/hasil-survei-ekonomi-pertanian--sep--2024--nilai-dan-biaya-produksi-beberapa-komoditas-utama-pada-subsektor-tanaman-pangan--hortikultura--dan-perkebunan.html | Production value and costs by agricultural business unit for selected main commodities | Crop/plantation rows only when the exact commodity is covered in a table | Not a complete 60-commodity cost database; not comparable across systems without checking definitions |
| BPS-SEP-TERNAK-2024 | BPS, *Hasil Survei Ekonomi Pertanian (SEP) 2024 — Subsektor Peternakan*. https://www.bps.go.id/assets/publication/2025/01/24/52f47865afe337fd047404a8/hasil-survei-ekonomi-pertanian--sep--2024-subsektor-peternakan.html | Livestock cost structures by agricultural holding, per published tables | 25–29, 33, 36, only rows actually covered | Not fishery cost evidence; do not assume every species/system is covered |
| BPS-META-PRODPRICE | BPS metadata, indicator “harga produsen pertanian”. https://sirusa.web.bps.go.id/metadata/indikator/71253 | Defines producer-price indicator and its units/classification context | All rows using BPS producer-price observations | Metadata is not a price observation |
| KEMENTAN-STATPERT-2025 | Kementerian Pertanian, *Statistik Pertanian 2025*. https://repository.pertanian.go.id/handle/123456789/29539 | National/provincial production, area, population and sector context by table | Agricultural, livestock and estate rows where table exists | Production totals alone do not establish farm-level costs or profits |
| ESDM-MINERAL-ENERGY | ESDM/Directorate General of Mineral and Coal, official HPM/benchmark regulations and production statistics (source must be attached per row) | Benchmark and sector-specific production/quality data where published | 51–57, 60 | Benchmark price is not automatically mine-gate realized netback or cost |
| BPS-INDUSTRY | BPS manufacturing/industrial statistics (exact table required per row) | Output/industrial context for manufactured goods | 49, 58–59 | Aggregate industrial statistics are not a product recipe or factory unit cost |

## Numeric observations already recorded in the research ledger

These are examples of observations in the previous ledger, not a full extracted dataset. Keep exact dates and bases attached:

| Commodity observation | Period | Value | Unit / basis | Limit |
|---|---|---:|---|---|
| Gabah Kering Panen (GKP) | June 2025 | 6,714 | Rp/kg, producer | Not GKG or milled rice |
| Jagung pipilan kering | June 2025 | 4,883 | Rp/kg, farmer | Moisture/quality basis must be checked |
| Kedelai biji kering | June 2025 | 9,258 | Rp/kg, farmer | Not seed for planting unless specified |
| Cabai merah keriting | June 2025 | 21,216 | Rp/kg, farmer | Not cabai rawit |
| Cabai rawit merah | June 2025 | 37,245 | Rp/kg, farmer | Period and national-series basis; not universal current farmgate price |
| Pala | 2025 | — | Exact table row not yet extracted | Production totals are not producer prices |

Source context for the first five observations is the Bapanas monthly national producer-price dataset cited in `docs/REAL_COMMODITY_TIER1_RESEARCH.md`. Before any of these values is promoted to runtime, verify the original dataset row and metadata directly.

## Extraction protocol — one batch, all applicable rows

1. Retrieve/download each shared source publication once.
2. Build a table/page index of all relevant commodity rows before detailed per-row research.
3. Extract all available prices in the same pass, retaining month/year, geography, product form, unit and quality/grade.
4. Extract costs and production values from SEP only where the exact commodity and production system are covered.
5. Join production/yield statistics only when denominator and crop/system definitions match.
6. Add row-specific studies only for uncovered gaps; do not block other rows.
7. Classify each metric as **observed**, **derived**, **game assumption**, or **missing**.
8. Calculate net unit economics only when yield, input, labor, loss, overhead and sales basis can be reconciled. Otherwise leave the calculation incomplete.
9. Keep mineral, energy, industrial and retail/processed nodes in separate stage-specific ledgers.
10. Update the 60-row matrix and report coverage counts for all 60, not only the most recently researched commodity.

## Next checkpoint acceptance criteria

Report separate counts for: source families located; exact price observations extracted; cost observations extracted; yield/production observations extracted; rows with comparable unit basis; rows with complete cost model; rows approved for runtime. These counts must be based on the actual extracted records, not estimated progress.


## Unit correction and January 2026 bulk extract — 2026-10-20

- Bapanas national dataset page exposes January 2026 monthly rows for paddy (GKP farmer, GKG mill, medium/premium rice mill), dry shelled maize, dry soybean, red bird's-eye chili, shallot, live cattle, Ayam Ras, and layer eggs. Exact values and stages are recorded in `docs/COMMODITY_60_BULK_AUDIT.md`.
- Critical unit correction: the dataset metadata specifies **Ayam Ras = Rp/ekor hidup**, not Rp/kg live weight. June 2025 Rp20,073, November 2025 Rp22,221 and January 2026 Rp22,971 are per bird. The previous per-kg labels are superseded. Do not convert to per-kg unless a matching liveweight basis is independently sourced.
- Source page gives unit definitions, sampled national average method, and a provincial dataset option: https://data.badanpangan.go.id/datasetpublications/3iw/rata-rata-harga-pangan-bulanan-produsen-nasional and https://data.badanpangan.go.id/datasetpublications/u7t/rata-rata-harga-pangan-bulanan-produsen-provinsi.
- Coverage count: 60/60 inventory rows remain listed; 8 owner rows have directly relevant producer-price observations (one poultry value is per bird and not yet comparable per kg); zero rows have a complete validated price+cost+yield+loss+fixed-cost model; zero runtime approvals. These observations do not establish full economics.
- Research only, no runtime changes. No tests run.

## 2026-10-20 — BPS SEP 2024 bulk extraction checkpoint

### BPS SEP 2024 crop/estate table extraction (actual table-level extraction)

Official source: BPS, *Hasil Survei Ekonomi Pertanian (SEP) 2024 — Nilai dan Biaya Produksi Beberapa Komoditas Utama pada Subsektor Tanaman Pangan, Hortikultura, dan Perkebunan*, Catalogue 5101026 / publication 05100.25001, released 2025-01-24. https://www.bps.go.id/id/publication/2025/01/24/8faa8436999bb9b54ba0b7a9/hasil-survei-ekonomi-pertanian--sep--2024--nilai-dan-biaya-produksi-beberapa-komoditas-utama-pada-subsektor-tanaman-pangan--hortikultura--dan-perkebunan.html. PDF table of contents, technical notes and the tables below were actually opened/read; do not confuse this with extraction of the BPS 2025 producer-price PDFs.

| BPS table/page | Owner row | Output form | Producer price (Rp/kg, converted from source's 000 Rp/kg) | Total production cost | Cost per output unit (Rp/kg) | Productivity |
|---|---:|---|---:|---:|---:|---|
| 2.1 / p.15 | #3 Padi | GKP | 5,760 | Rp15,287,590/ha | 3,590 | 46.35 ku/ha |
| 2.2 / p.16 | #4 Jagung | Dry shelled grain | 4,970 | Rp11,486,060/ha | 3,130 | 42.94 ku/ha |
| 2.3 / p.17 | #6 Bawang Merah | Dry harvested bulb with leaves | 20,630 | Rp75,286,090/ha | 11,620 | 0.73 kg/m² |
| 2.7 / p.21 | #5 Cabai Rawit | Fresh fruit | 28,350 | Rp34,607,540/ha | 15,730 | 0.37 kg/m² |
| 2.8 / p.22 | #40 Sawit/TBS | Fresh fruit bunches | 2,120 | Rp10,112,640/100 trees | 1,060 | 12,437.86 kg/100 trees |
| 2.9 / p.23 | #48 Karet/Lateks | Latex | 7,300 | Rp1,643,870/100 trees | 2,400 | 842.57 kg/100 trees |
| 2.10 / p.24 | #1/#2 generic coconut only | Fresh coconut | 2,650 | Rp4,642,550/100 trees | 1,110 | 6,072.41 kg/100 trees |

Source tables report total production value/cost/income in thousand Rp per hectare or per 100 trees, producer price and unit cost in thousand Rp/kg, and productivity in the printed units. BPS technical notes define the corresponding output forms (printed pp.2–3). The generic coconut table cannot separate Kelapa Super vs Kelapa Biasa and must not be substituted for the owner-locked per-buah customer benchmark. BPS notes some cost/subsidy imputations are not yet estimated. These data remain cost_yield_partial, not complete profit models.

### BPS 2025 price PDF extraction blockers

- Crop/horticulture/estate producer prices 2025: official page found, 19.36 MB; PDF endpoint returned cache miss. No 2025 table values are counted as extracted from that PDF: https://www.bps.go.id/id/publication/2026/04/24/ab557ad3c44be1254c87c5aa/statistik-harga-produsen-pertanian-subsektor-tanaman-pangan-hortikultura-dan-tanaman-perkebunan-rakyat-2025.html.
- Livestock/fishery producer prices 2025: official page found, 16.32 MB; endpoint exceeded the web extractor's >10 MiB limit. No 2025 table values are counted as extracted from that PDF: https://www.bps.go.id/id/publication/2026/04/24/471c9fc5982e7c8927c362f8/statistik-harga-produsen-pertanian-subsektor-peternakan-dan-perikanan-2025.html.
- SEP livestock PDF endpoint (8.14 MB) returned cache miss; exact livestock table rows not yet extracted. The publication page itself is discoverable: https://www.bps.go.id/id/publication/2025/01/24/52f47865afe337fd047404a8/hasil-survei-ekonomi-pertanian-sep-2024-subsektor-peternakan.html.

Counts at this checkpoint: 36 exact producer-price entries across existing Bapanas ledger + 7 new SEP table prices; 14 exact cost metrics (7 table total-cost fields + 7 per-unit cost fields); 7 exact productivity metrics. These are field counts across 7 tables, not independent source studies. Zero complete cost models and zero runtime approvals.


## 2026-10-20 — Kementan Pusdatin bulk historical price extraction

- Extracted searchable text from official *Statistik Harga Komoditas Pertanian Tahun 2025* (published 2025-12-29; 185-page PDF). Table 2.1, printed p.19, yields 104 exact national annual producer-price cells across 26 categories for 2021–2024; Table 1.1, printed p.3, yields 26 non-missing paddy-stage annual price cells including Jan–Nov 2025 where available. Full values, units and caveats: `docs/KEMENTAN_2025_PRICE_BULK_EXTRACTION.md`.
- The book is a useful alternative source for historical national producer prices while the BPS 2025 monthly PDFs remain inaccessible in this extraction environment. Table 2.1 is BPS-sourced; latest year there is 2024, not 2025. Do not relabel annual historical averages as current quotes.
- Source categories include maize, mung bean, soybean, peanut, cassava, sweet potato, potato, red chili, rawit, shallot, garlic, mango, banana, orange, salak, mature coconut, robusta coffee, pepper, thick rubber latex, dried clove, live cattle/buffalo/goat/pig/chicken and layer eggs. Product units are mixed (kg, bunch, nut, liveweight); retain them as published.
- Extracted-cell count in this tranche: 130 (104 Table 2.1 cells + 27 non-dash Table 1.1 cells). This is not 130 owner rows and does not increase the count of complete unit-economics models. Runtime approval remains 0.


## Owner-row matching note — Kementan historical prices (2026-10-20)

- A first conservative crosswalk maps category-level historical producer prices to 17 owner rows (#3, #4, #5, #6, #7, #9, #10, #11, #12, #13, #15, #21, #25, #27, #29, #37, #41). Rows remain PARTIAL because cultivar, grade, product form, system costs/yield or observation recency still need reconciliation.
- Generic coconut (Rp/butir) remains non-cultivar-specific; “ayam” is liveweight rather than meat; pepper is not separated into white/black; thick rubber is not assumed equal to latex. Do not count these as exact owner-node matches.
- Source data are annual historical prices through 2024 in Table 2.1, with limited paddy Jan–Nov 2025 stage series in Table 1.1. Full source values: `docs/KEMENTAN_2025_PRICE_BULK_EXTRACTION.md`.


## Detailed provincial table crosswalk — 2026-10-20

The official Kementan 2025 price book exposes provincial producer-price tables for multiple owner categories. A new crosswalk records table number, printed page, source product form, units, and mismatch gates: `docs/KEMENTAN_PROVINCE_PRICE_CROSSWALK.md`. Exact broad historical price coverage maps to 27 owner rows; this remains partial evidence, not completed economics. Generic pepper, coconut grades, banana cultivars, live chicken/meat, duck/live egg and latex/thick-rubber distinctions remain explicitly unresolved.


## Kementan production/population source — 2026-10-20

Registered the official *Statistik Pertanian / Agricultural Statistics 2025* source and its scope in `docs/KEMENTAN_PRODUCTION_STATISTICS_2025_REGISTER.md`. This source covers five-year series including production/population, upstream inputs, trade, prices and consumption. Source discovery is not numeric extraction; no observation counts or economic-model counts are increased by this registration. Production totals must not be treated as yield, unit cost, or profit without a matching denominator and system definition.


## 2026-10-20 — production-statistics table locator pass

Added a table-level locator map to `docs/KEMENTAN_PRODUCTION_STATISTICS_2025_REGISTER.md` for Kementan *Statistik Pertanian 2025*: secondary-crop production/area tables (2.1.1–2.1.13, printed pp.109–121), livestock production/population table 2.4.1 and population series 2.4.2–2.4.15 (pp.270–284), plus plantation production/productivity tables (including 2.3.30 and 2.3.34–2.3.39, pp.250 and 254–259). This is a source-navigation improvement only; the large PDF could not be opened in full by the extraction viewer and no numeric rows were transcribed in this pass. Therefore extracted observation, cost, and yield counts remain unchanged.

Also registered BPS *Statistik Tanaman Perkebunan Tahunan Indonesia 2025* (released 2026-08-31, revised 2026-09-16) as a focused next source for area/production and trade for oil palm, coffee, cocoa, rubber, tea, cloves, coconut, cashew, sago, nutmeg and pepper. Official page: https://www.bps.go.id/id/publication/2026/08/31/917571f773e8dde67bf24f13/statistik-tanaman-perkebunan-tahunan-indonesia-2025-kelapa-sawit-kopi-kakao-karet-teh-dan-komoditas-perkebunan-unggulan.html. Numeric extraction and product-form matching remain pending. No runtime changes; tests not run.


## 2026-10-20 — additional BPS production source families

Two additional official source families were verified and mapped to the owner inventory:

| Source ID | Official publication | Scope | Relevant owner rows | Limits |
|---|---|---|---|---|
| BPS-HORTI-2025 | BPS, *Statistik Hortikultura 2025*, released 2026-06-12. https://www.bps.go.id/id/publication/2026/06/12/43da5ec30fc7d87985e108a5/statistik-hortikultura-2025.html | ATAP 2025 for 18 strategic horticultural commodities; includes production, harvested area, number of productive plants and supporting consumption/trade data | #5–#8, #11–#12, #14, #16–#20, where the specific commodity is included | Only 18 strategic commodities; do not assume every owner commodity is covered. Verify cultivar/form and the exact table/visual before extracting values. |
| BPS-ESTATE-SEASONAL-2025 | BPS, *Statistik Tanaman Perkebunan Semusim Indonesia 2025 (Tebu dan Tembakau)*, released 2026-08-31 and revised 2026-09-16. https://www.bps.go.id/id/publication/2026/08/31/aa1f04245928352fdf4cb63f/statistik-tanaman-perkebunan-semusim-indonesia-2025-tebu-dan-tembakau.html | Area and production by province and management status for sugarcane and tobacco; export/import by HS code | #44 Tebu | Sugarcane tonnage does not equal recoverable sugar; mill recovery, payment formula, harvest/transport costs and cane quality still need separate evidence. |

The existing BPS permanent-estate source covers area/production by province and export/import for oil palm, coffee, cocoa, rubber, tea, clove, coconut, cashew, sago, nutmeg, pepper and kemiri sunan. Official source: https://www.bps.go.id/id/publication/2026/08/31/917571f773e8dde67bf24f13/statistik-tanaman-perkebunan-tahunan-indonesia-2025-kelapa-sawit-kopi-kakao-karet-teh-dan-komoditas-perkebunan-unggulan.html.

These are source registrations only. No table values were transcribed in this update, so extracted observation counts and complete-model counts remain unchanged. Keep all figures classified as missing until a numeric table row and its unit, period, geography, and product basis are recorded. No runtime changes; tests not run.


## Batch ekstraksi BPS hortikultura — 2024 (ditambahkan 2026-10-22)

Sumber resmi BPS: [Luas panen tanaman sayuran dan buah-buahan semusim menurut jenis tanaman, 2024](https://www.bps.go.id/id/statistics-table/3/VTNWM01VdGhTelZTTTNSS1NFSkVZazkzWjJKcWR6MDkjMw%3D%3D/harvested-area-of-temporary-vegetable-and-fruit-crops-by-type-of-crops----2024.html?year=2024) dan [Produksi tanaman sayuran dan buah-buahan semusim menurut jenis tanaman, 2024](https://www.bps.go.id/id/statistics-table/3/VFV4MmQxaG9kakZrVUdWeEx6aDFUMnN6WmpocVp6MDkjMw%3D%3D/produksi-tanaman-sayuran-dan-buah---buahan-semusim-menurut-jenis-tanaman--2024.html?year=2024). Kedua tabel diperbarui 10 Juni 2025. Angka produksi tabel BPS bersatuan kuintal (1 kuintal = 100 kg); luas panen dalam hektare. Ekuivalen produktivitas dihitung sebagai produksi × 100 / luas panen.

| Komoditas | Luas panen nasional 2024 | Produksi nasional 2024 | Produktivitas aritmetis nasional |
|---|---:|---:|---:|
| Bawang merah | 188,796.36 ha | 20,857,208.27 kuintal | 11047 kg/ha (ekuivalen) |
| Bawang putih | 5,317.78 ha | 394,380.19 kuintal | 7416 kg/ha (ekuivalen) |
| Cabai rawit | 191,884.29 ha | 15,687,569.77 kuintal | 8176 kg/ha (ekuivalen) |
| Kentang | 67,487.54 ha | 12,704,492.21 kuintal | 18825 kg/ha (ekuivalen) |
| Ketimun | 38,246.93 ha | 3,991,993.48 kuintal | 10437 kg/ha (ekuivalen) |
| Kubis | 63,672.35 ha | 14,559,335.48 kuintal | 22866 kg/ha (ekuivalen) |
| Tomat | 58,995.13 ha | 11,527,914.77 kuintal | 19540 kg/ha (ekuivalen) |
| Wortel | 37,162.65 ha | 6,816,552.67 kuintal | 18342 kg/ha (ekuivalen) |

**Interpretasi dan batas pemakaian:** ini adalah rasio agregat nasional, bukan hasil panen tipikal petani, bukan hasil per siklus yang sudah disesuaikan musim/varietas, dan bukan produktivitas yang boleh langsung dipakai untuk Tier 1–4. Angka ini dapat menjadi *sanity check* makro untuk rentang produktivitas model setelah satuan dan sistem produksi cocok; tidak menyediakan biaya benih, pupuk, pestisida, tenaga kerja, sewa lahan, kehilangan, harga jual, atau laba.

## Batch harga produsen Bapanas — Januari 2026 (snapshot resmi)

Sumber: [Bapanas, Harga Pangan Tingkat Produsen Periode Januari 2026 (PDF)](https://data.badanpangan.go.id/nfs_storage/public/publication/documents/1775015364.pdf), halaman infografik 18 pada hasil PDF. Angka berikut dicatat sebagai harga nasional produsen pada periode tersebut, bukan harga retail dan bukan harga saat ini.

| Produk dan tahap persis | Harga nasional Januari 2026 | Satuan | Catatan pembandingan |
|---|---:|---|---|
| Gabah Kering Panen (GKP), tingkat petani | Rp6.884 | Rp/kg | Tidak sama dengan GKG atau beras |
| Jagung pipilan kering | Rp5.810 | Rp/kg | Kadar air/standar mutu perlu dicocokkan sebelum pemodelan |
| Cabai merah besar | Rp21.445 | Rp/kg | Jangan disamakan dengan cabai rawit atau cabai keriting |
| GKG, tingkat penggilingan | Rp7.980 | Rp/kg | Tahap penggilingan, bukan harga petani GKP |
| Kedelai biji kering (seri pertama pada infografik) | Rp9.418 | Rp/kg | PDF juga menampilkan angka kedelai Rp14.370 pada panel berbeda; identitas panel/seri harus diverifikasi sebelum memakai angka kedua |
| Bawang merah | Rp23.915 | Rp/kg | Harga produsen nasional; bukan harga benih bawang |
| Gula konsumsi petani | Rp15.213 | Rp/kg | Produk dan tahap harus dicocokkan dengan definisi komoditas dalam game |
| Beras medium | Rp13.012 | Rp/kg | Produk olahan, bukan gabah |
| Cabai merah keriting | Rp24.578 | Rp/kg | Bukan cabai rawit merah |
| Sapi hidup | Rp52.883 | Rp/kg berat hidup | Tidak sama dengan daging karkas/eceran |
| Cabai rawit merah | Rp34.122 | Rp/kg | Tidak sama dengan cabai merah besar/keriting |
| Ayam ras hidup | Rp22.971 | Rp/kg berat hidup/ekor hidup sesuai label infografik | Satuan tepat harus dipastikan dari metadata seri sebelum mengonversi ke harga per kg |

**Catatan mutu data:** infografik menampilkan dua angka kedelai pada panel berbeda dan label ayam ras menggunakan frasa satuan yang perlu diklarifikasi. Keduanya ditandai untuk verifikasi terhadap tabel/metadata sumber sebelum dipakai untuk kalkulasi. Tidak ada nilai yang dipromosikan ke runtime.

### Perubahan cakupan batch ini
- Diekstrak secara eksplisit: 8 pasangan luas panen–produksi hortikultura nasional untuk 2024, ditambah rasio kg/ha yang dihitung dari satuan BPS.
- Dicatat: 12 panel/observasi harga produsen dari infografik Bapanas Januari 2026; 2 catatan membutuhkan verifikasi label/seri sebelum digunakan untuk model.
- Model HPP/laba lengkap yang disahkan: **tetap 0/60**. Batch ini memperkaya bukti harga/produktivitas, tetapi tidak mengisi biaya input, kehilangan, dan biaya tetap per komoditas.


## Batch ekstraksi biaya produksi BPS SEP 2024 — nilai per unit usaha (2026-10-22)

Sumber primer: BPS, *Hasil Survei Ekonomi Pertanian (SEP) 2024: Nilai dan Biaya Produksi Beberapa Komoditas Utama pada Subsektor Tanaman Pangan, Hortikultura, dan Perkebunan*, katalog 5101026, publikasi 05100.25001, rilis 24 Januari 2025. [Halaman publikasi BPS](https://www.bps.go.id/id/publication/2025/01/24/8faa8436999bb9b54ba0b7a9/hasil-survei-ekonomi-pertanian--sep--2024--nilai-dan-biaya-produksi-beberapa-komoditas-utama-pada-subsektor-tanaman-pangan-hortikultura-dan-perkebunan.html). Angka pada tabel di bawah berasal dari tabel 2.1–2.7 dan 2.10; nilai tabel dinyatakan dalam **ribu rupiah**. Nilai per hektar tidak boleh diperlakukan sebagai per siklus tanpa memeriksa periode referensi dan definisi tabel.

| Komoditas / tabel SEP | Basis tabel | Nilai produksi (Rp) | Biaya produksi (Rp) | Pendapatan SEP (Rp) | Harga produsen per satuan (Rp/kg) | Biaya per satuan (Rp/kg) |
|---|---|---:|---:|---:|---:|---:|
| Padi / 2.1 | per hektar, UTP, panen sendiri | 26.369.860 | 15.287.590 | 11.082.110 | 5.760 | 3.590 |
| Jagung / 2.2 | per hektar, UTP, panen sendiri | 20.943.600 | 11.486.060 | 9.457.540 | 4.970 | 3.130 |
| Bawang merah / 2.3 | per hektar, UTP, panen sendiri | 141.997.490 | 75.286.090 | 66.711.410 | 20.630 | 11.620 |
| Cabai hijau / 2.4 | per hektar, UTP, panen sendiri | 96.295.280 | 40.216.900 | 56.078.370 | 19.780 | 10.750 |
| Cabai merah besar / 2.5 | per hektar, UTP, panen sendiri | 159.090.370 | 60.775.690 | 98.314.680 | 27.810 | 13.340 |
| Cabai merah keriting / 2.6 | per hektar, UTP, panen sendiri | 135.680.790 | 54.709.620 | 80.971.170 | 29.490 | 17.880 |
| Cabai rawit / 2.7 | per hektar, UTP, panen sendiri | 103.548.290 | 34.607.540 | 68.940.750 | 28.350 | 15.730 |
| Kelapa / 2.10 | per 100 pohon, UTP, panen sendiri | 12.788.560 | 4.642.550 | 8.146.040 | see exact row below table | see exact row below table |

**Penting untuk interpretasi:**
- UTP = usaha pertanian perorangan. Data bukan otomatis representasi perusahaan pertanian atau semua jenis petani.
- Pendapatan pada publikasi adalah nilai produksi dikurangi biaya produksi dalam cakupan tabel; jangan disamakan dengan laba akuntansi setelah seluruh biaya modal, pajak, pembiayaan, kehilangan pascapanen, dan biaya distribusi.
- Tabel kelapa menggunakan basis **100 pohon**, bukan hektare atau per butir. Biaya per pohon hanya dapat dihitung dengan membagi nilai tabel per 100 pohon; biaya per butir tetap membutuhkan jumlah buah yang dipanen pada periode yang sama.
- Harga petani padi pada tabel ini adalah harga per satuan produksi tabel SEP; jangan disamakan langsung dengan seri GKP Bapanas tanpa memastikan bentuk gabah/beras dan basis kualitas.
- Beberapa baris harga/biaya satuan tidak ditulis di tabel ringkas di atas karena ekstraksi perlu memastikan angka pada baris lanjutan tabel; jangan mengisi dengan kalkulasi silang atau perkiraan.

### Rincian biaya yang berhasil diekstrak (Rp per hektar, kecuali kelapa Rp per 100 pohon)

| Komoditas | Benih | Pupuk | Pestisida | Upah + jasa pertanian | BBM/gas/pelumas | Listrik/air | Sewa lahan / estimasi | Pengeluaran lain |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Padi | 689.970 | 2.100.150 | 798.000 | 5.056.400 | 331.890 | 139.480 | 5.619.140 | 552.560 |
| Jagung | 1.375.300 | 2.188.370 | 654.630 | 2.421.520 | 318.650 | 120.610 | 3.979.700 | 427.290 |
| Bawang merah | 21.520.430 | 8.323.310 | 15.588.880 | 12.790.500 | 1.755.760 | 409.700 | 11.644.370 | 3.253.150 |
| Cabai merah besar | 4.434.150 | 11.489.800 | 12.913.160 | 15.195.080 | 1.638.910 | 442.400 | 11.050.840 | 3.611.360 |
| Cabai merah keriting | 4.002.020 | 11.463.510 | 11.530.030 | 12.266.530 | 2.457.780 | 199.590 | 9.329.330 | 3.460.840 |
| Cabai rawit | 2.748.150 | 5.649.830 | 4.812.020 | 7.573.010 | 1.318.600 | 316.060 | 9.566.240 | 2.623.640 |
| Kelapa | 40.520 | 119.310 | 75.080 | 1.468.070 | 198.350 | 4.040 | 2.554.870 | 182.300 |

All values above are converted from the source table's “000 Rupiah” to rupiah by multiplying by 1,000. The BPS source notes that imputation for some cost/subsidy variables has not yet been estimated. Tabel cabai hijau, harga/biaya per satuan untuk cabai merah besar, cabai merah keriting, dan cabai rawit sudah diverifikasi pada baris lanjutan masing-masing tabel. Catatan sumber tetap menyatakan imputasi biaya/subsidi untuk beberapa variabel belum diestimasi oleh BPS.

### Use in game model
These SEP observations can support a **dated baseline farm scenario** for padi, maize, shallot, several chili categories, and coconut after the source's unit and period definitions are reconciled with production quantity. They do not by themselves fill the 60 commodity rows or all four game tiers. A farm production cost is a Tier 1 node only if the owner's commodity-chain mapping explicitly identifies it as the raw producer node; downstream processing, trading, retail and other tiers need separate stage-specific input/output recipes and prices.


## Batch ekstraksi biaya peternakan BPS SEP 2024 — sapi potong dan broiler (2026-10-22)

Sumber primer: BPS, *Hasil Survei Ekonomi Pertanian (SEP) 2024 Subsektor Peternakan*, publikasi 05200.25001, katalog 5301012, rilis 24 Januari 2025. [Halaman publikasi resmi BPS](https://www.bps.go.id/assets/publication/2025/01/24/52f47865afe337fd047404a8/hasil-survei-ekonomi-pertanian--sep--2024-subsektor-peternakan.html). Tabel mengukur usaha pertanian perorangan (UTP); angka di tabel sumber dalam ribu rupiah, di bawah dikonversi menjadi rupiah.

| Komoditas dan tabel | Basis observasi | Nilai produksi | Biaya produksi | Pendapatan SEP |
|---|---|---:|---:|---:|
| Sapi potong / 2.1 | Per ekor | Rp3.290.370 | Rp716.120 | Rp2.574.260 |
| Sapi perah / 2.2 | Per ekor | Rp10.141.120 | Rp5.094.660 | Rp5.046.460 |
| Ayam ras pedaging FS / 2.10 | Per 5.000 ekor final stock | Rp152.008.050 | Rp126.445.080 | Rp28.639.720 |

**Komponen biaya utama yang diekstrak:**
- **Sapi potong, per ekor:** total pakan Rp342.250 (termasuk hijauan Rp138.750, konsentrat/pabrikan Rp72.500, pakan lain Rp127.920; pakan jagung Rp3.080); pemeliharaan kesehatan Rp35.800; upah Rp70.870; BBM/pelumas Rp107.920; listrik/air Rp14.200; lahan Rp85.690; jasa peternakan Rp14.850; pengeluaran lain Rp44.550. Angka upah dan sewa lahan mencakup komponen perkiraan biaya tenaga kerja tak dibayar dan perkiraan sewa lahan sendiri/bebas sewa.
- **Sapi perah, per ekor:** biaya produksi Rp5.094.660; pakan Rp4.074.740 atau sekitar 79,98% dari total biaya (jagung Rp20.380; hijauan Rp564.650; konsentrat/pabrikan Rp2.465.240; pakan lain Rp1.024.480). Nilai produksi mencakup pertambahan bobot, produksi selain ternak hidup terutama susu, dan produk ikutan; jangan menyamakan dengan penjualan susu saja.
- **Ayam broiler FS, per 5.000 ekor:** pakan Rp81.754.620; kesehatan Rp2.616.790; upah Rp3.932.750; BBM/pelumas Rp999.400; listrik/air Rp2.114.580; lahan Rp1.198.090; jasa peternakan Rp77.800; pengeluaran lain Rp1.661.670; pembelian DOC Rp32.089.370. Nilai produksi ternak hidup yang dijual tercatat Rp149.077.700 dari total produksi Rp152.008.050.

**Batas interpretasi:** tabel adalah rata-rata struktur usaha pada unit dan basis yang disebut, bukan otomatis satu siklus standar game. Untuk broiler, periode pemeliharaan, mortalitas, bobot panen, FCR, harga DOC/feed yang dibeli, dan definisi jumlah final stock harus dicocokkan sebelum mengonversi menjadi HPP/kg. Untuk sapi potong, nilai pendapatan SEP termasuk pertambahan bobot dan produk ikutan; ini bukan otomatis margin penjualan satu ekor di pasar. Jangan gabungkan unit per ekor dengan per 5.000 ekor tanpa normalisasi yang eksplisit.

### Cakupan bukti setelah batch SEP ini
- Data biaya/nilai produksi primer sudah diekstrak untuk beberapa tanaman pangan, hortikultura, kelapa, sapi potong, sapi perah, dan ayam broiler.
- Ini memperbaiki ketersediaan bukti Tier 1 untuk sejumlah komoditas, tetapi belum membuktikan cakupan lengkap 60 komoditas atau semua empat tier game.
- Belum ada parameter runtime yang dipromosikan; perlu verifikasi terhadap peta 60 komoditas, bentuk produk, waktu produksi, satuan output, kehilangan, dan biaya distribusi/processing.


## Batch validasi peternakan — produksi nasional 2024 dan harga produsen 2025 (2026-10-22)

Sumber produksi: Ditjen Peternakan dan Kesehatan Hewan, *Buku Statistik Peternakan dan Kesehatan Hewan 2024*, tabel 10.2 (angka 2024 ditandai sementara/preliminary). Sumber harga: Pusdatin Kementerian Pertanian, *Statistik Terkini Ekonomi Pertanian — April 2025*, tabel 49, sumber harga Ditjen PKH/SIMPOni Ternak, observasi Maret 2025.

### Produksi nasional 2024 (ribu ton; angka sementara)

| Produk | Produksi 2023 | Produksi 2024* | Satuan sumber |
|---|---:|---:|---|
| Daging ayam buras | 143,79 | 156,45 | ribu ton |
| Daging ayam ras petelur | 190,26 | 187,07 | ribu ton |
| Daging ayam ras pedaging/broiler | 3.721,64 | 3.835,92 | ribu ton |
| Daging itik | 33,03 | 33,82 | ribu ton |
| Daging itik manila | 4,05 | 4,43 | ribu ton |
| Daging kelinci | 0,13 | 0,25 | ribu ton |
| Daging puyuh | 1,65 | 1,54 | ribu ton |
| Telur ayam buras | 214,73 | 236,65 | ribu ton |
| Telur ayam ras petelur | 6.116,07 | 6.342,71 | ribu ton |
| Telur itik | 200,21 | 236,48 | ribu ton |
| Telur itik manila | 28,30 | 32,83 | ribu ton |
| Telur puyuh | 26,17 | 27,62 | ribu ton |
| Susu | 787,37 | 808,35 | ribu ton |

*Angka 2024 masih sementara menurut sumber. Produksi nasional hanya untuk menguji skala pasar/konsistensi simulasi, bukan sebagai hasil produksi per peternakan atau siklus.*

Sumber: [Buku Statistik Peternakan dan Kesehatan Hewan 2024 (Ditjen PKH)](https://satudata.pertanian.go.id/assets/docs/publikasi/Buku_Statistik_PKH_2024_.pdf).

### Harga produsen yang tersedia pada seri resmi Maret 2025

| Komoditas | Harga produsen Maret 2025 | Satuan sumber | Tahap |
|---|---:|---|---|
| Sapi | Rp54.344 | Rp/kg/BH | Berat hidup |
| Ayam broiler | Rp23.101 | Rp/kg/BH | Berat hidup |
| Ayam buras | Rp68.575 | Rp/kg/BH | Berat hidup |
| Telur ayam ras | Rp26.722 | Rp/kg | Telur |
| Telur ayam buras | Rp2.542 | Rp/butir | Telur |

Sumber: [Statistik Terkini Ekonomi Pertanian — April 2025, tabel 49](https://satudata.pertanian.go.id/assets/docs/publikasi/Stk_Terkini_Ekonomi_Pertanian_April_2025.pdf). Harga ini bertanggal Maret 2025; tidak boleh dilabeli harga hari ini atau digunakan sebagai harga retail.

### Keputusan integrasi
- Produksi nasional dan harga produsen menjadi pemeriksaan makro dan bukti harga bertanggal; bukan pengganti struktur biaya per peternakan.
- Publikasi biaya UTP peternakan BPS dan statistik perusahaan peternakan BPS mewakili populasi usaha yang berbeda. Jangan gabungkan biaya rata-rata UTP dengan volume/harga perusahaan tanpa menandai perbedaan populasi.
- Untuk telur dan susu, model produksi berulang harus menghitung biaya per periode, output layak jual, mortalitas/afkir, pakan, dan biaya kandang/peralatan. Untuk broiler, harga berat hidup tidak boleh dipakai sebagai harga karkas atau daging eceran.
- Ini belum melengkapi semua komoditas Tier 1–4; tidak ada nilai baru yang dipromosikan ke runtime.


## Perusahaan unggas — struktur biaya dan laba per ekor (tahun data 2024; publikasi BPS 2025)

Sumber utama: BPS, *Statistik Perusahaan Peternakan Unggas 2024*, katalog 5304004, rilis 15 Agustus 2025. Ringkasan resmi Kementan yang merujuk struktur ongkos BPS menyediakan rincian persentase berikut. Persentase adalah komposisi ongkos perusahaan, bukan struktur biaya peternak rakyat/UTP; laba per ekor adalah angka rata-rata publikasi dan perlu dicocokkan dengan definisi output dan populasi sebelum dipakai sebagai parameter permainan.

| Komponen | Ayam ras pedaging / broiler | Ayam ras petelur / layer |
|---|---:|---:|
| Pakan konsentrat | 67,33% | 50,06% |
| DOC/anak ayam | 20,97% | 0,51% |
| Upah/gaji | 6,40% | 14,96% |
| Obat-obatan | 1,64% | 4,92% |
| BBM/pelumas | 0,49% | 0,54% |
| Listrik/air | 1,12% | 1,46% |
| Jagung | 0,26% | 17,43% |
| Gabah | 0,01% | 0,71% |
| Pakan lain | 0,22% | 6,46% |
| Pengeluaran lain | 1,56% | 2,95% |
| Laba rata-rata yang dikutip sumber | Rp4.216/ekor broiler | Rp342.093/ekor layer/tahun |

Sumber data tabel: [BPS — Statistik Perusahaan Peternakan Unggas 2024](https://www.bps.go.id/id/publication/2025/08/15/64e7d72b5b7a74cb36e02ee6/poultry-establishment-statistics-2024.html); ringkasan struktur ongkos resmi Kementan: https://satudata.pertanian.go.id/assets/docs/publikasi/8c2d7ee13490f6d9b056335f292a784a.pdf.

### Pemeriksaan metodologi sebelum konversi menjadi HPP game
1. Angka laba broiler per ekor dan layer per ekor/tahun tidak sebanding langsung: siklus broiler pendek, sedangkan layer menghasilkan telur berulang sepanjang masa produksi.
2. Struktur biaya perusahaan tidak boleh dicampur langsung dengan biaya UTP BPS SEP 2024 (contoh broiler Rp126.445.080 per 5.000 ekor final stock) karena unit observasi, skala, dan metode biaya dapat berbeda.
3. Persentase struktur ongkos saja tidak memberi total biaya, output layak jual, FCR, mortalitas, umur afkir, atau harga telur/ayam. Jangan turunkan HPP/kg atau margin tier dari persentase ini saja.
4. Data ini baru memperkaya validasi struktur biaya bagi dua rantai unggas. Belum menyatakan model 60 komoditas × Tier 1–4 lengkap; tidak ada nilai yang diaktifkan pada runtime.


## Koreksi dan normalisasi angka perusahaan unggas (2026-10-22)

Pemeriksaan ulang ringkasan resmi Kementan yang merujuk publikasi BPS menghasilkan angka absolut yang bisa ditambahkan sebagai anchor per unit:

| Indikator perusahaan | Broiler | Ayam ras petelur |
|---|---:|---:|
| Nilai produksi per ekor | Rp33.053 | Rp925.548 per ekor per tahun |
| Total biaya per ekor | Rp28.837 | Rp583.481 per ekor per tahun |
| Laba rata-rata | Rp4.216 per ekor | Rp342.093 per ekor per tahun |

Sumber: [Ringkasan resmi Kementan berdasarkan Statistik Perusahaan Peternakan Unggas 2024 (BPS)](https://satudata.pertanian.go.id/assets/docs/publikasi/8c2d7ee13490f6d9b056335f292a784a.pdf); publikasi utama BPS: https://www.bps.go.id/id/publication/2025/08/15/64e7d72b5b7a74cb36e02ee6/statistik-perusahaan-peternakan-unggas-2024.html.

Pemeriksaan aritmetika: broiler Rp33.053 − Rp28.837 = Rp4.216; layer Rp925.548 − Rp583.481 = Rp342.067, berbeda Rp26 dari laba yang dipublikasikan Rp342.093. Selisih layer ini harus ditandai sebagai selisih angka sumber/komponen agregat, bukan disesuaikan secara diam-diam. Jangan memaksa persamaan nilai agregat jika pembulatan, komponen produksi ikutan, atau definisi denominator belum diverifikasi di tabel penuh.

Ringkasan agregat perusahaan unggas tahun 2024 yang dikutip sumber: pemasukan Rp36,82 triliun; pengeluaran Rp22,84 triliun; keuntungan Rp13,98 triliun; pakan sekitar 67,73% dari pengeluaran. Angka agregat ini tidak boleh dianggap sebagai unit economics khusus broiler/layer.

**Normalisasi komponen:** rincian persentase broiler berjumlah 100,00%; rincian layer berjumlah 100,00%. Jangan membuat baris “biaya lain” dari penjumlahan yang salah pada ringkasan percakapan sebelumnya; gunakan komponen individual di atas.


## Validasi denominator ekonomi perusahaan unggas — koreksi nilai layer (2026-10-22)

Sumber primer BPS *Statistik Perusahaan Peternakan Unggas 2024* menerangkan bahwa survei mengumpulkan keterangan perusahaan, tenaga kerja, jumlah ternak yang diusahakan, dan biaya produksi selama tahun 2024 (rilis 15 Agustus 2025). Metadata publikasi: https://www.bps.go.id/id/publication/2025/08/15/64e7d72b5b7a74cb36e02ee6/statistik-perusahaan-peternakan-unggas-2024.html. Ringkasan resmi Kementan yang mengutip publikasi tersebut menyajikan:
- Broiler: nilai produksi Rp33.053/ekor; total biaya Rp28.837/ekor; laba rata-rata Rp4.216/ekor.
- Layer: nilai produksi Rp925.548/ekor/tahun; total biaya Rp583.481/ekor/tahun; laba rata-rata yang dipublikasikan Rp342.093/ekor/tahun.

### Uji konsistensi
- Broiler: 33.053 − 28.837 = 4.216 (cocok secara aritmetika).
- Layer: 925.548 − 583.481 = 342.067, bukan 342.093; selisih Rp26 (sekitar 0,0076% dari laba yang dilaporkan).
- Selisih ini tidak bisa dijelaskan hanya dengan membulatkan tiga nilai ke rupiah terdekat: toleransi pembulatan dua komponen ±Rp1 hanya menghasilkan rentang sekitar Rp2. Definisi komponen, agregasi rata-rata, atau ketidaktepatan ringkasan perlu diperiksa di tabel sumber.
- Perlakuan model: simpan laba terbitan dan laba hasil hitung sebagai dua field berbeda, tambahkan flag `source_arithmetic_mismatch`, jangan memilih salah satu secara diam-diam. Jangan jadikan angka layer sebagai runtime parameter sebelum mismatch diselesaikan.
- BPS mengidentifikasi survei sebagai data perusahaan untuk 2024, bukan peternak rakyat/UTP. Gunakan hanya untuk benchmark skala perusahaan dan jangan mencampurkannya dengan biaya UTP SEP 2024 tanpa label populasi.

Rujukan pendukung: [BPS — Statistik Perusahaan Peternakan Unggas 2024](https://www.bps.go.id/id/publication/2025/08/15/64e7d72b5b7a74cb36e02ee6/statistik-perusahaan-peternakan-unggas-2024.html); [ringkasan Kementan yang menyebut nilai produksi, biaya, laba dan komposisi biaya](https://satudata.pertanian.go.id/assets/docs/publikasi/8c2d7ee13490f6d9b056335f292a784a.pdf).


## Sumber terbaru ditemukan — statistik perusahaan unggas tahun data 2025 (rilis 2026)

BPS telah menerbitkan *Statistik Perusahaan Peternakan Unggas 2025* pada 14 Agustus 2026 (Katalog 5304004, Publikasi 05100.26020). Abstrak resmi menyatakan publikasi mencakup seluruh perusahaan peternakan unggas Indonesia, dengan jumlah pekerja, jumlah ternak, pengeluaran dan penerimaan setahun selama 2025. Sumber resmi: https://www.bps.go.id/id/publication/2026/08/14/9ee194861fe1a53d5ca7953d/statistik-perusahaan-peternakan-unggas-2025.html.

### Status penggunaan
- Ini adalah sumber yang lebih baru untuk benchmark perusahaan unggas daripada publikasi tahun data 2024. Saat angka tabel 2025 berhasil diekstrak, gunakan sebagai seri terbaru perusahaan; pertahankan seri 2024 untuk perbandingan antar-tahun.
- Saat ini yang terverifikasi hanya metadata dan cakupan publikasi. Belum ada angka tabel 2025 yang diekstrak dalam batch ini; jangan menandai biaya, output, atau laba 2025 sebagai tersedia hanya berdasarkan abstrak.
- Populasi tetap perusahaan berbadan usaha, bukan peternak rakyat/UTP. Jangan gabungkan dengan BPS SEP UTP tanpa penanda populasi dan definisi unit.
- Source hierarchy untuk unggas kini: (1) tabel BPS 2025 untuk benchmark perusahaan tahun data 2025 setelah ekstraksi; (2) BPS 2024 perusahaan untuk pembanding historis; (3) BPS SEP 2024 untuk struktur biaya UTP yang tabelnya relevan; (4) harga produsen resmi bertanggal untuk pasar farmgate. Tiap sumber memiliki unit analisis berbeda.


## Ekstraksi angka tabel BPS perusahaan unggas 2025 — selesai untuk agregat nasional (2026-10-22)

**Sumber PDF yang berhasil diakses:** salinan pratinjau publikasi BPS *Statistik Perusahaan Peternakan Unggas 2025*, katalog 5304004, publikasi 05100.26020, Volume 26 (2026), 80 halaman. Halaman metadata resmi BPS: https://www.bps.go.id/id/publication/2026/08/14/9ee194861fe1a53d5ca7953d/statistik-perusahaan-peternakan-unggas-2025.html. PDF pratinjau yang dapat dibaca: https://cdn.gnfi.net/goodstats/uploads/publications/files/2026/08/14/statistik-perusahaan-peternakan-unggas-2025-0pxHmLnrC2.pdf. Tabel yang diekstrak: Tabel 3.10, 3.14, dan 3.15 (halaman cetak 39–46; halaman PDF 55–64). BPS menyatakan cakupan pencacahan lengkap perusahaan unggas berbadan hukum/berbadan usaha yang aktif, dengan keadaan usaha Januari–Desember 2025; angka 2025 bertanda sementara.

### Agregat biaya perusahaan unggas nasional (Tabel 3.10; juta rupiah)

| Komponen biaya | 2025* (juta Rp) | 2024 pembanding dalam publikasi yang sama (juta Rp) |
|---|---:|---:|
| Upah pekerja | 2.635.445,52 | 2.372.302,22 |
| Bahan bakar dan pelumas | 997.382,40 | 234.263,40 |
| Listrik dan air | 880.064,75 | 1.166.274,09 |
| Pakan | 16.260.903,47 | 16.710.999,84 |
| Obat-obatan | 1.053.288,70 | 1.210.709,61 |
| Pembelian DOC | 2.482.357,87 | 1.364.105,11 |
| Lainnya | 996.736,94 | 1.572.231,35 |
| **Total pengeluaran** | **25.306.179,66** | **24.630.885,62** |

Angka sumber dinyatakan dalam juta rupiah; setara total biaya nasional sekitar Rp25,306 triliun pada 2025. Penjumlahan tujuh komponen 2025 = 25.306.179,65 juta rupiah, berbeda 0,01 juta rupiah (Rp10.000) dari total terbitan 25.306.179,66; ini dipertahankan sebagai selisih pembulatan/tabel kecil, bukan diperbaiki diam-diam. Pakan sekitar 64,26% dari total pengeluaran 2025 jika memakai total terbitan sebagai penyebut.

### Nilai produksi, penerimaan dan laba/rugi agregat (Tabel 3.14–3.15; juta rupiah)

| Indikator perusahaan unggas nasional | 2025* (juta Rp) | 2024 pembanding dalam publikasi yang sama (juta Rp) |
|---|---:|---:|
| Produksi utama | 44.181.034,08 | 36.338.170,17 |
| Produksi lainnya (termasuk penjualan kotoran ternak dan lainnya) | 2.900.270,15 | 769.963,78 |
| Penerimaan lain | 2.736.408,42 | 1.731.740,47 |
| **Jumlah nilai produksi/penerimaan** | **49.817.712,65** | **38.839.874,42** |
| **Total pengeluaran** | **25.306.179,66** | **24.630.885,62** |
| **Laba/rugi terbitan** | **24.511.532,99** | **14.209.044,80** |

Pemeriksaan aritmetika: 49.817.712,65 − 25.306.179,66 = 24.511.532,99 juta rupiah (cocok untuk 2025). Untuk pembanding 2024 pada Tabel 3.15, nilai produksi tercetak 38.839.930,42 juta, sementara Tabel 3.14 mencetak total 38.839.874,42 juta; selisih Rp56 juta. Tabel 3.15 menghitung laba 14.209.044,80 juta dengan angka produksi 38.839.930,42 dikurangi pengeluaran 24.630.885,62. Karena ada selisih antartabel 2024, gunakan nilai 2025 sebagai agregat utama, dan pertahankan 2024 sebagai data pembanding dengan catatan mismatch tabel.

### Batas penggunaan dalam simulasi
- Ini adalah agregat perusahaan unggas berbadan usaha, bukan unit economics per ekor untuk broiler, layer, ayam buras, bebek, atau puyuh. Jangan membagi total nasional dengan populasi tanpa menyamakan denominator, cakupan perusahaan, produk utama/ikutan, dan periode.
- Jangan menganggap laba agregat perusahaan sebagai margin bersih peternak rakyat. Tidak mewakili UTP/rumah tangga peternakan.
- Angka 2025 bertanda sementara. Untuk Tier 1–4, angka ini hanya benchmark makro/validasi silang; HPP per unit, harga farmgate, siklus produksi, FCR, mortalitas, output layak jual dan biaya kandang masih memerlukan tabel produk/jenis usaha dan bukti peternak yang cocok.
- Perbedaan terhadap ringkasan Kementan yang lebih lama (angka agregat 2024 Rp36,82 triliun penerimaan/Rp22,84 triliun pengeluaran/Rp13,98 triliun laba) tidak diselaraskan secara paksa. Publikasi BPS 2025 menyajikan pembanding 2024 yang berbeda; simpan seri dan definisi sumber masing-masing sampai penyebab perbedaan dapat diperiksa.

Sumber tabel: BPS, *Statistik Perusahaan Peternakan Unggas 2025*, Tabel 3.10 (pp. 39–40), Tabel 3.14–3.15 (pp. 46–47), PDF pratinjau di atas. **Tidak ada parameter runtime yang diubah; matriks 60 komoditas × Tier 1–4 tetap belum lengkap.**


## Bulk numeric extraction — Kementan Pusdatin price publication (2026-10-22)

**Accessible official alternative found:** Kementerian Pertanian, Pusat Data dan Sistem Informasi Pertanian, *Statistik Harga Komoditas Pertanian Tahun 2025*, published 2025-12-29, 183 pages. Official detail page: https://satudata.pertanian.go.id/details/publikasi/947. Official PDF: https://satudata.pertanian.go.id/assets/docs/publikasi/c9c87ec57f8a22249659ace0dc306047.pdf. The PDF's extracted text is readable, unlike the previously attempted BPS SEP 2025 price PDFs. The publication states producer-price observations are sourced from BPS and defines farm-gate producer price as the transaction between farmer/producer and buyer/collector (tengkulak); source methodology samples 3–4 farmers per commodity and records the modal or average price, with a simple monthly provincial average. See printed pp. xix–xxi (PDF pp. 19–21).

### Exact extracted national series

| Source observation ID | Owner row match | Table / printed page | Period | Value (Rp/kg) | Interpretation / gate |
|---|---|---|---|---:|---|
| KEMENTAN-HARGA-2025-T2.6-ID | #10 Singkong (candidate) | Table 2.6, p. 24 | 2020 | 3,121 | National row, fresh ketela pohon; not tapioca/starch or processed product |
| KEMENTAN-HARGA-2025-T2.6-ID | #10 Singkong (candidate) | Table 2.6, p. 24 | 2021 | 3,158 | Same series and basis |
| KEMENTAN-HARGA-2025-T2.6-ID | #10 Singkong (candidate) | Table 2.6, p. 24 | 2022 | 3,250 | Same series and basis |
| KEMENTAN-HARGA-2025-T2.6-ID | #10 Singkong (candidate) | Table 2.6, p. 24 | 2023 | 3,539 | Same series and basis |
| KEMENTAN-HARGA-2025-T2.6-ID | #10 Singkong (candidate) | Table 2.6, p. 24 | 2024 | 4,826 | Same series and basis; table's reported 2023–2024 growth 36.34% |
| KEMENTAN-HARGA-2025-T2.7-ID | #9 Ubi Jalar (candidate) | Table 2.7, p. 25 | 2020 | 4,626 | National row, ketela rambat; not processed flour |
| KEMENTAN-HARGA-2025-T2.7-ID | #9 Ubi Jalar (candidate) | Table 2.7, p. 25 | 2021 | 4,519 | Same series and basis |
| KEMENTAN-HARGA-2025-T2.7-ID | #9 Ubi Jalar (candidate) | Table 2.7, p. 25 | 2022 | 4,815 | Same series and basis |
| KEMENTAN-HARGA-2025-T2.7-ID | #9 Ubi Jalar (candidate) | Table 2.7, p. 25 | 2023 | 5,023 | Same series and basis |
| KEMENTAN-HARGA-2025-T2.7-ID | #9 Ubi Jalar (candidate) | Table 2.7, p. 25 | 2024 | 6,401 | Same series and basis; table's reported 2023–2024 growth 27.43% |
| KEMENTAN-HARGA-2025-T2.8-ID | #6 Bawang Merah (candidate) | Table 2.8, p. 26 | 2020 | 26,684 | National row; variety/grade not separately specified in table title |
| KEMENTAN-HARGA-2025-T2.8-ID | #6 Bawang Merah (candidate) | Table 2.8, p. 26 | 2021 | 23,914 | Same series and basis |
| KEMENTAN-HARGA-2025-T2.8-ID | #6 Bawang Merah (candidate) | Table 2.8, p. 26 | 2022 | 27,084 | Same series and basis |
| KEMENTAN-HARGA-2025-T2.8-ID | #6 Bawang Merah (candidate) | Table 2.8, p. 26 | 2023 | 26,919 | Same series and basis |
| KEMENTAN-HARGA-2025-T2.8-ID | #6 Bawang Merah (candidate) | Table 2.8, p. 26 | 2024 | 31,673 | Same series and basis; table's reported 2023–2024 growth 17.66% |

**Aggregation caution:** These table rows are the publication's national summary values; they are not owner-specific prices, guaranteed current quotations, weighted estimates of all Indonesian transactions, or prices for every grade/variety. Preserve the annual series and source definitions. They establish producer-price evidence only—not matched costs, yield, loss, or profit. They must not alter the owner-locked coconut/es-kelapa values.

### Bulk source coverage added
- Exact numeric price observations added in this checkpoint: 15 annual-series values across 3 crop rows (singkong, ubi jalar, bawang merah).
- The PDF's contents list also identifies reusable provincial series for beans, soybean, peanut, garlic, spinach, green beans, red chili, bird's-eye chili, long bean, water spinach, potato, cucumber, cabbage, eggplant, tomato, carrot, citrus, mango, papaya, Ambon banana, watermelon, coconut, oil palm, rubber, robusta coffee, cocoa, pepper, clove, nutmeg, candlenut, beef cattle, goats, chicken, ducks and eggs. These are only candidate tables until each exact row is extracted and reconciled.
- Next bulk pass: extract the national summary table and provincial series for the remaining owner-matched crops/plantations and livestock, preserving missing cells as missing; then join only matched SEP cost/yield evidence. No runtime promotion.


### Additional exact national series — tomato, carrot, mango (extracted 2026-10-22)

The same official PDF supports three more five-year producer-price series. Each table is sourced to BPS and reported in Rp/kg.

| Source observation ID | Owner row match | Table / printed page | 2020 | 2021 | 2022 | 2023 | 2024 | 2023–24 reported growth |
|---|---|---|---:|---:|---:|---:|---:|---:|
| KEMENTAN-HARGA-2025-T2.20-ID | #8 Tomat (candidate) | Table 2.20, p. 38 | 7,331 | 7,546 | 7,817 | 8,522 | 11,955 | 40.28% |
| KEMENTAN-HARGA-2025-T2.21-ID | #17 Wortel (candidate) | Table 2.21, p. 39 | 8,915 | 8,604 | 9,217 | 9,592 | 13,071 | 36.26% |
| KEMENTAN-HARGA-2025-T2.23-ID | #12 Mangga (candidate) | Table 2.23, p. 41 | 9,669 | 9,852 | 10,931 | 11,251 | 14,607 | 29.83% |

Limits: these are national summary rows from the annual historical table, not a current quote or weighted national transaction average; no grade/variety is sufficiently specified by the table title for cultivar-specific modeling. Do not use them as retail or processed-product prices and do not infer costs, yields or profits. Owner row mappings remain candidates pending form/stage validation.


## Bulk extraction — consolidated national producer-price table (2026-10-22)

**Primary source:** Kementan Pusdatin, *Statistik Harga Komoditas Pertanian Tahun 2025*, Table 2.1, printed p. 19 (PDF page 45), “Perkembangan Rata-rata Harga Produsen Komoditas Pertanian di Indonesia, 2020–2024”; source credited to BPS. The extractable table reports the four annual columns 2021–2024. Units are as printed, including liveweight for livestock. Official PDF: https://satudata.pertanian.go.id/assets/docs/publikasi/c9c87ec57f8a22249659ace0dc306047.pdf. The table is a national annual summary, not a regional quote or a cost/profit ledger.

| Source ID / commodity | Unit and form | 2021 | 2022 | 2023 | 2024 | 2023–24 growth (%) |
|---|---|---:|---:|---:|---:|---:|
| KEMENTAN-HARGA-2025-T2.1-01 Jagung pipilan | Rp/kg | 5,132 | 5,160 | 5,360 | 5,909 | 10.24 |
| KEMENTAN-HARGA-2025-T2.1-02 Kacang hijau | Rp/kg | 16,843 | 17,666 | 18,211 | 20,438 | 12.23 |
| KEMENTAN-HARGA-2025-T2.1-03 Kacang kedelai | Rp/kg | 9,315 | 9,898 | 10,264 | 12,280 | 19.65 |
| KEMENTAN-HARGA-2025-T2.1-04 Kacang tanah | Rp/kg | 16,029 | 16,888 | 17,685 | 20,525 | 16.06 |
| KEMENTAN-HARGA-2025-T2.1-05 Ketela pohon / singkong | Rp/kg | 3,158 | 3,250 | 3,539 | 4,826 | 36.34 |
| KEMENTAN-HARGA-2025-T2.1-06 Ketela rambat / ubi jalar | Rp/kg | 4,519 | 4,815 | 5,023 | 6,401 | 27.43 |
| KEMENTAN-HARGA-2025-T2.1-07 Kentang | Rp/kg | 10,341 | 11,773 | 13,442 | 16,790 | 24.91 |
| KEMENTAN-HARGA-2025-T2.1-08 Cabai merah | Rp/kg | 27,859 | 33,325 | 32,418 | 38,943 | 20.13 |
| KEMENTAN-HARGA-2025-T2.1-09 Cabai rawit | Rp/kg | 32,911 | 41,164 | 39,469 | 45,698 | 15.78 |
| KEMENTAN-HARGA-2025-T2.1-10 Bawang merah | Rp/kg | 23,914 | 27,084 | 26,919 | 31,673 | 17.66 |
| KEMENTAN-HARGA-2025-T2.1-11 Bawang putih | Rp/kg | 25,951 | 26,588 | 29,626 | 37,287 | 25.86 |
| KEMENTAN-HARGA-2025-T2.1-12 Mangga | Rp/kg | 9,852 | 10,931 | 11,251 | 14,607 | 29.83 |
| KEMENTAN-HARGA-2025-T2.1-13 Pisang | Rp/sisir | 8,224 | 8,330 | 8,584 | 10,790 | 25.71 |
| KEMENTAN-HARGA-2025-T2.1-14 Jeruk keprok/siam | Rp/kg | 9,474 | 9,624 | 10,235 | 11,802 | 15.31 |
| KEMENTAN-HARGA-2025-T2.1-15 Salak | Rp/kg | 8,833 | 8,889 | 8,932 | 11,602 | 29.89 |
| KEMENTAN-HARGA-2025-T2.1-16 Kelapa tua | Rp/butir | 3,248 | 3,283 | 3,291 | 3,422 | 3.97 |
| KEMENTAN-HARGA-2025-T2.1-17 Kopi robusta | Rp/kg | 20,141 | 21,715 | 25,817 | 38,789 | 50.24 |
| KEMENTAN-HARGA-2025-T2.1-18 Lada/merica | Rp/kg | 80,527 | 88,548 | 88,319 | 80,189 | -9.21 |
| KEMENTAN-HARGA-2025-T2.1-19 Karet getah tebal | Rp/kg | 7,725 | 7,958 | 7,400 | 9,301 | 25.69 |
| KEMENTAN-HARGA-2025-T2.1-20 Cengkeh biji kering | Rp/kg | 77,304 | 91,046 | 99,385 | 105,062 | 5.71 |
| KEMENTAN-HARGA-2025-T2.1-21 Sapi | Rp/kg berat hidup | 66,538 | 67,742 | 69,611 | 76,040 | 9.24 |
| KEMENTAN-HARGA-2025-T2.1-22 Kerbau | Rp/kg berat hidup | 66,507 | 67,712 | 72,247 | 76,047 | 5.26 |
| KEMENTAN-HARGA-2025-T2.1-23 Kambing | Rp/kg berat hidup | 114,313 | 123,865 | 136,040 | 137,258 | 0.90 |
| KEMENTAN-HARGA-2025-T2.1-24 Babi | Rp/kg berat hidup | 40,154 | 42,173 | 48,448 | 67,890 | 40.13 |
| KEMENTAN-HARGA-2025-T2.1-25 Ayam | Rp/kg berat hidup | 31,345 | 32,733 | 33,374 | 34,741 | 4.10 |
| KEMENTAN-HARGA-2025-T2.1-26 Telur ayam ras | Rp/kg | 25,503 | 26,920 | 30,408 | 34,045 | 11.96 |

### Matching and interpretation gates
- This table adds 26 commodity series × 4 annual values = 104 exact numeric observations from one common national source table. It also provides a cross-check against the separately extracted provincial-table national series for singkong, ubi jalar, bawang merah and mangga; matching values agree for 2021–2024.
- Rows are candidates, not automatic exact mappings to all 60 owner items. Generic “pisang” does not prove Cavendish, generic “ayam” does not distinguish broiler/layer/village chicken, “sapi” does not distinguish breeding/fattening, and “kelapa tua” is not the owner's direct-retail price. The official Rp3,422/butir for 2024 is a national producer-stage observation and **must remain separate** from the owner's Rp13,000 direct customer sale, Rp5,000 es kelapa glass, four-glasses-per-coconut conversion, no-milk recipe, Rp500 harvest labor, and observed Rp3,400 farmer-to-collector benchmark. Do not replace or normalize the owner data with this national series.
- Price data alone does not establish farm cost, yield, mortality, FCR, post-harvest loss, processing conversion, fixed capital, or profit. Unknowns stay null. No runtime parameter is authorized by this extraction.


## Kementan monthly producer-price supplement — Feb 2026 edition (extracted 2026-10-22)

Official source: Pusdatin Kementan, *Statistik Terkini Ekonomi Pertanian Februari 2026*, published 2026-02-26. PDF: https://satudata.pertanian.go.id/assets/docs/publikasi/8dd032702c6674502575a41b8020ecba.pdf. Printed Table 47 p.56 covers food-crop producer prices; Table 48 p.57 covers estate-crop producer prices. These are national producer-stage data, not retail prices or cost/profit models.

### Table 47 — food-crop producer prices (Rp/kg)
Columns: Dec 2024; published 2025 average; monthly Jan–Dec 2025; growth Dec 2025 vs Nov 2025; growth Dec 2025 vs Dec 2024.

| Commodity | Dec24 | Avg25 | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct | Nov | Dec | MoM % | YoY % |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Jagung pipilan kering | 4,635 | 4,784 | 4,762 | 4,729 | 4,990 | 4,912 | 4,944 | 5,022 | 5,086 | 5,462 | 5,651 | 5,792 | 5,966 | 5,910 | 27.49 | -0.95 |
| Kedelai | 9,398 | 10,397 | 9,954 | 9,996 | 10,369 | 9,833 | 9,961 | 9,228 | 9,858 | 10,332 | 10,132 | 9,917 | 10,403 | 10,156 | 8.06 | -2.38 |
| Kacang hijau | 14,985 | 15,686 | 14,958 | 15,568 | 15,323 | 15,343 | 16,295 | 16,723 | 17,316 | 17,692 | 17,894 | 17,614 | 18,034 | 18,479 | 23.32 | 2.47 |
| Kacang tanah | 10,828 | 9,981 | 10,574 | 10,874 | 11,048 | 10,933 | 10,462 | 10,693 | 10,919 | 10,948 | 10,551 | 10,537 | 10,617 | 10,692 | -1.25 | 0.71 |
| Ubi kayu/singkong | 2,966 | 2,926 | 2,834 | 2,852 | 2,815 | 2,995 | 2,795 | 2,890 | 3,142 | 3,078 | 3,136 | 2,997 | 3,036 | 3,220 | 8.56 | 6.04 |
| Ubi jalar | 4,595 | 4,804 | 4,427 | 4,580 | 4,377 | 4,665 | 4,562 | 4,780 | 5,089 | 5,320 | 5,408 | 5,450 | 5,294 | 5,353 | 16.50 | 1.13 |

### Table 48 — selected estate-crop producer prices (January 2026, Rp/kg)
Rows below record Jan 2026 price; growth columns are Jan 2026 vs Dec 2025 and Jan 2026 vs Jan 2025, respectively. Source table has text-extraction row/column alignment challenges; visually verify the rendered row before runtime consideration.

| Commodity/product form | Jan26 | MoM % | YoY % |
|---|---:|---:|---:|
| TBS kelapa sawit | 3,307 | 4.07 | 1.46 |
| Kopi arabika | 119,140 | 13.13 | 19.17 |
| Kopi robusta | 62,705 | 0.79 | 4.58 |
| Kelapa bulat | 6,077 | 6.40 | 28.24 |
| Kopra | 14,648 | -0.02 | 30.96 |
| Gula merah kelapa | 19,456 | -4.96 | 6.81 |
| Minyak kelapa | 30,244 | 6.83 | 15.25 |
| Karet lump | 10,398 | -3.31 | -10.50 |
| Karet slab tebal | 10,749 | -3.99 | -7.53 |
| Lada putih | 131,925 | 8.33 | 25.10 |
| Lada hitam | 88,060 | 11.13 | 29.01 |
| Kakao fermentasi | 71,795 | -6.68 | -36.70 |
| Kakao non-fermentasi | 52,820 | 2.04 | -48.60 |
| Tebu | 459 | n/a | -42.63 |
| Gula putih | 17,975 | -0.77 | -0.72 |
| Gula merah tebu | 9,226 | 1.06 | -18.42 |
| Teh hijau kering | 23,500 | 0.00 | 31.03 |
| Teh pucuk basah | 2,986 | 17.96 | 32.05 |
| Tembakau daun kering | 35,000 | 27.27 | -1.90 |
| Tembakau rajang kering | 101,559 | -5.09 | -4.85 |
| Pala biji kupas kering | 43,730 | -5.30 | -21.58 |
| Minyak nilam | 580,000 | 1.51 | -59.81 |
| Nilam daun kering | 4,123 | 1.28 | 1.75 |
| Gula aren batok | 26,872 | -2.03 | 1.32 |
| Gula aren semut | 59,957 | 3.09 | 23.97 |
| Bunga cengkeh kering | 100,167 | 3.27 | 2.30 |
| Vanili kering | n/a | n/a | n/a |
| Pinang kupas kering | 12,504 | 4.06 | 67.26 |
| Kayu manis kulit kering | 43,548 | -18.13 | -23.01 |

**Critical interpretation gate:** Table 48's “Kelapa Bulat” is a producer price in Rp/kg. It is not directly comparable to or a replacement for the owner's Rp13,000 per whole coconut (direct retail, Rp/butir), Rp5,000 es kelapa/glass, 4 glasses/coconut, no milk, Rp500 harvest labor, or observed Rp3,400/butir farmer-to-collector. No costs, yield, loss, processing conversion, capital or profit inferred; missing source dashes remain missing; no runtime values approved.


### Table 49 — livestock producer prices (2025 monthly series + January 2026)
Printed p.58 / PDF p.70. Source cited by bulletin: Ditjen PKH, Simponi Ternak; January 2026 download dated 18 February 2026. Columns are Jan–Dec 2025 then Jan 2026. Prices are producer-stage sale prices, not retail prices or farm production costs.

| Commodity | Unit | Jan25 | Feb25 | Mar25 | Apr25 | May25 | Jun25 | Jul25 | Aug25 | Sep25 | Oct25 | Nov25 | Dec25 | Jan26 | Jan26 vs Dec25 % | Jan26 vs Jan25 % |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Sapi hidup | Rp/kg berat hidup | 51,070 | 52,304 | 54,344 | 54,900 | 55,684 | 56,321 | 55,024 | 55,308 | 55,397 | 55,467 | 55,654 | 55,814 | 55,809 | -0.01 | 9.28 |
| Ayam broiler | Rp/kg berat hidup | 23,639 | 22,365 | 23,101 | 20,772 | 21,175 | 20,944 | 21,379 | 21,909 | 24,579 | 24,055 | 23,641 | 25,274 | 24,278 | -3.94 | 2.70 |
| Ayam buras | Rp/kg berat hidup | 61,713 | 66,215 | 68,575 | 68,289 | 69,042 | 73,381 | 64,998 | 61,626 | 62,499 | 57,465 | 53,927 | 54,811 | 54,468 | -0.63 | -11.74 |
| Telur ayam ras | Rp/kg | 26,193 | 26,496 | 26,722 | 25,719 | 25,778 | 26,028 | 26,084 | 25,406 | 26,433 | 26,795 | 26,462 | 27,088 | 26,633 | -1.68 | 1.68 |
| Telur ayam buras | Rp/butir | 2,432 | 2,861 | 2,542 | 2,383 | 2,243 | 2,542 | 2,259 | 2,415 | 2,391 | 2,440 | 2,323 | 2,479 | 2,479 | 0.00 | 1.93 |

**Scope gate:** do not map generic “sapi” or “ayam” to breed-specific Tier 1–4 models without evidence. This table does not establish feed conversion, mortality, cycle length, yield, housing/energy cost, carcass conversion or profit. No runtime promotion.


## Livestock input-price evidence — feed and DOC (official Kementan sources, 2026)

### Feed prices observed at feed-producer level

Kementan / Ditjen PKH, “Harga Pakan Ternak Catat Penurunan Harga,” 11 March 2026; article reports SPORA observations from February to early March 2026. This is producer-price evidence from feed mills, not necessarily farm-delivered prices and not a complete time series.

| Feed type | Reported average producer price | Observation context | Coverage reported |
|---|---:|---|---:|
| Broiler starter BR1 | Rp8,010/kg | February–early March 2026 report | 33 feed mills |
| Broiler pre-starter BR0 | Rp8,451/kg | February–early March 2026 report | 30 feed mills |
| Broiler finisher BR2 | Rp7,967/kg | February–early March 2026 report | 31 feed mills |
| Layer production feed P3 | Rp6,803/kg | February–early March 2026 report | 32 feed mills |
| Layer production concentrate KP3 | Rp7,735/kg | February–early March 2026 report | 14 feed mills |

Source: https://betcipelang.ditjenpkh.pertanian.go.id/berita/harga-pakan-ternak-catat-penurunan-harga. The same report says feed may account for about 60–70% of poultry business costs; treat that as a sector-level statement, not a universal share for every farm, scale or production system.

### DOC regulated-price reference

Ditjen PKH, “Kementan Perketat Pengawasan DOC dan Pakan demi Lindungi Peternak Ayam,” 25 January 2026, reports Kepbadan Pangan Nasional No. 524/2025 setting broiler DOC prices at Rp7,000/chick at farmer level and Rp11,000/chick loco factory. These are distinct transaction stages and must not be blended. Source: https://ditjenpkh.pertanian.go.id/index.php/berita/kementan-perketat-pengawasan-doc-dan-pakan-demi-lindungi-peternak-ayam.

**Modeling gate:** feed and DOC values are input-price anchors only. Do not derive full broiler HPP or margin without matched feed consumption/FCR, cycle length, mortality, liveweight gain, vaccine/medicine, energy, labor, litter, transport, housing depreciation, financing and sale-price stage. Record region, date, delivered-vs-mill price, flock size and contract/integrator terms when a farm-level source is found. No runtime promotion.


## Livestock input-price evidence — feed and DOC (official Kementan sources, 2026)

### Feed prices observed at feed-producer level

Kementan / Ditjen PKH, “Harga Pakan Ternak Catat Penurunan Harga,” 11 March 2026; reports SPORA observations from February to early March 2026. This is producer-price evidence from feed mills, not necessarily farm-delivered prices and not a complete time series.

| Feed type | Reported average producer price | Context | Reported mill coverage |
|---|---:|---|---:|
| Broiler starter BR1 | Rp8,010/kg | Feb–early Mar 2026 | 33 |
| Broiler pre-starter BR0 | Rp8,451/kg | Feb–early Mar 2026 | 30 |
| Broiler finisher BR2 | Rp7,967/kg | Feb–early Mar 2026 | 31 |
| Layer production feed P3 | Rp6,803/kg | Feb–early Mar 2026 | 32 |
| Layer production concentrate KP3 | Rp7,735/kg | Feb–early Mar 2026 | 14 |

Source: https://betcipelang.ditjenpkh.pertanian.go.id/berita/harga-pakan-ternak-catat-penurunan-harga. The report says feed may represent around 60–70% of poultry costs; this is contextual sector-level information, not a universal share for every farm or tier.

### DOC regulated-price reference

Ditjen PKH, “Kementan Perketat Pengawasan DOC dan Pakan demi Lindungi Peternak Ayam,” 25 January 2026, reports Kepbadan Pangan Nasional No. 524/2025 setting broiler DOC prices at Rp7,000/chick at farmer level and Rp11,000/chick loco factory. These are different transaction stages and must not be blended. Source: https://ditjenpkh.pertanian.go.id/index.php/berita/kementan-perketat-pengawasan-doc-dan-pakan-demi-lindungi-peternak-ayam.

**Modeling gate:** these are input-price anchors only. Do not derive complete HPP or margin without matched feed consumption/FCR, cycle length, mortality, liveweight gain, medicine/vaccines, energy, labor, litter, transport, housing depreciation, financing and sale-price stage. Record region, date, delivered-vs-mill price, flock size and contract terms when farm-level evidence is found. No runtime promotion.


## BPS SEP 2024 livestock tables — direct PDF extraction checkpoint (2026-10-24)

The official publication's “Unduh Publikasi” link is accessible and resolves to the BPS-hosted 134-page PDF; the earlier web-page fetch failure was not evidence that the PDF itself was unavailable. Publication page: https://www.bps.go.id/id/publication/2025/01/24/52f47865afe337fd047404a8/hasil-survei-ekonomi-pertanian-sep-2024-subsektor-peternakan.html. The downloaded PDF's extracted text identifies catalogue 5301012 and contains separate UTP, UPB, and UTL sections. Direct PDF endpoint (BPS web-api): https://web-api.bps.go.id/download.php?f=a+kJZ2Ypn1%2Fvo%2BxWvqvBp0lPUzZxMVUyNjdaaGhxZURXNXh3UHBaYVNTbHlQS2xJYm04OTErYW9vaVN3YnRHWGVDTkpCZmJ6NUFTYzdkdWxoRElKSXdTbWd0T0dNOS84UVB2TjBYdkJLaC9UYVRQWFNyYmxJbDc4THErbUFZek5BdmVJeXRTakE4cHFWYll0OStDbm9QUmM5ZmR6OFBkRWZxMVBVYUxxWmpLaGVxV3pFYmFneGg1SThFYzVRN0srelViZ0ZQajFiaUZNODFUSXNMK0J4NFZqY2pQNm1xVTdaclBJcEIrd3daeTloTzlXdzUwcitMVGc5R0kySHNvWlFZeEdsWFlDb0tjRnNoZzJXaEgyMWs1aG0vc2hoakl5a21HYjVCbVVqcjBkWW5BYTh2U2V4RTh4enBNPQ%3D%3D.

### Additional numeric rows verified from UTP tables

All values below are BPS-reported **thousand rupiah per stated production unit**, reference year 2024; they are national UTP averages, not a Tier 1–4 recipe or a local farm quote.

| Table / commodity | Production (thousand Rp) | Production cost (thousand Rp) | Income (thousand Rp) | Feed cost (thousand Rp) | Feed share of total cost | Notes |
|---|---:|---:|---:|---:|---:|---|
| 2.2 Dairy cattle, per head | 10,141.12 | 5,094.66 | 5,046.46 (calculated: production minus cost) | 4,074.74 | 79.98% | Milk/other non-live output 6,977.85; forage 564.65; concentrate/manufactured feed 2,465.24. |
| 2.3 Beef buffalo, per head | 3,697.39 | 533.97 | 3,163.42 (calculated: production minus cost) | 143.84 | 26.94% | Production mostly livestock weight gain (3,685.36). |
| 2.5 Meat goat, per head | 660.93 | 155.39 | 505.54 (calculated: production minus cost) | 57.85 | 37.23% | Production includes weight gain 648.61 and by-products 7.77. |

Source locations in the PDF: Table 2.2 printed p.15 (PDF page 32), Table 2.3 printed p.16 (PDF page 33), Table 2.5 printed p.18 (PDF page 35). The income values marked “calculated” are arithmetic from the table's displayed production and cost totals; they are not being presented as separately transcribed BPS income figures. For dairy, do not confuse the reported feed subcategories with a complete feed recipe. Table 2.2 shows feed components do not necessarily add cleanly due to survey classification/rounding; retain published total feed cost and shares as the primary values.

**Remaining extraction queue:** Table 2.4 pig, Table 2.6 sheep, Table 2.7 native chicken, Table 2.8 layer duck, Table 2.9 Muscovy duck, Table 2.10 broiler final stock, then UPB tables 3.1–3.6 and UTL table 4.1. Broiler Table 2.10 discrepancy remains open: production Rp152,008.05 thousand minus cost Rp126,445.08 thousand = Rp25,562.97 thousand, while the published income line was previously transcribed as Rp28,639.72 thousand. Do not silently reconcile or promote that margin until visual table QA.

**Evidence gate:** these aggregate survey tables do not establish animal cycle length, output timing, flock mortality, feed conversion, regional variance, scale effects or sale-stage comparability. Preserve UTP / UPB / UTL as separate strata. No runtime values promoted; owner-locked coconut/es-kelapa values unchanged; tests not run (remote GitHub documentation-only operation; no local test runner).


## Additional BPS SEP 2024 UTP poultry and sheep rows (2026-10-24)

Further direct PDF extraction, national UTP averages for reference year 2024. Values are in thousand rupiah per stated unit; “income” below is the published Table C value unless noted.

| Table / commodity | Unit | Production | Production cost | Published income | Feed cost | Feed share of cost | QA note |
|---|---|---:|---:|---:|---:|---:|---|
| 2.6 Meat sheep | per head | 689.79 | 242.91 | 446.88 | 135.42 | 55.75% | Production minus cost = 446.88; reconciles. |
| 2.7 Native chicken (ayam kampung biasa) | per head | 34.15 | 15.61 | 18.53 | 10.94 | 70.05% | Difference is 18.54; 0.01 gap likely rounding. Preserve published income. |
| 2.8 Layer duck | per 1,000 heads | 140,316.23 | 75,420.46 | 64,895.77 | 60,009.13 | 79.57% | Production minus cost = 64,895.77; reconciles. |
| 2.9 Muscovy duck (itik Manila) | per head | 39.80 | 20.75 | 19.06 | 15.56 | 74.98% | Published income differs by 0.01 from subtraction (19.05); retain published value and flag rounding. |
| 2.10 Broiler FS final stock | per 5,000 heads | 152,008.05 | 126,445.08 | 28,639.72 | 81,754.62 | 64.66% | Does not reconcile: subtraction gives 25,562.97, difference from published income = 3,076.75. Keep unresolved pending visual/source QA. |

Source: official BPS *Hasil Survei Ekonomi Pertanian (SEP) 2024 Subsektor Peternakan*, UTP Tables 2.6–2.10, printed pp.19–23 (PDF pages 36–40); official publication page https://www.bps.go.id/id/publication/2025/01/24/52f47865afe337fd047404a8/hasil-survei-ekonomi-pertanian-sep-2024-subsektor-peternakan.html. Text extraction confirms Table 2.10 explicitly reports total production 152,008.05, costs 126,445.08, feed 81,754.62 and published income 28,639.72 (thousand Rp per 5,000 final-stock heads); do not “correct” BPS's income figure silently.

**Modeling limits:** UTP national averages are descriptive anchors, not farm-specific Tier 1–4 inputs. Per-head or per-1,000/5,000-head units differ; normalize only when the denominator and production stage are preserved. No cycle length, mortality, feed conversion, weight target, housing configuration, local input prices, or contract/integrator terms are inferred. No runtime promotion; owner coconut/es-kelapa values unchanged; tests not run.


## BPS SEP 2024 UTP Table 2.4 — pig unit economics (2026-10-24)

Table 2.4, printed p.17 / PDF p.34, reports national UTP averages per head (thousand rupiah): production 1,732.79; production cost 518.55; published income 1,214.24; feed cost 377.24 (72.75% of production cost). Production minus cost reconciles exactly to the published income (1,732.79 − 518.55 = 1,214.24). Feed components reported: corn 24.21, forage 38.26, concentrate/manufactured feed 143.92, other feed 170.86. These are aggregate annual survey values, not a specified pig production cycle or tier recipe. Source: official BPS *Hasil Survei Ekonomi Pertanian (SEP) 2024 Subsektor Peternakan*, Table 2.4, https://www.bps.go.id/id/publication/2025/01/24/52f47865afe337fd047404a8/hasil-survei-ekonomi-pertanian-sep-2024-subsektor-peternakan.html. No runtime promotion; coconut benchmark unchanged; tests not run.


## SEP livestock stratum period metadata and pending table extraction (2026-10-24)

| Stratum | Reference period in BPS SEP livestock tables/manual | Modeling/QA implication |
|---|---|---|
| UTP | Table set is presented as 2024 SEP survey results; verify each table's own reference notes before comparing | Do not infer cycle length or convert annual totals into cycle costs without denominator evidence. |
| UPB | Calendar year 2023 | Must retain 2023 basis; not a same-period comparator to UTP or UTL by default. |
| UTL | 1 June 2023–31 May 2024 | Rolling 12-month window differs from UPB calendar year and may differ from UTP table reference conventions. |

Methodology note: the BPS UPB/UTL fieldwork manual describes costs as goods/services actually purchased or paid and used during the period, with imputed unpaid labor and own/free land rent as specific exceptions. Keep reported cost definitions and imputed components explicit when crosswalking to a game HPP model. Official publication page: https://www.bps.go.id/id/publication/2025/01/24/52f47865afe337fd047404a8/hasil-survei-ekonomi-pertanian-sep-2024-subsektor-peternakan.html. The official download endpoint returned a cache miss in this continuation; no UPB/UTL values are added from search snippets. UPB Tables 3.1–3.6 and UTL Table 4.1 remain pending direct extraction/visual QA. No runtime promotion; tests not run.


## BPS 2024 aquaculture production/value crosswalk — bulk evidence only (2026-10-24)

Official BPS statistical tables sourced to the Ministry of Marine Affairs and Fisheries (KKP) expose 2024 aquaculture output volume and production value by province and main commodity. These are complementary output/value anchors, not a farm budget or a substitute for the SEP 2024 fishery cost tables.

Sources:
- Production volume, tonnes: https://www.bps.go.id/id/statistics-table/2/MTUxMyMy/produksi-perikananbudidayamenurut-komoditas-utama.html
- Production value, thousand rupiah: https://www.bps.go.id/id/statistics-table/2/MTUxNCMy/nilai-produksi-perikanan-budidaya-menurut-komoditas-utama.html
- Combined province × commodity volume/value table: https://www.bps.go.id/id/statistics-table/3/YUVSTWJDOUlaRFpXYWsxcmVUY3hkMWxpY0hoVFVUMDkjMyMwMDAw/volume-produksi-dan-nilai-produksi-perikanan-budidaya-menurut-provinsi-dan-komoditas-utama.html

National 2024 totals transcribed from the Indonesia row. The BPS production table is in tonnes; value table is thousand Rp. The final column is an arithmetic implied unit value calculated as (thousand Rp)/(tonne), numerically equivalent to Rp/kg. It is **not** labelled as an observed farm-gate price and should only be used as a cross-check pending method/product-stage reconciliation.

| Aquaculture commodity | Production (tonnes) | Production value (thousand Rp) | Implied value (Rp/kg, calculated) |
|---|---:|---:|---:|
| Patin | 381,969 | 7,806,188,701 | 20,437 |
| Lele | 1,157,755 | 23,480,176,919 | 20,281 |
| Nila | 1,563,327 | 43,220,360,928 | 27,646 |
| Ikan mas | 523,796 | 15,276,148,494 | 29,164 |
| Kakap | 10,563 | 519,999,083 | 49,228 |
| Bandeng | 792,864 | 17,676,236,525 | 22,294 |
| Rumput laut | 9,853,604 | 24,287,266,362 | 2,465 |
| Kerapu | 16,063 | 1,492,770,473 | 92,932 |
| Udang | 958,463 | 63,478,642,288 | 66,230 |
| Ikan lainnya | 496,206 | 14,398,554,065 | 29,017 |

**Data-quality / model gate:** the table lists “Gurame” as the first commodity but the national row is “-” in both tables; preserve as unavailable rather than treating dash as a confirmed zero. Values above were calculated from two separately published BPS tables and rounded to the nearest Rp/kg; they are not directly transcribed price observations. Do not use as Tier-specific selling prices, profit, HPP, FCR, survival rate, cycle length, feed recipe, or capital assumptions. Crosswalk only where the owner's exact inventory contains the matching aquaculture species and production form. Keep capture fisheries distinct from aquaculture. The SEP 2024 fishery publication remains the primary pending source for cost structure; no numeric SEP fishery costs were extracted in this step. No runtime promotion.


## New official company-level aquaculture source indexed (2026-10-24)

BPS, *Statistik Perusahaan Budidaya Ikan 2024* (Catalogue 5403011; Publication 05200.25013; released 5 December 2025; 28.05 MB), official page:
https://www.bps.go.id/id/publication/2025/12/05/9e66e7740d8ef066adb18bfc/statistik-perusahaan-budidaya-ikan-2024.html

The official abstract states the publication includes company input/output, workforce and wages, production volume, production value, and production costs. It covers legal-entity aquaculture companies across brackish-water grow-out, marine grow-out, freshwater grow-out, and hatcheries. In 2024, 654 active aquaculture companies were covered: 444 mainly brackish-water grow-out, 43 marine grow-out, 99 hatcheries, and 68 freshwater grow-out.

This is a useful **formal-company / higher-scale evidence lane**, separate from household/individual holding data (UTP) and from the SEP fisheries publication. The linked 28.05 MB PDF could not be extracted through the current web retrieval path (official download returned cache miss); therefore no commodity-level cost, output, wage, or margin values are transcribed here. Do not infer these from company counts. The source is queued for table extraction using an alternate official access path or indexed table text.

Related official source: BPS *Statistik Perusahaan Penangkapan Ikan 2024* also covers company-level input/output, workforce, volume/value of production and production costs; keep capture fisheries separate from aquaculture:
https://perpustakaan.bps.go.id/opac/search?media=soft&page=528&subyek%5B0%5D=2

No runtime values promoted. This source metadata does not establish any Tier 1–4 model by itself.


## Producer-price source and transaction-stage definition refreshed — BPS 2025 (2026-10-24)

Indexed BPS, *Statistik Harga Produsen Pertanian Subsektor Peternakan dan Perikanan 2025*, Catalogue 7103013 / Publication 06200.26009, released 24 April 2026, 16.32 MB. The publication reports rural producer prices collected monthly across 38 provinces. Official page: https://www.bps.go.id/id/publication/2026/04/24/471c9fc5982e7c8927c362f8/statistik-harga-produsen-pertanian-subsektor-peternakan-dan-perikanan-2025.html.

BPS metadata defines producer price for fish as the average Rp/kg received by the fisher/aquaculture producer on the first sale to a buyer or collector, before distribution costs, levies, or intermediary margins. This helps define a comparable transaction stage, but the specific 2025 monthly rows still need extraction by commodity and province. Metadata source: https://sirusa.bps.go.id/metadata/variabel/308935. Do not substitute this definition with the separate 2024 output-value ÷ output-volume ratio; the latter is only an implied value cross-check.

No numeric 2025 fish price observation was added in this step. Preserve product form, capture vs aquaculture, province, month, and unit when extracting the publication. No runtime promotion.


## 2026-10-24 — producer-price metadata scope QA and company-count cross-check

A scope check on BPS metadata URL https://sirusa.bps.go.id/metadata/variabel/308935 shows the variable “Harga Ikan per Kilogram di Tingkat Produsen” is associated in its metadata record with **Survei Data Perikanan Kota Tangerang 2025**. Its definition is useful for interpreting the transaction stage (producer's first sale before distribution cost/levies/intermediary margin), but this specific metadata record must **not** be cited as proof that the same variable's values are the national 38-province monthly series in BPS publication 7103013. Keep those as separate source records until their table-level linkage is demonstrated.

The official publication page for *Statistik Harga Produsen Pertanian Subsektor Peternakan dan Perikanan 2025* confirms the broader publication covers rural producer prices monthly in 38 provinces; the numeric fish-price observations still need extraction from the publication itself:
https://www.bps.go.id/id/publication/2026/04/24/471c9fc5982e7c8927c362f8/statistik-harga-produsen-pertanian-subsektor-peternakan-dan-perikanan-2025.html

A separate BPS statistics table independently corroborates the 2024 formal aquaculture company frame: 654 active companies (444 brackish-water grow-out/tambak, 99 hatcheries, 68 freshwater, 43 marine). This is a count cross-check only, not unit economics:
https://www.bps.go.id/assets/statistics-table/2/MTEyOSMy/jumlah-perusahaan-budidaya-perikanan-menurut-jenis-budidaya.html

No fish-price numeric rows or company cost rows were extracted in this QA step. No economic model completeness or runtime approval count changes.


## Historical fish producer-price fallback — mullets, 2024 (2026-10-24)

A search-indexed text extraction of BPS *Statistik Harga Produsen Pertanian Subsektor Peternakan dan Perikanan 2024*, Table 2.1.4, “Harga Produsen Ikan Belanak Menurut Provinsi (Rp/Kg), 2024,” exposes the national row for January–April: January Rp24,226/kg; February Rp24,337/kg; March Rp24,372/kg; April Rp24,386/kg. The table labels the series in Rp/kg and shows the national row. This is historical producer-price evidence for **ikan belanak**, not a 2025 observation and not interchangeable with aquaculture prices or other fish species.

Source record: BPS publication page (catalogue 7103013, released 22 April 2025, data year 2024): https://www.bps.go.id/id/publication/2025/04/22/a193ac1aa4e9cb09fbd82001/statistik-harga-produsen-pertanian-subsektor-peternakan-dan-perikanan-2024.html. Table text was discoverable via an indexed PDF copy at https://assets.dataindonesia.id/2025/09/20/1758375725357-43-statistik-harga-produsen-pertanian-subsektor-peternakan-dan-perikanan-2024.pdf; direct PDF retrieval returned 403 in this session, so this is an index-text extraction and should be rechecked against the page image before production use.

Use these four values as a **provisional historical source row**, clearly tagged with year, species, transaction stage and verification caveat. Do not use as current 2025/26 pricing or as evidence for lele/nila/patin/other species. No unit economics or runtime approval changes.


## 2026-10-24 — producer-price evidence scope: mullet and aquaculture-company census

### Verified indexed table: mullet producer prices, 2024

BPS, *Statistik Harga Produsen Pertanian Subsektor Peternakan dan Perikanan 2024*, Table 2.1.4, “Harga Produsen Ikan Belanak Menurut Provinsi (Rp/Kg), 2024,” national row:

| Period | National producer price (Rp/kg) | Evidence status |
|---|---:|---|
| January 2024 | 24,226 | Search-indexed table text; original PDF table still needs visual verification |
| February 2024 | 24,337 | Search-indexed table text; original PDF table still needs visual verification |
| March 2024 | 24,372 | Search-indexed table text; original PDF table still needs visual verification |
| April 2024 | 24,386 | Search-indexed table text; original PDF table still needs visual verification |

Official publication record: https://www.bps.go.id/id/publication/2025/04/22/a193ac1aa4e9cb09fbd82001/statistik-harga-produsen-pertanian-subsektor-peternakan-dan-perikanan-2024.html . The publication describes monthly rural producer-price surveys across 38 provinces. Table values are historical 2024 producer prices for mullet, not current local prices, aquaculture farm-gate prices, costs, HPP, or profits. Empty provincial cells must remain missing, not zero. Indexed table evidence: https://assets.dataindonesia.id/2025/09/20/1758375725357-43-statistik-harga-produsen-pertanian-subsektor-peternakan-dan-perikanan-2024.pdf .

### Official aquaculture-company source identified; no unit-cost figures extracted yet

BPS, *Statistik Perusahaan Budidaya Ikan 2024*, catalogue 5403011 / publication 05200.25013, released 5 December 2025. The publication covers company inputs/outputs, labor and wages, production volume/value, and production costs. It reports 654 active incorporated aquaculture companies in 2024: 444 brackish-water grow-out, 99 hatcheries, 68 freshwater grow-out, and 43 marine grow-out. These are counts, not unit economics. Do not extrapolate company averages to household/UTP producers or infer a commodity-specific cost per kg from the count data. Official source: https://www.bps.go.id/id/publication/2025/12/05/9e66e7740d8ef066adb18bfc/statistik-perusahaan-budidaya-ikan-2024.html .

### 2025 price-series and cost-table extraction gate

The official BPS 2025 producer-price publication exists (released 24 April 2026) and covers monthly rural producer-price observations in 38 provinces, but no numeric 2025 fish table was extracted in this pass: https://www.bps.go.id/id/publication/2026/04/24/471c9fc5982e7c8927c362f8/statistik-harga-produsen-pertanian-subsektor-peternakan-dan-perikanan-2025.html . The SEP 2024 fishery-cost publication confirms that it contains cost structures by agricultural holding unit, but numeric tables remain unextracted: https://www.bps.go.id/id/publication/2025/01/23/9d6edb0cfc82283e01d19a77/hasil-survei-ekonomi-pertanian-sep-2024-subsektor-perikanan.html . Keep these as research leads, not model-ready cost evidence.


## 2026-10-25 — official publication access QA (numeric extraction blocked)

### Official 2025 producer-price publication

Confirmed official metadata for *Statistik Harga Produsen Pertanian Subsektor Peternakan dan Perikanan 2025*: catalogue 7103013, publication 06200.26009, release 24 April 2026, 16.32 MB. BPS states that monthly producer-price data cover rural areas in 38 provinces. The official “Unduh Publikasi” link was opened, but the web retrieval failed with a response-size error (>10 MiB); no numeric 2025 fish table was obtained in this pass. Therefore, do not enter any 2025 species/month values from this access attempt. Official record: https://www.bps.go.id/id/publication/2026/04/24/471c9fc5982e7c8927c362f8/statistik-harga-produsen-pertanian-subsektor-peternakan-dan-perikanan-2025.html .

### Official aquaculture company publication

Confirmed official metadata for *Statistik Perusahaan Budidaya Ikan 2024*: catalogue 5403011, publication 05200.25013, released 5 December 2025, 28.05 MB. The publication abstract explicitly covers company input/output, labor and wages, production volume/value, and production costs. The official download attempt returned a cache-miss retrieval error; no numeric cost/output table was obtained in this pass. This is an access limitation, not evidence that the tables are absent. Official record: https://www.bps.go.id/id/publication/2025/12/05/9e66e7740d8ef066adb18bfc/statistik-perusahaan-budidaya-ikan-2024.html .

### SEP 2024 fishery-cost publication

The official publication record states it contains fishery-subsector agricultural business cost structures disaggregated by agricultural holding unit. Opening the publication record returned a cache miss, and no numerical table was extracted. Official record: https://www.bps.go.id/id/publication/2025/01/23/9d6edb0cfc82283e01d19a77/hasil-survei-ekonomi-pertanian-sep-2024-subsektor-perikanan.html .

### QA disposition

These are verified official source records but still **not numeric cost/yield evidence**. Keep the 2025 fish price series and both fishery cost datasets pending. Continue with an accessible table/search-index route or obtain the official PDFs through a supported download path; capture printed page and table title and visually reconcile each value. No model/runtime status changes.


## 2026-10-26 — BPS Central Kalimantan household aquaculture cost tables (historical fallback)

Official provincial BPS source: *Angka Provinsi Kalimantan Tengah — Hasil Survei ST2013 Subsektor Rumah Tangga Usaha Budidaya Ikan, 2014*, catalogue 5106014.62, published by BPS Provinsi Kalimantan Tengah. The PDF was directly opened and its table text inspected. The cost tables are **historical 2014 per-cycle household aquaculture benchmarks for Central Kalimantan**, not national averages and not current prices. Monetary figures below are thousand rupiah as printed. Keep product units/area denominators separate; the patin table uses per m² while the other three tables use 100 m² or hectare.

| Table / printed page (PDF page) | Commodity and denominator | Output volume | Production value (000 Rp) | Production cost (000 Rp) | Reported business surplus (000 Rp) | Feed cost (000 Rp; % cost) | Seed cost (000 Rp; % cost) | Labor cost incl. imputed unpaid labor (000 Rp; % cost) |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| 17.1 / p.23 (PDF p.43) | Bandeng, per hectare per cycle | 287.62 kg | 2,949.60 | 2,169.73 | 779.87 (26.44% of production value) | 65.96 (3.04%) | 450.25 (20.75%) | 599.41 (27.63%) |
| 17.2 / p.24 (PDF p.44) | Nila, per 100 m² per cycle | 233.73 kg plus broodstock output | 8,353.03 | 5,565.87 | 2,787.16 (33.37% of production value) | 2,012.54 (36.16%) | 681.22 (12.24%) | 1,544.53 (27.75%) |
| 17.3 / p.25 (PDF p.45) | Lele, per 100 m² per cycle | 178.91 kg plus broodstock output | 3,921.06 | 3,461.26 | 459.80 (11.73% of production value) | 1,362.77 (39.37%) | 659.92 (19.07%) | 856.01 (24.73%) |
| 17.4 / p.26 (PDF p.46) | Patin broodstock, per m² per cycle | 402.18 kg broodstock output | 6,749.07 | 5,230.24 | 1,518.83 (22.50% of production value) | 3,070.44 (58.71%) | 513.17 (9.82%) | 1,047.70 (20.03%) |

These table rows are suitable as **historical, regional cost-structure anchors only**. They include estimated unpaid labor and other costs such as land, depreciation, credit interest, energy and fisheries services; do not treat “surplus usaha” as a clean cash-only margin. Product and denominator caveats are material: bandeng output is per hectare; nila and lele per 100 m²; patin is specifically broodstock per m², not market-size food fish. No unit-cost or hectare conversion should be applied across those unlike bases without a separately stated calculation and explicit assumptions. Do not merge these 2014 regional observations with BPS 2024 national value/volume ratios or BPS formal-company records as if they were one cohort. No game runtime values promoted.

Source PDF (official BPS provincial publication, table text and pages verified): https://web-api.bps.go.id/download.php?f=afbY+JcKhB4Q9ggMv1ZrvXlIU20wTE0wOTduVUV2Y1pLdkhEcnMzem9EOHZVWmoxS04yNEdqQ0RsVTk0OTVHN295bFVwVlVjbHlVdnpkenV4TiswTmd5NURlUWd0MzdzK0w4c3QyNW1NZkdiSGlROEtRSCtBWWFGTllTMU5neHV3QWRONjJhNTRXVytpQ0padlEyY3FpSlk1bG9obEdDaDJMU3JldzNzbC9TVzB3UTh0YmtRZUpHdDBKMFdmRjFkTXB3alVlcmEwMEpldlhXcVpNM3ZKdmc2UUY3ck5LTTZpL016RHRlbTJuOTJWcVYydnZJM2pZbUZtVVdTMzdwR0lSOC9heTZBeHBBTlQrdTVYcmJaVitjL2YvOHdPSW5SS2tIOGJtM1VLYldIL3FVc2ZoQW1kU0VnVTZGelpXK0FjSTJUMGc5OHQ3WmdOTks2bFpRbUZFdmdYdndCWFZIbXl5d041Zz09

## 2026-10-26 — SEP 2024 UTP crop/estate cost records extracted from official PDF

Source: BPS, *Hasil Survei Ekonomi Pertanian (SEP) 2024 — Nilai dan Biaya Produksi Beberapa Komoditas Utama pada Subsektor Tanaman Pangan, Hortikultura, dan Perkebunan*, Catalogue 5101026, Publication 05100.25001, released 24 January 2025. Direct PDF text opened and table values inspected; printed pages below refer to the publication's printed pagination (PDF page offsets differ). All money columns in the source are **thousand rupiah (000 Rp)**. These are national UTP averages for 2024, except where explicitly noted otherwise. They are farm production-value/cost observations, not retail/collector prices and not game-ready recipe costs.

| Table / printed page | Commodity and denominator | Production value (000 Rp) | Production cost (000 Rp) | Published income (000 Rp) | Producer price (000 Rp/kg) | Cost per unit (000 Rp/kg) | Output / productivity | Selected cost shares |
|---|---|---:|---:|---:|---:|---:|---|---|
| 2.1 / p.15 | Paddy, per ha, self-harvested | 26,369.86 | 15,287.59 | 11,082.11 | 5.76 | 3.59 | 46.35 ku/ha | Land rent 36.76%; wages/agricultural services 33.08%; fertilizer 13.74% |
| 2.2 / p.16 | Maize, per ha, self-harvested | 20,943.60 | 11,486.06 | 9,457.54 | 4.97 | 3.13 | 42.94 ku/ha | Land rent 34.65%; wages/services 21.08%; fertilizer 19.05% |
| 2.3 / p.17 | Shallot, per ha | 141,997.49 | 75,286.09 | 66,711.41 | 20.63 | 11.62 | 0.73 kg/m² | Seeds 28.58%; pesticides 20.71%; land rent 15.47% |
| 2.4 / p.18 | Green chili, per ha | 96,295.28 | 40,216.90 | 56,078.37 | 19.78 | 10.75 | 0.52 kg/m² | Land rent 26.63%; wages/services 18.45%; fertilizer 20.72% |
| 2.5 / p.19 | Big red chili, per ha | 159,090.37 | 60,775.69 | 98,314.68 | 27.81 | 13.34 | 0.59 kg/m² | Wages/services 25.00%; pesticides 21.25%; fertilizer 18.91% |
| 2.6 / p.20 | Curly red chili, per ha | 135,680.79 | 54,709.62 | 80,971.17 | 29.49 | 17.88 | 0.48 kg/m² | Wages/services 22.42%; pesticides 21.07%; fertilizer 20.95% |
| 2.7 / p.21 | Cayenne pepper, per ha | 103,548.29 | 34,607.54 | 68,940.75 | 28.35 | 15.73 | 0.37 kg/m² | Wages/services 21.88%; land rent 27.64%; pesticides 13.90% |
| 2.8 / p.22 | Oil palm, per 100 trees | 24,378.94 | 10,112.64 | 14,266.32 | — | — | table reports 100-tree denominator | Land rent 40.81%; wages/services 26.27%; fertilizer 18.68% |
| 2.9 / p.23 | Rubber, per 100 trees | 5,438.61 | 1,643.87 | 3,794.75 | 7.30 | 2.40 | 842.57 kg/100 trees | Land rent 55.37%; wages/services 19.02%; fuel/lubricants 11.54% |
| 2.10 / p.24 | Coconut, per 100 trees | 12,788.56 | 4,642.55 | 8,146.04 | see source table | see source table | table reports 100-tree denominator | Land rent 55.03%; wages/services 31.62%; fuel/lubricants 4.27% |

**QA notes:** For paddy, maize, shallot, big red chili, curly chili, cayenne pepper, oil palm, rubber and coconut, published income reconciles to production value minus production cost within the displayed precision. Green chili Table 2.4 is an exception: 96,295.28 − 40,216.90 = 56,078.38 thousand Rp, while published income is 56,078.37 thousand Rp (0.01 thousand Rp display-rounding gap); preserve the published income and record the difference. The BPS notes that some cost/subsidy imputations have not yet been estimated and displayed decimals can differ because of rounding. The publication’s technical notes identify paddy output as gabah kering panen (GKP), maize as dry shelled maize, shallot as harvested dry bulbs with leaves, chilies as fresh fruit, oil palm as fresh fruit bunches, rubber as latex, and coconut as fresh coconut. These are different product stages and denominators; do not treat producer price as the retail/collector price or mix the records with UPB/UTL strata.

Official publication page: https://www.bps.go.id/id/publication/2025/01/24/8faa8436999bb9b54ba0b7a9/hasil-survei-ekonomi-pertanian--sep--2024--nilai-dan-biaya-produksi-beberapa-komoditas-utama-pada-subsektor-tanaman-pangan--hortikultura--dan-perkebunan.html
Official PDF directly inspected: https://web-api.bps.go.id/download.php?f=c8PKr3LM32mtv1hwb+JMyW1SOTRVdy9JeXpENmNBK2ozMEkzaVFyZUtHeWpRb3RQUmNPMnA3TDBoT3lWV0MySFNoRTNISlFrdmd4SEhNd2oxWXY4UU9jZEcydXBFeUV6djY2NEEyay9XSXdiQ0NZWVlOcmpESkxBV2tJUjB0T0VOd0NFOG1UZUhBSEJVekdibzZ2M2xzcTdsZ0VscERjRnZHWUtoV3JyKzZlblZXRHgrQzh6ci9BcjMzNWRYblhaeG90aGs3NzZJUHk0VGNtQlo1YlVjT2lsWG16RlJDTDE4dWJJVXk1V2QwL0lYd3M5MHpNMnRvMmcxL3dFd0tiNnFIRzJvL3VmdDVVT2ZDZTJaLzFWSEtLTWpGbTEwMjdXSkZSWElkeDlsOXhnc3NydkdTMThUVU1kS0pOQjkxV01RWHVCNUx6cmN0V1pNQTdXWTFNazE0Y0g2Q1VrOGZLRERoRytybTd4SDRNQU4zMm1XM2JsYXJKMndSazNrcGR3MlY0enpHRHc2WUZpcENucE1kczRMb0t2ZUNYUUN6cDgvaFZUL0s2anlYb01Xa042eHlIWElaWjQ1YTg9
\n\n

## SEP 2024 — UPB and UTL comparison checkpoint (2026-10-26)

Official BPS publication: [Hasil Survei Ekonomi Pertanian (SEP) 2024 — Nilai dan Biaya Produksi Beberapa Komoditas Utama pada Subsektor Tanaman Pangan, Hortikultura, dan Perkebunan](https://www.bps.go.id/id/publication/2025/01/24/8faa8436999bb9b54ba0b7a9/hasil-survei-ekonomi-pertanian--sep--2024--nilai-dan-biaya-produksi-beberapa-komoditas-utama-pada-subsektor-tanaman-pangan--hortikultura--dan-perkebunan.html), Catalogue 5101026, publication 05100.25001. The indexed table text was cross-checked against the same publication PDF. All values below are **thousand rupiah (000 Rp)** and are survey averages, not a retail price list.

| Survey stratum / table | Commodity and denominator | Production value | Production cost | Published income | Producer price (000 Rp/kg) | Unit cost (000 Rp/kg) | Productivity |
|---|---|---:|---:|---:|---:|---:|---:|
| UPB, Table 3.1 (printed p.27) | Oil palm, per 100 trees | 29,772.24 | 14,435.11 | 15,453.08 | 2.25 | 1.38 | 13,502.29 kg/100 trees |
| UTL, Table 4.1 (printed p.31) | Cayenne pepper, per hectare | 207,483.01 | 99,094.45 | 108,388.56 | 37.67 | 22.95 | 0.56 kg/m² |
| UTL, Table 4.2 (printed p.31) | Oil palm, per 100 trees | 25,143.89 | 13,218.16 | 12,046.95 | 2.07 | 1.29 | 12,443.49 kg/100 trees |

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
