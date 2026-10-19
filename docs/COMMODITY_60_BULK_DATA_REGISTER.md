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
