---
name: onchain-analysis
description: Deep on-chain analytics including whale tracking, contract events, TVL monitoring, and gas optimization
author: Tentacle OS
version: 2.0.0
category: blockchain
---

# OnChain Analysis Engine

Deep on-chain analytics for blockchain data - whale transaction monitoring, smart contract event tracking, DeFi TVL analysis, and gas optimization.

## Capabilities

- **Whale Tracking**: Monitor large wallet movements across chains
- **Contract Events**: Real-time smart contract event monitoring
- **TVL Analytics**: Protocol and chain total value locked tracking
- **Gas Optimization**: Multi-chain gas price monitoring and timing
- **Transaction Analysis**: Large transaction detection and classification
- **Protocol Metrics**: Revenue, user counts, and growth metrics

## Data Sources

| Source | Chain | Data |
|--------|-------|------|
| Alchemy RPC | EVM | Transaction history, logs |
| Helius RPC | Solana | Enhanced transactions, token transfers |
| DeFiLlama API | Multi | TVL, protocol data |
| Block Explorers | All | Contract verification, source code |
| Dune Analytics | EVM | Custom queries, dashboards |

## Commands

- `/whale track <address>` — start tracking a whale wallet
- `/whale scan` — scan for large transactions
- `/contract watch <address>` — monitor contract events
- `/tvl <protocol>` — check protocol TVL and changes
- `/gas best` — find optimal gas prices across chains

## Risk Flags

- Large transfers to exchanges = potential selling pressure
- Contract upgrade events = investigation required
- TVL decline > 15% in 24h = red flag
- Gas prices > 100 gwei on L2 = avoid trading