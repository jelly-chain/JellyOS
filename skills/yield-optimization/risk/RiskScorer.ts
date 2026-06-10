// Risk Scorer - Calculate risk scores for yield protocols
// Author: Tentacle OS

import type { RiskScore } from '../types/YieldTypes';
import { Logger } from '../../../../src/core/utils/Logger';

const logger = new Logger('RiskScorer');

export class RiskScorer {
  private cache: Map<string, RiskScore> = new Map();

  /**
   * Score a protocol for risk
   */
  async score(protocol: string, chain: string): Promise<RiskScore> {
    const key = `${chain}:${protocol}`;
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.lastUpdated < 600000) { // 10 min cache
      return cached;
    }

    const score = this.calculateScore(protocol, chain);
    this.cache.set(key, score);

    return score;
  }

  /**
   * Calculate risk score based on multiple factors
   */
  private calculateScore(protocol: string, chain: string): RiskScore {
    const notes: string[] = [];
    let score = 5; // Base score

    // Age factor
    const ageDays = this.getProtocolAge(protocol);
    if (ageDays > 730) {
      score += 3;
      notes.push('Established (>2 years)');
    } else if (ageDays > 365) {
      score += 2;
      notes.push('Mature (>1 year)');
    } else if (ageDays < 90) {
      score -= 2;
      notes.push('New (<3 months)');
    }

    // TVL factor
    const tvl = this.getProtocolTVL(protocol, chain);
    if (tvl > 100000000) { // $100M+
      score += 2;
      notes.push('High TVL');
    } else if (tvl > 10000000) { // $10M+
      score += 1;
      notes.push('Medium TVL');
    }

    // Audit status
    const auditStatus = this.getAuditStatus(protocol);
    if (auditStatus === 'audited') {
      score += 1;
      notes.push('Audited contracts');
    }

    // Chain risk
    if (chain === 'ethereum') {
      score += 0; // Neutral
    } else if (chain === 'solana') {
      score -= 0; // Slightly higher due to network risk
      notes.push('Solana network risk');
    }

    // Protocol-specific adjustments
    if (protocol.toLowerCase().includes('morpheus') || protocol.toLowerCase().includes('new')) {
      score -= 3;
      notes.push('Untested protocol');
    }

    if (protocol.toLowerCase().includes('aave') || protocol.toLowerCase().includes('compound')) {
      score += 1; // Blue chip
      notes.push('Blue chip protocol');
    }

    return {
      score: Math.max(0, Math.min(10, score)),
      auditStatus,
      ageDays,
      tvl,
      notes
    };
  }

  /**
   * Get protocol TVL
   */
  private getProtocolTVL(protocol: string, chain: string): number {
    const tvlMap: Record<string, number> = {
      'aave': 5000000000,
      'compound': 3000000000,
      'kamino': 1500000000,
      'lulo': 800000000,
      'morpho': 2000000000,
      'uniswap': 4000000000,
      'curve': 2500000000,
      'balancer': 800000000
    };

    const baseTvl = tvlMap[protocol.toLowerCase()] || 100000000;
    return chain === 'ethereum' ? baseTvl : baseTvl * 0.3;
  }

  /**
   * Get protocol age in days
   */
  private getProtocolAge(protocol: string): number {
    const ages: Record<string, number> = {
      'aave': 1400,
      'compound': 1800,
      'kamino': 400,
      'lulo': 200,
      'morpho': 500,
      'uniswap': 2000,
      'curve': 1200,
      'balancer': 1000
    };

    return ages[protocol.toLowerCase()] || 0;
  }

  /**
   * Get audit status
   */
  private getAuditStatus(protocol: string): 'audited' | 'unaudited' {
    const audited = ['aave', 'compound', 'uniswap', 'curve', 'balancer', 'morpho', 'kamino', 'lulo'];
    return audited.includes(protocol.toLowerCase()) ? 'audited' : 'unaudited';
  }

  /**
   * Close scorer
   */
  close(): void {
    this.cache.clear();
  }
}