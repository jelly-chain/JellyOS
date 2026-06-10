---
name: airdrop-hunter
description: Discover, track, qualify, and claim airdrops — monitor eligibility criteria, snapshot dates, and claim deadlines
---

# Airdrop Hunter

Discover upcoming airdrops, track eligibility criteria, monitor snapshot dates, and manage claiming across chains.

## Airdrop Discovery

### Tier 1: Confirmed (Snapshot Taken)
- Claim date announced
- Eligibility criteria published
- Tokenomics and allocation known

### Tier 2: Likely (Strong Signals)
- Protocol has confirmed token (tweeted about it)
- Points program active
- Snapshot not yet taken

### Tier 3: Speculative (Rumored)
- Protocol lacks token but has governance hints
- Competitors have launched tokens
- Points program may convert to airdrop

## Qualification Tracking

For each airdrop being tracked:

| Field | Example |
|-------|---------|
| Protocol | LayerZero |
| Status | Tier 2 (points program active) |
| Criteria | Bridge volume > $1K, 10+ txns |
| Current Score | $5.2K volume, 23 txns — QUALIFIED |
| Snapshot | Not yet announced |
| Claim | N/A |

## Qualification Strategies

### Volume-Based Airdrops
- Accumulate transaction count across multiple chains
- Use the protocol weekly to maintain active user status
- Diversify: use 3-5 wallets rather than concentrating

### Stake-Based Airdrops
- Stake native token if available
- Provide liquidity in core pools
- Participate in governance votes

### Points Programs
- Track points accumulation daily
- Understand conversion formula (if known)
- Max out daily/weekly caps where applicable

## Claiming Process

1. Verify eligibility on official claim page (never use random links)
2. Check gas prices — claim when gas < 30 gwei
3. For cross-chain claims: ensure destination chain has gas token
4. After claiming: monitor token listing price
5. Decision: hold or sell? (most airdrops dump on Day 1)

## Risk Management

### Scam Prevention
- Only use official protocol domains (.com, .org, .io)
- Never share private keys or seed phrases for "airdrop verification"
- Verify contract address before approving any token
- Use a dedicated hot wallet for airdrop hunting (not your main wallet)

### Tax Awareness
- Airdrops are taxable events at fair market value on receipt
- Track claim date, token, quantity, and price for tax reporting
- Consider selling 30% immediately to cover tax liability

## Airdrop Calendar Output

```
AIRDROP CALENDAR
═══════════════════════════════════════════

TIER 1 — CONFIRMED
Protocol     Token   Claim Date    Criteria Met?
LayerZero    ZRO     Now open      ✓ Eligible (est. 450 ZRO)
ZkSync       ZK      Jan 15        ✓ Eligible (est. 3,200 ZK)

TIER 2 — LIKELY
Protocol     Points    Score       Status
Scroll       1,250     850/1,000   Close! Bridge $500 more
Base         4,200     Unlimited   Keep transacting weekly
Linea        890       500/1,000   Need 2 more weeks activity

TIER 3 — SPECULATIVE
Protocol     Reason
Monad        Testnet active — no token confirmed
Berachain    Testnet active — points program rumored
EigenLayer   Restaking points — token highly anticipated

ACTION ITEMS
  ⚡ Scroll: bridge $500 more today to hit 1,000 points minimum
  ⚡ Base: do 2 more transactions this week
  📋 LayerZero: claim now before gas spikes
  📋 zkSync: mark Jan 15 — claim day 1 to sell if dumping
```

## Commands

- `/airdrop scan` — discover new airdrop opportunities
- `/airdrop status` — check all tracked airdrop eligibility
- `/airdrop track <protocol>` — add protocol to watchlist
- `/airdrop claim <protocol>` — guide through claim process
