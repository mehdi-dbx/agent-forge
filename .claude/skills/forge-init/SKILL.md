---
name: forge-init
description: Check and install all local prerequisites for agent-forge — uv, Python venv, node.js, npm, visual app node_modules. Claude checks the state first, then offers to run the init script. Triggered when user says /forge-init, "init prereqs", "check prerequisites", "setup local env", "install deps", or gets errors about missing modules.
---

# Agent Forge — Init Prerequisites

Checks and installs everything needed to run agent-forge locally before any Databricks configuration.

## What to check first

Run the check in read-only mode:

```bash
cd /Users/mehdi.lamrani/code/code/airties-workshop && ./scripts/sh/init_prereqs.sh --check 2>&1
```

Parse the output and present a clean summary:

```
Prerequisites — Status

[+]  uv                        0.x.x
[+]  Python venv (.venv)       .venv/
[+]  node.js                   v22.x.x
[+]  npm                       10.x.x
[x]  node_modules (visual/backend)   missing
[x]  node_modules (visual/frontend)  missing
```

## What to offer

If everything is `[+]`: confirm all good, suggest next step → `/forge-setup`.

If anything is `[x]` or missing:

> "Some prerequisites are missing. Want me to run the init script to fix them automatically?"

If the user confirms (or says yes/go/fix/run it), run:

```bash
cd /Users/mehdi.lamrani/code/code/airties-workshop && ./scripts/sh/init_prereqs.sh 2>&1
```

Stream the output so the user can see progress. The script handles everything — uv install, uv sync, npm ci for both visual packages.

## Prerequisites covered

| Check | What it verifies | Auto-fix |
|-------|-----------------|----------|
| uv | on PATH | `pip install uv` |
| Python venv | `.venv/` exists and not stale vs `pyproject.toml` | `uv sync` |
| node.js | on PATH (v18+) | manual — links to nodejs.org |
| npm | on PATH | manual — ships with node.js |
| visual/backend node_modules | `.package-lock.json` sentinel present and fresh | `npm ci` |
| visual/frontend node_modules | `.package-lock.json` sentinel present and fresh | `npm ci` |

## After a successful run

```
  ✓  All prerequisites installed successfully.
  Next: configure your environment →  ./scripts/sh/setup_dbx_env.sh
```

Suggest `/forge-setup` as the natural next step.

## Script locations

| File | Purpose |
|------|---------|
| `scripts/sh/init_prereqs.sh` | Bash entry point — bootstraps uv, then calls Python |
| `scripts/py/init_prereqs.py` | Python script — all checks, spinner progress, auto-fix |

Both accept `--check` flag for read-only mode.
