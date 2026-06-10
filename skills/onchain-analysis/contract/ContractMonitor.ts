// Contract Monitor - Smart contract event monitoring
// Author: Tentacle OS

import type { OnChainConfig, ContractEvent, OnChainAddress } from '../types/OnChainTypes';
import { Logger } from '../../../../src/core/utils/Logger';
import { Metrics } from '../../../../src/core/utils/Metrics';

const logger = new Logger('ContractMonitor');
const metrics = new Metrics();

export class ContractMonitor {
  private contracts: Map<string, ContractSubscription> = new Map();
  private lastScan: number = 0;
  private checkInterval: number = 30000; // 30 seconds

  constructor(private config: OnChainConfig) {}

  /**
   * Add a contract to monitor
   */
  async addContract(address: string, chain: string, abi?: any): Promise<void> {
    const key = `${chain}:${address}`;

    this.contracts.set(key, {
      address,
      chain,
      abi,
      addedAt: Date.now(),
      lastBlock: 0
    });

    metrics.increment('contract.monitor.added', 1, { chain });
    logger.info(`Monitoring contract ${address} on ${chain}`);
  }

  /**
   * Remove contract from monitoring
   */
  removeContract(address: string, chain: string): boolean {
    const key = `${chain}:${address}`;
    const removed = this.contracts.delete(key);

    if (removed) {
      metrics.increment('contract.monitor.removed', 1, { chain });
    }

    return removed;
  }

  /**
   * Scan for contract events
   */
  async scan(): Promise<ContractEvent[]> {
    const now = Date.now();

    if (now - this.lastScan < this.checkInterval) {
      return [];
    }

    this.lastScan = now;
    const events: ContractEvent[] = [];

    for (const subscription of this.contracts.values()) {
      const contractEvents = await this.scanContract(subscription);
      events.push(...contractEvents);
    }

    return events;
  }

  /**
   * Scan a specific contract
   */
  private async scanContract(subscription: ContractSubscription): Promise<ContractEvent[]> {
    // In production - query logs from last block
    // Mock events for demonstration
    const events: ContractEvent[] = [];

    // Simulate finding events
    if (Math.random() > 0.7) {
      events.push({
        contract: subscription.address,
        chain: subscription.chain,
        eventName: 'Swap',
        params: {
          amount0In: '1000000000000000000',
          amount1Out: '3000000000000000000000',
          sender: '0x' + Math.random().toString(16).slice(2, 42)
        },
        impact: 'medium',
        timestamp: Date.now()
      });

      metrics.increment('contract.events.found', 1, { chain: subscription.chain });
    }

    return events;
  }

  /**
   * Monitor for specific event types
   */
  async monitorEvents(
    address: string,
    chain: string,
    eventNames: string[]
  ): Promise<ContractEvent[]> {
    const events = await this.scan();
    return events.filter(e =>
      e.contract.toLowerCase() === address.toLowerCase() &&
      eventNames.includes(e.eventName)
    );
  }

  /**
   * Classify event impact
   */
  classifyImpact(event: ContractEvent): 'low' | 'medium' | 'high' {
    // Large swaps, admin functions, upgrades are high impact
    if (['Upgrade', 'Admin', 'Withdraw'].includes(event.eventName)) {
      return 'high';
    }

    // Regular swaps, transfers are medium
    if (['Swap', 'Transfer', 'Deposit'].includes(event.eventName)) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Get monitoring stats
   */
  getStats(): { monitored: number } {
    return { monitored: this.contracts.size };
  }

  /**
   * Close monitor
   */
  close(): void {
    this.contracts.clear();
    logger.info('ContractMonitor closed');
  }
}

interface ContractSubscription {
  address: string;
  chain: string;
  abi?: any;
  addedAt: number;
  lastBlock: number;
}