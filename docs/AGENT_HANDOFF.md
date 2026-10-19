# Agent Handoff — Agrotycoon
Updated 2026-10-17. Canonical branch: `fix/core-auto-warung-accounting-ui`. HEAD at writing: `95e2a3be880ccbf75620e4bd42490489c010cac6`.
Repo: https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator

## Owner rules — mandatory
- Work ONLY on the feature branch. Do not change default/main. Inspect branch head and files before edits; update branch with expected-SHA guard; verify commit/files after every change.
- Simulation engine first. No Supabase/backend until local frontend, data pipeline, accounting and tests are accepted.
- Never fabricate historical prices, production/yield, input costs, freight, land suitability, disaster statistics or policy. Unknown values remain null/unknown.
- Label sourced observations, derived/calibrated parameters, game-only assumptions, and simulated events separately. Preserve source, period/date, geography, commodity, market stage, value/unit, retrieval metadata, quality status and licensing.
- Do not combine producer/wholesale/retail/factory prices or incompatible units. Never call stale snapshots “live”.
- In-game events are simulation, not real news. Live alerts may be shown separately and must not automatically become game events.
- Responses to owner: Indonesian, direct, precise, detailed; report changed files, commit SHA, tests actually run, failures/limitations, and next task. Never claim tests pass without executing them.

## Direction
Agrotycoon is intended as an Indonesia-focused micro-economic/agriculture/commodity-chain simulator. Core loop: land/regional suitability -> seeds/inputs/labor/capital -> crop/livestock stages -> harvest -> storage/spoilage -> processing/byproducts -> transport/routes -> producer/collector/wholesale/direct/retail/factory markets -> contracts/sales -> cashflow/profit/balance sheet -> progression/unlocks -> regional shocks and policy response.
Longer-term: full Tier 1–4 commodity workflows (the owner's reference book is not in this repository; do NOT guess tier definitions), rule-based NPCs with budgets/inventory/goals/contracts, data-grounded AI mentors/consultants, and government policy/programs based on verified rules. AI advice must disclose calculations, assumptions and sources; NPCs should change simulation state, not be decorative chatbots.

## Implemented (verified by repo inspection)
- Static browser/local-save game; pages include game, stock, accounting, assets/staff, progression, credit, commodity market, world simulation, historical import, achievements, and separate BMKG alert page.
- Core files: `js/state.js`, `data.js`, `economy.js`, `day.js`, `game.js`, `ui.js`, `land.js`, `progression.js`, `staff.js`, `finance.js`, `commodities.js`, `market_chain.js`, `market_prices.js`, `real_economic_data.js`, `world_simulation.js`.
- Local staff hiring/payroll and unpaid wage liability; credit eligibility, disbursement, daily interest on remaining principal, partial/full repayment, overdue status.
- Daily reports separate gross/expense and cashIn/cashOut/net cashflow. Accounting shows estimated assets and recorded liabilities.
- Catalogue has 60 commodity entries, but many values are game balancing parameters, not verified historical data. Market chain has a few examples; missing stages remain null.
- World simulation v0.1.0 covers 5 regions and 4 crops. Event odds/impacts/inventory/production/demand are experimental; its indices are not wired to all actual player transactions.
- Local CSV/JSON import supports common delimiters and Indonesian numeric formats; it is not automated bulk ETL.
- No Supabase.

## Recent commits
- `b508b8dc6fe06834b0f4806cf97278bff94b5949`: payroll settlement change.
- `78066f60487056475afd23448dad049e36f013bf`: accrued interest enters daily expense and ledger as non-cash.
- `95e2a3be880ccbf75620e4bd42490489c010cac6`: credit UI no longer calls interest “flat”; says 1.5% per 30 days on remaining principal, accrued daily.
Latest: https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/commit/95e2a3be880ccbf75620e4bd42490489c010cac6

## Real-data status — do not overstate
Existing status ledger counted 8 food-price points (2026-03), 5 subsidized-fertilizer HET points (2025-10-22), 3 feed points (2026-09), 17 live-cattle producer prices (snapshot 2026-10-14), and 14 toll segment tariffs. That is 33 food/input/animal price points plus 14 transport entries, NOT thousands of historical observations. Verify registry before repeating counts.
Sources to ingest: Bapanas monthly producer https://data.badanpangan.go.id/datasetpublications/5jb/rata-rata-harga-pangan-bulanan-produsen-provinsi ; consumer https://data.badanpangan.go.id/datasetpublications/sw6/rata-rata-harga-pangan-bulanan-konsumen-provinsi ; BPS agriculture producer price statistics; SIMPONI Ternak https://simponiternak-v1.pertanian.go.id/harga-komoditas.php ; SPORA https://simpakan.ditjenpkh.pertanian.go.id/spora/backend/web/site/data-harga ; BNPB https://data.bnpb.go.id/dataset/data-bencana-indonesia ; BMKG climate data. Preserve raw files, provenance, license, normalized records, checksum and row-level validation report.

## Completion estimate (planning estimate, not measured)
- Local frontend/basic playable loop: 55–65% of MVP.
- Finance/accounting/progression integration: 35–45%.
- Causal world engine: 15–25%.
- Historical data ingestion/coverage: 5–10% of target.
- AI mentor/NPC/government: 0–5%.
- Tier 1–4 detailed commodity workflows: 10–20%; exact tier taxonomy blocked until owner’s book is found.
- Whole intended engine: roughly 20–30%. Do not present as nearly finished.

## Backlog, in order
P0 correctness:
1. Rerun tests on current HEAD. Add finance tests: disbursement -> accrual -> partial repayment -> full repayment -> overdue; assert ledger, day expense, cashflow, liabilities and balance sheet; include small principal rounding and due-date boundaries.
2. Audit payroll arrears, legacy `finance.debt`, wealth/progression and liabilities for double-counting.
3. Test reports/save migrations/mobile/browser workflows; don't claim browser E2E without running it.

P1 real data:
4. Implement reproducible bulk ETL for Bapanas producer/consumer, BPS price/production, SIMPONI cattle history, SPORA feed history, fertilizer prices, BNPB disaster data and relevant BMKG climate data.
5. Measure accepted/rejected/duplicate/missing counts and coverage by period, region, commodity, market level and unit. Never invent missing values.
6. Add provenance/freshness/quality UI; historical series must stay separated by market stage.

P2 commodities:
7. Retrieve owner's reference book for exact Tier 1–4 meanings. If unavailable, mark blocked and ask owner for the file.
8. Define canonical per-commodity schema: suitable region/soil/climate, seed/breed, input bill of materials, tasks, duration/stages, labor/equipment, yield/quality, loss/storage, processing/byproducts, capex/working capital, buyers, units/prices, transport, risk and source references.
9. Complete one source-backed vertical slice end-to-end before expanding all commodities.

P3 world engine:
10. Wire player harvest/purchases/storage/processing/sales to regional inventory, production, demand, shipments, spoilage and price.
11. Test one route and 3–5 commodities with sourced costs/time. Unknown cost must be shown unknown, not silently zero.
12. Add one disaster family with exposure + crop stage + damage + recovery + price response + causal audit; deterministic replay and stock-conservation tests.
13. Expand regions/events only after calibration/held-out validation.

P4 agents/government:
14. Rule-based NPCs first (farmer, collector, wholesaler, retailer, processor, transporter, lender, extension officer, regulator) with budgets, inventory, goals, offers, contracts and deterministic decisions.
15. Mentor/consultant advice from actual game state + sourced data, showing calculation and uncertainty.
16. Government subsidies/procurement/extension/tax/permits/disaster response only from verified rules, otherwise clearly marked game scenarios.

P5 product:
17. Audit every unlock/action path, navigation, mobile layout, local save/new game/migration, stock/accounting/assets/payroll/credit end-to-end.
18. Only after local engine acceptance, design backend/Supabase and monetization.

## Resume protocol
Read this file, `docs/IMPLEMENTATION_STATUS_2026-10-17.md`, `docs/HISTORICAL_DATA_CONTRACT.md`, and `docs/WORLD_SIMULATION_ENGINE.md`; then inspect actual branch HEAD and relevant files. This note can lag code: confirm HEAD. Make small commits, test them, update status ledger. Owner's reference book for Tier 1–4 is missing from repo/context.


## Audit follow-up — five commits after recorded checkpoint (2026-10-19)

Current branch HEAD at audit: `c6c035f86320299629bdc2916f9478ff3c6a770a`. The five commits after the recorded `95e2a3be880ccbf75620e4bd42490489c010cac6` checkpoint are:

1. `c275eee165a54704428760c804c3ae562a6cb4d8` — add agent handoff and owner rules/status/backlog.
2. `7106a7e143dfdcca24fa2a175b01281f30c99211` — add `tests/finance.test.js` for loan lifecycle.
3. `88de624b9120b62bb3c31b8d583d5ee7ab64c46c` — include legacy `finance.debt` in credit obligation summary.
4. `64691151ef52c42e35860db940a6f82af3a2afff` — extend finance test for legacy debt/payroll liability aggregation.
5. `c6c035f86320299629bdc2916f9478ff3c6a770a` — document liability audit/test coverage.

Review findings:
- The new tests cover origination, interest accrual, idempotence within a day, partial/full repayment, legacy debt/payroll aggregation, overdue status on the due day, and input validation.
- The test source has not been executed during this audit. Do not report it as passing based solely on the test code.
- Still missing explicit tests for tiny-principal rounding boundaries, state restoration with `lastAccrualDay === dueDay` while status is active, cashflow/P&L/balance-sheet cross-reconciliation, and save/load migration. The due-date transition currently happens after the early return for same-day accrual, so restored inconsistent loan state needs a regression test.
- `totalDebt()` sums active/overdue loan principal and interest, payroll payable and legacy debt. Confirm no separate accounting aggregator counts the same legacy debt twice before claiming balance-sheet consistency.
- No game code changed in this audit; only documentation records this audit.
- Environment limitation: repository checkout/runtime is unavailable here, so the Node test and browser suite were not executed in this pass.


## Shop recommendation copy correction — 2026-10-19

- Audited the manual/smart shop code in `js/economy.js`. `materialPlan()` targets 150% of estimated demand, subtracts current stock, then rounds the deficit up to full package sizes (ice 40 portions, sugar 50 portions, cups 20 pieces).
- Found stale UI copy claiming a package would be locked to zero if it exceeded the 150% cap. That is not what the code does: package rounding can leave stock slightly above the target. Corrected the copy to disclose this behavior, without changing the purchase algorithm, package prices, target ratio, or stock quantities.
- Changed: `js/economy.js`; added `tests/shop_materials.test.js` for empty stock, above-target stock, partial stock and the copy contract.
- Targeted isolated runtime evaluation of the exact `materialPlan()` function passed 3 cases, and 4 copy/test-source assertions passed. The committed Node test file itself has NOT been run in Node; no full game/browser tests were run.
- Commits: code `f4d7aa17e961874849274a14956b7da2ea92bc66`; test `9d35d0a34f8b2213a2e4dbf831b7a88e69b45c9d`.
- Next: run `node tests/shop_materials.test.js` and existing regression suites in a real repository checkout; then continue accounting cross-reconciliation and commodity research. No changes to `main`.
# Agent Handoff — Agrotycoon
Updated 2026-10-17. Canonical branch: `fix/core-auto-warung-accounting-ui`. HEAD at writing: `95e2a3be880ccbf75620e4bd42490489c010cac6`.
Repo: https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator

## Owner rules — mandatory
- Work ONLY on the feature branch. Do not change default/main. Inspect branch head and files before edits; update branch with expected-SHA guard; verify commit/files after every change.
- Simulation engine first. No Supabase/backend until local frontend, data pipeline, accounting and tests are accepted.
- Never fabricate historical prices, production/yield, input costs, freight, land suitability, disaster statistics or policy. Unknown values remain null/unknown.
- Label sourced observations, derived/calibrated parameters, game-only assumptions, and simulated events separately. Preserve source, period/date, geography, commodity, market stage, value/unit, retrieval metadata, quality status and licensing.
- Do not combine producer/wholesale/retail/factory prices or incompatible units. Never call stale snapshots “live”.
- In-game events are simulation, not real news. Live alerts may be shown separately and must not automatically become game events.
- Responses to owner: Indonesian, direct, precise, detailed; report changed files, commit SHA, tests actually run, failures/limitations, and next task. Never claim tests pass without executing them.

## Direction
Agrotycoon is intended as an Indonesia-focused micro-economic/agriculture/commodity-chain simulator. Core loop: land/regional suitability -> seeds/inputs/labor/capital -> crop/livestock stages -> harvest -> storage/spoilage -> processing/byproducts -> transport/routes -> producer/collector/wholesale/direct/retail/factory markets -> contracts/sales -> cashflow/profit/balance sheet -> progression/unlocks -> regional shocks and policy response.
Longer-term: full Tier 1–4 commodity workflows (the owner's reference book is not in this repository; do NOT guess tier definitions), rule-based NPCs with budgets/inventory/goals/contracts, data-grounded AI mentors/consultants, and government policy/programs based on verified rules. AI advice must disclose calculations, assumptions and sources; NPCs should change simulation state, not be decorative chatbots.

## Implemented (verified by repo inspection)
- Static browser/local-save game; pages include game, stock, accounting, assets/staff, progression, credit, commodity market, world simulation, historical import, achievements, and separate BMKG alert page.
- Core files: `js/state.js`, `data.js`, `economy.js`, `day.js`, `game.js`, `ui.js`, `land.js`, `progression.js`, `staff.js`, `finance.js`, `commodities.js`, `market_chain.js`, `market_prices.js`, `real_economic_data.js`, `world_simulation.js`.
- Local staff hiring/payroll and unpaid wage liability; credit eligibility, disbursement, daily interest on remaining principal, partial/full repayment, overdue status.
- Daily reports separate gross/expense and cashIn/cashOut/net cashflow. Accounting shows estimated assets and recorded liabilities.
- Catalogue has 60 commodity entries, but many values are game balancing parameters, not verified historical data. Market chain has a few examples; missing stages remain null.
- World simulation v0.1.0 covers 5 regions and 4 crops. Event odds/impacts/inventory/production/demand are experimental; its indices are not wired to all actual player transactions.
- Local CSV/JSON import supports common delimiters and Indonesian numeric formats; it is not automated bulk ETL.
- No Supabase.

## Recent commits
- `b508b8dc6fe06834b0f4806cf97278bff94b5949`: payroll settlement change.
- `78066f60487056475afd23448dad049e36f013bf`: accrued interest enters daily expense and ledger as non-cash.
- `95e2a3be880ccbf75620e4bd42490489c010cac6`: credit UI no longer calls interest “flat”; says 1.5% per 30 days on remaining principal, accrued daily.
Latest: https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/commit/95e2a3be880ccbf75620e4bd42490489c010cac6

## Real-data status — do not overstate
Existing status ledger counted 8 food-price points (2026-03), 5 subsidized-fertilizer HET points (2025-10-22), 3 feed points (2026-09), 17 live-cattle producer prices (snapshot 2026-10-14), and 14 toll segment tariffs. That is 33 food/input/animal price points plus 14 transport entries, NOT thousands of historical observations. Verify registry before repeating counts.
Sources to ingest: Bapanas monthly producer https://data.badanpangan.go.id/datasetpublications/5jb/rata-rata-harga-pangan-bulanan-produsen-provinsi ; consumer https://data.badanpangan.go.id/datasetpublications/sw6/rata-rata-harga-pangan-bulanan-konsumen-provinsi ; BPS agriculture producer price statistics; SIMPONI Ternak https://simponiternak-v1.pertanian.go.id/harga-komoditas.php ; SPORA https://simpakan.ditjenpkh.pertanian.go.id/spora/backend/web/site/data-harga ; BNPB https://data.bnpb.go.id/dataset/data-bencana-indonesia ; BMKG climate data. Preserve raw files, provenance, license, normalized records, checksum and row-level validation report.

## Completion estimate (planning estimate, not measured)
- Local frontend/basic playable loop: 55–65% of MVP.
- Finance/accounting/progression integration: 35–45%.
- Causal world engine: 15–25%.
- Historical data ingestion/coverage: 5–10% of target.
- AI mentor/NPC/government: 0–5%.
- Tier 1–4 detailed commodity workflows: 10–20%; exact tier taxonomy blocked until owner’s book is found.
- Whole intended engine: roughly 20–30%. Do not present as nearly finished.

## Backlog, in order
P0 correctness:
1. Rerun tests on current HEAD. Add finance tests: disbursement -> accrual -> partial repayment -> full repayment -> overdue; assert ledger, day expense, cashflow, liabilities and balance sheet; include small principal rounding and due-date boundaries.
2. Audit payroll arrears, legacy `finance.debt`, wealth/progression and liabilities for double-counting.
3. Test reports/save migrations/mobile/browser workflows; don't claim browser E2E without running it.

P1 real data:
4. Implement reproducible bulk ETL for Bapanas producer/consumer, BPS price/production, SIMPONI cattle history, SPORA feed history, fertilizer prices, BNPB disaster data and relevant BMKG climate data.
5. Measure accepted/rejected/duplicate/missing counts and coverage by period, region, commodity, market level and unit. Never invent missing values.
6. Add provenance/freshness/quality UI; historical series must stay separated by market stage.

P2 commodities:
7. Retrieve owner's reference book for exact Tier 1–4 meanings. If unavailable, mark blocked and ask owner for the file.
8. Define canonical per-commodity schema: suitable region/soil/climate, seed/breed, input bill of materials, tasks, duration/stages, labor/equipment, yield/quality, loss/storage, processing/byproducts, capex/working capital, buyers, units/prices, transport, risk and source references.
9. Complete one source-backed vertical slice end-to-end before expanding all commodities.

P3 world engine:
10. Wire player harvest/purchases/storage/processing/sales to regional inventory, production, demand, shipments, spoilage and price.
11. Test one route and 3–5 commodities with sourced costs/time. Unknown cost must be shown unknown, not silently zero.
12. Add one disaster family with exposure + crop stage + damage + recovery + price response + causal audit; deterministic replay and stock-conservation tests.
13. Expand regions/events only after calibration/held-out validation.

P4 agents/government:
14. Rule-based NPCs first (farmer, collector, wholesaler, retailer, processor, transporter, lender, extension officer, regulator) with budgets, inventory, goals, offers, contracts and deterministic decisions.
15. Mentor/consultant advice from actual game state + sourced data, showing calculation and uncertainty.
16. Government subsidies/procurement/extension/tax/permits/disaster response only from verified rules, otherwise clearly marked game scenarios.

P5 product:
17. Audit every unlock/action path, navigation, mobile layout, local save/new game/migration, stock/accounting/assets/payroll/credit end-to-end.
18. Only after local engine acceptance, design backend/Supabase and monetization.

## Resume protocol
Read this file, `docs/IMPLEMENTATION_STATUS_2026-10-17.md`, `docs/HISTORICAL_DATA_CONTRACT.md`, and `docs/WORLD_SIMULATION_ENGINE.md`; then inspect actual branch HEAD and relevant files. This note can lag code: confirm HEAD. Make small commits, test them, update status ledger. Owner's reference book for Tier 1–4 is missing from repo/context.


## Audit follow-up — five commits after recorded checkpoint (2026-10-19)

Current branch HEAD at audit: `c6c035f86320299629bdc2916f9478ff3c6a770a`. The five commits after the recorded `95e2a3be880ccbf75620e4bd42490489c010cac6` checkpoint are:

1. `c275eee165a54704428760c804c3ae562a6cb4d8` — add agent handoff and owner rules/status/backlog.
2. `7106a7e143dfdcca24fa2a175b01281f30c99211` — add `tests/finance.test.js` for loan lifecycle.
3. `88de624b9120b62bb3c31b8d583d5ee7ab64c46c` — include legacy `finance.debt` in credit obligation summary.
4. `64691151ef52c42e35860db940a6f82af3a2afff` — extend finance test for legacy debt/payroll liability aggregation.
5. `c6c035f86320299629bdc2916f9478ff3c6a770a` — document liability audit/test coverage.

Review findings:
- The new tests cover origination, interest accrual, idempotence within a day, partial/full repayment, legacy debt/payroll aggregation, overdue status on the due day, and input validation.
- The test source has not been executed during this audit. Do not report it as passing based solely on the test code.
- Still missing explicit tests for tiny-principal rounding boundaries, state restoration with `lastAccrualDay === dueDay` while status is active, cashflow/P&L/balance-sheet cross-reconciliation, and save/load migration. The due-date transition currently happens after the early return for same-day accrual, so restored inconsistent loan state needs a regression test.
- `totalDebt()` sums active/overdue loan principal and interest, payroll payable and legacy debt. Confirm no separate accounting aggregator counts the same legacy debt twice before claiming balance-sheet consistency.
- No game code changed in this audit; only documentation records this audit.
- Environment limitation: repository checkout/runtime is unavailable here, so the Node test and browser suite were not executed in this pass.


## Shop recommendation copy correction — 2026-10-19

- Audited the manual/smart shop code in `js/economy.js`. `materialPlan()` targets 150% of estimated demand, subtracts current stock, then rounds the deficit up to full package sizes (ice 40 portions, sugar 50 portions, cups 20 pieces).
- Found stale UI copy claiming a package would be locked to zero if it exceeded the 150% cap. That is not what the code does: package rounding can leave stock slightly above the target. Corrected the copy to disclose this behavior, without changing the purchase algorithm, package prices, target ratio, or stock quantities.
- Changed: `js/economy.js`; added `tests/shop_materials.test.js` for empty stock, above-target stock, partial stock and the copy contract.
- Targeted isolated runtime evaluation of the exact `materialPlan()` function passed 3 cases, and 4 copy/test-source assertions passed. The committed Node test file itself has NOT been run in Node; no full game/browser tests were run.
- Commits: code `f4d7aa17e961874849274a14956b7da2ea92bc66`; test `9d35d0a34f8b2213a2e4dbf831b7a88e69b45c9d`.
- Next: run `node tests/shop_materials.test.js` and existing regression suites in a real repository checkout; then continue accounting cross-reconciliation and commodity research. No changes to `main`.


## Finance edge-case correction — restored overdue loan state (2026-10-19)

- Targeted isolated runtime evaluation of exact `js/finance.js` exposed a bug: `accrueDay()` returned on `lastAccrualDay >= S.day` before marking an active loan overdue when a restored state already sat on/past `dueDay`.
- Fixed ordering: for active/overdue loans, set overdue status when `S.day >= dueDay` before the same-day accrual guard; interest remains idempotent and is not accrued twice.
- Added regression block to `tests/finance.test.js` for an active loan with `dueDay === S.day` and `lastAccrualDay === S.day`.
- Exact-source isolated runtime checks passed 3/3: loan lifecycle, legacy liability aggregation, and restored due-day state; the new regression assertion is present. The Node test file itself and full suite have not been executed in Node.
- Commits: fix `01b474afcf27ce6c9e7a85a3dbf7fa59ca8073bc`; test `0e9ce330a19a69380d6ac48a60f30967dba915ed`.
- Next: run Node finance/shop tests and full regression/browser suites in a real checkout, then reconcile balance sheet/P&L/cash flow and save migration. No main changes.
