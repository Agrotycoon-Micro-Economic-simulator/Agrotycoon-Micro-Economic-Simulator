## Latest continuation — first real Node CI run and fixture correction (2026-10-17)

- GitHub Actions run [39031033605](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/39031033605) successfully checked out the branch and used Node.js 22, but failed immediately in `tests/household_inventory_accounting.test.js`: fixture began with one rice package while the assertion expected a purchase to leave one package. This was a test-fixture contradiction, not a production-code failure.
- Fixed the fixture to begin with zero rice stock so `buyLivingItem("rice")` must add exactly one package. Fix commit: `9ff852adf89d86a1fdce077ad4ffe109fa703eef`.
- A second workflow run is pending/in progress; do not claim the suite passes until its conclusion and per-test output are inspected. Local clone remains blocked by DNS in this environment. Browser E2E remains outstanding. Keep `main` and owner-validated coconut values untouched.

---

## Latest continuation — executable regression CI setup (2026-10-17)

- Added `.github/workflows/targeted-regression.yml` on `feat/production-tier-taxonomy`. It runs the committed Node regression scripts for household inventory accounting, double-entry transactions, accounting ledger rendering, household stock consumption, finance, payroll accounting and harvest validation under Node.js 22.
- Workflow commit: `8f0a914d247d2027ee9f6dd0a5eae230e7ddb33c`. The local checkout attempt still fails because this environment cannot resolve `github.com`; therefore the test scripts have not been executed locally from a real checkout.
- Next: check whether GitHub Actions starts for this commit; report the actual workflow conclusion before treating the test suite as passed. Browser E2E is still not run. Keep `main` untouched and do not change owner-validated coconut values.

---

# Agent Handoff — Agrotycoon

## Latest verified continuation checkpoint — household package-stock consumption (2026-10-17)

- Active branch `feat/production-tier-taxonomy`; starting HEAD `be279efaed2270f57bad3d1721c1cd51d7fe08f9`. Never modify `main`; its HEAD at start was `612451c03be59dd8cacd3b13adb8a79a46e51be2`. Owner-validated coconut prices/yield data remain untouched.
- Implemented package-stock consumption in `js/day.js`: rice, egg, oil, mie, tempe, sayur and lauk consume one package after the existing `DATA.living[key].period` number of use-days. Progress resets after consumption; empty stock does not become negative or accumulate a fake consumption timer. Automatic shopping now buys only when the corresponding package stock reaches zero, preventing scheduled purchases from piling up while stock remains.
- Added `livingUseDays` to fresh saves and backward-compatible initialization for older saves in `js/state.js`. Existing `livingStock` quantities are preserved; no stock is reset or inferred from past purchases. Manual and automatic restocking reset the use timer only when stock was empty (`js/economy.js`, `js/day.js`).
- Added `tests/living_stock.test.js` for legacy saves without progress maps, rice/egg package duration, repeat consumption, empty stock, non-stock utilities and negative legacy quantities.
- Verification: syntax parsing passed for changed modules and test source; helper runtime scenarios passed in an isolated V8 harness. This is not a checkout-based `node tests/living_stock.test.js` run or browser E2E.\n- Follow-up verification correction: the consumption helper now writes the normalized nonnegative integer quantity back to `S.livingStock`, so negative legacy values are actually clamped to zero (not merely treated as zero for one calculation). The isolated runtime check includes this case.\n
- Accounting limitation: household purchases are still posted as cash expenses at purchase time. This change adds stock quantities/consumption but does not yet switch household journal entries to debit household inventory and recognize kitchen expense on consumption. Cash-flow policy when mandatory auto-purchases exceed available cash also remains unresolved.
- Next: obtain a repository checkout/Node runtime and run `node tests/living_stock.test.js`, payroll/finance tests and the existing accounting/harvest suite; then align household inventory valuation and expense recognition with the owner's double-entry rules. Do not change coconut values or create branches.


---

## Latest verified continuation checkpoint — payroll accounting + household-stock audit (2026-10-17)

- Work branch: `feat/production-tier-taxonomy`; prior verified HEAD `5dc48a2ab815d0f514f37911895f981424f817c2`. Keep `main` untouched and do not change owner-validated coconut data/prices.
- Payroll accounting: `js/economy.js` now classifies paid wages as debit Beban Gaji / credit Kas. `js/staff.js` records unpaid wages as debit Beban Gaji / credit Utang Gaji on a noncash basis, and arrears repayments as debit Utang Gaji / credit Kas. Unpaid wage ledger amounts now carry the expense value while `basis: noncash` keeps them out of cash reconciliation.
- Added `tests/payroll_accounting.test.js` for paid wages, accrued unpaid wages and partial arrears repayment. Actual fetched runtime modules passed these scenarios in an isolated V8 harness; the new test source and modified modules were syntax-parsed. This is not a repository-checkout Node test run.
- `livingStock` audit across `js/state.js`, `js/day.js`, `js/economy.js`, `js/ui.js`, `js/data.js`, `js/akuntansi.js`, and `stock.html`: the field is initialized/migrated in state; automatic purchases increment it; `buyLivingItem()` increments it; no decrement/consumption reference was found in the audited files. `DATA.living` declares periods (rice 10, egg 5, oil 30, mie 3, tempe 2, sayur 1, lauk 2 days), but `finishDay()` hardcodes intervals for most items and rice checks only stock <= 0. Consequently the counter is not a validated inventory balance; rice can fail to restock after the initial stock, while other scheduled purchases can accumulate without consumption. Purchases are booked as cash expenses when bought, not when consumed.
- No living-stock behavior was changed in this pass because legacy saves contain counters that have never been decremented; silently interpreting/resetting them would invent a migration/consumption rule. Next: define backward-compatible stock consumption semantics using the existing `period` contract and test legacy saves before modifying the behavior. Full Node suite/browser E2E still need a real checkout; clone previously failed due DNS.


---

## Latest verified continuation checkpoint — financing journal metadata (2026-10-17)

- Work branch: `feat/production-tier-taxonomy`; starting HEAD was `eedb7db27315c1dcd87a4dfb7affa4e10648031e`. No branch was created, `main` was not modified, and validated coconut-price/benchmark data was not changed.
- Updated `js/finance.js`: loan disbursement posts debit Kas / credit Utang Pinjaman; accrued interest posts debit Beban Bunga / credit Utang Bunga with `basis: noncash`; repayments split debits between Utang Bunga and Utang Pinjaman and credit Kas. Multi-line debit/credit totals are equal.
- Updated `js/akuntansi.js` to render multi-line posting accounts and line-level debit/credit details. Noncash interest remains excluded from cash reconciliation while still classified as an expense.
- Updated `tests/finance.test.js` to assert balanced loan origination, interest accrual, and repayment postings. The test source was syntax-parsed and the corresponding runtime scenarios were executed in an isolated V8 harness using the fetched module. This is **not** a run of `node tests/finance.test.js` in a repository checkout.
- Isolated runtime checks passed: Rp5,000,000 disbursement increases cash without increasing operating revenue; Rp2,500 interest accrual is noncash and does not alter cash movement; Rp100,000 repayment reduces cash and splits Rp2,500 interest plus Rp97,500 principal into balanced debits against Kas credit. Accounting renderer showed Utang Pinjaman, Beban Bunga, Utang Bunga, and cash reconciliation (opening Rp30,000,000, closing Rp34,900,000).
- Limitations: full checkout-based Node suite and browser E2E remain unrun because the previous clone attempt failed on DNS. Other legacy finance/payroll ledger rows may still lack explicit posting metadata; inventory consumption/COGS and household stock-consumption behavior remain separate unfinished tasks.
- Next: run the finance and accounting test files in a real Node checkout when available; then continue the `livingStock` audit (purchase cadence vs consumption) without inventing a meal schedule. Keep owner-validated coconut data locked.


---

## Latest verified continuation checkpoint — double-entry accounting (2026-10-17)

**Re-fetch branch HEAD before further edits.** The branch was verified as `feat/production-tier-taxonomy`, with no branch creation and no changes to `main`. Code/test sequence ended at `ad804fff71710b6405918ce3c6f3859e9993acb8`; the implementation-status documentation update then committed as `ebd4419c6ae6a41dab255129df3f41599d2dae18`. This handoff update itself creates another commit, so never assume this is still the live HEAD.

Owner's required daily accounting pattern:
- Cash sale: debit **Kas**, credit **Penjualan**.
- Business raw-material purchase (ice/sugar/plastic or coconut bought for resale): debit **Pembelian Bahan Baku**, credit **Kas**.
- Household food/kitchen purchase: debit **Beban Dapur**, credit **Kas**.
- Other personal/household purchase: debit **Beban Pribadi**, credit **Kas**.
- Every new cash posting should have equal debit and credit; `S.gold`, cash-in and cash-out must update at transaction time.
- Example acceptance case: opening cash Rp1,000,000 + sale Rp400,000 − business purchase Rp50,000 − kitchen spending Rp62,000 = closing cash Rp1,288,000. Business transaction subtotal before household expense = Rp350,000; kitchen cost is displayed separately as Rp62,000.

Code changes made:
- `js/state.js`: ledger supports optional `accounting` metadata; old entries remain loadable.
- `js/economy.js`: `spend()` and `earn()` now attach balanced debit/credit records and classifications. Food keys from `DATA.living` map to kitchen; electricity/pulsa/personal fuel/bath-laundry map to personal. `BELANJA` maps to raw-material purchases, `TENAGA` to labor expense, and `CAPEX` to an asset/capital account.
- `js/akuntansi.js`: journal exposes debit/credit accounts and amounts; monthly view separates sales, raw-material purchases, other business expenses, kitchen, other personal costs, business subtotal before household costs, after-household subtotal, and cash reconciliation. Known noncash event categories are excluded from cash movement.
- `tests/accounting_ledger.test.js`: updated to assert the worked example, separated kitchen costs, balanced entries and closing cash.
- `tests/double_entry_transactions.test.js`: added to exercise `earn()`/`spend()` and assert cash + postings.
- `docs/IMPLEMENTATION_STATUS_2026-10-17.md`: accounting checkpoint in commit `ebd4419c6ae6a41dab255129df3f41599d2dae18`; isolated V8 verification evidence updated in commit `09c9629a1be6799ffcfc84dec19e463e7e106cdc`.

**Test status:** the two committed Node test files were not run as test files from a checkout, and GitHub combined status for `ad804fff71710b6405918ce3c6f3859e9993acb8` returned no status checks. A targeted isolated V8 harness did execute the fetched current `js/economy.js` transaction functions and `js/akuntansi.js` renderer: syntax checks passed for the four changed runtime files plus both tests; the sample sale Rp400,000 + purchase Rp50,000 + kitchen Rp62,000 yielded closing cash Rp1,288,000, cash-in Rp400,000, cash-out Rp112,000, and all three entries had equal debit/credit. The renderer showed `Beban Dapur`, the Rp350,000 business subtotal, cash reconciliation, and the double-entry journal. This is limited harness evidence, **not** a checkout-based test-suite run or browser E2E.

Known limitations that must remain visible:
1. This is a first double-entry transaction layer, not a complete accrual accounting engine. Purchases are currently recorded in the purchase account at purchase time; actual inventory consumption, cost layers, consumption-based COGS, spoilage write-offs, depreciation and complete noncash postings are not yet integrated. The “hasil usaha” subtotal is therefore not a fully reconciled accrual net profit.
2. Legacy transactions without accounting metadata are inferred only for recognizable categories/food descriptions; uncertain entries stay unclassified.
3. Cash reconciliation uses recognized ledger cash movements and needs regression tests against loan disbursement/repayment and noncash interest.
4. Business utility costs still need explicit attribution to each business unit; household electricity/pulsa/fuel/bath-laundry must not be reclassified as business utility without evidence.
5. No developer-investment payment or dividend flow is implemented. If added later, the owner specified 0.001% = 0.00001, not 0.1%; eligible base, distribution period, payment verification, timing and rounding are unresolved.

**Next task, in order:** re-fetch branch HEAD and docs; obtain a checkout/Node runtime; run `node tests/accounting_ledger.test.js` and `node tests/double_entry_transactions.test.js`; fix any failures and document exact results. Then test noncash interest and loan cash movements. After those pass, design consumption-based inventory/COGS and business-unit utility attribution. Do not touch `main`, do not create branches without permission, and update both status/handoff docs after each work unit.

Updated 2026-10-17 (tier taxonomy pass). Active work branch: `feat/production-tier-taxonomy`, based on `fix/core-auto-warung-accounting-ui`. Never modify `main`.
Repo: https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator


> **CURRENT CHECKPOINT (2026-10-17; read before any work)**
>
> - Repository: `Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator`.
> - Active branch at checkpoint creation: `feat/production-tier-taxonomy`; verified pre-documentation-update HEAD: `0beaab144af1fe7fd22e6d34ba3de61e6e25b1a3` ([commit](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/commit/0beaab144af1fe7fd22e6d34ba3de61e6e25b1a3)). This documentation refresh itself will create a newer commit, so **always fetch the live branch HEAD before resuming** and do not assume the embedded baseline is still the latest SHA.
> - Branches observed: exactly 3 — `main` = `612451c03be59dd8cacd3b13adb8a79a46e51be2`; `fix/core-auto-warung-accounting-ui` = `c6c035f86320299629bdc2916f9478ff3c6a770a`; `feat/production-tier-taxonomy` = `0beaab144af1fe7fd22e6d34ba3de61e6e25b1a3`. No branch was created during this work. Never modify `main`.
> - Other-agent branch audit: recent commits on `fix/core-auto-warung-accounting-ui` cover legacy debt aggregation, payroll liability, interest accrual, daily cash-flow reporting, market price stages and documentation. Compare reported this branch 59 commits ahead and 0 behind; re-check compare if either branch moves.
> - Harvest affordability fix: `js/economy.js`, commit `2d0ed8ed580e99db9cdb00cfb99221441f00b51b`. Yield/cost/cash are validated before harvest dates, stock and expenses mutate. Test file: `tests/economy_harvest.test.js`; localStorage mock/harness documentation commit: `699de05b986a189344d1579c9cf0399d4fa7d8ba`.
> - Accounting journal: `js/akuntansi.js` commit `d3830be63dc3da05392f668f0d40b2a4c00f802b` adds a journal for up to 200 latest ledger entries, including household `HIDUP` expenses and escaped details. Regression test `tests/accounting_ledger.test.js` was added in `b77a5e098558ec06d427114bfa9d03701e34e300`; it has **not been run**.
> - Test evidence: 3 harvest scenarios passed in an isolated V8 harness using fetched `state.js` + `economy.js`: insufficient cash has no side effects; exact affordability posts one harvest/labor expense; zero yield has no side effects. Test file syntax was checked. Nine prior tests passed in an isolated harness at parent HEAD `7dd6d4511922f17497f777af82bbdd2537cbf2be`. **No checkout-based Node suite or browser E2E has been run.** A Git clone attempt previously failed due DNS.
> - Architecture gap: `S.stock` (coconut stock/age) and `S.warung` (ice/sugar/cups plus business flags) remain legacy state stores. `js/commodity_transformation.js` is planning-only; live purchase/harvest/process/sale flows are not connected. Do not add a second inventory map until canonical-source and backward-compatible save-migration semantics are designed.
> - Cash/accounting audit (owner clarification 2026-10-17): household food and daily necessities are mandatory costs; the food/side-dish mix varies. Starting household is one person, no partner/employees, with Rp5,000,000. `finishDay()` books automatic living costs with `spend()` and may drive cash negative. The accounting page now renders a transaction journal, but low-cash treatment remains unresolved; do not invent an overdraft/payable rule. `livingStock` is initialized and incremented but no consumption decrement was found in inspected `state.js`/`day.js`, so do not claim the household food-consumption model is complete. Continue auditing call sites and reports.
> - Current code/test baseline before this documentation refresh: `b77a5e098558ec06d427114bfa9d03701e34e300` (test added; not executed). Status ledger update commit: `998b2890fdc3939ab0daf8212a3a372ad9060f53`. This handoff refresh will create the next commit; re-fetch live HEAD after it.
> - Next task: audit all `livingStock` references and report/ledger behavior, establish whether food is represented as purchases, daily consumption, or both, and add regression tests for the selected model. Do not invent a meal/side-dish schedule beyond the owner's stated variable daily food costs. Resolve low-cash treatment from existing contracts or ask the owner if still ambiguous. Then design canonical inventory migration with quantity/unit, quality/age, acquired day, cost basis/source and provenance before transaction integration. Update this checkpoint and ledger after every work unit.
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


## Owner accounting requirements (2026-10-17)

- Separate business gross/operating result from household living costs. Food and side-dish spending belongs in a dedicated `DAPUR`/kitchen expense category and must be rolled up monthly; household electricity, water, phone, personal fuel, and bath/laundry costs must remain distinguishable from utilities attributable to a business unit.
- Monthly report must show revenue, direct/business costs, business result before household expenses, itemized household/kitchen costs, other personal costs, and final residual/after-household cash result. Monthly cash movement must reconcile opening cash + cash inflows − all cash outflows = closing cash. Loans and developer special-investment deposits are financing, not sales revenue. Example figures Rp4m gross, Rp100k–Rp500k business costs, Rp1.5m kitchen costs are illustrative only.
- Owner clarified developer special-investment dividend rate is 0.001% (= decimal 0.00001), not 0.1%. This is a future design requirement only. Before implementation, define eligible investment base, distribution period, payment verification, timing, and rounding.
- Current `day.js` records food and personal utility-like items under `HIDUP`; `spend()` aggregates all costs in `dayLog.expense/cashOut`. A label change alone will not fix accounting. Add explicit expense classification and monthly rollups without double-counting or breaking existing saves.

## Owner clarification and accounting constraints (2026-10-17)

- Harvest labor: Rp500 per harvested coconut (`DATA.laborPerFruit` already equals 500). Record total labor once as harvested quantity × Rp500.
- Starting cash: Rp5,000,000. Starting household is one person living alone; no partner or employees are present initially.
- Daily food and necessities are mandatory living costs that must appear in accounting; the food/side-dish mix changes the daily amount. They are not optional purchases to skip when cash is low. `js/day.js::finishDay()` currently uses `spend()` and may drive cash negative; do not change this into a payable/overdraft model without a contract or owner decision.
- Future real-money game-currency purchases, once payment-verified and implemented, are a special developer investment into the paying account, not operating sales revenue or a loan. Owner specifies very small dividends. This is a future design constraint only, not an implemented payment/dividend system.

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


## Owner chain tier standard (2026-10-17)
- `js/commodity_tier_chain.js` is the owner's commercial chain model: Tier 1 producer/raw; Tier 2 collector/first distributor/market; Tier 3 retail/Warung Madura/lapak and santan; Tier 4 finished dishes/manufactures including rendang, cakes, coconut oil, coconut-milk dishes and finished bath soap.
- Keep this separate from `js/production_tiers.js` school/major taxonomy. Never copy prices between stages; numeric prices require source, period, geography and unit. Unknown values remain null.
- Preserve owner coconut price Rp13,000/butir; public data is contextual only. Details and references: `docs/COMMODITY_CHAIN_TIER_STANDARD.md`.


## Tier 4 residue recovery and coconut routes — 2026-10-17
- Owner defines two additional Tier 4 coconut routes: (1) santan heated for hours to produce coconut-only oil; (2) viable unsaleable-for-consumption coconut nuts raised as seedlings in pots. These are different outputs with different recipes, yields, safety/viability checks and cost ledgers.
- Owner land constraint: 37 tree capacity, 30 occupied, 7 free tree slots; seedling pots about 0.5 m apart. Treat as owner design input, not agronomic validation or proof of pot capacity.
- Apply a residue-recovery schema across all commodities, but only monetize safe, feasible by-products with evidence of demand. Record Tier 1 input IDs, yield, process labor/energy, losses, packaging, transport, capacity and provenance; unknowns stay null. Waste input is not automatically free.
- Docs and mapping updated in `docs/COMMODITY_CHAIN_TIER_STANDARD.md` and `js/commodity_tier_chain.js`. Tests updated/added; not executed in this environment. No coconut prices or `js/data.js` values changed. No Supabase; `main` untouched.


## Generic commodity transformation engine — 2026-10-17

- Added `js/commodity_transformation.js`, a dependency-free planner for multi-input recipes, primary outputs, by-products, explicit waste outputs, process-cost lines, batch capacity and inventory-shortage checks.
- Physical quantities, saleable output prices and required process costs may remain unknown (`null`). Unknown quantities block execution; unknown costs/prices block a complete economic result. No missing cost, yield or residual sale value is silently converted to zero.
- By-products do not generate revenue unless explicitly marked saleable and accompanied by price evidence (source, period, geography and evidence kind). Waste is represented separately from recoverable by-products. Owner-verified values, sourced observations and game parameters must remain explicitly identified in evidence.
- Added `tests/commodity_transformation.test.js` with synthetic-only fixture values. These are unit-test values, not commodity prices, recipes or real-world yields.
- Loaded the engine in `index.html` for future use. This pass does not yet wire the planner to player purchase/harvest/processing/sale transactions, mutate save inventory, or post ledger entries. Integration remains the next task after transaction interfaces are mapped.
- Verification must distinguish isolated execution of fetched source from a repository checkout; no full browser E2E claim is made.


## Transaction-boundary audit and transformation safety hardening — 2026-10-17

- Inspected current transaction functions in `js/economy.js`: harvest and external coconut purchase update legacy `S.stock`; es-kelapa sales decrement `S.stock` and separate `S.warung` consumables; tengkulak/market sales clear `S.stock`. These flows write directly to the ledger/cash totals and do not yet use a canonical generic commodity inventory.
- The current save has no generic commodity inventory map. A direct retrofit that duplicates `S.stock` or `S.warung` would risk double counting and save-state divergence; do not wire transformation execution into these paths until inventory lots, quality/age, and migration semantics are defined.
- Hardened the planner: execution eligibility now requires an explicit inventory snapshot, and waste cannot be marked as a saleable output. Known optional cost lines are included when calculating the total; unknown required costs still block the result.
- Isolated V8 execution of fetched `js/commodity_transformation.js` and its committed test passed. This is not a repository checkout, full test-suite run, or browser E2E.

## Latest continuation update — 2026-10-17

- The active branch remains `feat/production-tier-taxonomy`; no branch was created. At the start of this repair, HEAD was `0d0645169986782b46af02c5e75de0a087bc0699`. Keep `main` untouched.
- Added generic transformation planner foundation and then hardened inventory/provenance checks. Isolated V8 execution of its fetched committed test passed; no repository checkout or browser E2E is claimed.
- A path audit found that the four files `docs/AGENT_HANDOFF.md`, `docs/COMMODITY_CHAIN_TIER_STANDARD.md`, `docs/IMPLEMENTATION_STATUS_2026-10-17.md`, and `tests/commodity_tier_chain.test.js` had their contents shifted into the wrong paths. Their existing content is being restored to the correct paths; run the Tier-chain test after repair.
- Inventory integration is not complete: `S.stock` and `S.warung` are still separate legacy stock stores. Design a single-source-of-truth migration before routing live transactions through the generic engine.


## Finance test follow-up — 2026-10-17

- The isolated finance test revealed an incorrect assertion, not yet a confirmed code defect: it expected a Rp1 partial payment to fail, although the finance API rejects only non-positive or over-due amounts and allows small positive partial payments.
- The test now asserts rejection for zero and negative amounts. Do not add an arbitrary minimum repayment without an owner-approved game rule. Re-run finance test after this commit.


## Latest P0 continuation checkpoint — harvest affordability (2026-10-17)

- Active branch remains `feat/production-tier-taxonomy`; no new branch. Parent HEAD for this unit: `7dd6d4511922f17497f777af82bbdd2537cbf2be`. Never modify `main`.
- Audit finding: legacy `harvest()` updated `t.lastHarvest` before calculating/validating affordability and called `spend()` even when `S.gold < labor cost`. This could make cash negative and consume the harvest cycle without a valid funded harvest.
- Fix: validate finite positive yield, finite non-negative labor cost, and available cash before mutating tree harvest dates; then record labor expense and add stock.
- Added `tests/economy_harvest.test.js`; its VM context mocks localStorage. The three harvest scenarios passed in an isolated V8 run of fetched `state.js` + `economy.js`; this does not run the committed test file under Node. Must run `node tests/economy_harvest.test.js` and full suite from a real checkout before claiming repo-level test success.
- Current inventory integration remains incomplete: legacy `S.stock` and `S.warung` are separate stores. Do not create a second inventory map or migrate saves until one canonical source of truth and backward-compatibility behavior are designed.
- Current verified test matrix from previous HEAD `7dd6d4511922f17497f777af82bbdd2537cbf2be`: 9/9 committed test files passed in isolated V8 with mocked Node APIs/polyfilled `structuredClone`; this is not checkout-based execution.
- Latest branch audit: exactly 3 branches: `main` at `612451c03be59dd8cacd3b13adb8a79a46e51be2`, `fix/core-auto-warung-accounting-ui` at `c6c035f86320299629bdc2916f9478ff3c6a770a`, and this branch. Other branch's recent commits through `c6c035f` cover credit liabilities, payroll, cash-flow reports, and price-stage chain; it is 59 commits behind this feature branch and contains no unique changes according to the compare result.
- Next: run the harvest regression test; audit other calls to `spend()` for missing affordability checks vs intentional debt/mandatory expense semantics; then design and test canonical inventory migration before transaction integration.


## Next agent: cash affordability and inventory migration — 2026-10-17

- Before any edits, fetch the live branch head and compare it with the SHA recorded here. Active branch is still `feat/production-tier-taxonomy`; exactly three branches were observed in the latest audit. Never create another branch or modify `main` without explicit owner approval.
- Harvest bug is fixed and isolated-scenario-tested: `2d0ed8ed580e99db9cdb00cfb99221441f00b51b`; the regression test is `tests/economy_harvest.test.js`; harness fix/mock is in `699de05b986a189344d1579c9cf0399d4fa7d8ba`.
- Cash audit found `js/day.js::finishDay()` can spend automatic household/utility/monthly costs even when cash is insufficient. Do not decide unilaterally whether this means skip purchase, negative cash, or accrued household payable. Inspect the UI/accounting contract and ask owner only if the intended rule cannot be established from existing project records.
- Do not add a parallel inventory balance. Legacy `S.stock` and `S.warung` remain the current source of truth. Define migration semantics for quantity, units, quality/age, acquired day, cost basis, and provenance before connecting Tier 4 processing.
- Verification so far: nine existing test files passed in isolated V8 on parent HEAD `7dd6d4511922f17497f777af82bbdd2537cbf2be`; harvest scenarios passed in an isolated V8 harness on fetched committed source. These are not repository checkout tests or browser E2E. Clone failed earlier due DNS. Run `node tests/economy_harvest.test.js` and the full test suite in a real checkout when possible.


## Household inventory accounting integration — 2026-10-17

- Implemented on `feat/production-tier-taxonomy`; `main` was not modified and owner-validated coconut data/prices were not changed.
- `js/economy.js`: purchases of the seven configured food packages now post Dr **Persediaan Rumah Tangga** / Cr **Kas** and remain cash outflows, but are not recognized as kitchen expense at purchase time. Other household items remain personal expenses.
- `js/day.js`: when the existing configured use-period consumes a package, post Dr **Beban Dapur** / Cr **Persediaan Rumah Tangga** as a balanced noncash entry. This adds expense once and does not add a second cash outflow.
- `js/akuntansi.js`: separates current-period household inventory purchases from kitchen expense and includes household package stock in current assets. Valuation uses each package's current `DATA.living[key].price` as a proxy because historical lot costs are not stored; do not describe this as historical-cost valuation.
- Added `tests/household_inventory_accounting.test.js` for purchase capitalization, cash reconciliation, period-based stock decrement, balanced consumption posting and noncash consumption.
- Targeted isolated V8 harness: syntax parsing passed for `js/economy.js`, `js/day.js`, `js/akuntansi.js`, and the new test source. Runtime assertions passed for the purchase/consumption lifecycle (purchase Rp65,000; closing cash Rp935,000 from Rp1,000,000; one Dr Beban Dapur / Cr Persediaan Rumah Tangga entry; cash outflow counted once). This is **not** a `node tests/household_inventory_accounting.test.js` run from a repository checkout or browser E2E.
- Code/test commits: `4b8dcd23acb768c718e11da7722d3380da4f1170` (purchase capitalization), `e44a238159b4c6fc5baca801579451ecf12f830b` (consumption posting), `c1d0c5445f4277fb09b02ab7a3e9261fa8e5cadb` (statements), `d20e18acde7dde3905feade6fcbba4d6116a0ac1` (regression test).
- Remaining: run the new test and existing accounting/living-stock/finance tests in a real checkout; run browser E2E. Mandatory automatic purchases can still drive cash negative; policy on unpaid household necessities remains unresolved and was not changed.


- Follow-up validation on 2026-10-17: corrected the new household inventory test to call the real `buyLivingItem('rice')` path, including stock addition, then consumption. Updated `tests/double_entry_transactions.test.js` to expect food purchases to debit Persediaan Rumah Tangga (consumption is tested separately).
- Rechecked syntax parsing for `js/economy.js`, `js/day.js`, `js/akuntansi.js`, and the three relevant test files. Isolated V8 scenarios passed for purchase/consumption, balanced noncash posting, cash reconciliation, and legacy stock period consumption.
- GitHub reported no commit status checks and no workflow runs for the checkpoint commit; `.github/workflows` was not found at the feature branch. These checks are not substitutes for running the Node test files in a repository checkout. Browser E2E remains unrun.
