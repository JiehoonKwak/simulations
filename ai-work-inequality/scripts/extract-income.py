"""Rebuild workbook aggregates and pinned, manually verified source context."""
import hashlib
import json
import platform
from pathlib import Path
import openpyxl

PROJECT_ROOT = Path(__file__).resolve().parents[1]
ROOT = PROJECT_ROOT / 'data' / 'raw' / 'income'
OUT = PROJECT_ROOT / 'data' / 'processed' / 'income.json'
WORKBOOK = ROOT / 'nhis-physician-statistics.xlsx'
RELEASE = ROOT / 'mohw-20220707-release.pdf'
FULL_REPORT = ROOT / 'mohw-2021-full-report.pdf'
NEWER_RELEASE = ROOT / 'mohw-20260929-release.pdf'
NEWER_FACTSHEETS = ROOT / 'mohw-20260929-occupation-factsheets.pdf'
EXPECTED = 'bc119065bb47b8aaa3b123675af4b21b00087e39ff5a309f4d6983b2812b6428'
RELEASE_EXPECTED = '2dc69c667c476e3fe7f3f6a06e97c07d0fd92ab13c4b4b7c5c2bdcff910d5217'
FULL_REPORT_EXPECTED = 'b6c1403d50e6c9ae98c8458f3a378bb18bb82fb56365906bb1870b5605e68f76'
NEWER_RELEASE_EXPECTED = '54c95938718297bfaf78d4ec28827a1fdd10b351ff4c88faff62ac5e874e0dc3'
NEWER_FACTSHEETS_EXPECTED = '91f9cf70313530be93ff40e4b46bee340823b1aa16a438d9aa8c071dec7ba1ff'
INPUTS = [
    (WORKBOOK, EXPECTED, 'https://www.nhis.or.kr/nhis/policy/wbhaea02600m02.do?mode=download&articleNo=10821112&attachNo=332792'),
    (RELEASE, RELEASE_EXPECTED, 'https://www.mohw.go.kr/boardDownload.es?bid=0027&list_no=372084&seq=3'),
    (FULL_REPORT, FULL_REPORT_EXPECTED, 'https://www.mohw.go.kr/boardDownload.es?bid=0019&list_no=373498&seq=1'),
    (NEWER_RELEASE, NEWER_RELEASE_EXPECTED, 'https://www.mohw.go.kr/boardDownload.es?bid=0027&list_no=1492074&seq=2'),
    (NEWER_FACTSHEETS, NEWER_FACTSHEETS_EXPECTED, 'https://www.mohw.go.kr/boardDownload.es?bid=0027&list_no=1492074&seq=4'),
]
missing = [f'{path}\nDownload: {url}' for path, _, url in INPUTS if not path.is_file()]
if missing:
    raise SystemExit('Missing source inputs. Download each file to its listed path:\n' + '\n'.join(missing))
for path, expected_hash, url in INPUTS:
    observed_hash = hashlib.sha256(path.read_bytes()).hexdigest()
    if observed_hash != expected_hash:
        raise SystemExit(f'Source SHA-256 mismatch: {path}\nExpected: {expected_hash}\nObserved: {observed_hash}\nDownload: {url}\nInspect any source revision before changing the expected hash.')
w = openpyxl.load_workbook(WORKBOOK, read_only=False, data_only=True)
s15, s17, s12, s14 = [w.worksheets[i-1] for i in [15, 17, 12, 14]]
assert s15['CP4'].value == 2020
assert [s15[c].value for c in ['CV6', 'CW6', 'CX6']] == ['개원의', '봉직의', '소계']
assert s15['B7'].value == '전국'

def cell(sheet, address):
    value = sheet[address].value
    assert isinstance(value, (int, float))
    return {'value': value, 'sourceId': 'nhis-physician-workbook', 'sheet': sheet.title, 'cell': address}

owner, employee, total = [s15[c].value for c in ['CV7', 'CW7', 'CX7']]
p = (total-employee)/(owner-employee)
assert 0 < p < 1
assert abs(p*owner+(1-p)*employee-total) < 1e-6
roles = {'proprietor': cell(s15, 'CV7'), 'employee': cell(s15, 'CW7'), 'all': cell(s15, 'CX7')}
regions = []
for row in range(10, 59, 3):
    regions.append({'regionKorean': s15[f'B{row}'].value, 'proprietor': cell(s15, f'CV{row}'), 'employee': cell(s15, f'CW{row}'), 'all': cell(s15, f'CX{row}')})
inst_rows = [('all', '전체', 5), ('tertiaryHospital', '상급종합병원', 6), ('generalHospital', '종합병원', 10), ('hospital', '병원', 13), ('longTermCareHospital', '요양병원', 17), ('clinic', '의원', 20), ('publicHealthInstitution', '보건소 및 보건기관', 21), ('other', '기타', 22)]
inst = [{'id': key, 'labelKorean': label, 'meanAnnualKRW': cell(s17, f'E{row}')} for key, label, row in inst_rows]
counts = {key: cell(s12, f'N{row}') for key,row in [('all',5),('proprietor',6),('employee',7),('other',8)]}
assert counts['all']['value'] == sum(counts[k]['value'] for k in ['proprietor','employee','other'])
obj = {
 'schemaVersion': 1,
 'retrievedDate': '2026-10-02',
 'observationYear': 2020,
 'publishedYear': 2022,
 'unit': 'nominal KRW per eligible physician per annualized year',
 'sources': [
  {'id':'nhis-physician-workbook','title':'1.의사 실태조사 통계.xlsx','publisher':'National Health Insurance Service, Republic of Korea','landingUrl':'https://www.nhis.or.kr/nhis/policy/wbhaea02600m02.do?mode=view&articleNo=10821112','downloadUrl':'https://www.nhis.or.kr/nhis/policy/wbhaea02600m02.do?mode=download&articleNo=10821112&attachNo=332792','originalReleaseDate':'2022-07-29','announcedCorrectionDate':'2022-08-31','correctionUrl':'https://www.nhis.or.kr/nhis/policy/wbhaea02600m02.do?mode=view&articleNo=10823868','correctionScope':'Sheet 6: age <=29 cells outside Seoul; no income correction announced in this notice.','rawPath':'data/raw/income/nhis-physician-statistics.xlsx','sha256':EXPECTED,'bytes':WORKBOOK.stat().st_size,'redistribution':'No file-specific KOGL marking established. Raw workbook is a local, ignored research input; do not redistribute it based on public accessibility alone.'},
  {'id':'mohw-release','title':'보건의료인력 실태조사 결과 발표','publisher':'Ministry of Health and Welfare, Republic of Korea','publicationDate':'2022-07-07','landingUrl':'https://www.mohw.go.kr/board.es?act=view&bid=0027&list_no=372084&mid=a10503010100','downloadUrl':'https://www.mohw.go.kr/boardDownload.es?bid=0027&list_no=372084&seq=3','rawPath':'data/raw/income/mohw-20220707-release.pdf','sha256':RELEASE_EXPECTED,'bytes':RELEASE.stat().st_size,'license':'KOGL Type 1 (attribution), shown on landing page and PDF','termsUrl':'https://www.mohw.go.kr/menu.es?mid=a10103020100','definitionLocator':'PDF page 17, printed pp.33-34; national role means in release section 6.'},
  {'id':'mohw-first-survey-full-report','title':'2021년 보건의료인력 실태조사 결과보고서: 본보고서','publisher':'Ministry of Health and Welfare, Republic of Korea','postedDate':'2022-11-02','retrievedDate':'2026-10-03','landingUrl':'https://www.mohw.go.kr/board.es?mid=a10411010200&bid=0019&act=view&list_no=373498','downloadUrl':'https://www.mohw.go.kr/boardDownload.es?bid=0019&list_no=373498&seq=1','rawPath':'data/raw/income/mohw-2021-full-report.pdf','sha256':FULL_REPORT_EXPECTED,'bytes':FULL_REPORT.stat().st_size,'license':'KOGL Type 4 (attribution, noncommercial, no derivatives), shown on landing page','termsUrl':'https://www.mohw.go.kr/menu.es?mid=a10103020400','redistribution':'Retained as an ignored local research input; not redistributed with this extract.','definitionLocator':'Printed pp.318-319 (PDF pp.366-367): source, annualization, eligibility, and tax/social-contribution inclusion. Table 5-26, printed p.350 (PDF p.398), and Table 5-31, printed pp.357-358 (PDF pp.405-406): overall and role means with valid-remuneration restriction.'},
  {'id':'mohw-second-survey-release','title':'한 눈에 보는 보건의료인력 현황, 제2차 보건의료인력 실태조사 결과 발표','publisher':'Ministry of Health and Welfare, Republic of Korea','publicationDate':'2026-09-29','retrievedDate':'2026-10-03','landingUrl':'https://www.mohw.go.kr/board.es?mid=a10503010100&bid=0027&act=view&list_no=1492074','downloadUrl':'https://www.mohw.go.kr/boardDownload.es?bid=0027&list_no=1492074&seq=2','rawPath':'data/raw/income/mohw-20260929-release.pdf','sha256':NEWER_RELEASE_EXPECTED,'bytes':NEWER_RELEASE.stat().st_size,'license':'KOGL Type 1 (attribution), shown on landing page','termsUrl':'https://www.mohw.go.kr/menu.es?mid=a10103020100','definitionLocator':'PDF p.10: remuneration and eligibility; p.11: detailed results to be posted later; p.14, item 19: planned role-specific remuneration table for 2013-2023.'},
  {'id':'mohw-second-survey-factsheets','title':'한 장으로 보는 보건의료인력 20종 현황 (제2차 실태조사)','publisher':'Ministry of Health and Welfare, Republic of Korea','publicationDate':'2026-09-29','retrievedDate':'2026-10-03','landingUrl':'https://www.mohw.go.kr/board.es?mid=a10503010100&bid=0027&act=view&list_no=1492074','downloadUrl':'https://www.mohw.go.kr/boardDownload.es?bid=0027&list_no=1492074&seq=4','rawPath':'data/raw/income/mohw-20260929-occupation-factsheets.pdf','sha256':NEWER_FACTSHEETS_EXPECTED,'bytes':NEWER_FACTSHEETS.stat().st_size,'license':'KOGL Type 1 (attribution), shown on release landing page','termsUrl':'https://www.mohw.go.kr/menu.es?mid=a10103020100','definitionLocator':'PDF p.3, printed p.1, physician factsheet section 4: exact 2023 all-physician mean. Workforce counts in section 2 are not income-eligible counts.'}
 ],
 'definition': {
  'measure':'Annualized NHIS remuneration after annual settlement, not provider revenue or household disposable income.',
  'annualization':'Mean monthly income multiplied by 12; not necessarily actual earnings received over a full calendar year for every physician.',
  'eligiblePopulation':'Full-time (reported >=40 hours/week) medical doctors working at healthcare institutions with valid remuneration records. Interns and residents excluded. Public-health and military physicians included according to Sheet 15 footnote.',
  'validRemunerationEligibility':'The full report applies this restriction to both the overall mean (Table 5-26) and the proprietor/employee means (Table 5-31), as well as the institution margins. Eligible role counts and the valid-record selection algorithm were not located.',
  'proprietor':'Business income of the relevant workplace excluding rental income. Not gross billings, and not a separately identified wage plus owner dividend.',
  'employee':'Labor income of the relevant workplace, including social-security contributions and income tax payable by employees. Not an after-tax take-home measure.',
  'taxAndExpenseBoundary':'The full report, printed p.319, defines gross remuneration to include social-security contributions and employee income tax, and explicitly says this matches the preceding remuneration definition. It does not provide a complete bridge from proprietor revenue through expenses to cash owner draws. Preserve the administrative-remuneration measure.',
  'methodSourceId':'mohw-first-survey-full-report',
  'methodLocators':['Printed pp.318-319 (PDF pp.366-367), section 7 and Table 5-11.','Table 5-26, printed p.350 (PDF p.398), footnote 3.','Table 5-31, printed pp.357-358 (PDF pp.405-406), footnotes 1-3.'],
  'tailTreatment':'Values above the 99th percentile replaced by that percentile value; below the 1st percentile replaced by that percentile value.',
  'tailTreatmentUnresolved':'The retrieved footnotes do not identify the exact reference population used for percentile cutoffs.',
  'geography':'Workplace region, on 2020 administrative boundaries.',
  'crossSectionCounts':'Income-eligible role counts are not published in the retrieved income table.',
  'no2026RebaseApplied':True,
  'footnoteCells':['15. 의료기관 근무의 임금(성별, 시도별, 직역별)!B61:B63']
 },
 'roleMeans': roles,
 'regionRoleMeans': regions,
 'institutionReferenceMeans': {
  'status':'Separate published marginal; excluded from two-role calibration.',
  'reason':'Sheet 17 national mean differs from Sheet 15. The full report also restricts the overall and role means to valid-remuneration recipients, so this restriction does not explain the difference. The precise cause remains unresolved.',
  'eligibilityFootnote':'Valid remuneration recipients only (유효보수 대상자에 한에 산출), B333; the same restriction appears in full-report Tables 5-26 and 5-31.',
  'values':inst
 },
 'headcountsContext': {
  'status':'All provider workers, including residents and non-full-time. Not weights or sample sizes for roleMeans.',
  'roleCounts':counts,
  'fullTimeAllIncludingResidents':cell(s14,'E6'),
  'otherDefinition':'Public-health physicians and military doctors etc. (Sheet 12 B17). Role headcounts and remuneration role classification are not assumed identical.'
 },
 'calibration': {
  'recommendedGrouping':['proprietor','employee'],
  'proprietorEmployeeMeanRatio':owner/employee,
  'impliedMixtureWeights':{'proprietor':p,'employee':1-p},
  'weightFormula':'p=(all_mean-employee_mean)/(proprietor_mean-employee_mean)',
  'weightStatus':'Reconstructed mixture weights, not observed headcounts or national workforce proportions.',
  'weightAssumption':'The three Sheet 15 national cells must be arithmetic means of a common eligible population partitioned exhaustively into proprietor and employee. Same headers and footnotes support this operational choice, but raw eligible counts and aggregation code were not retrieved.',
  'collapsedTwoRoleGini':p*(1-p)*abs(owner-employee)/total,
  'giniInterpretation':'Dispersion after collapsing each role to its mean. A lower bound for a common nonnegative earnings population only under the mixture assumptions; not an observed all-physician Gini.',
  'withinGroupDistribution':None,
  'withinGroupSensitivity':'Keep within-role quantiles and national Gini unidentified. Compare role mean trajectories and income pools. Any future within-role distribution requires additional observed quantiles/microdata or explicitly named distributional assumptions.',
  'institutionRoleCrossTabAvailable':False,
  'starting2026Interpretation':'Carry observed 2020 relative role means into a 2026 scenario baseline only as an explicit persistence assumption. Use indices unless an explicit price/pay update is supplied.'
 },
 'newerContext': {
  'status':'Separate descriptive context; excluded from runtime role calibration and mixture weights.',
  'observationYear':2023,
  'publicationDate':'2026-09-29',
  'retrievedDate':'2026-10-03',
  'allPhysicianMeanAnnualKRW':{'value':285182871,'sourceId':'mohw-second-survey-factsheets','locator':'PDF p.3, printed p.1, physician factsheet section 4.','extractionMethod':'Manual transcription from the rendered official PDF, verified against its extracted text; source bytes are hash-checked, but this value is not automatically parsed.'},
  'methodSourceId':'mohw-second-survey-release',
  'methodLocator':'PDF p.10, section 5.',
  'eligibilityAndTransformation':'NHIS monthly remuneration basis; full-time >=40 hours/week; interns and residents excluded; values outside the first/99th percentiles replaced with those cutoffs.',
  'roleMeansAvailableInRetrievedSources':False,
  'incomeEligibleRoleCountsAvailableInRetrievedSources':False,
  'comparisonBoundary':'The common headline exclusions and tail adjustment support descriptive comparison, but the retrieved attachments do not establish matching role populations, valid-record selection, or the exact percentile reference pool. No 2020 role values are replaced.',
  'detailedDataStatus':'The release states that detailed final results will be posted later to MOHW, KOSIS, and NHIS (PDF p.11). Detailed role remuneration and eligible role counts were not obtained as of 2026-10-03.',
  'nextRelevantTable':'Release PDF p.14, item 19: sex/region/role remuneration for 2013-2023. Workforce headcounts must still be distinguished from remuneration-eligible counts.'
 },
 'excludedSeries':[
  {'source':'NHIS workbook Sheet 16','reason':'OECD-definition series includes Korean-medicine doctors (한의사), changing population scope; not substituted for Sheet 15. Valid-remuneration eligibility also applies to Sheet 15 role means in the full report.'},
  {'source':'2024 court-submission report of 2022 physician earnings','reason':'More recent reported observation identified in media; original official table/methods and redistribution terms not retrieved. No values used in calibration. Same resident exclusion alone does not prove comparability.'}
 ],
 'checks': {'roleMixtureReconstructionResidualKRW':p*owner+(1-p)*employee-total,'countRoleSumMatches':True,'roleIncomeDoesNotUseAllWorkerCounts':True,'sourceHashVerified':True,'pressReleaseRoundedMeanAgreement':all(round(v)==n for v,n in zip([owner,employee,total],[294282306,185390558,230699494]))}
}
OUT.parent.mkdir(parents=True,exist_ok=True)
OUT.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n', encoding='utf-8')
print(OUT, 'regions',len(regions),'institutions',len(inst))
print(f'Python {platform.python_version()}; openpyxl {openpyxl.__version__}')
