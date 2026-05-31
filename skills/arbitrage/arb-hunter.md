---
name: arbitrage-hunter
description: Scan for cross-chain, cross-DEX, and cross-platform arbitrage opportunities with profit calculation
---

# Arbitrage Hunter

Detect price discrepancies across chains, DEXes, and prediction market platforms — identify arbitrage opportunities with net profit calculation after fees and slippage.

## Arbitrage Types

| Type | Description | Speed Required |
|------|-------------|---------------|
| Cross-chain | Same token, different chains | Minutes |
| Cross-DEX | Same chain, different DEXes | Seconds |
| Triangular | A → B → C → A on same DEX | < 1 second |
| CEX-DEX | Binance vs Uniswap/Jupiter | Seconds |
| Prediction Market | Kalshi vs Polymarket same event | Minutes |
| Cross-platform Arb | Different platforms, correlated events | Minutes-Hours |

## Scanning

Use `scan_arbitrage` to check opportunities:

```text
scan_arbitrage symbol:ETH min_profit_pct:0.5
```

The tool checks:
1. Price across configured chains via RPC/feed
2. DEX liquidity depth for each chain
3. Bridge fees and gas costs for cross-chain routes
4. Net profit after all costs

## Profit Calculation

```
Gross profit = |price_A - price_B|
Net profit   = gross_profit - gas_cost - bridge_fee - slippage_estimate
Profit %     = net_profit / trade_value * 100
```

Minimum thresholds:
- Intra-chain arb: 0.3% net (after gas)
- Cross-chain arb: 1.0% net (after gas + bridge fees)
- CEX-DEX arb: 0.5% net (after withdrawal fees)
- Prediction market arb: 2% edge (after platform fees)

## Prediction Market Arbitrage

When comparing markets across platforms:
1. `scan_polymarket` — get current YES/NO prices
2. `scan_kalshi` — get equivalent market prices
3. `scan_predictfun` — BNB Chain prediction markets
4. Calculate implied probability gap
5. Adjust for platform-specific fees (Polymarket: 0%, Kalshi: varies)

Must hold opposite positions on both platforms simultaneously to lock in arb.

## Warning Flags

- Low liquidity on one side: arb may be theoretical only
- MEV risk on Ethereum: your arb tx may be frontrun
- Bridge delays > 30 min: price may move against you
- KYC requirements on one platform: may block withdrawal
- Suspicious price feed: verify with secondary source

## Report Format

```
ARB SCAN: ETH
────────────
Source    Chain      Price     Destination  Chain      Price     Spread   Net
Uniswap   Ethereum   $3,245    PancakeSwap  BNB        $3,278    1.02%    0.45%
├─ Gas: $12 (Eth) + $0.50 (BSC)
├─ Bridge fee: ~$16 (Stargate, 5 min)
└─ Slippage est: 0.1%

ACTONABLE: No — net 0.45% below 1% cross-chain threshold

Jupiter   Solana     $3,240    Uniswap      Ethereum   $3,245    0.15%    —
└─ Not actionable: Solana→ETH bridge $20+ kills spread
```

## Commands

- `/arb <symbol>` — scan arbitrage for a specific asset
- `/arb pred <topic>` — scan prediction market arb opportunities
