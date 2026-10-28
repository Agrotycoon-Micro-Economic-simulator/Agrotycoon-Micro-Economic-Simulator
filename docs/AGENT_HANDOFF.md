

## Latest maize validation and source metadata correction (2026-10-28 15:47 UTC)

- GitHub Actions run **40719342746** passed on test commit `05220f710fa645f43b04dcb2334747ee049060b0`: https://github.com/Agrotycoon-Micro-Economic-simulator/Agrotycoon-Micro-Economic-Simulator/actions/runs/40719342746. It includes assertions for official maize balance projection values, one-tonne source arithmetic discrepancies, and the corrected feed-industry source metadata.
- The feed-industry source is now titled *Pemanfaatan Jagung Lokal oleh Industri Pakan Tahun 2024*, Vol. 6 Tahun 2025, reference data year 2024, with a 2025 projection in Table 26. The alternative ~8.25 Mt value in the Pusdatin bulletin is a different industry purchase/absorption projection series; keep the method/vintage difference explicit rather than treating these as same-method observations.
- Latest docs include the exact balance table, source arithmetic audit, BPS production moisture-basis values, and Library DOCX caveats. Current branch head should be verified from the API before the next coding session; latest code/test SHA is `05220f710fa645f43b04dcb2334747ee049060b0`, and subsequent commits are documentation-only.
