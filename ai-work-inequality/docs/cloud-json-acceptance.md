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
