---
name: prediction-trader
description: Trade on Polymarket, Kalshi via CLOB — market search, orderbook depth, orders, and portfolio tracking
---

# Prediction Market Trader

Search, analyze, and trade on prediction markets across Polymarket (CLOB), Kalshi (V3), and predict.fun (BNB Chain).

## Platform Comparison

| Platform | Type | Fees | Blockchains | Best For |
|----------|------|------|-------------|----------|
| Polymarket | CLOB | 0% maker/taker | Polygon | Crypto, politics, world events |
| Kalshi | Exchange | Varies | Off-chain | US politics, economics, weather |
| predict.fun | AMM | 2% | BNB Chain | Crypto, current events, fast markets |

## Market Search

All three platforms support keyword search:
- `scan_polymarket` — search with keyword, get markets with current YES/NO prices
- `scan_kalshi` — browse by category, get binary and scalar markets
- `scan_predictfun` — search prediction markets, view prices and liquidity

## Trade Execution

### Polymarket (CLOB)
1. Get orderbook: `polymarket_orderbook` for bid/ask depth
2. Place limit order or market buy/sell
3. Check fill status
4. Track position in portfolio

### Kalshi
1. Browse events and markets
2. Get current prices (yes_bid, yes_ask, last_price)
3. Place buy/sell order
4. Monitor position

### predict.fun
1. Search market by keyword
2. Place limit or market order
3. Track BNB Chain position

## Analysis Workflow

Before trading any prediction market:
1. **Check implied probability** — is the YES price reasonable?
2. **Compare platforms** — does the same event trade at different prices?
3. **Check volume** — is there enough liquidity to exit?
4. **Check resolution date** — when does this market close?
5. **Read resolution criteria** — understand exactly what determines YES/NO

## Risk Rules for Prediction Markets

- Max single market position: 10% of prediction market portfolio
- Never bet on poorly-defined resolution criteria
- Check if the event is already being manipulated (coordinated betting)
- For binary markets: never pay > 95c for YES or < 5c for NO (limited upside)
- Track prediction market P&L separately from trading P&L

## Example Trade Flow

```
User: "Is Trump going to win the election?"
Agent:
  1. scan_polymarket "Trump win 2024" → YES at $0.62
  2. scan_kalshi "presidential election" → YES at $0.64
  3. Compare: Kalshi $0.64 vs Polymarket $0.62 → Polymarket is cheaper
  4. Check volume: $2.3M on Polymarket — good liquidity
  5. Check polls aggregation — RealClearPolitics avg Trump +1.5
  6. Assessment: $0.62 implied 62% vs polls showing ~48% — market may be overpricing
  7. Recommendation: BUY NO at $0.38 on Polymarket if you believe polls
```

## Portfolio Tracking

All prediction market positions tracked separately from crypto trading positions:
- `/pred positions` — list open prediction positions
- `/pred pnl` — prediction market P&L
- `/pred close` — close/manage prediction positions
