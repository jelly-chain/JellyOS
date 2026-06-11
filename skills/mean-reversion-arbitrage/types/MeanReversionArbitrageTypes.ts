// MeanReversionArbitrage Types
// Author: Tentacle OS

export interface MeanReversionArbitrageConfig {
  enabled: boolean;
  threshold: number;
}

export interface MeanReversionArbitrageResult {
  success: boolean;
  data?: any;
}

export interface MeanReversionArbitrageMetrics {
  count: number;
  value: number;
}
