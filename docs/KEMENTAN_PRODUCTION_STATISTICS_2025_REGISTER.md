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
