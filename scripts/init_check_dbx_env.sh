#!/usr/bin/env bash
# Init & check Databricks resources in .env.local
# Usage:
#   ./scripts/init_check_dbx_env.sh         # interactive init
#   ./scripts/init_check_dbx_env.sh --check # quick check only
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -d "$ROOT/.venv" ]]; then
  echo "ERROR: .venv not found. Run 'uv sync' to install dependencies first."
  exit 1
fi

uv run python scripts/init_check_dbx_env.py "$@"
