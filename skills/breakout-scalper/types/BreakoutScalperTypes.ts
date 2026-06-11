// BreakoutScalper Types
// Author: Tentacle OS

export interface BreakoutScalperConfig {
  enabled: boolean;
  threshold: number;
}

export interface BreakoutScalperResult {
  success: boolean;
  data?: any;
}

export interface BreakoutScalperMetrics {
  count: number;
  value: number;
}
