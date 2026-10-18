# Tier 1 Research Ledger — 60 Commodity Sources and Evidence Gaps

Status: **in progress / not final**. Updated 2026-10-18. This is the first Tier 1 pass; it does not authorize changing game parameters. Tier 1 means the source producer/operator node in the owner's commercial chain, not the game's school/production-tier taxonomy.

## Source-backed observations found so far

### A. Chili — local producer/operator evidence (historical, contextual)
Kementan's Directorate General of Horticulture published a report on 27 October 2023 quoting Ajat, head of Kelompoktani Panen Lestari, Langensari, Lembang, Bandung Barat. The report gives a Serambi chili yield of 0.5–0.8 kg/plant or 10 tonnes/ha, production cost Rp15,000–18,000/kg, capital Rp80–100 million (higher during rainy season), and a reported farmgate selling price of Rp35,000/kg at the time. It also describes water/irrigation needs, perishability, and seasonal competition. This is unusually useful direct producer context, but its quoted selling price is historical and the exact crop season/method for the cost quote is not fully specified. It may inform a dated historical observation, **not today's game price or universal chili economics**.
Source: https://hortikultura.pertanian.go.id/bandung-barat-penyangga-cabai-merah-keriting-jabodetabek/

### B. Selected food commodities — national producer-price series
Bapanas describes its producer-price dataset as a monthly average from selected representative respondents across provinces, with units Rp/kg and Rp/kg live weight for cattle/chicken. It is national-level price evidence, not an individual farm invoice, and it does not by itself establish production costs, yield or net profit.
Dataset: https://data.badanpangan.go.id/datasetpublications/3iw/rata-rata-harga-pangan-bulanan-produsen-nasional
Examples visible in the published series include (period and exact product-stage labels must remain attached):
- GKP paddy, farmgate: Rp6,714/kg (June 2025).
- Dry shelled maize, farmer: Rp4,883/kg (June 2025).
- Dry soybean seed, farmer: Rp9,258/kg (June 2025).
- Curly red chili, farmer: Rp21,216/kg (June 2025).
- Red bird's-eye chili, farmer: Rp37,245/kg (June 2025).
- Shallot, farmer: Rp24,559/kg (June 2025).
- Live cattle: Rp52,777/kg live weight (June 2025).
- Live broiler chicken: Rp20,073 per bird (June 2025; note unit differs from kg).
- Chicken eggs: Rp24,595/kg (June 2025).
These values are historical examples only, not a single contemporaneous chain and not Tier 2/retail prices. Do not use the producer price for live chicken as a price per kg of dressed meat.

### C. Producer price coverage — BPS
BPS's 2025 agricultural producer-price publication (released 24 April 2026) reports monthly prices in rural areas across 37 provinces, excluding DKI Jakarta, covering food crops, horticulture (vegetables and fruit), and smallholder plantations. The downloadable tables need to be extracted commodity-by-commodity with province, month, grade/form and unit preserved; the landing page alone is not the numeric observation.
Source: https://www.bps.go.id/id/publication/2026/04/24/ab557ad3c44be1254c87c5aa/statistik-harga-produsen-pertanian-subsektor-tanaman-pangan-hortikultura-dan-tanaman-perkebunan-rakyat-2025.html

### D. Animal feed — upstream production input evidence (not the farm's delivered price)
Kementan's SPORA system tracks feed production, distribution and prices. Its landing page shows national September 2026 producer prices of Rp8,689/kg for broiler feed, Rp7,371/kg for layer feed and Rp8,345/kg for layer concentrate, compared with September 2025. These are feed-system observations; before using in a farm scenario, verify feed type/phase, date, geography, bag size, transport, discounts and whether the quoted stage is factory-gate or delivered.
Source: https://simpakan.ditjenpkh.pertanian.go.id/spora/backend/web/site/landing
Kementan's dated 6 March 2026 report separately gave averages based on sampled feed mills for BR1, BR0, BR2, layer P3 and KP3. It is not interchangeable with the September series above:
https://ditjenpkh.pertanian.go.id/index.php/berita/harga-pakan-terpantau-turun-kementan-biaya-produksi-peternak-diharapkan-lebih-efisien

## Tier 1 coverage matrix

Status definitions:
- **price-source-found** = a plausible source family or dated price observation exists; not a complete Tier 1 scenario.
- **source-family-found** = a source institution/path is identified but exact commodity observations and producer costs still need extraction.
- **not-yet-researched** = no sufficiently specific source has been reviewed yet.
- **blocked** = do not estimate or publish until missing evidence is supplied.

| # | Commodity | Price/source status | Missing Tier 1 evidence before economics can be finalized |
|---:|---|---|---|
| 1 | Kelapa Super | source-family-found: Kementan coconut outlook national producer series | Local producer/collector price by maturity/grade, yield/tree/cycle, harvest labor, farm inputs, rejected fruit |
| 2 | Kelapa Biasa | source-family-found: Kementan coconut outlook national producer series | Separate maturity/grade yield and cycle; do not copy Super parameters |
| 3 | Padi | price-source-found: Bapanas GKP farmgate; BPS producer-price publication | Regional yield, seed/fertilizer/pesticide/water/labor/machinery/land, harvest/post-harvest, paddy-to-rice milling recovery |
| 4 | Jagung | price-source-found: Bapanas dry shelled maize farmer price | Grain vs sweet corn distinction, moisture basis, yield, seed/fertilizer/drying/labor/storage and aflatoxin loss |
| 5 | Cabai Rawit | price-source-found: Bapanas red chili producer series; local farmer report for curly chili is only adjacent evidence | Rawit-specific farmgate price, variety, cycle/yield, fertilizer/pesticide/irrigation/labor and grade loss |
| 6 | Bawang Merah | price-source-found: Bapanas producer series | Regional price, seed bulbs, fertilizer/pesticide, irrigation, labor, curing/storage and rejected bulbs |
| 7 | Kentang | source-family-found: BPS producer-price publication | Variety/grade, highland location, seed tuber, fertilizer, disease control, labor, yield and storage loss |
| 8 | Tomat | source-family-found: BPS producer-price publication | Regional/season price, variety, yield, fertilizer, pest control, trellising, labor and spoilage |
| 9 | Ubi Jalar | source-family-found: BPS producer-price publication | Variety, regional farmgate price, vine cuttings, fertilizer, labor, yield and grading loss |
| 10 | Singkong | source-family-found: BPS producer-price publication | Food vs tapioca type, starch content, harvest age, farmgate price, cuttings, labor and transport |
| 11 | Pisang | source-family-found: BPS fruit producer-price publication | Cultivar, bunch grade, yield per clump/year, planting material, fertilizer, labor, ripening and damage loss |
| 12 | Mangga | source-family-found: BPS fruit producer-price publication | Cultivar, orchard age, bearing cycle, seasonal yield, pruning/pest control, harvest/packing and grade |
| 13 | Kedelai | price-source-found: Bapanas dry soybean farmer price | Seed/variety, moisture/grade, regional yield, inoculant/fertilizer, labor, drying and storage |
| 14 | Pepaya | source-family-found: BPS fruit producer-price publication | Cultivar, plant density/lifespan, monthly yield, seed/fertilizer/pest control, labor and rejects |
| 15 | Kacang Tanah | source-family-found: BPS food-crop producer-price publication | In-shell vs shelled form, moisture/grade, seed, fertilizer, yield, drying/shelling recovery |
| 16 | Kubis/Kol | source-family-found: BPS vegetable producer-price publication | Variety/grade, highland location, crop duration, seed, fertilizer/pest control, labor and trimming loss |
| 17 | Wortel | source-family-found: BPS vegetable producer-price publication | Grade, altitude/soil, seed, fertilizer, crop cycle, labor, washing/sorting loss |
| 18 | Buncis | source-family-found: BPS vegetable producer-price publication | Bush vs climbing variety, support structure, repeated harvest yield, seed/fertilizer/labor and rejected produce |
| 19 | Timun | source-family-found: BPS vegetable producer-price publication | Cultivar, trellis vs ground system, picking frequency, yield, seed/fertilizer/water/labor and spoilage |
| 20 | Jambu Biji | source-family-found: BPS fruit producer-price publication | Cultivar, orchard age, annual yield, fruit bagging/pest control, labor, grade and post-harvest loss |
| 21 | Bawang Putih | source-family-found: BPS producer-price publication; import/local type must be separated | Local vs imported origin, seed clove, altitude/cold requirement, cycle, yield, curing and storage loss |
| 22 | Porang | not-yet-researched at specific producer transaction level | Bulbil/corm source, crop age, fresh corm grade, oxalate processing requirements, yield and buyer contract |
| 23 | Jahe Merah | source-family-found: BPS producer-price publication | Rhizome seed, crop duration, shade/soil, fertilizer, disease loss, fresh vs dried grade and drying recovery |
| 24 | Pisang Cavendish | source-family-found: BPS fruit producer-price publication; export chain requires separate grade | Export-grade standards, farm/contract price, bunch yield, bagging, fertilizer, irrigation, field packing and rejection rate |
| 25 | Ayam Petelur | price-source-found for eggs; SPORA feed source found | DOC/pullet, strain, layer feed intake, FCR/egg mass, mortality, vaccines, housing/temperature/ventilation, manure and spent-hen value |
| 26 | Ayam Pedaging | price-source-found for live chicken; SPORA feed source found | DOC price, age/weight, FCR, mortality, cycle length, vaccine/medicine, heating/cooling, litter, labor, transport and slaughter yield |
| 27 | Sapi Potong | price-source-found for live cattle | Breed/age/weight, purchase vs breeding model, feed ration, forage/land, water, housing, veterinary costs, mortality and weight gain |
| 28 | Sapi Perah | not-yet-researched at farm-specific level | Breed/lactation curve, milk yield/quality, feed ration, replacement/calf, veterinary/breeding, cooling, electricity and manure |
| 29 | Kambing | not-yet-researched at farm-specific level | Meat vs breeding system, breed, kidding/mortality, forage/concentrate, housing, veterinary costs and liveweight price |
| 30 | Lele | not-yet-researched at farm-specific level | Fingerling, density, feed price/FCR, pond construction, water/electricity/aeration, survival, cycle, grading and harvest price |
| 31 | Udang | not-yet-researched at farm-specific level | Species/system, PL price, stocking density, feed/FCR, pond prep, salinity/water quality, aeration/power, disease, survival and harvest grade |
| 32 | Nila | not-yet-researched at farm-specific level | Pond/cage system, fingerling, stocking density, feed/FCR, water quality, survival, cycle, labor and buyer grade |
| 33 | Telur Bebek | not-yet-researched at farm-specific level | Breed/age, laying rate, feed intake, housing/free-range conditions, mortality, replacement, egg grade and farmgate buyer |
| 34 | Ikan Tuna | not-yet-researched at vessel/landing level | Wild-catch vs farmed distinction, gear/vessel, fuel/ice/crew, catch variability, landing port, size/grade and spoilage |
| 35 | Ikan Bandeng | not-yet-researched at farm-specific level | Brackish pond area, fry, stocking density, feed/fertilizer, salinity/water exchange, survival, cycle and size-grade price |
| 36 | Ayam Kampung (Daging) | not-yet-researched at farm-specific level | Breed/strain, semi-intensive vs intensive, cycle, feed, mortality, vaccination, housing, carcass yield and livebird price |
| 37 | Kopi Robusta | source-family-found: BPS smallholder plantation prices | Cherry vs green bean vs dried bean, moisture/grade, tree age/yield, harvest labor, wet/dry processing and conversion |
| 38 | Kopi Arabika | source-family-found: BPS smallholder plantation prices | Altitude/cultivar, cherry vs green bean price, yield, picking/selective labor, fermentation/drying and grading |
| 39 | Kakao | source-family-found: BPS smallholder plantation prices | Wet beans vs fermented/dried beans, pod yield, disease control, fermentation/drying recovery and grade discount |
| 40 | Sawit/TBS | source-family-found: BPS; provincial official TBS price decision needed | Age/FFB yield, fertilizer, harvest labor, transport, mill distance, quality/ALB, official pricing formula and deductions |
| 41 | Cengkeh | source-family-found: BPS smallholder plantation prices | Wet vs dry clove, tree age, bearing periodicity, harvest labor, drying recovery, grade and season |
| 42 | Pala | source-family-found: BPS smallholder plantation prices | Nut vs mace, fresh/dry form, tree yield, harvest/splitting/drying labor, grade and disease |
| 43 | Vanili Kering | source-family-found: BPS smallholder plantation prices | Green pods vs cured dry vanilla, hand pollination labor, cure yield/time, grade/moisture and theft/weather loss |
| 44 | Tebu | source-family-found: BPS smallholder plantation prices | Cane tonnage, sugar recovery/rendemen, ratoon cycle, fertilizer/water/labor, transport and mill payment formula |
| 45 | Teh Pucuk Basah | source-family-found: BPS plantation price coverage needs exact tea row/region | Green-leaf grade, plucking interval, yield, labor, transport time, factory acceptance and leaf rejection |
| 46 | Lada Putih | source-family-found: BPS smallholder plantation prices | Fresh berry vs dried white pepper, soaking/washing/drying recovery, labor, grade and moisture |
| 47 | Lada Hitam | source-family-found: BPS smallholder plantation prices | Fresh berry vs dried black pepper, blanching/drying yield, labor, moisture and grade |
| 48 | Karet/Lateks | source-family-found: BPS smallholder plantation prices | Latex vs wet slab vs dry rubber, DRC, tree age, tapping labor, coagulation/drying, transport and quality deductions |
| 49 | Cokelat Olahan | not a Tier 1 farm commodity; upstream Tier 1 is cocoa | Treat cocoa producer data separately; industrial chocolate requires factory recipe, cocoa-butter/sugar/milk inputs, energy, packaging and yield |
| 50 | Gula Aren Cair | not-yet-researched at sap producer level | Palm species, sap volume/tree/day, fermentation loss, tapping labor, fuel/energy, concentration yield, packaging and shelf life |
| 51 | Bijih Besi | not-yet-researched at mine-gate level | Ore grade, wet/dry ton, mine permit, recovery, overburden, drilling/blasting, diesel/electricity, labor, royalties and transport |
| 52 | Batu Bara | not-yet-researched at mine-gate level | Coal grade/GAR, mine permit, stripping ratio, extraction cost, hauling/barge, royalties, moisture and buyer contract |
| 53 | Emas | not-yet-researched at mine-gate level | Ore grade, recovery, mining/processing route, energy/reagents, tailings, permits/royalties, refining terms and assay |
| 54 | Nikel | not-yet-researched at mine-gate level | Laterite/saprolite/limonite grade, moisture, mine/haul distance, stripping, royalties, buyer/specification and processing route |
| 55 | Bauksit | not-yet-researched at mine-gate level | Grade/alumina/silica, moisture, stripping/haulage, washing/recovery, permits/royalties and offtake terms |
| 56 | Gas Alam Cair/LNG | not a generic farmgate commodity; upstream gas supply and LNG are different nodes | Gas composition, contractual price, liquefaction energy, plant capex/throughput, shipping, regasification and take-or-pay terms |
| 57 | Minyak Mentah | not-yet-researched at wellhead level | API gravity/sulfur, field decline, lifting cost, water handling, royalties/PSC terms, transport and realized benchmark differential |
| 58 | Plastik/Bahan Baku | this is a manufactured material, not raw farm output | Define resin type (PE/PP/PET/PVC), polymer grade, feedstock/naphtha, plant yield/energy, resin producer price and unit |
| 59 | Semen | this is a manufactured product, not a raw Tier 1 producer commodity | Define cement type/grade, clinker and gypsum, kiln fuel/electricity, capacity utilization, bag/bulk packaging, freight and plant-gate price |
| 60 | Tembaga | not-yet-researched at mine-gate level | Ore grade, recovery, concentrate vs cathode, smelting/refining charges, energy, permits/royalties and benchmark price |

## Rules for continuing the ledger

1. Tier 1 work is not complete until every row has a source-backed producer price and the relevant technical/cost evidence for the chosen production system, or an explicit `blocked_missing_evidence` status.
2. The first 24 are not all represented by Bapanas; use BPS and relevant local sources for fruits, vegetables, plantations, porang and spices. For mining/manufacturing, use ESDM, operator disclosures, official royalty/benchmark prices, exchange data and technical reports.
3. Use direct operator/farmer/trader evidence where published or provided. Do not claim a direct interview occurred when only a government report quotes an operator.
4. Source observation does not mean the economic scenario is verified. Preserve original period and geography; do not silently update historical prices to current.
5. Never copy the blueprint's illustrative profits into the real-data registry. Keep them as game design candidates until all required inputs reconcile.


## New source extraction — January 2026 producer-price snapshot (checked 2026-10-19)

The Bapanas dataset page currently exposes January 2026 observations alongside historical monthly data. The following are *national producer-level average observations*, not individual invoices and not Tier 2/retail prices:

| Commodity / exact label | Period | Published value | Unit / interpretation | Evidence limit |
|---|---|---:|---|---|
| GKP Tingkat Petani | Jan 2026 | 6,884 | Rp/kg, harvested dry paddy (GKP) at farmer level | Not milled rice; moisture/grade detail must be preserved |
| GKG Tingkat Penggilingan | Jan 2026 | 7,980 | Rp/kg, dry paddy at mill | Different chain stage from farmgate GKP |
| Beras Medium Tk. Penggilingan | Jan 2026 | 13,012 | Rp/kg, medium rice at mill | Not consumer retail price |
| Beras Premium Tk. Penggilingan | Jan 2026 | 14,370 | Rp/kg, premium rice at mill | Not consumer retail price |
| Jagung Pipilan Kering Tk. Petani | Jan 2026 | 5,810 | Rp/kg, dry shelled maize at farmer level | Moisture basis and local grade still need confirmation |
| Kedelai Biji Kering Tk. Petani | Jan 2026 | 9,418 | Rp/kg, dry soybean seed at farmer level | Variety/import origin and quality not specified in this aggregate |
| Cabai Merah Keriting Tk. Petani | Jan 2026 | 24,578 | Rp/kg, curly red chili at farmer level | Does not substitute for rawit chili |
| Cabai Merah Besar Tk. Petani | Jan 2026 | 21,445 | Rp/kg, large red chili at farmer level | Separate cultivar/category from curly chili |
| Cabai Rawit Merah Tk. Petani | Jan 2026 | 34,122 | Rp/kg, red bird's-eye chili at farmer level | National average does not capture local season/grade |
| Bawang Merah Tk. Petani | Jan 2026 | 23,915 | Rp/kg, shallot at farmer level | Local variety, size and curing state remain open |
| Sapi Hidup | Jan 2026 | 52,883 | Rp/kg live weight | Must not be compared directly with dressed-beef Rp/kg |
| Ayam Ras | Jan 2026 | 22,971 | Rp/kg live weight | Published dataset's displayed unit metadata is inconsistent in some table views; verify underlying download before importing into a registry |
| Telur Ayam Ras | Jan 2026 | 26,027 | Rp/kg eggs | Farm-gate grade/packaging and farm cost remain unknown |

Source: Bapanas, *Rata-rata Harga Pangan Bulanan Tingkat Produsen Nasional*, current dataset page and published table. Page metadata describes a representative selected-respondent national average and monthly update; do not label it as a direct farmer invoice: https://data.badanpangan.go.id/datasetpublications/3iw/rata-rata-harga-pangan-bulanan-produsen-nasional

### Additional livestock and input source confirmed

- BPS, *Statistik Harga Produsen Pertanian Subsektor Peternakan dan Perikanan 2025*, released 24 April 2026, reports monthly rural producer prices across 38 provinces. This is a separate source family for livestock and fisheries; extract commodity-specific tables with species, product stage, province, month and unit intact before assigning values: https://www.bps.go.id/id/publication/2026/04/24/471c9fc5982e7c8927c362f8/statistik-harga-produsen-pertanian-subsektor-peternakan-dan-perikanan-2025.html
- Kementan SPORA price bulletin (6 March 2026): BR1 Rp8,010/kg (33 feed mills), BR0 Rp8,451/kg (30 mills), BR2 Rp7,967/kg (31 mills), layer P3 Rp6,803/kg (32 mills), and layer concentrate KP3 Rp7,735/kg (14 mills). These are reported mill-level averages; farm-delivered price must add or separately source freight, bag size, discount and local availability: https://ditjenpkh.pertanian.go.id/berita/harga-pakan-terpantau-turun-kementan-biaya-produksi-peternak-diharapkan-lebih-efisien

### Status after this extraction

This improves the dated Tier 1 price evidence for paddy, maize, soybean, red chili categories, shallot, cattle, broiler and eggs. It does **not** complete Tier 1 economics: farm yields, inputs, labor, losses, production system and direct operator/trader evidence remain missing for most rows. For the 60-commodity blueprint, do not infer farm profit from these prices; do not move Tier 2/3/4 to final until the corresponding Tier 1 producer scenario is reconciled. The Bapanas poultry unit ambiguity is explicitly flagged for checking against the original downloadable CSV/XLSX before use.


## Direct operator and commodity-specific evidence — horticulture, coffee, aquaculture (checked 2026-10-19)

These sources improve Tier 1 evidence beyond national averages. All observations remain dated and context-specific; they must not be mixed with present-day prices without a fresh quote/series.

### Tomat — named grower cost/yield/sales case

Kementan Directorate General of Horticulture reports Juhara, a vegetable farmer in Pangalengan, Bandung, saying a 1-hectare tomato crop could cost Rp100.8 million, yield 40 tonnes fresh tomato, and at a stated “normal” selling price Rp3,000/kg yield Rp120 million revenue and about Rp19 million profit per season. Arithmetic check: 40,000 kg × Rp3,000 = Rp120,000,000; less Rp100,800,000 = Rp19,200,000 before any cost categories omitted from the report. The report also says a second planting after the first harvest can save certain inputs (mulch, stakes, ties, tools, land preparation labor). Date is historical (roughly 2019-era publication); crop season, detailed cost ledger, grade, buyer transaction and whether land/capital depreciation are included need confirmation. Treat as an operator-reported scenario, not a current baseline.

Source: https://hortikultura.pertanian.go.id/mau-raup-untung-dari-usahatani-tomat-begini-caranya/

### Kopi Robusta/Arabika — farmer group, conversion yield and buyer-stage evidence

Kementan Directorate General of Estate Crops documents the Candi Mulyo farmer group and Heri Tahan Muji. The report says the group initially sold cherries to collectors at Rp5,000/kg for robusta and Rp8,000/kg for arabica (historical, around 2020); later, Wonosari group figures were reported as 4–6 tonnes robusta cherry/ha converted to 700–900 kg green bean/ha, sold to collectors/processor at Rp65,000–70,000/kg. Arabica was reported at 500–650 kg green bean/ha with average price Rp80,000–95,000/kg, in the stated villages at 800–1,000 m elevation. This is valuable because it separates cherry and green-bean stages and includes a conversion yield, but the report does not supply a full input/labor ledger, exact crop year for every price, sample size, moisture standard or transaction receipts. Do not treat these numbers as current universal yield or price.

Source: https://ditjenbun.pertanian.go.id/kementan-dorong-potensi-bisnis-kopi-wonosari-jadikan-desa-wisata-kopi/

### Lele — operator testimony and controlled/technical studies

- KKP profile of Jali / Kelompok Tri Mino in Demak records a local operator/customer comparison: commercial feed stated at a minimum Rp10,500/kg versus locally formulated feed Rp6,500/kg; an interviewed grower reported local-feed FCR up to 1.2. This is historical, site-specific testimony; verify date, current prices, recipe/nutrient quality and survival before game use. Source: https://www.kkp.go.id/djpb/jali-sosok-penggerak-pakan-ikan-mandiri-di-kabupaten-demak65c30075eba47/detail.html
- KKP aquaculture journal article comparing selected and non-selected African catfish in 50 m² earthen ponds, stocked at 200 fish/m² to around 100 g harvest size, reports selected fish FCR 0.90 ± 0.08 and 68 ± 13 day cycle versus non-selected FCR 1.09 ± 0.01 and 90 ± 12 days; bioeconomic analysis found lower production cost and higher profit for the selected group under that study's design. These are experimental results, not a guarantee for every farm or system. Source: https://jurnal.kkp.go.id/ma/article/view/1205
- KKP field account of biofloc catfish: 30,000 fingerlings across ten 3-metre round tanks required Rp40.6 million per roughly 3-month cycle for fingerlings, feed, electricity and probiotics. This is a project-specific cost scope; it does not automatically include labor, depreciation, mortality or land. Source: https://kkp.go.id/djpb/jadi-solusi-budidaya-di-lahan-terbatas-kkp-kembangkan-aplikasi-bioflok-di-masyarakat65c3004d0a09e/detail.html

### Sawit/TBS — official province-level administered price data source identified

Kementan's SIPASBUN portal exposes provincial team-set TBS prices by period, including age class, K index, CPO/kernel prices and rendemen. This is the correct official source family for smallholder FFB pricing, but the public landing page is interactive and the current result table did not expose a stable numeric observation in this retrieval. No current TBS value is entered from the empty table. Source: https://sipasbun.ditjenbun.pertanian.go.id/harga-tbs/report-provinsi

### Data-quality and next steps

These findings now provide commodity-specific producer/operator evidence for tomato, coffee and catfish, and an official price route for oil-palm FFB. Remaining gaps include full dated direct quotes/invoices, regional current prices, complete cost ledgers, infrastructure/depreciation, and corroboration for all 60 commodities. Keep each production system separate (earthen pond vs biofloc; cherry vs green bean; single vs repeat tomato planting). No Tier 1 commodity is declared fully economics-verified by these sources alone.


## Research tranche — primary farm/operator cases and production-system variables (2026-10-19)

This tranche expands Tier 1 evidence for paddy, tomatoes, broiler/layer poultry, catfish, tilapia, coffee and oil-palm FFB. It is a source-reconnaissance tranche, not final economic parameterization. Values retain their original year, place, unit, product form and production system.

### Padi — cost structure from a 2025 local farm-budget document and a separate national study
- A Ministry of Agriculture Brigade Pangan document titled *Analisa Biaya Usaha Tani Budidaya Tanaman Padi Sawah*, Desa Paluh Kurau, 2025, lists land preparation at Rp4.25m/ha, seed 30 kg/ha at Rp40,000/kg (Rp1.2m), Urea 150 kg/ha at Rp5,000/kg, SP-36 100 kg/ha at Rp4,500/kg, and pesticides Rp500,000. The available excerpt does not establish a complete total cost/yield/harvest price, so do not treat those partial rows as a full budget. Source: https://brigadepangan.pertanian.go.id/storage/perencanaan_doc_bp/LVthEZoafM7FgIAp4ZHhRuphKM7iAQTeoa52pnPF.pdf
- A separate Ministry of Agriculture policy study summarizing 2023 rice-farm structure reports average total cost Rp17.83m/ha, labor Rp8.44m/ha, land rent Rp4.66m/ha, fertilizer Rp1.72m/ha, pest control Rp1.62m/ha and seed Rp0.90m/ha. This is a different population/year/method from the local 2025 budget; keep them as separate evidence rows rather than averaging them. Source: https://psekp.setjen.pertanian.go.id/web/wp-content/uploads/2026/01/PB-2025-potensi-dampak-kebijakan-penurunan-het-pupuk-bersubsidi.pdf
- Reconciliation still needed: location-specific harvest yield, GKP moisture/quality, water/irrigation, machinery, paid and family labor, rent/owned-land opportunity cost, post-harvest losses and the exact price realization for the same farm-season.

### Tomat — farmer-reported full crop case (historical, Pangalengan)
Kementan's horticulture directorate quotes Juhara, a Pangalengan vegetable grower, reporting 1 ha of monocropped tomato, 40 tonnes output, cost Rp100.8m, and a normal selling-price scenario Rp3,000/kg. Gross revenue at that stated price is Rp120m and gross-minus-reported-cost is Rp19.2m. The source itself rounds the claim to about Rp19m; it does not enumerate every cost line or specify a current season. It also describes a second planting on the same land and potential savings on mulch, stakes, tools, land preparation and maintenance labor. Treat the Rp19.2m as arithmetic from the farmer's reported scenario, **not audited net profit**. Source: https://hortikultura.pertanian.go.id/mau-raup-untung-dari-usahatani-tomat-begini-caranya/

### Ayam pedaging / petelur — regulated DOC and feed-mill observations
- Kementan's 25 January 2026 report says Bapanas Decree 524/2025 sets broiler DOC prices at Rp7,000/chick at farmer level and Rp11,000/chick loco factory. The different delivery stages must not be merged into one DOC price. This is a regulated reference, not evidence that every farm actually paid that price. Source: https://bpmsph.ditjenpkh.pertanian.go.id/berita/kementan-perketat-pengawasan-doc-dan-pakan-demi-lindungi-peternak-ayam
- Kementan/SPORA's report dated 6 March 2026 reports producer averages sampled from 33 BR1 mills at Rp8,010/kg, 30 BR0 mills at Rp8,451/kg, 31 BR2 mills at Rp7,967/kg, 32 layer-P3 mills at Rp6,803/kg, and 14 layer-KP3 concentrate mills at Rp7,735/kg. These are mill-side averages, not necessarily farm-delivered prices; phase, freight, tax, bag size, credit terms and formulation must be recorded. Source: https://bpmsph.ditjenpkh.pertanian.go.id/index.php/berita/harga-pakan-terpantau-turun-kementan-biaya-produksi-peternak-diharapkan-lebih-efisien
- A Kementan report about a Probolinggo independent layer farm cohort with around 3,500–5,000 birds states feed can exceed 70% of production cost. That is a contextual operational statement, not a universal fixed share. The report discusses on-farm ration formulation and inventory management but does not provide a complete farm ledger in the page excerpt. Source: https://ditjenpkh.pertanian.go.id/index.php/berita/kementan-bekali-peternak-probolinggo-formulasi-pakan-sendiri-biaya-produksi-turun-untung-naik
- Still required for a defensible farm scenario: strain and flock age, stocking density, daily feed intake, FCR or egg mass/feed ratio, mortality/culling, vaccine/medicine, brooding/heating, ventilation/cooling, litter, labor, depreciation, manure/spent-hen value, and farmgate product price for the same period.

### Lele — operator and controlled/technical evidence, systems kept separate
- KKP's report quotes a Demak fish-feed producer/operator and a buyer/farmer who reported homemade feed at Rp6,500/kg versus factory feed at at least Rp10,500/kg and claimed maximum FCR 1.2 for that feed. This is attributed operator testimony from the article, not an independently audited general benchmark. Source: https://www.kkp.go.id/djpb/jali-sosok-penggerak-pakan-ikan-mandiri-di-kabupaten-demak65c30075eba47/detail.html
- KKP's commercial-scale earthen-pond study reports selected catfish at FCR 0.90 ± 0.08 and 68 ± 13 days to ~100 g harvest size, versus non-selected fish at FCR 1.09 ± 0.01 and 90 ± 12 days. The study reports production-cost reduction up to Rp2,365/kg and profitability ratio 61.09 ± 5.17% versus 32.54 ± 4.12%. These are study-specific values with selected strain, pond and cost-method context, not a universal present-day margin. Source: https://jurnal.kkp.go.id/ma/article/view/1205
- KKP's separate biofloc project report estimates seed, feed, electricity and probiotics at Rp40.6m for 30,000 catfish seed across ten 3-metre round tanks for a three-month cycle. The listed scope excludes any costs not expressly stated, so it cannot be compared directly to the earthen-pond study's per-kg costs. Source: https://kkp.go.id/djpb/jadi-solusi-budidaya-di-lahan-terbatas-kkp-kembangkan-aplikasi-bioflok-di-masyarakat65c3004d0a09e/detail.html

### Nila — two distinct operator/system examples
- KKP's report on a salinity-tolerant tilapia farming community in Indramayu quotes an operator describing a traditional 1-ha brackish pond, 40,000 seed stocked, ~70% survival, 3 tonnes harvested per ~2.5-month cycle, feed supplied at about 1:1 to harvest weight, input spending around Rp40m for feed/seed/medicine, and sale price Rp20,000/kg. The report's arithmetic is internally inconsistent if interpreted as net income: 3,000 kg × Rp20,000 = Rp60m gross, less Rp40m stated inputs = Rp20m before omitted labor, land, depreciation, transport and other costs. Preserve the author's label and do not treat it as verified net profit. Source: https://www.kkp.go.id/djpb/kampung-nila-salin-di-indramayu-targetkan-dalam-dua-tahun-tembus-pasar-nasional65c2ff58abbae/detail.html
- KKP's biofloc technical case gives 90-day cycle assumptions for round tanks, including FCR 1.1 and feed at Rp11,000/kg, and explicitly tabulates target harvest, electricity and total production cost. It is a planning model, not observed transaction evidence. Source: https://ppid.kkp.go.id/media/uploads/document_information_public/SOP_Bioflok_Sipanen_BRPBATPP_-_2024_11zon.pdf
- Keep traditional brackish pond, freshwater pond/cage, running-water pond and biofloc as separate production systems. For each, verify seed size, stocking density, survival, water/salinity/oxygen, feed and FCR, electricity/aeration, pond/tank depreciation, labor, cycle duration, harvest size/grade and buyer price.

### Kopi — producer group and official price series
- Kementan's 2026 plantation performance report gives annual domestic average prices for robusta: Rp50,806/kg in 2024 and Rp61,870/kg in 2025; arabica: Rp92,976/kg in 2024 and Rp102,031/kg in 2025. These are published annual averages; product form/market stage must be checked in the original table before comparing to cherry or green-bean observations. Source: https://ditjenbun.pertanian.go.id/template/uploads/2026/03/LAKIN-DITJENBUN-2025.pdf
- Kementan's report on a farmer cooperative in Central Java states it moved from buying/marketing 100 tonnes/year of wet coffee fruit at Rp3,000/kg to producing around 7 tonnes/year of Arabica green bean at Rp80,000/kg after post-harvest equipment/facilities; the cooperative reported production cost Rp1,500/kg for its green bean, and also reported paying Rp40,000/m³ for water used in full-wash processing. This is a specific cooperative case, not a general cherry-to-green-bean conversion ratio or complete all-in cost ledger. Source: https://ditjenbun.pertanian.go.id/akselerasi-nilai-tambah-untuk-mendorong-ekspor-melalui-perbaikan-pascapanen-kopi-di-jawa-tengah/
- Do not infer conversion yield directly from the two annual tonnages unless the source establishes that they represent the same batch, season and input/output flow. Record robusta/arabica and cherry/green bean/dried parchment separately.

### Sawit/TBS — current policy context, but exact provincial observation still not captured
Kementan's 8–9 June 2026 public reports describe enforcement and coordination around provincial smallholder FFB/TBS prices and differences between mill/company payments and local determinations. The official SIPASBUN portal is the appropriate period/age-class source, exposing K index, CPO/kernel price, rendemen and TBS price fields, but a stable numerical row still needs to be extracted for a selected province and period. Do not substitute a national CPO price or a press headline for the actual TBS price. Sources: https://ditjenbun.pertanian.go.id/tak-ada-alasan-harga-tbs-turun-mentan-amran-ultimatum-300-perusahaan-sawit/ and https://sipasbun.ditjenbun.pertanian.go.id/harga-tbs/report-provinsi

### Scope status after this tranche
This tranche strengthens evidence for selected Tier 1 commodities but does **not** complete Tier 1 for all 60 commodities. It does not finalize any margin, yield, recipe or game balance value. All observed prices remain separate by product form, market stage, date and production system; missing values stay missing.


## Research tranche — horticulture producer cases and budget-model evidence (2026-10-19)

### Bawang merah — producer/trader price-stage contrast and seed-system cost driver
- Kementan's horticulture directorate quoted Brebes onion association leader Ikhwan reporting farmgate price rising from Rp8,000 to Rp10,000/kg at that historical moment, while Pasar Induk Kramat Jati was Rp13,000/kg. The same report says simultaneous harvest volumes in January–February pressured farmgate prices. These are dated local observations, and the difference is a stage/market context rather than a guaranteed trader margin. Source: https://hortikultura.pertanian.go.id/ketangguhan-petani-bawang-merah-brebes/
- A separate Kementan field report quotes Brebes farmer Iyus, who has cultivated seed-grown shallots for over 10 years, saying seed-grown cultivation can reduce total production cost relative to bulb seed but requires more intensive nursery care; Lokananta seed-grown yield is reported at 15–18 t/ha versus 10–12 t/ha for bulb-seed shallots in Brebes. No comparable complete cost table is provided in the article, so this is a yield/system comparison, not a final profitability comparison. Source: https://hortikultura.pertanian.go.id/fokus-tekan-biaya-produksi-kementan-alihkan-petani-tanam-bawang-merah-biji/

### Cabai rawit — direct farmer price and separate 1-ha budget scenario
- Kementan's 2023 report quotes Suiswanto, a red bird's-eye chili farmer in Grabagan, Tuban, saying mixed, unsorted farmgate product was selling around Rp3,000–4,000/kg during a glut, versus a normal price above Rp10,000/kg. The report notes Tuban production that May of 80 tonnes of bird's-eye chili and 50 tonnes of curly chili. This directly demonstrates price collapse/grade effects; it is not a present-day price. Source: https://hortikultura.pertanian.go.id/kementan-gerak-cepat-selamatkan-harga-cabai-rawit-di-tuban/
- A Directorate General of Horticulture PDF titled *AUT Cabai Rawit Musim Hujan Skala 1 Ha* provides a detailed budget example: 15 seed sachets at Rp135,000; NPK, SP-36, KCL/ZK; 20,000 kg manure; liquid fertilizer; dolomite; mulch; stakes; yellow traps; fungicide/insecticide/herbicide and botanical pesticide. The listed production-input subtotal is Rp42.32m/ha before any additional cost lines in the full model. This is a model/budget, not a verified farm invoice, and rainy-season technology assumptions need to remain attached. Source: https://hortikultura.pertanian.go.id/wp-content/uploads/2024/11/Analisa-Usahatani-Komoditas-Sayuran-Buah_watermark.pdf
- A separate JICA/Kementan PM-999 chili budget estimates total cost Rp29.649m per season, estimated harvest 2,210 kg reduced by 10% crop failure to 1,989 kg, contract price Rp19,000/kg and modelled seasonal profit Rp8.139m. It is a planning example for that variety/contract and must not be merged with the one-hectare rainy-season rawit budget or treated as a current market quote. Source: https://data.hortikultura.pertanian.go.id/jica/Materials/Chapter%207/7-5%20Contoh%20rencana%20anggaran%20%28Cabai%29.pdf

### Kentang — producer yield/cost/price case
Kementan's horticulture directorate reports an average potato production-cost range of Rp80–90m/ha for a 120-day crop, yields of 20–25 t/ha, and normal farmgate prices Rp8,000–10,000/kg. This is a reported sector case from the source period, not a current provincial quotation; variety, seed grade, elevation, disease pressure, storage, and harvest sorting must be matched before comparing costs and revenue. Source: https://hortikultura.pertanian.go.id/apbk-jabar-program-kendalikan-impor-pak-amran-tercapai-kini-sukses-swasembada-kentang-konsumsi/

### Porang — literature review values are not first-hand farm accounts
A 2023 review in *Forum Penelitian Agro Ekonomi* summarizes reported porang yields of 6–10 t/ha, corm prices around Rp10,000–13,000/kg, bulbil prices Rp200,000–300,000/kg, and production cost around Rp80–90m/ha. These are literature-summarized ranges whose cited underlying studies, crop age, moisture/grade, and market period need tracing before use. They are not a direct current farmer transaction or a fully reconciled profit dataset. Source: https://epublikasi.pertanian.go.id/berkala/fae/article/download/3596/3566/7104
- Quality flag: the review's surrounding prose includes large profitability claims that require independent reconciliation of corm and bulbil quantities, marketable grade, crop duration and all costs. Do not copy the claimed profit into the registry until the cited primary studies are retrieved and recalculated.

### Cross-case quality control
- The onion, chili and potato values above are historical local observations or model budgets, not current national averages. Price, grade, weather, season, crop duration and production system remain explicit dimensions.
- Do not average the chili rainy-season budget and PM-999 contract budget; they represent different varieties, costing assumptions and sales arrangements.
- No game parameter or Tier 1 row is marked fully economics-verified by this tranche. All 60 commodities remain under evidence reconciliation; Tier 2/3/4 finalization remains blocked behind Tier 1 coverage and cost/yield completeness.


## Research tranche — soybean, cassava, red ginger, dairy-feed constraints and milkfish operator costs (2026-10-19)

### Kedelai — cooperative on-farm trial and farmgate price context
- The Ministry of Agriculture's 2021 technology package for large-seeded yellow soybean (Detap 1) involved 79 cooperating farmers on 24 ha in irrigated rice fields in Pandaan, Pasuruan during dry-season planting (MK-2). It reports average yield 2.7 t/ha, best result 3.3 t/ha, production cost Rp7.726m/ha, and modeled revenue Rp24.3m at Rp9,000/kg (reported modeled net Rp16.574m). This is a specific supervised variety/technology package and season, not the national farmer average. Source: https://repository.pertanian.go.id/items/b2769280-f6d8-4426-8ffb-7653a2bbc798
- Kementan's 2026 statement says farm-level soybean prices in its current policy context were around Rp8,000–9,000/kg, with government discussing a higher purchase reference. This is a dated policy statement, not an actual invoice series and not necessarily the same variety/moisture/location as the 2021 trial. Source: https://pertanian.go.id/news/view/7755?lang=eng
- Keep dry-season irrigated soybean trials, intercropped plantation soybean and ordinary rainfed farm scenarios separate; seed, drainage, mechanization, moisture, variety and buyer contract affect unit costs.

### Singkong — official purchase-price floor context and factory deductions
- On 31 January 2025, Kementan announced a Rp1,350/kg national purchase reference for cassava supplied to the starch industry after reports that factories were buying at Rp1,100/kg with 15–18% deductions, or Rp1,300–1,400/kg with 35–38% deductions. This is a policy/market dispute record; deductions materially change the realized net farmgate price and must be modeled separately from the headline price. Source: https://www.pertanian.go.id/?act=view&id=6576&show=news
- A Kementan release dated 23 September 2026 quotes the Indonesian Cassava Society chair reporting around Rp2,400/kg in some Lampung production centres after import restrictions and domestic-market measures. It is a regional reported market observation, not a nationwide guaranteed price and not proof of producer margin. Source: https://hortikultura.pertanian.go.id/harga-singkong-naik-msi-apresiasi-kebijakan-mentan-amran-stop-impor/
- Before calculating cassava profit, obtain same-period farm yield, harvest age, variety/starch content, labor/land/input costs, transport distance, factory acceptance and actual deduction basis.

### Jahe merah — grower-reported scenario, not an audited profit series
Kementan's horticulture directorate quoted Chevi describing a one-hectare red-ginger scenario with reported Rp70.2m investment for seed, fertilizer and labor, 15 t harvest and up to 18 t with good seed/fertilizer; the report uses an assumed Rp10,000/kg price. At 15 t the implied gross revenue is Rp150m; subtracting only the stated Rp70.2m gives Rp79.8m before any omitted costs or timing adjustments. The source is a grower-reported illustrative calculation, not a current transaction quote or complete verified net profit. Source: https://hortikultura.pertanian.go.id/tanaman-obat-baik-untuk-imunitas-sekaligus-pengungkit-ekonomi-petani/
- A separate Ministry of Agriculture repository document includes a 1-ha red-ginger cost/revenue table, but extracted text appears internally garbled/inconsistent in some row alignment. Do not ingest its totals until the original PDF table is visually checked and recalculated. Source: https://repository.pertanian.go.id/server/api/core/bitstreams/0a92470d-815d-4d67-924b-59c8195d6e86/content

### Sapi perah — input dependency is established; farm economics still missing
- Kementan's September 2026 feed/productivity report explicitly says herd expansion must be coupled with year-round forage, local feed ingredients, water, labor and feed infrastructure; it reports national domestic milk production targets but does not provide an individual farm's milk yield/cost ledger. This supports the dependency structure, not a precise per-cow margin. Source: https://ditjenpkh.pertanian.go.id/berita/kementan-perkuat-inovasi-pakan-dorong-produktivitas-sapi-perah-dan-produksi-susu-nasional
- Farm-specific data still needed: lactation stage and days in milk, breed, milk yield and fat/protein grade, feed dry-matter intake/ration price, replacement/calf cost, veterinary/breeding, cooling/electricity, labor, rejected milk, manure revenue and cooperative payment deductions.

### Bandeng — operator cost and trader-stage evidence in a KKP operational report
A KKP Directorate of Logistics performance report records a milkfish grower case with around two permanent workers plus six seasonal harvest workers; operational costs per cycle included seed, fuel, vitamins, urea fertilizer for natural feed, permanent and harvest labor, and netting rentals. The reported output was 4 tonnes/cycle sold into Gresik and Lamongan at Rp18,000/kg for size 4–6 fish/kg; the report mentions a Rp1,000–2,000/kg net margin between collector and grower. This is a named operational case in a government performance report, not a national farmgate average; the cycle length, pond area, and complete capex/land ledger must be recovered from the source before computing comparable profitability. Source: https://www.kkp.go.id/storage/AkuntabilitasKinerja/3266/document-akuntabilitas-kinerja-686b228529047LKj%20Ditlog%20TW%20III%20tahun%202024%20Review_Kirim.pdf

### Data-quality conclusion for this tranche
- The soybean model is a supervised 2021 production package; the current soybean price quote is a different period/source. Do not combine them as a same-period observed margin.
- Cassava's realized price depends on factory deductions; preserve the deduction rate and price basis.
- Red-ginger profit arithmetic is provisional because not all costs are specified and a second PDF's table extraction is garbled.
- Milkfish operator costs are partial and need the full report context before any unit-economics calculation.
- No commodity is declared fully economics-verified by this tranche; no game parameter, recipe, yield or margin was changed.


## Research tranche — mining, crude oil and gas benchmark-source mapping (2026-10-19)

These commodities require a different evidence model from farm output: regulatory benchmarks and exchange metal prices are not automatically mine-gate receipts. Ore grade, moisture, impurities, recovery, processing stage, freight, royalties and offtake deductions must be explicit.

### Batu bara — official quality-indexed HBA benchmark located
ESDM Decree 124.K/MB.01/MEM.B/2026 for the second period of March 2026 lists four HBA benchmarks: 6,322 GAR at US$103.01/t; 5,300 GAR at US$71.55/t; 4,100 GAR at US$48.32/t; and 3,400 GAR at US$34.25/t. The decree specifies calorific value and moisture/sulphur/ash assumptions for each benchmark. These are reference prices by coal quality, not a mine's realized sale price; the exact period, GAR basis and quality adjustment must be retained. Source: https://www.minerba.esdm.go.id/files/2026/91afdb04e1dd82a83385a5fdc67aea48.pdf

### Nikel — official metal benchmark located, ore HPM not yet extracted
ESDM's official first-period January 2026 decree lists the nickel HMA at US$14,630/dmt, defined by the LME cash-seller-and-settlement price averaging method. This is a refined/metal benchmark used in the official formula context; it is **not** the price per tonne of Indonesian laterite ore. The corresponding period-specific HPM formula/value for ore, with grade and moisture basis, must be extracted before recording any nickel ore producer price. Source: https://www.minerba.esdm.go.id/files/2026/c54cffcbe80f3aad56bc0001dc176250.pdf

### Minyak mentah — official Indonesian Crude Price (ICP) is a benchmark, not individual wellhead netback
ESDM set average ICP for September 2026 at US$112.81/barrel, up from US$89.43/barrel in August 2026. The official announcement cites the applicable ministerial decree and explains ICP as a benchmark for upstream state revenue/macro assumptions. It cannot be directly assigned as a specific field's wellhead realization: crude quality, lifting point, transport, contract differential, production-sharing/fiscal terms and lifting costs remain necessary. Source: https://www.esdm.go.id/id/media-center/arsip-berita/ketegangan-geopolitik-dorong-icp-september-naik-ke-us11281-per-barel

### LNG / natural gas — regulated industrial plant-gate gas is a different node from LNG export price
ESDM's 29 June 2026 announcement describes policy action to lower LNG industrial prices, while ESDM's regulated gas framework distinguishes price at user plant gate and transmission/midstream costs. A published academic netback analysis (28 September 2026) estimates the wellhead value differs substantially between HGBT-regulated pipeline sales and export/regasified-LNG routes. These are distinct commercial nodes; the game's generic “LNG” commodity must not mix upstream natural gas, liquefied product at plant gate, shipping and regasified gas. The current exact contract/price per MMBtu for the intended node is not yet established in this ledger. Sources: https://www.esdm.go.id/en/media-center/news-archives/selamatkan-industri-menteri-esdm-turunkan-harga-lng-industri ; https://journal.lemigas.esdm.go.id/index.php/SCOG/article/view/2183

### Iron ore, gold, bauxite, copper, plastics and cement — no final Tier 1 price assigned in this tranche
- For iron ore, gold, bauxite and copper, a metal benchmark is insufficient. Need an actual mine/operator disclosure or government source with product form (ore/concentrate/cathode/refined), grade/assay, moisture, recovery, period, delivery basis and applicable HPM/royalty/TC-RC deductions.
- For plastics/raw materials, first specify resin family and grade (PE/PP/PET/PVC etc.) and whether price is resin producer gate, distributor, or recycled feedstock. A generic “plastic” number is not a defensible commodity observation.
- For cement, specify product type (OPC/PCC/etc.), bag vs bulk, ex-plant vs delivered, energy/clinker/freight, and actual producer/industrial transaction context. A retail store price is not a factory-gate producer price.
- No unsupported price, extraction cost or profit is inserted for these commodities. They remain source-needed/blocked until a source and unit match the defined commodity node.

### Mining/energy evidence rule
For every mining/energy observation, record benchmark type, commodity form, quality/grade, unit, currency, period, location/delivery point, source URL, whether regulated/market/transaction price, and all relevant deductions. Do not treat a global benchmark as a mine-gate invoice or a price observation as production-cost evidence.


## Data-source audit — Bapanas published table metadata versus row-level units (2026-10-19)

The Bapanas producer-price landing page was reopened and checked against its visible table and metadata:
- Metadata says units are Rp/kg and Rp/kg live weight for cattle and broiler chicken.
- The row-level table instead labels the chicken series **“Ayam Ras (Rp/Ekor Hidup)”** and gives January 2026 as Rp22,971 per live bird. That conflicts with the metadata's kg-live-weight description. Keep the source observation quarantined from a canonical price-per-kg registry until the original CSV/XLSX schema and source calculation are verified. Do not convert per bird to per kg without a documented average liveweight and a matching series.
- The table currently exposes observations through January 2026 despite the page title “Angka Januari 2026”; it must not be presented as an October 2026 current quote. For January 2026, visible producer series include GKP farmer Rp6,884/kg, dry paddy at mill Rp7,980/kg, medium rice at mill Rp13,012/kg, premium rice at mill Rp14,370/kg, dry shelled maize farmer Rp5,810/kg, dry soybean farmer Rp9,418/kg, shallot farmer Rp23,915/kg, curly red chili farmer Rp24,578/kg, large red chili farmer Rp21,445/kg, bird's-eye chili farmer Rp34,122/kg, live cattle Rp52,883/kg live weight, chicken Rp22,971/bird (unit conflict above), eggs Rp26,027/kg, and sugar Rp15,213/kg.
- Dataset method says national producer price is the average of commodity producer prices across provinces using selected representative respondents; it is not a farm invoice and does not establish farm cost/yield/profit. Metadata says the dataset was published 10 February 2026 and valid through 28 February 2026.
- Source: https://data.badanpangan.go.id/datasetpublications/3iw/rata-rata-harga-pangan-bulanan-produsen-nasional

This audit is an important ingestion gate: the raw row label takes precedence over an inconsistent generic unit description for interpretation, but the conflict itself remains unresolved pending the downloadable source file. No chicken price is normalized or inserted into the game registry from this observation.
