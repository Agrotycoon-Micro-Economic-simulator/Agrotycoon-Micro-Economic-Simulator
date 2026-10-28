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
