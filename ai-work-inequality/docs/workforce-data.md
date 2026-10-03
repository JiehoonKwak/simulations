# Korean provider and workforce data

Retrieved and checked on 2026-10-02. The machine-readable extract is
[workforce.json](../data/processed/workforce.json). It contains selected observed
2023 and 2024 aggregates from the joint NHIS/HIRA *National Health Insurance
Statistical Yearbook* (national statistics approval 920006). It does not update
them to the simulation's 2026 starting year.

## Acquired sources and provenance

The [NHIS 2024 post](https://www.nhis.or.kr/nhis/together/wbhaec06300m01.do?mode=view&articleNo=11007426)
was posted on 2025-11-28; the book's imprint says November 2025. The
[2023 post](https://www.nhis.or.kr/nhis/together/wbhaec06300m01.do?mode=view&articleNo=10847858)
was posted on 2024-11-29; its publication month is November 2024.

| File acquired directly from NHIS | Observation period | Download |
| --- | --- | --- |
| 2024 full PDF (936 PDF pages) | 2024, with historical tables | [Attachment 365191](https://www.nhis.or.kr/nhis/together/wbhaec06300m01.do?mode=download&articleNo=11007426&attachNo=365191) |
| 2024 original table archive | 2024, with historical tables | [Attachment 365189](https://www.nhis.or.kr/nhis/together/wbhaec06300m01.do?mode=download&articleNo=11007426&attachNo=365189) |
| 2023 full PDF (942 PDF pages) | 2023, with historical tables | [Attachment 364636](https://www.nhis.or.kr/nhis/together/wbhaec06300m01.do?mode=download&articleNo=10847858&attachNo=364636) |
| 2023 original table archive | 2023, with historical tables | [Attachment 364634](https://www.nhis.or.kr/nhis/together/wbhaec06300m01.do?mode=download&articleNo=10847858&attachNo=364634) |

Raw files, extracted workbooks, source landing pages, PDF text and table previews
are local under `data/raw/workforce/`, which the repository ignores. Every source
file used in the JSON has its download URL, byte length and SHA-256 in `sources`.
Extracted workbook records also identify the exact original archive member;
Korean ZIP filenames were decoded from CP949. The 2024 PDF SHA-256 is
`adf65c36b2f3bdc8dabab0e9b9c49ed339d156c1824b0b6e8f127eda4edc3b52`.
A separately downloaded [SMHDB mirror](https://seoulmentalhealth.kr/library/paper-collections/2100?view=gallery)
had exactly the same hash. Numerical extraction uses the NHIS workbooks.

The [HIRA yearbook post](https://www.hira.or.kr/bbsDummy.do?brdBltNo=2322&brdScnBltNo=4&pgmid=HIRAA020045020000)
is dated 2026-01-13 and lists a corrigendum, table archive and corrected PDF.
The post was acquired, but repeated timeouts retrieving its download helper
prevented acquisition of those attachments in this run. Therefore these data
are verified against NHIS's currently served files, not independently checked
against HIRA's corrigendum. The JSON preserves this revision status explicitly.

## What is observed

| Dataset | Exact table and workbook locator | Supported dimensions |
| --- | --- | --- |
| Institution counts | I-9; `hira-providers-{year}.xlsx`, sheet `Ⅰ-9`, national row 29 (2023) or 30 (2024), columns B:R | National institution type and the joint province × institution type table, year-end 2023/2024 |
| Physicians by institution | I-13; same workbook, sheet `Ⅰ-13`, D7:H7 and D9:H24 | Institution type × qualification: general practitioner, intern, resident, specialist |
| Physicians by region | I-15; same workbook, sheet `Ⅰ-15`, C7:G24 | Province × qualification |
| Institution establishment form | I-10; 2024 provider workbook, sheet `Ⅰ-10`, C6:R6 and C8:R23 | Institution type × legal establishment form |
| Covered care | III-4; `nhis-care-2024.xlsx`, sheet `3-4`, columns D:H | Institution type × inpatient/outpatient, patients, visit-days, reimbursed days, covered expenses and insurer benefits |

Every JSON record contains its own sheet/cell range and PDF page locator.
Printed pages 40–41, 42–43, 48 and 56 contain the provider tables in both books.
Add 82 to a 2024 printed page or 80 to a 2023 printed page to locate the PDF page
(one-based). The 2024 care table is printed pages 144–145, PDF pages 226–227.
The explanatory entries for I-13, I-15 and III-4 are 2024 printed pages 754, 756
and 784 (PDF pages 836, 838 and 866).

### National comparisons

| Institution type | Institutions 2023 | Institutions 2024 | Physicians 2023 | Physicians 2024 |
| --- | ---: | ---: | ---: | ---: |
| Tertiary hospital (상급종합병원) | 45 | 47 | 23,346 | 15,232 |
| General hospital (종합병원) | 331 | 331 | 22,401 | 19,773 |
| Hospital (병원) | 1,403 | 1,412 | 10,541 | 11,256 |
| Long-term care hospital (요양병원) | 1,392 | 1,342 | 4,834 | 4,984 |
| Mental health hospital (정신병원) | 257 | 263 | 1,167 | 1,195 |
| Clinic (의원) | 35,717 | 36,685 | 50,285 | 54,989 |
| Other provider types combined | 62,617 | 63,228 | 2,125 | 1,845 |
| All provider types | 101,762 | 103,308 | 114,699 | 109,274 |

The all-provider institution total includes dental institutions, Korean medicine
institutions, community health agencies, midwifery clinics and pharmacies; it is
not an all-physician-practice denominator. The physician column always selects
`의사`; dentists and Korean medicine physicians are excluded. The other-provider
row is a derived subtraction from national totals; the JSON retains each
original type separately.

These are year-end NHI provider reports under an exclusive-contract (`전속`)
criterion. They are persons, not clinical FTE, a count of licenses or a complete
count of everyone working with a physician license. The general provider note
(2024 printed page 39) explicitly distinguishes this registration series from
counts under the Medical Service Act and Pharmaceutical Affairs Act.

The qualification changes matter for choosing a model baseline. National
interns plus residents fall from **13,018 to 1,225**, while specialists increase
from **95,640 to 97,365** and general practitioners from **6,041 to 10,684**.
A simple extrapolation of the total or hospital decline would treat a large
change in reported training status as a persistent supply trend. These two
cross-sections do not identify individual transitions or their causes.

### Care-volume examples for 2024

| Institution type | Outpatient visit-days | Inpatient days |
| --- | ---: | ---: |
| Tertiary hospital | 41,849,514 | 12,579,157 |
| General hospital | 68,416,159 | 27,371,278 |
| Hospital | 60,557,941 | 24,567,325 |
| Long-term care hospital | 2,489,228 | 52,911,295 |
| Mental health hospital | 1,627,765 | 6,025,539 |
| Clinic | 584,260,374 | 5,611,524 |

NHIS III-4 uses service-date 2024 care with payments from January 2024 through
April 2025 included. It covers NHI benefit users. `입내원일수` measures visit-days
or inpatient days, while `요양급여일수` additionally includes medication days.
Neither is a count of completed episodes. Unique patients overlap across
provider types and inpatient/outpatient settings and must not be added across
those groups. Pharmacy prescription visits are excluded from the national
visit-day total; pharmacy records are not included in this extract.

Covered expenses combine insurer payments and statutory patient cost-sharing.
They exclude the non-covered revenue needed to characterize many practices.
They are not physician earnings, net provider income or a treatment-capacity
measure. The workbook preserves fractions of KRW 1,000 while the PDF rounds;
the JSON stores monetary values as decimal strings in the workbook's original
unit to avoid concealing this difference. No monetary value here calibrates
personal earnings.

## Safe model uses and unresolved dimensions

- Institution-specific physician weights can be based on the observed physician
  margin. Hospital legal categories should remain explicit when merged; a
  hospital count is not a physician count.
- Region × institution weights are observed for **institutions**, not for
  physicians. Region physician margins cannot be multiplied by institution
  physician margins and described as an observed joint distribution.
- The legal-establishment table shows 36,006 individual-established clinics out
  of 36,685 in 2024, but does not count proprietor physicians. It does not imply
  one owner per clinic or that all clinic physicians are owners. Likewise,
  74 general hospitals and 1,065 hospitals are individual-established, while
  none of the 47 tertiary hospitals is. These facts do not allocate profits
  to employed physicians.
- Qualification, sex and specialty tables are available, but this extract does
  not identify personal experience, physician productivity, individual skill,
  owner/employee income or income tails. No 2024 workforce × 2020 earnings joint
  distribution is constructed.
- Choosing 2023 or 2024 weights and holding them at a 2026 model baseline is an
  explicit scenario initialization choice. These data do not establish the
  true 2026 population or an annual workforce growth rate.

## Extraction and verification

The canonical extraction script is [extract-workforce.py](../scripts/extract-workforce.py).
It checks the SHA-256 of all four downloaded source files before extraction,
unpacks the three required workbooks and checks their hashes, then reads them
with `openpyxl` without editing them. It extracts the specified cells, preserves
workbook zeros, attaches locators, and writes the single processed JSON. Run it
from the `ai-work-inequality` project root:

```sh
uv run python scripts/extract-workforce.py
```

Download the four original files from the links above into
`data/raw/workforce/`, using the local names in the JSON `sources` list.
The script prints these exact paths and download URLs when inputs are missing.
It extracts the `01-2…xlsx` provider members to `hira-providers-2023.xlsx` and
`hira-providers-2024.xlsx`; the 2024 `03-1…xlsx` member becomes
`nhis-care-2024.xlsx`. A source or workbook hash mismatch stops extraction
without replacing the processed output. Upstream revisions require inspection
and a deliberate update of the source hashes. Source files remain ignored;
the extraction script and this provenance record are versioned.

The completed checks establish that institution categories and 17-region sums
reconcile to their national totals in each year; qualification splits and both
physician margins reconcile; establishment-form rows reconcile; and inpatient
plus outpatient days and monetary values reconcile (with a tolerance of 0.01
thousand KRW for workbook floating-point precision). The physician and care PDF
tables were rendered and visually checked for column alignment, units and
footnotes. These checks validate extraction, not forecasts or model behavior.

## Attribution and reuse

This extract uses the *2024 National Health Insurance Statistical Yearbook*,
published by NHIS and HIRA in 2025, and the *2023 National Health Insurance
Statistical Yearbook*, published by the same institutions in 2024. Both are
freely downloadable at the official NHIS links above.

The [alternate HIRA 2024 publication post](https://www.hira.or.kr/bbsDummy.do?brdBltNo=2431&brdScnBltNo=4&pgmid=HIRAA020045010000)
explicitly displays **KOGL Type 1: attribution**. The [license terms](https://www.kogl.or.kr/info/licenseType1.do)
permit sharing, adaptation and commercial use with attribution, a source link
where possible, and no implication of institutional endorsement. The marking
is absent from the first HIRA post and was not found in the NHIS HTML or PDF.
A 2023 file-specific marking was not verified in this pass. Raw report files
remain outside Git. This processed dataset publishes selected factual
aggregates with source attribution, not report pages or third-party graphics.
