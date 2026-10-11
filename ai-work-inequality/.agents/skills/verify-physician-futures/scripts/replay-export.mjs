import { readFileSync, statSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";

const web = new URL("../../../../web/", import.meta.url);
const { simulate, VERSION, DEFAULT_PARAMS, PRESETS, BASELINE } = await import(
  new URL("empirical-model.mjs", web)
);
const { scenarioEnvelope } = await import(new URL("sensitivity.mjs", web));
const { earningsConditions } = await import(
  new URL("earnings-conditions.mjs", web)
);
const { COMPARISONS } = await import(new URL("comparisons.mjs", web));

const path = process.argv[2];
if (!path) {
  console.error("Usage: replay-export.mjs <physician-scenario-results.json>");
  process.exit(2);
}
const d = JSON.parse(readFileSync(path, "utf8"));
const named = [...COMPARISONS, ...PRESETS];
const namedRun = (id) => {
  const s = named.find((x) => x.id === id);
  return s && simulate({ ...DEFAULT_PARAMS, ...s.params }, d.structure);
};

const run = simulate(d.params, d.structure);
const isNoChangeControl = d.scenario?.id === "hold";
const reference = simulate(d.comparison?.params, d.comparison?.structure);
const scenarioRun =
  d.scenario?.id === "custom" ? null : namedRun(d.scenario?.id);
const checks = {
  schema: d.schema === "physician-empirical-scenario-v1",
  modelVersion: d.modelVersion === VERSION,
  inputHashes: isDeepStrictEqual(d.baselineInputHashes, BASELINE.inputHashes),
  signature: d.signature === run.signature,
  frames: isDeepStrictEqual(d.frames, run.frames),
  modelChecks: isDeepStrictEqual(d.checks, run.checks),
  sensitivity: isDeepStrictEqual(
    d.sensitivity,
    scenarioEnvelope(d.params, { varyEconomy: !isNoChangeControl }),
  ),
  earningsConditions: isDeepStrictEqual(
    d.earningsConditions,
    earningsConditions(run),
  ),
  scenarioIdentity:
    d.scenario?.id === "custom"
      ? d.scenario.label === "Custom assumptions"
      : scenarioRun?.signature === run.signature,
  comparisonIdentity:
    d.comparison?.scenario?.id === COMPARISONS[0].id &&
    namedRun(COMPARISONS[0].id).signature === reference.signature,
  comparisonFrames:
    d.comparison?.signature === reference.signature &&
    isDeepStrictEqual(d.comparison?.frames, reference.frames),
};
const failed = Object.keys(checks).filter((k) => !checks[k]);
console.log(
  JSON.stringify({
    status: failed.length ? "FAIL" : "PASS",
    file: path,
    modified: statSync(path).mtime.toISOString(),
    scenario: d.scenario,
    signature: d.signature,
    frames: d.frames?.length,
    sensitivityRuns: d.sensitivity?.runCount,
    failed,
    ...(failed.length && {
      next: "Diff the failed fields against a fresh simulate() of the same params before blaming the UI; a stale build (npm run build) or changed processed inputs also cause mismatches.",
    }),
  }),
);
process.exit(failed.length ? 1 : 0);
