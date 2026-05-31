---
name: nft-trader
description: Mint, list, bid, sweep, and analyze NFTs with rarity scoring and wash-trade detection
---

# NFT Trader

Mint, trade, and analyze NFTs with rarity scoring, wash-trade detection, and portfolio tracking.

## Capabilities

- **Mint** — `mint_nft` on supported chains (Ethereum, Solana, Base, Polygon)
- **List/Bid** — `list_nft`, `place_bid` on OpenSea/Blur/MagicEden-compatible markets
- **Analyze** — `scan_nft_collection` for floor price, volume, holder distribution
- **Rarity** — compute rarity scores from trait metadata
- **Sweep** — `nft_sweep` to buy multiple floor items at once

## Pre-Trade Checklist

1. `scan_nft_collection` — floor, volume 24h, holders, listings
2. Check wash-trade flag — > 40% of volume from < 3 wallets = suspicious
3. Rarity check — get trait rarity for the specific token
4. Holder concentration — if top 10 holders own > 50%, flag it

## Red Flags

- Collection < 100 unique holders = illiquid
- Wash-trade ratio > 40% of 24h volume
- Creator has rug history on other collections
- No social media presence or socials created < 24h ago
- Metadata not frozen (can be changed post-mint)

## Chain Support

- Ethereum — OpenSea, Blur, LooksRare
- Solana — MagicEden, Tensor
- Base — OpenSea, Zora
- Polygon — OpenSea

## Market Analysis Output

```
NFT ANALYSIS: <collection name>
────────────────────────────
Floor:        <price> ETH/SOL
24h Volume:   <volume>
Listed:       <count> / <total supply>
Unique Owners: <count> (<owner % of supply>%)
Wash Trade:   <clean / suspicious / high>
Rarity Rank:  <rank> / <supply>

VERDICT: <BUY FLOOR / BUY RARE / WATCH / AVOID>
```
