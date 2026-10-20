# Kementan Statistik Pertanian 2025 — Production/Yield Source Register

Date: 2026-10-20
Branch: `feat/production-tier-taxonomy`
Official source: https://satudata.pertanian.go.id/assets/docs/publikasi/7ac141132b916c67eeac812c81d140e3.pdf

## Source verified

The official Ministry of Agriculture publication *Statistik Pertanian / Agricultural Statistics 2025* was located and its searchable source text was checked. The foreword states that the book provides five-year series across upstream agribusiness inputs, farming (production and population), downstream agribusiness, trade, prices and consumption. It compiles information from directorates within the Ministry, BPS, investment, meteorology and land agencies. This is a suitable bulk source family for production/population and sector context, but every specific series still needs table-level extraction and unit reconciliation.

## Evidence use policy

- Production volume is not farm yield unless the corresponding harvested area or population denominator matches.
- Production totals do not establish unit production cost, farm-gate revenue, or net profit.
- Keep commodity form and stage distinct: fresh crop vs dry/processed product; liveweight vs carcass; TBS vs processed palm oil; wet latex vs thick rubber; green coffee bean vs cherry.
- Preserve year, geography, source table, unit, denominator and revision notes for every extracted value.
- Do not infer missing rows from national totals, neighboring provinces, or another commodity.
- Do not promote any observation to game runtime without a matched production cycle, yield, saleable output, input costs, labor, losses, overhead/fixed costs and comparable farm-gate price.

## Next bulk extraction batch

Extract the five-year series and table metadata for all relevant owner rows in one pass: food crops, horticulture, plantation crops, livestock, aquaculture/capture fisheries, and then separate mining/energy/manufacturing source families. Cross-link extracted rows to `docs/COMMODITY_60_BULK_AUDIT.md` and `docs/COMMODITY_60_BULK_DATA_REGISTER.md`.

## Current coverage statement

This register documents source discovery and scope, not completed numeric extraction. It does not increase the count of exact observations. Current accepted checkpoint remains: 60/60 owner rows in the audit matrix; 27 owner rows with category-level historical producer-price series in the Kementan price crosswalk; 0/60 complete validated economic models; 0/60 runtime approvals. No runtime or canonical commodity ID changes are authorized by this source register.
