---
name: cross-chain-bridge
description: Bridge assets across 16 chains with fee estimation, route optimization, and arrival confirmation
---

# Cross-Chain Bridge

Bridge tokens across supported chains with fee estimation, optimal route selection, and arrival confirmation.

## Supported Chains

Ethereum, Arbitrum, Optimism, Base, Polygon, Avalanche, BNB Chain, Fantom, Gnosis, Celo, Scroll, Linea, zkSync, Mantle, Blast, Solana

## Bridge Protocols

| Protocol | Chains | Best For |
|----------|--------|----------|
| LayerZero | Universal | General bridging, wide chain support |
| Across | L2 ↔ L2 | Fastest L2 transfers |
| Wormhole | Solana ↔ EVM | Solana cross-chain |
| Stargate | Universal | Stablecoin bridging, low slippage |
| Hop Protocol | Ethereum + L2s | ETH and stablecoin rollup transfers |

## Pre-Bridge Checklist

1. Check gas prices on both source and destination chains (`get_gas_prices`)
2. Estimate bridge fees — some protocols charge 0.05% + gas
3. Check bridge contract TVL — low TVL = potential liquidity issues
4. Confirm the destination address before broadcasting
5. Note expected arrival time (2-30 minutes depending on chain)

## Workflow

1. `check_bridge_routes` — get available routes, fees, estimated time
2. Show the comparison table with fees and ETA
3. Get user confirmation before calling `bridge_assets`
4. After broadcast: call `verify_bridge_status` with the source tx hash
5. Confirm arrival on destination chain with balance check

## Warning Flags

- Bridge with < $1M TVL: high risk of stalled transfers
- Destination chain gas > 100 gwei: wait for lower gas
- Bridge contract not verified on Etherscan: DO NOT USE
- Unknown/unaudited bridge protocol: DO NOT USE

## Fee Reference

| Chain Pair | Typical Fee | Typical Time |
|------------|------------|-------------|
| Ethereum → Arbitrum | ~$3-8 | 10 min |
| Ethereum → Base | ~$3-5 | 5 min |
| Arbitrum → Optimism | ~$1-2 | 2 min |
| Ethereum → Solana | ~$5-15 | 15 min |

Always show the estimated fee and time BEFORE executing.