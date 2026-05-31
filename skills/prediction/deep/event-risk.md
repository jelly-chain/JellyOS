---
name: event-risk
description: Score and screen events for impact on crypto and prediction markets — regulatory, macroeconomic, geopolitical
---

# Event Risk Scorer

Identify, classify, and score external events (regulatory, macroeconomic, geopolitical, protocol-level) for their potential impact on crypto and prediction markets.

## Event Categories

| Category | Examples | Lead Time |
|----------|----------|-----------|
| Regulatory | SEC rulings, ETF decisions, legislation | Days-Weeks |
| Macroeconomic | FOMC meetings, CPI reports, GDP | Days |
| Geopolitical | Elections, conflicts, trade policies | Hours-Days |
| Protocol | Governance votes, upgrades, hacks | Minutes-Hours |
| Breaking News | Exploits, exchange issues, whale moves | Immediate |

## Impact Scoring

For each event, score three dimensions (0-10 each):

**Probability** — likelihood this event actually occurs (0 = impossible, 10 = certain)
**Magnitude** — how much it moves the market if it occurs (0 = no impact, 10 = extreme)
**Immediacy** — time until impact is felt (0 = months, 10 = right now)

```
Risk Score = (Probability × Magnitude × Immediacy) / 10
Score normalized 0–100
```

| Risk Score | Level | Action |
|------------|-------|--------|
| 0–20  | Background noise | Ignore |
| 21–40 | Monitored | Watch, no action |
| 41–60 | Elevated | Reduce position sizes by 25% |
| 61–80 | High | Reduce positions by 50%, tighten stops |
| 81–100| Critical | Close all correlated positions, go to cash/stablecoins |

## Screening Workflow

1. `get_news` — scan for potential event triggers
2. Classify each event by category
3. Score probability, magnitude, immediacy
4. Map events to affected assets and markets
5. Recommend position adjustments
6. Monitor for event resolution or escalation

## Specific Event Frameworks

### FOMC Rate Decision
- **Probability:** Scheduled, 10/10 certainty of announcement
- **Magnitude:** Rate hike = 8, rate cut = 7, hold = 3
- **Immediacy:** Instant upon release
- **Affected:** BTC, ETH, risk-on assets broadly
- **Action:** Reduce risk positions 4h before, re-enter after volatility settles

### Protocol Upgrade
- **Probability:** Depends on governance status
- **Magnitude:** Major upgrade (The Merge) = 9, minor = 3
- **Immediacy:** At upgrade block
- **Affected:** Native token, ecosystem tokens
- **Action:** Monitor upgrade success before adding to position

### Exchange Hack
- **Probability:** 1-2 (rare but devastating)
- **Magnitude:** Major exchange = 9, minor = 3
- **Immediacy:** 10 — instant market reaction
- **Affected:** Stolen token, exchange token, market-wide if large
- **Action:** Immediate risk-off, assess contagion

## Output Format

```
EVENT RISK REPORT
─────────────────────────────────
Event: SEC Ruling on Ethereum ETF — Decision expected Friday
Category: Regulatory
Probability: 7/10 (highly likely this week)
Magnitude:   8/10 (ETF approval/denial moves ETH 10-20%)
Immediacy:   5/10 (1-3 days out)

RISK SCORE: 28/100 — ELEVATED
  └─ Recommendation: Reduce ETH position by 25%, widen stops
     Increase as decision nears — go to 50% reduction by Thursday

Affected Assets:
  ETH — direct impact (most exposed)
  ARB, OP, MATIC — L2 tokens correlated to ETH
  BTC — indirect (market-wide sentiment)

Monitor: SEC.gov for filing updates / @SECGov on Twitter
```
