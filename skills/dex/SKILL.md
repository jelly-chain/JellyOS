---
name: dex-trader
description: Execute DEX trades with optimal routing, slippage protection, and post-trade journaling
---

# DEX Trader

Execute swaps and trades across decentralized exchanges with intelligent routing, MEV protection, and automated journaling.

## Pre-Trade Checklist

Always run before executing any trade:

1. **Price Check** — `get_market_data` for current price, 24h change, and volume
2. **Sentiment Overlay** — `get_fear_greed` for market mood context
3. **Funding Rate Scan** — `get_funding_rates` to detect perp market skew
4. **Risk Calc** — `calculate_risk` with entry, stop, and target values

## Routing Rules

| Chain      | Aggregator     | Notes |
|------------|---------------|-------|
| Ethereum   | 1inch/Uniswap  | Use 1inch for orders > $10K |
| Arbitrum   | 1inch/Camelot  | Camelot for low-slippage stable swaps |
| Base       | Aerodrome      | Primary Base DEX |
| BNB Chain  | PancakeSwap    | Default BNB DEX |
| Solana     | Jupiter        | Best execution on Solana |

## Execution Protocol

1. Call `calculate_risk` — never skip this. If R:R < 1.5:1, flag it.
2. Show the trade summary BEFORE calling `execute_trade` — get explicit confirmation
3. After execution, immediately call `set_stop_loss` with a trailing stop if appropriate
4. Journal the trade via `journal_trade` with entry price, size, and reason
5. On profit close, call `vault_sweep` to secure gains

## Position Sizing

- Max single position: 5% of portfolio
- Leverage > 3x: requires explicit override — flag with ⚠ warning
- Never add to a losing position (no averaging down)

## Post-Trade

- `journal_trade` — log entry, exit, PnL, and reasoning
- `vault_sweep` — sweep profits to cold vault after closing
- `portfolio_report` — verify updated allocation

## Common Patterns

### DCA Entry
Split position into 3-5 equal entries over time. Good for high-conviction, uncertain timing.

### Trend Follow
Enter on pullbacks to EMA 20/50. Use `get_signals` to confirm trend direction.

### Breakout Trade
Enter on volume surge + price breaking key resistance. Set tight stop below breakout level.
