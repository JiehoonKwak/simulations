# Korean physician remuneration data

Retrieved 2026-10-02. The observed income year is **2020**, published in 2022.
The simulation's 2026 starting year is not an observation year. The canonical
machine-readable extract is [income.json](../data/processed/income.json).
No within-group distribution has been generated.

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

Raw downloads, source landing pages, the correction notice, and SHA-256 manifest
are retained under `data/raw/income/`, which is ignored by Git. The canonical
extractor is [scripts/extract-income.py](../scripts/extract-income.py). The JSON
records the exact source sheet and cell for every observed numerical value.
No restricted microdata were acquired.

### Reuse terms

The MOHW release landing page and PDF visibly carry **KOGL Type 1 (attribution)**.
Its [terms page](https://www.mohw.go.kr/menu.es?mid=a10103020100) is recorded in the
JSON. Attribution: Ministry of Health and Welfare, *보건의료인력 실태조사 결과 발표*,
July 7, 2022, using NHIS-linked administrative statistics.

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

For proprietors, the source definition is business income of the relevant
workplace, excluding rental income. For employees, it is labor income of the
relevant workplace. Neither is provider billings or household disposable income.
The proprietor measure does not separately identify a clinical wage, return to
capital, retained profit, or cash withdrawal by the owner. A model splitting it
into labor and ownership components must identify that split as an assumption.

The excerpt does not provide a complete reconciliation from revenue through
expenses and personal taxation. Preserve the label **administrative remuneration**;
do not call it exact taxable income, after-tax take-home pay, or owner dividends.
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
provides institution-type means (E column). Its notes include the additional
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

Sheet 17's national mean differs from Sheet 15 by about 3.1%. The added footnote
is a possible contributor; the exact cause is unresolved. These values are
reference margins, not additional calibration constraints on the two-role
population. No institution x proprietor/employee remuneration cross-tab was
found in this workbook. Institution-type means must not be called employee-only
salaries or used to assign all proprietors to clinics.

Sheet 16 uses the OECD definition and explicitly **includes Korean-medicine
doctors**. Its values must not replace the medical-doctor-only Sheet 15 series.

## Newer evidence and 2026 use

The 2024 court-submission series of 2022 physician remuneration was identified
through [reporting about the government submission](https://www.hankyung.com/article/202405148020i).
Its original official table, complete methods, and file terms were not obtained
in this retrieval. It is excluded from the input values. MOHW's live
[approved-statistics page](https://www.mohw.go.kr/statView.es?mid=a10406010100&stts_data_seq=211)
listed the next health-workforce survey publication for October 2026 when checked.
This does not establish that no newer income statistic exists elsewhere.
The KIHASA catalog initially supplied for the task is a summary-report catalog;
the full-report catalog links to a repository page that returned a JavaScript
access page, so it was not counted as a retrieved full report.

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

Download both source files from the exact URLs above to
`data/raw/income/nhis-physician-statistics.xlsx` and
`data/raw/income/mohw-20220707-release.pdf`. Keep these raw sources out of Git.
From the `ai-work-inequality` project root, run:

```sh
uv run python scripts/extract-income.py
```

The script locates inputs and output relative to its own project directory,
checks both source SHA-256 hashes before extraction, and exits with download URLs
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
3.1.5; a separate Python 3.12.14 run produced the same result. The regenerated
JSON was byte-identical to the original extract, with SHA-256
`66649a04842a9b82f7cf179b456634f6329799e65f5caa5934ef4fdd8fb5f30e`.
Missing inputs and an altered copy of each source were separately verified to
stop before writing output. Running from a different working directory also
preserved the same output bytes.
