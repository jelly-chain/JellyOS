// Factory
import { CrossChainBridgeMonitor } from './index';

export function createBridgeMonitor(): CrossChainBridgeMonitor {
  return new CrossChainBridgeMonitor();
}