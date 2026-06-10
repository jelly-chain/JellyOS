---
name: gap-filler
description: Identify and trade unfilled price gaps from overnight and weekend sessions
author: Tentacle OS
version: 2.0.0
category: trading
---

# Gap Filler

Trade price gaps that remain unfilled.

## Capabilities

- **Gap Detection**: Identify overnight/weekend gaps
- **Fill Probability**: Historical fill rate analysis
- **Gap Size Classification**: Breakaway, continuation, exhaustion
- **Entry Timing**: Optimal entry for gap fill trades
- **Risk Management**: Stop placement beyond gap boundaries

## Commands

- `/gap scan <symbol>` — find active gaps
- `/gap history <symbol>` — historical gap fill rates
- `/gap stats` — gap fill statistics