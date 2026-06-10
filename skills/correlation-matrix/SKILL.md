---
name: correlation-matrix
description: Dynamic correlation matrix for portfolio hedging and diversification analysis
author: Tentacle OS
version: 2.0.0
category: portfolio
---

# Correlation Matrix

Analyze asset correlations for portfolio construction and hedging.

## Capabilities

- **Rolling Correlation**: Time-varying correlation coefficients
- **Correlation Clusters**: Group assets by correlation
- **Hedge Ratios**: Optimal hedge ratios for pairs
- **Diversification Score**: Portfolio diversification quality
- **Tail Correlation**: Correlation during market stress

## Commands

- `/corr matrix <symbols>` — correlation matrix
- `/corr hedge <symbolA> <symbolB>` — hedge ratio
- `/corr diversify <portfolio>` — diversification score