// FrontrunDetector Types
// Author: Tentacle OS

export interface FrontrunDetectorConfig {
  enabled: boolean;
  threshold: number;
}

export interface FrontrunDetectorResult {
  success: boolean;
  data?: any;
}

export interface FrontrunDetectorMetrics {
  count: number;
  value: number;
}
