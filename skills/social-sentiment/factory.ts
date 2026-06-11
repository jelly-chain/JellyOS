// Factory
import { SocialSentimentAnalyzer } from './index';

export function createSocialSentimentAnalyzer(): SocialSentimentAnalyzer {
  return new SocialSentimentAnalyzer();
}