// Factory - Create yield optimization engine
// Author: Tentacle OS

import { YieldOptimizationEngine } from './index';
import type { YieldConfig } from './types/YieldTypes';

export function createYieldOptimizationEngine(config?: YieldConfig): YieldOptimizationEngine {
  return new YieldOptimizationEngine(config);
}