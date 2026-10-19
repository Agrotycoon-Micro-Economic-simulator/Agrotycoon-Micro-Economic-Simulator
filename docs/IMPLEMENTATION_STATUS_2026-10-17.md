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


## 2026-10-19 branch audit — finance commits after checkpoint

- Reconstructed the five commits after `95e2a3be880ccbf75620e4bd42490489c010cac6`; latest branch HEAD at audit start was `c6c035f86320299629bdc2916f9478ff3c6a770a`. The commits add handoff notes, loan lifecycle tests, legacy debt aggregation and its test, then update the status ledger.
- Test source covers loan origination, daily interest, repeated same-day accrual, partial/full repayment, legacy debt + payroll liability aggregation, due-day overdue state, and invalid repayment inputs. It was not executed in this audit.
- Missing edge coverage: tiny-principal rounding; loaded state where `lastAccrualDay === dueDay` but status remains active; save/load migration; and reconciliation of loan/payroll liabilities across ledger, cash flow, P&L and balance sheet. `accrueDay()` returns early for same-day accrual before it re-evaluates overdue status, so test restored inconsistent state explicitly.
- No runtime code changed. Node and browser tests were not run due lack of a repository checkout/runtime in this pass. Do not claim these tests passed without execution.


## 2026-10-19 implementation checkpoint — smart shop copy

- Corrected inaccurate smart-shop explanatory copy in `js/economy.js`: package rounding can slightly exceed the 150%-of-demand stock target; the code does not block a package to zero. No stock logic, price, recipe, or target changed.
- Added `tests/shop_materials.test.js` for 3 stock/demand cases and 2 copy assertions.
- Targeted isolated runtime evaluation of exact `materialPlan()` source: 3/3 cases passed; copy/test-source assertions 4/4 passed. Node test file and full regression/browser suites remain unrun.
- Commits: `f4d7aa17e961874849274a14956b7da2ea92bc66` (code), `9d35d0a34f8b2213a2e4dbf831b7a88e69b45c9d` (test).
- Next: run the Node test and repository suites in a real checkout, audit finance/accounting cross-reconciliation, continue source-backed commodity evidence. No main-branch changes.
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


## 2026-10-19 branch audit — finance commits after checkpoint

- Reconstructed the five commits after `95e2a3be880ccbf75620e4bd42490489c010cac6`; latest branch HEAD at audit start was `c6c035f86320299629bdc2916f9478ff3c6a770a`. The commits add handoff notes, loan lifecycle tests, legacy debt aggregation and its test, then update the status ledger.
- Test source covers loan origination, daily interest, repeated same-day accrual, partial/full repayment, legacy debt + payroll liability aggregation, due-day overdue state, and invalid repayment inputs. It was not executed in this audit.
- Missing edge coverage: tiny-principal rounding; loaded state where `lastAccrualDay === dueDay` but status remains active; save/load migration; and reconciliation of loan/payroll liabilities across ledger, cash flow, P&L and balance sheet. `accrueDay()` returns early for same-day accrual before it re-evaluates overdue status, so test restored inconsistent state explicitly.
- No runtime code changed. Node and browser tests were not run due lack of a repository checkout/runtime in this pass. Do not claim these tests passed without execution.


## 2026-10-19 implementation checkpoint — smart shop copy

- Corrected inaccurate smart-shop explanatory copy in `js/economy.js`: package rounding can slightly exceed the 150%-of-demand stock target; the code does not block a package to zero. No stock logic, price, recipe, or target changed.
- Added `tests/shop_materials.test.js` for 3 stock/demand cases and 2 copy assertions.
- Targeted isolated runtime evaluation of exact `materialPlan()` source: 3/3 cases passed; copy/test-source assertions 4/4 passed. Node test file and full regression/browser suites remain unrun.
- Commits: `f4d7aa17e961874849274a14956b7da2ea92bc66` (code), `9d35d0a34f8b2213a2e4dbf831b7a88e69b45c9d` (test).
- Next: run the Node test and repository suites in a real checkout, audit finance/accounting cross-reconciliation, continue source-backed commodity evidence. No main-branch changes.


## 2026-10-19 finance edge-case fix

- Fixed `accrueDay()` so a restored active loan already at/past due day is marked overdue before the same-day accrual early return. Added a regression case to `tests/finance.test.js`.
- Targeted isolated runtime checks against exact repository `finance.js`: 3/3 passed (loan lifecycle, legacy liability aggregation, restored due-day state). The Node test file/full suite remain unrun.
- Commits: `01b474afcf27ce6c9e7a85a3dbf7fa59ca8073bc`, `0e9ce330a19a69380d6ac48a60f30967dba915ed`.
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


## 2026-10-19 branch audit — finance commits after checkpoint

- Reconstructed the five commits after `95e2a3be880ccbf75620e4bd42490489c010cac6`; latest branch HEAD at audit start was `c6c035f86320299629bdc2916f9478ff3c6a770a`. The commits add handoff notes, loan lifecycle tests, legacy debt aggregation and its test, then update the status ledger.
- Test source covers loan origination, daily interest, repeated same-day accrual, partial/full repayment, legacy debt + payroll liability aggregation, due-day overdue state, and invalid repayment inputs. It was not executed in this audit.
- Missing edge coverage: tiny-principal rounding; loaded state where `lastAccrualDay === dueDay` but status remains active; save/load migration; and reconciliation of loan/payroll liabilities across ledger, cash flow, P&L and balance sheet. `accrueDay()` returns early for same-day accrual before it re-evaluates overdue status, so test restored inconsistent state explicitly.
- No runtime code changed. Node and browser tests were not run due lack of a repository checkout/runtime in this pass. Do not claim these tests passed without execution.


## 2026-10-19 implementation checkpoint — smart shop copy

- Corrected inaccurate smart-shop explanatory copy in `js/economy.js`: package rounding can slightly exceed the 150%-of-demand stock target; the code does not block a package to zero. No stock logic, price, recipe, or target changed.
- Added `tests/shop_materials.test.js` for 3 stock/demand cases and 2 copy assertions.
- Targeted isolated runtime evaluation of exact `materialPlan()` source: 3/3 cases passed; copy/test-source assertions 4/4 passed. Node test file and full regression/browser suites remain unrun.
- Commits: `f4d7aa17e961874849274a14956b7da2ea92bc66` (code), `9d35d0a34f8b2213a2e4dbf831b7a88e69b45c9d` (test).
- Next: run the Node test and repository suites in a real checkout, audit finance/accounting cross-reconciliation, continue source-backed commodity evidence. No main-branch changes.
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


## 2026-10-19 branch audit — finance commits after checkpoint

- Reconstructed the five commits after `95e2a3be880ccbf75620e4bd42490489c010cac6`; latest branch HEAD at audit start was `c6c035f86320299629bdc2916f9478ff3c6a770a`. The commits add handoff notes, loan lifecycle tests, legacy debt aggregation and its test, then update the status ledger.
- Test source covers loan origination, daily interest, repeated same-day accrual, partial/full repayment, legacy debt + payroll liability aggregation, due-day overdue state, and invalid repayment inputs. It was not executed in this audit.
- Missing edge coverage: tiny-principal rounding; loaded state where `lastAccrualDay === dueDay` but status remains active; save/load migration; and reconciliation of loan/payroll liabilities across ledger, cash flow, P&L and balance sheet. `accrueDay()` returns early for same-day accrual before it re-evaluates overdue status, so test restored inconsistent state explicitly.
- No runtime code changed. Node and browser tests were not run due lack of a repository checkout/runtime in this pass. Do not claim these tests passed without execution.


## 2026-10-19 implementation checkpoint — smart shop copy

- Corrected inaccurate smart-shop explanatory copy in `js/economy.js`: package rounding can slightly exceed the 150%-of-demand stock target; the code does not block a package to zero. No stock logic, price, recipe, or target changed.
- Added `tests/shop_materials.test.js` for 3 stock/demand cases and 2 copy assertions.
- Targeted isolated runtime evaluation of exact `materialPlan()` source: 3/3 cases passed; copy/test-source assertions 4/4 passed. Node test file and full regression/browser suites remain unrun.
- Commits: `f4d7aa17e961874849274a14956b7da2ea92bc66` (code), `9d35d0a34f8b2213a2e4dbf831b7a88e69b45c9d` (test).
- Next: run the Node test and repository suites in a real checkout, audit finance/accounting cross-reconciliation, continue source-backed commodity evidence. No main-branch changes.


## 2026-10-19 finance edge-case fix

- Fixed `accrueDay()` so a restored active loan already at/past due day is marked overdue before the same-day accrual early return. Added a regression case to `tests/finance.test.js`.
- Targeted isolated runtime checks against exact repository `finance.js`: 3/3 passed (loan lifecycle, legacy liability aggregation, restored due-day state). The Node test file/full suite remain unrun.
- Commits: `01b474afcf27ce6c9e7a85a3dbf7fa59ca8073bc`, `0e9ce330a19a69380d6ac48a60f30967dba915ed`.


## Current checkpoint — 2026-10-19

- Current branch HEAD: `340826235c9260a0de56c0cf082f265dd150e5b2`; 15 commits ahead and 0 behind `95e2a3be880ccbf75620e4bd42490489c010cac6`.
- Added two targeted fixes and regression test source; exact-source isolated runtime checks passed. Node tests/full suite not run; no CI status checks were returned for the finance commits.
- Changed files vs checkpoint: handoff, status, `js/economy.js`, `js/finance.js`, `tests/finance.test.js`, `tests/shop_materials.test.js`.
- No main changes or economic/gameplay value changes. Next: real Node/browser validation, then accounting reconciliation.
