---
name: options-analyzer
description: Options chain analysis with Greeks, IV skew, and strategy recommendations
author: Tentacle OS
version: 2.0.0
category: derivatives
---

# Options Analyzer

Full options chain analysis with Greeks, IV skew, and automated strategy recommendations.

## Capabilities

- **Greeks Calculation**: Delta, Gamma, Theta, Vega, Rho
- **IV Skew Analysis**: Put/Call IV ratio, term structure
- **Strategy Builder**: Spreads, straddles, condors, butterflies
- **Risk Profile**: P&L visualization at expiry
- **Unusual Activity**: Volume/OI anomaly detection

## Commands

- `/options chain <symbol>` — full options chain
- `/options greeks <symbol> <strike>` — Greeks for a strike
- `/options skew <symbol>` — IV skew chart
- `/options strategy <symbol>` — recommended strategies