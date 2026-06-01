---
name: jelly-score
description: Multi-factor prediction scoring engine — combine on-chain data, sentiment, technicals, and fundamentals into one confidence score
---

# Jelly Score Optimizer

The multi-factor prediction scoring engine that combines on-chain data, sentiment analysis, technical indicators, and fundamental context into a single 0-100 confidence score.

## Score Components

| Component | Weight | Source | Tool |
|-----------|--------|--------|------|
| On-Chain | 25% | Whale flows, TVL, active addresses | `scan_chain`, `get_defi_tvl` |
| Sentiment | 25% | F&G, news mood, social buzz | `get_fear_greed`, `get_news` |
| Technical | 25% | RSI, MACD, EMAs, volume profile | `get_technical_indicators` |
| Fundamental | 15% | Protocol revenue, tokenomics | Research + `get_market_data` |
| Signal Confluence | 10% | Cross-source agreement | `get_signals` |

## Scoring Algorithm

```
Raw score for each component: 0–100
Weighted sum = Σ(component_score × weight)
Jelly Score = round(weighted_sum)

Confidence modifier:
  Strong confluence (4/5 components agree):  +10 to score
  Mixed signals (3/5 agree):                  ±0
  Contradiction (2 or fewer agree):          -10 to score
  Data gaps (missing 2+ components):         cap score at 65
```

## Score Interpretation

| Jelly Score | Verdict | Action |
|-------------|---------|--------|
| 85–100 | Strong Conviction | Size position at max allocation |
| 70–84  | Moderate Conviction | Standard position sizing |
| 55–69  | Weak Conviction | Half-size position only |
| 35–54  | Neutral | No trade — wait for better setup |
| 15–34  | Weak Contra-Indication | Consider reducing existing position |
| 0–14   | Strong Contra-Indication | Exit position / go opposite direction |

## Workflow

1. Gather all 5 component scores
2. Check for signal confluence
3. Compute Jelly Score
4. Apply confidence modifier
5. Report score with component breakdown
6. Map to prediction market question if applicable
7. Output recommended action

## Component Scoring Details

### On-Chain (25%)
- Whale net flow: accumulation +15pts, distribution -15pts
- TVL change 24h: +5% = +10pts, -5% = -10pts
- Active addresses trend: up = +5pts, flat = 0, down = -5pts

### Sentiment (25%)
- F&G: 0-24 = +20pts (contrarian), 25-49 = +10pts, 50-74 = -10pts, 75-100 = -20pts
- News sentiment: net positive +10pts, net negative -10pts
- Social buzz: elevated = ±5pts depending on direction

### Technical (25%)
- RSI: > 70 = -15pts, 30-70 = 0, < 30 = +15pts
- MACD: bullish cross = +10pts, bearish cross = -10pts
- Price vs EMA: above 50 = +5pts, below 50 = -5pts

### Fundamental (15%)
- Protocol revenue growth: > 20% MoM = +15pts
- Tokenomics: low inflation = +5pts, high inflation = -10pts
- Development activity: active = +5pts, stale = -10pts

### Signal Confluence (10%)
- 4+ signals agree: +10pts
- 3 signals agree: 0
- 1+ signals agree: -10pts

## Output Format

```
JELLY SCORE: 72/100 — MODERATE CONVICTION
───────────────────────────────────────
On-Chain:     18/25  (+TVL, neutral whales)
Sentiment:    20/25  (F&G fear, bullish news)
Technical:    15/25  (RSI neutral, MACD bullish)
Fundamental:  12/15  (Strong revenue growth)
Confluence:    7/10  (4 of 5 agree)

CONFIDENCE: +10 (strong confluence) → Adjusted: 82/100
Action: BUY with standard position sizing
Stop: Below key support at $X
Target: $Y (previous resistance)
Invalidation: Score drops below 60
```
