// Factory
import { HealthChecker } from './index';

export function createHealthChecker(): HealthChecker {
  return new HealthChecker();
}
