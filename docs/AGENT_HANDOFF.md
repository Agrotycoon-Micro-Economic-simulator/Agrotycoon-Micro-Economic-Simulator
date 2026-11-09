
## Maize physical-demand dimensional guard (2026-11-09)

- Corrected a unit-integrity defect in the maize total-demand integration: the official total-use projection is now stored as a separate physical demand reference in kg/year and kg/month. It no longer rescales legacy province demand, production, inventory, government reserve or unmet-demand index values into kilograms.
- Reason: official total maize demand is a national all-channel projection (household + feed + other uses), while the game still lacks verified province-level maize supply allocation and a validated conversion from legacy index stocks to physical kg. Mixing these units would create false physical market quantities and distort stock-cover/price calculations.
- Runtime metadata explicitly reports `physical_demand_reference_only_supply_stock_conversion_pending`; national BPS maize production remains a national reference and is not allocated across provinces.
- Regression tests verify the physical demand reference, preservation of legacy index quantities, and daily market index operation. Physical kg-based NPC order quantities remain blocked until provincial production/supply and inventory conversion are source-backed.

# Hierarchical locality demand mass-balance update (2026-11-09)

`getLocalityAggregateAsync()` now scales `monthlyDemandIndex` by the runtime hierarchical population share rather than dividing province demand equally by locality count. The allocation conserves the parent demand signal across regency/city → district → village/kelurahan levels. Population remains explicitly derived for non-DKI until official locality population observations are loaded. A regression test verifies child-demand conservation.

## Hierarchical locality consumer runtime (2026-11-09)

- The locality aggregate runtime now allocates simulation population hierarchically instead of splitting the province equally at every administrative depth: province -> regency/city -> district within its parent -> village/kelurahan/UPT within its parent district.
- The administrative master remains the official-name/code backbone: 38 provinces, 416 regencies, 98 cities, 7,285 districts, 75,252 desa, 8,496 kelurahan and 14 UPT/SPT. The hierarchy is runtime data, not a static documentation-only list.
- For DKI regency/city records where BPS 2025 population weights exist, those official BPS weights remain authoritative for the game scaling. For deeper levels and non-DKI localities without a verified official population leaf dataset, the population is explicitly marked derived_hierarchical_equal_share_pending_official_locality_population.
- Local demand is derived from the locality population ratio against the parent/province population and the province's runtime commodity demand. This preserves mass balance: the locality allocation is a decomposition of the province simulation demand, not an invented second national demand series.
- This does not mean the equal-share population is real Indonesian census data. It is a deterministic game allocation used so every administrative entity can participate in runtime demand. Official leaf population data remains butuh riset lanjutan.
- BPS released Konsumsi Bahan Pokok Nonrumah Tangga 2025 on 12 June 2026. The publication covers non-household use of rice, maize, cassava, sweet potato, soybean, peanuts, beef/buffalo, chicken, eggs, fish, shallot, garlic, chili, cooking oil, sugar, wheat flour and salt. The official publication is registered in SOURCES, but numeric ingestion remains pending because the downloadable publication data has not yet been extracted into a machine-readable source table. Do not use a fabricated non-household quantity.
- Official BPS 2025 household per-capita tables are separately available at regency/city level, including staple grain consumption, but these must not be mixed with the non-household survey.
- Next gate: extract the BPS 2025 non-household publication into a versioned source table with commodity, unit, province, business/institution category, annual quantity/value, coverage, table/page and status; then map those quantities into institutional buyer demand without double-counting household demand.

## Latest regional NPC order-book execution and settlement (2026-11-09)

- Runtime branch: `feat/production-tier-taxonomy`. Code/test checkpoint: `47bd3abf81af3ec9f99e25577d77fb3dbac34181`. GitHub Actions run [42573899842](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/42573899842) completed SUCCESS: 94/94 Node test-runner tests, all four official benchmark guards, all standalone Node regressions, browser smoke, gameplay E2E, finance/payroll E2E, legacy-save migration E2E and corrupt-save recovery E2E.
- NPC sell orders now use `province.inventory[commodityId]` after the regional daily production/consumption calculation, not gross daily production. This prevents listing the same production that has already been absorbed by local demand. Government reserve inventory is separate and is not offered to the player market. NPC buy orders use the remaining `unmetDemand`.
- The daily game transition now creates the regional NPC order batch, then calls `AgroPlayerOrderBook.matchAndSettle(day)`. Matching reuses `MARKET_ENGINE.matchOrderBook()`: commodity + region + market-stage isolation, bid/ask price priority, time/sequence priority, partial fills, maker-price execution, expiry and self-trade prevention. The current NPC bid and ask are both anchored to the bounded local quote; a calibrated bid–ask spread is not yet implemented.
- Executed fills are the only source of settlement. Player buy fills debit cash by executed notional, add raw inventory and inventory cost, create a storage lot with acquisition day and unit cost, and post a balanced purchase entry. Player sell fills remove only executed quantity, consume FIFO storage lots, reduce inventory value, add cash/revenue and recognize HPP. Unfilled player orders keep only their remaining cash/inventory reservation.
- NPC aggregate fills are reconciled through `AgroNationalEconomy.applyOrderBookFills()`: NPC seller fills reduce regional marketable inventory; NPC buyer fills reduce regional unmet demand. Regional daily executed volume, notional and last execution price are exposed through `provinceSnapshot().tradeIndex`. All executed fills feed `MARKET_ENGINE.reprice()`, so transaction volume/side/VWAP affect the saved market price.
- Execution records are persisted in `S.marketOrderBook.trades` (bounded to the latest 1,000) and `lastMatch`; the day report/ledger receives a zero-cash-flow market event for aggregate execution metadata. Player fills additionally create cash and HPP/purchase accounting entries.
- Atomicity guards prevalidate player cash, inventory quantity, inventory cost, storage-lot quantity, regional stock and unmet demand before settlement. A same-commodity player buy and sell fill in the same daily batch is rejected rather than silently netted. The supported player order stage remains `producer`; finished-goods/retail-stage orders are not implemented.
- Scope limit: NPCs are still representative aggregate pools (producer pool and buyer pool per province), not individually capitalized businesses. NPC-side cash balances, debt, firm-level ledgers and independent inventory ownership are not yet modelled. NPC aggregate fill reconciliation updates regional stock/demand and trade signals; it does not create a separate double-entry cash ledger for each NPC. The 1,132 active agents continue to influence aggregate demand/supply behavior but are not each assigned an individual order wallet.
- Failure/fix record: first regression run [42573221196](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/42573221196) exposed two incorrect assumptions in new tests: a leftover padi unmet-demand fixture still legitimately generated a buy order, and purchased inventory was being added before legacy storage migration, causing the new receipt to be migrated and received twice. The fixture now isolates the intended case; storage migration runs before purchase inventory mutation. Subsequent FIFO/expiry-state hardening was verified on [42573840179](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/42573840179), and the final regional snapshot/volume changes passed on run 42573899842.
- Files changed for this increment: `js/player_order_book.js`, `js/npc_order_generator.js`, `js/national_economy.js`, `js/day.js`, `tests/player-order-book.test.js`, `tests/npc-order-generator.test.js`, `tests/national-economy.test.js`, and this handoff/model documentation. `main` was not written. No changes were made to `peta.html` or `js/map_engine.js`.

## Latest official monthly-demand seasonality integration (2026-11-09)

- Runtime commits: `bbde6b8ef08dcd074eeb372b52ee16effc167182` (seasonal demand integration), `44c11a8b67bca9d234e21a35feb153c9da287efd` (retain all source columns). Regression commits: `3f9db81f4c09214a64befec12ba2d667c1d0fcd7`, `137d14988e5e9f46d70f576ccc01742a68c0ea03`, and `d55ce29cdf62a5cd691599571acd91b50cd9c0e7`.
- Primary source: Bapanas *Petunjuk Teknis Tata Cara Penyusunan Proyeksi Neraca Pangan Tahun 2025*, Table 2.5: https://data.badanpangan.go.id/nfs_storage/public/publication/documents/1776218737.pdf. All 12 commodity columns and their 12 monthly coefficients are retained verbatim in runtime. Seven compatible mappings are active in `records`: padi (rice downstream index signal only), jagung, cabai_merah, cabai_rawit, bawang_merah, bawang_putih and kedelai. Five columns are retained but non-executing in `unmappedRecords`: beef, chicken meat, eggs, sugar and cooking oil, each with an explicit `research_only_*` mapping status.
- The runtime uses a 30-day game month and applies `12 × β_month` to the existing average monthly demand index. The factor affects daily demand, stock cover, unmet demand and regional price formation. Government procurement, reserve-release sizing, import caps and deficit allocation use the same adjusted monthly demand.
- Do not normalize the official coefficients to sum to 1: HBKN coefficients intentionally add demand above the normal day-count allocation. Printed padi coefficients sum to 1.0041; corn/soybean sum to 0.9998 due four-decimal source rounding. Bapanas excludes HBKN uplift for corn and soybean.
- Stage/unit guard: rice coefficients affect padi only as a downstream demand-index signal, not as a physical beras-to-gabah conversion. Beef/chicken/egg coefficients do not execute against livestock head-count items; sugar and cooking oil do not execute because compatible catalog product stages are absent. Do not map kg consumption to head-count stock.
- This is a 2025 seasonal template mapped onto 12 in-game 30-day months, not a live Gregorian calendar or a new physical-consumption quantity. Existing per-capita physical-demand anchors remain separate.
- Bapanas Juknis defines annual food need as household consumption + non-household consumption. NonRT comprises seed, animal-feed industry, food/non-food industry, and Horeka (hotel, restaurant, canteen). Where NonRT data are unavailable, the Juknis permits BPS 2017 survey/study, study-based agreement, or interagency coordination. Numeric NonRT integration remains pending; do not set it to zero or fold it into household values.
- The PDF has an internal reference-number discrepancy: cover cites Kepka Bapanas No. 27/2025, while the attachment heading cites No. 22/2025. Preserve the discrepancy and cite the title/table rather than silently choosing one number.
- Failure/fix audit: run [42555967931](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/42555967931) first exposed floating-point strict-equality in a factor assertion and a stale import-cap expectation based on flat monthly demand. Commit `137d149...` rounded factor assertions and aligned the cap expectation with seasonal demand. Run [42556049774](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/42556049774) passed 55/55 for the active mappings. Final run [42556163711](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/42556163711) completed SUCCESS on test commit `d55ce29...`, validating all 12 retained source columns: 55/55 Node tests, all benchmark guards, all standalone Node regressions, browser smoke (onboarding/save-load and all 10 hamburger pages), gameplay E2E, finance/payroll E2E, legacy-save migration E2E and corrupt-save recovery E2E.
- Repository checkpoint: branch `feat/production-tier-taxonomy`; code/test validation SHA `d55ce29cdf62a5cd691599571acd91b50cd9c0e7`, with later commits documentation-only. The code/test sequence is nine commits ahead of checkpoint `2e6ca1f1766b45dae8cbc310be1bef9178a350a1`. Only four files changed in that range: `docs/AGENT_HANDOFF.md`, `docs/NATIONAL_COUNTRY_AND_REGIONAL_MARKET_MODEL.md`, `js/national_economy.js`, `tests/national-economy.test.js`. `main` remains `fc2f908b309b9864e8b24737f3b5f848f32d1392`; no map files changed.
- Next gates: extract BPS *Konsumsi Bahan Pokok Nonrumah Tangga 2025* numeric tables and reconcile units/scope; obtain the full Bapanas 514-locality CSV/JSON/XLSX and official population weights outside DKI; then continue local order-book matching with NPC bids/asks, price/time priority, partial fills and executed-only ledger effects.

# Handover — National country, 200m population and regional government market (2026-11-08)

## Latest physical-demand calibration checkpoint (2026-11-09)

- Added a research-backed physical food-consumption layer without replacing the existing synthetic 60-commodity demand index.
- Source: Badan Pangan Nasional, dataset “Rata-rata Konsumsi per Jenis Pangan Penduduk Indonesia Nasional Update Tahun 2025”, unit kg/kapita/tahun, dataset created 2026-04-20 and published 2026-01-31; the dataset defines consumption as actual average quantity consumed by population and uses nine food groups. Runtime source record must remain separate from production/availability/balance series.
- Direct 2025 catalog anchors currently added: jagung 1.5 kg/capita/year, ubi_kayu 10.9 kg/capita/year, ubi_jalar 4.0 kg/capita/year, kentang 2.5 kg/capita/year, kedelai 8.8 kg/capita/year, kacang_tanah 0.4 kg/capita/year, kacang_hijau 0.3 kg/capita/year, and kelapa 1.0 kg/capita/year. These are household/food-consumption anchors, not total national requirements and not feed/industrial demand.
- For the 200,000,000-resident Arunika scenario, the jagung anchor represents 300,000,000 kg/year or 25,000,000 kg/month of the mapped consumption series. This is deliberately not substituted into the existing padi demand because the official consumption observation is for rice, while the catalog commodity is paddy/gabah; conversion and stage definition require a separate verified coefficient.
- kelapa is stored in kg with status official_consumption_anchor_conversion_pending; do not convert to game buah units until an explicit, sourced kg-per-coconut conversion is approved.
- API added: AgroNationalEconomy.physicalDemandSnapshot(provinceId) and physicalDemandAnchors2025. Province totals scale by the scenario population while retaining the source unit and provenance. The synthetic demand index remains intact for unmapped commodities.
- Test guard added in tests/national-economy.test.js for the 200m jagung annual/monthly arithmetic and anchor provenance. Static new Function syntax validation passed after correction; full Node/GitHub Actions execution for these newest commits is still NOT verified green.
- Code commits: fe2ddb5570b12b89f3d381e40d1a284459ab82cf (anchor implementation), 24f504090b26850e0f6476315f3cbcbe9f431517 (declaration fix). Test commit: 5a21cf39a95d456192caae75f46115ed43a96811.
- Research source: https://data.badanpangan.go.id/datasetpublications/hez/konsumsi_nasional. BPS 2025 weekly-consumption table corroborates several direct food observations but is a separate source series and should not be silently merged with Bapanas annual data.
## Latest demand-layer contract (2026-11-09, continuation)
- Added explicit demand-layer metadata to the national economy: household consumption (Bapanas where mapped), non-household consumption (BPS 2025 source registered; numeric extraction pending), and total demand (requires reconciliation before runtime use).
- Added physicalDemand and demandLayers to province snapshots and locality async snapshots. Locality physical demand remains an equal-share derivation from provincial population until official locality population/consumption data is available.
- BPS source: Konsumsi Bahan Pokok Non Rumah Tangga 2025, released 12 June 2026. It covers rice, dry corn, sweet corn, cassava, sweet potato, soybean, peanut, beef/buffalo, chicken, eggs, fresh fish, shallot, garlic, chili, cooking oil, sugar, wheat flour and salt. Numeric extraction is deliberately not fabricated.
- Current source evidence: BPS publication metadata confirms the scope and purpose; official provincial Bapanas dataset is at https://data.badanpangan.go.id/datasetpublications/x1y/konsumsi-provinsi and is kg/capita/year at province depth.
- Commits: 7a58d6161c4b145b88d23541c5e6d91e67f55e7d (demand-layer contract), 830086141065b3d6b20639ea3a096be2109986ad (source metadata syntax fix), a6a485e3b39ebf39df004da8cd77082fc92f5e2a (province snapshot object fix). Static syntax validation passes after the final fix. Full Node/GitHub Actions remains unverified.
## Current implementation checkpoint

- Active branch: `feat/production-tier-taxonomy`. Continue on this branch only; never write to `main`. No map files were changed.
- New in-game country: **Republik Arunika**, using 38 Indonesian province names as geographic references.
- Game population: exactly **200,000,000 statistical residents**, distributed across 38 provinces in proportion to BPS 2025 provincial population reference weights. This is a game scenario, not Indonesia's current population.
- This 200m country scenario supersedes the earlier 5m/4.9m NPC baseline in older historical notes. Those notes remain as historical audit context; do not use them as the current runtime default.
- Runtime does not instantiate 200m residents. It creates approximately **1,132 active representative agents** (formula `ceil(sqrt(200m) × 0.08)`, clamped 1,000–5,000) and stores 38 × 60 province/commodity aggregate states. Agents execute deterministic daily decisions: producer supply response, buyer demand/inventory response, logistics reroute intent and government reserve review; aggregated signals feed regional stock/price calculations.
- Administrative identity master imported under `data/administrative_regions/` from the MIT-licensed `prodhokter/dataset-wilayah-indonesia` normalized dataset, derived from Kepmendagri 300.2.2-2138/2025: 38 provinces, 416 kabupaten, 98 kota, 7,285 kecamatan, 75,252 desa, 8,496 kelurahan and 14 UPT/SPT (83,762 locality records). All 38 province-level counts match the master CSVs. Actual locality names/codes load only when the dashboard locality search is used.
- Separate BPS/Podes reference is retained: 7,281 kecamatan (2024) and 84,291 desa/kelurahan units (2025); Podes 2024 breakdown 75,753 desa, 8,486 kelurahan, 37 UPT/SPT. Do not merge these with the Kemendagri-derived master counts.
- Locality names/codes are now real master records, but per-locality population is still an equal-share estimate from the province. The population status is explicitly marked `equal_share_estimate_pending_official_locality_population`; it is not actual Dukcapil village population. The dashboard can search and display country, province, regency, city, district, desa and kelurahan.
- Commodity demand is currently a category-weighted **index**, not physical tonnes/kg. All 60 catalog commodity IDs have a province-level demand index, stock, production, reserve, import and regional price index. Per-commodity physical consumption rates remain a research gate.
- Regional price index is independent by province. Lampung supply/disaster shocks change Lampung's local quote without automatically repricing DKI Jakarta. Player province defaults to DKI Jakarta and is selectable in `dunia-simulasi.html`; `js/land.js` and coconut producer quotes use the selected province quote.
- Government reserve model: opening reserve 25% of monthly demand index; target 30 days; monthly procurement max 5% of demand when reserve is below target; release trigger below 10 days and price index >1.15; release max 15% monthly demand; import cap 10% monthly demand per commodity, treasury constrained. Opening treasury Rp1 trillion is an experimental game parameter. No modeled tax-revenue replenishment or physical interprovincial shipment routing yet.
- Deterministic disaster rolls are 0.6% per province per 30-day game month; flood, drought and logistics disruptions are experimental templates. `AgroNationalEconomy.applyDisaster()` supports explicit scenario injection.
- Tier 1–4 remains in the existing 60-commodity catalog and transformation/HPP/ledger systems. National demand indexes all catalog IDs; physical consumption/production calibration by tier remains open.
- Active agents now update `lastAction`/`lastDecisionDay` daily and aggregate producer supply intent, buyer demand/inventory intent, logistics reroute intent and government reserve review. These are deterministic heuristics; no per-agent cash/inventory/contracts yet.

## Main files and commit checkpoints

| File | Commit SHA | Change |
|---|---|---|
| `js/national_economy.js` | `ab3c88997f7d4553121e50dc7b322739337bc822` | 38 provinces, 200m aggregate population, capped agents, regional stock/price, government reserves/imports, disaster API and seeded event roll |
| `js/region_capacity.js` | `b5d4b4104e41e21347384b6ede01a00f24608863` | 200m default population and active-agent bounds |
| `js/state.js` | `bd2e02fcce1ad68d91cd29a4bc6018f42d894429` | Persist player province (default DKI Jakarta) and migrate older saves |
| `js/land.js` | `1e9f6821add88839c37f2a883c66a15a18f0f474` | Regional commodity quotes for player trade |
| `js/economy.js` | `85d2eb97f1f47967a3256b800137c3cbd7655e86` | Regional coconut producer quotes; direct retail baseline remains protected |
| `js/day.js` | `b620cb97936c684d9b6aec73812a04ec9324d04d` | Daily national economy tick and government ledger memo |
| `index.html` | `0038ce026e6280a05a0594cf77bd6d037504d495` | Load national economy engine |
| `dunia-simulasi.html` | `b41063f6a4e89c0eecb95a00870a9fc06d36f8b7` | Country/province dashboard and player-region selector |
| `tests/national-economy.test.js` | `51708b895b9ad04bdd0225279aba44ca08c6784d` | Population, locality aggregates, agent cap, disaster price and reserve tests |
| `.github/workflows/targeted-regression.yml` | `deda0462db8b7eac612ea31bb052d7e1e696316b` | Add national economy test to Node regression job |
| `docs/NATIONAL_COUNTRY_AND_REGIONAL_MARKET_MODEL.md` | `0e7888e58dd10fefd0a7878b914dc8d238f68b60` | Full design, data provenance, formulas, policy settings and research backlog |
| `docs/NATIONAL_ECONOMY_RESEARCH_AND_IMPLEMENTATION_PLAN.md` | `396f8119a27c28803a215259ee71d06e9d609176` | Current implementation status and research gates |
| `docs/WORLD_SIMULATION_ENGINE.md` | `041bef2671f71765ae2d0060cfb9aa811df26790` | National aggregate simulation architecture and limits |
| `data/administrative_regions/*.csv` | See source blob SHAs in `data/administrative_regions/README.md` | 38 provinces, 514 kabupaten/kota, 7,285 districts, 83,762 locality records; loaded lazily |
| `data/administrative_regions/LICENSE*.txt` | See repository history | MIT attribution for normalized dataset and upstream source |

The national engine's initial implementation commit was `6385112255d088e0e5fa40f7ce0e99076b9cf6af`; later corrections added the administrative master loader, per-commodity monthly import cap and daily representative agent decisions. The regression suite validates the full locality CSVs, all province counts, actual code/name lookup and daily agent actions. The administrative CSV files and MIT license notices are stored in `data/administrative_regions/`.

## Test / CI status

- A new Node test-runner suite is present and included in the targeted workflow.
- Custom V8 runtime smoke executed against the GitHub-fetched source and imported CSV blobs: 38 provinces, exact 200m population, 1,132 active agents, 60 commodities, master totals 416/98/7,285/75,252/8,496/14, all per-province counts matching the master, actual Lampung locality code/name lookup, name search and daily agent decisions. All 12 checks passed.
- Deterministic control comparison: a Lampung paddy shock moved its quote from Rp10,000 to Rp13,960, while DKI Jakarta matched the no-shock control at Rp9,916 exactly. Government reserve release occurred.
- Separate 30-day all-province paddy drought scenario confirmed imports executed exactly up to the 10% monthly demand cap per commodity (20,000 index units in the test scenario).
- Static syntax checks passed for eight modified JS/test files and inline scripts in `index.html` and `dunia-simulasi.html` (three inline scripts total). The targeted workflow definition includes both `tests/background-economy.test.js` and `tests/national-economy.test.js`.
- **The Node test-runner suite and GitHub Actions are not yet verified as completed green.** Do not claim full CI or the full Node test file passed until a completed run is available.
- Existing historical green runs listed elsewhere in this document do not validate this new country model.

## Immediate next steps

1. Verify CI run for the latest test commit; inspect the first failing command and its logs if red.
2. Confirm all 38 population weights and administrative count totals through automated assertions; fix any mismatch before extending the feature.
3. Reconcile/import authoritative locality population and household data. Candidate `dhanyyudi/wilayah-id` documents Dukcapil Semester I 2024 population/household/density/area but has 83,529 village-level records and 7,282 districts, so its code coverage must be reconciled with the 83,762/7,285 administrative master before use. Prodeskel public page is also incomplete relative to the full master.
4. Replace equal-share locality population estimates and category demand indexes with physical per-capita monthly demand per commodity, province and household/industry/institutional segment; preserve rice-vs-paddy and feed-vs-food definitions.
5. Add physical production and interprovincial shipment flows; logistics reroute intent is not yet a freight shipment. Then reconcile government procurement, reserve storage losses, imports, tax revenue and public ledger.
6. Benchmark mobile performance with 38 × 60 aggregates and 1,000–5,000 active agents. The locality CSVs are loaded only on the dashboard, not during normal game ticks.

---



## Latest maize validation and source metadata correction (2026-10-28 15:47 UTC)

- GitHub Actions run **40719342746** passed on test commit `05220f710fa645f43b04dcb2334747ee049060b0`: https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40719342746. It includes assertions for official maize balance projection values, one-tonne source arithmetic discrepancies, and the corrected feed-industry source metadata.
- The feed-industry source is now titled *Pemanfaatan Jagung Lokal oleh Industri Pakan Tahun 2024*, Vol. 6 Tahun 2025, reference data year 2024, with a 2025 projection in Table 26. The alternative ~8.25 Mt value in the Pusdatin bulletin is a different industry purchase/absorption projection series; keep the method/vintage difference explicit rather than treating these as same-method observations.
- Latest docs include the exact balance table, source arithmetic audit, BPS production moisture-basis values, and Library DOCX caveats. Current branch head should be verified from the API before the next coding session; latest code/test SHA is `05220f710fa645f43b04dcb2334747ee049060b0`, and subsequent commits are documentation-only.


## Last-100-commit audit and current branch checkpoint (2026-10-28 15:48 UTC)

- Reviewed exactly the latest **100 commits** on `feat/production-tier-taxonomy`, newest `d35d2aa11ece3f429fa9edca838ae90d2c0bbb96` and oldest `e2c70cf75c97b989d77de28c1f346c4298827dab` (2026-10-28 14:59–16:00 UTC). The history is heavily concentrated on national-data/provenance additions, documentation/audit updates, tests/CI, accounting/HPP, and market/NPC/region capacity; no map/peta-related commit appears in this 100-commit window.
- Current branch HEAD at the latest repository check: `d35d2aa11ece3f429fa9edca838ae90d2c0bbb96`. Latest code/test validation: GitHub Actions run [40721447743](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40721447743) passed after adding the UTL oil-palm test; it includes the UTP and UTL benchmark guards, 13/13 Node test-runner subtests, and standalone/browser regression commands. Latest test commit: `c0fc586ad53552a6e4b78da3ec5704d39a328558`; subsequent commits are documentation-only.
- The latest 100-commit window shows that some commits are very small follow-ups to fix test harnesses, record provenance, or reconcile a source; use the current runtime/test files and latest handoff rather than assuming every individual commit independently completes a feature.
- The current default branch HEAD is `fc2f908b309b9864e8b24737f3b5f848f32d1392` (revert accidental default-branch market-engine change). No changes were made to `main` during this session. Continue only on the feature branch and keep map files untouched.
- Open evidence gates: the two feed-industry projection series (~8.25 Mt in Kementan Pusdatin vs 8,844,096 t from Ditjen PKH/SiJagung/Table 26) remain method/vintage-distinct, and Table 26 monthly-average prose has a 9,998 t/month arithmetic discrepancy. Maize moisture-basis and official projected balance are documented; final realized balance remains null. The UTP broiler discrepancy is partially reconciled by BPS Peternakan Dalam Angka 2025 Table 8.3.10, but the original SEP Table 2.10 image is still not visually verified. UTL oil-palm Table 4.2 and exact remaining UPB/UTL rows remain open. No Tier 1–4 economic model was promoted from rough Library scenarios.


## Latest maize balance/source-metadata test verified (2026-10-28)

- GitHub Actions run [40719342746](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40719342746) passed on test commit `05220f710fa645f43b04dcb2334747ee049060b0`. It includes the three Node test-runner suites (13/13), the standalone Node/browser regression commands, maize production source metadata, the official Table 5.6 projected balance fields, and the 1-tonne arithmetic discrepancy assertions.
- Runtime source metadata now correctly names the feed-industry projection source *Pemanfaatan Jagung Lokal oleh Industri Pakan Tahun 2024* (Direktorat Pakan Ditjen PKH, Vol. 6 Tahun 2025; data/reference year 2024), not the shorthand title “Buku Jagung 2025.” Its Table 26 2025 projection is 8,844,096 t from SiJagung. The separate ~8.25 Mt figure in the Pusdatin bulletin is from the industry purchase/absorption projection series. Keep the two as distinct methodology/vintage projections; status remains unresolved until comparable definitions are confirmed.
- The official Bapanas/Kementan 2025 balance projection is now stored separately from the final BPS 2025 production observation. Published projected ending balance is 5,133,909 t; the table has three 1-tonne arithmetic differences preserved in `arithmeticAudit`. `maizeNationalBalanceEstimate2025` remains null because no final realized balance is claimed.
- Research next: resolve or formally retain the feed-industry projection conflict, then continue the queued UTP broiler Table 2.10 visual reconciliation, UTL oil-palm income definition, and remaining UPB/UTL table extraction. The BPS livestock publication page is discoverable but currently returns 403 on direct page open; do not claim Table 2.10 visually verified until the original PDF or a verifiable mirror is actually inspected.


## Maize feed-projection arithmetic discrepancy added (2026-10-28)

- Found an additional source-internal arithmetic mismatch in Ditjen PKH Direktorat Pakan's *Pemanfaatan Jagung Lokal oleh Industri Pakan Tahun 2024* (Vol. 6, 2025), Table 26: quarterly projections sum to 8,844,096 t, but the prose monthly average says 727.01 thousand t. The annual total / 12 is 737,008 t/month, a 9,998 t/month gap. Runtime `maizeNationalDemand.sources.feedIndustryDemand2025.sourceArithmeticAudit` preserves both source prose and derived average; tests assert the discrepancy.
- Source title and source scope are now exact in runtime and documented in register/audit/plan. The 8.25 Mt versus 8.844096 Mt industry-only projection conflict remains unresolved due different source series/methodology; do not sum the figures or substitute either for all-channel feed demand.
- New code commit `a807fc5cae0eb9103662f63f46b7d2759d2aaa10` and regression commit `87ce13e51b7bf147ccc13f18aa6154107311b010` are verified by GitHub Actions run [40720183267](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40720183267): success, 13/13 Node subtests and the standalone/browser regression commands green. The monthly-average audit assertions passed.


## UTP broiler benchmark corroboration added (2026-10-28)

- New source found: BPS *Peternakan Dalam Angka 2025*, Table 8.3.10, printed p.122 (official metadata release 2026-01-09: https://www.bps.go.id/id/publication/2026/01/09/50771bc6f5761886458558ba/livestock-in-figures-2025.html). A public mirror exposes the table text: https://id.scribd.com/document/1009902102/Peternakan-Dalam-Angka-2025-Menurut-Bps.
- Table reports 2024 UTP broiler per 5,000 final-stock heads: production Rp152,008.05k, cost Rp126,445.06k, published income Rp25,563.00k, feed cost Rp81,754.62k (64.66%). Production minus cost is Rp25,562.99k, just Rp0.01k below reported income. This conflicts with the earlier SEP Table 2.10 transcription (cost Rp126,445.08k, income Rp28,639.72k), strongly suggesting the earlier transcription is wrong or from a different cell/column. The original SEP PDF image has not yet been visually checked; keep that gate open.
- Added research-only `REAL_ECONOMIC_DATA.utpBroilerBenchmark2024`, with the earlier transcription conflict and original-image verification status explicit. Added `tests/utp-broiler-benchmark.test.js` and CI step `Run UTP broiler benchmark provenance and arithmetic guard`. Code commit `0edc4d65ea560dff8d5b985ab36de8e71f2722b7`; test commit `59de34416f69c2dc1231bee765856104c68a7f5c`; workflow commit `5fbde4584ce867a4e88e4eef59fa95874d0569e`.
- Verified: GitHub Actions run [40720950707](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40720950707) passed after the regex correction; the UTP benchmark test printed PASS, the 13 Node test-runner subtests passed, and the standalone/browser regression commands passed. Do not use the benchmark as a Tier 1–4 production recipe.


## UTP benchmark test harness follow-up (2026-10-28)

The first CI run for `tests/utp-broiler-benchmark.test.js` failed only at its source-URL assertion because the regex contained a double-escaped dot (`/bps\\.go\\.id/`), matching literal backslashes rather than hostname dots. Corrected to `/bps\.go\.id/` in commit `d85940ddc3ad8f864ef158420cbbf15142653ecb`. This was a test assertion escaping error; the runtime source URL itself is the official BPS publication page. Check the workflow run for the correction before claiming the new suite passes.


## Library notes review scope and precedence (2026-10-28)

- Library inventory lists three primary DOCX files: `data game.docx`, `harga komoditi.docx`, and `data peternakan dan pertanian.docx`, plus prototype screenshots. Targeted semantic queries were used to retrieve economy, prices, farm cost/yield, and gameplay assumptions; this was **not** a page-by-page audit of every long DOCX section. If future work depends on a section not covered by those queries, search/read that exact section before using it.
- `data game.docx` contains legacy ad/IAP/IAA-heavy progression and large macro-economy assumptions. Those are historical design material, not the current implementation priority or official economic evidence. `harga komoditi.docx` contains illustrative margin assumptions (e.g. 25% NPM for mining) and scenario-level Coin/Rp examples; do not treat them as validated source statistics. `data peternakan dan pertanian.docx` contains broad ranges across mixed source years and locations; use only as hypothesis/reference until each farm cost, yield, price stage and margin is backed by a specific source.
- Current owner-locked coconut benchmark values and current repo contracts take precedence over conflicting illustrative Library numbers. Keep the user's whole-coconut retail benchmark and es-kelapa economics unchanged; no coconut values were altered in this work.


## UTL oil-palm source arithmetic added to runtime (2026-10-28)

- Added `REAL_ECONOMIC_DATA.utlOilPalmBenchmark2024` from BPS SEP 2024 Table 4.2, UTL oil palm per 100 trees: production Rp25,143.89k; cost Rp13,218.16k; published income Rp12,046.95k; productivity 12,443.49 kg/100 trees. Source note mentions rounding and incomplete cost/subsidy imputation, but does not explicitly reconcile the differences.
- Listed components sum to Rp13,212.48k (Rp5.68k below published cost); production minus cost is Rp11,925.73k (Rp121.22k below published income). Values and deltas are stored separately; this is research-only and not a Tier 1–4 recipe. Original table image is still not visually verified.
- Added `tests/utl-oil-palm-benchmark.test.js` and CI step; commits will trigger a new workflow. Verify the latest run before claiming this benchmark test passes. Source mirror: https://id.scribd.com/document/1007237393/hasil-survei-ekonomi-pertanian-sep-2024-nilai-dan-biaya-produksi-beberapa-komoditas-utama-pada-subsektor-tanaman-pangan-hortikultura-dan-perkebun. Official publication metadata: https://www.bps.go.id/id/publication/2025/01/24/52f47865afe337fd047404a8/hasil-survei-ekonomi-pertanian-sep-2024-nilai-dan-biaya-produksi-beberapa-komoditas-utama-pada-subsektor-tanaman-pangan-hortikultura-dan-perkebunan.html.


## UTL benchmark CI verified (2026-10-28 16:00 UTC)

GitHub Actions run [40721447743](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40721447743) passed. `tests/utl-oil-palm-benchmark.test.js` printed PASS; the three Node test-runner suites passed 13/13, and the standalone Node/browser regression commands passed. UTL oil-palm values remain research-only with cost-component gap (Rp5.68k) and income gap (Rp121.22k) preserved; source note mentions incomplete cost/subsidy imputation but does not explicitly reconcile the figures. Original table image verification is still open.


## Official-source visual/text reconciliation update — broiler and UTL oil palm (2026-10-29)

- Re-opened the official BPS SEP 2024 crop/estate PDF from the BPS download endpoint and visually inspected printed page 32 / Table 4.2 for UTL oil palm. The image confirms production Rp25,143.89k, cost Rp13,218.16k, income Rp12,046.95k, productivity 12,443.49 kg per 100 trees and listed cost components. Mark image verification complete; the source arithmetic gaps remain open (component sum Rp13,212.48k, Rp5.68k below cost; production minus cost Rp11,925.73k, Rp121.22k below published income). Do not call these gaps “rounding only”: the note mentions rounding and unestimated cost/subsidy imputation but does not specifically reconcile the values.
- Opened the official BPS SEP 2024 livestock PDF directly and inspected its extracted text for Table 2.10 (printed p.23, PDF page labelled P40). The original PDF text confirms the earlier values exactly: production Rp152,008.05k, cost Rp126,445.08k, published income Rp28,639.72k per 5,000 final-stock heads. The arithmetic mismatch is therefore present in the official PDF's text layer, not merely a later secondary transcription. Screenshot rendering of this page timed out, so visual image verification remains open. The later BPS *Peternakan Dalam Angka 2025* values (cost Rp126,445.06k; income Rp25,563.00k) are a separate publication series that reconciles within Rp0.01k; preserve both and do not silently overwrite either source.
- Runtime provenance and regression tests updated to represent these distinct verification states. This is research-only; no Tier 1–4 recipe or game economy parameter is promoted. Latest verified regression before this metadata-only adjustment: Actions run [40721447743](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40721447743) passed the UTL benchmark test, 13/13 Node test-runner subtests and standalone/browser regression commands. A fresh workflow is required to validate these latest edits.


## BPS income-definition gate — UTL oil palm and UTP broiler (2026-10-29)

The official BPS SEP 2024 technical notes define “income” as the difference between production value and production cost (official crop/estate PDF, PDF page P23, lines 759–760 in the extracted text). Therefore the UTL Table 4.2 printed income Rp12,046.95k differs from the derived production-minus-cost Rp11,925.73k by Rp121.22k, a real unresolved source discrepancy, not something we can explain solely by rounding. The table image is now visually verified; retain the printed value and the derived value separately. The listed cost components sum to Rp13,212.48k, Rp5.68k below published cost Rp13,218.16k. BPS also notes some cost/subsidy imputations were not estimated; whether that explains either gap is not established.

For UTP broiler Table 2.10, the official PDF text layer confirms production Rp152,008.05k, cost Rp126,445.08k, income Rp28,639.72k per 5,000 final-stock heads. Under BPS's own income definition, derived income is Rp25,562.97k, leaving a Rp3,076.75k mismatch. The official table image still could not be rendered due repeated timeout. Later BPS *Peternakan Dalam Angka 2025* uses cost Rp126,445.06k and income Rp25,563.00k, which reconciles within Rp0.01k; retain both publications independently and do not silently correct the earlier table. No game/Tier parameter is changed.


## Current continuation checkpoint — 100-commit review and livestock regression (2026-10-29)

- Re-read the latest 100 commits on `feat/production-tier-taxonomy`; current HEAD at audit start was `4542f168564d6303e5983b0075cbdd77ba002adf`. The reviewed range spans 2026-10-28 to 2026-10-29 and contains no map/peta work. Other branches remain untouched; never work on `main`.
- Current verified workflow: GitHub Actions run [40792046198](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40792046198), on test commit `91a196490a005f47fc84f09819281878860db7b6`, passed. It ran 13/13 Node test-runner subtests; UTL and UTP benchmark guards; all listed standalone Node tests; browser smoke; and gameplay, finance/payroll, legacy-save and corrupt-save E2E tests. This verifies that commit, not necessarily later documentation-only HEAD commits.
- Three earlier CI failures were triaged from logs rather than inferred: (1) UTL test expected the old visual status after the official Table 4.2 image was verified; (2) UTP test expected outdated wording for the original Table 2.10 caution; (3) related UTP provenance assertion failed while source metadata was being updated. Current UTL and UTP benchmark tests now pass in run 40792046198. Preserve this audit trail; do not revert the updated source verification states.
- Source status: UTL oil-palm Table 4.2 image is verified against the official BPS PDF, but cost components still total Rp13,212.48k vs published cost Rp13,218.16k (-Rp5.68k), and published income Rp12,046.95k differs from production minus cost Rp11,925.73k (+Rp121.22k). The official BPS technical note defines income as production minus cost, so this gap remains unresolved.
- UTP broiler Table 2.10's original official PDF text layer was verified, but image verification remains open. Original published production/cost/income are Rp152,008.05k / Rp126,445.08k / Rp28,639.72k; arithmetic income is Rp25,562.97k, gap Rp3,076.75k. Later *Peternakan Dalam Angka 2025* reports cost Rp126,445.06k and income Rp25,563.00k, reconciling within Rp0.01k. Keep the publication records separate; do not silently overwrite or promote to a Tier recipe.
- Next research task: continue the queued extraction of remaining UTP livestock tables and relevant UPB/UTL tables from the official BPS SEP 2024 livestock publication, with exact printed page, product class, unit/denominator, reference period, cost components and income definition. Search snippets or a secondary mirror alone do not satisfy verification. If official PDF access/image rendering is blocked, record the blocker and leave the table out of runtime rather than inventing values. Then resolve the maize feed projection method/vintage conflict. Do not promote research-only benchmarks into the 60-commodity Tier 1–4 model without matched primary evidence.


## Continued work — 100-commit audit and UTP cattle data gate (2026-10-29)

- Rechecked the latest 100 commits on `feat/production-tier-taxonomy`; the range begins at `15a081e92bc76599e4e8682de42e7734fe1bb762` and reaches `7f64e61101e2` (100th listed commit). The newest commits update livestock source verification, BPS income-definition discrepancies, and regression status. No map work is in scope.
- Prior green workflow [40792046198](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40792046198) passed at test commit `91a196490a005f47fc84f09819281878860db7b6`; it does not include the new cattle benchmark dataset/test added in this continuation.
- Added `REAL_ECONOMIC_DATA.livestockBenchmarksUtp2024` for BPS *Peternakan Dalam Angka 2025* Tables 8.3.1–8.3.3: beef cattle, dairy cattle and meat buffalo, each per head. Official publication metadata is verified, but the PDF endpoint timed out and the numeric table transcription came from a public mirror. Data is marked research-only with `official_catalog_confirmed_secondary_table_transcription_not_primary_pdf_verified`; original table images are not verified.
- Arithmetic gates are explicit: beef cattle production minus cost differs from reported income by +Rp0.01 thousand and component sum exceeds reported cost by Rp0.01 thousand; dairy component sum is Rp0.01 thousand below reported cost; buffalo component sum is Rp106.65 thousand below reported cost. Do not smooth, overwrite or promote these values to Tier recipes.
- Added `tests/utp-livestock-benchmarks.test.js` and a CI step in `.github/workflows/targeted-regression.yml`. The GitHub Actions run triggered by the test/CI commits is now green: run [40857528843](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40857528843), commit `92fcef854c2219d1c68a51c7d3fc4b786296409f`. The UTP cattle benchmark step and all subsequent standalone Node/browser E2E steps completed successfully. This verifies that tested code commit; latest HEAD is documentation-only commit `8a7ed1716aa244d22fd150fdce653778cc9a4d7c`.
- Next task: visually verify official BPS tables 8.3.1–8.3.3, investigate the buffalo cost-component gap, then continue remaining UTP/UPB/UTL tables. If official PDF retrieval remains blocked, document that blocker and do not claim primary-source visual verification. Afterwards revisit the maize feed projection method/vintage conflict. Continue on this feature branch only; never modify `main` or map files.


## Regression result — UTP cattle benchmark guard (2026-10-29 10:27 UTC)

- Workflow [40857528843](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40857528843) completed successfully on code/test/CI commit `92fcef854c2219d1c68a51c7d3fc4b786296409f`.
- New step `Run UTP cattle benchmark provenance and arithmetic guard` passed. The full workflow also passed the market/NPC/inventory Node test-runner suite, UTL and UTP benchmark guards, all standalone Node tests, browser smoke and all listed browser E2E suites. Logs include accounting, tier-chain, transformation, double-entry, harvest, coconut benchmark, finance, household stock, payroll, real-economy data, rice, maize, unit-economics and world-simulation tests.
- Latest branch HEAD after documentation updates is `8a7ed1716aa244d22fd150fdce653778cc9a4d7c`; the latest commits after the tested SHA are documentation-only. No local test run was performed in this environment; verification is from GitHub Actions.


## UTP benchmark dataset expanded (2026-10-29; new regression pending)

- Added Table 8.3.5 meat goat and Table 8.3.7 native chicken values to `REAL_ECONOMIC_DATA.livestockBenchmarksUtp2024.records`; expanded `tests/utp-livestock-benchmarks.test.js` to assert both aggregates, feed costs, component sums and deltas.
- Goat: production/cost/income Rp660.93k/Rp155.39k/Rp505.54k per head; listed components Rp155.38k (-Rp0.01k). Native chicken: Rp34.15k/Rp15.61k/Rp18.53k per head; derived income Rp18.54k (-Rp0.01k vs published) and component sum Rp15.62k (+Rp0.01k vs published cost).
- These remain secondary-transcribed, research-only figures; primary official PDF images are not verified. The previous green run 40857528843 verifies the prior 3-record version only. Wait for and inspect a new CI run triggered by code/test changes before claiming the expanded dataset passes.


## Expanded UTP livestock regression — green (2026-10-29 10:29 UTC)

- Workflow [40857810264](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40857810264) passed on expanded test commit `91e0e1cb5baa7f712199b9e020814b19aebab329`; code dataset commit `232901abd2415c6525ac8d2a90e35a28b66ea315` also has a successful workflow [40857792651](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40857792651).
- The test now covers five records: beef cattle, dairy cattle, meat buffalo, meat goat and native chicken. The new goat/chicken values, source gate, denominators and arithmetic deltas passed, along with the full existing Node/browser regression chain.
- This green result validates implementation/test consistency only. Official PDF table images remain unverified for all five records, and the buffalo cost-component gap remains Rp106.65 thousand. Do not treat green CI as proof of source accuracy or as authorization to promote the data to Tier recipes.
- Next: resolve primary PDF visual verification and buffalo component gap; then extract remaining UTP tables, followed by matched UPB/UTL evidence. If PDF access continues to time out, leave the gate open and continue with other primary-source tables.


## UTP laying-duck benchmark added — CI pending (2026-10-29)

- Added BPS *Peternakan Dalam Angka 2025* Table 8.3.8 to `livestockBenchmarksUtp2024.records.layingDuckPer1000Heads`: per 1,000 heads, production Rp140,316.23k, cost Rp75,420.46k, income Rp64,895.77k, feed Rp60,009.13k / 79.57%; listed cost components sum to published cost and production-minus-cost matches income.
- Added assertions to `tests/utp-livestock-benchmarks.test.js`. This new code/test revision supersedes the previous green run for five records; wait for the new GitHub Actions run before claiming the six-record dataset passes.
- Original BPS PDF table image remains unverified. This is not per-egg HPP or a Tier recipe; obtain egg yield, mortality, production period and source-backed denominator before calculating per-egg economics.


## UTP Manila duck and broiler page locator correction — CI pending (2026-10-29)

- Added `manilaDuckPerHead` from BPS *Peternakan Dalam Angka 2025* Table 8.3.9 (printed p.122): production Rp39.80k, cost Rp20.75k, income Rp19.06k, feed Rp15.56k / 74.98%. Production minus cost is Rp19.05k (+Rp0.01k reported-income delta); components sum to reported cost. Source remains mirror-transcribed, primary PDF image unverified.
- The publication TOC places Table 8.3.9 at p.122; corrected the following broiler Table 8.3.10 locator from p.122 to p.123 in runtime and added a regression assertion. This is a locator correction based on the TOC, not visual verification of the original broiler table.
- Latest green run 40858229396 covered the previous six-record dataset. The Manila-duck addition and page-number correction have new code/test commits; wait for the new workflow run before claiming the expanded set passes.



## CI follow-up — seven UTP livestock records and page QA (2026-10-29 10:34 UTC)

- Green workflow runs: [40858451709](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40858451709), [40858426631](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40858426631), [40858399187](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40858399187). The latest test commit is `f0367036cb40b7d124a0119d1e4c288c5f89f6ee`; it verifies the new Manila-duck record and corrected broiler page metadata. Full workflow passed.
- The dataset now includes seven UTP records: beef cattle, dairy cattle, meat buffalo, meat goat, native chicken, laying duck (per 1,000 heads), and Manila duck. Every record stays `research_reference_only` because the source table figures are mirror-transcribed and original PDF images are not verified.
- Two interim workflow failures after the laying-duck insertion were caused by an extra closing brace in the runtime data object; the syntax correction is commit `2e4d7ca8c7318a55403a324b1efe72ed1095206d` and its full workflow passed in run [40858229396](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40858229396). Preserve the failure/fix trail; do not hide it.
- Pagination QA: TOC lists Table 8.3.9 (Manila duck) at printed p.122; broiler Table 8.3.10 follows at p.123. Runtime and test now reflect p.123. This is a table-of-contents locator check, not visual verification of the table page.
- Remaining work: primary PDF image verification; reconcile buffalo's Rp106.65k component gap; continue remaining UTP/UPB/UTL tables; then return to maize feed-projection source-vintage/method conflict. No Tier recipe promotion, no main/map edits.


## Current HEAD and renewed 100-commit audit checkpoint (2026-10-29 10:35 UTC)

- Re-fetched the current latest 100 commits after the livestock implementation. Range: HEAD `ed19a1653438ddcdedf6b7adda4aaa20d492c3d4` (2026-10-29 10:34:37 UTC) back to `97d05155cb76e423eb055f03c3bbfbb5ddcf5f33` (2026-10-28 15:45:10 UTC). Themes include national maize production/demand/source-vintage QA, NPC market/economy regression, rice balance and semantics, livestock cost benchmarks, source provenance and CI/handoff corrections. The newest five commits are documentation checkpoints following a successful code/test run.
- Branch heads: `feat/production-tier-taxonomy` = `ed19a1653438ddcdedf6b7adda4aaa20d492c3d4`; `fix/core-auto-warung-accounting-ui` = `fc951b248eea487f09c8b683c782aff1dfc6c222`; `main` = `fc2f908b309b9864e8b24737f3b5f848f32d1392`. Work remains on the feature branch only; no map files changed.
- Latest green test run for current data/test implementation: [40858451709](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40858451709), test commit `f0367036cb40b7d124a0119d1e4c288c5f89f6ee`. The new seven-record UTP livestock test and all existing regression/E2E steps passed. Latest HEAD commits after the test SHA are documentation-only.
- Source evidence gate remains open: the new cattle, goat, native chicken, laying duck and Manila duck records are secondary-transcribed from a public mirror of BPS `Peternakan Dalam Angka 2025`; official catalogue metadata is verified but original table images are not. Do not promote these to Tier recipes. Buffalo component sum remains Rp106.65 thousand below the reported total cost.
- Next work item: continue official primary-source table verification and remaining UTP/UPB/UTL extraction; if the official PDF remains inaccessible, record the exact blocker and proceed to other verifiable primary tables. Then return to the unresolved maize feed-industry projection method/vintage conflict. Maintain code + register + audit + plan + handoff updates for every data addition.


## Renewed 100-commit review and primary-source access attempt (2026-10-30)

- Re-fetched the latest 100 commits on feat/production-tier-taxonomy. Current HEAD at review start: 2aae7b164db94c3169cf54d7b86dc17e69e4ea57; oldest commit in this 100-entry window: 0225185302f3... (maize balance handoff). The newest 45 commits are the livestock evidence sequence (BPS UTP cost benchmarks, source/page corrections, regression gates and handoff updates); older entries cover maize national balance/feed projection arithmetic, rice demand, NPC market/inventory regressions and their CI fixes. Do not infer 100 commits = 100 completed tasks; several are successive documentation checkpoints or corrective commits.
- Rechecked Actions: full workflow run [40858451709](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40858451709) is green for test commit f0367036cb40b7d124a0119d1e4c288c5f89f6ee; it covers the seven-record UTP livestock regression and existing Node/browser/E2E suite. HEAD is later than that test SHA but latest commits in the inspected range are documentation-only. Do not describe the current HEAD itself as a newly tested code SHA.
- Primary-source retry: official BPS catalogue for Peternakan Dalam Angka 2025 confirms catalogue 5301008, publication 05200.26001, release 9 Jan 2026, 19.34 MB. Official BPS catalogue page is searchable, but opening it returned HTTP 403 in the browser fetch; the BPS-hosted SEP 2024 livestock download endpoint timed out (HTTP 400 timeout on retrieval). No original table image was verified in this pass. Keep the seven later-publication UTP rows as secondary-transcribed research references; do not promote them to Tier data. This access failure is recorded, not interpreted as evidence the source data are false.
- Open arithmetic issue remains: meat-buffalo cost components total Rp427.32k against published cost Rp533.97k, a -Rp106.65k gap. Preserve the discrepancy; no inferred component should be added.
- Next concrete work: return to the maize feed-industry projection conflict already in runtime (8,844,096 tonnes versus rounded ~8.25 million tonnes), compare exact source tables, period, scope and method; maintain the existing null/reconciliation guard until resolved. In parallel, retry official livestock primary-table verification through an alternate BPS official delivery route only if it yields the actual PDF/page image. No map or main edits.


## Maize feed-industry projection reconciliation — primary PDFs inspected (2026-10-30)

- Opened the official Kementan Ditjen PKH PDF, Pemanfaatan Jagung Lokal oleh Industri Pakan Tahun 2024, Vol. 6 Tahun 2025: https://ditjenpkh.pertanian.go.id/storage/master/file/8EG4sdWw_2025_Buku_Jagung_%281%29.pdf. Table 26 (printed p.44 / PDF page 53) reports 8,844,096 t as the 2025 SiJagung-reported industry-need projection; the quarterly totals sum exactly to that annual total. The prose says 727.01 thousand t/month, but annual/12 = 737,008 t/month, a preserved 9,998 t/month discrepancy.
- Opened the official Kementan Pusdatin Buletin Konsumsi Pangan Vol. 16 No. 1 Tahun 2025: https://satudata.pertanian.go.id/assets/docs/publikasi/Buletin_Konsumsi_Pangan_Smtr1-2025-Ok.pdf. Printed p.32 / PDF page 36 describes approximately 8.25 Mt for feed factories and approximately 5.36 Mt for independent/self-mixing farmers; Figure 5.4 (printed p.35 / PDF page 39) labels the factory figure as a series of industry purchases/absorption, not the same Table 26 SiJagung-reported need projection.
- Derived comparison: 8.844096 Mt - 8.25 Mt = 0.594096 Mt. Separately, 8.25 Mt + 5.36 Mt = 13.61 Mt, only 7,000 t above the bulletin's rounded 13.603 Mt feed-use total. This is a consistency check on rounded series, not proof of exact equivalence. Runtime now labels the series distinction explicitly and retains the residual/rounding status instead of treating the two factory projections as interchangeable.
- Runtime/test commits: data 5d96a3461c33a5daca26b5ec866aa71db01d162d; regression guard ceed808abbe6a0f05bfc31d5c369cb0c853497a2. Wait for the full GitHub Actions workflow before calling the new guard green. Do not change the official national total-demand projection or the separate 2025 balance values.


## CI result — maize projection-series guard (2026-10-30)

- GitHub Actions run [41009050507](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/41009050507) completed successfully at test commit ceed808abbe6a0f05bfc31d5c369cb0c853497a2. The node-regression job passed, including tests/maize-national-demand.test.js and all later steps in that job.
- Preserve the preceding failure in run [41009037960](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/41009037960): the data-only commit changed the runtime status before the test expectation was updated, so the old assertion correctly failed. The following test commit updated the expected status and added explicit checks for both source series and the 594,096 t / 7,000 t derived comparisons; that run is green.
- The CI pass validates code assertions and regression coverage, not the policy validity of the underlying projections. Keep both source figures, the source monthly-average arithmetic discrepancy and the 7,000 t rounded-series gap visible. Current documentation commits follow the tested code SHA; do not describe them as a separate code-test run.


## Final checkpoint after maize series fix (2026-10-30 05:35 UTC)

- Current pre-checkpoint HEAD observed after documentation updates: 24280cfb82a761ed363aa5499626ee65a472eca1. The renewed 100-commit window runs from this checkpoint window back to f2738450f48a7f01c8c281d80e9f8618b747c191; themes remain maize national balance/feed series, livestock UTP evidence, rice, NPC market/inventory/accounting regressions, and CI/handoff corrections. Branch heads at the latest branch query: feature 24280cfb82a761ed363aa5499626ee65a472eca1; accounting/UI branch fc951b248eea487f09c8b683c782aff1dfc6c222; main fc2f908b309b9864e8b24737f3b5f848f32d1392. Only feature branch was modified.
- Maize feed series source distinction is now encoded in runtime and tests: SiJagung-reported need projection 8,844,096 t versus factory purchase/absorption series about 8.25 Mt; independent/self-mixing feed about 5.36 Mt; combined rounded comparison 13.61 Mt versus rounded national feed need 13.603 Mt (7,000 t difference). Source Table 26 monthly prose remains discrepant by 9,998 t/month against annual/12. Do not erase these deltas.
- Latest relevant CI: run 41009050507 passed at test SHA ceed808abbe6a0f05bfc31d5c369cb0c853497a2. Run 41009037960 failed on the stale status assertion at the earlier data-only commit; the next test commit corrected it and the full node-regression job passed. The previous seven-record UTP livestock full regression passed in run 40858451709 at f0367036cb40b7d124a0119d1e4c288c5f89f6ee.
- No local test execution was possible in this session; GitHub Actions results above are the actual executed CI evidence. The latest code changes are tested by the relevant successful workflow; documentation-only commits after the test SHA are not separately tested as code.
- Next task: verify remaining UTP/UPB/UTL data against primary tables where access allows, preserve unresolved buffalo component gap (-Rp106.65k), then audit other unfinished source/implementation tasks from the current 100-commit window. No main or map changes.

## UTP livestock arithmetic guard expansion (2026-10-30)

- Current branch feat/production-tier-taxonomy reviewed through the latest 100 commits; the current audit window starts at 195c159b96a152f2fdf73d22bd4f6d4a1b75bbf2 and reaches back to a807fc5cae0eb9103662f63f46b7d2759d2aaa10. Themes include maize balance/feed demand, seven UTP livestock benchmark records, source-page corrections, UTL oil-palm, broiler source reconciliation, and prior rice/NPC/accounting regression work.
- Test commit 6e15b8691a88781923dcd2b798042ef297b41e22 extends tests/utp-livestock-benchmarks.test.js to check each record's component totals, component-vs-published-cost deltas, production-minus-cost, published-income deltas, and research-only status. All seven current UTP records are covered, including rounding deltas and the unresolved buffalo gap (-Rp106.65 thousand).
- CI run 41056766643 was in progress at the last check; do not report this new test as green until the run completes and its job result is inspected.
- Primary-source access was re-attempted: BPS's official catalogue confirms Hasil Survei Ekonomi Pertanian (SEP) 2024 Subsektor Peternakan, catalogue 5301012, publication 05200.25001, release 2025-01-24, file 8.14 MB. The official download endpoint timed out in retrieval, so the current UTP values remain secondary-table transcriptions from Peternakan Dalam Angka 2025; no primary-PDF visual verification is claimed. Preserve the quality gate and all reported/derived deltas.
- Next: inspect the new CI result, then continue primary-table verification only if the official PDF can be obtained. Otherwise record the access limitation and move to a source family that can be directly verified. No production runtime values, main, or map files changed in this task.
## CI result — UTP livestock arithmetic guard passed (2026-10-30)

GitHub Actions run 41056766643 completed successfully at test commit 6e15b8691a88781923dcd2b798042ef297b41e22. The node-regression job is green and has no failed steps. This verifies the new programmatic assertions across all seven UTP records; it does not resolve the buffalo -Rp106.65 thousand component gap or substitute for direct verification of the official primary tables. The official BPS SEP 2024 livestock PDF download still timed out during this retrieval. The following commits update existing documentation only; they are not separate code-test runs.
## Latest HEAD and refreshed 100-commit audit (2026-10-30 12:40 UTC)

- Actual feature HEAD: 642cb7ab39be633711c73006c34b81e7e9fa58f1. The latest 100 commits run from this HEAD back through 5fbde4584ce867a4e88e4eef59fa95874d0569e1. Branch heads verified: feat/production-tier-taxonomy = 642cb7ab39be633711c73006c34b81e7e9fa58f1; fix/core-auto-warung-accounting-ui = fc951b248eea487f09c8b683c782aff1dfc6c222; main = fc2f908b309b9864e8b24737f3b5f848f32d1392. Continue only on the feature branch; do not modify main or map files.
- Within the refreshed 100-commit window, themes are the maize national balance/feed-demand series, the UTP livestock benchmark evidence and CI fixes, BPS/UTL oil-palm and broiler source reconciliation, and the recent test/handoff commits. The older handoff checkpoint range ending at a807fc5... is historical and has now been superseded by this newer window.
- The latest test commit 6e15b8691a88781923dcd2b798042ef297b41e22 passed GitHub Actions run 41056766643 (node-regression, no failed steps). Later commits are documentation-only and have not been separately tested as code. Maize series guard passed run 41009050507. Historical failure 41009037960 was a stale expected-status assertion at the preceding data-only commit; the following test commit updated it and passed.
- Remaining evidence gate: the official BPS SEP 2024 livestock publication page is verified, but direct PDF retrieval timed out. UTP values remain secondary-table transcriptions and research-only; do not promote to Tier 1–4. Preserve the buffalo component residual of -Rp106.65 thousand and all rounding deltas. Next work should target a primary source that can be directly opened and verified, while separately retrying the BPS livestock PDF only if the access path changes.
- Work in this continuation changed one test file and four existing documentation files; no runtime data, production logic, main, or map files were changed. Do not rerun the entire broad audit immediately; use this checkpoint, inspect the next concrete source/implementation target, and update existing documentation after each work item.

## Current checkpoint — 100-commit review and next evidence gate (2026-10-31)

- Re-fetched the latest 100 commits on `feat/production-tier-taxonomy`. Actual HEAD is `80c9ddbd50e957b755ce3a89dd5fef3ac788e1a7`; the window runs back to `cf7bdffa9dae62afa409664ea75006c674ef12ce`. The previous checkpoint at `642cb7ab...` is stale and must not be used as current HEAD.
- Current branch heads observed: `feat/production-tier-taxonomy` = `80c9ddbd50e957b755ce3a89dd5fef3ac788e1a7`; `fix/core-auto-warung-accounting-ui` = `fc951b248eea487f09c8b683c782aff1dfc6c222`; `main` = `fc2f908b309b9864e8b24737f3b5f848f32d1392`. Continue only on the feature branch; do not change `main` or map files.
- The 100-commit window primarily covers the maize national balance and feed-demand scope audit; research-only UTP livestock benchmarks (cattle, buffalo, goat, native chicken, laying duck, Manila duck, broiler); BPS/UTL oil-palm and broiler income-definition/source reconciliation; and associated regression/checkpoint commits. The last ten commits are mostly handoff/audit checkpoint updates; avoid adding another checkpoint-only series without advancing a concrete task.
- Latest verified code regression remains UTP livestock arithmetic test commit `6e15b8691a88781923dcd2b798042ef297b41e22`, GitHub Actions run `41056766643` passed (node-regression job, no failed steps). Maize series regression commit `ceed808abbe6a0f05bfc31d5c369cb0c853497a2`, run `41009050507`, also passed. The current HEAD after those test commits contains documentation-only changes; do not imply those later commits ran the suite independently.
- Open primary-source gate: BPS catalogue entry for *Hasil Survei Ekonomi Pertanian (SEP) 2024 Subsektor Peternakan* is verified (catalogue 5301012, publication 05200.25001, released 2025-01-24, 8.14 MB), but direct PDF/table retrieval remains unavailable in the present path. A fresh search reconfirmed the official catalogue metadata, not the table values. Keep all seven UTP records `research_reference_only`, and preserve the buffalo component residual `-Rp106.65 thousand` plus all reported-vs-derived rounding deltas. Do not promote these to Tier 1–4 recipes.
- Next work: pursue a genuinely accessible primary table/source or switch to another official source family that can be directly inspected. Do not spend another cycle reprinting audit docs; any next commit should either advance source verification or implementation/tests. No production runtime logic, main, or map files changed in this checkpoint.


## New implementation — official 2024 livestock price series (2026-10-31)

- Added `REAL_ECONOMIC_DATA.livestockPrices2024` in `js/real_economic_data.js`, sourced from the directly accessible official PDF *Statistik Peternakan dan Kesehatan Hewan 2025*: https://ditjenpkh.pertanian.go.id/storage/master/file/DBAZgfzg_Buku_Statistik_2025_ISSN.pdf.
- Registered six 2024 national-average series with source table/page, market stage, units and regional high/low: live cattle producer Rp51,625/kg live weight; live broiler producer Rp22,067/kg live weight; producer layer egg Rp25,539/kg; consumer beef Rp135,290/kg; consumer broiler meat Rp37,277/kg; consumer layer egg Rp30,275/kg. Producer tables are 3A.1–3A.3 (printed pp.33–34); consumer tables are 3B.1–3B.3 (printed pp.35–37). These are historical annual averages, not today's prices or HPP recipes.
- Added `tests/livestock-prices-2024.test.js` and wired it into `.github/workflows/targeted-regression.yml`. The test is **not yet verified green** at the time this handoff text was written; fetch the workflow run for the latest commit, inspect logs, fix any assertion/source metadata mismatch, and only then record success.
- This new price source does not close the separate BPS UTP cost benchmark gate. Keep the seven UTP cost records research-only and preserve the buffalo -Rp106.65 thousand component gap. Do not touch `main` or map files.


## CI result — official livestock price regression green (2026-10-31)

GitHub Actions run [41184860562](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/41184860562) passed for test commit `9d1e6f2f934f096d3671f0b743e6bf051bda8ef8`. The `node-regression` job completed successfully, including the Node test-runner suites, UTL/UTP benchmark guards, all standalone Node regression tests, browser smoke and E2E steps. Workflow commit `b514916441a1baf18953203769b2ea4b03087d1b` also passed run [41184868805](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/41184868805). The test validates registered source metadata and six recorded values; it does not make these historical prices current market quotes or production costs.


## Final handoff checkpoint — 2026-10-31 after livestock-price CI

- Feature branch HEAD before this handoff-only update: `0e60b58582fd0a09f90858b7333981924a856264`. The refreshed 100-commit window at that point ran from `0e60b58582fd0a09f90858b7333981924a856264` back to `7ba5a8ee4b5ef1a8df4f45ad2db5b4e766c131ea`. Branch heads remain: feature branch `0e60b585...`, `fix/core-auto-warung-accounting-ui` = `fc951b248eea487f09c8b683c782aff1dfc6c222`, and `main` = `fc2f908b309b9864e8b24737f3b5f848f32d1392`. No writes to main or map files.
- Current code change: `js/real_economic_data.js` now registers six source-backed 2024 livestock producer/consumer price averages from the official Ditjen PKH PDF; `tests/livestock-prices-2024.test.js` validates all six records and provenance; `.github/workflows/targeted-regression.yml` runs the test.
- Verification: run 41184860562 passed at test commit `9d1e6f2f934f096d3671f0b743e6bf051bda8ef8`; workflow commit `b514916441a1baf18953203769b2ea4b03087d1b` passed run 41184868805. Both node-regression jobs completed successfully, including the full standalone and browser/E2E sequence. Four existing research/handoff documents record the data and test outcome. Documentation-only commits after the workflow run were not independently rerun, and no claim of local test execution is made.
- Remaining next task: primary-source verification of BPS UTP livestock cost tables is still open. Keep the seven UTP records research-only and preserve the buffalo -Rp106.65 thousand component residual. Next work should advance this source gate or a separate concrete implementation/test task; avoid another audit-only loop.


## Material-purchase recommendation cap correction (2026-11-01)

- Verified current feature-branch HEAD before editing: `b0f40e6ab00df9f61db2abe3324d4488d922ab5b`.
- Fixed `js/economy.js::materialPlan()`: the prior `Math.ceil(deficit / packageSize)` could recommend a full package that pushes ice, syrup, or cups beyond the stated 150% demand-stock target. The UI already promised to lock recommendations to zero when a whole package would exceed the cap; runtime logic now recommends only whole packages that fit, and zero when even one package would exceed the target.
- Added a regression case to `tests/accounting-inventory.test.js` for normal deficits, deficits smaller than one package, and near-cap inventory.
- Validation: GitHub Actions run [41319660049](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/41319660049) passed on test commit `49fa8f605eac02c394d95b5328267e3d071bbbac`; the inventory-accounting suite and all configured standalone/browser regression commands completed successfully. No local test execution is claimed.


## External coconut purchase input validation (2026-11-02)

- Re-verified feature branch after the prior change; prior branch HEAD was `becfc127a766b5a1df45eb42a034b8821945910c`.
- Found that `buyKelapaLuar()` displayed an HTML `max="200"` limit, but `confirmBuyKelapa()` enforced only `qty > 0`. The UI limit could be bypassed by manually entering more than 200 units; `parseInt` also silently truncated fractional quantities.
- Updated `js/economy.js` to require a whole-number quantity from 1 through 200 before any cash, inventory, monthly allowance, or ledger mutation.
- Added `tests/accounting-inventory.test.js` coverage for invalid inputs (0, negative, 201, fractional, empty, nonnumeric) and both valid boundaries (1 and 200).
- Validation status for this new change: awaiting GitHub Actions run. Do not claim it passed until the workflow reports success. The previous run validates the preceding stock-cap change only, not this new quantity validation.


### CI follow-up — coconut purchase boundary regression (2026-11-02)

- The first workflow run for the quantity-validation test, [41407054903](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/41407054903), failed in the new test fixture, not in the production validation logic: the valid maximum case (200 coconuts at Rp5,000 each) had only Rp100,000 cash, so the game correctly rejected the purchase for insufficient funds. The test incorrectly expected the purchase to succeed.
- Corrected tests/accounting-inventory.test.js to fund valid boundary cases with Rp1,100,000, enough to exercise both 1- and 200-unit success boundaries while retaining separate invalid-input/no-mutation checks.
- Test fixture correction commit: 11777f82d0d42fb80705412d10d4db840008b167. CI must be checked again for this commit before recording the quantity-validation regression as green. Do not interpret the failed run as a production-code failure or claim the updated test has passed before its workflow completes.


### Manual warung package validation (2026-11-02)

- Further review found buyManual() used parseInt() and clamping, so a fractional entry such as 1.5 was silently accepted as 1 package, and malformed entries were silently converted to zero. This was inconsistent with explicit package-count input semantics.
- Updated js/economy.js to reject empty, non-integer, negative, nonnumeric, and over-1,000 package counts before any cash, inventory, cost, or ledger mutation. Added regression coverage for all three package fields in tests/accounting-inventory.test.js.
- CI follow-up: the first funded-boundary correction still had a stale expected-cash assertion based on the old Rp100,000 fixture. Corrected it to use the new Rp1,100,000 fixture in commit a3b68bb4949fc1c4e77bfef511208576f0eb7dba. Check the latest Actions run for this commit and report the actual outcome; earlier failures are test-fixture assertion failures, not evidence of a runtime defect.


### Manual package parser regression follow-up (2026-11-02)

- Review of the first manual-quantity patch found the integer regex was over-escaped, which would reject valid numeric package counts. Corrected the regex in js/economy.js and added a positive-path regression test confirming one ice sack correctly deducts Rp20,000 and adds 40 portions with the corresponding inventory value.
- Code commit: 15b1fe5f176e3442a562b882cb0e2ea9ed88112d. Positive-path test commit: cda3d9457d3c3f8bd7ff6769b558c7ee6b00a4f7. Check the latest targeted-regression workflow before marking this set green. Earlier failed runs included an outdated cash expectation and must not be represented as successful verification.


### Verified CI result — purchase quantity validation (2026-11-02)

- The latest relevant GitHub Actions runs have now completed successfully: [41408456408](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/41408456408) for the corrected manual package-count parser and [41408467203](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/41408467203) for the positive-path test. The funded coconut boundary test also passed in [41408370039](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/41408370039).
- Regression coverage now includes rejection without mutation for malformed manual warung package counts across ice, sugar, and cup fields; valid one-package purchase; invalid coconut quantities; valid coconut quantities at 1 and 200; and the 150% stock-target package recommendation rule.
- This verifies those targeted regressions only; it does not mean all economic flows or unit-economics integrations are complete.


### Coconut sale confirmation integrity (2026-11-02)

- `confirmSellTengkulak()` previously trusted the revenue value captured when the modal was opened and did not revalidate that stock still existed or remained in the young-coconut sale class at confirmation time. A stale or externally invoked confirmation could therefore credit proceeds for stock no longer available or use an outdated/inflated amount.
- The function now rechecks current stock quantity and `stockClass()` at the transaction boundary, recomputes revenue from current ordinary/super quantities and `DATA.priceTengkulak`, and rejects invalid revenue before posting HPP or sales.
- Added tests for stale modal revenue (should use current stock price) and disappeared stock (should make no ledger/cash/revenue mutation).
- Code commit: `30b79e4744f4b99b04a522983544bf9121c45483`; tests commit: `ed51535a87e7e1992ca2e36b91ca4d3bc2f80c71`. GitHub Actions validation is pending; check the newest run before treating this fix as verified.

- Follow-up during review: the daily sales-revenue accumulator still referenced the stale modal argument after revenue was recomputed. Corrected it to record `saleRevenue` in `S.dayLog.sales.tengkulakRev` in commit `463b59d1f35a05f2b9d1de915ae61d79c53c46ad`. This should be validated by the newest CI run, not only the earlier run for the initial sale-confirmation patch.


## Recommended material purchase confirmation guard (2026-11-03)

- Follow-up implementation after the coconut sale confirmation fix: `buyRecommended(k,g,c)` previously trusted package counts captured when the recommendation modal opened. A stale modal or direct call could therefore buy more whole packages than the current 150% stock target permits.
- The function now accepts only safe integer package counts in the supported 0–1,000 range, recalculates `materialPlan()` at confirmation time, and rejects the transaction if any requested count no longer matches the current allowed recommendation. Rejection occurs before cash, inventory, cost balances, or ledger mutation.
- Added regressions for a stale/over-cap ice package count (must leave all transaction state unchanged) and a valid current plan of three ice, syrup, and cup packages.
- Code commit: `f88608774d9a2b8b84fe80eb04f084b5464e005f`. Test commit: `11d290f900e72cdc488bbe7b0e8b8844e58b1c7a`.
- CI verification is pending for the new test commit. Check the targeted-regression workflow and inspect its job result before marking this guard green. No changes to `main`, `peta.html`, or `js/map_engine.js`.


### CI result — recommended material purchase guard (2026-11-03)

- GitHub Actions run [41555723532](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/41555723532) passed at test commit `11d290f900e72cdc488bbe7b0e8b8844e58b1c7a`.
- The `node-regression` job completed successfully. Steps passed include Node test-runner suites for market/NPC/inventory accounting, UTL/UTP source and arithmetic guards, and all standalone Node regression tests.
- This confirms the stale recommended-package rejection and valid current-plan purchase tests pass in CI. It does not establish that all unit-economics flows are integrated or that all business costs are fully recognized.
- Handover documentation update follows the tested commit; this documentation-only commit is not a separate code-test run.


## Reject incomplete business HPP component sets (2026-11-03)

- Found an accounting-integrity defect in `recordBusinessCogs()`: it filtered malformed component amounts out and still posted the remaining valid components. That could understate HPP and overstate the margin while appearing to be a complete cost posting.
- Updated the helper to validate the entire component array before mutating daily COGS, expenses, per-account totals, or ledger. Empty arrays, missing account names, non-finite amounts, and negative amounts now reject the posting; valid zero-cost components are omitted from journal lines, while all positive components are recorded.
- Added regression tests for malformed mixed component sets (ensuring no partial posting), empty input, and a complete four-component HPP posting with balanced debit/credit totals.
- Code commit: `1f481b96c29fce83e4b583f720dff26e4863370b`. Test commit: `cdc1eb712d00eb28d201efdf6dabbe8bf9d6d586`.
- CI must be checked for the test commit before this fix is marked verified. Scope is deliberately limited to preventing partial HPP ledger entries; it does not yet make the whole sale flow atomic if a caller supplies invalid data after changing stock. Continue with transaction-level prevalidation/rollback and full unit-economics integration.


## Transaction-level HPP guards for sales (2026-11-03)

- Continued from the incomplete-HPP component validator. The previous change rejected malformed HPP inside recordBusinessCogs(), but sale functions could still consume stock or post revenue without checking whether HPP had actually been recorded.
- Added businessCogsComponents() / businessCogsTotal() as shared validation logic. trySellEs() now previews coconut cost and validates/posts all four distinct cost components (coconut, ice, sugar, cup) before changing the sale's material counts or recording revenue. The normal coconut consumption/transfer still records its separate inventory movement.
- trySellWhole() now refuses to sell if the unit HPP is non-finite or non-positive, and requires the HPP posting to succeed before reducing stock or recording revenue. The open-coconut spoilage path also aborts if its HPP posting is rejected. Tengkulak and market sales now stop if a positive stock-value HPP posting fails.
- Regression coverage added for invalid ice-cost data blocking an es-kelapa sale without changes to cash, stock, warung material quantities/costs, daily sales, or journal; and for zero-valued whole-coconut HPP blocking stock depletion and revenue.
- Code commits: f90349216370c387a1d0321a65751dc4d0f6d8ce and 474ac4914ca990cdd009ff445e503c9706727417. Test commits: 9e308cdc25d9cca000d827835d640a4e7212d277 and 27fe7e04ff327e7f2b3478e09af31fa30a6561b4.
- The early runs [41610578005](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/41610578005) and [41610600604](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/41610600604) failed on intermediate commits: the first test commit had not yet included the subsequent code guards and its invalid-cost fixture correction. The corrected test commit [27fe7e04](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/commit/27fe7e04ff327e7f2b3478e09af31fa30a6561b4) passed run [41610607131](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/41610607131). The node-regression job completed successfully, including the accounting/market/NPC suite, all UTL/UTP source and arithmetic guards, and all standalone Node regression tests. No local test execution is claimed.
- Remaining risk: HPP is posted before takeCoconut() in the es-sale path based on a synchronous preview; this is deterministic in the current single-threaded game flow, but a future asynchronous transaction system should replace this with an explicit transaction/snapshot boundary. Continue next by verifying CI and auditing every recordBusinessCogs() call site for unchecked returns. js/unit_economics.js remains not fully integrated. No changes to main, peta.html, or js/map_engine.js.


### Verified transaction-level HPP regression and follow-up (2026-11-03)

- Run 41610607131 passed at test commit 27fe7e04ff327e7f2b3478e09af31fa30a6561b4. This run verifies the updated inventory-accounting tests and all configured source/arithmetic guards plus standalone Node tests.
- A call-site scan of js/economy.js found six occurrences of recordBusinessCogs(): the definition and five transaction/spoilage call sites. All five call sites now check the HPP posting result before proceeding with sale-state mutation; no unchecked call site remains in that file.
- Next implementation focus: harden zero/invalid inventory valuation at the remaining wholesale channels and continue wiring js/unit_economics.js into actual transaction flows. Do not claim unit-economics integration complete. Avoid map files and main.


## Reject wholesale sales with invalid inventory valuation (2026-11-03)

- Follow-up from the sale HPP call-site audit: tengkulak and market sale functions previously skipped HPP posting when the recorded coconut inventory value was zero, but still credited revenue and cleared inventory. A positive quantity with zero recorded inventory valuation is now rejected before HPP, revenue, or stock mutation.
- Added regression coverage for both young-coconut tengkulak sale and mature-coconut market sale with zero inventory value. Tests assert no cash, stock, COGS, revenue, or journal changes.
- Code commit: 13ffa189a97558c919e2db326ef88431abcf91ad. Test commit: 489b787571d12a18fb42d238589a553adeac78c0.
- GitHub Actions verification is pending for the new test commit. Check the newest workflow and inspect any failures before marking the guard green. No local test execution is claimed. No changes to main, peta.html, or js/map_engine.js.


## Reject invalid sale prices before HPP posting (2026-11-03)

- Continued transaction-boundary hardening after CI passed for the zero-inventory-valuation guard. Found that retail es-kelapa and whole-coconut sales could continue to HPP/inventory mutations with invalid or zero sale prices; `earn()` normalizes invalid amounts to zero, which could leave costs recognized without valid revenue. Mature-coconut market sales also needed explicit finite-positive proceeds validation before HPP posting.
- Added preconditions: es-kelapa price and whole-coconut price must be finite and > 0; market sale quantity must be a positive safe integer and calculated revenue finite and > 0. Invalid values reject before HPP, stock, or revenue mutation.
- Code commit: 65541d9ebc36e45749a5c0362efb502e5207142c. Regression test commit: 9f95980596c3661f872081599199e9abe65eded8. New tests cover NaN es price, zero whole-coconut price, and NaN market price, asserting no cash, inventory, COGS, sales or journal mutation.
- CI run for the test commit must be checked before marking this guard green. No local test execution is claimed. No changes to main, peta.html, or js/map_engine.js.

 
## Expense amount validation guard (2026-11-04)
 
- Fixed `spend()` in `js/economy.js` so negative, non-finite, and nonnumeric expense amounts are rejected before cash, ledger, expense totals, inventory-purchase totals, or daily cash-out values change. Previously, a negative amount could increase cash and malformed values could be silently converted to zero.
- Added regression coverage in `tests/accounting-inventory.test.js` for negative values, NaN, positive/negative infinity, and nonnumeric strings; each case asserts no accounting mutation.
- Validation status: targeted CI is pending for this code/test change. Do not claim it passes until the workflow run completes.
- Latest prior retail/market sale-price validation CI passed: run [41625233466](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/41625233466).
- Next: continue auditing cash-in/cash-out and production transaction entry points for malformed values, then integrate unit-economics forecasting only where it can be connected to a real UI/transaction flow without double-counting HPP.

## Live unit-economics integration for es kelapa (2026-11-05)

- `js/unit_economics.js` is now loaded by `index.html` before `js/economy.js`, making the existing unit-economics engine available to the actual browser transaction layer.
- `js/economy.js` now runs `validateEsUnitEconomics()` during the es kelapa sale pre-posting phase. The validator uses the current sale price, coconut input cost, ice, syrup, and cup unit costs to calculate a one-unit HPP consistency result before `recordBusinessCogs()` mutates accounting state.
- The integration is deliberately a validation/consistency gate, not a second accounting posting. Actual inventory depletion and HPP remain owned by the existing transaction code, preventing double-counting.
- Added regression coverage confirming a live es kelapa sale succeeds through the unit-economics guard and that an invalid sale price remains rejected without creating an additional HPP or revenue entry.
- CI must be checked for the latest code/test commits before claiming this integration passes.


## Live unit-economics CI verification (2026-11-06)

- The three workflows for the live es-kelapa unit-economics integration completed successfully: code run [41972480008](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/41972480008), index/script-loading run [41972484114](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/41972484114), and regression-test run [41972489953](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/41972489953). Each completed with conclusion `success` on the `node-regression` job.
- This verifies the current es-kelapa unit-economics integration on GitHub Actions. No local test execution is claimed.
- Next implementation target: extend the same calculation/validation layer to the next existing real transaction flow, beginning with whole-coconut sale, while preserving single-owner accounting for HPP/inventory and avoiding duplicate journal posting. Do not touch main, peta.html, or js/map_engine.js.


## Whole-coconut live unit-economics integration (2026-11-06)

- `js/economy.js` now validates the existing whole-coconut sale against `js/unit_economics.js` before any spoilage, HPP posting, inventory mutation, or revenue posting.
- The calculation uses the recorded whole-coconut unit inventory cost as the buy-side input cost and the current `DATA.wholePrice` as the sale price. It is a validation layer only; existing HPP/inventory posting remains the single accounting owner.
- If an opened coconut has remaining WIP cost, that spoilage event remains separate and is not folded into the whole-coconut unit sale calculation.
- Added regression coverage for a successful whole-coconut sale and for invalid sale price rejection with zero accounting/inventory mutation.
- Code commit: 17b3abc18244f19f2a9ff0402b80625d6c6bd9af. Test commit: 04fe922e48d30fd8d5007eb3d2d8a1bde4382a9b.
- GitHub Actions verification is required before marking this integration green. No local test execution is claimed. No changes to main, peta.html, or js/map_engine.js.


## Old-coconut market live unit-economics integration (2026-11-08)

- `js/economy.js` now validates the existing `sellPasar()` transaction against `js/unit_economics.js` before HPP, inventory, and sales posting.
- The market sale uses the recorded whole-stock unit inventory cost as the input cost and the current `DATA.pricePasarTua` as the sale price.
- Existing accounting remains the sole posting owner; unit economics is a consistency/viability guard and does not duplicate HPP entries.
- Added regression coverage for a valid two-unit old-coconut market sale and invalid sale-price rejection with no accounting or inventory mutation.
- Code commit: 68e22ed1db56eb41b0247a31ab4dd810938107ed. Test commit: 8d09bcc86392b77658f50b4cfddbd2dac81e962c.
- The previous whole-coconut unit-economics test run `42255098490` completed successfully. This new integration requires its own GitHub Actions verification.


## Young-coconut → tengkulak live unit-economics integration (2026-11-08)

- `js/economy.js` now validates the existing `confirmSellTengkulak()` transaction against `js/unit_economics.js` at the confirmation boundary, after current stock/revenue/inventory valuation validation but before HPP, cash revenue, and stock mutation.
- The validator uses the weighted current tengkulak sale price across ordinary/super young coconuts and the recorded inventory unit cost. It is a consistency/viability guard only; the existing accounting path remains the sole owner of HPP and revenue posting.
- The confirmation continues to recompute proceeds from current stock quantities rather than trusting the stale modal revenue argument.
- Added regression coverage for successful sale with a deliberately stale modal revenue and for invalid current tengkulak pricing. Both cases verify that HPP/inventory/cash mutation is blocked or correctly posted at the transaction boundary.
- Code commit: `33ca395d0df9a7797bd930b58c1aa4d4a71fd43e`.
- Test commits: `7988b56ed77956b076eb7755d95572dd39358e14` (initial regression) and `96602049d9f4322e8d2946649fd1551119e010fc` (harness correction). The latest test setup then pins the stock-class fixture in `3849b4ab557c6f06455742db4d77434fa8d59083`.
- Run `42465125512` exposed a pre-existing test-harness omission (`stockClass` undefined); run `42465207865` verified the harness correction. The latest regression run `42465291779` is still in progress at handoff time.
- GitHub Actions verification is required before marking this integration green. No local test execution is claimed.


### CI closure — coconut sales unit-economics coverage (2026-11-08)

- Young coconut → tengkulak regression run **42465291779** completed **successfully** on test commit `3849b4ab557c6f06455742db4d77434fa8d59083`.
- The earlier harness correction run **42465207865** also completed successfully.
- The old-coconut market implementation run **42423351369** completed successfully; its regression run initially exposed the same test-harness stock-class dependency and was corrected in the subsequent harness work.
- Therefore the four active coconut sales paths now have automated unit-economics coverage at the transaction boundary: es kelapa, whole coconut, old coconut → market, and young coconut → tengkulak.
- No local test execution is claimed; verification is through GitHub Actions.
- No additional sales function exists in `js/economy.js` requiring the same coconut unit-economics guard. The next implementation should therefore move to the next real production/processing transaction flow rather than duplicating validation.


## Live agricultural commodity processing accounting (2026-11-08)

- Continued from the coconut unit-economics closure by auditing the next real processing transaction: `js/land.js::processCommodity()`. This is an actual UI/runtime path for the cabai and jagung test commodities; `js/commodity_transformation.js` had previously been only a planning/calculation library.
- Found a material accounting gap: cultivated commodity stock had quantity but no carrying-cost ledger, and `processCommodity()` consumed raw stock and posted product revenue without recognizing the raw inventory cost as HPP. Distribution cost was also recorded in the day log without reducing cash.
- `js/state.js` now initializes `S.landSystem.inventoryCost` as the carrying-value map for interchangeable agricultural inventory.
- `js/land.js::plantCommodity()` now records cultivation cash as work-in-progress/business purchase rather than immediately expensing it. Each new agricultural plot stores `wipCost`.
- `js/land.js::harvestCommodity()` transfers the plot WIP cost into finished agricultural inventory carrying value using the shared weighted-average valuation helpers. Existing legacy inventory without valuation remains explicitly valued at zero rather than receiving an invented cost.
- `js/commodity_transformation.js` now exposes pure weighted-average helpers for unit cost, inventory consumption, and inventory receipts. These helpers validate before mutation and are reusable for future Tier 1–4 processing.
- `js/land.js::processCommodity()` now:
  1. validates recipe/input/output/cost values;
  2. computes raw-input carrying cost with weighted-average valuation;
  3. runs the existing unit-economics engine as a pre-posting consistency/viability guard;
  4. validates HPP components before mutation;
  5. records conversion cash as a business purchase;
  6. posts HPP exactly once for raw inventory + conversion cost;
  7. charges distribution as an actual cash outflow;
  8. consumes raw inventory carrying value and records finished-product revenue.
- The implementation intentionally does not invent a real-world price. The processing prices remain game parameters in `js/commodities.js`. BPS SEP 2024 provides empirical context for production-cost structure, including separate production-cost components for coconut, while the BPS producer-price series is a distinct source for producer prices. citeturn308297search12turn308297search0
- Accounting design follows the inventory principle that inventory cost includes purchase/conversion costs and that carrying cost is recognized as expense when the related inventory is sold/consumed. IAS 2 also supports weighted-average costing for interchangeable inventory. citeturn799436search0turn799436search12
- The transaction boundary also follows the project's existing rule that invalid/insufficient values must be rejected before state mutation. This is consistent with the Qur'anic principle of accurate measurement and the Sahih Muslim requirement for truthfulness and disclosure in transactions. citeturn319491search1turn871515search0
- New tests:
  - `tests/commodity_transformation.test.js`: weighted-average unit cost, consumption, receipt, and invalid-input guards.
  - `tests/commodity-processing-runtime.test.js`: actual `processCommodity()` execution with HPP, cash, inventory carrying value, conversion cost, distribution cash, and insufficient-cash atomicity checks.
- GitHub Actions verification is required before this work is marked green. No local test execution is claimed.
- Important limitation: legacy agricultural inventory created before the new carrying-value ledger may have quantity but zero recorded cost. The runtime deliberately does not invent historical cost. Such stock must be re-harvested/rebuilt under the new valuation path or receive a documented migration rule later. Butuh riset lanjutan untuk a defensible historical-cost migration policy.
- No changes to `main`, `peta.html`, or `js/map_engine.js`.


## Finished-goods inventory boundary (2026-11-08)

- Continued the live processing work by correcting a deeper accounting boundary in `js/land.js::processCommodity()`: processing must create finished goods inventory, not automatically sell the output.
- `js/commodities.js` now gives the active test outputs stable IDs and output units: `sambal_cabai_250g` and `jagung_bakar`.
- `js/state.js` now maintains `finishedInventory` and `finishedInventoryCost` separately from raw agricultural inventory.
- `processCommodity()` now:
  - consumes raw agricultural quantity and carrying value;
  - pays conversion cash;
  - capitalizes raw carrying value + conversion cost into finished-goods carrying value;
  - records distribution as an actual cash outflow;
  - does NOT recognize COGS;
  - does NOT create revenue;
  - leaves finished goods available for a later sale/distribution transaction.
- This establishes the intended accounting chain: raw inventory -> processing/conversion -> finished-goods inventory -> later sale -> COGS + revenue.
- The existing `AgroUnitEconomics.calculate()` call remains a pre-posting economic consistency/viability guard. It does not itself post accounting entries.
- The test fixture was updated so `tests/commodity-processing-runtime.test.js` verifies 10 sambal packages with Rp105,000 carrying value after consuming 2.5 kg of cabai with Rp5,000 raw carrying value plus Rp100,000 conversion cost; no COGS or revenue is recognized at production time.
- CI verification is required before declaring this checkpoint green. No local test execution is claimed.
- Next implementation target: build the finished-goods sale transaction against `finishedInventory`/ `finishedInventoryCost`, with weighted-average COGS, revenue validation, and no stale-price mutation. Do not bypass this inventory boundary by restoring auto-sale behavior.


## Finished-goods sale transaction (2026-11-08)

- Implemented js/land.js::sellFinishedCommodity() against finishedInventory and finishedInventoryCost.
- The transaction validates product identity, positive integer quantity, current sale price, weighted-average carrying value, and AgroUnitEconomics.calculate() before mutation; the sale price is read from current product configuration rather than trusted from stale UI state.
- Successful sales reduce finished quantity/value by weighted-average HPP, post HPP exactly once through recordBusinessCogs(), post revenue exactly once through earn(), and calculate gross profit as revenue minus HPP.
- Added a minimal sale button in the existing commodity-economics UI. No map files were touched.
- Regression coverage verifies 2 sambal packages sold from 10: carrying value Rp105,000 -> Rp84,000, HPP Rp21,000, revenue Rp36,000, gross revenue Rp36,000, plus zero-mutation rejection for invalid price and non-integer quantity.
- CI verification is required before marking this checkpoint green. No local test execution is claimed.
- Next target after CI closure: extend the same finished-goods transaction model to the next real Tier 1–4 production route.


## Raw agricultural commodity sale HPP boundary (2026-11-08)

- Hardened js/land.js::sellCommodity() so raw agricultural sales now consume the recorded weighted-average carrying value and recognize HPP exactly once before revenue/distribution posting.
- The sale rejects missing/zero inventory valuation, invalid current prices, invalid logistics, and insufficient cash for the distribution outflow before accounting mutation. The unit-economics engine validates the current sale price against the actual inventory unit cost.
- Gross profit is now explicit as revenue minus recognized HPP; distribution remains a separate operating cash expense rather than being folded into HPP.
- Added regression coverage for a 10 kg cabai B2B sale: inventory value Rp5,000 becomes HPP Rp5,000, revenue Rp250,000, distribution Rp100, and cash Rp1,249,900; invalid current price leaves all accounting/inventory state unchanged.
- This follows IAS 2's inventory principle that carrying amount is recognized as expense when the related inventory is sold, with weighted-average cost permitted for interchangeable inventory. citeturn576509search0turn576509search13
- CI verification is required before marking this checkpoint green. No local test execution is claimed.


## Transaction-order hardening after finished/raw commodity sale CI (2026-11-08)

- Current branch HEAD before this follow-up: `89642ef0784374a11687c76f203e04b745a29cf2`; the latest raw-sale regression workflow **42487589712** on `6edbe0ad8a39327a3cd3de2031218530ec606703` completed successfully. Finished-goods sale workflow **42487394236** also completed successfully.
- Hardened `js/land.js` sale ordering so HPP validation/posting succeeds **before** finished-goods or raw agricultural inventory/market state is mutated. This removes the previous rollback-dependent ordering at the transaction boundary.
- Added a regression that forces `recordBusinessCogs()` to fail and verifies a finished-goods sale leaves cash, quantity, carrying value, COGS and gross revenue unchanged.
- No map files, `main`, or unrelated economy paths were changed.
- Next target: extend this transaction-atomicity test pattern to raw agricultural sale and processing receipt, then continue to the next real Tier 1–4 production route.
## Transaction atomicity hardening — raw sale and processing receipt (2026-11-08)

- Verified the previous transaction-order hardening on the actual branch: HEAD advanced to 7e37128d870113aaec07f75eada4bc6f984539c0; targeted regression runs 42488720700 (sale ordering) and 42488722934 (HPP-failure regression) both completed successfully.
- js/economy.js::spend() now rejects insufficient cash before ledger/day-log/cash mutation. This closes a broader invariant used by the production and sale transaction paths.
- js/land.js::processCommodity() now validates the finished-goods receipt (addInventoryCost) before any cash or inventory mutation. Raw inventory and finished-goods state are committed only after the conversion/distribution cash steps have passed.
- js/land.js::sellCommodity() now completes the distribution cash step before raw inventory/market/revenue mutation. The transaction no longer intentionally leaves revenue/inventory changes behind when the distribution spend itself rejects.
- tests/commodity-processing-runtime.test.js now covers finished-goods sale HPP failure with zero mutation; raw agricultural sale HPP failure with zero mutation; and processing receipt failure with zero cash/raw-inventory/finished-inventory/ledger mutation.
- Code commits: deddf4a10a961b8a8bac2ff9dbf1af263b7cf065, d48e5340803a4dfbc31a4ada01aaab5f31ba7fa7.
- Test commit: b63bf533498aded0fde27c00373d48d8b47f6052.
- GitHub Actions for these new commits must be checked before marking the checkpoint green. No local test execution is claimed.
- Next implementation target after CI closure: move from transaction-atomicity hardening to the next real Tier 1–4 production route, while preserving weighted-average inventory valuation, unit-economics preconditions, and single-owner HPP/revenue posting.

## Finished-goods HPP ordering correction — 2026-11-08

- Re-inspection of the actual `js/land.js` exposed a residual ordering defect in `sellFinishedCommodity()`: finished inventory was being mutated before `recordBusinessCogs()` even though the failure regression expected zero mutation.
- Corrected the order so HPP posting succeeds before finished-inventory quantity/carrying-value mutation.
- Strengthened the regression to also assert the ledger length is unchanged when HPP posting fails.
- Code commit: e1a3f31ebb1468772d2a9b692120b9bd8c2152b7.
- Test commit: 2a3e15798bd20fdd710d14b1d921e142352ca864.
- New GitHub Actions run must complete successfully before this checkpoint is considered green.


## Active Tier 1 → Tier 4 processing routes (2026-11-08)

- The live processing boundary now requires each active processed-product definition to declare `inputTier`, `outputTier`, and a stable `routeId`. `js/land.js::processCommodity()` rejects incomplete, out-of-range, non-forward, or unnamed routes before any cash/inventory mutation.
- The two currently executable test routes are:
  - Tier 1 `cabai_merah` → Tier 4 `sambal_cabai_250g` (`cabai-merah-to-sambal-250g`).
  - Tier 1 `jagung` → Tier 4 `jagung_bakar` (`jagung-kering-to-jagung-bakar`).
- `js/commodities.js` now carries the route metadata. This is a gameplay contract, not a claim that all real-world processing chains are only Tier 1 → Tier 4; additional Tier 2/Tier 3 intermediate routes still require explicit recipes, quantities, cost evidence, and tests before activation.
- Added regression coverage for the complete jagung route: raw weighted-average carrying value → conversion/distribution cash → finished-goods inventory → later sale → weighted-average HPP + revenue. The test also proves an invalid Tier route is rejected without mutation.
- Code commits: `844dfb1f2adb900d2a41a60ade10c47c686b7b9f` and `6e36b9c48d83c773ba87960e68f99de0bfa9c097`.
- Test commit: `5cd77d2deb37d1f257b6f9dc1a46eba96a2db9b3`.
- GitHub Actions verification is required before marking this route green. No local test execution is claimed.
- Next implementation target after CI: add the next evidence-backed intermediate Tier 2/Tier 3 route rather than adding more generic hard-coded Tier 1 → Tier 4 shortcuts.


## Tier 2 price-stage evidence contract (2026-11-08)

- Continued the Tier 2/Tier 3 route investigation without inventing distributor prices. `js/market_chain.js` now has an explicit `distributionMarket` stage for coconut, red chili, and corn; its value remains `null` with `type:"missing"` because no source currently in the repository verifies the relevant distributor/wholesale buyer-seller transaction.
- Added a separate `officialSnapshots` series for Bapanas January 2026 producer observations: dry shelled corn Rp5,810/kg and curly red chili Rp24,578/kg. These are explicitly tagged `stage:"producer"` and must not be copied into Tier 2.
- Source: Bapanas national monthly producer-price dataset, https://data.badanpangan.go.id/datasetpublications/3iw/rata-rata-harga-pangan-bulanan-produsen-nasional. The dataset records January 2026 producer observations; it does not establish distributor purchase prices.
- Preserved existing game parameters and owner-verified coconut prices. The new official snapshot is a separate historical observation and does not overwrite current game balancing values or owner-protected coconut Rp13,000.
- `tests/market_chain_contract.test.js` now asserts exact January 2026 values, producer-stage labels, and null Tier 2 distributor prices for all three market-chain rows.
- Code/data commit: `f484c947ac5bb573855e33814ac3c52c45406f47`.
- Test commit: `66518f9110f59a04caba154eeabfe3678649085d`.
- CI verification is pending. No local test execution is claimed.
- Next: obtain a matched Tier 2 transaction series (commodity grade, region, unit, month, seller/buyer stage) before activating distributor stock transfers. Candidate sources include PIHPS market-type observations and official market/distribution datasets, but their market type must be checked rather than assumed to be wholesale.


## Tier 2 contract regression correction (2026-11-08)

- Follow-up CI inspection: data commit `f484c947ac5bb573855e33814ac3c52c45406f47` passed workflow run `42495883611`; test commit `66518f9110f59a04caba154eeabfe3678649085d` failed run `42495889997`.
- The failed job completed the focused market/NPC/inventory Node test step successfully and failed only at the final standalone Node regression step. Inspection of the checked-in fixture showed the corn row lacked the newly required `distributionMarket` object, while the contract test iterates every row and dereferences that field. Coconut and chili already had it.
- Corrected `js/market_chain.js` by adding the same evidence-gated null Tier 2 distributor stage to corn. No price was invented and no producer/consumer observation was substituted.
- Fix commit: `46b66447fd075c7a46f06c5b789b6b8f6bad2d03`.
- CI for the fix must complete before this checkpoint is green. No local test execution is claimed.
- Research clarification: PIHPS FAQ defines its daily traditional-market survey as retail transactions between retailers and final consumers, and explicitly says sampled merchants sell for self-consumption rather than resale/grosir. Bapanas Panel Harga FAQ's listed wholesale-monitoring item is premium rice; it does not establish a matching wholesale series for red chili or dry corn. Thus the Tier 2 price fields for coconut, chili, and corn remain null. References: https://www.bi.go.id/hargapangan/Informasi/FAQ and https://dev-panelharga.badanpangan.go.id/faq.
- Next: verify the corrected commit's full standalone Node suite in CI, then search official provincial/market-induction datasets for commodity-grade- and transaction-stage-matched distributor prices. Keep Tier 2 disabled for a commodity until source metadata proves the buyer/seller stage, grade/moisture, region, unit, and period.


## Correction: official Bapanas wholesale-panel coverage (2026-11-08)

- Correction to the preceding Tier 2 note: the initial interpretation of the Panel Harga FAQ was incomplete. The full official FAQ does list **Cabai Merah Keriting at Pedagang Grosir** (Rp/kg) in its provincial-capital wholesale panel. It also lists **Jagung (Peternak Mandiri)** in the special out-of-capital wholesale monitoring table for Central Java and East Java. The FAQ additionally lists several other wholesale commodities. Source: https://dev-panelharga.badanpangan.go.id/faq (sections B and C; wholesale coverage and monitored locations).
- Therefore, Bapanas Panel Harga is a valid candidate primary source for a regional wholesale observation for curly red chili and for the specifically scoped independent-farmer corn channel in Central/East Java. It is not yet a valid numeric observation in the repository: the public `/harga-grosir` page returned a maintenance notice during this check (2026-11-08), so no dated price values could be retrieved or verified.
- PIHPS traditional-market observations remain retail/final-consumer prices according to the BI FAQ and must not be substituted for wholesale transactions.
- Existing Tier 2 `distributionMarket.value` fields remain null until the Bapanas data page/API yields an observation with commodity, panel type, region, date, unit, and product/quality definition. For corn, retain the scope distinction: the documented wholesale panel is a special independent-farmer channel in Central and East Java, not a national distributor average.
- This correction supersedes the earlier sentence in this handoff claiming that the Bapanas wholesale panel only lists premium rice. That sentence was based on an incomplete FAQ snippet and was incorrect.
- Next: retry the official wholesale panel when service is restored; capture regional observations for cabai merah keriting and corn (Central/East Java only where listed), then separately assess whether the observed wholesale seller/buyer stage matches the game's Tier 2 distributor purchase. Do not infer a national value from the limited regional sample.


## Tier 2 wholesale panel scope encoded (2026-11-08)

- CI follow-up: the corrective corn fixture commit `46b66447fd075c7a46f06c5b789b6b8f6bad2d03` completed successfully in run `42496097582`. The earlier test-only commit `66518f9110f59a04caba154eeabfe3678649085d` remains failed; its failure is superseded by the corrected follow-up commit and successful run, not retroactively relabeled.
- Re-read the full Bapanas FAQ. It explicitly defines three panels (producer, wholesaler, retailer). The wholesaler list includes curly red chili at wholesale (Rp/kg), but does not include corn in the general provincial-capital wholesaler list. The separate out-of-capital special wholesale table lists corn (independent livestock farmer channel) only in Central Java and East Java. It lists chili in additional wholesale-market/STA/auction locations in West Java, Central Java, East Java, DI Yogyakarta, Banten and South Sulawesi. The FAQ says wholesale sites are selected large-volume wholesale sellers and do not sell retail. Source: https://dev-panelharga.badanpangan.go.id/faq, lines 35-48, 128-147.
- Added `MARKET_CHAIN_DATA.officialCoverage` in `js/market_chain.js`. These are coverage metadata only, not price observations. The numeric `observationValue` remains null. The chili coverage and special corn channel are separately scoped; corn must not be interpreted as a national general-distributor series.
- Added regression assertions in `tests/market_chain_contract.test.js` to distinguish official panel coverage from a numeric observation and preserve null prices until the actual data is retrieved.
- The official data page `https://panelharga.badanpangan.go.id/harga-grosir` displayed a maintenance notice when checked on 2026-11-08. No wholesale price values, dates, or regional observations were available to record. Thus Tier 2 prices remain null and the next data action is to retry the official panel or identify a documented downloadable/API export.
- New commits: market coverage metadata `0c54bfd87c983c24866f728908d80b4f44b42681`; test `5b1ba0c25322cc5c5b66cfd7a3cc0ac739d5acb5`. CI for these commits must be checked before marking this change green.


## Historical Bapanas wholesale observations captured (2026-11-08)

- New source discovery: Bapanas monthly report for November 2024, Figure 2, explicitly shows the national wholesale-panel average for the period 1–31 October 2024. The extracted report text records Cabai Merah Keriting at Rp23,900/kg and Jagung Tk Peternak at Rp5,850/kg. Source: https://badanpangan.go.id/storage/app/media/2024/Laporan%20Bulanan/11.%20FINAL%20LAPORAN%20NOVEMBER%202024.pdf (Figure 2; page 10 in the report extraction).
- Added both values to `MARKET_CHAIN_DATA.officialSnapshots` as `stage:"wholesale"`, period `2024-10`, `status:"official_historical_observation"`, with national-panel scope and the exact source label/channel.
- Chili is labeled `marketChannel:"pedagang_grosir"`. This is a historical national panel average, not a current regional distributor quote; it does not activate a live Tier 2 purchase price.
- Corn retains the exact label `Jagung Tk Peternak` and channel `jagung_tingkat_peternak`. Although the figure is headed Panel Pedagang Grosir, the commodity label is not equivalent to a generic wholesaler quote. Do not merge it into a general distributor series without a documented definition.
- Existing `distributionMarket.value` fields for coconut, chili, and corn remain null. Historical panel observations must not be treated as current runtime market prices or overwrite owner-protected coconut prices.
- Added regression assertions for exact values, period, stage, source label, and market channel in `tests/market_chain_contract.test.js`.
- Source cross-check: Bapanas FAQ defines separate producer, wholesaler, and retailer panels and the wholesaler as large-volume wholesale sellers who do not sell retail: https://dev-panelharga.badanpangan.go.id/faq. Kementan's linked wholesale dashboard currently renders zero values for the displayed 2026 national onion table, so it is not used as a numeric observation in this change: https://datanonkom.pertanian.go.id/master/harga/panel?level=grosir.
- Code and test commits are recorded in the current GitHub branch history. The new targeted regression workflow must complete successfully before this checkpoint is marked green. No local test execution is claimed.
- Next: expand the historical Bapanas wholesale series across adjacent months and commodities only where report figures explicitly identify the wholesale panel; then seek current regional observations. Keep runtime Tier 2 prices null until current, region/grade/unit-matched transaction evidence is available.


## Internal market price bands and sector volatility (2026-11-08)

- Owner clarified that historical price data may be used as internal game calibration; the player-facing market does not need to display source years. Historical provenance remains in research/handoff records for audit, while runtime prices are presented as simulated market values.
- Replaced the generic 50%-200% range applied to every commodity with differentiated sector price bands for all 60 catalog items. Existing `basePrice` remains the starting equilibrium/anchor; each item receives a floor, ceiling, elasticity, daily move limit, and volatility label.
- Initial internal balancing profiles: staple food 0.72–1.42× anchor; horticulture 0.52–1.82×; plantations 0.68–1.48×; fruit 0.58–1.68×; spices 0.62–1.62×; livestock 0.76–1.38×; fishery 0.55–1.72×; industrial crops 0.78–1.36×. Daily move limits and elasticity are also sector-specific. These are game calibration parameters, not claims that each individual commodity has a measured historical min/max series.
- `js/market_engine.js` now uses each commodity's own elasticity and daily movement cap when applying net buy/sell pressure and executed-price signals. All prices remain clamped within the commodity's floor/ceiling.
- Existing NPC background economy already generates demand and supply flows for all 60 items; its transactions now move each item according to its own volatility profile. Cross-player global pricing still requires a verified server-authoritative shared feed; browser-local NPC/player transactions are not represented as globally shared.
- Historical Bapanas wholesale observations remain in the internal reference series, but do not override the current producer/base anchors or become player-facing dated prices. Source series can be used to refine the profile factors as more comparable periods are collected.
- Added market-engine regression assertions for all 60 lower/upper bounds, positive bounded elasticity, differentiated volatility classes, and higher movement tolerance for perishable categories versus stable categories.
- Code commits: `50a6d719e1648b154153cb430ae847dfc3b185c5`, `2b40931496f27f2ce3e26d13fdd7785609657150`; test commit: `f73e67a15c6d714a92483e16ff455e7c0c24bbf9`.
- CI runs must complete successfully before marking the feature green. No local test execution is claimed.
- Next: build explicit producer/collector/wholesale/retail stage price bands where matching reference data exists, then connect actual player offers and NPC orders to a transaction/order-book contract. Do not silently collapse the market stages into one universal price.


## Player offers now participate in the daily producer-market price (2026-11-08)

- The owner clarified that price observations are internal simulation calibration; player-facing prices need not display source years. Research provenance remains in handoff/source notes, while the live game presents the current simulated quote.
- Added `S.marketTransactions` as a save-persistent, bounded queue (maximum 500 records) and `queueMarketTransaction()` validation in `js/state.js`. Only positive-quantity, positive-price buy/sell records at the producer stage are accepted.
- `js/day.js` now passes queued player transactions into `BACKGROUND_ECONOMY.tick()` before clearing the queue. NPC demand/supply and player trade flow therefore both affect the next daily price update. The save records player transaction count in `S.marketLastTick` for inspection. The market remains a local single-save simulation; no global cross-player market is claimed.
- `js/land.js` now derives raw-commodity B2B and retail quotes from the current market engine price, preserving each commodity's configured B2B/retail markup ratio relative to its base anchor. Confirmed B2B raw sales enter the producer-stage player flow; direct retail sales do not contaminate the producer market.
- `js/economy.js` now adjusts coconut farmer/collector quotes and collector/market sale prices relative to the kelapa producer-market anchor. Direct whole-coconut owner retail Rp13,000 and processed es-kelapa retail price remain outside the producer market feed; owner-locked retail semantics are preserved. The sale confirmation recomputes the dynamic quote and validates unit economics against that same quote.
- Player-side purchases from farmers create producer-stage buy pressure; purchases from collectors are not misclassified as producer transactions. Player sales to tengkulak/market create producer-stage sell pressure.
- Added regression coverage for queue validation, player buy/sell flow in price discovery, and the daily tick's queue handoff/clear contract.
- Implementation commits: state queue `3004c4be9dd5ae66ded038ec315ee037f9d18867`; daily integration `8ad57e099babb27dbc98b47f974dfafc44b94be6`, audit count `5ad04cac8034ccb7108bd960c8ee8a4d1c108a15`; land dynamic B2B/retail quote `4cf109c32ce9a465250d986e8423ab401ef435ed`; coconut quote/transaction integration `75828a4bf4a1a3e63431eaa5863a472c088d32bb`, validation correction `dbc5eed2c760bfbcf977b5337005c4c2bd44aeaa`; regression commits `48da6009edda42a092aa197db8d83eb898016931` and `98d31738f5c939801f4ca1808d5684f1726acd44`.
- CI must complete successfully before this checkpoint is green. No local test execution is claimed.

## Historical price snapshot syntax correction

- The first commits adding the historical Bapanas wholesale observations (`ee5aad7caa677145734463b7ba9d5f598f6f29a3`, `2536defd81af0bf33096275c90de19bd582d6707`) failed the final standalone Node step because a comma was missing between two entries in `officialSnapshots`. The earlier focused tests passed; the failure was a JavaScript parse error in `js/market_chain.js`, not a price assertion failure.
- Corrected the array separator in `2fd9e0f689458e99feeccb38f93f1147799fca9b`; CI run `42497230450` completed successfully. The failed historical runs remain recorded as failures and are not relabeled.


## Market profile parser correction and CI closure (2026-11-08)

- The first category-profile mapper used a block-bodied arrow callback but retained the old expression-bodied mapper's closing token (` })); `), causing `SyntaxError: Unexpected token ')'` in both `tests/background-economy.test.js` and `tests/market-engine.test.js`. The failure was in `js/commodities.js` line 74; all earlier test-runner suites preceding those files had passed.
- Corrected the map callback terminator to `});` in commit `ddaa8c500121e3a26ec5b9ad2b9d8a9ddd61e141`. GitHub Actions run `42497597448` completed successfully, including the full standalone regression step. This validates the price-band catalog, market engine sensitivity, persistent player transaction queue, dynamic raw B2B/retail quotes, coconut producer-market quote integration, and queue regression coverage as of that commit.
- Follow-up adjustment: raised the engine-wide hard ceiling for one daily price step to 25% so per-commodity daily movement caps (5%–15%) can actually govern. Previously a 10% global cap unintentionally limited the highest-volatility profiles. New engine/test commits: `eac3f00915f4edc6a12c8d1c60618c2d9a3bda36` and `ea416a403fa677653fba841f9a5e79776addce64`; CI is pending.

- Follow-up CI closure: engine max-step correction `eac3f00915f4edc6a12c8d1c60618c2d9a3bda36` passed run `42497656076`; the explicit per-commodity movement-limit regression `ea416a403fa677653fba841f9a5e79776addce64` passed run `42497660352`. Both workflows completed successfully. The last full regression after player-flow integration also passed run `42497597448`.


## Household-consumption source expansion (2026-11-09, continuation)

- Verified the official Badan Pangan Nasional 2025 provincial household-consumption dataset: “Rata-rata Konsumsi per Jenis Pangan Penduduk Indonesia Provinsi Update Tahun 2025”. It is province-depth, unit kg/kap/tahun, and describes average quantities actually consumed per capita. Source URL: https://data.badanpangan.go.id/datasetpublications/x1y/konsumsi-provinsi.
- Verified a second official Bapanas dataset at kabupaten/kota depth: “Rata-rata Konsumsi per Jenis Pangan Penduduk Indonesia Kabupaten Kota Tahun 2025”, also kg/kap/tahun. Source URL: https://data.badanpangan.go.id/datasetpublications/4wx/rata-rata-konsumsi-kab-kota. This is the correct next source for replacing equal-share estimates at regency/city level where population mapping is available.
- The provincial page exposes 2025 observations for 38 provinces and commodity-level records; examples include Aceh 2025 rice 93.9 kg/capita/year, corn 0.6, cassava 4.9, sweet potato 1.5, potato 3.8, coconut 2.7, soybean 5.2, peanut 0.2 and mung bean 0.4. These values are source observations and must not be converted to game paddy/whole-coconut units without an explicit stage/unit conversion contract.
- The kabupaten/kota dataset similarly exposes 2025 observations. Its first records include Kepulauan Seribu and the Jakarta administrative cities, demonstrating that locality-level consumption can be sourced directly rather than inferred from provincial equal-split. Do not treat every administrative village/district as having an official consumption observation; the verified dataset depth is kabupaten/kota.
- Runtime source metadata was added to js/national_economy.js for both official Bapanas datasets. No synthetic values were inserted from these sources yet; existing synthetic demand and physical anchors remain unchanged until the numeric master is imported and reconciled.
- BPS non-household consumption remains metadata-only. The official 2025 publication covers rice, dry corn, sweet corn, cassava, sweet potato, soybean, peanut, beef/buffalo, chicken, eggs, fresh fish, shallot, garlic, chili, cooking oil, sugar, wheat flour and salt, but numeric extraction is still pending. Do not fabricate non-household quantities.
- Test guard added in tests/national-economy.test.js for source depth/unit/status. Static syntax should be rerun; full Node/GitHub Actions is still not claimed green until an actual workflow result is observed.

### Next implementation gate
1. Import the complete 2025 Bapanas provincial rows into a versioned CSV/JSON research master, preserving province code, source commodity, food group, value, unit, year and source URL.
2. Import the complete 2025 Bapanas kabupaten/kota rows into a second master; validate unique (region_code, commodity, year) keys.
3. Create an explicit game-commodity mapping table. Rice remains distinct from padi/gabah; coconut remains kg until a sourced kg-to-whole-coconut conversion is approved; broad categories such as “daging ruminansia” must not be split into sapi/kambing without a separate allocation source.
4. Extract BPS non-household numeric tables and reconcile household + non-household demand before using it as physical national requirements.
5. Only after those gates, connect physical demand to regional production, stock, reserve procurement/import and price formation.


## Bapanas 2025 consumption connected to runtime (2026-11-09)

- Official Bapanas national 2025 consumption data was no longer left as source metadata. The 28 leaf consumption observations from the national dataset are registered in `js/national_economy.js` as `bapanasNationalConsumption2025` and transformed by `bapanasConsumptionModel2025`.
- Runtime mapping modes are explicit: `physical` for game commodities with the same kg unit; `downstream_signal` for a downstream source such as rice feeding the paddy demand signal without pretending rice kg equals paddy/gabah kg; `category_signal` for broad source commodities that cannot legitimately be split into a specific game commodity; and `unit_conversion_pending` for coconut because Bapanas reports kg while the game commodity is whole fruit.
- Every one of the 28 source leaf records has a mapping mode and is applied to a runtime demand signal. Category-level observations influence all game commodities in that category; exact physical observations also create annual/monthly physical demand quantities.
- Daily national-economy demand now multiplies the existing behavioral demand by the Bapanas consumption-pressure signal. Therefore the data changes inventory depletion, unmet demand, reserve need and regional price formation; it is not merely stored for display.
- Tests added to `tests/national-economy.test.js`: all 28 source rows must exist with matching values/unit/year/source commodity and a non-inert mapping mode; runtime demand must show a Bapanas-derived pressure and physical demand must be positive.
- The national dataset is verified directly from Bapanas Open Data: 2025 values include rice 87.3, corn 1.5, cassava 10.9, sweet potato 4.0, potato 2.5, ruminant meat 5.1, poultry 10.5, eggs 7.7, milk 2.3, fish 23.1, coconut oil 0.2, palm oil 10.0, coconut 1.0, soybean 8.8, peanut 0.4, mung bean 0.3, sugar 8.4, vegetables 56.5 and fruit 39.1 kg/capita/year, plus the remaining leaf records in the runtime table. (https://data.badanpangan.go.id/datasetpublications/hez/konsumsi_nasional)
- Source definition: Bapanas states this dataset represents average quantities of main foods actually consumed per capita and uses kg/capita/year; it is not itself a production requirement dataset. (https://data.badanpangan.go.id/datasetpublications/hez/konsumsi_nasional)
- Provincial and kabupaten/kota Bapanas datasets remain the next localization layer. Their numeric observations are verified as official source pages but have not yet all been imported into the runtime; do not mark locality consumption as complete until those rows are connected and tested. (https://data.badanpangan.go.id/datasetpublications/x1y/konsumsi-provinsi ; https://data.badanpangan.go.id/datasetpublications/4wx/rata-rata-konsumsi-kab-kota)

### Required next gate
1. Import the complete Bapanas 2025 provincial rows and apply the same runtime mapping contract per province.
2. Import the complete kabupaten/kota rows and use them to replace equal-share locality consumption where an official observation exists.
3. Extract BPS non-household numeric values and connect them to the same demand engine. BPS confirms its 2025 publication estimates consumption/use outside households for 18 staple commodities. (https://www.bps.go.id/id/publication/2026/06/12/162a342d33ebfe0f41a75487/konsumsi-bahan-pokok-nonrumah-tangga-2025.html)
4. Add regression tests proving a province-specific consumption shock changes only its local demand/price path and government reserve response.


## Bapanas runtime regression repair (2026-11-09)

- GitHub Actions run 42547663283 for test commit 5fb69e8f5b2961025557356056b7871bcf95c80a failed while loading `tests/national-economy.test.js`: 35 preceding tests passed, then Node VM raised `SyntaxError: Invalid or unexpected token` at `js/national_economy.js:110`. The root cause was a literal escaped newline (`\\n`) inserted between the physical-demand initialization and Bapanas row mapping, so the runtime script could not parse.
- Inspection also found two runtime initialization defects in the same province-state constructor: `consumptionPressure` and `consumptionCategoryPressure` were not initialized on the state object, and the category-pressure object was reset inside the commodity loop. Corrected the constructor to initialize both maps once and removed the per-item reset.
- Repair commit: `21de12ba199ec289400584de31b9daeb93e522f6` (`fix: initialize national consumption pressure runtime safely`). The repair only changes `js/national_economy.js`; no map files or default branch were changed.
- Workflow run `42547955803` for the repair commit was observed in progress at handoff time. Do not mark this integration green until its final conclusion is successful and all targeted Node suites complete. If it fails, inspect the first failing step/log rather than inferring from later skipped steps.


### Follow-up correction and regression isolation (2026-11-09)

- The first runtime repair commit `21de12ba199ec289400584de31b9daeb93e522f6` did not remove the literal backslash+n token. Run `42547955803` therefore still failed at parse time. This was corrected in `00660b63d8ae1c5a6b3711ca1cd4d28e38a42a6f`; its workflow loaded the national economy suite and reached 46 assertions, confirming the syntax error was gone.
- That run then exposed one test-isolation failure: `government reserve policy is bounded...` expected the default procurement share 0.05, but inherited the prior Lampung test's mutated shared game state where procurementShare had been set to 0. The test now resets `S` to a fresh named game before checking defaults.
- Test isolation fix commit: `904990dbfd0ea23ebd035408a333fe00e4d5b237` (`test: isolate government reserve policy defaults`). Workflow run `42548283611` is the verification gate; do not mark green until it completes successfully.


### Verified green national-consumption regression gate (2026-11-09)

- Final workflow run `42548283611` for test-isolation fix `904990dbfd0ea23ebd035408a333fe00e4d5b237` completed with conclusion `success`.
- The run completed the Node regression suites, UTL oil-palm benchmark source/arithmetic guard, UTP broiler and cattle benchmark provenance/arithmetic guards, official 2024 livestock price benchmark guard, and all standalone Node regression tests. This is the first verified green gate after the Bapanas runtime integration regression.
- Source review reconfirmed Bapanas provincial dataset metadata: 2025 release, province depth, unit kg/capita/year, annual update; page currently exposes 2018–2025 observations. Example 2025 Lampung leaf rows include rice 84.3, maize 1.0, cassava 12.4, sweet potato 3.5, potato 1.2, ruminant meat 4.2, poultry 8.0, eggs 7.6, fish 22.5 and coconut 1.2 kg/capita/year. These are per-capita actual-consumption observations, not production needs.
- The Bapanas kabupaten/kota 2025 dataset page exposes locality-depth observations and the same kg/capita/year unit. Full numeric extraction/import for all provinces and kabupaten/kota is still pending; do not describe either regional dataset as fully integrated into runtime yet. Source pages: https://data.badanpangan.go.id/datasetpublications/x1y/konsumsi-provinsi and https://data.badanpangan.go.id/datasetpublications/4wx/rata-rata-konsumsi-kab-kota.
- Important data modeling constraint: preserve the source's 9-group hierarchy and distinguish aggregate group rows from leaf commodity rows. Never sum a group aggregate and its children together; doing so double-counts consumption. Use only leaf commodity rows for commodity-level demand, with aggregate group rows retained for reconciliation checks.

### Provincial Bapanas 2025 runtime ingestion (2026-11-09)

- Added a verified partial Lampung (province code 18) 2025 extract of 11 leaf observations. It is explicitly partial; no claim that all 38 provinces have been imported.
- Added applyProvincialConsumptionRecords(records) with validation for year, unit, non-negative values, province ID/code, known commodity keys and duplicate province/commodity keys.
- Regional observations adjust local NPC demand pressure by the ratio of provincial per-capita consumption to the national per-capita anchor. Physical quantities are stored separately in regionalPhysicalDemand; national physicalDemand anchors remain intact.
- Category-level pressure changes only when all mapped leaf commodities for that category are present, preventing partial sums from being misapplied.
- Source: Bapanas provincial 2025 dataset, https://data.badanpangan.go.id/datasetpublications/x1y/konsumsi-provinsi. The rendered page confirms Lampung rows (e.g. rice 84.3, maize 1.0, cassava 12.4, sweet potato 3.5, potato 1.2, ruminant meat 4.2, poultry 8.0, eggs 7.6, fish 22.5, coconut 1.2 kg/capita/year).
- Data/model documentation: docs/NATIONAL_COUNTRY_AND_REGIONAL_MARKET_MODEL.md section 11.
- Important: Bapanas group totals and leaf rows coexist. Do not ingest group totals as commodity rows or sum group totals with leaves. Complete provincial file extraction and BPS non-household numeric extraction remain pending.
- Test gate: runs 42548591399, 42548605653, 42548615507 initially exposed that the first integration overwrote national physical-demand anchors and changed a legacy national-only test expectation. Corrected by separating national and regional physical demand layers. Verify the latest workflow after commits c6b8157facaa00e0b86b2be3932a1f2d9f59fb01 and 1d37728b7cb5ad87d11e4f688b63400e02f4de02 before proceeding.
### Final green gate — provincial consumption runtime (2026-11-09)

- Corrected test VM catalog access: COMMODITIES is evaluated inside the VM context, not read as a host property.
- Kept national official physical-demand anchors immutable in province.physicalDemand and stored observed provincial quantities separately in province.regionalPhysicalDemand.
- Added backward-compatible save migration: legacy same-version nationalEconomy saves gain baseConsumptionPressure and regionalPhysicalDemand, then receive the verified partial Lampung seed once. No version bump or destructive state reset.
- Final tested code/test commit: 05a313bd5fa0ce108a38aea9d719ae786b959ff9. GitHub Actions run 42548767064 completed SUCCESS; Node test-runner: 49 passed, 0 failed; UTL oil-palm, UTP broiler, UTP cattle, official livestock price benchmark guards and all standalone Node regression tests succeeded.
- The 11 Lampung observations are an explicitly partial verified extract. Full 38-province import and all 514 kabupaten/kota numeric observations remain pending. Do not treat one province's data as national coverage.
- The prior failing runs (42548591399, 42548605653, 42548615507, 42548668639, 42548677118) exposed and resolved: national-vs-regional physical layer overwrite, old national-only assertion mismatch, and host-vs-VM catalog lookup. The final run above is the verified green result.
- Latest follow-up docs should retain this exact distinction: national anchor != regional observation; household consumption != non-household demand; consumption != production requirement.
### Kabupaten/kota Bapanas 2025 runtime overlay (2026-11-09)

- Verified data.go.id catalogue for Bapanas 2025 kabupaten/kota consumption: dataset ID 3cb84f31-ed74-4a71-b083-1eb4fa49c968; open dataset; fields include year, four-digit locality code, province, locality name, food group, commodity, kg/capita/year; three downloadable resources are listed. Bapanas source page: https://data.badanpangan.go.id/datasetpublications/4wx/rata-rata-konsumsi-kab-kota.
- Integrated five exact leaf observations for code 3101 Administrasi Kepulauan Seribu: beras 88.6, jagung 0.2, singkong 7.1, ubi jalar 0.8, kentang 0.8 kg/capita/year. The sample is explicitly partial; no full 514-locality import is claimed.
- Added applyKabupatenKotaConsumptionRecords, localityConsumptionSnapshot and quoteLocality. Quote overlay applies a bounded experimental local-demand adjustment to province market price index. This is not an order book or cleared transaction.
- Local population remains an equal-share estimate, so local annual physical totals are estimated, not official observed totals. Keep the status explicit.
- Added regression tests for local quote behavior, physical demand snapshot, duplicate rejection, invalid locality code/unit and province-code mismatch.
- Full resource file retrieval is still pending. Next step: acquire CSV/JSON/XLSX, reconcile every locality code and leaf/group row, import all locality observations, then obtain official locality population weights. Do not upgrade coverage status until all 514 kabupaten/kota are validated.
- Model details: docs/NATIONAL_COUNTRY_AND_REGIONAL_MARKET_MODEL.md section 12.
### Green regression gate — kabupaten/kota local quote overlay (2026-11-09)

- Initial implementation run 42549230170 failed because the locality-code validation regex was double escaped and rejected valid four-digit codes. Corrected to the four-digit numeric regex in commit a89759c2e6307c19d230384dc00dedd815abaa6f.
- Final code/test workflow run 42549296642 completed SUCCESS on commit a89759c2e6307c19d230384dc00dedd815abaa6f. Node regression output: 51 tests, 51 passed, 0 failed. UTL oil-palm, UTP broiler, UTP cattle, official livestock price benchmark guards and all standalone Node regression tests succeeded.
- The verified 3101 Kepulauan Seribu sample and quoteLocality overlay are partial data and an experimental local quote factor. They do not constitute a full 514-locality dataset, official locality population estimates, or a local order book.
- Keep the next gate unchanged: acquire actual CSV/JSON/XLSX resource, import and reconcile all locality leaf observations, then source locality population weights and connect local quote/transactions to the order execution model.

### Expanded Bapanas locality extract — Kepulauan Seribu (2026-11-09)

- Revisited the rendered official Bapanas 2025 kabupaten/kota table. It exposes the full 3101 Administrasi Kepulauan Seribu leaf set, including rows omitted from the earlier five-row sample. Imported all 26 leaf observations into `BAPANAS_KABKOTA_CONSUMPTION_2025_PARTIAL`; retained zero values and excluded group aggregates to prevent double counting.
- The data is now available to `localityConsumptionSnapshot('3101')` and `quoteLocality(...)`; the locality quote regression checks representative leaf/category behavior. This does not yet connect the locality overlay to order-book execution or daily stock-flow simulation.
- Bumped `kabkotaConsumptionSeedVersion` to 2 so existing saves that already received the original five-row seed are migrated by merging the expanded 26-row seed. Existing national and provincial layers remain separate.
- Source: Bapanas rendered table https://data.badanpangan.go.id/datasetpublications/4wx/rata-rata-konsumsi-kab-kota; data.go.id catalogue ID `3cb84f31-ed74-4a71-b083-1eb4fa49c968`. Catalogue lists CSV/JSON/XLSX resources, but the actual bulk resource download is still not retrieved. Full 514-locality ingestion and official locality population remain pending.


### Additional official locality publication route and test status (2026-11-09)

- Identified Bapanas's three 2025 kabupaten/kota consumption directory volumes: Sumatera (`https://data.badanpangan.go.id/statisticpublications/t2c`), Jawa/Bali/Kalimantan/Nusa Tenggara (`https://data.badanpangan.go.id/statisticpublications/xz8`), and Sulawesi/Maluku/Papua (`https://data.badanpangan.go.id/statisticpublications/rey`). Bapanas describes these as covering all 514 kabupaten/kota and presenting energy, protein, PPH food-group consumption and PPH scores. These are a separate evidence layer and must not be substituted for the kg/capita/year leaf commodity data.
- Download links lead to Google Drive; the web retrieval session exposes the files but does not return their PDF contents without completing the file access. Full PDF extraction remains pending.
- First CI run after the code-only seed expansion, run 42550858148, failed only because the workflow started before the separate test-file commit had landed: the old assertion still expected five rows while the code already returned 26. The subsequent test commit 98f140c1620c3798679db932bc64fcd283023dee completed run 42550863774 SUCCESS with 51/51 Node regression tests passing. A follow-up test commit 1abb802186ea106abfc8c039bb3ce06aa0cce260 adds an exact 26-key assertion; its workflow run 42550969640 was still in progress at the time of this handoff update and must be checked before claiming that stronger assertion passed.


### Final green gate — exact 26-leaf locality regression (2026-11-09)

- Follow-up commit `1abb802186ea106abfc8c039bb3ce06aa0cce260` asserts the exact 26 locality leaf keys, not only the record count and selected sample values. Group aggregates are absent from the runtime row set.
- GitHub Actions run `42550969640` completed SUCCESS on the test commit. Node regression summary: 51 tests, 51 passed, 0 failed. The UTL oil-palm, UTP broiler, UTP cattle, official livestock price guards and all standalone Node regression steps also completed successfully.
- The earlier code-only run `42550858148` failure is a commit-order race: it tested the code expansion before the subsequent test commit updated the old expected count. The corrected test commit and exact-key follow-up both pass; do not report the transient run as an unresolved product defect.
- Current limitation remains: the 26 rows cover one locality only; the full 514-locality resource is not yet ingested, and `quoteLocality` remains a bounded local quote API rather than order-book clearing or daily local stock-flow execution.


### DKI Jakarta locality consumption expansion (2026-11-09)

- Expanded Bapanas 2025 locality leaf ingestion from one to four DKI localities: 3101 Administrasi Kepulauan Seribu, 3171 Kota Administrasi Jakarta Pusat, 3173 Kota Administrasi Jakarta Barat and 3174 Kota Administrasi Jakarta Selatan.
- Each locality has 26 leaf observations (104 records total). Values include rice, maize, wheat flour, tubers, animal foods, oils, coconut/candlenut, legumes, sugar, vegetables and fruit. Group totals are excluded; zero leaf values are retained.
- Bumped `kabkotaConsumptionSeedVersion` from 2 to 3. Existing saves already seeded with 3101 merge the three additional locality profiles on next `ensure()` without discarding previous rows.
- Added regression checks for all three new locality snapshots, 26-row completeness per locality, representative source values, 4-locality/104-row coverage, and differentiated fish-category local quote behavior.
- Source is the Bapanas 2025 rendered table. The complete CSV/JSON/XLSX resource and the remaining 510 localities are still pending; 4/514 is partial coverage only.


### Jakarta locality seed validation correction (2026-11-09)

- The first 3-locality code commit omitted the comma separating the final 3101 record from the first 3171 record. GitHub Actions runs `42551115807` and `42551127483` exposed `SyntaxError: Unexpected token '{'`; these runs are failures and must not be counted as green.
- Corrected the array separator in commit `832c558a0117ac5ebaeac88a6a1b97656354afc9`. The corrected code is now queued for full targeted regression run `42551236544`. Wait for its conclusion and inspect logs before claiming the 4-locality expansion is validated.


### Full DKI Jakarta kabupaten/kota household-consumption layer (2026-11-09)

- Expanded the Bapanas 2025 leaf-observation set to all six DKI Jakarta administrative localities: 3101 Kepulauan Seribu, 3171 Jakarta Pusat, 3172 Jakarta Utara, 3173 Jakarta Barat, 3174 Jakarta Selatan and 3175 Jakarta Timur.
- Each locality has 26 leaf records, total 156 observations. Group totals are excluded and zero leaf values retained. Source remains kg/capita/year.
- Bumped `kabkotaConsumptionSeedVersion` from 3 to 4 to migrate existing saves and merge the two newly verified locality profiles.
- Added tests for 3172/3175 values, all five non-3101 locality snapshots, six-locality/156-row coverage and the locality quote spread. Full 514-locality coverage remains pending.
- Source evidence is the Bapanas 2025 rendered table at https://data.badanpangan.go.id/datasetpublications/4wx/rata-rata-konsumsi-kab-kota. The complete bulk resource file remains inaccessible through the current retrieval path; only directly rendered rows were ingested.


### Final green gate — all six DKI locality profiles (2026-11-09)

- Corrected seed commit `9d73c28612bca9aa94ef55800c111418de6a1adc` and test commit `613c71227b2c6f3d1ef29e1993b012f768390573` cover six DKI locality profiles (156 leaf records).
- GitHub Actions run `42551355735` completed SUCCESS: 52 tests, 52 passed, 0 failed. All benchmark guards and all standalone regression tests also completed successfully.
- This validates the six DKI locality sample only. It does not validate the remaining 508 of 514 localities, official locality population weights, BPS non-household demand, or local order-book settlement.


### Locality explorer runtime visibility (2026-11-09)

- `getLocalityAggregateAsync()` now returns `householdConsumption2025` for kabupaten/kota rows with a verified Bapanas 2025 extract. The existing `dunia-simulasi.html` locality explorer displays this object through its JSON result panel.
- At district/desa/kelurahan depth, the API explicitly returns `not_available_at_this_administrative_depth`; it does not fabricate village consumption by equal-splitting kabupaten/kota leaf observations.
- The output also marks `localMarketQuoteStatus` as a bounded experimental overlay, not order-book clearing. Added regression coverage by resolving Kota Administrasi Jakarta Selatan (3174) through the administrative master and checking its 26 source leaf rows appear in the locality explorer payload.


### Locality explorer collection mapping fix — green gate (2026-11-09)

- The locality explorer's master lookup used singular `regency`/`city`/`district` keys against plural master collections (`regencies`/`cities`/`districts`), so city/regency/district searches returned empty arrays. Fixed `getLocalityRows()` to map levels to the correct master collection keys in commit `f6994a4a47e697bfc696420ccdf1bb380ca9ed6c`.
- The locality explorer now resolves Jakarta Selatan code 3174, attaches its 26 verified Bapanas leaf observations to the JSON output, and marks desa/kelurahan-level household records unavailable rather than fabricating a downscaled value.
- GitHub Actions run `42551675711` completed SUCCESS: 52 tests, 52 passed, 0 failed; benchmark guards and all standalone regression tests passed.
- Next demographic gate: replace equal-split locality population for the six DKI kabupaten/kota with the official BPS 2025 population table, then source official locality-level population weights outside DKI. Do not claim the six-city population anchor has been integrated until code/tests are committed.


### Official BPS DKI 2025 locality population weights (2026-11-09)

- Added `BPS_KABKOTA_POPULATION_2025` for all six DKI localities using BPS DKI Jakarta Table 3.1.1 (2025). Source unit is thousand persons and runtime stores persons after ×1,000 conversion.
- Population values: 3101 Kepulauan Seribu 29,090; 3171 Jakarta Pusat 1,038,400; 3172 Jakarta Utara 1,819,010; 3173 Jakarta Barat 2,487,200; 3174 Jakarta Selatan 2,219,220; 3175 Jakarta Timur 3,085,060. Sum 10,677,980, matching BPS DKI total.
- `localityConsumptionSnapshot()` and `getLocalityAggregateAsync()` now use official BPS population for these six localities, with source/status metadata. Per-capita Bapanas values are multiplied by these population weights for absolute annual/monthly physical demand. Other localities still use clearly marked equal-share estimates.
- Added regression assertions for all six values, sum reconciliation, Jakarta Selatan population and its maize annual demand calculation. CI is pending for commits containing this change; verify before claiming green.
- Source: https://jakarta.bps.go.id/en/statistics-table/2/MTI0IzI%3D/3-1-1-penduduk-laju-pertumbuhan-penduduk-distribusi-persentase-penduduk-


### Population weight scaling correction (2026-11-09)

- Important model correction: the 200m Arunika population is a scaled game population, not Indonesia's full 2025 projected population. Therefore raw BPS DKI locality counts must be used as relative weights, not copied directly as in-game population counts.
- Added `BPS_DKI_LOCALITY_GAME_POPULATION_2025`, allocated by largest remainder from the six raw BPS 2025 locality weights against the game's DKI province population. The six allocated locality counts reconcile exactly to `provinceSnapshot('dki-jakarta').population`.
- `localityConsumptionSnapshot()` and `getLocalityAggregateAsync()` return game-scale `population`, preserve raw BPS count in `sourcePopulation`, and mark `official_bps_2025_weights_scaled_to_game_population`. Per-capita Bapanas annual totals use game-scale population, not raw Indonesia counts.
- Regression tests assert raw source values sum to 10,677,980 and scaled locality values sum exactly to the DKI game province population. Latest test run is pending.


### Final green gate — BPS population scaling and locality consumption (2026-11-09)

- `BPS_KABKOTA_POPULATION_2025` stores the six official raw source counts. These are relative weights only because the game population is fixed at 200m and provincial populations are scaled. `getBpsDkiLocalityGamePopulation2025()` lazily allocates the DKI game population across the six locality codes using largest remainder; this avoids a top-level initialization-order ReferenceError and preserves the province total exactly.
- `localityConsumptionSnapshot()` now reports game-scale `population`, raw BPS count as `sourcePopulation`, source metadata and `official_bps_2025_weights_scaled_to_game_population`. Bapanas per-capita values convert to absolute annual/monthly demand using the scaled game population, not raw Indonesia population.
- The earlier eager-allocation attempt failed with `ReferenceError: Cannot access 'provinceRecords' before initialization`; commit `e8e33bc4dc44322d9891fbd21e8dd59b0c5e631b` defers allocation until after initialization. Test expectations were corrected to validate game-scale population, raw source population, and exact DKI province reconciliation.
- GitHub Actions run `42552100891` completed SUCCESS: 53 tests, 53 passed, 0 failed. All targeted Node suites, official benchmark guards, and standalone regression/E2E tests passed. Browser smoke test covered all 10 hamburger-menu pages; E2E covered harvest/sale/ledger, payroll/credit, legacy migration and corrupt-save recovery.
- Remaining limitations: only six DKI locality consumption records have full leaf coverage (156 observations); the other 508/514 kabupaten/kota are not imported. Official population weights outside DKI, village/district population data, BPS non-household numeric extraction and actual local order-book settlement remain pending.


### Complete DKI Jakarta consumption table coverage (2026-11-09)

- Expanded locality 2025 Bapanas consumption profiles to all six DKI Jakarta administrative localities: 3101 Kepulauan Seribu, 3171 Jakarta Pusat, 3172 Jakarta Utara, 3173 Jakarta Barat, 3174 Jakarta Selatan and 3175 Jakarta Timur.
- Each locality contributes 26 leaf commodities; total 156 rows. All values in this expansion were checked against the rendered Bapanas dataset table; source rows include per-capita kg/year, and zero-valued leaf observations are retained. Group aggregates are intentionally excluded.
- Bumped `kabkotaConsumptionSeedVersion` to 4. Tests now assert 6 localities, 156 records, 26 leaf keys per locality and representative locality-specific values. Source: https://data.badanpangan.go.id/datasetpublications/4wx/rata-rata-konsumsi-kab-kota.
- This completes DKI Jakarta's six locality profiles only (6/514). The other 508 localities remain pending. Official BPS 2025 population counts for the six DKI localities are already integrated as relative weights and scaled to the Arunika game population; official locality weights outside DKI and the full downloadable Bapanas resource ingestion remain pending.


### Final green gate — six DKI localities plus population-scaled demand (2026-11-09)

- GitHub Actions run `42554038068` completed SUCCESS on test commit `12cc0b5f1b18496d0c0c112057326a67dceda3e8`: 53 tests, 53 passed, 0 failed. The targeted market/NPC/inventory Node suites, all four official benchmark guards, and all standalone Node regression tests passed.
- This gate validates the six DKI Bapanas profiles (156 leaf observations), six BPS population weights, scaled game population reconciliation, and locality-level consumption snapshots/quotes. It does not imply full national locality coverage or the order-book execution layer.
- Bapanas page source `https://data.badanpangan.go.id/datasetpublications/4wx/rata-rata-konsumsi-kab-kota` remains rendered and searchable but its 16MB+ page body exceeds the web retrieval size limit. Data.go.id catalogue lists CSV/JSON/XLSX download resources, but direct resource URLs/bytes have not been recovered. The full 514-locality raw import remains the next data gate.


### Locality household-consumption runtime integration (2026-11-09)

- Root-cause finding: before this change, the six DKI Bapanas locality profiles were persisted and exposed by localityConsumptionSnapshot() / quoteLocality(), but were not aggregated into the province's daily consumptionPressure. Consequently the data could be inspected and quoted but did not yet change the DKI daily demand/inventory simulation.
- Added applyCompleteKabkotaConsumptionToProvince() in js/national_economy.js. It only activates when every kabupaten/kota in a province has the same verified leaf-key coverage and every locality has an official BPS population weight. Incomplete coverage or missing population weights remains explicitly partial_not_applied_to_daily_province_demand.
- DKI is currently the only province meeting the gate: six localities × 26 leaf observations = 156 records, with six BPS 2025 locality population weights scaled to the Arunika DKI game population. It now calculates population-weighted per-capita leaf values, updates DKI consumptionPressure, and writes physical-demand totals into regionalPhysicalDemand; runDaily() consumes that pressure when calculating daily demand and inventory.
- The locality schema gate deliberately uses the 26 verified locality leaf keys, not the national 28-row list: two national-level leaf rows are not present in the locality dataset extract. Parent food-group aggregates remain excluded.
- Existing saves re-run the deterministic aggregation during ensure(); the base pressure is retained separately so repeated loads do not compound the locality ratio.
- Added test: complete DKI locality consumption and BPS weights feed province daily demand and inventory. It asserts the complete-coverage gate, 6 localities, 26 keys, 156 records, changed maize pressure, population-weighted physical demand, and a daily inventory update.
- Commits: 47cf1fe689d97b5b9f0cb4742acdb2c35577db0d (runtime integration), 92ae83d0c0b64cbf045e98b255c8fd8888b2b6cd (save migration reapplication), 4fd92ee5a1c68bd1d452d641292ce16d5db20c10 (26-leaf schema gate), b7189ba182842513fa3c3fce3037a580ba1efd37 (runtime regression test).
- GitHub Actions run 42555141202 completed SUCCESS on test commit b7189ba182842513fa3c3fce3037a580ba1efd37: Node regression 54 tests, 54 passed, 0 failed; market/NPC/inventory suites, all four official benchmark guards, all standalone regression tests, browser smoke test (10 hamburger pages), gameplay E2E, finance/payroll E2E, legacy migration E2E and corrupt-save recovery E2E passed. Run 42555130528 (schema gate) and 42555118456 (save migration reapplication) also completed SUCCESS. Run 42555087894 validated the runtime code commit and completed SUCCESS. Review logs before reclassifying any future regression.
- Data access investigation: the data.go.id catalogue confirms the Bapanas dataset is open and lists three downloadable resources, but its page does not expose resource IDs/URLs in the rendered content. The attempted CKAN package_show URL is inaccessible through the current web retrieval path; the model container also cannot resolve external DNS. No source data was fabricated or imported from incomplete snippets. Full 514-locality CSV/JSON/XLSX ingestion remains blocked pending a recoverable official download or user-provided source file.
- Coverage remains 6/514 localities. Official BPS population weights outside DKI, BPS non-household numeric extraction, district/village population and consumption, and local order-book settlement remain pending.


### Final green gate — strict 26-leaf coverage contract (2026-11-09)

- Tightened the DKI daily-demand activation gate to require the exact 26 leaf commodity keys present in the Bapanas 2025 kabupaten/kota table, with all six DKI localities carrying every key and all six official BPS locality weights. Equal or identically incomplete subsets can no longer be mistaken for complete source coverage.
- Commit: be354222701845560145f5bc70c539888eaa046b.
- GitHub Actions run 42555294636 completed SUCCESS: 54 Node regression tests, 54 passed, 0 failed; all four official benchmark guards and all standalone Node regression/browser smoke/E2E tests passed.
- Current data coverage is unchanged at 6/514 localities. The stricter gate improves data-integrity protection; it does not expand the source dataset.


### Local order-book matching primitive — initial implementation (2026-11-09)

- Added `MARKET_ENGINE.matchOrderBook(orders, {now})` in `js/market_engine.js` as a deterministic local matching primitive. It groups by commodity, region and market stage; orders must carry actor type, owner, integer quantity, bounded limit price and creation time.
- Matching priority: best price first (highest bid / lowest ask), then time, sequence and order ID. Crossed orders execute at the resting maker order's limit price. Partial fills decrement both sides; residual quantities remain open.
- Expired and malformed orders are returned separately. Self-trading by the same owner is prevented by cancelling the newer order. The function returns fill records, open orders, expired/rejected/prevented orders, executed quantity and executed notional.
- This is intentionally an engine primitive only: it does not yet persist orders, mutate player/NPC cash or inventory, write HPP/ledger entries, or call the market repricer. No claim of full in-game order-book settlement is made until those integrations are implemented and tested.
- Code commit: `780f6d82ad81b6a408c506682da244ed02d00026`. Regression commits: `a539d1051848f23347422f6383fc320a7e590125`, deterministic fixture correction `26b08f712dee590cdbbae746a5dc07bbd749208c`, and cross-realm assertion correction `0ae3174ceeb0183bfabae00fad2405394f81aa66`.
- Added tests for maker-price execution, partial fills, price priority, regional/stage isolation, invalid/out-of-bound orders, expiry, self-trade prevention and residual open orders.
- GitHub Actions is configured to run on pushes to this branch for `js/**` and `tests/**`. At handoff time, no completed run/status has yet been retrieved for latest test commit `0ae3174...`; validation remains pending and must not be described as green.
- Next integration gate: persist a bounded daily order queue in save state; submit actual player and NPC bids/asks; settle fills atomically into cash, inventory, weighted-average HPP and double-entry ledger; only then pass executed fills to the price engine. Add rollback/atomicity and save-migration tests.


#### Fractional commodity quantity correction (2026-11-09)

- Code review found the initial matcher rejected every non-integer quantity. This is too restrictive for physical commodities whose trade units can be fractional (for example kg or liters).
- Removed the integer-only quantity constraint while retaining finite-positive validation. Zero, negative, NaN and infinite quantities remain invalid.
- Added a regression case: buy 2.75 units against sell 1.25 units, execute 1.25 and leave 1.50 open; notional is checked exactly.
- Code commit: `3fba31364f0c46e612737900dbaf3dbee0c25c4a`; test commit: `974a92ac33d9390039cd586cfc6c7cb47d6ed644`.
- GitHub Actions result for the latest test commit has not yet been retrieved. Do not claim this new test passed until a completed run is inspected.


#### Executed-fill price-flow adapter (2026-11-09)

- Each matched fill now records the incoming aggressor side and actor type. A resting bid hit by an incoming sell is a sell-side price event; a resting ask lifted by an incoming buy is a buy-side price event.
- `matchOrderBook()` returns `priceTransactions` derived exclusively from fills. Each row carries commodity, aggressor side, executed quantity, maker execution price, actor type, region, stage and fill ID. Unfilled/open orders are never converted into price transactions.
- This is an adapter output only. The daily game loop does not yet call it, and no cash, inventory, HPP or ledger settlement is implied.
- Code commit: `8f3db601e91549bc00896e07c48783db962ac82a`; test commit: `90e4d04d895d532c45e1d59f9b8b8c7e5dea6504`. CI for this latest test commit remains unverified.


## Player order persistence and reservation slice (2026-11-09)

- Added `js/player_order_book.js` and loaded it immediately after `js/state.js` in `index.html`. API: `AgroPlayerOrderBook.submit()`, `cancel()`, and `snapshot()`.
- Player orders are stored in the existing save payload under `S.marketOrderBook`; old saves lazily receive an empty version-1 order book when the API is first used. Open-order cap is 200; default expiry is 7 in-game days, configurable from 1 to 365.
- Buy orders reserve buying power at `quantity × limitPrice`; sell orders reserve raw producer-stage stock by commodity. Multiple orders cannot reserve the same cash or stock twice. Reservations are recomputed from open orders, so cancel releases the remaining reservation. The saved player region is used unless an explicit region is supplied.
- Current scope is deliberately limited to producer-stage orders because the player inventory model for other stages is not yet integrated. Fractional physical quantities are accepted. Price bounds come from the 60-item market catalog.
- Critical boundary: submitting/cancelling an order does **not** debit cash, mutate inventory/inventory cost, recognize HPP/revenue, post ledger entries, or move market prices. This slice only reserves assets. Matching and settlement are not yet wired; do not describe this as a functioning trading market yet.
- Regression coverage added in `tests/player-order-book.test.js` for buying-power reservation, inventory reservation/double-sell prevention, cancellation, invalid scope/price/expiry, save-payload persistence, immutable snapshots, player-region binding, and default expiry. The targeted workflow now includes this suite.
- Commits: module `e81a052826e6527d2beb80760c7b1f06466399ca`, lexical state binding correction `f76f963e30e031a8f389a39759e8c642c55ca080`, subsequent reference corrections `cce0704a12706f9fd7b7f35af79e99cdf82242c1` and `45cba184b5556090d3fdf4762f5ecfb9777030b4`; script load `c72f905d0f188a6a2066e371a57a867c0ee9035e`; tests `0fa2df6d2043d6f752d28aa532b1cebbe0424aaa`; workflow inclusion `26178630836d20973471733e4698a929293817a8`.
- Local execution was unavailable in the current environment (GitHub clone failed because network DNS was unavailable). Wait for the workflow run and inspect its result before claiming the tests pass.
- Next required gate: connect the now-persisted regional NPC proposal batch and player open orders to `matchOrderBook()` with fill provenance and idempotent fill storage; then implement atomic settlement for both sides (cash, stock, weighted-average inventory cost/HPP, revenue/COGS ledger) with rollback and save/load/idempotency tests. Do not treat provisional `SUPPLY_PROFILE` quantities as official production data.


## Player order-book expiry and reservation release (2026-11-09)

- Added `AgroPlayerOrderBook.expire(targetDay)`. It expires only open orders whose `expiresAt` is less than or equal to the supplied in-game day, sets remaining quantity to zero, records `expiredAt`, and recomputes reserved cash/inventory from the remaining open orders.
- The daily rollover calls expiry for `S.day + 1` immediately before advancing the game clock. An order with `expiresAt = 12` remains eligible during day 11 and is expired as day 12 begins.
- Expiry is idempotent: already expired/cancelled orders are not processed again. Invalid target days are rejected without changing open orders. The operation writes a ledger informational event only when at least one order expires; it does not post a cash or inventory transaction.
- Added regression coverage for buy-cash release, sell-stock release, day-boundary behavior, repeated expiry and invalid day input. GitHub Actions validation for the latest test commit must be inspected before declaring this slice green.
- Commits: `0fc10895d3149441752ec46f1a40f7a42f67815e` (expiry API), `aa0818b7d849086bdd0d7fe7d27cc24b5a2d4e7f` (daily rollover hook), `9c71791796940558b618e86d6cecd9ea05c9726a` (regression tests).
- Remaining next gate: create NPC orders only from explicit regional producer/inventory and consumption/capacity evidence; then connect the pure matcher. Do not infer NPC limit quantities from the aggregate background-economy price tick. Settlement remains unimplemented: no fill yet mutates cash, inventory, weighted-average cost/HPP, or double-entry ledger.


## Regional NPC order proposal engine (2026-11-09)

- Added `js/npc_order_generator.js`, loaded by `index.html` after `national_economy.js`. API: `AgroNpcOrderGenerator.buildDailyOrders({day, provinces, catalog, getPrice})`.
- `national_economy.js` now records the actual daily runtime flow per province/commodity as `dailyProduction`, `dailyDemand`, and existing `unmetDemand`; these are included in `provinceSnapshot()`. Legacy province states lazily receive the new daily maps.
- NPC supply proposals use only `dailyProduction`; NPC demand proposals use only `unmetDemand`. Aggregate `inventory` and government `reserve` are deliberately not used to invent producer-stage stock. Missing/zero flow or missing market price produces no order.
- Proposals are region-scoped, deterministic by game day/region/commodity, expire at the next in-game day, and use separate aggregate buyer/seller pool identities to avoid treating the same NPC pool as both sides.
- Critical calibration boundary: these are **aggregate simulated NPC pools**, not individually stocked agents. The quantity source `dailyProduction` is currently generated by the existing provisional `SUPPLY_PROFILE` and demand model; it is not official provincial production statistics. Demand flow is shaped by Bapanas 2025 records where mapped but is not yet a fully reconciled household + non-household demand series. Every generated order is tagged `experimental_regional_simulation_aggregate`. Do not describe these quantities as official or calibrated real-world NPC capacities.
- Daily rollover now generates and persists one validated NPC proposal batch in `S.marketOrderBook.npcOrders` via `AgroPlayerOrderBook.replaceNpcOrders()`. The operation is idempotent per game day, validates actor/region/stage/price/quantity/expiry contracts, and replaces the prior day's NPC batch without touching player reservations.
- This slice still does not call `matchOrderBook()`, settle cash/stock, update inventory cost/HPP, post transaction ledger entries, or reprice from NPC order fills.
- Regression coverage: `tests/npc-order-generator.test.js`, daily-flow snapshot coverage in `tests/national-economy.test.js`, and idempotent batch persistence/contract tests in `tests/player-order-book.test.js`; targeted workflow includes the NPC generator suite. GitHub CI status for the latest changes remains unverified.
- Next gate: calibrate producer capacity and regional demand using official province-level data with compatible commodity, unit, stage, year and source; then connect persisted NPC/player orders to matching. Settlement remains blocked until atomic ledger/inventory contracts are proven.


## Condition-based commodity storage and spoilage assessment (2026-11-09)

- Added `js/commodity_storage.js` and loaded it in `index.html` immediately after the commodity catalog. Public API: `AgroCommodityStorage.profiles` and `AgroCommodityStorage.assessLot(lot)`.
- The assessment is condition-based, not a daily countdown. It accepts commodity, lot age, moisture percentage, temperature, relative humidity, flood exposure/duration, whether drying occurred after flood, product form, physical damage, observed pests and observed mold/rot.
- Initial source-backed profiles cover only paddy (`padi`), dry shelled maize (`jagung`) and coconut (`kelapa`). All other commodities explicitly return `research_required`; they do not inherit a fabricated shelf life.
- Paddy references distinguish moisture and temperature. FAO's storage table reports sharply different storage durations at 18% moisture across temperatures; e.g. about 2 days at 30°C. Other FAO/Indonesian references discuss longer storage under lower moisture and controlled containers. These are conditional reference points, not a universal expiry date. Sources: https://www.fao.org/4/t0522e/T0522E09.htm ; https://pustaka.bppsdmp.pertanian.go.id/info-literasi/info-teknologi-pascapanen-padi-teknologi-pengeringan-dan-penyimpanan
- Maize references distinguish dry shelled grain from wet maize. Indonesian agricultural guidance recommends about 12% moisture for storage; 14% may remain storable for a long period depending on temperature and initial fungal infection. Sources: https://tanamanpangan.bsip.pertanian.go.id/storage/assets/uploads/publikasi/hWTgjjZIWenPLFk4Furv2cybMDDQ8GW39TtHKpbW.pdf ; https://babel.brmp.pertanian.go.id/berita/penanganan-pasca-panen-yang-baik-good-handling-practices-pada-jagung
- Coconut profile distinguishes mature husked, mature dehusked, young intact and young partially dehusked forms. USDA reference: mature husked coconut can remain at ambient conditions around 3–5 months; young tender coconut studies show storage behavior depends strongly on intact perianth/husk and temperature. Sources: https://www.ars.usda.gov/arsuserfiles/oc/np/commercialstorage/commercialstorage.pdf ; https://pmc.ncbi.nlm.nih.gov/articles/PMC3551135/
- Flood exposure that remains wet and undried for 3 or more days escalates to `critical` risk in this first simulation contract. This does not automatically mark a lot spoiled: only observed mold/rot confirms spoilage. This is an explicit game risk rule based on the requested scenario and must be calibrated against local field evidence before it becomes a deterministic loss rule.
- Important boundary: the new assessor is loaded and testable, but the current national economy inventory remains aggregate (not age-cohort lots) and does not yet run automatic stock write-offs through this assessor. Do not claim commodity spoilage has been fully integrated into NPC or player inventory. The next required implementation is a lot/cohort inventory contract with source/harvest day, moisture, product form, storage conditions and flood event, then FIFO assessment, quantity/quality loss, valuation and ledger posting with idempotent tests.
- The legacy player coconut freshness bands remain separate: `DATA.degrade.muda=14`, `DATA.degrade.tua=25`; this is the existing young-to-old-to-rotten game quality rule, not a generic shelf-life rule for all coconut forms or commodities. Do not replace it without explicit approval and field calibration.
- Regression suite: `tests/commodity-storage.test.js`; targeted workflow now runs it. CI must be inspected before claiming the new suite passed.


### Storage-model CI validation and VM fixture correction (2026-11-09)

- First CI run 42570632024 failed 82/83 in the existing NPC-order persistence test, not in the new storage tests. Root cause: the test read top-level lexical S as context.S; lexical bindings in the VM context are not exposed as object properties. The storage tests all passed in that run (6/6); the one failure was "daily NPC order batches persist once...".
- Corrected the fixture to read state through vm.runInContext('S.gold', context) and vm.runInContext('S.landSystem.inventory.jagung', context). Commit: ee5596bd6a1e1a88041fc6c28565d5bd484ecfc6.
- GitHub Actions run 42570692777 (run 358) completed SUCCESS on the correction commit: 83/83 Node test-runner tests passed, all four official benchmark guards passed, and all standalone regression/browser smoke/E2E suites completed successfully. Run: https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/42570692777
- Validation proves the assessor's unit contracts and the repository regression suite; it does not prove real inventory write-off integration. Actual age-cohort inventory, FIFO quality loss, flood event propagation and accounting write-off remain the next implementation gate.


## Full-catalog condition-based storage and spoilage (2026-11-09)

- Replaced the three-item-only storage prototype with `js/commodity_storage.js` profiles covering every actual ID in the 60-item `COMMODITIES` catalog. Regression explicitly loads `js/commodities.js` and asserts all 60 IDs have a matching profile.
- Profile groups are not a claim that all 60 have been individually measured. Each item receives a commodity-specific override where available and otherwise a transparent category reference. Confidence is recorded as `conditional_reference`, `category_reference`, `provisional_research_required`, `state_dependent` or `conservative_game_horizon`. Exact local calibration for several plantation crops and product forms remains **butuh riset lanjutan**.
- Main classes: dry grain, cured bulbs, root/tubers, leafy vegetables, fresh vegetables, rhizomes, fruits, plantation harvests, live livestock, live aquaculture, honey and mushrooms. Whole/live stock is not assigned a food expiry clock. Slaughtered meat and harvested fish are handled through separate `raw_meat`, `raw_beef_cut`, and `raw_fish` forms.
- Important form overrides: mature husked coconut (USDA ambient reference around 3–5 months), young partially dehusked coconut, opened/cut/peeled flesh (shorter horizon), raw poultry (USDA 1–2 refrigerated days), whole beef cuts (3–5 refrigerated days), raw fish (FAO temperature/species-dependent), frozen products, and ice. Ice is modeled as melting, not microbial spoilage; the existing warung's one-day ambient ice loss remains, while freezer storage protects it.
- Thermal model separates ambient tropical baseline from refrigerated reference conditions. Temperature changes equivalent age with a Q10-style multiplier; relative humidity, moisture, physical damage, opening/cutting and undried flood exposure modify deterioration. This is a simulation approximation, not a validated predictive microbiology model. Do not describe the coefficients as universal physical laws.
- The three-day undried flood case raises wet grain/tuber risk to critical without forcing automatic loss. Confirmed mold/rot or shelf-life exhaustion is distinct from critical risk.
- New player agricultural harvests create persistent storage lots with receipt day, quantity, unit cost, product form and environmental conditions. Daily transition ages known lots; expired lots are written off from aggregate raw inventory and inventory value, with a COGS/loss posting and `dayLog.storageWriteoffs`. FIFO consumption is connected to raw-commodity sale and processing. Old aggregate saves migrate to age-unknown lots and are preserved rather than assigned fabricated age or discarded.
- The game has an in-game warehouse control in the commodity-economics panel: ambient / refrigerated / freezer, temperature and relative humidity. It updates existing player storage lots; new receipts inherit the configured conditions. Whole legacy coconut stock classification now uses the condition model instead of the fixed 14/25-day thresholds. Opened coconut work-in-process records `quarterOpenedDay`; it is assessed separately and spoiled opened flesh is written off. The warung fridge can protect the opened coconut.
- Important integration boundary: livestock slaughter, fish harvest-to-chilled-meat transitions, and a complete age-cohort model for the legacy `S.stock` whole-coconut pool still need dedicated gameplay integration. The raw-meat/raw-fish assessment API exists, but the game does not yet expose a complete slaughter/processing workflow for every livestock/fish type. Do not claim those flows are complete.
- Sources: FAO grain storage https://www.fao.org/4/t0522e/T0522E09.htm ; FAO horticultural storage/perishability https://www.fao.org/4/x5403e/x5403e09.htm and https://www.fao.org/4/y4358e/y4358e08.htm ; FAO chilled fish https://www.fao.org/4/v7180e/v7180e07.htm ; USDA raw meat https://ask.fsis.usda.gov/article/How-long-can-I-keep-meat-in-the-refrigerator ; USDA coconut storage https://www.ars.usda.gov/arsuserfiles/oc/np/commercialstorage/commercialstorage.pdf ; tender coconut study https://pmc.ncbi.nlm.nih.gov/articles/PMC3551135/
- Tests: `tests/commodity-storage.test.js` covers full catalog matching, whole vs opened coconut, ice melting/freezer, poultry/beef/fish chilled forms, live animals/aquaculture, temperature/humidity response, damage, legacy stock migration, FIFO, flood escalation and mold/rot. Inspect the latest Actions run before claiming final green status.


### Full-catalog storage regression verification (2026-11-09)

- GitHub Actions run **42571729040** completed SUCCESS on code commit `f2d0cd6e1530fcf1174b43f0617a02341ce936c1`: https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/42571729040
- Node test-runner: **91 passed, 0 failed**. All four existing official benchmark guards passed. Standalone Node regression suite passed. Browser smoke, legacy-save E2E and corrupt-save E2E passed.
- The run includes the final 60-ID profile coverage fix, ambient/refrigerated baseline correction, FIFO lot-array synchronization, and expired-lot inventory/value write-off path.
- Earlier push runs during incremental development failed on intermediate commits because the catalog registry omitted `kelapa`, flood-risk escalation was being overridden by expiry classification, and FIFO filtering was not written back to `state.landSystem.storageLots`. Those root causes were corrected before the successful run; do not report the intermediate failed runs as current state.
- The subsequent documentation-only commits update this handoff and national model description; code tested by run 42571729040 is unchanged by those documentation commits.


## Runtime data-binding guard — 2026-11-09

- Latest feature-branch HEAD at this checkpoint: `af141267b45b61dbf96934b94c876efd7dfd5733`.
- Verified numeric datasets are not merely exposed through `runtimeDataRegistry()`; `js/national_economy.js` now exposes `runtimeDataUsageAudit()`, which checks that each verified dataset reaches a live runtime calculation/state: Bapanas national consumption model, Bapanas monthly seasonal demand, verified Lampung provincial consumption, verified Kepulauan Seribu kab/kota consumption, BPS DKI kab/kota population weights, physical demand anchors, and the administrative master.
- `tests/national-economy.test.js` now requires every verified dataset to report runtime application. This is a binding/usage guard, not a claim that pending datasets are complete.
- BPS Non-Rumah Tangga 2025 remains pending because numeric extraction has not been verified; it is intentionally excluded from runtime demand totals.
- No changes to `main`, `peta.html`, or `js/map_engine.js`.
- CI for this newest checkpoint has not yet been observed as completed green; do not report it as passed until GitHub Actions provides a completed result.


### Runtime dataset audit correction — 2026-11-09

- The monthly Bapanas registry previously counted the two wrapper properties (`source` and `records`) instead of the actual commodity records. This was corrected: `runtimeDataRegistry()` now reports `Object.keys(BAPANAS_MONTHLY_DEMAND_2025.records).length`.
- `runtimeDataUsageAudit()` now checks that all monthly coefficients have 12 finite values and that a game-day calculation has produced daily regional demand. The regression test initializes a clean game state, runs day 1, and verifies the Bapanas rice-to-paddy seasonal coefficient plus a positive daily demand signal for the mapped runtime commodity `padi`.
- The first new test attempt failed because its assertion checked `beras` instead of the mapped runtime ID `padi`. The failure was confirmed from the Actions log and corrected; this was a test assertion error, not a game-engine runtime failure.
- Corrected code/test checkpoint: `9816daac0576047dbe166257ad6e3fb93d9b5daf`.
- GitHub Actions run **42580552205** completed **SUCCESS**: Node regression suite, UTL oil-palm benchmark guard, UTP broiler and cattle benchmark guards, official 2024 livestock price benchmark guard, and all standalone Node regression tests completed successfully. https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/42580552205
- The run is evidence for this branch checkpoint only. It does not imply that all BPS/Bapanas non-household data or every Indonesian locality has been imported. BPS non-household 2025 numeric extraction remains pending; the six DKI kab/kota population weights and one Kepulauan Seribu consumption extract remain explicitly scoped partial datasets.
- No changes to `main`, `peta.html`, or `js/map_engine.js`.


### Maize all-channel demand enters NPC market runtime — 2026-11-09

- `js/national_economy.js` now consumes `REAL_ECONOMIC_DATA.maizeNationalDemand.nationalBalanceProjection2025.totalNeedTon` and the BPS 2025 mid-year population denominator. The denominator is explicitly recorded in `js/real_economic_data.js` as 284,438,800 persons.
- Formula: game-scale annual maize demand (kg) = official projected total need (tonnes) × 1,000 × (game population / official population). Provincial monthly demand is allocated by each game's province population and divided by 12. Bapanas monthly coefficients continue to distribute the annual quantity seasonally in `runDaily()`.
- The source total is the exact Table 5.6 balance projection value 14,720,163 t. The separate rounded Pusdatin summary is 14,720,000 t, leaving a 163 t display-precision difference. The runtime preserves both values and does not silently reconcile them.
- This is **all-channel total need** (feed and other uses included), not household-only consumption. Bapanas direct-food consumption (national 1.5 kg/person/year; Lampung 1.0) remains a separate household signal. The direct-food pressure ratio is retained in `consumptionPressure`, but is deliberately not multiplied into the all-channel maize market-demand volume.
- Existing NPC maize demand, production, inventory, reserve and unmet-demand quantities are scaled once to the new physical-demand basis. Migration marker: `maizeTotalDemandRuntimeVersion: 1`. The migration preserves each province's prior stock-cover and supply/demand ratios; it does not touch player-owned business inventory or transaction history.
- BPS final 2025 maize production (16.16 Mt at 14% moisture) is loaded into `s.national.marketSupplyReference2025.jagung` as an official supply reference. It is **not yet allocated to provinces or substituted into NPC production** because official provincial production distribution and source-scope/moisture reconciliation remain open. The runtime explicitly records that it is not a directly compared balance against projected demand.
- Mass-unit conversion from tonnes to kg is applied, but the demand source's moisture basis is not explicit. This is flagged in runtime as `tonne_to_kg_mass_conversion_only_moisture_basis_not_explicit_in_demand_source`; moisture adjustment is not invented.
- Registry entries: `kementan_maize_total_demand_projection_2025` and `bps_maize_production_2025`. Runtime audit checks actual per-province demand, national production reference storage and the migration version.
- Regression coverage includes national demand conservation across 38 provinces, separate household-vs-all-channel signals, source precision discrepancy, runtime daily demand, registry/audit, and one-time legacy-save migration preserving stock-cover ratios.
- Code/test checkpoint: `4d7bbadac10b84876232347b1da388d3383b50fd`. GitHub Actions run **42585406367** completed **SUCCESS**, with **100/100 Node tests** and the benchmark guards, browser smoke setup and standalone regression suite all successful: https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/42585406367
- Open work: do not allocate BPS national final production across provinces without a verified provincial distribution. Do not treat 14.72 Mt total demand as household consumption. More crop-specific physical-demand runtime integration requires verified demand scope, unit, product form and population denominators.


## Physical daily-demand ledger (2026-11-09)

- `runDaily()` now calculates a separate `dailyPhysicalDemand` ledger in kg/day from verified physical demand records. Province-level verified records take precedence over national per-capita anchors; the official all-channel maize projection takes precedence over the household-only maize anchor.
- Records explicitly marked `conversion_pending` (including the coconut mass-form anchor) are excluded from the physical ledger. Bapanas monthly coefficients are applied to the corresponding commodity physical-demand ledger using the 30-day simulation month. Commodities without a verified monthly coefficient use an even 1/12 annual allocation per 30-day game month.
- The aggregate is exposed as `national.dailyPhysicalDemandKg` with unit `kg/day`; province snapshots expose `dailyPhysicalDemand`.
- This ledger is deliberately not fed into the legacy synthetic inventory, production, unmet-demand index, NPC order-book quantities, or price index. Those quantities do not yet share a verified physical kg basis. Order-book settlement remains blocked pending provincial physical supply, conversion/yield/loss factors, and stock-unit reconciliation.
- The former maize special-case that suppressed consumption pressure was removed; legacy index demand continues to use the validated consumption-pressure signal, independently of the physical kg ledger.
- Tests assert daily kg demand, monthly coefficient application, national aggregation, snapshot exposure, and preservation of the dimensional boundary.

## Provincial maize production references (2026-11-09)

- `js/real_economic_data.js` now contains `maizeProvincialProduction2025Partial`: official final BPS 2025 provincial production references for Lampung and Nusa Tenggara Barat (NTB), both dry shelled maize at 14% moisture.
- Lampung: 1.26 million tonnes; harvested area 194.49 thousand ha; BPS Lampung release 2026-02-05: https://lampung.bps.go.id/id/pressrelease/2026/02/05/1636/pada-2025--luas-panen-jagung-pipilan-mencapai-194-49-ribu-hektare-dengan-produksi-jagung-pipilan-kering-kadar-air-14-persen-sebanyak-1-26-juta-ton-.html
- NTB: 1.18 million tonnes; harvested area 173.09 thousand ha; BPS NTB release 2026-02-02: https://ntb.bps.go.id/id/pressrelease/2026/02/02/1115/corn-harvest-area-and-production-in-west-nusa-tenggara-province-in-2025--fixed-figures-.html
- Both figures are rounded abstract values, not exact tonnes. Runtime metadata records their precision and provenance. The dataset is partial (2/38 provinces), not a complete supply distribution.
- `js/national_economy.js` attaches these observations to `national.marketSupplyReference2025.jagung.provincialProduction2025Partial`, registers them, and includes them in `runtimeDataUsageAudit()`.
- **Not used as daily NPC production, inventory, order-book stock, or price input.** Rounded annual totals are reference-only. No residual national production is distributed to the remaining 36 provinces.
- Test coverage checks source coverage, unit/moisture basis, values, registry binding, audit consumption, and the explicit no-daily-supply boundary.
- Next: ingest the complete BPS 2025 provincial table with exact monthly tonnage for all 38 provinces (or another official exact table), verify monthly totals against national totals, then model harvest timing and post-harvest loss before converting output into NPC physical stock.
- CI status for this change set must be read from the latest branch workflow result; an empty commit status is not a passing test result.

- Canonical runtime province key for NTB is `nusa-tenggara-barat` (not the shorthand `ntb`); the dataset and regression test use the canonical game identifier.

## All-60 commodity physical coverage and paddy supply integration (2026-11-09)

- Scope is the full 60-ID catalog in `js/commodities.js`, not maize-only. `js/national_economy.js` now builds `commodityPhysicalCoverage` for every catalog ID in all 38 provinces and exposes `commodityPhysicalCoverageSnapshot(provinceId)`.
- Each commodity coverage record carries catalog/market status, storage-profile status, growth cycle, unit and unit-quality status, physical-demand evidence status, physical-supply evidence status, annual supply reference where available, and daily-supply readiness. Missing official quantities remain pending/null; no fake physical quantities are generated.
- Daily physical supply is explicitly separated from the legacy index market. Every commodity receives a `dailyPhysicalSupply` slot, but it remains null until source-backed monthly/harvest timing and product-form conversion are validated.
- `js/real_economic_data.js` now contains `paddyProvincialProduction2025`: all 38 BPS province rows for 2025, both GKG paddy tonnes and BPS rice-equivalent tonnes, with source URL, method, units, year, and definition.
- BPS source: Produksi Padi dan Beras Menurut Provinsi, 2025; last updated 2026-02-12; KSA and crop-cutting survey; paddy production is GKG, not rice: https://www.bps.go.id/id/statistics-table/3/ZDNaak0yODBUVTlGYW5sa2REUkVUVVY1YVZkbmR6MDkjMw%3D%3D/produksi-padisup1-sup-dan-beras-menurut-provinsi--2022.html
- Published national GKG production is 60,207,101 tonnes. The 38 provincial GKG rows sum to 60,207,098 tonnes, a 3-tonne discrepancy. The dataset and engine preserve this difference rather than silently forcing equality. Provincial rice-equivalent rows sum to 34,690,959 tonnes.
- Engine stores the paddy annual supply reference in `national.marketSupplyReference2025.padi` and each province's `marketSupplyReference2025.padi`. It does not divide annual production into daily production. Monthly harvest distribution, losses, moisture adjustment, milling yield and inventory conversion remain pending.
- `runtimeDataRegistry()` now reports the all-60 commodity coverage separately from official-source verified datasets. `runtimeDataUsageAudit()` checks the paddy reference and that all 60 catalog IDs have active market and storage coverage.
- Tests cover 38 paddy rows, source arithmetic, provincial runtime binding, 60 commodity coverage records, and the null daily physical supply boundary.
- Coverage is not the same as complete official physical calibration: official per-commodity demand/supply, locality breakdown, monthly seasonality, price series, unit normalization, production inputs/HPP, livestock output and aquaculture harvest still require commodity-specific ingestion. For each of the remaining commodities, status remains pending until evidence is sourced and tested.
- Next work must continue across all 60 IDs by commodity family: staple crops; horticulture and roots; plantation and spices; fruit; livestock and animal products; aquaculture and fisheries; then connect source-backed physical supply/demand to NPC transactions only after unit and timing validation.

## National horticulture production references (2026-11-09)

- `js/real_economic_data.js` adds `horticultureNationalProduction2025`, 18 mapped game commodities from BPS 2025 national annual production: bawang merah, bawang putih, bayam, cabai rawit, kacang panjang, kangkung, kentang, mentimun, kubis, melon, sawi, semangka, stroberi, terong, tomat, wortel, cabai merah, and jamur tiram.
- Official source: BPS, *Produksi Tanaman Sayuran dan Buah-Buahan Semusim Menurut Jenis Tanaman, 2025*, last updated 2026-05-25: https://www.bps.go.id/id/statistics-table/3/VFV4MmQxaG9kakZrVUdWeEx6aDFUMnN6WmpocVp6MDkjMw%3D%3D/produksi-tanaman-sayuran-dan-buah---buahan-semusim-menurut-jenis-tanaman--2022.html
- Source unit is kuintal (kw/qui); conversion stored explicitly at 100 kg per kuintal. Original quintal and normalized kg values are both retained.
- Game `cabai_merah` is mapped as the sum of BPS `Cabai Besar/TW/Teropong` and `Cabai Keriting`; component rows are retained so the aggregation is auditable.
- National annual production is available for all 18 mapped commodity rows; province-level annual observations are available for Lampung, Sumatera Utara, and Jambi (3/38 provinces). Provinces without a verified row fall back only to the national reference in the coverage display; no national remainder is allocated. None of these annual values is injected into monthly or daily NPC stock.
- Runtime binding is in `applyHorticultureProductionReference()` and `commodityPhysicalCoverage`; registry and usage audit check all 18 records.
- This adds supply references for 18 more catalog items. It does not mean all 60 have complete physical production data; remaining catalog items stay explicitly pending.

- Follow-up: the same BPS 2025 horticulture series is now loaded at province depth for Lampung, Sumatera Utara, and Jambi (3/38 provinces) across the mapped commodity rows. Source tables: Lampung https://lampung.bps.go.id/id/statistics-table/3/VFV4MmQxaG9kakZrVUdWeEx6aDFUMnN6WmpocVp6MDkjMyMxODAw/produksi-tanaman-sayuran-dan-buah-buahan-semusim-menurut-jenis-tanaman-di-provinsi-lampung.html; Sumatera Utara https://sumut.bps.go.id/id/statistics-table/3/VFV4MmQxaG9kakZrVUdWeEx6aDFUMnN6WmpocVp6MDkjMw%3D%3D/produksi-tanaman-sayuran-dan-buah-buahan-semusim-menurut-jenis-tanaman-di-provinsi-sumatera-utara--2020.html; Jambi https://jambi.bps.go.id/id/statistics-table/3/VFV4MmQxaG9kakZrVUdWeEx6aDFUMnN6WmpocVp6MDkjMw%3D%3D/produksi-tanaman-sayuran-dan-buahbuahan-semusim-menurut-jenis-tanaman-di-provinsi-jambi--2021.html.
- Provincial horticulture values remain in source quintals and are converted to kg only in the runtime coverage view. BPS dash values are stored as zero because the table's data legend defines dash as none or zero. Cabai Merah province totals aggregate the two BPS rows Cabai Besar/TW/Teropong and Cabai Keriting.
- Engine priority is province observation first, national annual reference second. Neither is yet injected into daily NPC stock; all 3-province observations remain annual references pending monthly harvest curves.


## BPS plantation production 2024 — partial provincial runtime binding (2026-11-09)

- `js/real_economic_data.js` adds `plantationProduction2024Partial` from the BPS table *Produksi Tanaman Perkebunan Menurut Provinsi dan Jenis Tanaman (Ribu Ton), 2024*, last updated 27 August 2026: https://www.bps.go.id/id/statistics-table/2/MjU2NiMy/produksi-tanaman-perkebunan-menurut-provinsi-dan-jenis-tanaman--ribu-ton-.html
- Seven commodity IDs are mapped to BPS columns: `kelapa_sawit`, `kelapa`, `karet`, `kopi`, `kakao`, `teh`, `tebu`. Seven province rows visible in the retrieved table are ingested: Aceh, Sumatera Utara, Sumatera Barat, Riau, Jambi, Sumatera Selatan, Bengkulu (7/38).
- Original unit is thousand tonnes/year. Runtime conversion is explicit: 1 thousand tonne = 1,000,000 kg. Original source values remain available as `productionThousandTon`; normalized annual kilograms are stored separately as `productionKg`.
- `applyPlantationProductionReference()` binds all 49 province × commodity observations to `state.provinces[provinceId].marketSupplyReference2024.plantation`. `applyCommodityPhysicalCoverage()` consumes these province records when building the 60-commodity coverage snapshot. The registry exposes `bps_plantation_production_2024_partial` (49 observations).
- This is annual supply evidence only. It does not populate daily supply, regional market inventory, NPC order-book stock, or monthly harvest timing. Unobserved provinces remain pending; no national remainder or provincial production is imputed.
- BPS table values of `0.00` are retained as published numeric zero only for rows actually present in the source. No missing province row is converted to zero.
- Test added: `tests/national-economy.test.js` checks source metadata, conversion, seven province coverage, seven commodity mapping, engine state binding, explicit daily-supply nulls, and registry count. Test execution/CI status must be checked separately; adding the test does not establish that it passed.
- Remaining work: obtain and ingest the other 31 province rows and reconcile the current BPS table totals; validate commodity-specific product form (e.g. fresh fruit bunch vs crude palm oil) before connecting annual production to physical market inventory or daily NPC transactions. This stage is not a complete production dataset for all 60 commodities.

- Follow-up verification hook: `runtimeDataUsageAudit().audit.plantationProduction2024Partial` checks that all 49 source observations were actually bound into province state and that the thousand-tonne-to-kg conversion is exact. The new regression test asserts this audit and `allVerifiedDatasetsRuntimeBound`; the test remains unexecuted until a runner result is available.
