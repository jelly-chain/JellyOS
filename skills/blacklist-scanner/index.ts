// Blacklist Scanner - Address screening
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import type { BlacklistResult, SanctionEntry } from './types/BlacklistTypes';

const logger = new Logger('BlacklistScanner');
const metrics = new Metrics();

export class BlacklistScanner {
  private blacklist: Map<string, SanctionEntry> = new Map();

  constructor() {
    this.loadBlacklist();
  }

  private loadBlacklist(): void {
    const entries: [string, string, string][] = [
      ['0x000000000000000000000000000000000000dEaD', 'scam', 'Burn address'],
      ['0x1234567890abcdef1234567890abcdef12345678', 'ofac', 'OFAC Sanctioned'],
      ['0xabcdef1234567890abcdef1234567890abcdef12', 'hack', 'Known hack address'],
    ];
    for (const [addr, type, reason] of entries) {
      this.blacklist.set(addr.toLowerCase(), { address: addr, type, reason, source: 'database', addedAt: Date.now() });
    }
  }

  async scan(address: string): Promise<BlacklistResult> {
    const entry = this.blacklist.get(address.toLowerCase());
    const flagged = !!entry;

    metrics.increment('blacklist.scan', 1, { flagged: String(flagged) });

    return {
      address,
      flagged,
      entry: entry || null,
      risk: flagged ? 'critical' : 'none',
      timestamp: Date.now()
    };
  }

  async batchScan(addresses: string[]): Promise<BlacklistResult[]> {
    return Promise.all(addresses.map(a => this.scan(a)));
  }

  add(address: string, type: string, reason: string): void {
    this.blacklist.set(address.toLowerCase(), { address, type, reason, source: 'user', addedAt: Date.now() });
  }

  close(): void { this.blacklist.clear(); }
}

export * from './types/BlacklistTypes';


export { createBlacklistScanner } from './factory';
