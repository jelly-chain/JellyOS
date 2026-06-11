// Factory
import { SandwichAttackDetector } from './index';

export function createSandwichDetector(): SandwichAttackDetector {
  return new SandwichAttackDetector();
}