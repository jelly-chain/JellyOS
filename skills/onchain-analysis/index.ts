// OnChain Analysis Engine - Main Entry Point
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import type { WhaleTracker } from './whale/WhaleTracker';
import type { ContractMonitor } from './contract/ContractMonitor';
import type { TVLTracker } from './tvl/TVLTracker';
import type { GasOptimizer } from './gas/GasOptimizer';
import { WhaleTracker as WhaleTrackerImpl } from './whale/WhaleTracker';
import { ContractMonitor as ContractMonitorImpl } from './contract/ContractMonitor';
import { TVLTracker as TVLTrackerImpl } from './tvl/TVLTracker';
import { GasOptimizer as GasOptimizerImpl } from './gas/GasOptimizer';

const logger = new Logger('OnChainAnalysis');
const metrics = new Metrics();

// ============================================================================
// OnChain Analysis Engine Class
// ============================================================================

export interface OnChainConfig {
  chains: string[];
  whaleThreshold: number;
  gasAlertThreshold: number;
  tvlAlertThreshold: number;
  rpcEndpoints: Record<string, string>;
}

export interface OnChainReport {
  whales: WhaleActivity[];
  contracts: ContractEvent[];
  tvl: TVLData[];
  gas: GasData;
  timestamp: number;
}

export interface WhaleActivity {
  address: string;
  chain: string;
  symbol: string;
  amount: number;
  usdValue: number;
  direction: 'in' | 'out';
  timestamp: number;
}

export interface ContractEvent {
  contract: string;
  chain: string;
  event: string;
  params: Record<string, any>;
  impact: 'low' | 'medium' | 'high';
  timestamp: number;
}

export interface TVLData {
  protocol: string;
  chain: string;
  tvl: number;
  change24h: number;
  change7d: number;
}

export interface GasData {
  chain: string;
  fast: number;
  standard: number;
  slow: number;
  baseFee: number;
}

export class OnChainAnalysisEngine {
  private config: OnChainConfig;
  private whaleTracker: WhaleTracker;
  private contractMonitor: ContractMonitor;
  private tvlTracker: TVLTracker;
  private gasOptimizer: GasOptimizer;

  constructor(config?: Partial<OnChainConfig>) {
    this.config = {
      chains: ['ethereum', 'arbitrum', 'base', 'solana', 'bsc'],
      whaleThreshold: 50000, // $50K threshold
      gasAlertThreshold: 50, // gwei
      tvlAlertThreshold: 0.15, // 15% change
      rpcEndpoints: {},
      ...config
    };

    this.whaleTracker = new WhaleTrackerImpl(this.config);
    this.contractMonitor = new ContractMonitorImpl(this.config);
    this.tvlTracker = new TVLTrackerImpl(this.config);
    this.gasOptimizer = new GasOptimizerImpl(this.config);

    logger.info('OnChainAnalysisEngine initialized');
  }

  /**
   * Run full on-chain analysis
   */
  async analyze(): Promise<OnChainReport> {
    const [whales, contracts, tvl, gas] = await Promise.all([
      this.whaleTracker.scan(),
      this.contractMonitor.scan(),
      this.tvlTracker.get(),
      this.gasOptimizer.getPrices()
    ]);

    metrics.increment('onchain.analysis.run', 1);

    return {
      whales,
      contracts,
      tvl,
      gas,
      timestamp: Date.now()
    };
  }

  /**
   * Track a specific whale address
   */
  async trackWhale(address: string, chain: string, label?: string): Promise<void> {
    await this.whaleTracker.addAddress(address, chain, label);
    logger.info(`Tracking whale ${address} on ${chain}`);
  }

  /**
   * Monitor a contract for events
   */
  async monitorContract(address: string, chain: string, abi?: any): Promise<void> {
    await this.contractMonitor.addContract(address, chain, abi);
    logger.info(`Monitoring contract ${address} on ${chain}`);
  }

  /**
   * Get current gas prices
   */
  async getGasPrices(): Promise<GasData[]> {
    return this.gasOptimizer.getPrices();
  }

  /**
   * Find optimal chain for transaction
   */
  async findBestChain(symbol: string, amount: number): Promise<string> {
    return this.gasOptimizer.findOptimalChain(symbol, amount);
  }

  /**
   * Get TVL for specific protocol
   */
  async getTVL(protocol: string): Promise<TVLData[]> {
    return this.tvlTracker.getProtocol(protocol);
  }

  /**
   * Close all resources
   */
  close(): void {
    this.whaleTracker.close();
    this.contractMonitor.close();
    this.tvlTracker.close();
    this.gasOptimizer.close();
    logger.info('OnChainAnalysisEngine closed');
  }
}

// ============================================================================
// Default Export
// ============================================================================

export * from './types/OnChainTypes';
export { WhaleTrackerImpl as WhaleTracker } from './whale/WhaleTracker';
export { ContractMonitorImpl as ContractMonitor } from './contract/ContractMonitor';
export { TVLTrackerImpl as TVLTracker } from './tvl/TVLTracker';
export { GasOptimizerImpl as GasOptimizer } from './gas/GasOptimizer';

export function createOnChainAnalysis(config?: Partial<OnChainConfig>): OnChainAnalysisEngine {
  return new OnChainAnalysisEngine(config);
}