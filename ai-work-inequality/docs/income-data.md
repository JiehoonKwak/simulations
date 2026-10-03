# Korean physician remuneration data

Baseline sources retrieved 2026-10-02; methods and newer context checked
2026-10-03. The calibrated income year remains **2020**, published in 2022.
The simulation's 2026 starting year is not an observation year. The canonical
machine-readable extract is [income.json](../data/processed/income.json).
The separate 2023 context does not change role calibration or generate a
within-group distribution.

## Sources and acquisition

The primary table is NHIS's **1.의사 실태조사 통계.xlsx**, downloaded from the
[physician statistics release](https://www.nhis.or.kr/nhis/policy/wbhaea02600m02.do?mode=view&articleNo=10821112).
The [direct download](https://www.nhis.or.kr/nhis/policy/wbhaea02600m02.do?mode=download&articleNo=10821112&attachNo=332792)
is 678,226 bytes, SHA-256
`bc119065bb47b8aaa3b123675af4b21b00087e39ff5a309f4d6983b2812b6428`.
The workbook contains 34 sheets. It was first released on July 29, 2022.
The [August 30 correction notice](https://www.nhis.or.kr/nhis/policy/wbhaea02600m02.do?mode=view&articleNo=10823868)
announces an August 31 second release, correcting Sheet 6's age <=29 entries
outside Seoul. It does not announce a correction to the income sheets.

Definitions and rounded national means were independently checked against the
[MOHW July 7, 2022 release](https://www.mohw.go.kr/board.es?act=view&bid=0027&list_no=372084&mid=a10503010100)
and its [PDF attachment](https://www.mohw.go.kr/boardDownload.es?bid=0027&list_no=372084&seq=3).
The PDF is 1,189,724 bytes, SHA-256
`2dc69c667c476e3fe7f3f6a06e97c07d0fd92ab13c4b4b7c5c2bdcff910d5217`.
Physical PDF page 17 contains printed pages 33-34, which were both rendered and
visually inspected. The release identifies MOHW license records linked with NHIS
qualification/contribution records; these remuneration figures are administrative
statistics, not the separate online volunteer survey.

The [full first-survey report](https://www.mohw.go.kr/board.es?mid=a10411010200&bid=0019&act=view&list_no=373498),
posted by MOHW on 2022-11-02, was retrieved directly on 2026-10-03. This resolves
the initial unsuccessful KIHASA repository route. Its
[PDF](https://www.mohw.go.kr/boardDownload.es?bid=0019&list_no=373498&seq=1)
is 34,751,483 bytes, SHA-256
`b6c1403d50e6c9ae98c8458f3a378bb18bb82fb56365906bb1870b5605e68f76`.
Printed pp.318-319 (physical PDF pp.366-367) define the remuneration measure.
Tables 5-26 and 5-31, printed p.350 and pp.357-358 (PDF p.398 and pp.405-406),
provide the overall and role means with their eligibility notes.

Raw downloads, source landing pages, the correction notice, and SHA-256 manifest
are retained under `data/raw/income/`, which is ignored by Git. The canonical
extractor is [scripts/extract-income.py](../scripts/extract-income.py). Each
workbook value in the JSON records its source sheet and cell; the newer PDF value
records its page locator and manual verification method. No restricted microdata
were acquired.

### Reuse terms

The MOHW release landing page and PDF visibly carry **KOGL Type 1 (attribution)**.
Its [terms page](https://www.mohw.go.kr/menu.es?mid=a10103020100) is recorded in the
JSON. Attribution: Ministry of Health and Welfare, *보건의료인력 실태조사 결과 발표*,
July 7, 2022, using NHIS-linked administrative statistics.

The full report's landing page specifies **KOGL Type 4: attribution,
noncommercial, no derivatives** ([terms](https://www.mohw.go.kr/menu.es?mid=a10103020400)).
It remains an ignored local research input. The September 29, 2026 release and
its factsheet attachment are provided under **KOGL Type 1**, as marked on their
shared release page. Their titles, publisher, URLs, retrieval dates, and terms
are recorded in the JSON.

No file-specific KOGL marking was established for the NHIS workbook. Keep that
raw workbook local and do not redistribute it on the basis of public access.
The processed JSON is a small factual aggregate extract with attribution and
original methodological annotations, not a redistributed copy of the workbook.
A future public raw-data bundle needs a separate determination of its reuse terms.

## What income measures

The source measures settled **NHIS monthly remuneration, annualized by multiplying
by 12**. For full-time physicians, the reported working pattern is at least
40 hours per week. Interns and residents are excluded. Sheet 15's footnote says
public-health and military physicians are included. Region means refer to the
workplace on 2020 administrative boundaries.

The full report restricts both the overall mean (Table 5-26) and the role means
(Table 5-31) to **valid-remuneration recipients**. A valid-record selection
algorithm or remuneration-eligible role counts were not located in the report.

For proprietors, the source definition is business income of the relevant
workplace, excluding rental income. For employees, it is labor income of the
relevant workplace. Neither is provider billings or household disposable income.
The proprietor measure does not separately identify a clinical wage, return to
capital, retained profit, or cash withdrawal by the owner. A model splitting it
into labor and ownership components must identify that split as an assumption.

Printed p.319 of the full report defines gross remuneration to include
social-security contributions and employees' income tax, explicitly identifying
this as the same definition used in the preceding remuneration section. Employee
pay therefore includes those amounts. The report does not provide a complete
bridge from proprietor revenue through expenses to cash owner draws. Preserve
the label **administrative remuneration**; do not call it after-tax take-home pay
or owner dividends.
NHIS's current [reporting explanation](https://www.nhis.or.kr/nhis/minwon/wbhapa01000m01.do?articleNo=10946882&mode=view)
confirms that annual settlement uses reported remuneration and operating-period
income. It does not retrospectively identify every adjustment in the 2020 extract.

Both tails were winsorized: values beyond the first/99th percentile were replaced
by the corresponding cutoff. The retrieved notes do not specify the exact
population used to calculate those cutoffs. The means therefore do not recover
raw tails. Annualization also means a figure need not equal the actual calendar-year
cash earnings of a physician who worked for only part of that year.

## Matched role means

Sheet **15. 의료기관 근무의 임금(성별, 시도별, 직역별)** is titled
*성별, 시도별, 직역별 의료기관 근무의사(일반의/전문의) 연평균 임금(2010년-2020년)*.
Its unit is KRW. The 2020 block begins at CP4; CV5 denotes all generalists and
specialists (the workbook has a typographical `전제`). CV6, CW6, and CX6 are
proprietor, employee, and subtotal. Row 7 is the national total. B61:B63 contain
the full-time, resident-exclusion, and winsorization notes.

| Role | 2020 annualized mean, nominal KRW | Exact cell |
|---|---:|---|
| Proprietor / 개원의 | 294,282,306.4032603 | CV7 |
| Employee / 봉직의 | 185,390,558.43601876 | CW7 |
| All in this table | 230,699,494.09856516 | CX7 |

These values round exactly to the three means in MOHW's press release. The
proprietor/employee mean ratio is **1.5873640432**. The JSON also extracts the
17 region-level role means from the same columns, rows 10, 13, ..., 58. These
are marginal associations; they do not isolate a causal region effect.

### Reconstructed mixture weights

No income-eligible role counts are supplied in this table. An operational two-role
baseline can reproduce its national mean using

```text
p_owner = (mean_all - mean_employee) / (mean_owner - mean_employee)
        = 0.41609154512036045
p_employee = 0.5839084548796396
```

These are **reconstructed mixture weights**, not observed counts or national
workforce proportions. This calculation assumes the three cells are arithmetic
means for a common population partitioned exhaustively into the two roles. Their
shared table, headings, and footnotes support using this as a modeling assumption.
The source's underlying aggregation code and eligible counts were not retrieved,
so arithmetic reconstruction alone does not verify the assumption. In particular,
public-health/military doctors are classified as `other` in the all-worker counts,
while Sheet 15's income footnote includes them without a separate income column.

Use the means directly for role comparisons. If an aggregate income-pool model
needs weights, label these as inferred and vary them separately. The inference
must not turn into a national headcount claim.

Collapsing each role to its mean gives two-point Gini **0.1146784943**, calculated
as `p_owner * p_employee * abs(mean_owner - mean_employee) / mean_all`.
This is between-role dispersion. It is a lower bound for a nonnegative common
income population only under the mixture assumptions above. It is not a measured
all-physician Gini or a description of within-role inequality.

## Other margins and incompatibilities

Sheet 12 reports 99,492 provider-based workers: 35,907 proprietors, 62,785 employees,
and 800 others. Sheet 14 reports 96,839 full-time workers. These counts include
residents and therefore are **not** denominators for the remuneration means.
The counts are retained in a clearly separate JSON context block.

Sheet 17, *시도별, 의료기관 유형별 의료기관 근무의사(일반의/전문의) 연평균 임금(2020년)*,
provides institution-type means (E column). Its notes include the
restriction `유효보수 대상자에 한에 산출` (valid remuneration records only, B333).

| Institution | Annualized mean KRW, rounded | Cell |
|---|---:|---|
| All in Sheet 17 | 237,863,411 | E5 |
| Tertiary hospital | 152,780,791 | E6 |
| General hospital | 210,695,090 | E10 |
| Hospital | 327,538,277 | E13 |
| Long-term-care hospital | 201,600,218 | E17 |
| Clinic | 261,111,286 | E20 |
| Public-health institution | 79,002,319 | E21 |
| Other | 151,770,997 | E22 |

Sheet 17's national mean differs from Sheet 15 by about 3.1%. The full report
also applies valid-remuneration eligibility to the overall and role means, so
that restriction does not explain the discrepancy. This corrects the initial
interpretation based on the workbook's different footnote wording; the cause
remains unresolved. These values are reference margins, not additional
calibration constraints on the two-role population. No institution x
proprietor/employee remuneration cross-tab was found in this workbook.
Institution-type means must not be called employee-only salaries or used to
assign all proprietors to clinics.

Sheet 16 uses the OECD definition and explicitly **includes Korean-medicine
doctors**. Its values must not replace the medical-doctor-only Sheet 15 series.

## Newer evidence and 2026 use

The 2024 court-submission series of 2022 physician remuneration was identified
through [reporting about the government submission](https://www.hankyung.com/article/202405148020i).
Its original official table, complete methods, and file terms were not obtained
in the initial retrieval or the bounded official-source follow-up on 2026-10-03.
It remains excluded from calibration; the reported institution-type margins
cannot substitute for national proprietor/employee means.

MOHW published the [second-survey release on September 29, 2026](https://www.mohw.go.kr/board.es?mid=a10503010100&bid=0027&act=view&list_no=1492074).
This actual publication supersedes the October 2026 expectation recorded during
the initial retrieval. The [main PDF](https://www.mohw.go.kr/boardDownload.es?bid=0027&list_no=1492074&seq=2)
is 647,597 bytes, SHA-256
`54c95938718297bfaf78d4ec28827a1fdd10b351ff4c88faff62ac5e874e0dc3`.
Its p.10 specifies the NHIS monthly-remuneration basis, full-time work of at
least 40 hours/week, resident exclusion, and first/99th percentile replacement.

The [occupation factsheets](https://www.mohw.go.kr/boardDownload.es?bid=0027&list_no=1492074&seq=4)
give the **2023 all-physician mean of KRW 285,182,871** on physical PDF p.3,
printed p.1, section 4. The PDF is 810,821 bytes, SHA-256
`91f9cf70313530be93ff40e4b46bee340823b1aa16a438d9aa8c071dec7ba1ff`.
This value was manually transcribed and verified against the rendered page and
extracted text. It is retained in `newerContext`, separate from the runtime role
calibration and reconstructed weights; the extractor verifies its source hash
but does not automatically parse this PDF value.

Neither retrieved attachment supplies proprietor/employee means or
remuneration-eligible role counts. Workforce headcounts in the factsheet have a
different eligibility boundary. Matching headline exclusions and tail adjustment
do not establish identical role populations, valid-record selection, or percentile
reference pools. The release says detailed final results will be posted later
(p.11); its listed item 19 (p.14) is the relevant sex/region/role remuneration
table for 2013-2023. Detailed role data were not obtained as of 2026-10-03.

For 2026-2036 scenarios, using the observed 2020 relative role means requires an
explicit persistence assumption. No CPI adjustment or extrapolation is applied
here. A common monetary multiplier preserves the baseline income ratio, but
different role growth rates change it and must be varied. Prefer an indexed
2026 baseline until a documented pay/price update is chosen.

For missing within-role distributions, the smallest defensible analysis reports
role mean ratios, role income pools, and conditional between-role dispersion.
Quantiles, tail shares, and an all-physician Gini remain unidentified. Means alone
do not justify assigning synthetic lognormal incomes. If such distributions are
later needed, label their family, spread, and correlation with AI exposure as
scenario assumptions; report sensitivity across them without calling the range
an empirical confidence interval.

## Reproduction and checks

Download all five sources from the exact URLs above to these paths under
`data/raw/income/`:

- `nhis-physician-statistics.xlsx`
- `mohw-20220707-release.pdf`
- `mohw-2021-full-report.pdf`
- `mohw-20260929-release.pdf`
- `mohw-20260929-occupation-factsheets.pdf`

Keep the raw sources out of Git. From the `ai-work-inequality` project root, run:

```sh
uv run python scripts/extract-income.py
```

The script locates inputs and output relative to its own project directory,
checks all five source SHA-256 hashes before extraction, and exits with download URLs
when inputs are missing. A source revision fails the hash check and requires
inspection before accepting a new hash. It does not download or update sources.
`openpyxl` loads the stored numeric values; no Excel recalculation or rounding is
applied. The recorded retrieval date stays fixed to the source acquisition.

The extractor checks row/column labels, copies all numerical cells named in the
JSON, reconstructs the role mixture, verifies the all-worker role-count sum, and
compares rounded income means with the MOHW release. No missing values are
converted to zeros. No institution weighting, inflation adjustment, or synthetic
person-level allocation occurs in extraction.

The project-root `uv run` command was verified with Python 3.13.5 and openpyxl
3.1.5. The October 3 methods/context correction preserves every original 2020
numeric anchor, role ratio, reconstructed weight, and between-role dispersion
value. Repeated extraction produces identical output bytes, with JSON SHA-256
`a4f5f5635f486b2bf53b049d206aa25ba7f33aad08e0c0480d19a8e232123e94`.
Missing inputs and an altered copy of each source were separately verified to
stop before writing output, including when an earlier output exists. Running
from a different working directory also produces the same output bytes.
