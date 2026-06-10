// News Catalyst Types
// Author: Tentacle OS

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  category: 'regulatory' | 'macro' | 'market' | 'security' | 'technical' | 'adoption';
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: number;
  affectedAssets: AssetImpact[];
  timestamp: number;
  url: string;
}

export interface NewsImpact {
  score: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  urgency: 'low' | 'medium' | 'high';
  affectedAssets: AssetImpact[];
}

export interface AssetImpact {
  symbol: string;
  impact: number;
}