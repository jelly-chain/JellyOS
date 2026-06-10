---
name: max-pain-calculator
description: Options max pain theory for expiry-based price target prediction
author: Tentacle OS
version: 2.0.0
category: derivatives
---

# Max Pain Calculator

Calculate the price at which option buyers suffer maximum loss at expiry.

## Capabilities

- **Max Pain Price**: Strike with maximum combined option loss
- **Pain Distribution**: Visualize pain across all strikes
- **Expiry Analysis**: Track max pain shift as expiry approaches
- **Gamma Exposure**: GEX by strike for market maker hedging
- **Magnet Effect**: Price gravitation toward max pain

## Commands

- `/maxpain <symbol>` — current max pain price
- `/maxpain chart <symbol>` — pain distribution
- `/gex <symbol>` — gamma exposure by strike