---
name: portfolio-manager
description: Track positions, P&L, allocation, exposure, and generate portfolio reports
---

# Portfolio Manager

Track open positions, calculate realized and unrealized P&L, monitor allocation, and generate comprehensive portfolio reports.

## Position Tracking

JellyOS tracks positions in `~/.jelly/context.json` under the `positions` key. Each position includes:
- `symbol` / `pair` — asset identifier
- `side` / `direction` — long or short
- `size` / `amount` — position size in base asset
- `entry_price` — average entry price
- `current_price` — updated by price feed
- `stop_loss` — stop loss level
- `take_profit` — take profit target
- `status` — open / closed / emergency_closed
- `unrealizedPnl` / `pnl` — current profit/loss

## Portfolio Operations

- `portfolio_report` — full portfolio breakdown with P&L
- `list_positions` — open positions only
- `close_position` — close a specific position
- `journal_trade` — log a completed trade

## Allocation Rules

| Asset Class | Max Allocation |
|-------------|---------------|
| Single token | 25% |
| Correlated group (ETH + L2s) | 40% |
| Stablecoins | No cap |
| Meme coins total | 10% |
| Single meme coin | 3% |

## P&L Calculation

Realized P&L: sum of all closed positions' profit/loss
Unrealized P&L: (current_price - entry_price) * size for each open position
Total P&L: realized + unrealized

## Report Format

```
PORTFOLIO REPORT
─────────────────────────────────
Total Value:  $XXX,XXX (X positions)
Realized P&L: +$X,XXX (all time)
Unrealized:   +$X,XXX

OPEN POSITIONS
Symbol   Side    Size          Entry     Current   P&L      P&L %
BTC      Long    $5,000        73,200    76,450    +$222    +4.4%
ETH      Long    $3,000         2,080     2,145     +$94    +3.1%
SOL      Short   $2,000        88.50     86.12     +$54    +2.7%

EXPOSURE
Crypto total: $10,000 (X% of portfolio)
Largest position: BTC at XX%
Correlated risk: ETH+L2 at XX%

RECOMMENDATIONS
- Consider taking BTC profit at +5% (nearing target)
- SOL short approaching stop at $90 — tighten if needed
```

## Commands

- `/positions` — list open positions
- `/pnl` — profit and loss summary
- `/portfolio` — full portfolio report
- `/close <symbol>` — close a position
