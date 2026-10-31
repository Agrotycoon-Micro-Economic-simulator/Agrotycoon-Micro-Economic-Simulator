# National Economy Research & Implementation Plan — Agrotycoon
Last updated: 2026-10-28
Active work branch: `feat/production-tier-taxonomy`

## Purpose
Turn Agrotycoon into a constrained, data-backed national microeconomic simulation. The simulation must link commodity prices, physical production capacity, land and labor, consumers, business types, supply chains, government policy, and political progression. Research is not complete when written in a report: validated data must be recorded in the research register and then represented in machine-readable runtime data with provenance and validation. Unverified values must remain explicitly provisional and must not silently become “real Indonesian statistics.”

## Mandatory repository rules for the next agent
1. Work only on the existing non-main feature branch `feat/production-tier-taxonomy` unless the owner explicitly authorizes another branch. Never write to `main`; do not create branches without permission.
2. At session start, check current branch names and latest commits, then inspect this plan, `docs/AGENT_HANDOFF.md`, `docs/COMMODITY_60_BULK_DATA_REGISTER.md`, `docs/COMMODITY_60_BULK_AUDIT.md`, `js/commodities.js`, `js/market_engine.js`, `js/region_capacity.js`, `js/background_economy.js`, `js/state.js`, `js/day.js`, `index.html`, market/accounting tests, and all relevant Library/blueprint documents. Do a targeted audit once; then implement rather than repeatedly auditing.
3. For each research unit, record the source URL, issuing institution, title, publication/release date, table/page, reference year/period, geography, units, product definition, stage, denominator, extraction method, arithmetic QA, uncertainty, and whether it is eligible for runtime use. Put the evidence in the register/audit and update the machine-readable runtime data in the same work item when the evidence is sufficiently compatible. Link the data row to its provenance; do not rely on prose alone.
4. Never invent or fill missing statistics to make a table look complete. Use `null`/status `research_required` for unknowns. Distinguish observed official data, owner-provided calibration, derived calculations, game-balance parameters, and unverified hypotheses.
5. After every meaningful code/research item, update this plan and `docs/AGENT_HANDOFF.md`. Report exact files, commits, tests actually run, failures and next task. Never claim tests passed if they were not run.
6. No map work (`peta.html`, `js/map_engine.js`, map UI/engine) without explicit permission. Keep map prototype non-authoritative.
7. Do not overwrite owner-specific coconut / es kelapa values with national averages.

## Existing implementation / known status as of this checkpoint
- `js/market_engine.js` exists on this branch. It validates a 60-item commodity catalog, requires a lower and upper market-price bound per commodity, and applies bounded price changes using aggregated buy/sell quantities and transaction VWAP. Current default price-change step is capped at 10%; default elasticity is 0.08. These are provisional game mechanics, not empirically calibrated coefficients.
- The market engine can aggregate a supplied transaction feed, but browser-local transactions are not a cross-player global market. A genuinely shared market requires a trusted server-authoritative ledger and common price snapshot, atomic settlement, unique/idempotent transaction IDs, authentication, anti-wash-trading controls, and multi-client tests.
- `js/background_economy.js` provides deterministic data-only NPC demand/supply flows for all 60 commodities, and a policy layer for production tax, input subsidy, import tariff, interest rate, logistics efficiency, and public food-reserve demand. NPCs are not required to be rendered as sprites. This is currently a local simulation fallback, not a global market.
- `js/region_capacity.js` constrains the simulation population and business capacity. Current design scenario: 5,000,000 background NPCs, at least 98% non-business population, at most 100,000 total business owners, and at most 100 mining operators. These are owner-requested game-scenario limits, NOT claims that official Indonesian business counts have those values. Current sector producer caps remain provisional pending official, unit-compatible research.
- The capacity module has official benchmarks: Indonesia rice harvested area in 2024 approximately 10.05 million hectares and oil-palm planted area in 2024 approximately 16.83 million hectares (provisional). Rice annual harvested area is not the same as unique physical land area; do not sum these metrics or use either as a generic total land area.
- The regional capacity module has `null` for land-use fields where compatible data have not yet been collected. Keep these null until supported by dated, defined sources.
- Handoff records that targeted isolated JavaScript harness checks passed 73 assertions for the market/background modules, catalog, NPC flows, policy effects, bounds, local/global status flags and political eligibility. This is NOT equivalent to executing the committed `node --test` suite or full browser/E2E gameplay. The committed Node test suite and browser flows still need to be run in a working checkout/CI.
- Recent commits on the repository include a market engine commit and a subsequent revert on the default branch after an accidental default-branch file change. Confirm current feature-branch contents and never reproduce writes on `main`.

## Non-negotiable economic modeling rules
### Separate HPP accounts
Never combine coconut HPP with cup, ice, syrup/sugar, water, fuel, or other input HPP. Maintain separate item IDs, quantities, unit costs, stock movements and consumption postings. Finished-goods HPP is calculated from actual consumed inputs and conversion/yield rules; it is not a sum of arbitrary “per-glass” costs that loses component identity. Purchases of inventory are cash outflows and inventory additions, not automatically expenses; recognize expense/HPP when inventory is consumed or goods are sold according to the accounting model.

Owner-provided coconut/es kelapa anchors (locked; correct calculations only, do not replace with macro averages):
- Whole coconut direct retail price: Rp13,000 per fruit.
- Es kelapa retail price: Rp5,000 per glass.
- Approximate yield: 4 glasses per coconut; no milk.
- Coconut procurement observation around Rp3,400 per fruit; another inventory example uses 200 fruits × Rp3,500 = Rp700,000.
- Harvest labor: Rp500 per fruit, recorded separately from the coconut inventory value.
- Syrup batch: approximately 1 litre, about 50 glasses; approximately one spoon per glass; current prototype cost assumption Rp20,000 per batch is provisional and excludes any inputs explicitly noted in `js/data.js`.
- Ice bag: current prototype Rp20,000 per 40 portions; plastic cup pack: Rp15,000 per 50 cups. Treat as existing prototype anchors requiring market-source QA, not universally valid national values.
These distinct cost objects must remain separate even while finished-goods prices move with the market.

### Commodity price floors/ceilings
- All 60 commodities must be present in the in-game catalog and visible market interface, each with a lower bound, upper bound, current price, unit, category, and data/provenance status.
- Do not use one generic bound multiplier as a final “real market” bound without explicit labeling. Current 50%-200% bounds are provisional balancing defaults until a commodity- and stage-matched source supports the range.
- A transaction should affect the relevant commodity only. Buy demand increases upward pressure; sell supply increases downward pressure. Price movement is bounded and gradual, and the engine must avoid allowing zero/negative prices or escaping floor/ceiling.
- Do not let one client locally change a claimed global price. Cross-player prices must be computed from a server-authoritative common transaction feed. Include NPC flows and player transactions once each; prevent double counting and wash-trading manipulation.

## NPC population and business limits
Use roles and activity as overlapping attributes, not mutually exclusive headcounts. A farmer can also be a worker and consumer. Track separately:
- unique population;
- household/income class;
- employment/occupation;
- producer/operator status;
- business ownership;
- active consumer status and consumption basket;
- age/working-age/labor availability where relevant;
- region and urban/rural status where evidence supports it.
For the owner-requested 5,000,000 NPC scenario, total business owners are capped at 100,000 and mining operators at 100. At least 4,900,000 NPCs are therefore non-business owners (98%). Do not describe the 98% parameter as an official Indonesian statistic. A general 80% minimum is weaker than this specific scenario and must not override it.
Do not create every NPC as a company. Most background NPCs are consumers/workers; producer capacity must be tied to land, workers, assets, production throughput, permits, finance, and regional demand.

## Research program: national food demand and the complete economy
Research and model Indonesia as a defined baseline geography first, with a clear year and time unit. Start with annual/monthly demand, then convert to daily flows only with explicit conversion assumptions. Do not mix food availability, household consumption, apparent consumption, production, harvested area, stocks, imports, exports, losses, and retail sales as if they were the same metric.

### A. National food balance, beginning with rice
For rice, then other staples and foods (corn/maize, soybeans, cassava, sweet potato, wheat/flour, sugar, cooking oil, eggs, chicken, beef/buffalo, fish, milk, vegetables, fruit, salt and other essential goods), collect:
- population and household/consumer base for the selected reference year;
- per-capita consumption with unit and period;
- national annual/monthly demand estimate and method;
- domestic production, yield, harvested/physical area distinction, harvest calendar and seasonal supply;
- stocks/reserves and losses where available;
- imports/exports and inter-island trade where available;
- producer/farmgate, wholesale, retail prices and market stage;
- costs/HPP, yields, input requirements, labor and capital where a matching study exists;
- regional breakdown, seasonality, data confidence and unresolved discrepancies.
Calculate national requirement from sourced population × sourced per-capita consumption (or use the official national requirement series if directly published). Record the formula, inputs and units. Reconcile supply balance only where categories and periods align. Do not invent a daily demand number by dividing an annual statistic without labeling the result as a derived average.

### B. Map the real supply chain and business population
For each selected food and later all 60 commodities, research and estimate with cited evidence:
- farms by type and scale, planted/harvested area, producers, output and seasonal capacity;
- livestock holdings, animal inventories, feed, mortality/cycle where sourced;
- fishery/aquaculture operators and output;
- food processors and factories;
- collectors/tengkulak, small traders, wholesalers, agents, distributors and logistics providers;
- traditional markets, modern markets, kiosks/warung, groceries, restaurants and food-service businesses;
- schools, hospitals, public institutions, military/prisons or other institutional buyers only where a reliable source and scope are available;
- employment by sector, working population, wages/income bands, household spending and active consumer counts;
- storage, cold-chain, ports, warehouses, roads, inter-island shipping and distribution losses;
- imports, exporters, state-owned enterprises and government procurement where relevant.
Define the unit for each entity: person, household, holding, legal business, outlet, establishment, facility, hectare, head of livestock, tonne/year, tonne/month, etc. Never equate “number of companies” with “number of locations,” “number of workers,” or “number of producers.”
Allocate supply-chain actors so the same physical quantity is not counted as new national production at every distribution stage. Traders and distributors move stock; they do not create additional primary output. Their margins and capacity affect price/distribution, but goods must be tracked as conserved quantities except for processing yields, spoilage, imports/exports, and documented losses.

### C. Land and production capacity by sector
For each region/sector, collect dated data for physical area, land use, yield, production and capacity. Separate rice annual harvested area from physical paddy area; separate plantation area from harvested area; separate livestock headcounts from farm counts; separate mining permits/operators/sites from land area; separate factory counts from capacity/production; separate markets and warungs as outlets rather than hectares unless an actual land-use measure is available.
Only derive hard caps when the official measure and game capacity unit can be linked transparently. If data cannot support a hard cap, retain a provisional game cap and mark it as such.

### D. Politics and state
Create a model of public policy and political progression after the market/production data contracts are stable:
- fiscal policy: taxes, subsidies, expenditure, deficit/debt and budget constraints;
- monetary/credit conditions: interest and financing availability (do not falsely claim a central bank can directly set every price);
- trade: tariffs, quotas, import/export rules and external price exposure;
- food policy: public procurement, reserves, release of stocks and targeted aid;
- infrastructure: transport cost, logistics time, storage and market access;
- regulatory limits: permits, environmental costs, labor rules and sector-specific licensing;
- politics: elections, parties/candidates, campaign finance, public approval, regional interests and policy trade-offs.
A player can qualify for national politics after a credible national-company progression threshold, but thresholds must be reconciled with the game's level/currency progression before UI implementation. Becoming president grants policy levers, not omnipotent price controls. Each policy needs causal effects, lag, budget costs, regional winners/losers, and measurable effects on demand/supply/investment/prices.

## Data architecture requirement: research and code together
For every researched commodity/sector, maintain a single stable ID and a machine-readable record (in the current catalog or a dedicated JSON data module) with fields comparable to:
```js
{
  id, name, category, unit, region, referenceYear,
  marketFloor, marketCeiling, marketPrice,
  priceStage, sourceType, sourceUrl, sourceTitle,
  sourceTablePage, sourceDate, dataStatus,
  annualDemand, annualProduction, imports, exports, stock,
  physicalLandHa, harvestedAreaHa, yieldPerHa,
  producerCount, businessCount, outletCount, workers,
  unitCost, outputPerCycle, cycleDays, capacity,
  uncertaintyNotes, derivedFrom, qaStatus
}
```
This is a schema proposal, not a claim that every field is already implemented. Fields that do not apply must be null or omitted with an explicit reason; do not manufacture data. For complex sector datasets, use linked tables with foreign keys to commodity/region/source IDs rather than duplicating inconsistent values.
Required evidence lifecycle:
1. Discover and capture the primary source.
2. Extract exact row values with page/table and units.
3. Run arithmetic and denominator checks.
4. Add the raw evidence to `docs/COMMODITY_60_BULK_DATA_REGISTER.md` or a relevant national/sector register.
5. Add quality decisions and unresolved issues to the audit document.
6. Add validated data to the runtime catalog/module with provenance/status in the same work item.
7. Add automated validation tests for count, uniqueness, units, floors/ceilings, nonnegative flows, conservation and arithmetic.
8. Update this plan and `docs/AGENT_HANDOFF.md`.
9. Run actual tests and report the exact commands/results. If no local runtime exists, state that and use CI only if available.

## Prioritized work queue (do not skip ahead)
### P0 — Validate and test the existing engine
- Confirm current feature-branch HEAD and inspect the latest diffs. Ensure the market engine, 60-item catalog, capacity module, background NPC module and tests are all on the intended feature branch.
- Run `node --test tests/background-economy.test.js tests/market-engine.test.js tests/accounting-inventory.test.js` in a local checkout or CI; fix syntax/test failures. Run browser smoke tests if available.
- Add tests for 5,000,000 NPCs, <=100,000 business owners, >=4,900,000 non-business owners, <=100 mining operators, and producer-capacity constraints.
- Verify each of the 60 commodities has a unique ID, unit, current price, floor, ceiling, and data-status label; validate floor <= current <= ceiling.
- Verify component HPP separation for coconut, ice, syrup/sugar, cups and water/fuel where applicable.
### P1 — National food-demand model
- Begin with rice. Capture official population, per-capita consumption/requirement, production, yield, physical/harvested area, seasonality, stocks, imports/exports and prices from compatible sources.
- Put sourced values in the register and runtime data together, including provenance. Add a reproducible formula and tests for annual demand and derived daily average.
- Continue through the food list in section A.
### P2 — Regional producer and outlet capacity
- Research producer/farm counts, land, output and yield by crop; holdings/heads/cycle for livestock; fishery; processing; mining; wholesale/retail; markets/warung; warehouses/logistics; schools and other institutional demand.
- Use official sources such as BPS, Ministry of Agriculture, Bapanas, Ministry of Trade, Ministry of Industry, Ministry of Energy and Mineral Resources, Ministry of Marine Affairs and Fisheries, Ministry of Education, and official provincial/district statistics. Prefer the exact table over snippets and cite the publication page plus table/page.
- Convert only compatible data to runtime capacities; preserve missing values as null.
### P3 — Shared global market
- Wire all actual player buy/sell operations into a server-authoritative transaction ledger.
- Add atomic settlement and idempotency; validate ownership/stock/cash server-side; prevent double spending, duplicate deliveries, wash trading and manipulation.
- Compute the same price snapshot for all players from deduplicated player transactions plus NPC supply/demand flows.
- Test two independent clients and ensure local-only feeds never claim global status.
### P4 — Production HPP and business accounting
- Track inventory batches and input consumption per product; compute HPP from actual consumed quantities and process yields.
- Keep raw material, labor, overhead, asset depreciation and living expense distinct. Do not count inventory purchases or CAPEX as immediate operating expense.
- Produce gross business profit before living expenses and a clearly labeled real/surplus result after properly recognized costs.
### P5 — National policy and politics
- Calibrate policy coefficients and eligibility thresholds only after market, population and commodity datasets are stable.
- Add election/presidential mechanics and UI only after policy consequences, budget constraints and NPC response are testable.

## Known research caveats / quality gates
- BPS SEP 2024 livestock data must keep UTP, UPB and UTL strata separate. A known broiler UTP Table 2.10 discrepancy remains unresolved: production Rp152,008.05 thousand minus cost Rp126,445.08 thousand equals Rp25,562.97 thousand, while reported income is Rp28,639.72 thousand. Preserve both values and block margin promotion until visual/source QA.
- Existing national producer-price series are historical anchors, not live quotes and not substitutes for the owner’s coconut retail price.
- Official BPS rice harvested area for 2024: about 10.05 million ha and production 53.14 million tonnes GKG; annual harvested area is not unique physical land area. Source: https://www.bps.go.id/id/pressrelease/2025/02/03/2414/pada-2024--luas-panen-padi-mencapai-sekitar-10-05-juta-hektare-dengan-produksi-padi-sebanyak-53-14-juta-ton-gabah-kering-giling--gkg--.html
- Kementan oil-palm planted area in 2024 about 16.83 million ha (provisional). Source: https://satudata.pertanian.go.id/assets/docs/publikasi/Buku_Analisis_Kinerja_Perdagangan_Kelapa_Sawit_2025_-_tte_sign.pdf
- These two area metrics must not be added together or treated as the total Indonesian land area.
- No current statement in this plan implies the full national supply-chain dataset, all sector caps, or global multiplayer market has already been completed.

## Required end-of-session report
- Active branch and confirmed current HEAD/commit.
- Files changed and commit SHA(s).
- Research sources/data rows added and exact runtime fields updated.
- Test commands actually executed and outcomes; clearly distinguish static assertions, unit tests, browser tests and unrun tests.
- Known discrepancies/limitations.
- The single next task, chosen from the queue above.


## 2026-10-28 implementation checkpoint — rice baseline

- Added window.REAL_ECONOMIC_DATA.riceNationalFoodDemand in js/real_economic_data.js using BPS official observations: 2024 household weekly per-capita “Beras lokal/ketan” 1.521 kg/person/week; 2024 paddy harvested area 10.05 million ha; paddy output 53.14 million tonnes GKG; rice production for food consumption 30.62 million tonnes.
- The derived annualized household value is 79.092 kg/person/year (= 1.521 × 52), explicitly marked derived. National annual consumption remains null pending a source-matched population denominator and compatible demand definition.
- Sources, release/update dates, units, metric boundaries, and caveats are recorded in the data register and audit. This does not yet drive daily NPC demand: seasonal adjustment, stocks/losses, and stage-compatible market flow remain implementation gates.
- Test limitation: no local checkout or Node runner was available in this session; the attempted Git clone failed because this runtime could not resolve github.com. Do not mark Node tests as passed. Add/execute a targeted assertion in a working checkout/CI next.

- Added tests/rice-national-demand.test.js to assert official-source provenance, units, the 1.521 × 52 annualization, production metrics, and the null guard for national annual demand. Added the test to .github/workflows/targeted-regression.yml so the branch push workflow executes it. Execution result remains pending until CI status is retrieved; no local execution claim.


## 2026-10-28 — national rice demand model advanced from partial to sourced forecast

- Extended `js/real_economic_data.js` with the Bapanas 2024 per-capita rice consumption observation (92.1 kg/person/year) and Kementan/Bapanas 2025 national balance projection, including population projection, household/non-household demand components, beginning stock, projected production, imports, availability and balance.
- Official source: Bapanas dataset row 224, 2024 rice = 92.1 kg/person/year (published 2025-01-31); Kementan Pusdatin *Buletin Konsumsi Pangan Vol. 16 No. 1 Tahun 2025*, Tables 4.5–4.6, updated 2025-06-02. Links are preserved in runtime provenance.
- Retained the BPS 2024 final production observations separately from the 2025 projection. The weekly BPS household item remains distinct from the Bapanas annual per-capita metric.
- Data quality issue recorded: Table 4.6 published total need 30,975,843 t differs by 1 t from displayed components (22,527,000 + 8,448,844 = 30,975,844). Runtime preserves original published values and flags the discrepancy.
- Added/updated `tests/rice-national-demand.test.js` for new data fields. Test execution and CI outcome must be verified; do not claim passing until logs/status confirm it.

- Semantic safeguard: the 2025 national need of 30,975,843 tonnes is stored as `nationalDemandProjection.totalNeedTon` (household + non-household), while `nationalAnnualConsumptionEstimateTon` remains `null` to avoid conflating the two concepts. The test now checks this guard and the documented 1-tonne component discrepancy.

## 2026-10-28 — CI failure blocks research promotion

The newest 100 commits on the feature branch were reviewed by page-wise GitHub history retrieval. The most recent work covers component-level HPP reporting, transaction-driven bounded market prices, NPC demand/supply and policy effects, regional producer/population capacity, and official rice demand/balance inputs. Treat these as implemented code/documentation checkpoints, not verified release-ready behavior: recent Targeted Regression Tests runs fail before reaching the new rice test.

Run 40711465568 fails at `tests/accounting_ledger.test.js` because `js/akuntansi.js` dereferences `DATA.shop.iceKarung` while `DATA.shop` is absent in the runtime test context. Defensive guard committed in `450dcfb7367718c52c05bcef5eba91e15b9701d2`; verify the resulting CI run before advancing. Until CI is green, do not promote new national-demand or commodity unit-economics work as validated. Preserve the existing distinction between official 2025 rice balance projection and 2024 observed production.


## 2026-10-28 — Accounting test chain blocks all later regressions

Three successive CI failures have now been traced to the accounting regression harness before the rice regression test executes: missing `DATA.shop` in the test fixture; an expectation that wrongly expensed inventory purchases; and an over-escaped regex for the corrected Rp400,000 business result. Commits `a7f44cbbc87e6038d3a29209b1340f8191d71c63`, `66719dc4a1`, and `7c257e0123b987e9d771504c31a43319784dde62` address those stages. Check the latest Actions run and actual logs. Do not continue to claim the rice/market/HPP suite is validated until the workflow reaches and passes all test commands.


## 2026-10-28 — Targeted regression suite passed

GitHub Actions run 40717347576 passed for code/test commit `7c257e0123b987e9d771504c31a43319784dde62`. The workflow ran all 21 standalone Node/browser regression commands, including `tests/rice-national-demand.test.js`, market, HPP/accounting, finance, world simulation, save migration and gameplay E2E. The latest branch HEAD after documentation-only follow-ups is `758a6e1f634166aee80f306adb35e7c268a5f7e3`; later docs commits do not match the workflow's code/test path filters. This confirms the current targeted suite, not every possible scenario or live multi-player market behavior.

Next evidence work remains: visually reconcile BPS SEP 2024 UTP broiler Table 2.10; resolve the UTL oil-palm income-definition mismatch and Table 4.2 page/definition notes; extract the remaining exact UPB/UTL figures from original tables; then research maize with explicit commodity-form, demand denominator, stock, and period matching. No map changes and no unsupported commodity-tier runtime promotion.


## 2026-10-28 — Maize national-demand baseline registered

Added source-linked maize demand measures to `js/real_economic_data.js` and a regression test to CI. Bapanas reports provisional 2024 direct food consumption of 1.5 kg/person/year. Kementan Pusdatin's 2025 projection estimates total need around 14.72 Mt, including 13.603 Mt all-channel feed use and 1.117 Mt other uses. Ditjen PKH *Buku Jagung 2025* Table 26 gives 8,844,096 t feed-industry need, while the Kementan Pusdatin bulletin cites about 8.25 Mt for the same broad industry-demand category. The discrepancy is retained and explicitly unresolved; do not harmonize or add the two values.

The regression checks source provenance, units, rounded component arithmetic, provisional status, and the unresolved feed-industry projection conflict. Next: verify the new maize test in GitHub Actions, reconcile the maize 2024 production values/moisture bases, then proceed to exact BPS SEP 2024 UPB/UTL tables and the unresolved broiler UTP Table 2.10 arithmetic. No maize Tier 1–4 runtime economics are promoted by this national-level evidence.


## 2026-10-28 — Maize data regression and market/NPC harness passed

GitHub Actions run 40717841286 passed for `f790d8058542273fe5af7dc95cbb87d3e6d9fc42`. The new Node test-runner suite for background NPC economy, bounded market engine, and inventory accounting passed; all standalone Node and browser E2E tests also passed, including `tests/maize-national-demand.test.js`. A preceding failure was traced to the test harness referring to `COMMODITY_BY_ID` instead of the catalog exposed as `MARKET_ENGINE.byId`; corrected in the passing commit. Current HEAD `b585d2b05590b7607ac5542f70619237d91758c1` adds documentation-only follow-up. The unresolved source-vintage conflict between 8.25 Mt and 8.844096 Mt feed-industry projections remains open and is deliberately not hidden.


## Latest verification — regression suite green, national research remains provisional (2026-10-28)

- GitHub Actions run [40717841286](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40717841286) passed on commit `f790d8058542273fe5af7dc95cbb87d3e6d9fc42`. The three previously omitted test-runner suites passed 13/13 subtests; the workflow's standalone Node and browser/E2E commands, including rice and maize tests, also passed.
- CI pass means the implemented data schema, arithmetic guards, NPC/market behavior under tested scenarios, inventory/HPP tests, and browser flows satisfy the current assertions. It does not resolve official-source conflicts or prove a globally shared player market.
- Maize runtime now records Bapanas 2024 provisional direct food consumption (1.5 kg/person/year), Kementan Pusdatin 2025 rounded national need (~14.72 Mt), all-channel feed (~13.603 Mt), other uses (~1.117 Mt), and a separate Ditjen PKH feed-industry projection (8,844,096 t). The bulletin's alternative ~8.25 Mt industry figure remains an unresolved source-vintage/scope conflict. `directHouseholdConsumptionTonnage` remains null; do not derive it using an unaligned denominator.
- Next research task: reconcile maize production source vintage, product/moisture basis and post-harvest losses before any national balance calculation. Then resume exact source-table QA: visually verify BPS SEP 2024 UTP broiler Table 2.10 arithmetic, resolve the UTL oil-palm income-definition mismatch, and extract remaining UPB/UTL table rows. No Tier 1–4 unit economics may be inferred from national demand projections alone.


## 2026-10-28 — Maize production moisture bases recorded

Added BPS's final 2024 maize production observations to `REAL_ECONOMIC_DATA.maizeProduction2024`: 2.55 million ha harvested area, 20.48 Mt at 28% moisture, and 15.14 Mt at 14% moisture. The same BPS publication says estimates combine KSA, 2024 Ubinan and SKJG2020 conversion survey. A simple moisture-only mass-balance gives ~17.146 Mt at 14%, not the published 15.14 Mt; this is stored as an audit-only derived value and must not replace the official observation. New assertions in `tests/maize-national-demand.test.js` protect this distinction. Next: verify the new CI run, then research/clarify the conversion methodology before linking production to national demand.


## 2026-10-28 — Maize production basis regression passed

GitHub Actions run 40718376449 passed for `3d02c30cfaf090856e1accf540f17c84d2d40fcd`, including the updated maize test that preserves both BPS moisture-basis values and guards against substituting a simple moisture-only conversion. Keep the source-vintage conflict between feed-industry demand projections unresolved, and do not calculate a 2024-production/2025-demand balance until period, moisture, loss and use definitions are compatible.


## Maize same-year production added; balance not yet calculated (2026-10-28)

- Added BPS final 2025 maize output: harvested area 2.71 million ha; dry shelled maize 16.16 million tonnes at 14% moisture. Source release 2026-02-02: https://www.bps.go.id/id/pressrelease/2026/02/02/2538/luas-panen-dan-produksi-jagung.html. Runtime field: `maizeProduction2025`.
- The same-year production observation is now present alongside the Kementan rounded 2025 need projection (~14.72 Mt), but a difference of the two must not be presented as national surplus. Stocks, imports/exports, post-harvest losses, and exact product/use scope remain unaligned. Runtime `maizeNationalBalanceEstimate2025` is explicitly `null` and guarded by `tests/maize-national-demand.test.js`.
- CI for the earlier maize moisture-basis provenance test passed in run 40718376449; a new workflow run triggered by the final-2025-production assertion must be checked before claiming that assertion passed. The wider test-runner and browser suite passed in run 40717841286.


## 2026-10-28 — Final 2025 maize production added

Added BPS final 2025 maize production (16.16 Mt at 14% moisture; harvested area 2.71 million ha; release 2026-02-02) to the runtime registry and maize regression test. At the same 14%-moisture basis, this is 6.74% above the 2024 final 15.14 Mt observation. The national balance estimate remains null because total demand is rounded/projection-based and feed-industry demand sources disagree; reconcile stocks, trade, losses and scope before estimating surplus/deficit.


## Official projected maize balance registered (2026-10-28)

- Added the Bapanas/Kementan Pusdatin projected 2025 maize balance from *Buletin Konsumsi Pangan Vol. 16 No. 1 Tahun 2025*, Table 5.6, updated 2025-06-02. The projection includes beginning stock 3,579,102 t; production 16,194,055 t at 14% moisture; 748,165 t losses/spillage (4.62%); net production 15,445,889 t; imports 906,040 t; exports 76,959 t; availability 19,854,073 t; need 14,720,163 t; projected ending balance 5,133,909 t.
- The source table has three 1-tonne arithmetic discrepancies. They are recorded in runtime `nationalBalanceProjection2025.arithmeticAudit` and tested, with all published values preserved. Final BPS 2025 production (16.16 Mt at 14% moisture) is 34,055 t below the earlier projected production input; this difference does not convert the forecast balance into a final actual balance.
- Runtime `maizeNationalBalanceEstimate2025` remains null. The projection is useful for national-simulation scenarios but must retain the 2025-06-02 vintage, estimated trade, 4.62% loss factor, and the distinction between rounded headline need (~14.72 Mt) and Table 5.6 exact need (14,720,163 t).
- Next research gate: resolve the 8.25 Mt versus 8.844096 Mt feed-industry projection difference without mixing all-channel feed need and industry-only purchases. Then continue the queued source-table QA: BPS SEP 2024 UTP broiler Table 2.10, UTL oil-palm income definition, and remaining UPB/UTL rows.


## 2026-10-28 — Exact official maize balance projection registered

Added Bapanas/Kementan Table 5.6 (update 2025-06-02) as a separate official 2025 projection: beginning stock 3.579102 Mt, gross production 16.194055 Mt at 14% moisture, loss/spillage 0.748165 Mt, net production 15.445889 Mt, imports 0.906040 Mt, exports 0.076959 Mt, availability 19.854073 Mt, need 14.720163 Mt, and projected ending balance 5.133909 Mt. Three source arithmetic differences of 1 tonne are explicitly stored and tested, not silently corrected. BPS final 2025 output is 16.16 Mt at the same 14% moisture basis, 34,055 t below the earlier balance projection input; the source balance remains a projection and is not recalculated from final output. The new balance schema/test has been committed; verify the latest Actions run before treating it as validated.


## 2026-10-28 — Maize balance and feed-source metadata tests passed

GitHub Actions run 40719342746 passed for `05220f710fa645f43b04dcb2334747ee049060b0`. The maize test now checks the exact Table 5.6 projection, all three one-tonne arithmetic discrepancies, and the feed-industry source's correct publication title, reference year, and SiJagung provenance. The ~8.25 Mt bulletin estimate and 8,844,096 t Table 26 projection remain separate because they derive from different projection/reporting series. Do not merge them or recalculate the official balance without rebuilding all source components.


## 2026-10-28 — Latest 100-commit audit checkpoint

Reviewed the latest 100 feature-branch commits from `2cc440305ccbd1387c1ee5d5cf5181807f6bd317` through current HEAD `33a5abe04de2d6d6ece1ab930c7260db93902b7f`. Themes: national data/source provenance and audits, CI/test harnesses, accounting/HPP, market/NPC flows and regional capacity; no map/peta commits in this window. Current latest test run 40719342746 passed for code/test commit `05220f710fa645f43b04dcb2334747ee049060b0`; subsequent commits are docs-only. Next priorities remain the maize feed-projection source-method reconciliation and BPS SEP UTP/UPB/UTL source QA. Do not promote rough Library estimates into runtime economics without matched primary-source evidence.


## Latest verification update (2026-10-28)

Run 40719342746 passed on commit `05220f710fa645f43b04dcb2334747ee049060b0`. The regression now checks the official Table 5.6 projected maize balance, source metadata, final 2025 BPS production, the distinct 2024 moisture-basis figures, and the three source-table 1-tonne arithmetic discrepancies. The feed-industry source title is corrected to *Pemanfaatan Jagung Lokal oleh Industri Pakan Tahun 2024* (Vol. 6, 2025); the 8.844096 Mt SiJagung requirement projection remains distinct from the ~8.25 Mt Pusdatin purchase/absorption projection. This discrepancy remains unresolved; preserve both.


## Additional maize feed projection arithmetic audit (2026-10-28)

Ditjen PKH Direktorat Pakan's *Pemanfaatan Jagung Lokal oleh Industri Pakan Tahun 2024* (Vol. 6, 2025), Table 26, publishes annual projection 8,844,096 t and quarterly totals that sum to it. Its prose monthly average of 727.01 thousand t does not reconcile: annual/12 = 737,008 t/month, difference -9,998 t/month. Runtime `feedIndustryDemand2025.sourceArithmeticAudit` and `tests/maize-national-demand.test.js` preserve/guard this discrepancy. This does not resolve the separate 8.25 Mt versus 8.844096 Mt method/vintage conflict; retain both industry-only projections and do not add them to the all-channel 13.603 Mt feed-use total.


## UTP broiler source discrepancy — later BPS corroboration added (2026-10-28)

BPS *Peternakan Dalam Angka 2025* Table 8.3.10 (printed p.122) reproduces 2024 UTP broiler values per 5,000 final-stock heads: production Rp152,008.05k, cost Rp126,445.06k, published income Rp25,563.00k, feed cost Rp81,754.62k (64.66%). The arithmetic difference is Rp25,562.99k, only Rp0.01k below published income. This conflicts with the earlier SEP 2024 Table 2.10 transcription (cost Rp126,445.08k; income Rp28,639.72k). Added the later table to runtime as research-only `utpBroilerBenchmark2024` and added `tests/utp-broiler-benchmark.test.js`. The official BPS publication metadata is accessible, but its page is blocked on direct open; table text was inspected in a publicly accessible mirror. Keep original Table 2.10 visual verification open and do not promote the benchmark to Tier 1–4 recipes.


## UTL oil-palm Table 4.2 added as research-only benchmark (2026-10-28)

BPS SEP 2024 Table 4.2 (UTL oil palm, per 100 trees) reports production value Rp25,143.89k, cost Rp13,218.16k, income Rp12,046.95k, producer price Rp2.07k/kg, unit cost Rp1.29k/kg and productivity 12,443.49 kg/100 trees. Listed cost components sum to Rp13,212.48k (Rp5.68k below published total cost); production minus published cost is Rp11,925.73k (Rp121.22k below published income). The source note mentions rounding and incomplete cost/subsidy imputation, but does not explicitly reconcile the differences. Runtime `utlOilPalmBenchmark2024` and `tests/utl-oil-palm-benchmark.test.js` preserve values/deltas without promoting them to a production recipe. Original Table 4.2 image verification remains open.


## Latest livestock source-QA and regression checkpoint (2026-10-29)

- GitHub Actions run [40792046198](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40792046198) passed the current targeted regression workflow at commit `91a196490a005f47fc84f09819281878860db7b6`: Node test-runner 13/13, UTL/UTP benchmark tests, standalone accounting/market/economic-data tests, browser smoke and gameplay/finance/migration/recovery E2E.
- UTL oil-palm Table 4.2 printed-page image verification is now complete. Its Rp5.68k cost-component delta and Rp121.22k income-definition delta remain unresolved; do not attribute them to rounding alone.
- UTP broiler Table 2.10 is verified in the official PDF text layer but not visually verified. Its reported income differs from production minus cost by Rp3,076.75k. A later BPS *Peternakan Dalam Angka 2025* row reconciles within Rp0.01k; keep the two publication vintages as separate records.
- Next: extract the remaining relevant UTP livestock tables and UPB/UTL tables from primary-source pages/images. Preserve exact units, denominators, reference period and holding type. No benchmark above is promoted to game Tier 1–4 recipes. If the official PDF image cannot be inspected, keep the visual gate open and leave new values out of runtime.


## 2026-10-29 — UTP cattle benchmark data registered with primary-source gate

Added BPS *Peternakan Dalam Angka 2025* Tables 8.3.1–8.3.3 (2024 UTP beef cattle, dairy cattle, and meat buffalo) as research-only records in `REAL_ECONOMIC_DATA.livestockBenchmarksUtp2024`. The official publication catalogue is confirmed; numeric table text came from a publicly accessible mirror because the BPS download endpoint timed out. Every record carries denominator, reference period, table/page, reported totals, feed cost, component sum, arithmetic deltas and explicit unverified-PDF status.

QA outcome: beef cattle and dairy each have a Rp0.01 thousand cost/income rounding discrepancy; buffalo listed cost components sum Rp106.65 thousand below published total cost. These are not cleared by the source evidence. The data is not ready for runtime economics or Tier 1–4 recipes.

Next steps:
1. Verify original BPS PDF table images for Tables 8.3.1–8.3.3; do not close the visual gate based on the mirror.
2. Investigate buffalo's Rp106.65 thousand component gap and preserve both reported and derived fields.
3. Extract remaining UTP livestock tables and relevant UPB/UTL rows only with exact product class, unit, denominator, period and primary-source evidence.
4. Revisit the maize feed-industry projection conflict after this source gate, keeping industry-only projections separate from all-channel feed use.


## 2026-10-29 — UTP cattle regression passed; source verification remains open

GitHub Actions run [40857528843](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40857528843) passed at code/test/CI commit `92fcef854c2219d1c68a51c7d3fc4b786296409f`, including the new UTP cattle provenance/arithmetic guard and the full existing regression chain. This verifies code assertions, not the primary-source accuracy of table transcription. Keep official PDF image verification and buffalo component reconciliation open before any promotion. Latest branch HEAD after documentation updates is `8a7ed1716aa244d22fd150fdce653778cc9a4d7c`.


### Expanded UTP table coverage — goat and native chicken

Added research-only aggregate/cost-component rows for meat goat (Table 8.3.5) and native chicken (Table 8.3.7). Both have small arithmetic differences that are now explicitly represented in code and regression tests. This extends the UTP evidence register but does not complete livestock-sector research: the primary PDF/table images and further UTP/UPB/UTL rows remain open.


### Expanded livestock regression status (2026-10-29)

The five-record UTP livestock research dataset (beef cattle, dairy cattle, buffalo, goat and native chicken) passed regression in GitHub Actions [40857810264](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40857810264). The data remains research-only because the original BPS PDF tables have not been visually verified. Next research gate remains source-image verification and reconciliation of buffalo's component gap before expanding further to UTP/UPB/UTL.


### UTP laying-duck benchmark added

Table 8.3.8 is now registered as a research-only per-1,000-head cost benchmark, with feed share and arithmetic checks. This provides a potential input for the duck/egg sector evidence chain, but not an egg unit cost: egg production volume and the original PDF table still need verification. Continue primary-source retrieval and avoid per-egg conversion until yield data and period alignment are sourced.


### Additional UTP duck benchmark and source-page QA

Added Itik Manila per-head cost structure from BPS *Peternakan Dalam Angka 2025* Table 8.3.9 as research-only data. Its reported income differs from production minus cost by Rp0.01 thousand; components reconcile. The table of contents places Table 8.3.9 on p.122, so the following broiler Table 8.3.10 locator has been corrected to p.123. Original PDF table images remain unverified, so all these records stay out of Tier recipe promotion.



### Seven-record UTP livestock dataset regression confirmed (2026-10-29)

The full regression workflow passed after adding Manila duck and correcting the broiler Table 8.3.10 locator to printed p.123. The test guards the seven records' units/denominators, source quality status and arithmetic deltas. The remaining gate is evidence quality: verify primary BPS PDF table images and resolve buffalo cost-component gap before any Tier promotion.


## Current HEAD and renewed 100-commit audit checkpoint (2026-10-29 10:35 UTC)

- Re-fetched the current latest 100 commits after the livestock implementation. Range: HEAD `ed19a1653438ddcdedf6b7adda4aaa20d492c3d4` (2026-10-29 10:34:37 UTC) back to `97d05155cb76e423eb055f03c3bbfbb5ddcf5f33` (2026-10-28 15:45:10 UTC). Themes include national maize production/demand/source-vintage QA, NPC market/economy regression, rice balance and semantics, livestock cost benchmarks, source provenance and CI/handoff corrections. The newest five commits are documentation checkpoints following a successful code/test run.
- Branch heads: `feat/production-tier-taxonomy` = `ed19a1653438ddcdedf6b7adda4aaa20d492c3d4`; `fix/core-auto-warung-accounting-ui` = `fc951b248eea487f09c8b683c782aff1dfc6c222`; `main` = `fc2f908b309b9864e8b24737f3b5f848f32d1392`. Work remains on the feature branch only; no map files changed.
- Latest green test run for current data/test implementation: [40858451709](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40858451709), test commit `f0367036cb40b7d124a0119d1e4c288c5f89f6ee`. The new seven-record UTP livestock test and all existing regression/E2E steps passed. Latest HEAD commits after the test SHA are documentation-only.
- Source evidence gate remains open: the new cattle, goat, native chicken, laying duck and Manila duck records are secondary-transcribed from a public mirror of BPS `Peternakan Dalam Angka 2025`; official catalogue metadata is verified but original table images are not. Do not promote these to Tier recipes. Buffalo component sum remains Rp106.65 thousand below the reported total cost.
- Next work item: continue official primary-source table verification and remaining UTP/UPB/UTL extraction; if the official PDF remains inaccessible, record the exact blocker and proceed to other verifiable primary tables. Then return to the unresolved maize feed-industry projection method/vintage conflict. Maintain code + register + audit + plan + handoff updates for every data addition.


## Checkpoint 2026-10-30 — livestock source gate and maize reconciliation queue

- Renewed review of the latest 100 feature-branch commits confirms recent work concentrated on BPS UTP livestock benchmark records, source/page QA, maize balance arithmetic/provenance and regression handoffs. Latest branch HEAD observed: 2aae7b164db94c3169cf54d7b86dc17e69e4ea57.
- Test status: full regression run [40858451709](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40858451709) passed at code/test SHA f0367036cb40b7d124a0119d1e4c288c5f89f6ee. This test covers seven UTP livestock records plus existing Node/browser/E2E tests. Do not claim that the later documentation HEAD was separately tested.
- Source verification blocker: BPS Peternakan Dalam Angka 2025 catalogue metadata is available, but direct catalogue-page retrieval returned 403 and the official SEP 2024 livestock download timed out in this pass. Numeric livestock records remain secondary-transcribed and research-only; original table images are not verified. Buffalo component sum remains Rp106.65 thousand below published total cost; retain the discrepancy.
- Priority next task: reconcile the two maize feed-industry demand values already in runtime (8,844,096 t/year versus approximately 8.25 million t/year). Compare exact publication vintage, table/page, reference year, demand concept (feed-industry procurement versus all feed uses), rounding and methodology. Add no replacement number until the evidence establishes scope. Preserve the current unresolved status and test guard. Afterward continue UTP/UPB/UTL source extraction only when source table, denominator, period and arithmetic are documented.


## 2026-10-30 — primary-source resolution of maize feed-series definition

Inspected both official Kementan PDFs. Ditjen PKH's Pemanfaatan Jagung Lokal oleh Industri Pakan Tahun 2024 Vol. 6/2025 Table 26 (printed p.44) gives the 2025 SiJagung-reported industry-need projection of 8,844,096 t. Its quarterly values reconcile to the annual total, but the accompanying prose monthly average (727.01 kt) is 9,998 t/month below annual/12 (737.008 kt).

Kementan Pusdatin's Buletin Konsumsi Pangan Vol. 16 No. 1/2025 (printed p.32 and Figure 5.4 on p.35) gives an approximate 8.25 Mt factory purchase/absorption series and ~5.36 Mt independent/self-mixing farmer feed demand. This explains why the 8.25 Mt figure should not replace the 8.844096 Mt SiJagung-reported need projection. Their summed rounded components give ~13.61 Mt compared with the rounded 13.603 Mt national feed-use estimate (7,000 t difference). Store as distinct series; keep the numeric rounding gap visible, not falsely “solved.”

Updated runtime data and the regression guard now assert the series definition, 594,096 t difference, 13.61 Mt comparison, 7,000 t gap, and source arithmetic discrepancy. Wait for CI before declaring the updated test green. Official national balance values remain unchanged.


## Verification status — maize feed series guard green (2026-10-30)

GitHub Actions run [41009050507](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/41009050507) passed at test commit ceed808abbe6a0f05bfc31d5c369cb0c853497a2. The node-regression job completed with no failed steps. The preceding run [41009037960](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/41009037960) was a sequencing failure: runtime status changed before its test assertion was updated; the next test commit corrected the expectation and passed. Keep this failure/fix trail. The current regression validates source definitions and arithmetic deltas; it does not prove the rounded national feed-use figures exactly reconcile. Do not change the national balance values on this basis.

## 2026-10-30 — livestock benchmark validation gate

Added a generic per-record regression over the seven current UTP livestock benchmarks to verify source-component arithmetic and preserve all published-vs-derived deltas. This is not a Tier 1–4 approval: records remain research_reference_only, and the buffalo cost-component sum remains Rp106.65 thousand below reported production cost. The original BPS SEP 2024 livestock publication metadata is confirmed, but the official PDF download timed out in this retrieval, so direct table verification remains open. Test commit 6e15b8691a88781923dcd2b798042ef297b41e22; await CI run 41056766643 before claiming regression success.
## CI outcome — livestock benchmark arithmetic gate (2026-10-30)

Run 41056766643 passed at test commit 6e15b8691a88781923dcd2b798042ef297b41e22. The expanded arithmetic guard is green. This does not promote the dataset to Tier 1–4, resolve the buffalo cost-component residual, or close primary-table verification.

## Checkpoint — 2026-10-31: livestock primary-source gate

The current feature HEAD is `80c9ddbd50e957b755ce3a89dd5fef3ac788e1a7`; the renewed 100-commit window runs back to `cf7bdffa9dae62afa409664ea75006c674ef12ce`. Recent work validates maize demand/feed projection scope and arithmetic, and seven UTP livestock research-reference records. CI run 41056766643 passed the UTP arithmetic guard at test commit `6e15b8691a88781923dcd2b798042ef297b41e22`; run 41009050507 passed the maize projection-series guard at `ceed808abbe6a0f05bfc31d5c369cb0c853497a2`.

Next gate is source quality, not more arithmetic-only documentation: directly inspect the official BPS SEP 2024 livestock primary tables or select a different official data family with accessible tables. The BPS catalogue entry is confirmed, but table-level primary PDF verification is not. Keep the UTP records research-only; do not turn the buffalo component residual (-Rp106.65 thousand) or other rounding gaps into inferred expenses. No national livestock or commodity Tier 1–4 values should be promoted until source provenance, denominator, production cycle, and component definitions are reconciled. Avoid checkpoint-only commits unless branch/test status materially changes.


## 2026-10-31 — Livestock market-price benchmark added

The runtime registry now includes six official 2024 annual-average livestock price series from the directly accessible Ditjen PKH *Statistik Peternakan dan Kesehatan Hewan 2025* PDF: producer live cattle and live broiler prices, producer layer-egg price, and consumer beef, broiler-meat and layer-egg prices. Tables 3A.1–3A.3 are printed pp.33–34; Tables 3B.1–3B.3 are printed pp.35–37. The publication attributes producer prices to Ditjen PKH and consumer prices to Bank Indonesia. Values and regional high/low values are source-registered, and a targeted Node regression is added to CI.

This is a source-backed historical price calibration layer, not a production-cost model. Keep live-weight prices separate from retail meat prices; keep 2024 annual averages separate from current prices and from owner-specific game prices. Do not use these values as HPP or Tier 1–4 recipes. The separate UTP cost-benchmark source gate remains open pending primary table access and review of the buffalo component residual.
