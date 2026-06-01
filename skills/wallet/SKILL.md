---
name: wallet-manager
description: Generate, list, derive, and sign with HD wallets across 16 chains
---

# Wallet Manager

Manage hierarchical deterministic wallets with BIP39/BIP44 derivation, balance queries, and transaction signing across EVM, Solana, and Cosmos chains.

## Wallet Architecture

```
Trading Wallet (hot) — encrypted on disk, agent can sign
Vault Wallet (cold) — public address only, user holds private key
```

Never expose the cold vault private key. Never store mnemonics in context.

## Operations

- `list_wallets` — show all wallets with balances and chain info
- `wallet_balance` — query balance for specific address/chain
- `derive_address` — derive a new address from the HD wallet (BIP44)
- `generate_wallet` — create a new wallet with BIP39 mnemonic

## Chain Support

Ethereum, Arbitrum, Base, Optimism, Polygon, Avalanche, BNB Chain, Fantom, Gnosis, Celo, Scroll, Linea, zkSync, Mantle, Blast, Solana

## Balance Checking

Use `wallet_balance` with the address and chain. The tool handles RPC routing automatically through the configured Alchemy key.

For Solana: uses Helius RPC or public endpoint fallback.

## Security Rules

- Never print mnemonics or private keys in agent responses
- Derive new receiving addresses for deposits rather than reusing
- Hot wallet should hold only active trading capital — excess goes to vault
- The cold vault address is display-only: the agent CANNOT sign from it
