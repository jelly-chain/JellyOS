// News Filter - News impact analysis
// Author: Tentacle OS

import { Logger } from '../../../src/core/utils/Logger';

const logger = new Logger('NewsFilter');

export interface NewsItem {
  title: string;
  content: string;
  source: string;
  timestamp: number;
  category: 'regulatory' | 'macro' | 'protocol' | 'exchange' | 'general';
}

export interface NewsAnalysis {
  item: NewsItem;
  impact: number; // 0-100
  sentiment: 'positive' | 'negative' | 'neutral';
  affectedAssets: string[];
  urgency: 'low' | 'medium' | 'high';
}

export class NewsFilter {
  private keywords: Map<string, string[]> = new Map();

  constructor() {
    this.initializeKeywords();
  }

  private initializeKeywords(): void {
    this.keywords.set('positive', ['approval', 'upgrade', 'launch', 'partnership', 'profit', 'ath']);
    this.keywords.set('negative', ['hack', 'exploit', 'ban', 'investigation', 'crash', 'bankruptcy']);
    this.keywords.set('macro', ['fed', 'inflation', 'cpi', 'employment', 'rates', 'recession']);
    this.keywords.set('regulatory', ['sec', 'regulation', 'compliance', 'lawsuit', 'etf', 'approval']);
  }

  analyze(item: NewsItem): NewsAnalysis {
    const sentiment = this.getSentiment(item);
    const impact = this.getImpact(item, sentiment);
    const affected = this.getAffectedAssets(item);
    const urgency = this.getUrgency(impact, item.category);

    return {
      item,
      impact,
      sentiment,
      affectedAssets: affected,
      urgency
    };
  }

  private getSentiment(item: NewsItem): 'positive' | 'negative' | 'neutral' {
    const content = (item.title + ' ' + item.content).toLowerCase();
    const pos = this.keywords.get('positive')!.filter(k => content.includes(k));
    const neg = this.keywords.get('negative')!.filter(k => content.includes(k));

    if (pos.length > neg.length) return 'positive';
    if (neg.length > pos.length) return 'negative';
    return 'neutral';
  }

  private getImpact(item: NewsItem, sentiment: string): number {
    let impact = 30;

    if (item.category === 'regulatory') impact = 80;
    if (item.category === 'macro') impact = 70;
    if (item.category === 'protocol') impact = 50;
    if (item.category === 'exchange') impact = 60;

    if (sentiment === 'positive') impact += 10;
    if (sentiment === 'negative') impact += 20;

    return Math.min(100, impact);
  }

  private getAffectedAssets(item: NewsItem): string[] {
    const content = (item.title + ' ' + item.content).toLowerCase();
    const assets: string[] = [];

    const knownAssets = ['bitcoin', 'ethereum', 'solana', 'bnb', 'xrp', 'cardano', 'dogecoin'];
    for (const asset of knownAssets) {
      if (content.includes(asset)) assets.push(asset.toUpperCase());
    }

    return assets;
  }

  private getUrgency(impact: number, category: string): 'low' | 'medium' | 'high' {
    if (impact > 70 || category === 'macro') return 'high';
    if (impact > 40) return 'medium';
    return 'low';
  }

  close(): void {
    this.keywords.clear();
  }
}