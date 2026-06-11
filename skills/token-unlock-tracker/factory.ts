// Factory
import { TokenUnlockTracker } from './index';

export function createTokenUnlockTracker(): TokenUnlockTracker {
  return new TokenUnlockTracker();
}