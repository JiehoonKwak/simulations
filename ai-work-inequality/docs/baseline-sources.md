# Empirical source map

Acquired 2026-10-02–03; integrated in the current v0.2 model. Publication year,
observation year and the 2026 scenario origin remain distinct.

| Source                                                                                                                                             | Verified input                                                                                           | Runtime use                                                                                             | Boundary                                                                                                                                                |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [NHIS 2022 physician tables](https://www.nhis.or.kr/nhis/policy/wbhaea02600m02.do?mode=view&articleNo=10821112), Sheet 15 CV7/CW7/CX7              | 2020 adjusted annualized remuneration: proprietor KRW294.282m, employee KRW185.391m, overall KRW230.699m | Two role mean anchors; the mixture weight is algebraically reconstructed                                | Full-time, residents excluded, 1st/99th percentile winsorization. Eligible role counts and aggregation code are unavailable.                            |
| [MOHW 2022 workforce survey release](https://www.mohw.go.kr/board.es?act=view&bid=0027&list_no=372084&mid=a10503010100), printed pp.33–34          | Definitions and independently matching rounded national role means                                       | Source/definition cross-check                                                                           | Administrative remuneration is neither hospital revenue nor after-tax household income; proprietors' clinical and capital components are not separable. |
| [NHIS/HIRA 2024 yearbook](https://www.nhis.or.kr/nhis/together/wbhaec06300m01.do?mode=view&articleNo=11007426), provider Tables I-9/I-10/I-13/I-15 | Institution counts, establishment forms, physicians by qualification and type/region                     | Separate 2024 context in the artifact                                                                   | No physician region × institution × employment-role joint table. Never use institution counts as owner-physician counts.                                |
| Same yearbook, Table III-4                                                                                                                         | Inpatient and outpatient visit-days, reimbursed days, expenditure and insurer payment by type            | Downloaded reference data for care/payment scope checks                                                 | Care dimensions stay separate; they are not combined into national complete-care episodes or physician earnings.                                        |
| [NHIS/HIRA 2023 yearbook](https://www.nhis.or.kr/nhis/together/wbhaec06300m01.do?mode=view&articleNo=10847858)                                     | Comparable workforce and institution margins                                                             | Historical context and reconciliation                                                                   | The large 2024 training-category change prevents a routine growth extrapolation; it is not an AI effect.                                                |
| Primary clinical AI research in [evidence.md](evidence.md)                                                                                         | Documentation, reasoning, consultation and specific procedure results with units/design                  | Four net task-time channels, negative/null scenarios, bottlenecks, separate trial-transport sensitivity | No estimate identifies Korean 2036 adoption, staffing, earnings capture or licensing.                                                                   |

## Canonical extraction and provenance

The follow-up acquired the [complete 2022 MOHW report](https://www.mohw.go.kr/board.es?mid=a10411010200&bid=0019&act=view&list_no=373498)
and the [September 29, 2026 second-survey release and factsheet](https://www.mohw.go.kr/board.es?mid=a10503010100&bid=0027&act=view&list_no=1492074).
The full report confirms that overall and role means both require valid
remuneration, and employee remuneration includes tax/social contributions. The
earlier hypothesis that this footnote explained the separate-table 3.1% mismatch
was unsupported; the discrepancy remains unresolved. Calibration values did not
change. The new factsheet reports a 2023 overall mean of KRW 285,182,871, but no
retrieved matched role means or valid-remuneration counts. It is stored as newer
context, with document/page locators and hashes, without inferring new role anchors.

The evidence ledger now includes 12 studies. Two Korean ED AI reports share a
site/system lineage; narrow drafting-time benefits do not calibrate total work
or visit gains. Korean consultation-time and Saturday-fee studies clarify why
task shares, total demand and remuneration response remain unidentified.

- `data/processed/income.json` and [income-data.md](income-data.md) retain source
  sheet/cell locators, downloaded-file SHA-256 hashes, definitions, same-table
  reconstruction and the reason institution/role margins were not merged.
- `data/processed/workforce.json` and [workforce-data.md](workforce-data.md) retain
  exact workbook cells, PDF pages, file hashes, totals and category definitions.
- `data/processed/ai-evidence.json` records primary URLs/DOIs, effects, units,
  retrieval depth and model applicability.
- `scripts/extract-income.py` and `scripts/extract-workforce.py` regenerate the
  tables after original-file hash checks. `scripts/build-baseline.mjs` creates
  `web/baseline.mjs` and embeds hashes of every processed input.

The official NHIS 2024 files were retrieved and checked. The separately announced
HIRA corrigendum was not obtained, so its applicability is unverified and the
retrieved edition is explicitly pinned. This does not silently promote the
workforce snapshot into a current 2026 census.

## Reuse

Raw originals remain in ignored `data/raw/`, with exact acquisition URLs and
hashes. The MOHW press releases have KOGL Type 1 attribution terms; the complete
2022 report is marked Type 4. The HIRA 2024 release
has a verified Type 1 marking on its alternative publication page. No
file-specific marking was established for the NHIS income workbook, so it remains
a local research input. The repository contains limited factual extracts and
original methodological annotations, not a redistribution of the full workbook.

[The method](model-method.md) owns the equations and the limits of calibration.
Future demand, real payment changes, net task effects, deployment, other capacity,
retention and earnings participation remain assumptions exposed to sensitivity.
