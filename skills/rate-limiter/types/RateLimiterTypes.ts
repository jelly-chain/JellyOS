// RateLimiter Types
// Author: Tentacle OS

export interface RateLimiterConfig {
  enabled: boolean;
  threshold: number;
}

export interface RateLimiterResult {
  success: boolean;
  data?: any;
}

export interface RateLimiterMetrics {
  count: number;
  value: number;
}
