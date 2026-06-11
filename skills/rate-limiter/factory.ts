// Factory
import { RateLimiter } from './index';

export function createRateLimiter(): RateLimiter {
  return new RateLimiter();
}
