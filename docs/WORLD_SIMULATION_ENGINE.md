# Agrotycoon Historical Data + World Simulation Engine
Version: 0.1.0
Status: architecture contract; no live news feed is part of the simulation loop.

## Core rule
Real observations calibrate the world. The game then advances in-game time using reproducible simulation rules. Never display a simulated event as a real-world news report. Never fabricate a historical observation to fill gaps.

## Data layers
1. Raw observations (immutable): source, source URL, dataset title, source row/key, observed date or period, geography/code, commodity/indicator, market level, unit, value, retrieval date, license/usage notes, quality status.
2. Normalized observations: canonical commodity IDs, canonical region IDs, normalized units, frequency, missingness flags, revision lineage. Keep original value and normalized value.
3. Calibration parameters: distributions and ranges estimated from observed data; parameter must point to supporting observation IDs and method/version. Parameters with no evidence must be marked EXPERIMENTAL and exposed as assumptions.
4. Scenario library: event templates (flood, drought, pest, road closure, fertilizer shortage, demand shock, policy change, seasonal harvest, holiday demand). Each template declares triggers, geography/exposure, affected crops/assets, timing/duration, direct effects, secondary effects, recovery curve, uncertainty range, evidence links, and validation status.
5. Simulation state: region x commodity inventories, production stage, expected harvest, demand, logistics capacity, spoilage, market prices, cash/credit, contracts, and event states.
6. Player-facing event log: generated only from simulation state changes. Include in-game date, affected regions/commodities, observable impact, confidence/rationale, and actions available to player.

## Event and price causality
- An event affects only exposed production/assets and only during relevant growth/storage/transport stages.
- Compute harvest loss as exposed production × stage-specific damage fraction; both exposure and damage fraction need data-calibrated distributions or clearly labeled experimental assumptions.
- Regional available supply = opening inventory + production + inbound shipments - consumption - outbound shipments - spoilage - event losses.
- Price movement responds to supply-demand balance, inventories, substitution, market integration, transport costs, and policy intervention. Use historical price elasticity/volatility where estimable; otherwise bounded experimental parameters.
- Do not encode "flood => maize price rises" as a universal rule. Price rises only if modeled supply/demand conditions justify it.
- Preserve unaffected commodities where causal links are absent. Coconut stock already harvested is not automatically lost when paddy fields flood; storage or logistics can still be affected if the event exposes them.
- Trade recommendation must subtract transport, loading, handling, permits/taxes if applicable, spoilage, financing, route disruption, and time cost when available. Unknown cost must be shown as unknown, never silently set to zero in final profit claims.

## Time and reproducibility
- The game clock chooses event occurrences from calibrated historical frequencies / seasonal windows, not current news scraping.
- Store world seed, engine version, scenario version, parameter-set version, and event draws so a game can replay the same run.
- Avoid duplicating historical disasters as if every run must repeat them. Historical events are evidence for frequency/severity distributions and may optionally be replayed in a clearly labeled historical scenario mode.
- Keep a scenario calendar by in-game year and region; prevent impossible overlapping effects and cap impacts to physical bounds.

## Historical data targets
First pass should prioritize:
- Food prices by commodity, region, market level, and date: Bapanas, PIHPS/Bank Indonesia, BPS.
- Crop production/harvest area/productivity: BPS and Ministry of Agriculture.
- Disasters: BNPB DIBI and official disaster records; hazard/exposure from BMKG/related official sources.
- Rainfall and climate indicators: BMKG and public climate datasets with provenance.
- Roads, ports, route distances, and freight rates: official transportation/toll data and verified operator tariffs.
- Input prices: official fertilizer prices/HET and relevant observed input prices.
Each import batch includes raw file, importer version, source metadata, validation report, rejected rows, and checksum. Count distinct usable observations and coverage; don't advertise a row target unless it is met.

## Validation and acceptance criteria
- All observations trace to source and period; no synthetic values in raw tables.
- Missing values remain null unless an imputation method is explicitly applied and tagged.
- Historical price calibration is evaluated on held-out time windows; report MAE/RMSE or distribution coverage where meaningful.
- Scenario effects are tested against documented historical episodes where data allows; separate calibration from validation.
- Unit tests cover stock conservation, event exposure, no negative inventory, price bounds, shipment timing, and deterministic replay.
- UI labels factual observations, model outputs, and assumptions distinctly.
- Never call a data feed real-time unless automatic retrieval and freshness checks actually pass.

## First playable vertical slice
1. One region-to-region route and 3-5 commodities with sourced price series.
2. One event family (flood) with exposure and crop-stage effects.
3. Inventory / production / logistics update per game day.
4. Market prices derived from supply-demand state.
5. Generated in-game bulletin with causal explanation and player trade choices.
6. A scenario audit view that shows which data and parameters caused each effect.
Expand to provinces, commodities, and more event families only after tests pass.


## Map prototype assessment — `peta.html` / `js/map_engine.js` (2026-10-24)

### Decision
Reuse the prototype's **visual interaction concept** (tile grid, click-to-inspect land, drag-to-pan, wheel zoom, road/market/truck presentation) as a reference for a future integrated map. Do **not** treat the current implementation as production-ready or connect it to player economy without refactoring and regression tests. Keep it isolated from runtime state until the integration contract is implemented.

### Existing behavior verified from source
- `peta.html` loads `js/map_engine.js` as a standalone page. It does not load the main game's state/economy modules.
- Map engine creates private in-memory state (`gold=5,000,000`, local `tiles`, `payloadStock`, `vehicles`) and does not persist it into the main `S` save object or the main ledger.
- Prototype starts with 16×16 tiles, one-tile-per-hectare display, fixed road and market, a 10-tree coconut plot, house and shop; land purchase is hard-coded at Rp2,000,000 per tile and central market at Rp50,000,000.
- Truck revenue is hard-coded as payload × Rp3,500. This is a fixed sale-stage assumption, not linked to current commodity/grade/market or cost basis.

### Blocking defects before reuse
1. **Duplicate cash systems:** map HUD balance is disconnected from the main game's `S.gold`; purchases and revenue cannot be reconciled in `S.ledger` or monthly accounting.
2. **NPC revenue bug:** `onArrive` credits player gold for both player truck (`toMarket`) and NPC truck (`npcToPasar`). NPC trade should not directly increase player cash unless an explicit player-owned transaction occurs.
3. **Repeat-harvest exploit:** `harvest()` adds `trees × 20` to `payloadStock` without tree-cycle/cooldown checks, labor expense, or inventory validation; repeated clicks create stock.
4. **Duplicate shipment exploit:** repeated `sendTruck()` calls can dispatch the same payload before the first truck arrives; each truck can then credit the same stock value.
5. **No authoritative stock/production model:** harvest yield is fixed per click and not debited from main inventory; it bypasses `DATA.yieldBiasa`, `S.trees`, `S.stock`, harvest-day rules, and the labor cost contract.
6. **No persistence or migration:** camera, owned tiles, buildings, vehicles and market are reset on reload; there is no save-schema migration or recovery test.
7. **Land/market economics are disconnected:** tile purchase, market construction, road access, and land ownership are not tied to `S.landSystem`, `LAND_TIERS`, transaction costs, or finance/credit.
8. **Interaction/scale limitations:** zoom changes around the canvas origin rather than the pointer; pan is unbounded; expanding W/H does not build a coherent new road/network; pathfinding is a fixed route template rather than graph/pathfinding with congestion or travel costs.
9. **No map regression tests:** current tests cover the main game and browser smoke path, but there is no dedicated map engine test or integration test in the inspected test inventory.

### Safe integration plan
- Phase A: retain this as a prototype/reference only; do not advertise map trades as real game transactions.
- Phase B: define a single adapter contract to the main state: authoritative cash `S.gold`, land/plot IDs, ownership, inventory, production cycle, transaction ledger, and save/migration rules. Map must call domain functions rather than mutate money/stock directly.
- Phase C: implement tile ownership and building actions as validated commands with cost, adjacency, unlock, capacity and rollback checks; separate player and NPC accounts; shipments reserve stock on dispatch and settle exactly once on delivery.
- Phase D: add tests for pan/zoom/click selection, land-purchase bounds, save/load, harvest cooldown/labor, stock reservation, one-time delivery, NPC non-player accounting, and market-construction affordability; then run existing browser smoke/E2E suite.
- Preserve the current educational target: map should teach land opportunity cost, production capacity, transport cost/time, market access and margin after logistics—not only provide a decorative canvas.
