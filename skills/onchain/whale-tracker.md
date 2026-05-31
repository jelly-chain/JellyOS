---
name: whale-tracker
description: Monitor whale wallets, detect large transactions, and correlate whale moves with prediction markets
---

# Whale Tracker

Monitor high-value wallet addresses, detect large transactions above configurable thresholds, and map whale movements to trading signals.

## Configuration

Tracked wallets are stored in `~/.jelly/watched-wallets.json`. Add via:
- `watch_wallet` tool — add address, label, chain
- Manual edit of watched-wallets.json

## Whale Qualification

To be treated as a signal, a wallet must meet at least 2 of 3:
1. Portfolio value > $500,000
2. Historical win rate > 60% on trades > $10,000
3. Known smart money label (VC, protocol treasury, DEX expert)

## Transaction Thresholds

- Default signal threshold: $50,000 USD
- Configurable per wallet
- Below threshold transactions are logged but not alerted

## Signal Classification

Each detected transaction is classified:
- **Accumulation** — large buy of a token
- **Distribution** — large sell of a token
- **Neutral** — transfer between own wallets
- **Noise** — below threshold, routine activity

## Correlation Mapping

| Token | Correlated Market |
|-------|------------------|
| SOL, JUP, RAY, BONK | Solana ecosystem prediction markets |
| ETH, WBTC | ETH/BTC price markets |
| BNB, CAKE | BNB Chain ecosystem markets |

## Alert Format

When a qualified whale signal is detected, output:
- Wallet address (truncated), win rate, portfolio value
- Token, amount, USD value, direction (buy/sell)
- Mapped prediction market (if any)
- Signal strength: Strong / Moderate / Weak
- Recommended action: Investigate / Watch / No action

## Automatic Polling

Whale wallets are polled every 60 seconds via `_pollWatchedWallets()`. Detected transactions fire Telegram and Discord alerts.
