// MintDetector Types
// Author: Tentacle OS

export interface MintDetectorConfig {
  enabled: boolean;
  threshold: number;
}

export interface MintDetectorResult {
  success: boolean;
  data?: any;
}

export interface MintDetectorMetrics {
  count: number;
  value: number;
}
