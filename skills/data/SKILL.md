---
name: data-fetcher
description: Fetch market data, on-chain analytics, DeFi TVL, gas prices, and whale movements
---

# Data Fetcher

Retrieve, cache, and synthesize blockchain and market data from multiple sources.

## Data Sources

| Source | Tool | Data |
|--------|------|------|
| Price Feed | `get_market_data` | Price, 24h change, volume |
| Alternative.me | `get_fear_greed` | Fear & Greed Index |
| DeFiLlama | `get_defi_tvl` | Protocol/chain TVL |
| Alchemy | `scan_chain` | Whale movements, transactions |
| DexScreener | `scan_dex` | DEX pair data, new listings |
| Birdeye | `get_token_overview` | Holder analysis, trending |

## Fetching Patterns

### Market Overview
```text
1. get_market_data → prices, volume, 24h change
2. get_fear_greed → market sentiment score
3. get_funding_rates → perp market skew
4. get_defi_tvl → capital flow direction
```

### Token Deep-Dive
```text
1. get_token_overview → price, holders, liquidity
2. scan_dex → DEX pairs, recent trades
3. scan_chain → whale movements for token
4. get_signals → cross-source signal confluence
```

### Chain Health
```text
1. get_gas_prices → all chains gas in gwei
2. get_defi_tvl → chain TVL trend
3. scan_chain → recent large transactions
```

## Caching

- Price data: max 60s stale
- TVL data: max 5min stale
- Gas prices: max 30s stale
- Whale movements: real-time only

Never present stale data without noting the timestamp.
