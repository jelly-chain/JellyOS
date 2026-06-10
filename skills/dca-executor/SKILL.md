---
name: dca-executor
description: Dollar-cost averaging execution with interval scheduling and portfolio rebalancing
author: Tentacle OS
version: 2.0.0
category: strategy
---

# DCA Executor

Automated dollar-cost averaging with configurable intervals and amounts.

## Capabilities

- **Interval Scheduling**: Daily, weekly, monthly DCA
- **Portfolio Allocation**: Target weight distribution
- **Price Timing**: Optimal entry timing
- **Rebalancing**: Adjust for price drift

## Commands

- `/dca add <symbol> <amount> <interval>` — add DCA schedule
- `/dca list` — list active schedules
- `/dca cancel <id>` — cancel a schedule
- `/dca next` — show next scheduled buys