// Factory - Create pairs trader
// Author: Tentacle OS

import { PairsTrader } from './index';

export function createPairsTrader(): PairsTrader {
  return new PairsTrader();
}