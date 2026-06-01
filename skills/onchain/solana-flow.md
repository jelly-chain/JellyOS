---
name: solana-flow-analyst
description: Analyze Solana transaction flows, Raydium liquidity patterns, Jupiter routing, and program-level activity for market signals
---

# Solana Flow Analyst

Deep-dive into Solana blockchain data — transaction flows, DEX routing patterns, program usage, and capital movement for actionable trading signals.

## Core Data Sources

| Source | Tool | What It Reveals |
|--------|------|----------------|
| Helius RPC | `scan_chain` (solana) | Enhanced transactions, token transfers |
| Jupiter API | DEX data | Routing patterns, swap volume |
| Birdeye | `get_token_overview` | Token metrics, holder data |
| DEX Screener | `scan_dex` | Pair data, new listings |
| Solscan/SolanaFM | On-chain explorer | Account activity, program usage |

## Flow Types to Track

### DEX Volume by Aggregator
- Jupiter share vs direct DEX routing
- Rising Jupiter share = more sophisticated traders active
- Falling Jupiter share = retail-dominated period (higher slippage acceptance)

### Token Flow Analysis
- SOL → USDC flow = risk-off rotation
- USDC → SOL flow = risk-on rotation
- USDC → memecoins = speculation heating up
- Memecoins → SOL = profit-taking / rotation

### Program Interaction Patterns
- Spike in Raydium LP creation = new token launches
- Rising Orca Whirlpools usage = concentrated liquidity preference
- Meteora DLMM growth = professional LP strategies
- Jupiter DCA volume = dollar-cost averaging demand

### MEV Activity
- Sandwich attacks detected = MEV bots active
- High priority fees on Jupiter = competitive trading environment
- Jito bundle usage = MEV-aware traders operating

## Signal Generation

| Flow Pattern | Signal | Action |
|-------------|--------|--------|
| SOL → USDC surge (top 10 txns) | Risk-off | Reduce positions |
| USDC → memecoin spike | Speculation | Micro-size meme exposure |
| Jupiter share > 70% | Smart money active | Follow the flow direction |
| Raydium LP creation spike | Launch season | Monitor for migration candidates |
| High MEV activity | Competition | Increase slippage tolerance |

## On-Chain Memecoin Detection

Identify new tokens before they trend:
1. Monitor Raydium new pool creation events
2. Check if pool added within 10 minutes of token creation
3. Filter for SOL pairs with > $20K initial liquidity
4. Cross-reference with social activity (Twitter mentions)
5. Check if dev wallet has history of successful launches

## Solana Health Metrics

| Metric | Healthy Range | Warning Level |
|--------|-------------|---------------|
| TPS | > 2,500 | < 1,000 |
| Block Time | ~400ms | > 800ms |
| Failed Tx Rate | < 15% | > 30% |
| Priority Fee (median) | < 0.0001 SOL | > 0.001 SOL |

## Output Format

```
SOLANA FLOW REPORT
─────────────────────────────────
DEX Volume (24h):  $1.2B
  Jupiter:        72%  (+3% from previous)
  Direct Raydium: 18%  (-2%)
  Orca:            7%  (-1%)
  Other:           3%   (unchanged)

Flow Direction:
  SOL→USDC:  +$45M  (MODERATE RISK-OFF)
  USDC→MEME: +$12M  (SPECULATION ACTIVE)

New Raydium Pools (last 1h):  23
  └─ 5 with > $50K initial liquidity — monitor these:
     · TOKEN1  ($72K Liq, 12min old)
     · TOKEN2  ($58K Liq, 38min old)

Network Health:
  TPS: 3,200 ✓  |  Block Time: 410ms ✓  |  Failed: 12% ✓

Signal: MODERATELY CONSTRUCTIVE
Solana ecosystem healthy. Memecoin activity = speculation but not overheated.
Jupiter dominance suggests sophisticated participation.
Watch: If SOL→USDC accelerates, reduce risk positions.
```
