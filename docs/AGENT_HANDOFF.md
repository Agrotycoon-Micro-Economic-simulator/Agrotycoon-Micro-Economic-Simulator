

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
