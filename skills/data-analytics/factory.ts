// Factory - Create data analytics engine
// Author: Tentacle OS

import { DataAnalyticsEngine } from './index';
import type { DataAnalyticsConfig } from './types/DataAnalyticsTypes';

export function createDataAnalytics(config?: DataAnalyticsConfig): DataAnalyticsEngine {
  return new DataAnalyticsEngine(config);
}