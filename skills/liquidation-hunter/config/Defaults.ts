// Defaults - Configuration defaults
// Author: Tentacle OS

export const defaultTimeouts = {
  request: 30000,
  websocket: 60000,
  cache: 300000
};

export const defaultThresholds = {
  whale: 100000,
  largeTx: 10000,
  minLiquidity: 1000000,
  maxSlippage: 0.01
};

export const defaultLimits = {
  pageSize: 100,
  maxRetries: 3,
  rateLimit: 10
};
