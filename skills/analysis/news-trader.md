---
name: news-trader
description: Monitor breaking news, score sentiment impact, map news to prediction markets, and detect unpriced events
---

# News Trader

Monitor breaking news, classify sentiment impact, map headlines to trading and prediction market opportunities, and identify stories the market hasn't priced in yet.

## News Sources

| Source | Tool | Data |
|--------|------|------|
| NewsAPI | `get_news` | Headlines from 80,000+ sources |
| Crypto Panic | `get_news` | Crypto-specific news aggregation |
| Social (X/Reddit) | Social bridge monitoring | Breaking, unverified tips |

## Sentiment Classification

For each news item, classify:

| Impact Level | Price Move Expected | Time to Act |
|-------------|--------------------|-------------|
| Extreme | > 20% swing | Immediately — seconds matter |
| Major | 5–20% swing | Within 1 hour |
| Moderate | 1–5% swing | Research, check priced-in status |
| Minor | < 1% swing | Monitor only |

## News-to-Market Mapping

| News Category | Maps To | Platform |
|--------------|---------|----------|
| ETF approval/denial | Crypto price markets | Polymarket/Kalshi |
| Protocol hack/exploit | Token price, insurance markets | All |
| Regulatory action | Compliance/ban prediction markets | Polymarket |
| Macro data (CPI, FOMC) | Rate prediction markets | Kalshi |
| Political events | Election/legislation markets | All |
| Partnership announcements | Token price, ecosystem growth | On-chain/DEX |

## Unpriced News Detection

How to find markets that haven't yet moved:
1. `get_news` — get breaking headlines
2. For each headline: search correlated markets
3. Check if YES/NO has moved in last hour
4. If price unchanged but news is significant → potential edge
5. Verify the news is real before acting (cross-reference sources)

## Workflow

1. **Scan** — `get_news` for latest headlines
2. **Classify** — score each item for impact and direction
3. **Map** — find correlated trading/prediction targets
4. **Check** — has the market already moved?
5. **Recommend** — suggest highest-EV trade based on news signal
6. **Alert** — if extreme impact, push to Telegram/Discord immediately

## Credibility Assessment

Always assess source credibility:
- **HIGH:** Reuters, Bloomberg, SEC.gov, official protocol announcements
- **MEDIUM:** CoinDesk, The Block, verified Twitter accounts
- **LOW:** Anonymous Telegram/Discord posts, unverified Twitter, 4chan

Flag low-credibility sources explicitly: ⚠ UNVERIFIED SOURCE — verify before trading

## Speed Guidelines

- **Breaking news (extreme impact):** Alert immediately, assess within 30 seconds
- **Scheduled events (FOMC, CPI):** Pre-position analysis, react on release
- **Rumors:** Track but don't trade — wait for confirmation
- **Old news:** If > 1h old and market hasn't moved, it's probably already priced in

## Output Format

```
NEWS SIGNAL: "Fed signals rate cut in September minutes"
────────────────────────────────────────────────────────
Source: Reuters | Time: 6 min ago | Credibility: HIGH

IMPACT
  Sentiment: BULLISH (lower rates = risk-on)
  Magnitude: MAJOR (5-20% expected move)
  Direction: Risk assets ↑, USD ↓, bonds ↑

MARKETS (checked at 14:32 UTC)
  Polymarket "Fed cut Sep"      YES $0.72 → $0.74   (+2¢, partially priced)
  Kalshi "Rate cut in 2024"     YES $0.82 → $0.83   (+1¢, mostly priced)
  BTC/USD                       $76.2K → $77.1K     (+1.2%, moving)

OPPORTUNITY
  Polymarket "Fed cuts 50bps Sep" YES at $0.18
  └─ This market is for a 50bp CUT (more aggressive than 25bp).
     If minutes signal dovish shift, 18% is underpriced.
     BUY YES at $0.18, target $0.30 on Sep decision day.

ALERT: Send to Telegram ✓
```
