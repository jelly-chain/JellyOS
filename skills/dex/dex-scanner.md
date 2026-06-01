---
name: dex-scanner
description: Scan DEX pairs for new listings, trending tokens, volume spikes, and liquidity analysis via DexScreener
---

# DEX Scanner

Scan decentralized exchange pairs for new listings, trending tokens, and volume anomalies using DexScreener data.

## Capabilities

- **Trending Tokens** — top gainers by 24h volume and price change
- **New Listings** — tokens listed in last 1h, 6h, 24h
- **Pair Analysis** — liquidity, volume, FDV, price history for any pair
- **Volume Spikes** — detect unusual volume increases (> 5x normal)
- **Liquidity Depth** — assess buy/sell depth at different price levels

## Scanning

Use `scan_dex` for DEX pair data:

```text
scan_dex symbol:"BONK" chain:"solana"
scan_dex filter:"new_listings" timeframe:"6h"
scan_dex filter:"trending" min_volume:1000000
```

## Token Evaluation Checklist

For any DEX token being considered:

- **Age:** tokens listed < 2h are extremely high risk
- **Liquidity:** minimum $50K for any trade consideration; $500K+ preferred
- **Volume/Liquidity ratio:** > 2:1 = unusually high turnover, investigate
- **Price discovery:** has the token found a stable range or still volatile?
- **Holder distribution:** check via `get_token_overview`
- **Contract verified:** must be verified on explorer
- **Social presence:** Twitter/Telegram age and activity

## Red Flags

- Liquidity < $10K = can be manipulated by a single $100 trade
- Volume 10x liquidity = likely wash trading or bot activity
- Created < 1h ago with $500K+ volume = coordinated pump
- No social links in token profile = likely throwaway token
- Liquidity unlocked or concentrated in single wallet
- Price chart shows 2+ -90% events = serial rug history

## Trending Token Output

```
DEX TRENDING — SOLANA (Last 6h)
────────────────────────────────────────
Symbol    Price    24h Chg   Volume     Liquidity   Age
BONK      $0.0003   +42%     $12M       $4.5M       18mo
WIF       $2.15     +18%     $28M       $8.2M       6mo
NEWCAT    $0.0001   +850%    $890K      $62K        3h  ⚠ LOW LQ
SAMO      $0.008    +23%     $3.2M      $1.8M       2yr

⚠ NEWCAT: liquidity $62K, age 3h, not verified — HIGH RISK
```

## Commands

- `/dex trending [chain]` — trending tokens on a chain
- `/dex new [timeframe]` — new listings in last N hours
- `/dex pair <address>` — full pair analysis
- `/dex scan <symbol>` — search all chains for a token
