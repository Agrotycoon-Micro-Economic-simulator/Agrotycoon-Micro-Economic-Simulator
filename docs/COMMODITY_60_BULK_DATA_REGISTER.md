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
