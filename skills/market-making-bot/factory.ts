// Factory
import { MarketMakingBot } from './index';

export function createMarketMakingBot(): MarketMakingBot {
  return new MarketMakingBot();
}
