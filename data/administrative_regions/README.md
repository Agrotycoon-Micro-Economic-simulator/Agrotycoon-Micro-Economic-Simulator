# Administrative master data — Kepmendagri 2025

Four CSV files in this directory are copied from `prodhokter/dataset-wilayah-indonesia`, branch `master`, clean/ directory. The upstream dataset states that it is normalized from `cahyadsn/wilayah` and references **Keputusan Menteri Dalam Negeri No. 300.2.2-2138 Tahun 2025**.

Source repository: https://github.com/prodhokter/dataset-wilayah-indonesia  
Upstream source: https://github.com/cahyadsn/wilayah  
Reference: Kepmendagri No. 300.2.2-2138 Tahun 2025  
Source repository commit/blob references:
- provinces.csv: `6ebdcd91e6b6628a9445d09730e361ad0dacaed9`
- regencies.csv: `c812985f6f0a93d60e6d8bd2918acaeda4feb6e9`
- districts.csv: `bea2c3a5e6abe1299e5051cef0201defdd4fb007`
- villages.csv: `c50d17360e636b012c439f081f1abb541113c440`

Dataset row counts (excluding header): 38 provinces, 514 regencies/cities, 7,285 districts, 83,762 villages/kelurahan. The four files use UTF-8 CSV with parent foreign keys:
- regencies.province_id → provinces.id
- districts.regency_id → regencies.id
- villages.district_id → districts.id

The last four digits of village IDs encode the administrative type in the upstream convention. Do not infer population from these IDs. Population and consumption by locality are separate statistical datasets and must retain their own source/year/definition.

Both MIT license notices are included here. Preserve these files and source attribution when redistributing the dataset. The master is used for administrative identity only; BPS/Podes statistical counts remain separate because their reference dates and definitions can differ.
