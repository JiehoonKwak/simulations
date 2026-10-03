import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
import assert from "node:assert/strict";

const project = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const names = ["income", "workforce", "ai-evidence"];
const texts = await Promise.all(
  names.map((name) =>
    readFile(resolve(project, `data/processed/${name}.json`), "utf8"),
  ),
);
const [income, workforce, evidence] = texts.map((text) => JSON.parse(text));
const means = income.roleMeans;
const weight =
  (means.all.value - means.employee.value) /
  (means.proprietor.value - means.employee.value);
assert(weight > 0 && weight < 1);
assert(
  Math.abs(weight - income.calibration.impliedMixtureWeights.proprietor) <
    1e-12,
);
assert.equal(income.observationYear, 2020);
const total = workforce.physicians_by_type.find(
  (row) => row.year === 2024 && row.provider_type === "total",
);
assert(total.physicians > 0);
const baseline = {
  income: {
    year: income.observationYear,
    all: means.all.value,
    proprietor: means.proprietor.value,
    salaried: means.employee.value,
    proprietorWeight: weight,
    weightMethod: income.calibration.weightStatus,
    weightAssumption: income.calibration.weightAssumption,
    definition:
      "Adjusted annual administrative remuneration of full-time physicians with valid remuneration records; residents excluded. Proprietor business income excludes rental income; employee remuneration includes taxes and social contributions. Both tails were winsorized at the 1st/99th percentiles.",
    sourceCells: means,
  },
  workforce: {
    year: 2024,
    physicians: total.physicians,
    internsAndResidents: total.interns + total.residents,
    institutions: workforce.institutions_by_type.filter(
      (row) =>
        row.year === 2024 &&
        [
          "clinic",
          "tertiary_hospital",
          "general_hospital",
          "hospital",
          "long_term_care_hospital",
          "mental_health_hospital",
        ].includes(row.provider_type),
    ),
    interpretation:
      "Institution-reported workforce context. It does not supply the earnings sample weights or a long-run trend from 2023 to 2024.",
  },
  newerIncomeContext: income.newerContext,
  sources: [
    {
      id: "nhis-income",
      title: "NHIS physician remuneration tables",
      year: 2020,
      url: income.sources[0].landingUrl,
    },
    {
      id: "mohw-definitions",
      title: "MOHW workforce survey definitions",
      year: 2022,
      url: income.sources[1].landingUrl,
    },
    {
      id: "mohw-full-methods",
      title: "MOHW first survey: full methods",
      year: 2022,
      url: income.sources.find((s) => s.id === "mohw-first-survey-full-report")
        .landingUrl,
    },
    {
      id: "mohw-second-survey",
      title: "MOHW second survey: newer aggregate context",
      year: 2026,
      url: income.sources.find((s) => s.id === "mohw-second-survey-release")
        .landingUrl,
    },
    {
      id: "nhis-workforce",
      title: "NHIS / HIRA statistical yearbook",
      year: 2024,
      url: workforce.sources.find(
        (s) => s.id === "nhis-yearbook-2024-tables.zip",
      ).landing_url,
    },
    ...evidence.studies.map((s) => ({
      id: s.id,
      title: s.shortTitle,
      year: s.year,
      url: s.url,
    })),
  ],
  evidence: evidence.studies,
  inputHashes: Object.fromEntries(
    names.map((name, i) => [
      name,
      createHash("sha256").update(texts[i]).digest("hex"),
    ]),
  ),
};
await writeFile(
  resolve(project, "web/baseline.mjs"),
  `export const BASELINE = Object.freeze(${JSON.stringify(baseline, null, 2)});\n`,
);
console.log(
  `Built baseline: 2020 role mean ratio ${(means.proprietor.value / means.employee.value).toFixed(6)}; reconstructed proprietor weight ${weight.toFixed(6)}.`,
);
