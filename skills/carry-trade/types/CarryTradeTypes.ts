// CarryTrade Types
// Author: Tentacle OS

export interface CarryTradeConfig {
  enabled: boolean;
  threshold: number;
}

export interface CarryTradeResult {
  success: boolean;
  data?: any;
}

export interface CarryTradeMetrics {
  count: number;
  value: number;
}
