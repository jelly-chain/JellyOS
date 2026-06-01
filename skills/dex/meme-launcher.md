---
name: meme-launcher
description: Monitor and trade pump.fun, four.meme, and Meteora token launches with bonding curve analysis
---

# Meme Launcher

Monitor meme token launchpads (pump.fun, four.meme, Meteora) for new token launches, track bonding curve progress, and identify migration-ready tokens.

## Supported Launchpads

| Platform | Chain | Type | Migration |
|----------|-------|------|-----------|
| pump.fun | Solana | Bonding curve | Raydium at $69K market cap |
| four.meme | BNB Chain | Bonding curve | PancakeSwap at threshold |
| Meteora | Solana | DLMM pools | N/A — launches on Meteora |

## Launch Stages

### New (0–25% of bonding curve)
- Highest risk, lowest information
- Most are abandoned before 30%
- Only follow if dev wallet is doxxed or known

### Finalizing (75–100% of bonding curve)
- Migration imminent — volume surge expected
- Check if the token has a community forming
- Be ready to trade quickly post-migration

### Migrated (> 100%)
- Now on Raydium/PancakeSwap
- Liquidity is live, trading is open
- Assess: did it hold value post-migration or dump?

## Trading Strategy

### Pre-Migration Entry
- Only on tokens with clear narrative, active community, known dev
- Position size: 0.1-0.5% of portfolio (micro bets)
- Expect 90%+ to go to zero
- Exit plan: sell 50% at 2x, let rest ride

### Post-Migration Entry
- Wait 15-30 minutes after migration to see if it holds
- Check holder distribution post-migration
- If top 10 holders > 40% after migration = dump waiting
- Position size: 0.5-1% of portfolio if thesis is strong

### Post-Migration Exit
- Sell 50% at 2x
- Sell 25% at 3x
- Let 25% ride with trailing stop at -30%

## Red Flags

- Dev wallet bought 30%+ of supply before public launch
- Website/socials created < 24h ago
- No Telegram/Discord community
- Previous launches from same dev all rugged
- Contract has mint function callable by dev
- Liquidity burn not confirmed post-migration

## Launch Monitoring

Use `meme-rush` skill or `scan_meme_launches` tool:
```text
scan_meme_launches platform:"pump.fun" stage:"finalizing" min_progress:80
scan_meme_launches platform:"four.meme" filter:"migrated" timeframe:"1h"
```

## Output Format

```
MEME LAUNCH SCAN — pump.fun (Solana)
─────────────────────────────────────
Token        Progress   Volume    Age      Stage
DOGGO        94%        $56K      45min    FINALIZING ★
CATWIF       62%        $18K      2h       In Progress
MOONBOT      22%        $4K       15min    New ⚠
PEPE3        100%       $420K     3h       MIGRATED → Raydium

★ DOGGO: Migration in ~$3K remaining. Check community before.
⚠ MOONBOT: Too early, low volume, skip.
PEPE3: Check post-migration chart — did it dump?
```
