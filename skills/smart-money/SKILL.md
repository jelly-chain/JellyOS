---
name: smart-money
description: Track smart money wallets, copy-trade signals, and institutional flow analysis
author: Tentacle OS
version: 2.0.0
category: onchain
---

# Smart Money Tracker

Follow the money. Track institutional wallets, VC movements, and proven traders.

## Capabilities

- **Wallet Labeling**: Identify known smart money addresses
- **Copy Trade Signals**: Real-time trade alerts from top wallets
- **Institutional Flow**: Large transaction monitoring
- **Win Rate Tracking**: Historical performance of tracked wallets
- **Alpha Scoring**: Rank wallets by profitability

## Wallet Categories

| Category | Description |
|----------|-------------|
| VC/Fund | a16z, Paradigm, Pantera, etc. |
| DEX Whale | High-volume DEX traders |
| MEV Bot | Profitable MEV searchers |
| Protocol Treasury | Uniswap, Aave, etc. |
| Insider | Team/early investor wallets |

## Commands

- `/smart track <address>` — track a wallet
- `/smart leaderboard` — top wallets by PnL
- `/smart feed` — live smart money activity
- `/smart copy <address>` — enable copy-trading