---
name: carry-trader
description: Cross-asset carry trade with funding rate arbitrage and yield differential capture
author: Tentacle OS
version: 2.0.0
category: trading
---

# Carry Trader

Capture yield differentials and funding rate spreads across assets.

## Capabilities

- **Funding Rate Arbitrage**: Long spot, short perp on positive funding
- **Yield Carry**: Borrow low-yield, deposit high-yield
- **Basis Trading**: Capture futures-spot convergence
- **Cross-Chain Carry**: Exploit yield differences across chains
- **Risk Management**: Liquidation protection, hedge ratios

## Commands

- `/carry scan` — find best carry opportunities
- `/carry rates` — current funding rates across exchanges
- `/carry basis <symbol>` — basis and convergence data
- `/carry positions` — active carry positions