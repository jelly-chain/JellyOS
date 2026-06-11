// AirdropHunter Types
// Author: Tentacle OS

export interface AirdropHunterConfig {
  enabled: boolean;
  threshold: number;
}

export interface AirdropHunterResult {
  success: boolean;
  data?: any;
}

export interface AirdropHunterMetrics {
  count: number;
  value: number;
}
