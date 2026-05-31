---
name: yield-farmer
description: Find, compare, deposit, and withdraw across DeFi lending protocols (Kamino, Lulo, Aave, Compound)
---

# Yield Farmer

Scan, compare, and optimize DeFi yield positions across lending protocols and liquidity pools on multiple chains.

## Protocol Support

| Protocol | Chains | Type |
|----------|--------|------|
| Kamino | Solana | Lending, LP |
| Lulo | Solana | Lending aggregator |
| Aave v3 | Ethereum, Arbitrum, Base, Polygon, Avalanche, Optimism | Lending |
| Compound v3 | Ethereum, Arbitrum, Base, Polygon | Lending |
| Morpho | Ethereum, Base | Lending optimization |
| Raydium | Solana | LP farming |

## Workflow

1. **Scan Rates** — `get_defi_tvl` and protocol-specific rate queries
2. **Compare Yields** — always show APY from 3+ protocols before recommending
3. **Risk Assessment** — flag smart contract risk, TVL depth, audit status
4. **Deposit** — show the transaction; get confirmation before executing
5. **Monitor** — `get_defi_tvl` weekly to track position health

## Yield Types

| Type | Risk | Typical APY |
|------|------|-------------|
| Stablecoin lending (Aave) | Low | 3-8% |
| Stablecoin LP (Uniswap v3) | Low-Med | 5-15% |
| Volatile lending (ETH, SOL) | Medium | 2-5% |
| Volatile LP (Raydium) | High | 20-100%+ |
| Leveraged yield (Morpho) | Very High | 10-50% |

## Warning Flags

- APY > 100%: high probability of impermanent loss or token dumping
- Protocol with < $10M TVL: elevated smart contract risk
- Unaunched/unverified contracts: DO NOT DEPOSIT
- Unaudited protocols: flag prominently

## Commands

- `/yield [asset]` — scan best rates for an asset across protocols
- `/yield deposit <amount> <asset> <protocol>` — deposit into a position
- `/yield positions` — list active yield positions
- `/yield withdraw <position_id>` — exit a position
