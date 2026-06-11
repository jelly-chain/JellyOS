// Factory
import { SecurityScanner } from './index';

export function createSecurityScanner(): SecurityScanner {
  return new SecurityScanner();
}
