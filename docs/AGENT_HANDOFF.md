

## Latest maize validation and source metadata correction (2026-10-28 15:47 UTC)

- GitHub Actions run **40719342746** passed on test commit `05220f710fa645f43b04dcb2334747ee049060b0`: https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40719342746. It includes assertions for official maize balance projection values, one-tonne source arithmetic discrepancies, and the corrected feed-industry source metadata.
- The feed-industry source is now titled *Pemanfaatan Jagung Lokal oleh Industri Pakan Tahun 2024*, Vol. 6 Tahun 2025, reference data year 2024, with a 2025 projection in Table 26. The alternative ~8.25 Mt value in the Pusdatin bulletin is a different industry purchase/absorption projection series; keep the method/vintage difference explicit rather than treating these as same-method observations.
- Latest docs include the exact balance table, source arithmetic audit, BPS production moisture-basis values, and Library DOCX caveats. Current branch head should be verified from the API before the next coding session; latest code/test SHA is `05220f710fa645f43b04dcb2334747ee049060b0`, and subsequent commits are documentation-only.


## Last-100-commit audit and current branch checkpoint (2026-10-28 15:48 UTC)

- Reviewed exactly the latest **100 commits** on `feat/production-tier-taxonomy`, newest `51b6a66a60baca06f1f2df3afdd0ceaf0505a8a6` and oldest `ffdf1db65b47aed048d97fa917ce15891c166e47` (2026-10-28 14:52–15:53 UTC). The history is heavily concentrated on national-data/provenance additions, documentation/audit updates, tests/CI, accounting/HPP, and market/NPC/region capacity; no map/peta-related commit appears in this 100-commit window.
- Current branch HEAD: `51b6a66a60baca06f1f2df3afdd0ceaf0505a8a6`. Latest code/test validation: run **40719342746**, success on `05220f710fa645f43b04dcb2334747ee049060b0`. Subsequent commits are documentation-only.
- The latest 100-commit window shows that some commits are very small follow-ups to fix test harnesses, record provenance, or reconcile a source; use the current runtime/test files and latest handoff rather than assuming every individual commit independently completes a feature.
- The current default branch HEAD is `fc2f908b309b9864e8b24737f3b5f848f32d1392` (revert accidental default-branch market-engine change). No changes were made to `main` during this session. Continue only on the feature branch and keep map files untouched.
- Open evidence gates: reconcile the two feed-industry projection series (~8.25 Mt in Kementan Pusdatin vs 8,844,096 t from Ditjen PKH/SiJagung/Table 26); verify BPS maize moisture-conversion methodology; continue the unresolved BPS SEP 2024 UTP broiler Table 2.10 and UTL oil-palm Table 4.2 source arithmetic issue; extract exact remaining UPB/UTL rows. No Tier 1–4 economic model was promoted from rough Library scenarios.


## Latest maize balance/source-metadata test verified (2026-10-28)

- GitHub Actions run [40719342746](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40719342746) passed on test commit `05220f710fa645f43b04dcb2334747ee049060b0`. It includes the three Node test-runner suites (13/13), the standalone Node/browser regression commands, maize production source metadata, the official Table 5.6 projected balance fields, and the 1-tonne arithmetic discrepancy assertions.
- Runtime source metadata now correctly names the feed-industry projection source *Pemanfaatan Jagung Lokal oleh Industri Pakan Tahun 2024* (Direktorat Pakan Ditjen PKH, Vol. 6 Tahun 2025; data/reference year 2024), not the shorthand title “Buku Jagung 2025.” Its Table 26 2025 projection is 8,844,096 t from SiJagung. The separate ~8.25 Mt figure in the Pusdatin bulletin is from the industry purchase/absorption projection series. Keep the two as distinct methodology/vintage projections; status remains unresolved until comparable definitions are confirmed.
- The official Bapanas/Kementan 2025 balance projection is now stored separately from the final BPS 2025 production observation. Published projected ending balance is 5,133,909 t; the table has three 1-tonne arithmetic differences preserved in `arithmeticAudit`. `maizeNationalBalanceEstimate2025` remains null because no final realized balance is claimed.
- Research next: resolve or formally retain the feed-industry projection conflict, then continue the queued UTP broiler Table 2.10 visual reconciliation, UTL oil-palm income definition, and remaining UPB/UTL table extraction. The BPS livestock publication page is discoverable but currently returns 403 on direct page open; do not claim Table 2.10 visually verified until the original PDF or a verifiable mirror is actually inspected.


## Maize feed-projection arithmetic discrepancy added (2026-10-28)

- Found an additional source-internal arithmetic mismatch in Ditjen PKH Direktorat Pakan's *Pemanfaatan Jagung Lokal oleh Industri Pakan Tahun 2024* (Vol. 6, 2025), Table 26: quarterly projections sum to 8,844,096 t, but the prose monthly average says 727.01 thousand t. The annual total / 12 is 737,008 t/month, a 9,998 t/month gap. Runtime `maizeNationalDemand.sources.feedIndustryDemand2025.sourceArithmeticAudit` preserves both source prose and derived average; tests assert the discrepancy.
- Source title and source scope are now exact in runtime and documented in register/audit/plan. The 8.25 Mt versus 8.844096 Mt industry-only projection conflict remains unresolved due different source series/methodology; do not sum the figures or substitute either for all-channel feed demand.
- New code commit `a807fc5cae0eb9103662f63f46b7d2759d2aaa10` and regression commit `87ce13e51b7bf147ccc13f18aa6154107311b010` are verified by GitHub Actions run [40720183267](https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40720183267): success, 13/13 Node subtests and the standalone/browser regression commands green. The monthly-average audit assertions passed.
