# Owner 60-Commodity Inventory ↔ Runtime Catalogue Crosswalk

Status: **initial audit map only** — not a canonical ID migration and not approval to change runtime values. Source inventory: `Agrotycoon file blueprint/harga komoditi.docx`, “Tabel Final 50 Komoditi” plus “Tabel Final 60 Komoditi” extension. Runtime inventory: `js/commodities.js` `COMMODITIES` array on `feat/production-tier-taxonomy`.

## Mapping rules

- “Candidate mapping” means a similar label exists; it does **not** prove the unit, variety, product form, cycle, yield or price basis matches.
- “Generic collision” means one runtime ID is being used for multiple owner items. Do not treat these as distinct modeled commodities.
- “Missing” means no dedicated runtime ID exists for the owner item.
- Runtime parameters remain game-balancing assumptions until source-backed and reconciled. Do not overwrite the owner-locked coconut/es-kelapa benchmark.
- Do not rename or replace IDs until local-save compatibility and migration are designed and tested.

## Owner inventory rows

| Owner # | Owner commodity / node | Runtime ID candidate | Mapping status | Required reconciliation |
|---:|---|---|---|---|
| 1 | Kelapa Super | `kelapa` | Generic collision | Separate super grade/yield/cycle/market-stage model from ordinary coconut; preserve owner benchmark separately |
| 2 | Kelapa Biasa | `kelapa` | Generic collision | Separate from Kelapa Super; current runtime item is generic |
| 3 | Padi | `padi` | Candidate match | Reconcile GKP vs milled rice, yield basis, cycle and cost unit |
| 4 | Jagung | `jagung` | Candidate match | Runtime says dry shelled maize; owner chain also contains sweet corn/corn-on-cob scenarios |
| 5 | Cabai Rawit | `cabai_rawit` | Candidate match | Reconcile cultivar, unit and local cost/yield basis |
| 6 | Bawang Merah | `bawang_merah` | Candidate match | Reconcile seed bulbs, harvest/cure stage and cycle |
| 7 | Kentang | `kentang` | Candidate match | Reconcile variety/grade and regional price/cost scope |
| 8 | Tomat | `tomat` | Candidate match | Reconcile yield/area, season and spoilage |
| 9 | Ketela Rambat | `ubi_jalar` | Candidate match | Confirm same crop and unit |
| 10 | Singkong | `ubi_kayu` | Candidate match | Distinguish food vs industrial/starch type |
| 11 | Pisang | `pisang` | Generic collision | Owner's generic banana is not automatically Cavendish |
| 12 | Mangga | `mangga` | Candidate match | Cultivar, orchard age and bearing cycle required |
| 13 | Kedelai | `kedelai` | Candidate match | Reconcile moisture/grade and seed system |
| 14 | Pepaya | `pepaya` | Candidate match | Reconcile variety, plant lifespan and repeated harvest |
| 15 | Kacang Tanah | `kacang_tanah` | Candidate match | In-shell vs shelled unit must be explicit |
| 16 | Kubis/Kol | `kubis` | Candidate match | Confirm market grade and regional production system |
| 17 | Wortel | `wortel` | Candidate match | Reconcile altitude, grade and post-harvest loss |
| 18 | Buncis | — | Missing | Runtime `kacang_panjang` is long bean, not a safe alias for green beans |
| 19 | Timun | `mentimun` | Candidate match | Confirm same commodity/unit |
| 20 | Jambu Biji | — | Missing | No guava ID in runtime catalogue |
| 21 | Bawang Putih | `bawang_putih` | Candidate match | Local vs imported origin must be separated |
| 22 | Porang | — | Missing | Add only after corm/seed, cycle, yield, price and processing evidence are reconciled |
| 23 | Jahe Merah | `jahe` | Generic collision | Runtime ginger is not proven to be red ginger |
| 24 | Pisang Cavendish | `pisang` | Generic collision | Export-grade Cavendish needs its own cultivar/grade/contract model |
| 25 | Ayam Petelur | `ayam_petelur` | Candidate match | Egg production, layer age, feed and spent-hen outputs are separate |
| 26 | Ayam Pedaging | `ayam_pedaging` | Candidate match | Reconcile DOC, FCR, mortality, live weight and slaughter yield |
| 27 | Sapi Potong | `sapi_potong` | Candidate match | Breeding vs fattening model and liveweight basis required |
| 28 | Sapi Perah | `sapi_perah` | Candidate match | Milk yield/lactation and herd replacement costs required |
| 29 | Kambing | `kambing` | Candidate match | Meat vs breeding model and liveweight basis required |
| 30 | Lele | `lele` | Candidate match | Pond/biofloc system, density, FCR and harvest grade must be specified |
| 31 | Udang | `udang_vaname` | Candidate match | Owner item must be confirmed as vannamei; other shrimp species are not equivalent |
| 32 | Nila | `nila` | Candidate match | Pond vs cage system must remain distinct |
| 33 | Telur Bebek | `bebek` | Product-form mismatch | Runtime bebek is a live animal; owner item is duck eggs, requiring a laying/egg output model |
| 34 | Ikan Tuna | — | Missing | Wild-catch vessel/landing economics need separate model |
| 35 | Ikan Bandeng | — | Missing | Brackish pond cycle and harvest grade need separate model |
| 36 | Ayam Kampung (Daging) | — | Missing | Runtime broiler/layer IDs do not represent village chicken |
| 37 | Kopi Robusta | `kopi` | Generic collision | Runtime coffee does not distinguish robusta |
| 38 | Kopi Arabika | `kopi` | Generic collision | Runtime coffee does not distinguish arabica |
| 39 | Kakao | `kakao` | Candidate match | Wet/dry/fermented bean forms must be explicit |
| 40 | Sawit (TBS) | `kelapa_sawit` | Candidate match | FFB/TBS is an input stage; do not confuse with crude palm oil |
| 41 | Cengkeh | — | Missing | No dedicated clove ID |
| 42 | Pala (Biji) | — | Missing | Nut vs mace and fresh/dry forms need separate nodes |
| 43 | Vanili Kering | `vanili` | Product-form mismatch | Runtime vanilla is not explicitly cured dry vanilla; cure recovery/time needed |
| 44 | Tebu | `tebu` | Candidate match | Cane and refined sugar are different nodes |
| 45 | Teh Pucuk Basah | `teh` | Product-form mismatch | Runtime tea is not explicitly fresh green leaf; factory acceptance/yield needed |
| 46 | Lada Putih | `lada` | Generic collision | Runtime pepper does not distinguish white pepper |
| 47 | Lada Hitam | `lada` | Generic collision | Runtime pepper does not distinguish black pepper |
| 48 | Karet (Lateks) | `karet` | Product-form mismatch | Latex, wet slab and dry rubber are different forms |
| 49 | Cokelat Olahan | — | Missing | Downstream manufactured product, not a Tier 1 farm commodity |
| 50 | Gula Aren (Cair) | — | Missing | Sap/tapping and liquid sugar concentration need their own chain |
| 51 | Bijih Besi | — | Missing | Mine-gate ore grade, wet/dry tonnage and recovery required |
| 52 | Batu Bara | — | Missing | Quality-indexed mine-gate benchmark and realized netback required |
| 53 | Emas | — | Missing | Ore, doré and refined bullion are distinct nodes |
| 54 | Nikel | — | Missing | Laterite grade, moisture and ore price formula required |
| 55 | Bauksit | — | Missing | Ore grade, alumina/silica and washing recovery required |
| 56 | Gas Alam Cair (LNG) | — | Missing | Upstream gas, liquefaction and LNG export are separate nodes |
| 57 | Minyak Mentah | — | Missing | Wellhead netback must be separated from ICP benchmark |
| 58 | Plastik (Bahan Baku) | — | Missing | Define resin type and plant-gate product form |
| 59 | Semen | — | Missing | Manufactured product; clinker/gypsum/energy/freight required |
| 60 | Tembaga | — | Missing | Ore/concentrate/cathode are separate nodes; mine-gate costs needed |

## Runtime-only entries that do not map 1:1 to owner inventory

The runtime catalogue contains additional or more granular IDs that are not distinct owner rows in the 60-item blueprint: `cabai_merah`, `kacang_hijau`, `kacang_panjang`, `terong`, `bayam`, `kangkung`, `sawi`, `kunyit`, `lengkuas`, `serai`, `durian`, `alpukat`, `jeruk`, `nanas`, `semangka`, `melon`, `stroberi`, `kapas`, `tembakau`, `bebek` (live animal, not egg product), `domba`, `gurami`, `patin`, `madu`, and `jamur_tiram`. These may be useful future additions, but they must not silently displace an owner-listed item.

## Crosswalk acceptance gates

1. Owner row has one canonical node ID (or explicit multi-node chain) and a stable display name.
2. Runtime IDs are mapped as exact match, product-form variant, generic collision, or missing.
3. Each ID has units and stage-specific meaning; no alias may combine distinct cultivars, product forms or production systems.
4. Existing local saves are inventoried; migrations preserve old stock, plots, inventory, price and ledger references.
5. Research ledger links each owner row to evidence status and source records.
6. Only after migration tests pass may catalogue additions/renames enter runtime. No commodity price/yield/cost/margin is promoted from blueprint-only values.
