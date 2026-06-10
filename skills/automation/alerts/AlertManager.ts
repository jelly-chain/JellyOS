// Alert Manager - Price and event alerts
// Author: Tentacle OS

import type { Alert, AutomationConfig } from '../types/AutomationTypes';
import { Logger } from '../../../../src/core/utils/Logger';
import { Metrics } from '../../../../src/core/utils/Metrics';

const logger = new Logger('AlertManager');
const metrics = new Metrics();

export class AlertManager {
  private alerts: Map<string, Alert> = new Map();
  private config: Required<AutomationConfig>;

  constructor(config?: Partial<AutomationConfig>) {
    this.config = {
      webhookPort: 9090,
      scriptTimeout: 30000,
      maxParallelTasks: 5,
      alertCooldown: 300000,
      ...config
    };
  }

  /**
   * Add an alert
   */
  add(
    symbol: string,
    condition: '>' | '<' | 'cross-up' | 'cross-down',
    value: number,
    action: string
  ): Alert {
    const id = `alert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const alert: Alert = {
      id,
      symbol,
      condition,
      value,
      action,
      triggered: false,
      createdAt: Date.now()
    };

    this.alerts.set(id, alert);
    metrics.increment('alert.added', 1, { symbol, condition });

    return alert;
  }

  /**
   * Check if alert should trigger
   */
  check(symbol: string, currentValue: number): Alert | null {
    for (const alert of this.alerts.values()) {
      if (alert.symbol !== symbol || !alert.enabled) continue;

      const triggered = this.evaluateCondition(
        alert.condition,
        alert.value,
        currentValue
      );

      if (triggered && this.cooldownPassed(alert)) {
        alert.triggered = true;
        alert.lastTrigger = Date.now();

        metrics.increment('alert.triggered', 1, { symbol: alert.symbol });

        return alert;
      }
    }

    return null;
  }

  /**
   * Evaluate condition
   */
  private evaluateCondition(
    condition: string,
    threshold: number,
    value: number
  ): boolean {
    switch (condition) {
      case '>': return value > threshold;
      case '<': return value < threshold;
      case 'cross-up': return value > threshold; // Simplified
      case 'cross-down': return value < threshold; // Simplified
      default: return false;
    }
  }

  /**
   * Check cooldown period
   */
  private cooldownPassed(alert: Alert): boolean {
    if (!alert.lastTrigger) return true;
    return Date.now() - alert.lastTrigger > this.config.alertCooldown;
  }

  /**
   * Remove alert
   */
  remove(alertId: string): boolean {
    return this.alerts.delete(alertId);
  }

  /**
   * List alerts
   */
  list(): Alert[] {
    return Array.from(this.alerts.values());
  }

  /**
   * Clear triggered status
   */
  clearTriggered(): void {
    for (const alert of this.alerts.values()) {
      alert.triggered = false;
    }
  }

  /**
   * Close manager
   */
  close(): void {
    this.alerts.clear();
    logger.info('AlertManager closed');
  }
}