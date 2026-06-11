// SortinoTracker Types
// Author: Tentacle OS

export interface SortinoTrackerConfig {
  enabled: boolean;
  threshold: number;
}

export interface SortinoTrackerResult {
  success: boolean;
  data?: any;
}

export interface SortinoTrackerMetrics {
  count: number;
  value: number;
}
