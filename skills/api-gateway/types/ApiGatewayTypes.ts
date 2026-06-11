// ApiGateway Types
// Author: Tentacle OS

export interface ApiGatewayConfig {
  enabled: boolean;
  threshold: number;
}

export interface ApiGatewayResult {
  success: boolean;
  data?: any;
}

export interface ApiGatewayMetrics {
  count: number;
  value: number;
}
