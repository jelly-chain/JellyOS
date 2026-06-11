// Factory
import { HoneypotScanner } from './index';

export function createHoneypotScanner(): HoneypotScanner {
  return new HoneypotScanner();
}