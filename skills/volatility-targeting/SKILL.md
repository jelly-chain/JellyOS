---
name: volatility-targeting
description: Dynamic position sizing based on volatility regime and ATR-based risk adjustment
author: Tentacle OS
version: 2.0.0
category: risk
---

# Volatility Targeting

Adjust position sizes and stops based on current volatility.

## Capabilities

- **ATR Position Sizing**: Risk-based position calculation
- **Volatility Regime**: Scale exposure to vol state
- **Dynamic Stops**: ATR-based stop placement
- **Risk Parity**: Equal risk contribution across positions
- **Kelly Criterion**: Optimal bet sizing

## Commands

- `/voltarget size <symbol> <portfolio>` — optimal position size
- `/voltarget stop <symbol>` — ATR-based stop level
- `/voltarget kelly <symbol>` — Kelly criterion sizing