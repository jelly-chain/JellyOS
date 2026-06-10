---
name: risk-rotator
description: Dynamic risk allocation that rotates between risk-on and risk-off based on market regime
author: Tentacle OS
version: 2.0.0
category: portfolio
---

# Risk Rotator

Dynamically rotate portfolio risk based on market conditions.

## Capabilities

- **Regime Detection**: Classify market into risk-on/risk-off states
- **Risk Budgeting**: Allocate risk capital dynamically
- **Asset Rotation**: Shift between risk-on and risk-off assets
- **Volatility Targeting**: Maintain consistent portfolio vol
- **Drawdown Control**: Reduce exposure after losses

## Commands

- `/riskrot regime` — current risk regime
- `/riskrot allocation` — recommended allocation
- `/riskrot rotate` — execute rotation