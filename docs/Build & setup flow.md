## Build & setup flow

### `scripts/`
| Entry point | Description |
|---|---|
| init & check | Check / configure all env vars |
| start local | Boot backend + frontend locally |

↓

### `data/`
| Directory | Description |
|---|---|
| `csv/` | Raw seed data |
| `init/` | Create schema, tables, genie space, functions, procedures — *run once* |
| `proc/` | Stored procedure definitions |
| `func/` | SQL query templates (used by tools) |
| `py/` | Low-level SQL runners & utilities |

↓

### `tools/`
| Tool | Description |
|---|---|
| query flights | Reads `func/` SQL, hits warehouse |
| update flight risk | Calls stored procedure |

↓

### `agent/`
| Entry point | Description |
|---|---|
| agent | Wires tools + model + Genie MCP |
| start server | Exposes agent + table endpoints |
| `prompts/` | System prompt + user starters |

↓

### `deploy/`
| Entry point | Description |
|---|---|
| sync yml from env | Writes env vars into bundle config |
| `grant/` | UC + warehouse + endpoint permissions |
| deploy | Validate → bundle deploy → run app |