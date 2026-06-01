---
name: gas-tracker
description: Monitor gas prices across 16 chains, predict optimal transaction times, and alert on gas spikes
---

# Gas Tracker

Monitor real-time gas prices across all supported chains, identify cost-efficient transaction windows, and track gas price trends.

## Chain Coverage

Ethereum, Arbitrum, Optimism, Base, Polygon, BNB Chain, Avalanche, Fantom, Gnosis, Celo, Scroll, Linea, zkSync, Mantle, Blast, Solana

## Gas Ranges (Normal Conditions)

| Chain | Typical (gwei) | Cheap (<) | Expensive (>) |
|-------|---------------|-----------|---------------|
| Ethereum | 15–50 | 10 | 80 |
| Arbitrum | 0.01–0.1 | 0.01 | 0.2 |
| Optimism | 0.001–0.01 | 0.001 | 0.05 |
| Base | 0.001–0.01 | 0.001 | 0.05 |
| Polygon | 30–100 | 25 | 200 |
| BNB Chain | 1–5 | 1 | 10 |
| Solana | Fixed (~$0.00025) | Always cheap | N/A |

## Gas Monitoring Commands

- `/gas` — current gas on default chain
- `/gas all` — gas on all chains
- `/gas ethereum` — gas on specific chain
- `/gas alert <chain> <gwei>` — set gas alert

## Transaction Cost Estimation

For Ethereum mainnet:
- Simple ETH transfer: 21,000 gas
- ERC-20 transfer: ~65,000 gas
- Uniswap swap: ~150,000 gas
- Complex DeFi: 250,000–500,000+ gas

Calculate cost: `gas_price × gas_limit × ETH_price / 1e9`

## Optimal Transaction Windows

Historical Ethereum gas patterns:
- **Cheapest:** Saturday-Sunday 2:00–6:00 UTC (~15 gwei)
- **Mid-range:** Weekdays 12:00–16:00 UTC (~30 gwei)
- **Expensive:** Weekdays 14:00–18:00 UTC / NFT mints (~60+ gwei)

L2 chains are consistently cheap — no need to time transactions.

## Gas Spike Alerts

Set alerts for gas spikes that might affect trading:
```text
set_gas_alert chain:ethereum threshold:80
```

Alert fires when gas exceeds threshold. Useful for:
- Delaying non-urgent transactions during NFT mints
- Warning that MEV risk is elevated
- Identifying market activity surges

## Gas Trend Analysis

Pull 7-day gas history to detect patterns:
- Rising gas trend → increased network activity, possibly bullish
- Falling gas trend → decreased demand, possibly consolidation
- Gas spike + high DEX volume → active trading, opportunity or exit signal

## Report Format

```
GAS REPORT — Mon, 10:30 UTC
────────────────────────────
Ethereum   42 gwei  ████████░░  MODERATE
Arbitrum   0.05    ░░░░░░░░░░  CHEAP
Base       0.01    ░░░░░░░░░░  CHEAP
Polygon    78      ████████░░  MODERATE
BNB        3       ░░░░░░░░░░  CHEAP
Solana     Fixed   ░░░░░░░░░░  CHEAP

Transaction Cost (ETH transfer):
  Ethereum: $4.20   |  Arbitrum: $0.01  |  Base: $0.001

Recommended: Use L2s for defi operations today.
If Ethereum is needed, wait for weekend dip to ~15 gwei.
```
