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
