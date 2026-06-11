// TrendFader Types
// Author: Tentacle OS

export interface TrendFaderConfig {
  enabled: boolean;
  threshold: number;
}

export interface TrendFaderResult {
  success: boolean;
  data?: any;
}

export interface TrendFaderMetrics {
  count: number;
  value: number;
}
