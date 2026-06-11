// Factory
import { PortfolioRebalancer } from './index';

export function createPortfolioRebalancer(): PortfolioRebalancer {
  return new PortfolioRebalancer();
}
