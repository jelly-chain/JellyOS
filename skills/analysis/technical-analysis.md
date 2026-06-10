---
name: technical-analysis
description: Compute RSI, MACD, EMAs, Bollinger Bands, ATR, volume profile, and support/resistance — plus chart pattern recognition
---

# Technical Analysis Engine

Calculate technical indicators, identify chart patterns, and generate trade signals from price action and volume data.

## Available Indicators

| Indicator | Tool | Signal Type |
|-----------|------|-------------|
| RSI (14) | `rsi` | Overbought > 70, Oversold < 30 |
| MACD | `macd` | Crossover direction, histogram momentum |
| EMA (20, 50, 200) | `ema` | Trend direction, support/resistance |
| SMA | `sma` | Moving average crossovers |
| Bollinger Bands | `bollingerBands` | Volatility squeeze, overextension |
| ATR | `atr` | Volatility, stop-loss placement |

## RSI Interpretation

| RSI Range | Signal | Action |
|-----------|--------|--------|
| 0–25 | Deeply Oversold | Strong buy signal — contrarian entry |
| 25–30 | Oversold | Buy zone — start accumulating |
| 30–70 | Neutral | Trend is valid — follow direction |
| 70–80 | Overbought | Caution — tighten stops, don't add |
| 80–100 | Deeply Overbought | Sell signal — take profits |

Note: RSI can stay overbought in strong uptrends. Overbought ≠ immediate sell.

## MACD Analysis

- **Bullish Crossover** (MACD line crosses above signal): Buy signal
- **Bearish Crossover** (MACD below signal): Sell signal
- **Histogram Shrinking** (while above zero): Uptrend losing steam
- **Divergence** (price higher high, MACD lower high): Bearish warning
- **Zero-line Crossover** (MACD goes from negative to positive): Major trend shift

## EMA Framework

| EMA | What It Shows |
|-----|--------------|
| EMA 9 | Short-term momentum |
| EMA 20 | 4-week trend, bounce zone |
| EMA 50 | Medium-term trend, key support/resistance |
| EMA 200 | Long-term trend, bull/bear market line |

- **Golden Cross:** EMA 50 crosses above EMA 200 = bullish
- **Death Cross:** EMA 50 crosses below EMA 200 = bearish
- **Price > EMA 20 > EMA 50 > EMA 200:** Perfect uptrend alignment

## Bollinger Bands

- **Squeeze:** bands narrow → big move coming (direction unknown)
- **Walk the Band:** price rides upper band = strong uptrend
- **Bollinger Bounce:** price touches band and reverses = mean reversion
- **Width %:** > 10% = high volatility, < 3% = low volatility

## Pattern Recognition

### Bullish Patterns
- Double Bottom (W-shaped)
- Inverse Head & Shoulders
- Bull Flag (sharp up + consolidation channel)
- Falling Wedge breakout

### Bearish Patterns
- Double Top (M-shaped)
- Head & Shoulders
- Bear Flag (sharp down + consolidation channel)
- Rising Wedge breakdown

### Continuation Patterns
- Symmetrical Triangle (breakout direction follows trend)
- Ascending Triangle (typically bullish)
- Descending Triangle (typically bearish)
- Bull/Bear Pennant (small consolidation after big move)

## Volume Analysis

- **Volume confirms trend:** price ↑ + volume ↑ = strong
- **Volume diverges:** price ↑ + volume ↓ = weakening
- **Volume climax:** extreme volume spike = potential reversal
- **Low volume rally:** easily reversed, lack of conviction

## Multi-Timeframe Analysis

Always check at least 2 timeframes:
- **Higher timeframe (4h/1d):** trend direction, major S/R
- **Lower timeframe (15m/1h):** entry timing, precise stop placement

## Output Format

```
TECHNICAL ANALYSIS: BTC/USD  —  4H Chart
─────────────────────────────────────────
Price: $76,450

RSI (14):    58    NEUTRAL (rising from 45)
MACD:        BULLISH — crossover 3 candles ago, histogram expanding
EMA 20:      $74,200  PRICE ABOVE ✓
EMA 50:      $72,100  PRICE ABOVE ✓
EMA 200:     $65,400  PRICE ABOVE ✓
BB Width:    6.2%     MODERATE VOLATILITY

Pattern: Ascending triangle forming — resistance at $78,000
Volume:  Declining during consolidation (normal)

OVERALL: BULLISH (75/100)
EMA alignment perfect. RSI has room to run. MACD bullish.
Key level: $78,000 breakout → target $82,000.
Stop: Below $74,000 (EMA 20).

Risk: Tight stop placement due to wide BB.
If $78,000 rejects with volume, pattern invalidates.
```
