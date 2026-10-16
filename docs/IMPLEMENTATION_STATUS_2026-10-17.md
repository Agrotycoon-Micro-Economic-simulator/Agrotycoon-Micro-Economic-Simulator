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
- Added `tests/world_simulation.test.js`.

## Additional implementation in the latest pass

- Added `kredit.html` and `js/finance.js`: local loan application, eligibility, capped principal, daily interest accrual, partial/full repayment, and overdue state.
- Added `js/market_chain.js` and a market-chain table for producer, middleman, wholesale, direct-sale, and factory stages. Missing stages stay null; game-only values are labeled as parameters.
- Added regional qualitative profiles for Banten, Central Java, East Java, Jambi, South Kalimantan, Central Kalimantan, South Sulawesi, NTB, and Riau, with farming/trade ideas and logistics risks. These are hypotheses, not official land suitability results.
- Daily reports now separately track cash inflow, cash outflow, and net cash flow rather than conflating cash flow with profit. Accounting includes recorded loan/payroll liabilities and purchased land cost.
- Importer now supports comma, semicolon, and tab-delimited CSV; Indonesian thousands/decimal separators; year/month periods; market-level field; and source URL provenance.

## Verification actually performed

- JavaScript syntax compilation passed for the changed core JS modules and inline scripts in the principal frontend pages.
- Runtime smoke test simulated 365 in-game days: nonnegative inventories, finite and bounded price indices, deterministic event sequence and price indices, and all generated bulletins marked `SIMULASI` passed.
- Local module smoke test passed for progression, staff hiring/payroll, loan eligibility/origination, interest accrual, and repayment.
- CSV parser smoke test passed for semicolon-delimited rows and Indonesian numeric formats.\n- Final syntax checks passed for core JavaScript modules and inline scripts on all principal frontend pages. Runtime smoke tests passed for the 365-day world simulation, progression, staff payroll, loan origination/interest/repayment, and market/importer scripts.
- A full browser end-to-end run was not performed. A local clone could not be obtained in the current runtime because network DNS resolution failed; this does not affect the GitHub commits but limits browser verification.

## Historical data coverage: honest count

The current curated registry in `js/real_economic_data.js` contains:
- 8 food-price points for national consumer/producer-labelled series for period 2026-03 (one observation per listed commodity; not a time series).
- 5 subsidized-fertilizer HET points, dated 2025-10-22.
- 3 feed-price points, dated 2026-09.
- 17 provincial live-cattle producer price points, snapshot 2026-10-14.
- 14 official toll segment tariff entries.

That is 33 listed food/input/animal price points plus 14 toll-segment entries; it is **not thousands of historical price observations**. The toll entries are transport parameters, not commodity observations. No bulk BPS monthly tables, Bapanas provincial producer/consumer time series, SPORA feed history, or BNPB raw event workbook has yet been committed as normalized observations.

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
