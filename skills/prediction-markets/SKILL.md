---
name: prediction-markets
description: Trade prediction markets across Polymarket, Kalshi, and predict.fun with arbitrage detection and risk modeling
author: Tentacle OS
version: 2.0.0
category: prediction
---

# Prediction Markets Engine

Cross-platform prediction market trading with arbitrage detection, event modeling, and portfolio management.

## Platforms

| Platform | Type | Fees | Chains |
|----------|------|------|--------|
| Polymarket | CLOB | 0% maker/taker | Polygon |
| Kalshi | Exchange | Varies | Off-chain |
| predict.fun | AMM | 2% | BNB Chain |

## Capabilities

- **Market Search**: Find markets by keyword across platforms
- **Arbitrage Detection**: Cross-platform price discrepancies
- **Event Modeling**: Probability modeling for outcomes
- **Portfolio Tracking**: Positions and P&L across platforms
- **Risk Management**: Position sizing and hedge recommendations

## Arbitrage Detection

| Spread | Action |
|--------|--------|
| > 5% | Immediate arb opportunity |
| 2-5% | Wait for confirmation |
| < 2% | Not worth gas fees |

## Commands

- `/pred scan <topic>` — search markets across platforms
- `/pred arb <symbol>` — check for arbitrage opportunities
- `/pred positions` — list open positions
- `/pred pnl` — prediction market P&L
- `/pred close <market>` — close a position