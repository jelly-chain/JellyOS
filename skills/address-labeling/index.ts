// Address Labeling - Identify known addresses
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import type { AddressLabel, LabelCategory } from './types/AddressLabelingTypes';

const logger = new Logger('AddressLabeling');
const metrics = new Metrics();

export class AddressLabeler {
  private knownAddresses: Map<string, AddressLabel> = new Map();

  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    const labels: [string, LabelCategory, string][] = [
      ['0x3f5CE5FBFeB3E9B5C6d9C6F12C4e7E4B8E6a1F8D5', 'cex', 'Binance Hot Wallet'],
      ['0xFE81732Aae5815E42A7b4B6B8d5Bc5c5B8e3F1A2', 'cex', 'Coinbase Hot Wallet'],
      ['0x5642934Ec79cE73Cf8D21C22F129F19956Aa622aB', 'cex', 'OKEx Hot Wallet'],
      ['0x71C765A1e33a6d3E6b2bA0C54E2F5f7C5cA7E8d2', 'cex', 'KuCoin Hot Wallet'],
      ['0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549', 'cex', 'a16z Wallet'],
      ['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', 'whale', 'Top 10 Whale'],
      ['0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 'dex', 'Uniswap V2 Router'],
      ['0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 'dex', 'Uniswap V3 Router'],
      ['0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45', 'dex', 'Uniswap V3 Universal Router'],
      ['0xE592427A0AEce92De3Edee1F18E0157C05861564', 'dex', 'Uniswap V3 SwapRouter'],
      ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 'protocol', 'USDC Contract'],
      ['0xdAC17F958D2ee523a2206206994597C13D831ec7', 'protocol', 'USDT Contract'],
      ['0x6B175474E89094C44Da98b954EedeAC495271d0F', 'protocol', 'DAI Contract'],
      ['0x7Fc66500c84A76Ad7e9c9343bFc5AcF2C6Ea1407', 'protocol', 'MakerDAO'],
      ['0x7d2768dE32b0b80b7a3454c06BdA49A691C0B83', 'protocol', 'Aave V3'],
      ['0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2', 'protocol', 'Compound V3'],
      ['0xae7ab96520DE3A18E5e111B5Ea409CE53D97c29f', 'protocol', 'Lido stETH'],
      ['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 'protocol', 'WETH'],
    ];

    for (const [addr, category, label] of labels) {
      this.knownAddresses.set(addr.toLowerCase(), { address: addr, category, label, source: 'database', addedAt: Date.now() });
    }
  }

  lookup(address: string): AddressLabel | null {
    return this.knownAddresses.get(address.toLowerCase()) || null;
  }

  label(address: string, category: LabelCategory, label: string): AddressLabel {
    const entry: AddressLabel = { address, category, label, source: 'user', addedAt: Date.now() };
    this.knownAddresses.set(address.toLowerCase(), entry);
    metrics.increment('label.added', 1, { category });
    return entry;
  }

  searchByCategory(category: LabelCategory): AddressLabel[] {
    return Array.from(this.knownAddresses.values()).filter(l => l.category === category);
  }

  searchByName(query: string): AddressLabel[] {
    const lower = query.toLowerCase();
    return Array.from(this.knownAddresses.values()).filter(l => l.label.toLowerCase().includes(lower));
  }

  close(): void { this.knownAddresses.clear(); }
}

export * from './types/AddressLabelingTypes';
export { createAddressLabeler } from './factory';

export function createAddressLabeler(): AddressLabeler {
  return new AddressLabeler();
}