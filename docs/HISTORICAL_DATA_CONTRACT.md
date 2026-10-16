# Data import contract for Agrotycoon
Format target: CSV/JSON normalized into long-form records.

Required observation fields:
- observation_id (stable ID)
- source_id
- source_url
- dataset_title
- observed_at (ISO date or period; never infer an exact date from a monthly observation)
- geography_level (national/province/regency/city/market)
- geography_code
- geography_name
- commodity_id or indicator_id
- market_level (producer/wholesale/retail/other/unknown)
- value
- unit
- frequency (daily/weekly/monthly/annual/event)
- retrieved_at
- source_row_id (when available)
- quality_status (verified/needs_review/rejected)
- notes

Rules:
- Preserve original source files and source column names.
- Convert currencies/units only into additional normalized fields; do not overwrite source values.
- Do not merge producer and consumer prices into a single series.
- Do not mix per-head, per-kg liveweight, per-kg carcass, per-bunch, and per-liter measures.
- Deduplicate using source_id + source_row_id, or an explicit documented natural key.
- Report count of rows received, valid, rejected, duplicate, and missing values.
- Every synthetic/scenario row belongs to a separate simulation output table and has a run_id; it must never be stored as raw observation.
