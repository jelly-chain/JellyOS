// Factory
import { NewsFilter } from './index';

export function createNewsFilter(): NewsFilter {
  return new NewsFilter();
}
