"""Bounded hosted-cloud acceptance: summarize numeric scalars in input JSON files.

Reads every *.json file under the input directory of a prepared data workspace,
collects numeric scalars recursively (booleans excluded), and writes a
deterministic result JSON under the provider output directory. Standard library
only; no timestamps, hosts, or credentials are recorded.

    python3 scripts/cloud-json-acceptance.py --data-root <workspace> --provider claude
"""
import argparse
import hashlib
import json
from pathlib import Path

INPUT_DIR = 'ai-work-inequality/data/continuity-20261011/completed'
OUTPUT_DIR = 'ai-work-inequality/data/switchboard-cloud-20261011'
OUTPUT_NAME = 'json-acceptance.json'


def numeric_scalars(value):
    if isinstance(value, bool):
        return []
    if isinstance(value, (int, float)):
        return [value]
    if isinstance(value, dict):
        return [n for key in sorted(value) for n in numeric_scalars(value[key])]
    if isinstance(value, list):
        return [n for item in value for n in numeric_scalars(item)]
    return []


def summarize(data_root, provider):
    input_root = data_root / INPUT_DIR
    paths = sorted(input_root.rglob('*.json'))
    if not paths:
        raise SystemExit(f'no input JSON under {input_root}')
    inputs, values = [], []
    for path in paths:
        raw = path.read_bytes()
        found = numeric_scalars(json.loads(raw))
        values.extend(found)
        inputs.append({
            'path': path.relative_to(data_root).as_posix(),
            'sha256': hashlib.sha256(raw).hexdigest(),
            'numeric_count': len(found),
            'numeric_sum': sum(found),
        })
    return {
        'provider': provider,
        'inputs': inputs,
        'numeric_count': len(values),
        'numeric_sum': sum(values),
        'numeric_values': sorted(values),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument('--data-root', type=Path, required=True,
                        help='prepared external data workspace (repository-relative layout)')
    parser.add_argument('--provider', required=True)
    parser.add_argument('--check', action='store_true',
                        help='read-only: compare the existing output instead of writing it')
    args = parser.parse_args()
    data_root = args.data_root.resolve()
    result = summarize(data_root, args.provider)
    text = json.dumps(result, indent=2, sort_keys=True) + '\n'
    out = data_root / OUTPUT_DIR / args.provider / OUTPUT_NAME
    if args.check:
        if not out.is_file() or out.read_text() != text:
            raise SystemExit(f'mismatch: {out}')
        print(f'ok: {out}')
        return
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(text)
    print(f'wrote {out}')


if __name__ == '__main__':
    main()
