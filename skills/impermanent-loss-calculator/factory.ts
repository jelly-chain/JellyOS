// Factory
import { ImpermanentLossCalculator } from './index';

export function createILCalculator(): ImpermanentLossCalculator {
  return new ImpermanentLossCalculator();
}