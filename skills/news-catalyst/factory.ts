// Factory
import { NewsCatalyst } from './index';

export function createNewsCatalyst(): NewsCatalyst {
  return new NewsCatalyst();
}