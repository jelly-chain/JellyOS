// Factory
import { MetricsExporter } from './index';

export function createMetricsExporter(): MetricsExporter {
  return new MetricsExporter();
}
