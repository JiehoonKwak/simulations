export const BASELINE = Object.freeze({
  "income": {
    "year": 2020,
    "all": 230699494.09856516,
    "proprietor": 294282306.4032603,
    "salaried": 185390558.43601876,
    "proprietorWeight": 0.41609154512036045,
    "weightMethod": "Reconstructed mixture weights, not observed headcounts or national workforce proportions.",
    "weightAssumption": "The three Sheet 15 national cells must be arithmetic means of a common eligible population partitioned exhaustively into proprietor and employee. Same headers and footnotes support this operational choice, but raw eligible counts and aggregation code were not retrieved.",
    "definition": "Adjusted annual administrative remuneration of full-time physicians with valid remuneration records; residents excluded. Proprietor business income excludes rental income; employee remuneration includes taxes and social contributions. Both tails were winsorized at the 1st/99th percentiles.",
    "sourceCells": {
      "proprietor": {
        "value": 294282306.4032603,
        "sourceId": "nhis-physician-workbook",
        "sheet": "15. 의료기관 근무의 임금(성별, 시도별, 직역별)",
        "cell": "CV7"
      },
      "employee": {
        "value": 185390558.43601876,
        "sourceId": "nhis-physician-workbook",
        "sheet": "15. 의료기관 근무의 임금(성별, 시도별, 직역별)",
        "cell": "CW7"
      },
      "all": {
        "value": 230699494.09856516,
        "sourceId": "nhis-physician-workbook",
        "sheet": "15. 의료기관 근무의 임금(성별, 시도별, 직역별)",
        "cell": "CX7"
      }
    }
  },
  "workforce": {
    "year": 2024,
    "physicians": 109274,
    "internsAndResidents": 1225,
    "institutions": [
      {
        "year": 2024,
        "provider_type": "tertiary_hospital",
        "institutions": 47,
        "unit": "institutions",
        "source": {
          "file_id": "hira-providers-2024.xlsx",
          "sheet": "Ⅰ-9",
          "cells": "C30",
          "pdf_file_id": "nhis-yearbook-2024.pdf",
          "pdf_printed_pages": [
            40,
            41
          ],
          "pdf_pages_1based": [
            122,
            123
          ]
        }
      },
      {
        "year": 2024,
        "provider_type": "general_hospital",
        "institutions": 331,
        "unit": "institutions",
        "source": {
          "file_id": "hira-providers-2024.xlsx",
          "sheet": "Ⅰ-9",
          "cells": "D30",
          "pdf_file_id": "nhis-yearbook-2024.pdf",
          "pdf_printed_pages": [
            40,
            41
          ],
          "pdf_pages_1based": [
            122,
            123
          ]
        }
      },
      {
        "year": 2024,
        "provider_type": "hospital",
        "institutions": 1412,
        "unit": "institutions",
        "source": {
          "file_id": "hira-providers-2024.xlsx",
          "sheet": "Ⅰ-9",
          "cells": "E30",
          "pdf_file_id": "nhis-yearbook-2024.pdf",
          "pdf_printed_pages": [
            40,
            41
          ],
          "pdf_pages_1based": [
            122,
            123
          ]
        }
      },
      {
        "year": 2024,
        "provider_type": "long_term_care_hospital",
        "institutions": 1342,
        "unit": "institutions",
        "source": {
          "file_id": "hira-providers-2024.xlsx",
          "sheet": "Ⅰ-9",
          "cells": "F30",
          "pdf_file_id": "nhis-yearbook-2024.pdf",
          "pdf_printed_pages": [
            40,
            41
          ],
          "pdf_pages_1based": [
            122,
            123
          ]
        }
      },
      {
        "year": 2024,
        "provider_type": "mental_health_hospital",
        "institutions": 263,
        "unit": "institutions",
        "source": {
          "file_id": "hira-providers-2024.xlsx",
          "sheet": "Ⅰ-9",
          "cells": "G30",
          "pdf_file_id": "nhis-yearbook-2024.pdf",
          "pdf_printed_pages": [
            40,
            41
          ],
          "pdf_pages_1based": [
            122,
            123
          ]
        }
      },
      {
        "year": 2024,
        "provider_type": "clinic",
        "institutions": 36685,
        "unit": "institutions",
        "source": {
          "file_id": "hira-providers-2024.xlsx",
          "sheet": "Ⅰ-9",
          "cells": "H30",
          "pdf_file_id": "nhis-yearbook-2024.pdf",
          "pdf_printed_pages": [
            40,
            41
          ],
          "pdf_pages_1based": [
            122,
            123
          ]
        }
      }
    ],
    "interpretation": "Institution-reported workforce context. It does not supply the earnings sample weights or a long-run trend from 2023 to 2024."
  },
  "newerIncomeContext": {
    "status": "Separate descriptive context; excluded from runtime role calibration and mixture weights.",
    "observationYear": 2023,
    "publicationDate": "2026-09-29",
    "retrievedDate": "2026-10-03",
    "allPhysicianMeanAnnualKRW": {
      "value": 285182871,
      "sourceId": "mohw-second-survey-factsheets",
      "locator": "PDF p.3, printed p.1, physician factsheet section 4.",
      "extractionMethod": "Manual transcription from the rendered official PDF, verified against its extracted text; source bytes are hash-checked, but this value is not automatically parsed."
    },
    "methodSourceId": "mohw-second-survey-release",
    "methodLocator": "PDF p.10, section 5.",
    "eligibilityAndTransformation": "NHIS monthly remuneration basis; full-time >=40 hours/week; interns and residents excluded; values outside the first/99th percentiles replaced with those cutoffs.",
    "roleMeansAvailableInRetrievedSources": false,
    "incomeEligibleRoleCountsAvailableInRetrievedSources": false,
    "comparisonBoundary": "The common headline exclusions and tail adjustment support descriptive comparison, but the retrieved attachments do not establish matching role populations, valid-record selection, or the exact percentile reference pool. No 2020 role values are replaced.",
    "detailedDataStatus": "The release states that detailed final results will be posted later to MOHW, KOSIS, and NHIS (PDF p.11). Detailed role remuneration and eligible role counts were not obtained as of 2026-10-03.",
    "nextRelevantTable": "Release PDF p.14, item 19: sex/region/role remuneration for 2013-2023. Workforce headcounts must still be distinguished from remuneration-eligible counts."
  },
  "sources": [
    {
      "id": "nhis-income",
      "title": "NHIS physician remuneration tables",
      "year": 2020,
      "url": "https://www.nhis.or.kr/nhis/policy/wbhaea02600m02.do?mode=view&articleNo=10821112"
    },
    {
      "id": "mohw-definitions",
      "title": "MOHW workforce survey definitions",
      "year": 2022,
      "url": "https://www.mohw.go.kr/board.es?act=view&bid=0027&list_no=372084&mid=a10503010100"
    },
    {
      "id": "mohw-full-methods",
      "title": "MOHW first survey: full methods",
      "year": 2022,
      "url": "https://www.mohw.go.kr/board.es?mid=a10411010200&bid=0019&act=view&list_no=373498"
    },
    {
      "id": "mohw-second-survey",
      "title": "MOHW second survey: newer aggregate context",
      "year": 2026,
      "url": "https://www.mohw.go.kr/board.es?mid=a10503010100&bid=0027&act=view&list_no=1492074"
    },
    {
      "id": "nhis-workforce",
      "title": "NHIS / HIRA statistical yearbook",
      "year": 2024,
      "url": "https://www.nhis.or.kr/nhis/together/wbhaec06300m01.do?mode=view&articleNo=11007426"
    },
    {
      "id": "lukac-2025",
      "title": "Ambient documentation: randomized trial",
      "year": 2025,
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12768499/"
    },
    {
      "id": "afshar-2025",
      "title": "Ambient documentation: stepped-wedge trial",
      "year": 2025,
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12858090/"
    },
    {
      "id": "goh-2024",
      "title": "Diagnostic assistance: randomized trial",
      "year": 2024,
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11519755/"
    },
    {
      "id": "goh-2025",
      "title": "Management assistance: randomized trial",
      "year": 2025,
      "url": "https://pubmed.ncbi.nlm.nih.gov/39910272/"
    },
    {
      "id": "tao-2026",
      "title": "Pre-consultation AI: patient randomized trial",
      "year": 2026,
      "url": "https://www.nature.com/articles/s41591-025-04176-7"
    },
    {
      "id": "rotenstein-2026",
      "title": "Ambient AI: multicenter throughput study",
      "year": 2026,
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13044793/"
    },
    {
      "id": "masai-2025",
      "title": "MASAI AI-supported mammography screening",
      "year": 2025,
      "url": "https://pubmed.ncbi.nlm.nih.gov/39904652/"
    },
    {
      "id": "srth-2025",
      "title": "SRT-H surgical step autonomy",
      "year": 2025,
      "url": "https://arxiv.org/html/2505.10251v1"
    },
    {
      "id": "song-2025-korea-ed",
      "title": "Korean ED discharge documentation: virtual EHR experiment",
      "year": 2025,
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12541540/"
    },
    {
      "id": "lee-2025-korea-ed",
      "title": "Korean ED documentation: actual EHR implementation",
      "year": 2025,
      "url": "https://www.nature.com/articles/s41598-025-24659-4"
    },
    {
      "id": "kim-2020-korea-rheumatology",
      "title": "Korean hospital rheumatology consultation-time survey",
      "year": 2020,
      "url": "https://synapse.koreamed.org/upload/synapsedata/pdfdata/1010jrd/jrd-27-45.pdf"
    },
    {
      "id": "ha-2016-korea-saturday-fee",
      "title": "Korean Saturday consultation-fee supplement: claims study",
      "year": 2016,
      "url": "https://ir.ymlib.yonsei.ac.kr/bitstream/22282913/147002/1/T201601930.pdf"
    }
  ],
  "evidence": [
    {
      "id": "lukac-2025",
      "shortTitle": "Ambient documentation: randomized trial",
      "year": 2025,
      "doi": "10.1056/AIoa2501000",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12768499/",
      "design": "Three-group pragmatic randomized trial, 238 outpatient physicians, UCLA",
      "unit": "Percentage change in time-in-note across all notes",
      "effects": [
        {
          "arm": "Nabla",
          "estimate": -9.5,
          "ci95": [
            -17.2,
            -1.8
          ]
        },
        {
          "arm": "DAX",
          "estimate": -1.7,
          "ci95": [
            -9.4,
            5.9
          ]
        }
      ],
      "interpretation": "Intention-to-treat deployment effects; do not multiply by encounter utilization again. Vendor-platform editing is excluded. Documentation is not total physician working time.",
      "modelUse": "Null-to-moderate documentation benefit and an explicitly transported trial-analogue sensitivity; no Korean adoption or employment coefficient.",
      "retrieval": "Full author manuscript methods and results"
    },
    {
      "id": "afshar-2025",
      "shortTitle": "Ambient documentation: stepped-wedge trial",
      "year": 2025,
      "doi": "10.1056/AIoa2500945",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12858090/",
      "design": "Individually randomized stepped-wedge trial, 66 practitioners, 24 weeks",
      "unit": "Hours of note time per eight scheduled patient hours",
      "effects": [
        {
          "estimate": -0.36,
          "ci95": [
            -0.55,
            -0.17
          ]
        }
      ],
      "interpretation": "Approximately 21.6 minutes from the rounded estimate. Not a measured fraction of total physician labor. After-hours result lost statistical support after influential-observation sensitivity.",
      "modelUse": "Keep documentation savings separate from staffing and realized throughput.",
      "retrieval": "Full author manuscript methods, results and sensitivity"
    },
    {
      "id": "goh-2024",
      "shortTitle": "Diagnostic assistance: randomized trial",
      "year": 2024,
      "doi": "10.1001/jamanetworkopen.2024.40969",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11519755/",
      "design": "Randomized trial, 50 US physicians, six diagnostic vignettes",
      "unit": "Seconds per case",
      "effects": [
        {
          "estimate": -82,
          "ci95": [
            -195,
            31
          ]
        }
      ],
      "interpretation": "Reasoning score difference was +2 percentage points (95% CI -4 to 8). Neither result establishes an improvement. Standalone model performance is a different comparison.",
      "modelUse": "Include zero net reasoning-time benefit; do not infer clinical substitution from benchmark accuracy.",
      "retrieval": "Full text"
    },
    {
      "id": "goh-2025",
      "shortTitle": "Management assistance: randomized trial",
      "year": 2025,
      "doi": "10.1038/s41591-024-03456-y",
      "url": "https://pubmed.ncbi.nlm.nih.gov/39910272/",
      "design": "Randomized trial, 92 physicians, five management vignettes",
      "unit": "Seconds per case",
      "effects": [
        {
          "estimate": 119.3,
          "ci95": [
            17.4,
            221.2
          ]
        }
      ],
      "interpretation": "Quality improved by 6.5 percentage points (95% CI 2.7 to 10.2) while time increased. Publisher correction concerns author-contribution footnotes.",
      "modelUse": "Allow negative time savings from review and more thorough work.",
      "retrieval": "Primary abstract and original manuscript material"
    },
    {
      "id": "tao-2026",
      "shortTitle": "Pre-consultation AI: patient randomized trial",
      "year": 2026,
      "doi": "10.1038/s41591-025-04176-7",
      "url": "https://www.nature.com/articles/s41591-025-04176-7",
      "design": "Two Chinese tertiary centers, 111 specialists; 2138 randomized, 2069 analyzed patients",
      "unit": "Percentage reduction in specialist consultation minutes",
      "effects": [
        {
          "estimate": 28.7,
          "ci95": [
            22.7,
            34.8
          ]
        }
      ],
      "interpretation": "Consultation 4.41 to 3.14 min; report review 0.07 to 0.25 min. Combined reported means imply 24.3% physician-time saving (derived, not a trial endpoint or CI). Patient chatbot time adds 3.51 min. Throughput +15.3% derives from a matched physician comparison, not randomized physician assignment.",
      "modelUse": "A selected consultation scenario can be optimistic; it is not an all-stage labor or entire patient-journey effect.",
      "retrieval": "Full text"
    },
    {
      "id": "rotenstein-2026",
      "shortTitle": "Ambient AI: multicenter throughput study",
      "year": 2026,
      "doi": "10.1001/jama.2026.2253",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13044793/",
      "design": "Five US academic institutions; 8581 clinicians, 1809 adopters; difference-in-differences observational analysis",
      "unit": "Additional weekly visits",
      "effects": [
        {
          "estimate": 0.49,
          "ci95": [
            0.17,
            0.81
          ]
        }
      ],
      "interpretation": "Documentation time was 16.0 min lower per eight scheduled patient hours (95% CI 13.7 to 18.3); EHR effects overlap and must not be added. Selection into adoption limits causal transport.",
      "modelUse": "Saved task time need not become proportionate throughput; retain demand and other-capacity constraints.",
      "retrieval": "Primary abstract and full manuscript"
    },
    {
      "id": "masai-2025",
      "shortTitle": "MASAI AI-supported mammography screening",
      "year": 2025,
      "doi": "10.1016/S2589-7500(24)00267-X",
      "url": "https://pubmed.ncbi.nlm.nih.gov/39904652/",
      "design": "Swedish screening randomized trial, 105934 women randomized",
      "unit": "Screen-reading count",
      "effects": [
        {
          "ai": 61248,
          "control": 109692,
          "reductionPercent": 44.2
        }
      ],
      "interpretation": "A specific reading-task count, not elapsed physician time or all radiology work; radiologists remain in the workflow.",
      "modelUse": "Task-specific substitution precedent only.",
      "retrieval": "Primary abstract and publisher passages; full publisher article access incomplete"
    },
    {
      "id": "srth-2025",
      "shortTitle": "SRT-H surgical step autonomy",
      "year": 2025,
      "doi": "10.1126/scirobotics.adt5254",
      "url": "https://arxiv.org/html/2505.10251v1",
      "design": "Eight unseen ex-vivo porcine gallbladders; cystic duct and artery clip/cut sequence",
      "unit": "Step completion on ex-vivo specimens",
      "effects": [
        {
          "completed": 8,
          "tested": 8
        }
      ],
      "interpretation": "An assistant reloads clips and changes instruments; exposed anatomy is prepared. This is neither whole human surgery nor a clinical deployment rate.",
      "modelUse": "Procedural autonomy remains a speculative scenario with setup and other-care constraints.",
      "retrieval": "Full author preprint; publisher full text inaccessible"
    },
    {
      "id": "song-2025-korea-ed",
      "shortTitle": "Korean ED discharge documentation: virtual EHR experiment",
      "year": 2025,
      "doi": "10.1001/jamanetworkopen.2025.38427",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12541540/",
      "design": "Single Seoul 2400-bed tertiary hospital; six emergency physicians each wrote notes for 50 selected cases in a virtual EHR. Manual session always first; same cases in randomized order after a one-hour washout with preloaded AI drafts. 300 manual and 300 assisted notes, not 600 independent cases.",
      "setting": "Patient records September 2022 to August 2023; 592 development cases and 50 validation cases. Y-KNOT ED discharge-note assistant; physician editing retained.",
      "unit": "Median writing seconds per ED discharge note; arm-specific medians, not a randomized treatment-effect estimate",
      "effects": [
        {
          "arm": "Manual",
          "estimate": 69.5,
          "ci95": [
            65.5,
            78
          ]
        },
        {
          "arm": "AI-assisted",
          "estimate": 32,
          "ci95": [
            29.5,
            36
          ]
        }
      ],
      "comparison": {
        "pValue": "<0.001",
        "derivedReductionPercent": 54,
        "derivation": "100*(69.5-32.0)/69.5, rounded; ratio of reported medians, not an effect estimate with a confidence interval",
        "ci95Status": "No confidence interval calculated for the derived reduction"
      },
      "dependenceGroup": "severance-y-knot-ed",
      "interpretation": "Selected-case drafting/editing endpoint. Fixed condition order permits recall/order bias, and preloaded drafts exclude generation latency. Same institution/system lineage as lee-2025-korea-ed; not independent replication.",
      "modelUse": "Narrow ED discharge-document drafting plausibility anchor only. Does not identify national documentation task share, whole-day working time, completed visits, staffing or wages. Not automatically an additional gain after the 2026 baseline.",
      "retrieval": "Full primary author manuscript, methods, results and limitations; verified arm-specific time intervals",
      "retrievedDate": "2026-10-03"
    },
    {
      "id": "lee-2025-korea-ed",
      "shortTitle": "Korean ED documentation: actual EHR implementation",
      "year": 2025,
      "doi": "10.1038/s41598-025-24659-4",
      "url": "https://www.nature.com/articles/s41598-025-24659-4",
      "design": "Uncontrolled pre/post implementation at Severance Hospital, Seoul; eight volunteer attending physicians of 15 invited; surveys before, three days after and five weeks after implementation.",
      "setting": "On-premises Y-KNOT assistant integrated into the actual ED EHR in November 2024; average 10.9 discharge notes per physician per day. Physician review, editing and signoff retained.",
      "unit": "Self-reported writing seconds per discharge note",
      "effects": [
        {
          "arm": "Before implementation (T1)",
          "estimate": 127.5
        },
        {
          "arm": "Five weeks after implementation (T3)",
          "estimate": 42.8
        }
      ],
      "comparison": {
        "pValue": "0.002",
        "derivedReductionPercent": 66.4,
        "derivation": "100*(127.5-42.8)/127.5, rounded; derived from reported values",
        "ci95Status": "No effect confidence interval supplied in the extracted results; none inferred"
      },
      "secondaryOutcomes": [
        {
          "outcome": "NASA-TLX workload",
          "unit": "0-20 scale",
          "before": 11,
          "threeDays": 8,
          "fiveWeeks": 6.9,
          "pValue": "0.040"
        },
        {
          "outcome": "NASA-TLX mental demand, physical demand and frustration",
          "result": "Changes not statistically significant"
        }
      ],
      "dependenceGroup": "severance-y-knot-ed",
      "interpretation": "Writing time is recall-based. No reliable preimplementation EHR start timestamp existed, so this is not an objective pre/post time estimate. No completed-visit or total-shift-time outcome. Same institution/system lineage as song-2025-korea-ed; not independent replication. Use actual reported seconds rather than ambiguous abstract wording about one-third.",
      "modelUse": "Domestic feasibility and perceived burden evidence only; no national task-composition, throughput, adoption, retention or wage coefficient. Contemporary deployment effects are not automatically incremental 2026-2036 savings.",
      "retrieval": "Full primary publisher article, methods, results, tables and limitations; later publisher access attempts encountered a redirect",
      "retrievedDate": "2026-10-03"
    },
    {
      "id": "kim-2020-korea-rheumatology",
      "shortTitle": "Korean hospital rheumatology consultation-time survey",
      "year": 2020,
      "doi": "10.4078/jrd.2020.27.1.45",
      "url": "https://synapse.koreamed.org/upload/synapsedata/pdfdata/1010jrd/jrd-27-45.pdf",
      "design": "November 2018 to February 2019 survey of Korean College of Rheumatology hospital members; 106 respondents (78 online, 28 paper), 48.4% response.",
      "unit": "Self-reported allocated consultation minutes per patient; means with standard deviations, not measured time-motion fractions",
      "effects": [
        {
          "arm": "New patient",
          "estimate": 12.3,
          "sd": 5.4
        },
        {
          "arm": "Established patient",
          "estimate": 4.8,
          "sd": 1.8
        }
      ],
      "uncertainty": "Reported SDs describe respondent variability, not confidence intervals; no confidence interval inferred.",
      "secondaryOutcomes": [
        {
          "outcome": "Patients per outpatient session",
          "statistic": "Median (range)",
          "estimate": 40,
          "range": [
            10,
            200
          ]
        },
        {
          "outcome": "Insufficient time adversely affects proper documentation",
          "numerator": 81,
          "denominator": 106,
          "percent": 76.4
        }
      ],
      "interpretation": "Table 1 reports allocated visit lengths; Table 3 reports perceived ideal task times for rheumatoid arthritis/systemic lupus erythematosus, not observed task-time shares. Single-specialty hospital sample and response selection limit transport; not a proprietor-versus-employee comparison.",
      "modelUse": "Supports case-mix and scheduling constraints and documentation burden. Does not calibrate national documentation/reasoning/procedure/interaction fractions or a national throughput or compensation response.",
      "retrieval": "Full six-page primary PDF; methods and original Tables 1-4 checked, including question-specific denominators",
      "retrievedDate": "2026-10-03"
    },
    {
      "id": "ha-2016-korea-saturday-fee",
      "shortTitle": "Korean Saturday consultation-fee supplement: claims study",
      "year": 2016,
      "doi": "10.1136/bmjopen-2016-011248",
      "url": "https://ir.ymlib.yonsei.ac.kr/bitstream/22282913/147002/1/T201601930.pdf",
      "design": "Longitudinal NHIS claims/HIRA clinic study, October 2012 to March 2014; 2837 internal/family-medicine clinics and approximately 66.83 million outpatient cases; adjusted multilevel mixed model.",
      "setting": "October 2013 introduction of a 30% consultation-fee supplement for Saturday 09:00-13:00 care. Clinics with no Saturday activity for more than one month excluded. Supplement applies to consultation fees, not all revenue.",
      "unit": "Adjusted percentage-point change in Saturday share of total weekly clinic activity; not total-volume growth or an elasticity",
      "effects": [
        {
          "arm": "Saturday visit share",
          "estimate": 2.065,
          "pValue": "<0.0001"
        },
        {
          "arm": "Saturday billing share",
          "estimate": 3.518,
          "pValue": "<0.0001"
        }
      ],
      "uncertainty": "Table 3 supplies coefficients and p values, not confidence intervals; no interval inferred.",
      "rawBeforeAfter": [
        {
          "outcome": "Saturday visit share",
          "unit": "Percent of total weekly visits",
          "before": 13.53,
          "beforeSd": 3.24,
          "after": 13.28,
          "afterSd": 2.75
        },
        {
          "outcome": "Saturday billing share",
          "unit": "Percent of total weekly billings",
          "before": 14,
          "beforeSd": 3.47,
          "after": 15.21,
          "afterSd": 3.26
        }
      ],
      "interpretation": "Raw visit share decreases while the adjusted coefficient is positive; retain both estimands. Friday/Saturday activity increased while other weekday activity decreased. Estimates can reflect redistribution and short-term trends, not total demand, individual earnings or net profit. Abstract/results report 66825881 cases; methods report 66825882, a one-case discrepancy. Publisher correction concerns co-first authorship only.",
      "modelUse": "Supports distinct payment and care-schedule sensitivity. Does not estimate a universal demand/payment elasticity, salaried wage pass-through, proprietor net-income capture or staffing response.",
      "retrieval": "Full eight-page primary publisher PDF from Yonsei repository; original Tables 2-3 and methods checked; publisher correction checked",
      "retrievedDate": "2026-10-03"
    }
  ],
  "inputHashes": {
    "income": "a4f5f5635f486b2bf53b049d206aa25ba7f33aad08e0c0480d19a8e232123e94",
    "workforce": "5bc62a7e0e5be005636e3eec003a233929a2b7f5db42d1cc9c855d0659724733",
    "ai-evidence": "6d425516f9fc42eea912adfa4bf9a2ddbdd90f2343cb34bb9696ff435aee589f"
  }
});
