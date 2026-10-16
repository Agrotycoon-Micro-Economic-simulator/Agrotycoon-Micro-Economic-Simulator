# Agent Handoff — Agrotycoon
Updated 2026-10-17 (tier taxonomy pass). Active work branch: `feat/production-tier-taxonomy`, based on `fix/core-auto-warung-accounting-ui`. Never modify `main`.
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
Longer-term: full Tier 1–4 commodity workflows. The owner's Library definitions have now been transcribed into `docs/PRODUCTION_TIERS.md` and implemented as metadata in `js/production_tiers.js`. Keep production-transformation tier separate from market channel/stage; rule-based NPCs with budgets/inventory/goals/contracts, data-grounded AI mentors/consultants, and government policy/programs based on verified rules. AI advice must disclose calculations, assumptions and sources; NPCs should change simulation state, not be decorative chatbots.

## Implemented (verified by repo inspection)
- Static browser/local-save game; pages include game, stock, accounting, assets/staff, progression, credit, commodity market, world simulation, historical import, achievements, and separate BMKG alert page.
- Core files: `js/state.js`, `data.js`, `economy.js`, `day.js`, `game.js`, `ui.js`, `land.js`, `progression.js`, `staff.js`, `finance.js`, `commodities.js`, `market_chain.js`, `market_prices.js`, `real_economic_data.js`, `world_simulation.js`.
- Local staff hiring/payroll and unpaid wage liability; credit eligibility, disbursement, daily interest on remaining principal, partial/full repayment, overdue status.
- Daily reports separate gross/expense and cashIn/cashOut/net cashflow. Accounting shows estimated assets and recorded liabilities.
- Production-tier metadata is now defined in `js/production_tiers.js` (Tier 1 raw, Tier 2 semi-processed, Tier 3 industrial, Tier 4 national specialization) with school buffs 0/10/15/20% as game-design values from the owner blueprint. `js/market_chain.js` remains a separate market-stage model. See `docs/PRODUCTION_TIERS.md`. Catalogue has 60 commodity entries, but many values are game balancing parameters, not verified historical data. Market chain has a few examples; missing stages remain null.
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
- Tier 1–4 detailed commodity workflows: still early/incomplete. Taxonomy is now transcribed and validated at metadata level; per-commodity recipes, sourcing, input/output ratios, prices and costs remain unimplemented.
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
7. Production-tier taxonomy is documented in `docs/PRODUCTION_TIERS.md`; do not repeat the old claim that the reference book is missing. Next: map one commodity end-to-end using explicit source-backed inputs/outputs, while keeping production tier and market stage separate.
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
Read this file, `docs/IMPLEMENTATION_STATUS_2026-10-17.md`, `docs/HISTORICAL_DATA_CONTRACT.md`, and `docs/WORLD_SIMULATION_ENGINE.md`; then inspect actual branch HEAD and relevant files. This note can lag code: confirm HEAD. Make small commits, test them, update status ledger. Owner's Tier 1–4 definitions are in Library `data game.docx` and have been transcribed to `docs/PRODUCTION_TIERS.md`; the Library's market-price table uses a separate market-stage axis.
