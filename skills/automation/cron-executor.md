---
name: cron-executor
description: Schedule and execute recurring tasks — periodic analysis, price checks, report generation, and alert routing
---

# Cron Executor

Schedule, manage, and execute recurring tasks on a timer — periodic analysis, health checks, report generation, and automated monitoring.

## Task Management

Tasks are stored in `~/.jelly/context.json` under the `schedule` key. Each task has:
- `task` — description of what to do
- `created` — timestamp
- `active` — boolean

### Commands
```text
schedule_task "Check BTC funding rates every 4 hours"
schedule_task "Run TVL scanner at 08:00 UTC daily"
schedule_task "Sweep profits if > $500" active:false  (pause task)
```

## Task Types

### Market Monitoring
```text
"Check BTC, ETH, SOL prices and flag > 5% moves"
"Monitor funding rates for extreme readings"
"Scan for coins with unusual 24h volume"
```

### Portfolio Management
```text
"Calculate portfolio P&L and report allocation"
"Check all stop-loss levels and suggest adjustments"
"Sweep profits to vault if > $500 unrealized"
```

### Reporting
```text
"Generate daily briefing and send to Telegram at 09:00"
"Compile weekly P&L summary every Monday"
"Run security audit on all held tokens weekly"
```

### Alert Management
```text
"Check all alerts and report triggered conditions"
"Verify alert configurations are still relevant"
```

## Scheduling Logic

Tasks run at the start of each agent turn. The agent checks the schedule block injected by `before_agent_start`, completes any pending tasks, and reports results.

For time-based scheduling, tasks include time checks:
```text
"At 08:00 UTC: Run daily market briefing"
"Every 4 hours from session start: Check funding rates"
```

## Best Practices

1. **Keep tasks idempotent** — they may run multiple times
2. **Be specific** — "Check BTC price" is vague; "Check if BTC moved > 2% in 1h" is actionable
3. **Limit frequency** — no more than checking every 30 minutes
4. **Batch related checks** — one task for "morning routine" vs 10 separate tasks
5. **Use descriptive names** — for audit trail visibility

## Sample Schedule Configuration

```json
{
  "schedule": [
    {
      "task": "At 08:00 UTC: Run daily briefing — prices, news, signals, portfolio",
      "created": 1700000000000,
      "active": true
    },
    {
      "task": "Every 4 hours: Check funding rates on BTC, ETH, SOL — flag extremes",
      "created": 1700000000001,
      "active": true
    },
    {
      "task": "Monitor vault balance — sweep if unlocked balance > $1,000",
      "created": 1700000000002,
      "active": true
    },
    {
      "task": "Every 30 minutes: Scan watched wallets for large transactions",
      "created": 1700000000003,
      "active": false
    }
  ]
}
```

## Integration with Auto-Vault

If `auto_vault_threshold` is set in context.json, the cron executor works alongside AutoVault:
- Cron handles scheduled sweeps ("Sweep profits at 16:00 UTC")
- AutoVault handles threshold-based sweeps (continuous monitoring)

Both can run simultaneously without conflict.
