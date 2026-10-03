export const BASELINE = Object.freeze({
  "income": {
    "year": 2020,
    "all": 230699494.09856516,
    "proprietor": 294282306.4032603,
    "salaried": 185390558.43601876,
    "proprietorWeight": 0.41609154512036045,
    "weightMethod": "Reconstructed mixture weights, not observed headcounts or national workforce proportions.",
    "weightAssumption": "The three Sheet 15 national cells must be arithmetic means of a common eligible population partitioned exhaustively into proprietor and employee. Same headers and footnotes support this operational choice, but raw eligible counts and aggregation code were not retrieved.",
    "definition": "Adjusted annual administrative remuneration of full-time physicians; residents excluded. Proprietor business income excludes rental income; employee remuneration is labor income. Both tails were winsorized at the 1st/99th percentiles.",
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
    }
  ],
  "inputHashes": {
    "income": "66649a04842a9b82f7cf179b456634f6329799e65f5caa5934ef4fdd8fb5f30e",
    "workforce": "5bc62a7e0e5be005636e3eec003a233929a2b7f5db42d1cc9c855d0659724733",
    "ai-evidence": "b14cf238ad127c61ce24a0ff65b5c700484e36330e66c0a5d8f0d656a14043ea"
  }
});
