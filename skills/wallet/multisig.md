---
name: multisig-manager
description: Create, manage, and monitor Gnosis Safe multisig wallets — propose, sign, and execute transactions
---

# Multisig Manager

Create and manage Gnosis Safe multisig wallets, propose transactions, collect signatures, and execute with threshold confirmation.

## Supported Chains

Ethereum, Arbitrum, Optimism, Base, Polygon, BNB Chain, Avalanche, Gnosis Chain

## Setup

A multisig wallet requires:
- **Owners:** list of addresses that can sign
- **Threshold:** number of signatures required (e.g., 2 of 3)
- **Chain:** deployment chain

Gnosis Safe factory is deployed at the same address across all EVM chains.

## Operations

### Create Safe
```text
create_multisig owners:["0x...","0x...","0x..."] threshold:2 chain:"ethereum"
```

Returns the Safe address and deployment transaction.

### Propose Transaction
```text
propose_tx safe:"0x..." to:"0x..." value:"1.5" data:"0x..." chain:"ethereum"
```

Creates a transaction in the Safe's queue. Returns the `safeTxHash` for other signers.

### Sign Transaction
```text
sign_tx safe:"0x..." safeTxHash:"0x..." chain:"ethereum"
```

Adds your signature. When threshold is met, anyone can execute.

### Execute Transaction
```text
execute_tx safe:"0x..." safeTxHash:"0x..." chain:"ethereum"
```

Executes after threshold signatures are collected.

### Check Queue
```text
list_pending_tx safe:"0x..." chain:"ethereum"
```

Shows all pending transactions, current signatures, and threshold status.

## Security Best Practices

- **Threshold > 1:** never use 1-of-N — defeats the purpose
- **Diverse owners:** use hardware wallets + hot wallet, not multiple hot wallets
- **Owner rotation:** periodically verify all owners still have access
- **Gas for execution:** ensure at least one signer has ETH for execution gas
- **Verify transactions:** always decode calldata before signing

## Common Multisig Patterns

### Treasury Management
- 3-of-5 for protocol treasuries
- 2-of-3 for DAO working groups
- Require all signers to verify token amounts and recipient

### Contract Upgrades
- Propose upgrade transaction with new implementation address
- All signers verify the new contract code independently
- Never sign an upgrade without source code verification

### Emergency Actions
- Pre-configure an emergency multisig (2-of-3) for pause/unpause
- Fast signers (hot wallets) for time-sensitive responses
- Combine with timelock for non-emergency changes

## Output Format

```
MULTISIG: 0xABCD...1234 (3-of-5)
─────────────────────────────────
Chain: Ethereum
Owners:  5  |  Threshold: 3
Pending TXs: 2

#42: Send 1.5 ETH → 0xDEF...
  Signatures: 2/3  ████████░░
  Proposed: 2h ago by 0xAAA...
  Remaining: 1 more signature needed

#43: Approve USDC → Uniswap Router
  Signatures: 1/3  ████░░░░░░
  Proposed: 15min ago by 0xBBB...
  Remaining: 2 more signatures needed

Action needed: #42 is ready — one more signature to execute.
```

## Commands

- `/multisig create <owners> <threshold> <chain>` — create new safe
- `/multisig list` — list your safes
- `/multisig queue <safe>` — pending transactions
- `/multisig propose <safe> <to> <value>` — propose transaction
- `/multisig sign <safe> <txHash>` — sign pending transaction
- `/multisig exec <safe> <txHash>` — execute when threshold met
