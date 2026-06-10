// Prediction Types
// Author: Tentacle OS

export interface PredictionMarket {
  id: string;
  platform: string;
  question: string;
  outcomes: Outcome[];
  volume: number;
  liquidity: number;
  endDate: number;
  tags: string[];
}

export interface Outcome {
  id: string;
  name: string;
  price: number; // YES/NO price or decimal for scalar
  probability: number;
}

export interface ArbitrageOpportunity {
  platformA: string;
  marketA: string;
  priceA: number;
  platformB: string;
  marketB: string;
  priceB: number;
  spread: number;
  netProfit: number;
  direction: 'longA-shortB' | 'longB-shortA';
}

export interface Position {
  id: string;
  platform: string;
  market: string;
  outcome: string;
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  status: 'open' | 'closed';
  timestamp: number;
}

export interface OrderRequest {
  marketId: string;
  side: 'buy' | 'sell';
  outcome: string;
  size: number;
  type: 'limit' | 'market';
  price?: number;
}

export interface OrderResponse {
  id: string;
  status: 'pending' | 'filled' | 'cancelled';
  filledAmount: number;
  averagePrice: number;
}

export interface PortfolioSummary {
  totalValue: number;
  realized: number;
  unrealized: number;
  positions: number;
  platforms: Record<string, number>;
}