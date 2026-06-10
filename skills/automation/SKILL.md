---
name: auto-trader
description: Scheduled tasks, auto-vault sweeps, recurring analysis, and cron-based automation
---

# Automation Engine

Schedule recurring tasks, auto-sweep vault profits, and run automated analysis pipelines.

## Scheduled Tasks

Use `schedule_task` to set up recurring analysis:

```text
schedule_task "Check BTC funding rates every 4 hours"
schedule_task "Sweep profits if vault balance > $500"
schedule_task "Run daily DeFi TVL report at 08:00 UTC"
```

Tasks are stored in `~/.jelly/context.json` under the `schedule` key. The agent runs each active task at the start of every turn, so task frequency depends on interaction frequency.

## Auto-Vault

`auto_vault_threshold` in context.json sets the dollar threshold for auto-sweeping. When portfolio PnL exceeds this threshold, profits are automatically swept to the vault.

```text
/set auto_vault_threshold 500  — auto-sweep at $500 profit
/set auto_vault_threshold 0    — disable auto-sweep
```

## Alert Sweep

`set_alert` creates persistent price alerts that fire even across sessions. Configure once, monitor forever — alerts are stored in `~/.jelly/alerts.json`.

## Context Persistence

JellyOS persists configuration across restarts in `~/.jelly/context.json`:
- `effect_level` — trading intensity (eco/normal/turbo/max)
- `active_chain` — default chain for queries
- `watchlist` — tracked assets
- `risk_profile` — risk tolerance settings
- `schedule` — recurring tasks

## Scheduling Best Practices

- Keep tasks idempotent — they may run multiple times
- Use descriptive task names for audit trail visibility
- Don't schedule price checks more than every 30 minutes
- Combine multiple checks into a single task where possible
