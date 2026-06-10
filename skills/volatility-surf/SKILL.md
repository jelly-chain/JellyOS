---
name: volatility-surf
description: Trade volatility regimes using IV rank, term structure, and volatility surface analysis
author: Tentacle OS
version: 2.0.0
category: trading
dependencies:
  - @jellyos/agent
---

# Volatility Surfer

Advanced volatility trading strategy leveraging IV rank, term structure, and volatility surface dynamics.

## Capabilities

- **IV Rank Monitoring**: Track implied volatility percentile across assets
- **Term Structure Analysis**: Analyze contango/backwardation in options
- **Volatility Surface**: Detect skew changes and tail risk
- **Volatility Regime**: Classify market into high/low vol states
- **Options Strategies**: Generate straddle, strangle, calendar spread signals

## Trading Signals

| IV Rank | Regime | Action |
|---------|--------|--------|
| 0-20 | Low Vol | Long straddle |
| 20-50 | Normal | Short premium |
| 50-80 | Elevated | Reduce long vol |
| 80-100 | High Vol | Short everything |

## Commands

- `/volsurf <symbol>` — check volatility regime
- `/iv-rank <symbol>` — get IV rank
- `/term-structure <symbol>` — view options curve