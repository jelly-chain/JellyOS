// LiquidationBot Types
// Author: Tentacle OS

export interface LiquidationBotConfig {
  enabled: boolean;
  threshold: number;
}

export interface LiquidationBotResult {
  success: boolean;
  data?: any;
}

export interface LiquidationBotMetrics {
  count: number;
  value: number;
}
