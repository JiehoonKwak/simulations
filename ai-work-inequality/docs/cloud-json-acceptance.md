# Hosted cloud JSON acceptance

This is a bounded infrastructure check (Switchboard #73), not part of the
physician-futures model or its interface. It confirms that a hosted cloud worker
can read pinned project data from the managed external data store, compute a
small deterministic result, and publish it back without touching Git-tracked
data or any other project files.

## Inputs and output

- Inputs: every `*.json` under
  `ai-work-inequality/data/continuity-20261011/completed/` in the prepared data
  workspace. These are tiny synthetic continuity artifacts and are read only.
- Output: `ai-work-inequality/data/switchboard-cloud-20261011/<provider>/json-acceptance.json`
  in the same workspace. It records the provider, each input's relative path,
  SHA-256, numeric count and sum, plus the combined numeric count, sum, and
  sorted values. It carries no timestamps, hosts, or credentials.

Numeric scalars are integers and floats found recursively; booleans are
excluded. Both directories live in the managed data store and stay out of Git.

## Run

```sh
python3 scripts/cloud-json-acceptance.py --data-root <prepared-workspace> --provider claude
python3 scripts/cloud-json-acceptance.py --data-root <prepared-workspace> --provider claude --check
```

`--check` is read-only: it recomputes the result and fails unless the published
file matches byte for byte.

## Recorded result (2026-10-11, provider `claude`)

| Input | SHA-256 | Count | Sum |
| --- | --- | --- | --- |
| `m1-continuation.json` | `08af1ace47f7fe38b58f17c31b5d26544390045b4c6a3af8b76b0314779f809e` | 3 | 56 |
| `result.json` | `c0ea7ba9588dc887271a34518a18c4be5ca9d1817a56d951ff1c5ba565c81047` | 5 | 34 |

Combined: 8 values, sum 90, sorted `[2, 3, 5, 7, 11, 17, 17, 28]`.

## Codex continuation (Switchboard #74)

`codex-json-acceptance.py` uses the standard-library summarizer above, requires
exactly the two inputs with the recorded checksums, and verifies the previously
published Claude JSON against a fresh input summary before writing anything.
Its deterministic Codex result adds `claude_result.path` and `claude_result.sha256`
to the same numeric summary. It writes only to the selected Codex directory in
the external workspace; source inputs and the Claude result remain read only.

```sh
python3 scripts/codex-json-acceptance.py --data-root <prepared-workspace>
python3 scripts/codex-json-acceptance.py --data-root <prepared-workspace> --check
```

The second command is read-only and checks byte equality. Independent final
verification must recalculate input hashes and recursively collect numbers
without importing the producing script. Expected combined count is 8, sum 90,
and sorted values are `[2, 3, 5, 7, 11, 17, 17, 28]`. The consumed Claude file's
SHA-256 is `9642b54c88d80ef85b70cbc195f339b9d7b0e2985ea1de36b6186df72270236b`.
For M1 verification, use the supervisor's readback workspace. This acceptance
does not alter the analysis models or user-facing simulations.

## Automatic browser continuation (Switchboard #75)

`browser_cloud_acceptance.py` is a dependency-free hosted VM acceptance for the
M1 automatic Jstack browser submission. It reads only the two pinned synthetic
inputs and the previous Codex result from the supervisor-prepared external
workspace. Before writing, it checks both input hashes and compares every field
of the predecessor against the fresh numeric summary and recorded Claude receipt
metadata. No Claude data path needs to be materialized for this continuation.

```sh
python3 scripts/browser_cloud_acceptance.py --data-root <prepared-workspace>
python3 scripts/browser_cloud_acceptance.py --data-root <prepared-workspace> --check
```

The deterministic output is
`ai-work-inequality/data/switchboard-cloud-browser-20261011/json-acceptance.json`.
It records `provider=codex-browser`, original relative paths and hashes, per-input
count/sum, combined count/sum/sorted values, and `codex_result.path`/`sha256`.
The predecessor hash is
`1662eb93e9e634ef0f36409e6e8a4332c15d7b717555ecf183fdb7155ada9b72`.
Expected numbers remain 8 values, sum 90, sorted `[2, 3, 5, 7, 11, 17, 17, 28]`.

Final verification independently recalculates every output field without importing
this script, checks that originals and predecessor are unchanged, and rejects an
inconsistent predecessor in a temporary fixture outside managed data. `--check`
does not write. M1 final verification uses the supervisor's external readback
workspace, not ordinary M1 project data. Only the new selected output directory
is written; models, UI, and unselected NAS entries are unchanged.
