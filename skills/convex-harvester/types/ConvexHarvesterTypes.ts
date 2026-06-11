// ConvexHarvester Types
// Author: Tentacle OS

export interface ConvexHarvesterConfig {
  enabled: boolean;
  threshold: number;
}

export interface ConvexHarvesterResult {
  success: boolean;
  data?: any;
}

export interface ConvexHarvesterMetrics {
  count: number;
  value: number;
}
