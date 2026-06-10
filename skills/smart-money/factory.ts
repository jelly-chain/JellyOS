// Factory
// Author: Tentacle OS
import { SmartMoneyTracker } from './index';

export function createSmartMoneyTracker(): SmartMoneyTracker {
  return new SmartMoneyTracker();
}