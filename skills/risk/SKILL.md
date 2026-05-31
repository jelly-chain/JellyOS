---
name: risk-engine
description: Position sizing, portfolio exposure, stop-loss automation, and risk-reward calculation
---

# Risk Engine

Calculate and enforce position sizing, portfolio risk limits, and automated stop-loss management.

## Risk Calculation

Always call `calculate_risk` before any trade. Provide:
- `entry_price` — intended entry
- `stop_price` — invalidation level
- `target_price` — first take-profit
- `position_size_usd` — intended dollar exposure

The tool returns:
- Risk/Reward ratio
- Max loss in USD and % of portfolio
- Suggested position size if current size exceeds 5% limit

## Risk Limits

- Max position: 5% of total portfolio value
- Max daily drawdown: 10% of portfolio
- Max leverage: 3x (requires explicit override above)
- Min R/R ratio: 1.5:1 before entry

## Stop-Loss Automation

After any trade execution, immediately:
1. Call `set_stop_loss` with entry price and stop level
2. For trend trades: use trailing stops at 1.5x ATR
3. For scalps: use hard stop at 2% below entry
4. Never move a stop further from entry — only tighten

## Portfolio Exposure

- `portfolio_report` — current allocation, unrealized PnL, total exposure
- Single-asset exposure cap: 25% of portfolio
- Correlated assets (ETH + ARB + OP) count as single exposure
- Stablecoin positions exempt from caps

## Kill Switch

If portfolio is down 10% in 24h:
- Stop opening new positions
- Trail stops to breakeven on all open positions
- Alert via `send_telegram` / `send_discord`
