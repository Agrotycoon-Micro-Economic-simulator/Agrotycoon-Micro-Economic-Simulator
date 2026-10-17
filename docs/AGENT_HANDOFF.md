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
- Production-tier metadata is defined in `js/production_tiers.js` (Tier 1 raw, Tier 2 semi-processed, Tier 3 industrial, Tier 4 national specialization); school buffs 0/10/15/20% are blueprint design values. `js/market_chain.js` remains a separate market-stage model. See `docs/PRODUCTION_TIERS.md`.
- `js/unit_economics.js` now provides a provenance-aware unit-economics calculator. It distinguishes bought inputs, own production cost, integrated-chain accounting and opportunity-adjusted value; provenance is tracked for recipe quantity and relevant prices, and fixed costs/assets support `stand`, `upstream`, or `chain` scope. Missing required numeric inputs block a result. It is not yet integrated into every UI or transaction path. Contract and benchmark: `docs/UNIT_ECONOMICS_AND_BUSINESS_MODEL_CONTRACT.md`.
- `js/real_economic_data.js` now includes 46 official annual coconut producer/consumer price observations for 2002–2024 (23 years × 2 market stages), sourced from the Ministry of Agriculture Pusdatin coconut outlook and attributed there to BPS/Susenas. These are national historical prices for unhusked coconut in Rp/butir, not current local quotes. The rest of the catalogue still contains game balancing parameters and the registry is nowhere near thousands of observations.
- World simulation v0.1.0 covers 5 regions and 4 crops. Event odds/impacts/inventory/production/demand are experimental; its indices are not wired to all actual player transactions.
- Local CSV/JSON import supports common delimiters and Indonesian numeric formats; it is not automated bulk ETL.
- No Supabase.

## Recent commits
- `b508b8dc6fe06834b0f4806cf97278bff94b5949`: payroll settlement change.
- `78066f60487056475afd23448dad049e36f013bf`: accrued interest enters daily expense and ledger as non-cash.
- `95e2a3be880ccbf75620e4bd42490489c010cac6`: credit UI no longer calls interest “flat”; says 1.5% per 30 days on remaining principal, accrued daily.
Recent current-branch work:
- `d0a88226c340304ed488d43ba5bd1f98c23231d5`: added 46 official annual coconut producer/consumer price observations.
- `6c9c0482f4282ab36a2d6b4bf6ca5befdb8eddab`: separated stand and upstream fixed costs/capex in unit economics.
- Latest status-ledger update at that point: https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/commit/b4a61342102dd306475a8a0ab584eeb59de6262c

## Real-data status — do not overstate
The curated registry contains 8 food-price points (2026-03), 5 subsidized-fertilizer HET points (2025-10-22), 3 feed points (2026-09), 17 live-cattle producer prices (snapshot 2026-10-14), and 46 annual coconut producer/consumer price points (2002–2024). Total: 79 commodity/input price records plus 14 toll-segment entries. This is NOT thousands of historical observations. Verify registry before repeating counts.
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
7. Production-tier taxonomy is documented in `docs/PRODUCTION_TIERS.md`; do not repeat the old claim that the reference book is missing. Unit economics contract is in `docs/UNIT_ECONOMICS_AND_BUSINESS_MODEL_CONTRACT.md`. Es-kelapa owner benchmark is documented in `docs/ES_KELAPA_OWNER_BENCHMARK.md`. The listed non-coconut consumables subtotal is now Rp1,200/glass (ice 500 + syrup allowance 400 + cup 300), not full HPP. Preserve owner direct whole-coconut price Rp13,000, glass price Rp5,000, four glasses per coconut, no milk. Next: confirm actual gula merah grams used per 1 L Tupperware, then map buy-from-farmer, buy-from-collector, own-orchard and mixed strategies using sourced data and explicitly unknown values.
8. Wire the new calculator to actual es-kelapa model state and business UI only after reconciling costs and sales-volume semantics; test that monthly profit/cashflow and internal transfer accounting agree.
9. Define canonical per-commodity schema: suitable region/soil/climate, seed/breed, input bill of materials, tasks, duration/stages, labor/equipment, yield/quality, loss/storage, processing/byproducts, capex/working capital, buyers, units/prices, transport, risk and source references.
10. Complete one source-backed vertical slice end-to-end before expanding all commodities.

P3 world engine:
11. Wire player harvest/purchases/storage/processing/sales to regional inventory, production, demand, shipments, spoilage and price.
12. Test one route and 3–5 commodities with sourced costs/time. Unknown cost must be shown unknown, not silently zero.
13. Add one disaster family with exposure + crop stage + damage + recovery + price response + causal audit; deterministic replay and stock-conservation tests.
14. Expand regions/events only after calibration/held-out validation.

P4 agents/government:
15. Rule-based NPCs first (farmer, collector, wholesaler, retailer, processor, transporter, lender, extension officer, regulator) with budgets, inventory, goals, offers, contracts and deterministic decisions.
16. Mentor/consultant advice from actual game state + sourced data, showing calculation and uncertainty.
17. Government subsidies/procurement/extension/tax/permits/disaster response only from verified rules, otherwise clearly marked game scenarios.

P5 product:
18. Audit every unlock/action path, navigation, mobile layout, local save/new game/migration, stock/accounting/assets/payroll/credit end-to-end.
19. Only after local engine acceptance, design backend/Supabase and monetization.

## Latest unit-economics status
- New test files: `tests/unit_economics.test.js` and `tests/real_economic_data.test.js`. Both committed tests passed when executed against fetched committed sources in an isolated V8 harness with Node API stubs; the unit-economics test also passed in a scratch Node v22.16.0 harness using equivalent local copies. Neither test was run from a repository checkout. Existing finance/world-simulation tests and browser E2E were not run; do not claim full test-suite success.
- Static inspection of the committed coconut series found 46 unique year/stage rows (23 producer + 23 consumer), 2002–2024, with 2024 values Rp3,422 and Rp6,061 per coconut.
- Es-kelapa benchmark correction: `js/data.js` now uses cup price Rp15,000/50 (Rp300 each), aligned with the existing starter-pack configuration and current marketplace comparisons. Listed non-coconut subtotal = Rp500 ice + Rp400 syrup allowance + Rp300 cup = Rp1,200/glass. It excludes coconut and other operating costs; do not call it complete HPP. See `docs/ES_KELAPA_OWNER_BENCHMARK.md`.

## Resume protocol
Read this file, `docs/IMPLEMENTATION_STATUS_2026-10-17.md`, `docs/HISTORICAL_DATA_CONTRACT.md`, and `docs/WORLD_SIMULATION_ENGINE.md`; then inspect actual branch HEAD and relevant files. This note can lag code: confirm HEAD. Make small commits, test them, update status ledger. Owner's Tier 1–4 definitions are in Library `data game.docx` and have been transcribed to `docs/PRODUCTION_TIERS.md`; the Library's market-price table uses a separate market-stage axis.

## Latest owner benchmark correction
- Added `docs/ES_KELAPA_OWNER_BENCHMARK.md` and `tests/es_kelapa_benchmark.test.js`.
- `js/data.js` now preserves owner standards: direct whole coconut Rp13,000, es kelapa Rp5,000/glass, four glasses/coconut, no milk; syrup batch allowance Rp20,000/50 glasses; cup pack Rp15,000/50.
- Corrected listed non-coconut consumables subtotal = Rp1,200/glass. Online cup prices are comparison evidence only, not a verified owner supplier invoice. Sugar batch cost remains provisional until actual gula merah grams per 1 L Tupperware are known. Water and cooking fuel remain excluded.
- `tests/es_kelapa_benchmark.test.js` passed when the committed test and `js/data.js` were fetched from GitHub and executed in an isolated V8 harness with Node API stubs. This is not a checked-out repository run. Before further integration, run `node tests/es_kelapa_benchmark.test.js` plus unit economics and core tests in a real checkout.

## Latest P0 correctness work — 2026-10-17

- `js/finance.js` now creates collision-resistant loan IDs using a timestamp plus a monotonic sequence, and checks existing loan records before accepting an ID.
- `tests/finance.test.js` includes a same-timestamp regression test verifying two loans receive distinct IDs and both liabilities remain counted.
- Latest status note is in `docs/IMPLEMENTATION_STATUS_2026-10-17.md`.
- Validation limitation: cloning the branch into the runtime failed because github.com DNS resolution was unavailable. The committed Node test has not been executed from a repository checkout. A reviewer/next agent must run `node tests/finance.test.js` and `node tests/world_simulation.test.js` from a checkout before claiming these tests pass.
- Continue with P0 finance correctness audit (rounding and due-day boundaries), then stock/transaction integration. Do not switch focus to es-kelapa recipe tuning. Never modify `main`.


## Branch audit — 2026-10-17 follow-up

- Repository branches observed: `main` at `612451c03be59dd8cacd3b13adb8a79a46e51be2`, `fix/core-auto-warung-accounting-ui` at `c6c035f86320299629bdc2916f9478ff3c6a770a`, and `feat/production-tier-taxonomy` at `b360ba966c8455f99f6bf9e095d404cf8be4d00b`. Do not modify `main`.
- The Tier branch is the active continuation branch; it contains the prior credit/UI work plus later production-tier, unit-economics, coconut historical-price, es-kelapa benchmark, and loan-ID collision fixes. Confirm branch HEAD again before any future write.
- GitHub reports the same repository bot account/name/email as author for the inspected commit history. Commit messages and SHAs can be audited, but the actual human/agent behind that shared identity cannot be reliably inferred from Git metadata.
- Library inconsistency: `data game.docx` page 192 lists Tier 4 examples as technology, electronics, and weapons; page 199 lists technology, heavy equipment, and clean energy, and puts electronics under Tier 3. Current code follows the page-199 national-production table as a provisional canonical list. Do not silently resolve this contradiction; request owner confirmation before classifying disputed examples.
- `docs/PRODUCTION_TIERS.md` now records the conflict. The metadata/test remain definition-level only; recipes, yield, input/output ratios, costs and empirical profitability are still not implemented.
- Audit scope: three extant branches and 228 visible commits in the Tier branch history were inspected through GitHub API pagination; repository API author attribution is shared, not per-agent. No pull requests were returned by the connected PR search. Test execution limits remain as documented above.


## Owner market-stage rule — 2026-10-17 follow-up

- Owner-provided field prices are authoritative and immutable. In the coconut market-chain reference, farmer-to-tengkulak is now recorded as Rp3,400/butir with evidence type `owner_verified_field_price`; direct sale of a whole coconut to the customer remains Rp13,000/butir.
- Preserved the existing Rp5,000 collector sourcing price as a `game_parameter` from `js/data.js`; it is not relabeled as a verified field observation.
- Added separate `processorPurchase` and `retailConsumer` stages. The collector-to-es-kelapa/santan purchase price stays null until supported by a matching transaction observation. National final-consumer data must not be substituted for a business's raw-material purchase price.
- Added `tests/market_chain_contract.test.js` to protect these rules. It has been committed but not executed in a real Node checkout; do not claim it passed.
- Latest market-chain changes are on `feat/production-tier-taxonomy`; verify branch HEAD before the next write. Continue P0 finance rounding/due-day audit after this market-stage contract, then transaction/inventory integration. Never modify `main`.


## Finance rounding hardening — 2026-10-17
- Current change on `feat/production-tier-taxonomy`: daily loan-interest accrual carries fractional rounding remainder instead of independently rounding every day's fraction. Newly originated loans initialize `interestRemainder`; legacy saved loans without the field default to zero at calculation time.
- Added a focused small-principal/30-day/due-date/idempotence regression test in `tests/finance.test.js`. This is a code change only to credit calculation and its tests; no coconut prices or commodity data are modified.
- Verification status for this change: tests have not yet been executed in a repository checkout. Run `node tests/finance.test.js` and the full available test suite before treating this as verified. Review accounting treatment of fractional interest if loan repayment/closure semantics are changed later.


## Owner instruction — coconut market-stage protection (2026-10-17)

- Never edit or overwrite the owner's coconut business price data without explicit owner approval.
- Rp13,000/butir is the owner's final-consumer lapak price for the whole-coconut product packaged in plastic for the stated medicinal-use context. It is not a farmer, collector, wholesale, or national survey price.
- Keep the stages separate: farmer → collector; collector → market (owner-described ~Rp5,000); market → consumer (owner-described Rp6,000+); owner's direct lapak → consumer (Rp13,000).
- National market surveys may observe consumer-market prices. They must not substitute for farmer-to-collector purchases, processor input costs, or the owner's direct business price.
- Compare prepared es-kelapa against prepared drinks sold by comparable lapak/food-service businesses, not farmgate/raw-coconut commodity prices.
- Owner-verified prices are immutable in code and ETL; external observations must be separate records with explicit period, geography, unit and market stage.
