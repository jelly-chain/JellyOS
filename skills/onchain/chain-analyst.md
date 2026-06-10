---
name: onchain-analyst
description: Analyze on-chain data — active addresses, transaction volume, whale flows, staking metrics
---

# On-Chain Analyst

Dive deep into on-chain data: transaction patterns, wallet behaviors, staking metrics, and capital flows across 16 chains.

## Core Metrics

| Metric | Tool | What It Tells You |
|--------|------|------------------|
| Active Addresses | `scan_chain` | Network usage trend |
| Transaction Count | `scan_chain` | Activity level |
| Whale Net Flow | `whale_scan` | Smart money direction |
| Exchange Inflow/Outflow | `scan_chain` | Selling/buying pressure |
| Staking Ratio | `scan_chain` | Supply lockup, conviction |
| TVL by Protocol | `get_defi_tvl` | Capital allocation preference |
| Gas Consumption | `get_gas_prices` | Network demand |
| New Wallet Creation | `scan_chain` | Adoption rate |

## Flow Analysis

### Exchange Flows
- **Net inflow to exchanges > $50M/day** → selling pressure, bearish
- **Net outflow from exchanges > $50M/day** → accumulation, bullish
- **Stablecoin inflow to exchanges** → buying power building, bullish

### Whale Behavior
- **Accumulation during dips** → smart money buying the pullback
- **Distribution into strength** → smart money taking profits
- **Dormant whale activation** → potential large move incoming

### Protocol Metrics
- **TVL growth + new addresses** → genuine adoption
- **TVL growth - new addresses** → existing users adding capital (whale-driven)
- **TVL decline + address growth** → users migrating to competitors

## Analysis Workflow

1. Define the question (e.g., "Is SOL accumulating or distributing?")
2. Pull relevant on-chain metrics
3. Compare current values to 7d/30d averages
4. Identify anomalies (> 2σ from mean)
5. Correlate with price action
6. Report findings with conviction level

## Signal Strength Guidelines

| Data Point | Strong Signal | Weak Signal |
|------------|-------------|------------|
| Exchange outflow | > $100M/day | < $20M/day |
| Whale accumulation | 3+ whales buying | Single whale |
| Active addresses | +20% in 7d | < +5% in 7d |
| Staking ratio change | +5% in 30d | < +1% in 30d |

Never rely on a single on-chain metric in isolation. Always cross-reference at least 3 metrics before drawing a conclusion.

## Output Format

```
ON-CHAIN ANALYSIS: SOL
─────────────────────────────────
Active Addresses:  1.2M/day  (+18% 7d)  BULLISH
Transaction Count: 42M/day    (+12% 7d)  BULLISH
Whale Net Flow:    +$82M       (24h)     BULLISH — 4 whales accumulating
Exchange Flow:     -$45M       (net outflow) BULLISH — moving to custody
Staking Ratio:     72%         (+2% 30d)  NEUTRAL
TVL:               $4.2B       (+12% 24h) BULLISH

OVERALL: MODERATELY BULLISH
4 of 6 metrics positive. No red flags detected.
Conviction: HIGH — signals are consistent and reinforcing.

Risk: Whale activity concentrated in 2 wallets — could reverse quickly.
Next check: Monitor for change in exchange flow direction.
```
