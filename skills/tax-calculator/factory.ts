// Factory
import { TaxCalculator } from './index';

export function createTaxCalculator(): TaxCalculator {
  return new TaxCalculator();
}
