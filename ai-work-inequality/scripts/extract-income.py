"""Rebuild the published aggregate extract from the immutable NHIS workbook."""
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
EXPECTED = 'bc119065bb47b8aaa3b123675af4b21b00087e39ff5a309f4d6983b2812b6428'
RELEASE_EXPECTED = '2dc69c667c476e3fe7f3f6a06e97c07d0fd92ab13c4b4b7c5c2bdcff910d5217'
INPUTS = [
    (WORKBOOK, EXPECTED, 'https://www.nhis.or.kr/nhis/policy/wbhaea02600m02.do?mode=download&articleNo=10821112&attachNo=332792'),
    (RELEASE, RELEASE_EXPECTED, 'https://www.mohw.go.kr/boardDownload.es?bid=0027&list_no=372084&seq=3'),
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
  {'id':'mohw-release','title':'보건의료인력 실태조사 결과 발표','publisher':'Ministry of Health and Welfare, Republic of Korea','publicationDate':'2022-07-07','landingUrl':'https://www.mohw.go.kr/board.es?act=view&bid=0027&list_no=372084&mid=a10503010100','downloadUrl':'https://www.mohw.go.kr/boardDownload.es?bid=0027&list_no=372084&seq=3','rawPath':'data/raw/income/mohw-20220707-release.pdf','sha256':RELEASE_EXPECTED,'bytes':RELEASE.stat().st_size,'license':'KOGL Type 1 (attribution), shown on landing page and PDF','termsUrl':'https://www.mohw.go.kr/menu.es?mid=a10103020100','definitionLocator':'PDF page 17, printed pp.33-34; national role means in release section 6.'}
 ],
 'definition': {
  'measure':'Annualized NHIS remuneration after annual settlement, not provider revenue or household disposable income.',
  'annualization':'Mean monthly income multiplied by 12; not necessarily actual earnings received over a full calendar year for every physician.',
  'eligiblePopulation':'Full-time (reported >=40 hours/week) medical doctors working at healthcare institutions. Interns and residents excluded. Public-health and military physicians included according to Sheet 15 footnote.',
  'proprietor':'Business income of the relevant workplace excluding rental income. Not gross billings, and not a separately identified wage plus owner dividend.',
  'employee':'Labor income of the relevant workplace. Not an after-tax take-home measure.',
  'taxAndExpenseBoundary':'The survey excerpt does not state a complete reconciliation from revenue through deductible expenses and personal tax. Treat as administrative remuneration; do not relabel as raw taxable income or cash owner draws.',
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
  'reason':'Sheet 17 national mean differs from Sheet 15; Sheet 17 explicitly adds valid-remuneration restriction. The precise cause of the difference is unresolved.',
  'additionalFootnote':'Valid remuneration recipients only (유효보수 대상자에 한에 산출), B333.',
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
 'excludedSeries':[
  {'source':'NHIS workbook Sheet 16','reason':'OECD-definition series includes Korean-medicine doctors (한의사), changes scope and valid-pay restriction; not substituted for Sheet 15.'},
  {'source':'2024 court-submission report of 2022 physician earnings','reason':'More recent reported observation identified in media; original official table/methods and redistribution terms not retrieved. No values used in calibration. Same resident exclusion alone does not prove comparability.'}
 ],
 'checks': {'roleMixtureReconstructionResidualKRW':p*owner+(1-p)*employee-total,'countRoleSumMatches':True,'roleIncomeDoesNotUseAllWorkerCounts':True,'sourceHashVerified':True,'pressReleaseRoundedMeanAgreement':all(round(v)==n for v,n in zip([owner,employee,total],[294282306,185390558,230699494]))}
}
OUT.parent.mkdir(parents=True,exist_ok=True)
OUT.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n', encoding='utf-8')
print(OUT, 'regions',len(regions),'institutions',len(inst))
print(f'Python {platform.python_version()}; openpyxl {openpyxl.__version__}')
