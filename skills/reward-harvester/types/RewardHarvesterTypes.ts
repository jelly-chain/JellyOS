// RewardHarvester Types
// Author: Tentacle OS

export interface RewardHarvesterConfig {
  enabled: boolean;
  threshold: number;
}

export interface RewardHarvesterResult {
  success: boolean;
  data?: any;
}

export interface RewardHarvesterMetrics {
  count: number;
  value: number;
}
