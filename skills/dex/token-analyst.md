---
name: token-analyst
description: Deep token analysis — holder distribution, top traders, wallet P&L, price charts, and comparisons via Birdeye
---

# Token Analyst

Analyze any token comprehensively: price action, holder distribution, top trader activity, wallet P&L, and market metrics.

## Data Retrieval

Use `get_token_overview` for complete token data:
- Price, 24h volume, market cap, FDV
- Liquidity (total and per-DEX breakdown)
- Holder count and distribution
- Price history (1h, 4h, 1d, 7d, 30d candles)

## Holder Analysis

`get_token_holders` reveals:
- Top 10 holders and % of supply
- Exchange wallets (Binance, Coinbase, etc.)
- Dead/burn wallet percentage
- Team/VC wallet identification
- Sniper wallet detection (bought in first block)

## Wallet P&L

`get_wallet_pnl` for any address:
- Realized P&L
- Win rate
- Average hold time
- Best/worst trades
- Current positions

## Top Traders

`get_top_traders` for any token:
- Highest volume traders in timeframe
- Most profitable traders
- Recent whale entries/exits
- Trader reputation score

## Comparison Framework

When comparing tokens A vs B:

| Metric | Token A | Token B | Winner |
|--------|---------|---------|--------|
| Market Cap | $X | $Y | |
| 24h Volume | $X | $Y | |
| Volume/MCap | X% | Y% | Higher = more active |
| Holders | X | Y | Higher = more distributed |
| Top 10 % | X% | Y% | Lower = less concentrated |
| Age | X days | Y days | Older = more established |
| Price vs 30d Ago | X% | Y% | Context-dependent |

## Risk Flags

- Holders < 100: easily manipulated
- Top 10 holders > 50%: whale-driven, not organic
- Liquidity < $10K: can't exit meaningful positions
- Volume/Liquidity > 5:1: likely wash trading
- No price history > 30 days: too new to evaluate
- Single liquidity pool: vulnerable to pool manipulation

## Output Format

```
TOKEN ANALYSIS: BONK  (So11111111111111111111111111111111111111112)
─────────────────────────────────────────────────────────
Price:    $0.00003421   (+42% 24h, +156% 30d)
MCap:     $2.1B         FDV: $3.2B
Volume:   $380M (24h)   Vol/MCap: 18%
Holders:  847,000+      Listed: 18mo

Holder Distribution:
  Top 10:  12.4%  (well distributed)
  Exchange: 8.2%  (Binance, Coinbase, Kraken)
  Dead:     5.1%  (burn + lost)
  Team:     Unknown

Top Traders (24h):
  Wallet 0xabc...  +$1.2M  (12 trades, 75% win rate)
  Wallet 0xdef...  +$890K  (8 trades, 87% win rate)
  Wallet 0xghi...  -$340K  (5 trades, 20% win rate)

Valuation: High MCap but strong volume and holder base.
Risk: Low — established token with deep liquidity.
```
