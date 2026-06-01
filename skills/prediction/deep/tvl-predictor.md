---
name: defi-tvl-predictor
description: Use DeFi TVL momentum as leading indicator for ecosystem prediction markets
---

# DeFi TVL Predictor

Track DeFiLlama TVL changes across protocols and chains — use TVL momentum as a leading signal for prediction market positions.

## TVL Momentum Framework

Query DeFiLlama via `get_defi_tvl` for any protocol or chain. Compute momentum across timeframes:

```
TVL Change Thresholds:
  ≥ +15% in 24h  → Strong Bullish
  +5% to +14.9%  → Moderate Bullish
  -4.9% to +4.9% → Neutral
  -5% to -14.9%  → Moderate Bearish
  ≤ -15% in 24h  → Strong Bearish
```

## Jelly Score TVL Component (0–25 pts)

| Signal | Score |
|--------|-------|
| Strong Bullish | 22–25 |
| Moderate Bullish | 15–21 |
| Neutral | 10–14 |
| Moderate Bearish | 5–9 |
| Strong Bearish | 0–4 |

## Correlation Mapping

| Protocol/Chain TVL Move | Predict Impact On |
|------------------------|-------------------|
| Solana TVL ↑ | Solana ecosystem prediction markets |
| Ethereum L2 TVL ↑ | ETH scaling narrative markets |
| DeFi aggregate TVL ↑ | "DeFi summer" / crypto adoption markets |
| Stablecoin TVL ↑ | Market liquidity → bullish for risk assets |
| Bridge inflow ↑ | Chain migration → short source, long destination |

## Workflow

1. Query DeFiLlama: current TVL, 1h ago, 24h ago, 7d ago
2. Compute momentum for each timeframe
3. Classify overall TVL momentum
4. Search Polymarket/Kalshi for related prediction markets
5. Overlay TVL momentum on current YES/NO prices
6. Compute TVL-augmented Jelly Score component
7. Output TVL signal report with market implications

## Important Caveats

- TVL is a lagging indicator in fast-moving markets — combine with price action
- TVL growth from a single whale deposit ≠ organic growth
- Protocol token incentives inflate TVL artificially
- If TVL and price diverge (price ↑ but TVL ↓) = overextension signal
- Chain-wide TVL signals are weaker than protocol-specific (apply 30% discount)

## Report Format

```
TVL PREDICTOR: Solana
────────────────────────
Current TVL:  $4.2B
1h change:    +0.8%
24h change:   +12.4%
7d change:    +18.7%

MOMENTUM: MODERATE BULLISH
TVL Score:   18/25

Correlated Markets (Polymarket):
  "Solana flips Ethereum in DEX volume by Q2"   YES $0.38 ← TVL suggests upside
  "Solana TVL above $5B by June"                YES $0.52 ← TVL path supports

Recommendation: TVL momentum supports bullish thesis on Solana ecosystem.
  Consider BUY YES on TVL target market at current pricing.
  Watch: single protocol (Jito) driving 40% of TVL growth → concentration risk.
```
