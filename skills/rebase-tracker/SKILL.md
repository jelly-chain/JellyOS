---
name: rebase-tracker
description: Monitor algorithmic rebase tokens with supply changes and peg stability
author: Tentacle OS
version: 2.0.0
category: defi
---

# Rebase Tracker

Monitor algorithmic tokens with elastic supply mechanisms.

## Capabilities

- **Rebase Schedule**: Next rebase timing and expected supply change
- **Peg Stability**: Deviation from target price
- **Supply History**: Historical expansion/contraction
- **Yield Accrual**: Rebase yield calculation
- **Depeg Risk**: Early warning for peg breaks

## Commands

- `/rebase list` — tracked rebase tokens
- `/rebase add <token>` — start tracking
- `/rebase schedule <token>` — next rebase info
- `/rebase yield <token>` — current rebase APY