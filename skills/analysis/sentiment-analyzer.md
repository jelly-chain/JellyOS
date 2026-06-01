---
name: sentiment-analyzer
description: Analyze news sentiment, social media buzz, Fear & Greed Index, and cross-source signal confluence
---

# Sentiment Analyzer

Synthesize market sentiment from news, social media indicators, Fear & Greed Index, and on-chain signals into actionable bias.

## Data Sources

| Source | Tool | Weight |
|--------|------|--------|
| Fear & Greed Index | `get_fear_greed` | 25% |
| News Sentiment | `get_news` + `score_sentiment` | 25% |
| Funding Rates | `get_funding_rates` | 20% |
| Social Volume | scan for volume spikes | 15% |
| Whale Activity | `whale_scan` | 15% |

## Sentiment Scoring

Combined score runs 0-100:

| Score | Reading | Bias |
|-------|---------|----- |
| 0-24  | Extreme Fear | Contrarian buy — accumulation zone |
| 25-49 | Fear | Cautious long — scale in slowly |
| 50-74 | Greed | Neutral — wait for pullback |
| 75-100| Extreme Greed | Reduce longs, tighten stops, consider shorts |

## News-Specific Analysis

When news articles are available:
1. Extract entity mentions (tokens, protocols, chains)
2. Classify per-entity sentiment (positive/negative/neutral)
3. Score impact magnitude (minor 1-5% / major 5-20% / extreme >20%)
4. Check if market has already priced in the news
5. Identify lagging markets that haven't reacted yet

## Social Media Buzz Detection

- Volume spike > 3x normal = potential catalyst
- Semantic shift from neutral to emotional = conviction building
- Coordinated posting patterns = possible manipulation, flag it

## Output Format

```
SENTIMENT REPORT
────────────────
Fear & Greed: 65/100 (Greed)
News Score:   +18% (Bullish — 12p / 3n / 5 neutral)
Funding:      Normal (+0.02% avg)
Social Buzz:  Elevated — BTC mentions +240% in 4h

OVERALL: MODERATELY BULLISH (62/100)
Bias: Cautious accumulation — wait for F&G pullback to 50

Key Risk: Social buzz may be driven by single event. Verify duration.
```
