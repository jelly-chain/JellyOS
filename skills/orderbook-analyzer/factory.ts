// Factory
import { OrderbookAnalyzer } from './index';

export function createOrderbookAnalyzer(): OrderbookAnalyzer {
  return new OrderbookAnalyzer();
}
