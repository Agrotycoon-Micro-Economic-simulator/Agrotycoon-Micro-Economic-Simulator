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
