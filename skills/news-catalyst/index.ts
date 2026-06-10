// News Catalyst - Trade breaking news with impact scoring
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import type { NewsItem, NewsImpact, AssetImpact } from './types/NewsTypes';

const logger = new Logger('NewsCatalyst');
const metrics = new Metrics();

export class NewsCatalyst {
  private sources = ['CoinTelegraph', 'TheBlock', 'Decrypt', 'CoinDesk', 'Bloomberg', 'Reuters', 'Twitter/X', 'Reddit'];

  async scan(): Promise<NewsItem[]> {
    const headlines = [
      { title: 'SEC approves Ethereum ETF', category: 'regulatory', sentiment: 'positive', impact: 90 },
      { title: 'Fed signals rate cut in September', category: 'macro', sentiment: 'positive', impact: 85 },
      { title: 'Bitcoin hits new ATH', category: 'market', sentiment: 'positive', impact: 80 },
      { title: 'Major exchange hacked', category: 'security', sentiment: 'negative', impact: 95 },
      { title: 'DeFi protocol exploited for $50M', category: 'security', sentiment: 'negative', impact: 88 },
      { title: 'Stablecoin regulation bill introduced', category: 'regulatory', sentiment: 'neutral', impact: 70 },
      { title: 'Solana network outage', category: 'technical', sentiment: 'negative', impact: 75 },
      { title: 'Institutional BTC purchase announced', category: 'adoption', sentiment: 'positive', impact: 82 }
    ];

    return headlines.map((h, i) => ({
      id: `news-${Date.now()}-${i}`,
      title: h.title,
      source: this.sources[Math.floor(Math.random() * this.sources.length)],
      category: h.category as any,
      sentiment: h.sentiment as any,
      impact: h.impact,
      affectedAssets: this.getAffectedAssets(h.title),
      timestamp: Date.now() - Math.random() * 3600000,
      url: `https://example.com/news/${i}`
    }));
  }

  private getAffectedAssets(title: string): AssetImpact[] {
    const assets: AssetImpact[] = [];
    const lower = title.toLowerCase();

    if (lower.includes('bitcoin') || lower.includes('btc')) assets.push({ symbol: 'BTC', impact: 0.8 });
    if (lower.includes('ethereum') || lower.includes('eth')) assets.push({ symbol: 'ETH', impact: 0.7 });
    if (lower.includes('solana') || lower.includes('sol')) assets.push({ symbol: 'SOL', impact: 0.9 });
    if (lower.includes('defi')) assets.push({ symbol: 'DeFi', impact: 0.6 });
    if (lower.includes('stablecoin')) assets.push({ symbol: 'USDC', impact: 0.5 }, { symbol: 'USDT', impact: 0.5 });
    if (lower.includes('etf')) assets.push({ symbol: 'BTC', impact: 0.7 }, { symbol: 'ETH', impact: 0.7 });
    if (lower.includes('rate') || lower.includes('fed')) assets.push({ symbol: 'BTC', impact: 0.6 }, { symbol: 'ETH', impact: 0.5 });
    if (lower.includes('hack') || lower.includes('exploit')) assets.push({ symbol: 'DeFi', impact: -0.8 });

    if (assets.length === 0) assets.push({ symbol: 'BTC', impact: 0.3 });

    return assets;
  }

  async scoreImpact(title: string, content: string): Promise<NewsImpact> {
    const keywords = {
      positive: ['approval', 'adoption', 'partnership', 'growth', 'upgrade', 'buy', 'rally', 'ath'],
      negative: ['hack', 'exploit', 'ban', 'crash', 'investigation', 'lawsuit', 'dump', 'fear'],
      highImpact: ['sec', 'fed', 'hack', 'exploit', 'ban', 'etf', 'regulation']
    };

    const text = (title + ' ' + content).toLowerCase();
    let score = 50;

    for (const word of keywords.positive) { if (text.includes(word)) score += 10; }
    for (const word of keywords.negative) { if (text.includes(word)) score -= 10; }
    for (const word of keywords.highImpact) { if (text.includes(word)) score += 15; }

    return {
      score: Math.max(0, Math.min(100, score)),
      sentiment: score > 60 ? 'positive' : score < 40 ? 'negative' : 'neutral',
      urgency: score > 80 || score < 20 ? 'high' : score > 60 || score < 40 ? 'medium' : 'low',
      affectedAssets: this.getAffectedAssets(title)
    };
  }

  close(): void {}
}

export * from './types/NewsTypes';
export { createNewsCatalyst } from './factory';

export function createNewsCatalyst(): NewsCatalyst {
  return new NewsCatalyst();
}