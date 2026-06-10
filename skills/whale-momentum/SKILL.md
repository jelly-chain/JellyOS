---
name: whale-momentum
description: Track whale accumulation and distribution patterns for momentum signals
author: Tentacle OS
version: 2.0.0
category: onchain
---

# Whale Momentum

Track large wallet movements for momentum signals.

## Capabilities

- **Accumulation Detection**: Wallets quietly building positions
- **Distribution Detection**: Large holders exiting
- **Exchange Flow**: CEX inflow/outflow correlation
- **Smart Money Index**: Aggregate whale sentiment
- **Momentum Score**: 0-100 whale-driven momentum

## Commands

- `/whale momentum <symbol>` — whale momentum score
- `/whale accumulation <symbol>` — accumulation wallets
- `/whale distribution <symbol>` — distribution wallets
- `/whale exchange <symbol>` — CEX flow data