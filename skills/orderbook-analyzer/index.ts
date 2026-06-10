// Orderbook Analyzer - Depth analysis
// Author: Tentacle OS

import { Logger } from '../../../src/core/utils/Logger';

const logger = new Logger('OrderbookAnalyzer');

export interface Orderbook {
  bids: [number, number][];
  asks: [number, number][];
}

export interface LiquidityWall {
  side: 'bid' | 'ask';
  price: number;
  size: number;
  usdValue: number;
}

export interface OrderbookAnalysis {
  spread: number;
  midPrice: number;
  depth: number;
  walls: LiquidityWall[];
  imbalance: number;
}

export class OrderbookAnalyzer {
  analyze(orderbook: Orderbook): OrderbookAnalysis {
    const spread = orderbook.asks[0][0] - orderbook.bids[0][0];
    const midPrice = (orderbook.asks[0][0] + orderbook.bids[0][0]) / 2;

    const bidDepth = orderbook.bids.slice(0, 10).reduce((sum, [, size]) => sum + size, 0);
    const askDepth = orderbook.asks.slice(0, 10).reduce((sum, [, size]) => sum + size, 0);

    const walls = this.findWalls(orderbook);
    const imbalance = (bidDepth - askDepth) / (bidDepth + askDepth);

    return {
      spread,
      midPrice,
      depth: bidDepth + askDepth,
      walls,
      imbalance
    };
  }

  private findWalls(orderbook: Orderbook): LiquidityWall[] {
    const walls: LiquidityWall[] = [];

    for (const [price, size] of orderbook.bids) {
      if (size > 100) { // Large wall threshold
        walls.push({
          side: 'bid',
          price,
          size,
          usdValue: price * size
        });
      }
    }

    for (const [price, size] of orderbook.asks) {
      if (size > 100) {
        walls.push({
          side: 'ask',
          price,
          size,
          usdValue: price * size
        });
      }
    }

    return walls;
  }

  close(): void {}
}