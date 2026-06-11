// EventBus Types
// Author: Tentacle OS

export interface EventBusConfig {
  enabled: boolean;
  threshold: number;
}

export interface EventBusResult {
  success: boolean;
  data?: any;
}

export interface EventBusMetrics {
  count: number;
  value: number;
}
