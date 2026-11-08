# Administrative master data — Kepmendagri 2025

Four CSV files in this directory are copied from `prodhokter/dataset-wilayah-indonesia`, branch `master`, clean/ directory. The upstream dataset states that it is normalized from `cahyadsn/wilayah` and references **Keputusan Menteri Dalam Negeri No. 300.2.2-2138 Tahun 2025**.

Source repository: https://github.com/prodhokter/dataset-wilayah-indonesia  
Upstream source: https://github.com/cahyadsn/wilayah  
Reference: Kepmendagri No. 300.2.2-2138 Tahun 2025  
Source repository blob references:
- `clean/provinces.csv`: `aff1e43fc50593a4531732d71f0d0dbcdc2d24ae`
- `clean/regencies.csv`: `2127a70121bf02b1aee635aa943f4173d86a9074`
- `clean/districts.csv`: `81c28b6e11f207305a0300d3dc95994c8ca5aa0a`
- `clean/villages.csv`: `c50d17360e636b012c439f081f1abb541113c440`

Dataset row counts (excluding header): 38 provinces, 416 kabupaten, 98 kota, 7,285 kecamatan, 75,252 desa, 8,496 kelurahan and 14 UPT/SPT (83,762 locality records total). The four files use UTF-8 CSV with parent foreign keys:
- regencies.province_id → provinces.id
- districts.regency_id → regencies.id
- villages.district_id → districts.id

The last four digits of village IDs encode the administrative type in the upstream convention. Do not infer population from these IDs. Population and consumption by locality are separate statistical datasets and must retain their own source/year/definition.

Both MIT license notices are included here. Preserve these files and source attribution when redistributing the dataset. The master is used for administrative identity only; BPS/Podes statistical counts remain separate because their reference dates and definitions can differ.
