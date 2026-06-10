---
name: yield-optimization
description: Optimize DeFi yield across protocols with risk scoring and impermanent loss protection
author: Tentacle OS
version: 2.0.0
category: defi
---

# Yield Optimization Engine

Find, compare, and optimize DeFi yield positions across protocols with risk scoring and impermanent loss protection.

## Protocols Supported

| Protocol | Chains | Type | Max APY |
|----------|--------|------|---------|
| Aave v3 | ETH, ARB, BASE, MATIC | Lending | 8% |
| Compound v3 | ETH, ARB, BASE | Lending | 6% |
| Kamino | SOL | Lending/LP | 25% |
| Lulo | SOL | Aggregator | 12% |
| Morpho Blue | ETH, BASE | Lending | 15% |
| Uniswap v3 | Multi | LP | 50%+ |

## Risk Scoring

- **TVL < $10M**: High risk (score 3/10)
- **TVL $10M-$100M**: Medium risk (score 6/10)
- **TVL > $100M**: Low risk (score 9/10)
- **Audited**: +2 points
- **< 6 months old**: -2 points

## Commands

- `/yield scan <asset>` — find best rates
- `/yield deposit <protocol> <amount>` — deposit to protocol
- `/yield withdraw <position>` — exit position
- `/yield risk <protocol>` — check risk score
- `/yield positions` — list active positions