---
name: token-security
description: Audit tokens for honeypots, rug pulls, malicious contracts, and owner privileges before trading
---

# Token Security Auditor

Audit any token contract for security risks before trading — detect honeypots, rug pulls, malicious owner privileges, and suspicious patterns.

## Security Checklist

Before trading any token, run through this checklist:

### Contract Risks
- [ ] Mint function: can new tokens be minted? If yes, by whom?
- [ ] Ownership: is the contract renounced? If not, what can the owner do?
- [ ] Pause/Toggle: can trading be paused? Can sells be disabled?
- [ ] Blacklist: can specific addresses be blocked from selling?
- [ ] Max transaction: is there a buy/sell limit? What is it?
- [ ] Tax/fee: what is the buy/sell tax? Can it be changed?
- [ ] Proxy: is the contract upgradeable? Who controls the implementation?

### Liquidity Risks
- [ ] LP locked: is liquidity locked? How long?
- [ ] LP ownership: who owns the LP tokens? Are they burned?
- [ ] Single-side LP: is liquidity concentrated in one wallet?

### Holder Analysis
- [ ] Top 10 holder concentration: > 50% = high risk
- [ ] Dead wallets: what % is burned?
- [ ] Sniper/bot wallets: how many bought in the first block?

## Risk Scoring

| Score | Verdict |
|-------|---------|
| 0-25  | EXTREME RISK — probable scam |
| 26-50 | HIGH RISK — significant red flags |
| 51-75 | MODERATE RISK — some concerns |
| 76-100| LOW RISK — standard contract |

## Red Flags (Any Single One = Do Not Trade)

- Mint function callable by owner with no cap
- Sell function can be disabled
- Tax/fee can be changed
- Owner can drain LP
- Contract not verified on explorer
- Liquidity was removed and re-added (rug history)

## Tool Usage

Use `query-token-audit` skill or the `audit_token` tool for automated analysis. Always combine automated audit with manual review of:
- Contract source code (if verified)
- Holder distribution on block explorer
- LP lock status on rugcheck.xyz or similar
- Social media presence and age

## Output Format

```
SECURITY AUDIT: <token name> (<symbol>)
─────────────────────────────────────
Contract: <address>
Chain: <chain>
Verified: Yes / No

RISK SCORE: XX/100 (LEVEL)
  Contract:   PASS / WARN / FAIL — <details>
  Holders:    PASS / WARN / FAIL — <top 10 own XX%>
  Liquidity:  PASS / WARN / FAIL — <locked / unlocked / unknown>
  Taxes:      PASS / WARN / FAIL — <buy XX% / sell XX%>
  Ownership:  PASS / WARN / FAIL — <renounced / active>

VERDICT: SAFE TO TRADE / HIGH RISK — CAUTION / DO NOT TRADE
```
