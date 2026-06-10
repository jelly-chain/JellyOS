---
name: dca-planner
description: Advanced DCA planner with lump-sum vs DCA comparison and optimal entry scheduling
author: Tentacle OS
version: 2.0.0
category: strategy
---

# DCA Planner

Plan and compare dollar-cost averaging strategies.

## Capabilities

- **Lump Sum vs DCA**: Historical performance comparison
- **Optimal Intervals**: Best DCA frequency per asset
- **Amount Optimization**: Kelly-adjusted DCA amounts
- **Entry Timing**: Volatility-adjusted entry sizing
- **Backtesting**: Test DCA strategies on historical data

## Commands

- `/dca plan <symbol> <amount> <period>` — create DCA plan
- `/dca compare <symbol>` — lump sum vs DCA comparison
- `/dca optimize <symbol>` — optimal DCA parameters
- `/dca backtest <symbol> <strategy>` — backtest a DCA strategy