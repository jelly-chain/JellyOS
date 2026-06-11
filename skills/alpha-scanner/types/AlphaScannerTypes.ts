// AlphaScanner Types
// Author: Tentacle OS

export interface AlphaScannerConfig {
  enabled: boolean;
  threshold: number;
}

export interface AlphaScannerResult {
  success: boolean;
  data?: any;
}

export interface AlphaScannerMetrics {
  count: number;
  value: number;
}
