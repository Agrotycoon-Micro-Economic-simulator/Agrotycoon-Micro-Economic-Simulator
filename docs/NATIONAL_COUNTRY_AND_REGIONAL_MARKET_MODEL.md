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

The runtime country population is fixed at 200,000,000 for this scenario. The 38 province population shares are derived from BPS 2025 provincial population projections and scaled proportionally to the game total using the largest-remainder method. The 38 BPS reference values sum to 284,438,600 residents; the scale factor is 0.7031394473. This preserves the relative distribution while making the total exactly 200 million.

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

### 2.2 Administrative hierarchy and named locality master

Runtime hierarchy supports:
- Negara
- Provinsi
- Kabupaten
- Kota
- Kecamatan
- Desa
- Kelurahan

The game includes a separately versioned administrative identity master copied into `data/administrative_regions/` from the MIT-licensed `prodhokter/dataset-wilayah-indonesia` normalized dataset, derived from Kepmendagri No. 300.2.2-2138 Tahun 2025. The upstream attribution and both MIT license notices are stored alongside the CSV files.

| Administrative level | Master rows |
|---|---:|
| Provinsi | 38 |
| Kabupaten | 416 |
| Kota | 98 |
| Kecamatan | 7,285 |
| Desa | 75,252 |
| Kelurahan | 8,496 |
| UPT/SPT administrative locality records | 14 |
| Total desa/kelurahan/UPT-SPT locality records | 83,762 |

CSV parent keys are validated when loaded: regency → province, district → regency, village/kelurahan → district. The last four digits of locality codes distinguish desa, kelurahan and UPT/SPT under the source convention. The loader rejects a count or parent-link mismatch.

A separate BPS/Podes statistical reference is retained and must not be merged with the administrative master:
- BPS/Podes reference: 7,281 kecamatan (2024) and 84,291 desa/kelurahan-level units (2025).
- Podes 2024 composition: 75,753 desa, 8,486 kelurahan and 37 UPT/SPT in 84,276 locality records.
- The 2025 Kemendagri-derived master has 7,285 kecamatan and 83,762 locality records. Differences are preserved as source/vintage/definition differences, not silently reconciled.

Per-province Kemendagri-derived counts are stored in `PROVINCES`. The former population-proportional allocation of regencies/cities and Podes-ratio split is no longer used for administrative identities.

### 2.3 Locality-level population and demand

`loadAdministrativeMaster()` loads the four CSVs only when the locality explorer is used. `searchLocalities(provinceId, level, query, limit)` searches actual names/codes. `getLocalityAggregateAsync(provinceId, level, index)` returns the actual administrative code and name plus its population/demand estimate. The main game does not load or instantiate all 83,762 locality records during normal play.

**Important limitation:** the administrative master supplies names, codes and parent relationships, not a verified population count for every locality. The current engine distributes provincial population and demand evenly across the relevant locality count to provide a working estimate. This is not an observed village population. Each result labels this as `equal_share_estimate_pending_official_locality_population`. Do not present it as actual village-level population.

A separate public dataset documents Dukcapil Semester I 2024 population/household/density/area fields but lists 83,529 village/kelurahan units and 7,282 districts, which do not match the 83,762/7,285 administrative master. It is not yet merged. Prodeskel's public village-population page also reports fewer completed locality records than the full master. Coverage, definitions, code crosswalks and missing units must be reconciled before using either as a complete population table.

**Next data gate:** import a validated locality-level population/household dataset with a code crosswalk and explicit missing-data handling. Until then, use the current equal-share estimate and label it clearly. Physical household and institutional consumption rates remain a separate research requirement.
## 3. Background population and active NPC architecture

- Statistical population: 200,000,000 residents.
- No individual objects are created for ordinary residents.
- Active representative agent target: `ceil(sqrt(population) × 0.08)`, bounded by 1,000 and 5,000. For 200 million this produces approximately **1,132 active agents**.
- Agent roles include farmer, livestock operator, fisher, processor, wholesaler, retailer, logistics operator, institutional buyer and government officer.
- Each active agent has a province, role, behavior profile, risk/price sensitivity, representative population weight and daily decision state. The representative weight is not extra population and must not be added to the 200 million resident count.
- Each game day, agents evaluate local price signals. Producers/processors adjust supply intent; wholesalers/retailers/institutional buyers adjust demand or inventory intent; logistics agents prioritize rerouting when local price pressure is high; government agents flag reserve review. These are deterministic, low-cost heuristics, not LLM calls.
- Aggregated agent decisions adjust province-level supply/demand response and logistics-disruption mitigation. The runtime processes about 1,132 agent records, not millions of consumer objects. Increasing population does not create millions of JavaScript objects.
- Active agents do not yet own individual cash accounts, physical inventories or contracts; their behavior is a lightweight representative decision layer. Full business balance sheets remain in the player/NPC aggregate accounting layer.

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

### 4.1 Monthly seasonality from Bapanas 2025 coefficients

The game starts from an average monthly demand index. The official Bapanas *Petunjuk Teknis Tata Cara Penyusunan Proyeksi Neraca Pangan Tahun 2025*, Table 2.5, supplies monthly coefficients that account for month length and HBKN uplift. The source defines monthly requirement as:

\[
D_m = \left(\frac{\beta_m}{\beta_{mt}}\right) D_y
\]

where \(D_m\) is monthly requirement, \(\beta_m\) is the commodity-specific monthly coefficient, \(\beta_{mt}\) is the annual coefficient, and \(D_y\) is annual requirement. In the runtime, the pre-existing average monthly demand index is multiplied by \(12\beta_m\), then divided by 30 game days. The 12-month game calendar is a 30-day-per-month seasonal template, not the Gregorian 2025 calendar.

All 12 coefficient columns from Table 2.5 are retained in `BAPANAS_MONTHLY_DEMAND_2025` in `js/national_economy.js`. Seven compatible game mappings are active in `records`:
- `padi`: rice demand as a downstream index signal only; no rice-to-gabah physical conversion is asserted.
- `jagung`, `kedelai`, `cabai_merah`, `cabai_rawit`, `bawang_merah`, and `bawang_putih`: mapped to the corresponding existing game commodity IDs.

The source's four-decimal coefficients are retained verbatim and are **not normalized to sum to one**. The HBKN component intentionally adds seasonal demand above the normal day-count allocation; e.g. the padi coefficient sum is 1.0041. The Juknis explicitly excludes HBKN uplift for corn and soybean; their values follow the month-length distribution and sum to 0.9998 after source rounding.

The same seasonal factor is used in daily demand, stock-cover/price formation, reserve procurement, reserve-release quantities, and import caps/deficit allocation. This keeps government policy denominators aligned with the current month's demand. The seasonality modifies the demand index; it does not convert physical units or overwrite the separate Bapanas per-capita consumption anchors.

The source also defines total annual food need as household consumption plus non-household consumption. Non-household use includes seed, animal-feed industry, food/non-food industry, and Horeka (hotel, restaurant, canteen). If non-household data are unavailable, the Juknis permits use of the BPS 2017 staple-food survey/study, a study-based agreed estimate, or interagency coordination. The game has not yet numerically ingested these non-household series; therefore total demand remains pending reconciliation. Do not set non-household demand to zero or treat household consumption as the complete national requirement.

Primary source: [Bapanas Juknis Proyeksi Neraca Pangan 2025](https://data.badanpangan.go.id/nfs_storage/public/publication/documents/1776218737.pdf), Table 2.5 and methodology section. The PDF cover cites Kepka Bapanas No. 27/2025 while its attachment heading cites No. 22/2025; this source-internal discrepancy is retained in runtime metadata.

The remaining five source columns (beef, chicken meat, eggs, sugar, cooking oil) are retained in `unmappedRecords` with `research_only_*` mapping statuses. They do not execute in daily demand because the current catalog has livestock head-count stages or lacks matching processed-food product stages. Extend only after matching physical stage and unit. **Butuh riset lanjutan** for those mappings and for the 2025 BPS non-household numeric tables. Latest verification: GitHub Actions run [42556163711](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/42556163711) passed 55/55 Node tests plus the full benchmark, standalone, browser smoke and E2E sequence on runtime/test commit `44c11a8b67bca9d234e21a35feb153c9da287efd` / `d55ce29cdf62a5cd691599571acd91b50cd9c0e7`.

## 5. Regional stock-flow and price formation

For each province and catalog commodity, the daily index model uses:

- Daily demand = (monthly demand index × `seasonalDemandFactor(commodityId, gameDay)` / 30) × representative buyer response × household-consumption pressure × price-response adjustment. Unmapped commodities use factor 1.0.
- Daily production = baseline monthly demand index / 30 × province supply factor × (1 − active production loss).
- Closing inventory = max(0, opening inventory + production − seasonally adjusted daily demand).
- Stock cover days = closing inventory / seasonally adjusted daily demand. Reserve procurement targets, release sizing, monthly import caps and deficit allocation use the same current-month seasonal factor.
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

The first version does not yet route physical interprovincial shipments from surplus provinces to deficit provinces. Local reserve release and capped imports work; logistics agents currently affect local disruption mitigation and record reroute intent, not a full freight network. The opening treasury is not yet replenished by a modeled tax/revenue system, so it can eventually be exhausted.

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
Administrative master: `data/administrative_regions/kemendagri_2025_*.csv`  
Dashboard: `dunia-simulasi.html`  
Regression: `tests/national-economy.test.js`

The state stores 38 province aggregates × 60 commodities, plus approximately 1,132 active agents. It does not store 200 million residents or persist 83,762 locality objects. The four administrative CSVs total approximately 2.4 MB and are fetched/parsed only when the user searches the locality explorer; the main gameplay tick does not load them. Search results and one selected locality are materialized on demand.

The dashboard supports country, province, regency, city, district, desa and kelurahan views, including search by locality name/code. Player region defaults to DKI Jakarta and can be changed from the same dashboard. Commodity and coconut producer quotes use the player's selected province quote; the owner-verified direct whole-coconut retail price remains outside this regional producer-market adjustment.

## 9. Research and implementation backlog

1. Reconcile and import actual population, household, density and area by locality from Dukcapil/DKB/prodeskel or another authoritative source. Preserve unmatched codes and missing observations; do not impute them silently.
2. Replace equal-share population estimates with actual locality population and household data; then derive household demand by household size, age structure, income/poverty and urban/rural profile.
3. Add physical household consumption by commodity and province; distinguish rice from paddy/gabah, food from feed maize, fresh/live animal from processed meat, and household from industrial demand.
4. Add provincial commodity production, harvested area, productivity, storage and seasonal supply for all Tier 1–4 commodities.
5. Add actual province-to-province freight capacity, costs, distances, ports, route closures and shipment lead times, then transfer surplus inventory between provinces before importing.
6. Add government tax revenue, fiscal budget, procurement contracts, warehouse capacity, reserve quality/age, storage losses, release pricing and transparent public accounts.
7. Add official disaster/hazard exposure and calibrated damage/recovery distributions.
8. Add tests for full master-data parent links, population reconciliation, multi-province trade, price convergence, import budget exhaustion, reserve depletion/replenishment, save migration, and large-scale mobile performance.

## 10. Source register

- BPS, *Provinsi Jawa Tengah Dalam Angka 2025*, national provincial population chart (2025 projection), source BPS Population Projection 2020–2050.
- BPS, “Jumlah Desa/Kelurahan Menurut Provinsi, 2025”, updated 10 February 2026; source BPS Decree No. 750/2025.
- BPS, “Jumlah Kecamatan Menurut Provinsi, 2024”, based on BPS Decree No. 646/2024.
- BPS, *Statistik Indonesia 2025*, Tables 2.1.1–2.1.4, administrative areas; Ministry of Home Affairs source for regency/city counts.
- BPS, Podes 2024 executive summary: 84,276 village-level administrative units consisting of 75,753 desa, 8,486 kelurahan and 37 UPT/SPT; 7,281 districts and 514 regencies/cities.
- Administrative code/name master: `prodhokter/dataset-wilayah-indonesia`, MIT licensed, normalized from `cahyadsn/wilayah`, derived from Kepmendagri No. 300.2.2-2138 Tahun 2025. Source and license files are in `data/administrative_regions/README.md`.
- Candidate locality population source (not yet ingested): `dhanyyudi/wilayah-id`, which documents Dukcapil Semester I 2024 population/household/density/area data but lists 83,529 villages/kelurahan and 7,282 districts; this coverage mismatch must be reconciled first.
- Bapanas, “Volume Penyaluran Cadangan Pangan Pemerintah untuk Stabilisasi Pasokan dan Harga Beras September 2026”, description of CBP/SPHP and cited regulatory basis: https://data.badanpangan.go.id/datasetpublications/mce/sphp-beras-tingkat-konsumen-agustus-2026

The in-game country and demand weights are simulation constructs. Official reference dates remain in documentation/source metadata and are not required to be shown to players.

## 11. Bapanas provincial consumption runtime layer (2026-11-09)

The provincial Bapanas 2025 source is available at https://data.badanpangan.go.id/datasetpublications/x1y/konsumsi-provinsi. It reports kg/capita/year at province depth and contains both group totals and commodity leaves. Runtime must use leaf commodity records for item-level demand; group totals are reconciliation-only to avoid double counting.

A verified partial Lampung extract (province code 18) is currently integrated in js/national_economy.js: beras 84.3, jagung 1.0, singkong 12.4, ubi jalar 3.5, kentang 1.2, daging ruminansia 4.2, daging unggas 8.0, telur 7.6, susu 1.7, ikan 22.5 and kelapa 1.2 kg/capita/year. The embedded constant is explicitly named BAPANAS_PROVINCIAL_CONSUMPTION_2025_PARTIAL; it is not a full 38-province dataset.

Runtime behavior:
- applyProvincialConsumptionRecords(records) validates year, unit, non-negative numeric values, known province ID, province-code match, known commodity key and duplicate (provinceId,key) rows.
- Physical leaf observations are stored in province.regionalPhysicalDemand, not province.physicalDemand. The latter remains the national-anchor layer and must not be overwritten by provincial observations.
- Physical and downstream demand pressure is adjusted by the ratio provincial per-capita observation / national per-capita anchor.
- Category pressure is adjusted only when every mapped leaf key for that category is present for the province. Partial category rows do not silently produce a partial category total.
- Regional coverage and record count are exposed as regionalConsumption2025 and regionalConsumptionCoverage. Missing province rows continue to use the existing synthetic baseline and remain marked partial.

The 200m game population is allocated to provinces using the existing BPS provincial population shares; therefore regionalPhysicalDemand.annualTotal is an in-game scaled quantity, not a claim that the source population denominator exactly equals the 200m simulation population. National source anchors and regional observations remain separate layers.

Pending: retrieve and import the complete 38-province file (all source leaf records), then replace the partial Lampung seed with the complete verified dataset. Do not mark provincial consumption complete until all province codes, leaf keys, row counts, units and duplicate keys pass reconciliation. BPS non-household consumption remains a separate missing layer.

## 12. Kabupaten/kota household-consumption runtime overlay (2026-11-09)

Source: Bapanas, Rata-rata Konsumsi per Jenis Pangan Penduduk Indonesia Kabupaten Kota Tahun 2025, https://data.badanpangan.go.id/datasetpublications/4wx/rata-rata-konsumsi-kab-kota; data.go.id catalogue ID 3cb84f31-ed74-4a71-b083-1eb4fa49c968. The dataset reports year, four-digit locality code, province, kabupaten/kota, food group, commodity and kg/capita/year. The data.go.id listing identifies three downloadable resources (CSV/JSON/XLSX); the dataset is marked open but its full resource file was not yet fetched into the repository.

Verified 26-leaf extracts for six DKI Jakarta locality codes are integrated as BAPANAS_KABKOTA_CONSUMPTION_2025_PARTIAL: 3101 Administrasi Kepulauan Seribu, 3171 Kota Administrasi Jakarta Pusat, 3172 Kota Administrasi Jakarta Utara, 3173 Kota Administrasi Jakarta Barat, 3174 Kota Administrasi Jakarta Selatan, and 3175 Kota Administrasi Jakarta Timur (156 leaf observations total). It covers rice, maize, wheat flour, cassava, sweet potato, potato, sago, other tubers, ruminant meat, poultry, eggs, milk, fish, coconut oil, palm oil, other oils, coconut, candlenut, soybean, peanuts, mung beans, other beans, white sugar, brown sugar, vegetables and fruit. Values remain in the source unit kg/capita/year; zero-valued leaf observations are retained. Group aggregate rows (e.g. Padi-Padian, Umbi-umbian, Pangan Hewani) are excluded to prevent double counting. Each of the six DKI localities has a complete 26-leaf extract from the rendered table; the sample is still only 6/514 localities and is not a complete national import.

Runtime APIs: applyKabupatenKotaConsumptionRecords(records), localityConsumptionSnapshot(localityCode), and quoteLocality(localityCode, commodityId, nationalPrice). Ingestion validates year, unit, key, non-negative finite quantity, four-digit locality code, province-code prefix and duplicate locality/commodity keys. The local quote applies a bounded experimental demand-pressure adjustment on top of the province price index. This is a local quote overlay, not yet a local order book or transaction-clearing market.

Population weighting is now mixed by evidence status. For the six DKI Jakarta localities, official BPS 2025 locality population counts are used as relative weights and scaled with largest remainder to the Arunika DKI game population; these six locality populations reconcile exactly to the DKI province total. Outside DKI, kabupaten/kota population remains an equal-share estimate and must be labelled as such until official locality weights are integrated. Bapanas household-consumption coverage remains 6/514 localities (156 leaf observations); the full CSV/JSON/XLSX bulk resource has not yet been retrieved. Parent food-group aggregate rows must not be ingested with their child leaf rows.

Next data gate: obtain the actual CSV/JSON/XLSX resource file, verify all locality codes against the administrative master, deduplicate `(locality_code, commodity, year)`, reconcile leaf/group totals, import all locality records, and add tests for complete 514-locality coverage before changing coverage status from partial.

Additional official publication route identified during the 2026-11-09 continuation: Bapanas also lists three 2025 kabupaten/kota consumption directory volumes for Sumatera (`https://data.badanpangan.go.id/statisticpublications/t2c`), Jawa/Bali/Kalimantan/Nusa Tenggara (`https://data.badanpangan.go.id/statisticpublications/xz8`), and Sulawesi/Maluku/Papua (`https://data.badanpangan.go.id/statisticpublications/rey`). Bapanas describes the three-volume series as covering all 514 kabupaten/kota and presenting energy, protein, PPH food-group consumption and PPH scores. Treat these publications as a separate PPH/energy/protein evidence layer; do not substitute them for the kg/capita/year leaf-commodity dataset. The publication download links route to Google Drive; full PDF extraction has not yet been completed.

The locality explorer now returns `householdConsumption2025` for kabupaten/kota records where a verified Bapanas extract exists. At district/desa/kelurahan depth it explicitly reports `not_available_at_this_administrative_depth` rather than fabricating a downscaled observation. The UI JSON therefore exposes the source values and their coverage status; the local quote API remains an experimental overlay, not a cleared transaction.


### BPS DKI Jakarta population weights (2025)

The six DKI kabupaten/kota population values are now used as official population weights from BPS DKI Jakarta Table 3.1.1 (2025): Kepulauan Seribu 29,090; Jakarta Pusat 1,038,400; Jakarta Utara 1,819,010; Jakarta Barat 2,487,200; Jakarta Selatan 2,219,220; Jakarta Timur 3,085,060. Source table unit is thousand persons; runtime converts each value ×1,000 to source persons. Their raw sum is 10,677,980, matching the BPS DKI 2025 province total. Because Republik Arunika uses a 200-million game population rather than Indonesia's full projected population, these BPS counts are used as relative weights and allocated with largest remainder to the game's DKI province population; the six game locality populations sum exactly to the game province total. `localityConsumptionSnapshot()` uses these game-scale weights to convert per-capita commodity values into annual/monthly absolute demand. Other provinces/localities still use explicitly marked equal-share estimates until equivalent official population tables are integrated. Source: https://jakarta.bps.go.id/en/statistics-table/2/MTI0IzI%3D/3-1-1-penduduk-laju-pertumbuhan-penduduk-distribusi-persentase-penduduk-


### Household locality consumption now feeds daily province demand (2026-11-09)

The six DKI Jakarta locality profiles are no longer only a reporting/quote overlay. When all kabupaten/kota localities in a province have complete matching leaf-key coverage and official BPS population weights, the runtime computes a population-weighted per-capita profile and applies its ratio against the national Bapanas 2025 baseline to the province consumption-pressure vector. Physical commodity mappings also populate regional physical-demand totals. The daily simulation then consumes the resulting pressure in its demand calculation, which changes inventory accumulation/depletion and subsequent regional price formation.

This gate currently activates for DKI Jakarta only: 6/6 localities, 26 leaf keys per locality, 156 observations, and six official BPS 2025 locality population weights scaled to the Arunika DKI game population. It deliberately does not activate for the other provinces because their locality population weights and complete locality consumption profiles are not yet integrated. A province with partial data reports partial_not_applied_to_daily_province_demand; it is not extrapolated from a few observed cities.

The locality table has 26 leaf commodity rows, whereas the national Bapanas table has 28. The locality aggregation uses the locality source's 26-key schema and excludes parent food-group totals to avoid double counting. The two additional national-level leaf entries are not treated as zero in localities.

Regression coverage asserts that the six-locality population-weighted overlay is present in DKI runtime state, maize demand pressure differs from its base calibration, physical-demand totals reconcile to the game province population, and a daily tick updates inventory. GitHub Actions run 42555141202 completed SUCCESS: 54/54 Node regression tests passed, four official benchmark guards passed, and all standalone regression/browser smoke/E2E checks passed.


## 4.2 Local order-book matching primitive (2026-11-09)

The market engine now exposes `MARKET_ENGINE.matchOrderBook(orders, {now})`. It is a local deterministic matching primitive grouped by commodity, region and stage. Bid priority is price descending then time ascending; ask priority is price ascending then time ascending. Remaining tie-breaks are sequence and order ID. A fill executes at the older resting order's limit price; partial quantities remain on the book. Expired, malformed, out-of-band and self-trading orders are not executed.

**Execution contract:** an order is not a transaction. Only a returned fill is an executed transaction candidate. This first slice does not persist orders and does not yet mutate cash, stock, HPP, ledger or market prices. Do not display submitted order volume as traded volume. Full in-game settlement remains pending until atomic accounting integration and regression tests are complete.

Code commit: `780f6d82ad81b6a408c506682da244ed02d00026`; tests: `26b08f712dee590cdbbae746a5dc07bbd749208c`. CI validation was not yet confirmed at this documentation checkpoint.


### Fractional physical trade quantities

The local matcher accepts any finite positive quantity, not only integers. This is required for kg/liter-based commodities where partial physical units are legitimate. Zero, negative, non-finite values remain invalid. Regression coverage checks a 2.75-unit bid matched against a 1.25-unit ask, with 1.50 units left open. This correction does not itself implement cash/inventory reservation or settlement.


### Executed-fill price-flow adapter

The matcher emits a `priceTransactions` array from fills only. The transaction side is the incoming aggressor side, not both buyer and seller, so one matched unit does not create artificial simultaneous buy and sell pressure. The price uses the resting maker order's execution price. Unfilled orders do not enter this array. The daily game loop has not yet wired this adapter into repricing or accounting settlement.


## Player limit-order reservation layer (2026-11-09)

The current code adds a persistence/reservation primitive, not completed matching or settlement:

- `js/player_order_book.js` stores player orders in `S.marketOrderBook` and exposes submit/cancel/snapshot methods.
- Buy-side buying power is reserved at the submitted limit price; sell-side raw producer inventory is reserved by commodity. Reservation totals are derived from open orders and released on cancellation.
- Orders are scoped to the saved player region by default, restricted to the producer stage until stage-specific inventory is integrated, and expire after seven in-game days by default (1–365 configurable). Fractional quantities are supported.
- No cash, inventory, inventory cost, HPP, ledger, or price is changed by order submission/cancellation. The matcher remains a separate pure primitive; matching and atomic settlement remain future work.
- Regression tests are in `tests/player-order-book.test.js` and included in `.github/workflows/targeted-regression.yml`. CI result must be checked before claiming validation.
