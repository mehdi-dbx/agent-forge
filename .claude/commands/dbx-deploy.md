# Databricks Bundle Deploy

Deploy the agent-forge app to Databricks Apps via Asset Bundle.

Run the following steps in order:

1. Sync env vars into bundle config:
```bash
.venv/bin/python deploy/sync_databricks_yml_from_env.py
```

2. Run the full deploy script:
```bash
./deploy/deploy.sh
```

Report each step's output clearly. If any step fails, show the error and stop — do not continue to the next step.

Use only command-line style symbols ([+] success, [-] failure, [!] warning). No emojis.
