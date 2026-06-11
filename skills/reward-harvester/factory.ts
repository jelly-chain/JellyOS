// Factory
import { RewardHarvester } from './index';

export function createRewardHarvester(): RewardHarvester {
  return new RewardHarvester();
}
