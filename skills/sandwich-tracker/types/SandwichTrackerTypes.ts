// SandwichTracker Types
// Author: Tentacle OS

export interface SandwichTrackerConfig {
  enabled: boolean;
  threshold: number;
}

export interface SandwichTrackerResult {
  success: boolean;
  data?: any;
}

export interface SandwichTrackerMetrics {
  count: number;
  value: number;
}
