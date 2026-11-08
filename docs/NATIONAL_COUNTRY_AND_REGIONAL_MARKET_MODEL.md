# National Country & Regional Market Model — Agrotycoon

Version: 1.0.0  
Implementation checkpoint: 2026-11-08  
Country in game: **Republik Arunika**  
Reference geography: 38 Indonesian province names and official administrative-unit counts  
Game population: **200,000,000 statistical residents**  
Runtime objective: 1,000–5,000 representative active NPC agents

## 1. Purpose and non-negotiable model rules

Republik Arunika is a new in-game country. It reuses the names of Indonesia's 38 provinces as the initial geographic reference, but its total population is a game scenario of 200 million. It is not a claim that Indonesia currently has 200 million residents.

The economy must be regional before it is national. A flood in Lampung reduces exposed Lampung production/logistics; it does not directly apply a price increase to Jakarta or every other province. National prices are population-weighted summaries of regional prices. Government action must be represented as inventory and fiscal flows: procurement removes goods from market inventory and adds them to public reserves; reserve release adds goods back to the affected market; imports add external supply and consume treasury.

**Scale rule:** do not instantiate 200 million consumer objects. Residents are represented by population cohorts and demand aggregates. A small, capped active-agent sample represents market decision-making.

## 2. Population and administrative geography

### 2.1 Population distribution

The runtime country population is fixed at 200,000,000 for this scenario. The 38 province population shares are derived from BPS 2025 provincial population projections and scaled proportionally to the game total using the largest-remainder method. This preserves the relative distribution while making the total exactly 200 million.

The BPS 2025 reference values (thousand residents) are:

| Province | BPS reference population (thousand) |
|---|---:|
| Aceh | 5,626.0 |
| Sumatera Utara | 15,785.8 |
| Sumatera Barat | 5,914.3 |
| Riau | 6,811.2 |
| Jambi | 3,768.5 |
| Sumatera Selatan | 8,928.5 |
| Bengkulu | 2,138.0 |
| Lampung | 9,522.9 |
| Kepulauan Bangka Belitung | 1,550.8 |
| Kepulauan Riau | 2,213.5 |
| DKI Jakarta | 10,678.0 |
| Jawa Barat | 50,759.0 |
| Jawa Tengah | 38,233.9 |
| DI Yogyakarta | 3,781.5 |
| Jawa Timur | 42,089.3 |
| Banten | 12,537.4 |
| Bali | 4,461.3 |
| Nusa Tenggara Barat | 5,731.1 |
| Nusa Tenggara Timur | 5,742.6 |
| Kalimantan Barat | 5,766.0 |
| Kalimantan Tengah | 2,845.0 |
| Kalimantan Selatan | 4,323.3 |
| Kalimantan Timur | 4,267.6 |
| Kalimantan Utara | 749.4 |
| Sulawesi Utara | 2,721.4 |
| Sulawesi Tengah | 3,156.1 |
| Sulawesi Selatan | 9,563.1 |
| Sulawesi Tenggara | 2,836.7 |
| Gorontalo | 1,242.2 |
| Sulawesi Barat | 1,525.3 |
| Maluku | 1,970.6 |
| Maluku Utara | 1,373.8 |
| Papua Barat | 587.6 |
| Papua Barat Daya | 636.4 |
| Papua | 1,073.6 |
| Papua Selatan | 549.7 |
| Papua Tengah | 1,492.3 |
| Papua Pegunungan | 1,484.9 |

Source: BPS, *Provinsi Jawa Tengah Dalam Angka 2025*, chart “Jumlah Penduduk Menurut Provinsi di Indonesia (ribu), 2025”, sourced to BPS population projection 2020–2050. The population figures are reference weights only; the game totals 200 million after scaling.

### 2.2 Administrative hierarchy

Runtime hierarchy supports:
- Negara
- Provinsi
- Kabupaten
- Kota
- Kecamatan
- Desa
- Kelurahan

Current verified national reference totals:
- 416 kabupaten and 98 kota (514 combined), 2024.
- 7,281 kecamatan, 2024.
- 84,291 desa/kelurahan-level units, 2025.

The 2025 BPS table provides desa/kelurahan counts by province; those 38 values are stored in `PROVINCES`. The 2024 BPS table provides kecamatan counts by province; those 38 values are also stored in `PROVINCES`.

The national regency/city total is verified, but per-province regency and city counts are currently allocated by provincial population share. The 2024 Podes mix (75,753 desa; 8,486 kelurahan; 37 UPT/SPT out of 84,276 units) is used to derive a provisional desa/kelurahan split for the 2025 combined count. These per-province splits are **derived estimates, not official province-level counts**.

### 2.3 Locality-level population and demand

`getLocalityAggregate(provinceId, level, index)` provides aggregate demand and population for a locality slot at regency, city, district, desa, or kelurahan level. The first implementation distributes provincial population and demand evenly across the relevant count. This is a computationally cheap average, not a claim that every village has equal population.

Until the official master region dataset is imported, locality names are explicit synthetic placeholders such as “Desa simulasi 00001”. They are not real village/city names or official administrative codes. The code records `masterNameStatus: synthetic_placeholder_requires_official_master_data`.

**Required follow-up data gate:** import the full official Kemendagri/BPS region master with stable province, regency, city, district, village and kelurahan codes and names. Then replace synthetic locality IDs and equal-split estimates with actual population and household/consumption observations. Do not label this first implementation as a complete named village database.

## 3. Background population and active NPC architecture

- Statistical population: 200,000,000 residents.
- No individual objects are created for ordinary residents.
- Active representative agent target: `ceil(sqrt(population) × 0.08)`, bounded by 1,000 and 5,000. For 200 million this produces approximately **1,132 active agents**.
- Agent roles include farmer, livestock operator, fisher, processor, wholesaler, retailer, logistics operator, institutional buyer and government officer.
- Each active agent has a province, role, behavior profile and representative population weight. The representative weight is not extra population and must not be added to the 200 million resident count.
- The active-agent cap is independent of the total statistical population. Increasing population does not create millions of JavaScript objects.

This is an agent-based/aggregate hybrid: statistical cohorts provide scale; a small number of active agents provide behavioral decisions.

## 4. Commodity demand and Tier 1–4

The national economy iterates the existing 60-item `COMMODITIES` catalog. Each commodity receives a province-level monthly demand index, stock, production, reserve, import and regional price index. This includes the existing Tier 1–4 commodity catalog and leaves the established transformation routes in `commodity_transformation.js` / `commodities.js` authoritative for physical processing.

Current category weights are **game-balance assumptions**, not official per-capita consumption rates:

| Category | Demand weight per 1,000 residents (index units) |
|---|---:|
| Pangan | 1.00 |
| Hortikultura | 0.32 |
| Perkebunan | 0.12 |
| Buah | 0.22 |
| Rempah | 0.06 |
| Peternakan | 0.28 |
| Perikanan | 0.18 |
| Industri | 0.14 |

Per-commodity demand index = (province population / 1,000) × category weight. This is an **index unit**, not kilogram, ton, liter, head, or package. It is sufficient for initial demand/stock/price behavior but is not yet a physical national food balance. Physical monthly requirements must be populated separately from compatible BPS Susenas, Bapanas, Kementan, feed-industry and institutional-consumption series. Unknown physical rates must remain “butuh riset lanjutan”.

Tier 1–4 processing, yield, HPP, inventory valuation and sale accounting remain governed by existing production/processing code. The national model must not bypass the validated HPP and ledger functions.

## 5. Regional stock-flow and price formation

For each province and catalog commodity, the daily index model uses:

- Daily demand = monthly demand index / 30.
- Daily production = baseline monthly demand index / 30 × province supply factor × (1 − active production loss).
- Closing inventory = max(0, opening inventory + production − demand).
- Stock cover days = closing inventory / daily demand.
- Regional price index = clamp((15 / max(0.25, stock-cover-days))^(0.45 + 0.6 × commodity elasticity) + logistics disruption × 0.9, 0.55, 4.00).
- Regional quote = national market quote × regional price index.

The regional price index can move above the normal national market band in an emergency, up to the explicit regional cap of 4.00×. A local shortage therefore does not require the national price to rise equally. Unaffected provinces retain their own stock and price state.

Province production factors are provisional game parameters. They must be replaced by commodity-specific BPS/Kementan production, harvested-area and yield observations when comparable regional series are ingested. The current factors are not official production shares.

## 6. Government reserve, procurement and imports

The initial public reserve is a scenario opening stock equal to 25% of one month's regional demand index. Government policy parameters are:

| Policy | Current setting | Meaning |
|---|---:|---|
| Procurement share | 5% | Maximum monthly demand share purchased per province/commodity when reserve is below target |
| Reserve target | 30 days | Desired public reserve coverage |
| Release trigger | 10 days | Trigger when local stock cover falls below this and price index exceeds 1.15 |
| Release share | 15% | Maximum monthly demand index released per province/commodity on a triggered day |
| Import cap | 10% | Maximum monthly demand share imported for a commodity when a deficit remains |
| Opening treasury | Rp1,000,000,000,000 | Experimental starting government cash balance |

Procurement is a market purchase: it debits government treasury, reduces market inventory and increases public reserve. Reserve release reduces public reserve and increases local market inventory. Imports debit treasury and increase supply in the provinces with the largest remaining deficits. The import cap is a scenario limit, not a real-world import quota.

The government does not buy every month regardless of need: procurement is conditional on reserve stock being below the target and sufficient treasury being available. This prevents arbitrary purchases when the reserve is already full.

Fiscal revenue, budget appropriations, debt issuance, procurement contracts, storage losses, quality grades, port capacity and national reserve accounting by physical tonnes are not yet complete. **Butuh riset lanjutan** for the physical and legal policy layer.

The architecture follows the real-world concept of government food reserves and SPHP price stabilization. Bapanas describes CBP/SPHP as instruments for maintaining availability and affordable prices under Government Regulation No. 125/2022 and Bapanas Regulation No. 15/2022. The game policy percentages above remain experimental and are not copied from those regulations.

## 7. Disaster and logistics events

The engine can apply an explicit event through `AgroNationalEconomy.applyDisaster({provinceId, commodityIds, productionLossFraction, logisticsLossFraction, durationDays, type})`.

A deterministic seeded monthly event roll is enabled at 0.6% per province per 30-day game month. Event templates include flood, drought and logistics disruption. Duration is 15–60 game days; production-loss and logistics-loss ranges are experimental game parameters. Events are labeled `SIMULATION` and `EXPERIMENTAL`; they are never presented as actual current news.

Example: a Lampung flood affects Lampung's exposed paddy/jagung/chili production and logistics. Lampung's inventory coverage falls; its regional price index rises. The government can release Lampung reserve stock, move stock through interregional logistics in later iterations, or import if the domestic reserve cannot cover the deficit. Jakarta's price is not directly overwritten by the Lampung event.

A fully calibrated disaster model still requires BNPB event history, hazard exposure, BMKG climate data, crop stage, storage exposure, and transport network evidence. Do not treat the current 0.6% probability or damage fractions as measured disaster frequencies.

## 8. Runtime integration and performance

Runtime module: `js/national_economy.js`  
Main game integration: `index.html`, `js/day.js`, `js/state.js`, `js/land.js`, `js/economy.js`  
Dashboard: `dunia-simulasi.html`  
Regression: `tests/national-economy.test.js`

The state stores 38 province aggregates × 60 commodities, plus approximately 1,132 active agents. It does not store 200 million residents or materialize all 84,291 locality records. Locality aggregates are calculated on demand. Player region defaults to DKI Jakarta and can be changed from the Dunia Simulasi dashboard. Commodity and coconut producer quotes use the player's selected province quote; the owner-verified direct whole-coconut retail price remains outside this regional producer-market adjustment.

## 9. Research and implementation backlog

1. Import official named/code master data for all 514 regencies/cities, 7,281 districts and 84,291 village/kelurahan units. Resolve current administrative-code vintage and boundary changes.
2. Replace population-proportional regency/city allocation and equal locality population split with official per-unit population data.
3. Add physical household consumption by commodity and province; distinguish rice from paddy/gabah, food from feed maize, fresh/live animal from processed meat, and household from industrial demand.
4. Add provincial commodity production, harvested area, productivity, storage and seasonal supply for all Tier 1–4 commodities.
5. Add actual province-to-province freight capacity, costs, distances, ports, route closures and shipment lead times.
6. Add government fiscal revenue, budget, procurement contracts, warehouse capacity, reserve quality/age, storage losses, release pricing and transparent public accounts.
7. Add official disaster/hazard exposure and calibrated damage/recovery distributions.
8. Add tests for multi-province trade, price convergence, import budget exhaustion, reserve depletion/replenishment, save migration, and large-scale mobile performance.

## 10. Source register

- BPS, *Provinsi Jawa Tengah Dalam Angka 2025*, national provincial population chart (2025 projection), source BPS Population Projection 2020–2050.
- BPS, “Jumlah Desa/Kelurahan Menurut Provinsi, 2025”, updated 10 February 2026; source BPS Decree No. 750/2025.
- BPS, “Jumlah Kecamatan Menurut Provinsi, 2024”, based on BPS Decree No. 646/2024.
- BPS, *Statistik Indonesia 2025*, Tables 2.1.1–2.1.4, administrative areas; Ministry of Home Affairs source for regency/city counts.
- BPS, Podes 2024 executive summary: 84,276 village-level administrative units consisting of 75,753 desa, 8,486 kelurahan and 37 UPT/SPT; 7,281 districts and 514 regencies/cities.
- Bapanas, “Volume Penyaluran Cadangan Pangan Pemerintah untuk Stabilisasi Pasokan dan Harga Beras September 2026”, description of CBP/SPHP and cited regulatory basis: https://data.badanpangan.go.id/datasetpublications/mce/sphp-beras-tingkat-konsumen-agustus-2026

The in-game country and demand weights are simulation constructs. Official reference dates remain in documentation/source metadata and are not required to be shown to players.
