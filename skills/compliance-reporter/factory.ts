// Factory
import { ComplianceReporter } from './index';

export function createComplianceReporter(): ComplianceReporter {
  return new ComplianceReporter();
}