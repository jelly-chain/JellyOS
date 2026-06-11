// NftSniper Types
// Author: Tentacle OS

export interface NftSniperConfig {
  enabled: boolean;
  threshold: number;
}

export interface NftSniperResult {
  success: boolean;
  data?: any;
}

export interface NftSniperMetrics {
  count: number;
  value: number;
}
