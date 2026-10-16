# Unit Economics and Business Model Contract

Status: calculator and focused tests added on `feat/production-tier-taxonomy`. This is a foundation; it is not yet wired into every business UI or transaction path.

## Goal

Every business is described as a reproducible unit-economics scenario, then linked to upstream and downstream businesses. A 2D presentation does not limit simulation depth: production, inventory, cash, costs, prices, and supply-chain events should be modeled as data and deterministic rules.

## Non-negotiable accounting rules

1. A missing price/cost/yield is **unknown**, never zero. The calculator rejects missing required numeric values rather than publishing a fake profit.
2. Keep these evidence classes separate:
   - `official_observation`: observed in a named official dataset, with URL and period.
   - `derived_from_source`: computed from cited observations and a documented formula.
   - `game_parameter`: current balancing/config value, not a real-world observation.
   - `experimental_assumption`: temporary parameter awaiting evidence.
3. Keep geography, date/period, quality, currency, unit, and market stage attached to every price. Producer, collector, wholesale, retail, factory, and direct-sale prices are not interchangeable.
4. For bought inputs, the purchase price is the chain's input cost.
5. For self-produced inputs, show three views:
   - **stand-only cash result** excludes upstream cash costs, useful for seeing the downstream unit's immediate cash economics;
   - **integrated-chain result** includes the upstream production cost once and eliminates internal transfer revenue/expense;
   - **opportunity-adjusted result** values an internally used input at the external-sale alternative, exposing what the business gives up by not selling it.
6. Record startup capital separately from monthly operating cash flow. Depreciation is an accounting expense, not the same as a cash payment in the current month.
7. Calculate profit only when the required cost fields are complete. Evidence can still be assumption-containing; calculation completeness is not proof that data are real.
8. Keep production transformation `productionTier` (1–4) separate from `marketStage`.

## Calculator API

File: `js/unit_economics.js`

- `AgroUnitEconomics.validateScenario(scenario)`
- `AgroUnitEconomics.calculate(scenario)`
- `AgroUnitEconomics.evidenceStatus(evidence)`

Scenario fields include:
- `sellPricePerUnit`, `plannedSalesUnitsPerMonth`, `wasteRate`
- `inputs[]`: `quantityPerOutput`, `sourcingMode`, and either `purchasePricePerUnit` or both `ownProductionCostPerUnit` and `marketOpportunityPricePerUnit`
- `variableCosts[]`: other cost per produced unit, such as packaging, ice, feed, fertilizer, energy, consumables, or per-unit labor
- `fixedCostsMonthly[]`: rent, wages, subscriptions, maintenance, transport contracts, and other monthly fixed costs
- `capex[]`: startup asset amount and useful life for monthly depreciation
- Each numeric cost record should have an `evidence` object with a kind and, for source-backed records, URL + period.

The calculation reports revenue, production volume required after waste, input costs under each sourcing view, other variable costs, fixed costs, depreciation, initial capex cash outflow, operating cash profit, integrated accounting profit, opportunity-adjusted profit, HPP per saleable unit, contribution per unit, and break-even volume.

Run tests:
```sh
node tests/unit_economics.test.js
```

## Canonical benchmark: es kelapa

The existing `js/data.js` already contains a playable es-kelapa business model. Preserve it as the first benchmark and reconcile its figures before declaring it source-validated.

Current values found in the game configuration (all are **game parameters unless independently sourced**):
- Sale price: Rp5,000/glass.
- Existing lesson text: one coconut yields 4 glasses.
- Coconut purchase: Rp3,500 from farmer and Rp5,000 from collector/tengkulak.
- Ice: Rp20,000 per sack / 40 portions = Rp500 per portion.
- Palm sugar: Rp20,000 per block / 50 portions = Rp400 per portion.
- Cups: Rp8,000 per pack / 20 cups = Rp400 per cup.
- The simple sum of those three listed non-coconut consumables is Rp1,300 per glass. Existing lesson text says HPP is approximately Rp1,525 for “ice, sugar, cup”; that Rp225 difference is currently unexplained and must be reconciled, not silently accepted.
- Provisional direct-material arithmetic, before labor, spoilage, water, transport, utilities, permits, and fixed costs: at Rp3,500/coconut and 4 glasses/coconut, coconut input is Rp875/glass, so the subtotal is Rp2,175/glass; at Rp5,000/coconut, the subtotal is Rp2,550/glass. These are **derived from game parameters**, not verified market HPP or net profit.
- Existing code lists labor at Rp500 per fruit, startup packages at Rp160,000 and Rp335,000, a mini-fridge at Rp2,000,000, and different demand/rent assumptions by location. Reconcile their periods and applicability before using them in an official profit comparison.

The benchmark must eventually compare at least:
1. Buy coconuts from farmer + operate a stand.
2. Buy from collector/tengkulak + operate a stand.
3. Own orchard + own stand (include real cultivation cost and harvest labor).
4. Sell harvested coconuts externally without a stand.
5. Mixed strategy: sell some output externally and use the rest in the stand.
6. Home stand versus rented kiosk/market location, using comparable demand, opening days, sales velocity, waste, labor, utilities, rent, equipment depreciation and startup cash.

Do not mark any scenario “real-data validated” until each material cost, price, yield, sales-volume and fixed-cost assumption has traceable evidence or is explicitly left unknown.

## First official coconut-price history added

`js/real_economic_data.js` now stores 46 long-form annual observations for 2002–2024: 23 producer-price points and 23 consumer-price points for unhusked coconut, in Rp/butir, national geography. Source: Pusat Data dan Sistem Informasi Pertanian, Kementerian Pertanian, *Outlook Komoditas Perkebunan Kelapa Tahun 2025*, Lampiran 27; the publication states the price series is based on BPS/Susenas and compiled by Pusdatin. Official PDF: https://satudata.pertanian.go.id/assets/docs/publikasi/OUTLOOK_KELAPA_2025_sign.pdf

The 2024 observations are Rp3,422/butir at producer level and Rp6,061/butir at consumer level. They are historical national annual values, not live prices and not a local price for every region. The existing game parameters (farmer Rp3,500, tengkulak Rp5,000, whole coconut direct sale Rp13,000) remain unchanged and must not be relabeled as these official observations. They represent separate game settings/market contexts.

Test: `node tests/real_economic_data.test.js` checks the 46 rows, source metadata, 2024 values, units and market-stage separation. These observations improve coconut-price calibration; they do not provide stand demand, es-coconut recipe costs, labor, rent, yields or business net profit.

## Extend to every business chain

Build recipes as a directed graph of product inputs/outputs, not as isolated tier multipliers. Examples from the owner's blueprint:
- Coconut -> fresh coconut / coconut milk / coconut oil -> es kelapa, food, soap, VCO, herbal cosmetics.
- Paddy -> rice / rice flour -> cooked rice, porridge, catering.
- Maize and other crops -> food products and animal-feed inputs.
- Feed ingredients -> homemade pellets -> poultry/fish/livestock growth, with formulation, machinery, electricity, labor, wastage, and feed conversion ratio all evidence-tagged.
- Livestock -> live animals / meat / milk / eggs -> processed goods -> retail or food service.

Every recipe needs unit conversions, yield, byproducts, losses, cycle time, labor, equipment/capex, storage, transport, and a source or explicit assumption for each relevant parameter. Tier changes the production/processing class; it must not automatically apply a profit multiplier. The actual margin must emerge from inputs, conversion yield, demand, capacity, prices, and costs.

## Real-data acquisition policy

Use official source series where available: BPS producer-price and production statistics; Bapanas producer/consumer datasets; Bank Indonesia PIHPS market-level food prices; Ministry of Agriculture fertilizer references; SPORA feed price data; SIMPONI Ternak prices; official logistics tariffs and route costs. Keep raw files, source metadata, period, geography, unit, retrieval date, quality flags, rejected rows, duplicate counts, and missing counts.

The existing registry is a small curated snapshot, not thousands of historical observations. Do not describe the game as calibrated from thousands of real records until a reproducible bulk import has actually produced and validated that volume of distinct observations.

## Acceptance criteria for the first complete vertical slice

- A single es-kelapa recipe produces traceable unit HPP and monthly P&L.
- Buy-vs-own sourcing scenarios are comparable and internal transfer sales are eliminated from consolidated accounts.
- Startup capex, depreciation, working capital, cashflow and operating profit are separate.
- Unknown required values block a complete profit result.
- Every cost/price has evidence class, source, period, geography and unit as applicable.
- Tests cover unit conversion, waste, zero sales, fixed costs, depreciation, break-even, own-vs-buy and missing-data behavior.
- No backend/Supabase work until the local frontend and simulation engine are accepted.
