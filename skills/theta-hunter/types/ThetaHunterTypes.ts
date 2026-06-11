// ThetaHunter Types
// Author: Tentacle OS

export interface ThetaHunterConfig {
  enabled: boolean;
  threshold: number;
}

export interface ThetaHunterResult {
  success: boolean;
  data?: any;
}

export interface ThetaHunterMetrics {
  count: number;
  value: number;
}
