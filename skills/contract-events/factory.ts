// Factory
import { ContractEventMonitor } from './index';

export function createContractEventMonitor(): ContractEventMonitor {
  return new ContractEventMonitor();
}