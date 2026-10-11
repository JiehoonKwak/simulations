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
