// Strategy Registry - Manages strategy configurations
// Author: Tentacle OS

import type { StrategyConfig, StrategySignal } from '../types/StrategyTypes';

/**
 * Strategy registry manages strategy configurations and metadata
 */
export class StrategyRegistry {
  private strategies: Map<string, StrategyConfig> = new Map();
  private cache: Map<string, StrategySignal[]> = new Map();

  /**
   * Register a new strategy
   */
  register(name: string, config: StrategyConfig): void {
    this.strategies.set(name, { ...config });
    this.cache.set(name, []);
  }

  /**
   * Get strategy configuration
   */
  get(name: string): StrategyConfig | null {
    return this.strategies.get(name) || null;
  }

  /**
   * Update strategy configuration
   */
  update(name: string, updates: Partial<StrategyConfig>): void {
    const existing = this.strategies.get(name);
    if (existing) {
      this.strategies.set(name, { ...existing, ...updates });
    }
  }

  /**
   * Enable or disable a strategy
   */
  setEnabled(name: string, enabled: boolean): void {
    const strategy = this.strategies.get(name);
    if (strategy) {
      strategy.enabled = enabled;
    }
  }

  /**
   * List all strategies
   */
  list(): StrategyConfig[] {
    return Array.from(this.strategies.values());
  }

  /**
   * List enabled strategies only
   */
  listEnabled(): string[] {
    return Array.from(this.strategies.entries())
      .filter(([, config]) => config.enabled)
      .map(([name]) => name);
  }

  /**
   * Get total strategy count
   */
  getStrategyCount(): number {
    return this.strategies.size;
  }

  /**
   * Cache signals for a strategy
   */
  cacheSignals(name: string, signals: StrategySignal[]): void {
    this.cache.set(name, signals);
  }

  /**
   * Get cached signals for a strategy
   */
  getCachedSignals(name: string): StrategySignal[] {
    return this.cache.get(name) || [];
  }

  /**
   * Clear cached signals
   */
  clearCache(name?: string): void {
    if (name) {
      this.cache.delete(name);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Remove a strategy
   */
  remove(name: string): boolean {
    this.cache.delete(name);
    return this.strategies.delete(name);
  }

  /**
   * Close all resources
   */
  close(): void {
    this.strategies.clear();
    this.cache.clear();
  }
}