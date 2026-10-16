# Agrotycoon implementation ledger — 2026-10-17

This ledger separates shipped code from incomplete work. No Supabase integration has been started.

## Frontend and local simulation changes in this branch

- Main player navigation is hamburger-based; pages include game, stock, accounting, assets/staff, market, world simulation, historical import, achievements, progression, and credit.
- Added `stock.html` and `assets.html`.
- Added `kemajuan.html` + `js/progression.js`: level/wealth thresholds for land, staff, expansion, loans, consultants, and government. Land purchases and crop planting check progression.
- Fixed `gainXP` to advance through multiple levels if one reward crosses multiple thresholds.
- Added `js/staff.js`: local staff hiring/dismissal and daily payroll; unpaid wages accrue as a liability. Wage rates are explicitly experimental assumptions.
- Added `kredit.html` + `js/finance.js`: local-only loans, eligibility, daily interest accrual, partial/full repayment, and overdue status. Interest rate and loan limits are experimental game rules, not real-world offers.
- Accounting now includes recorded loan and payroll liabilities and purchased land book costs.
- Added regional qualitative land-use/logistics profiles. They are labeled hypotheses, not official suitability classifications or appraisals.
- Improved historical CSV import for comma/semicolon/tab delimiters, Indonesian number formats, year/month periods, and market-level provenance.
- Fixed the world simulation's state lookup: the save uses top-level lexical `let S`, so checking `window.S` prevented initialization.
- Added `tests/world_simulation.test.js` and `tests/finance.test.js`.

## Additional implementation in the latest pass

- Added `kredit.html` and `js/finance.js`: local loan application, eligibility, capped principal, daily interest accrual, partial/full repayment, and overdue state.
- Added `js/market_chain.js` and a market-chain table for producer, middleman, wholesale, direct-sale, and factory stages. Missing stages stay null; game-only values are labeled as parameters.
- Added regional qualitative profiles for Banten, Central Java, East Java, Jambi, South Kalimantan, Central Kalimantan, South Sulawesi, NTB, and Riau, with farming/trade ideas and logistics risks. These are hypotheses, not official land suitability results.
- Daily reports now separately track cash inflow, cash outflow, and net cash flow rather than conflating cash flow with profit. Accounting includes recorded loan/payroll liabilities and purchased land cost.
- Importer now supports comma, semicolon, and tab-delimited CSV; Indonesian thousands/decimal separators; year/month periods; market-level field; and source URL provenance.
- Audited liability aggregation across credit summary and accounting. `AgroFinance.totalDebt()` now includes active/overdue loans, payroll payable, and legacy `finance.debt`, matching the three liability components shown by accounting.
- Extended `tests/finance.test.js` to cover legacy debt and payroll aggregation, and ensure new loan liabilities do not mask existing obligations.

## Verification actually performed

- JavaScript syntax compilation passed for the changed core JS modules and inline scripts in the principal frontend pages.
- Runtime smoke test simulated 365 in-game days: nonnegative inventories, finite and bounded price indices, deterministic event sequence and price indices, and all generated bulletins marked `SIMULASI` passed.
- Earlier local module smoke tests passed for progression, staff hiring/payroll, loan eligibility/origination, interest accrual, and repayment.
- CSV parser smoke test passed for semicolon-delimited rows and Indonesian numeric formats.
- Final syntax checks passed for core JavaScript modules and inline scripts on all principal frontend pages. Historical smoke-test results are recorded above; they do not mean every current test file was run against the latest commit.
- `tests/finance.test.js` now contains focused assertions for loan lifecycle and liability aggregation, but **this latest version has not been executed in a Node runtime during this pass**. Do not report it as passing until `node tests/finance.test.js` is run.
- A full browser end-to-end run was not performed. A local clone could not be obtained in the current runtime because network DNS resolution failed; this does not affect the GitHub commits but limits browser verification.

## Historical data coverage: honest count

The current curated registry in `js/real_economic_data.js` contains:
- 8 food-price points for national consumer/producer-labelled series for period 2026-03 (one observation per listed commodity; not a time series).
- 5 subsidized-fertilizer HET points, dated 2025-10-22.
- 3 feed-price points, dated 2026-09.
- 17 provincial live-cattle producer price points, snapshot 2026-10-14.
- 46 coconut price points: annual producer and consumer prices for 2002–2024 (23 observations per market stage), Rp/butir, national.
- 14 official toll segment tariff entries.

That is 79 food/input/animal/coconut price records plus 14 toll-segment entries; it is **not thousands of historical price observations**. The toll entries are transport parameters, not commodity observations. No bulk BPS monthly tables, Bapanas provincial producer/consumer time series, SPORA feed history, or BNPB raw event workbook has yet been committed as normalized observations.

## Official sources to ingest next

- BPS agriculture producer prices 2025: https://www.bps.go.id/id/publication/2026/04/24/ab557ad3c44be1254c87c5aa/statistik-harga-produsen-pertanian-subsektor-tanaman-pangan-hortikultura-dan-tanaman-perkebunan-rakyat-2025.html
- BPS livestock and fisheries producer prices 2025: https://www.bps.go.id/id/publication/2026/04/24/471c9fc5982e7c8927c362f8/statistik-harga-produsen-pertanian-subsektor-peternakan-dan-perikanan-2025.html
- Bapanas producer prices by province: https://data.badanpangan.go.id/datasetpublications/5jb/rata-rata-harga-pangan-bulanan-produsen-provinsi
- Bapanas consumer prices by province: https://data.badanpangan.go.id/datasetpublications/sw6/rata-rata-harga-pangan-bulanan-konsumen-provinsi
- SPORA feed prices: https://simpakan.ditjenpkh.pertanian.go.id/spora/backend/web/site/data-harga
- BNPB disaster dataset: https://data.bnpb.go.id/dataset/data-bencana-indonesia
- SIMPONI Ternak daily history: https://simponiternak-v1.pertanian.go.id/harga-komoditas.php

Bulk import acceptance rule: retain raw file and source metadata, normalize with market stage and units, count accepted/rejected/duplicates/missing values, and do not write estimated values into the historical observation store.

## Remaining requested work

1. Complete historical bulk ingestion and validation; the importer UI is only a local CSV/JSON validation path, not an automated downloader or bulk ETL pipeline.
2. Expand the engine beyond five simulated regions and four tracked crops; currently simulated indices are experimental and are not yet wired into all actual sale transactions.
3. Add regional commodity chains (producer, middleman, wholesale market, direct sale, factory) only where sourced data exists; unknown stage prices must remain null.
4. Connect generic commodity inventory to every purchase, harvest, processing, and sale transaction.
5. Finish stock/accounting/assets UI integration, audit valuation and daily cash-flow semantics, and run browser end-to-end tests.
6. Implement and test level unlocks for all action paths, not only land acquisition and crop planting.
7. Add consultant/mentor/government gameplay only after simulation/data validation. Consultant price plan (1–10 Gold/project) and US$5/100 Gold remain design notes; premium Gold wallet and real payments are not active.
8. No Supabase until frontend workflows and local simulation are complete and tested.


## Production tier taxonomy pass — 2026-10-17

- Read the owner's Library blueprint documents, including `data game.docx`, `harga komoditi.docx`, and `data peternakan dan pertanian.docx`; Tier definitions were found in `data game.docx`.
- Added `docs/PRODUCTION_TIERS.md` to preserve the exact production taxonomy and explicitly distinguish it from the market-stage columns used in `harga komoditi.docx`.
- Added `js/production_tiers.js`: dependency-free metadata for Tier 1 raw (0% school buff), Tier 2 semi-processed (+10%), Tier 3 industrial (+15%), Tier 4 national specialization (+20%); normalizer, lookup, upward-transition check, and minimal definition validation.
- Added `tests/production_tiers.test.js` for tier metadata, normalization, invalid input, upward transitions and product-definition validation.
- Important: school buffs are design values from the blueprint, not verified empirical productivity effects. This does not create commodity prices, recipe ratios, yields, costs, or historical observations.
- Verification: `node tests/production_tiers.test.js` passed against byte-identical scratch copies of the newly committed module and test file (PASS: taxonomy, normalization, transition checks and validation). The test has **not** been run from a checked-out repository working tree. Existing finance/world-simulation tests and browser E2E were not run in this pass.
- Next: run the new test and current finance/world-simulation tests in a real Node environment, then select one commodity for a source-backed end-to-end production chain. Keep `productionTier` separate from `marketStage`. No backend/Supabase work.

## Unit economics + coconut historical prices — 2026-10-17

- Added `js/unit_economics.js`: scenario validator and calculator for revenue, required production after waste, purchased vs self-produced input costs, stand-only cash result, integrated-chain operating cash result, accounting profit after depreciation, opportunity-adjusted profit, HPP per saleable unit, contribution margin, break-even volume, and startup capex.
- Provenance is tracked separately for selling price, planned sales volume, waste, recipe quantity, each relevant input price, variable costs, fixed costs, and capex. Fixed costs and assets can be scoped to stand, upstream, or the whole chain. Numeric completeness does not mean real-data validation. Missing required cost inputs block the calculation; missing evidence marks the result as incomplete-provenance.
- Added `tests/unit_economics.test.js` for es-kelapa-shaped buy-vs-own scenarios, internal-chain cost counted once, opportunity cost, depreciation, invalid waste and missing costs/provenance.
- Added `docs/UNIT_ECONOMICS_AND_BUSINESS_MODEL_CONTRACT.md` with the canonical business schema, accounting rules, es-kelapa benchmark, extension to fertilizer/feed/pellets/processing and acceptance criteria.
- Added 46 official historical coconut-price observations to `js/real_economic_data.js`: annual 2002–2024 producer and consumer prices (23 each), Rp/butir, national, source: Kementerian Pertanian Pusdatin's *Outlook Komoditas Perkebunan Kelapa Tahun 2025*, Lampiran 27; underlying price series attributed to BPS/Susenas. Official source: https://satudata.pertanian.go.id/assets/docs/publikasi/OUTLOOK_KELAPA_2025_sign.pdf. 2024: producer Rp3,422/butir; consumer Rp6,061/butir.
- Added `tests/real_economic_data.test.js` for row count, source URL, 2024 values, unit and stage separation.
- Benchmark correction (2026-10-17): owner standards preserved — direct whole coconut Rp13,000, es kelapa Rp5,000/glass, 4 glasses/coconut, no milk. Cup pack was inconsistent (Rp8,000/20 in shop input versus Rp15,000/50 in both starter packs); shop input is now aligned to Rp15,000/50 (Rp300/cup), within current online 16 oz/50-piece comparables. Ice is Rp500/glass; syrup allowance Rp400/glass; corrected listed non-coconut consumables subtotal is Rp1,200/glass. Old Rp1,525 lesson figure was unsupported by its stated component arithmetic. This subtotal excludes coconut, labor, water/gas, spoilage, transport, utilities and fixed costs.
- Verification: the committed `tests/unit_economics.test.js` and `tests/real_economic_data.test.js` were both executed against the fetched committed module/registry and test sources in an isolated V8 harness with Node API stubs; both passed. The unit-economics test also passed in a scratch Node v22.16.0 harness using equivalent local copies. These are not repository-checkout runs. Existing finance/world-simulation tests and browser E2E were not run in this pass.
- This work does not yet wire the calculator into all business UIs/transactions, provide real es-kelapa recipe inputs or local stand demand, or deliver thousands of observations. The new 46-point coconut price series is a first source-backed slice, not the target dataset volume.

## Owner es-kelapa benchmark correction — 2026-10-17

- Preserved the owner-provided direct-customer price Rp13,000/whole coconut, es price Rp5,000/glass, 4 glasses per coconut, no-milk recipe, and syrup batch serving 50 glasses.
- Corrected `js/data.js` cup pack to Rp15,000/50 (Rp300/cup), consistent with the existing starter-pack price and online 16 oz cup comparisons (roughly Rp12,100–Rp18,246 per 50 pieces; marketplace references, not an owner supplier invoice).
- Kept the Rp20,000 syrup batch allowance for 50 portions (Rp400/glass), but documented that this is provisional: online reference is Rp20,000/kg gula merah; actual grams of gula merah used per 1 L Tupperware and cooking fuel/water costs are unverified.
- Updated lesson to call Rp1,200/glass the listed **non-coconut consumables subtotal**, not full HPP: ice Rp500 + syrup Rp400 + cup Rp300. It excludes coconut, labor, water/gas, spoilage, transport and fixed costs.
- Derived comparison: four glasses gross Rp20,000; whole coconut direct sale Rp13,000; four glasses' listed consumables Rp4,800; processing route's advantage over whole-fruit sale is Rp2,200/coconut before omitted costs. This is not net profit.
- Added `docs/ES_KELAPA_OWNER_BENCHMARK.md` and `tests/es_kelapa_benchmark.test.js`. Run the new test before claiming it passes. No national producer price is substituted for the owner's direct customer price. No milk added.
