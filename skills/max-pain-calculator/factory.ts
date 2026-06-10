// Factory
import { MaxPainCalculator } from './index';

export function createMaxPainCalculator(): MaxPainCalculator {
  return new MaxPainCalculator();
}