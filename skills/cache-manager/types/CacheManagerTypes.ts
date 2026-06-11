// CacheManager Types
// Author: Tentacle OS

export interface CacheManagerConfig {
  enabled: boolean;
  threshold: number;
}

export interface CacheManagerResult {
  success: boolean;
  data?: any;
}

export interface CacheManagerMetrics {
  count: number;
  value: number;
}
