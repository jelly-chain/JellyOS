// MarketMakingBot Types
// Author: Tentacle OS

export interface MarketMakingBotConfig {
  enabled: boolean;
  threshold: number;
}

export interface MarketMakingBotResult {
  success: boolean;
  data?: any;
}

export interface MarketMakingBotMetrics {
  count: number;
  value: number;
}
