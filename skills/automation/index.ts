// Automation Engine - Main Entry Point
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import { TaskScheduler } from './scheduler/TaskScheduler';
import { AlertManager } from './alerts/AlertManager';
import { WebhookServer } from './hooks/WebhookServer';
import { SystemMonitor } from './hooks/SystemMonitor';
import type { Task, Alert, AutomationConfig } from './types/AutomationTypes';

const logger = new Logger('Automation');
const metrics = new Metrics();

// ============================================================================
// Automation Engine Class
// ============================================================================

export class AutomationEngine {
  private scheduler: TaskScheduler;
  private alertManager: AlertManager;
  private webhook: WebhookServer;
  private systemMonitor: SystemMonitor;

  constructor(private config: AutomationConfig = {}) {
    this.scheduler = new TaskScheduler();
    this.alertManager = new AlertManager();
    this.webhook = new WebhookServer(config.webhookPort || 9090);
    this.systemMonitor = new SystemMonitor();
  }

  /**
   * Schedule a recurring task
   */
  scheduleTask(cron: string, action: string, params?: any): string {
    const task = this.scheduler.schedule(cron, action, params);
    metrics.increment('automation.task.scheduled', 1);

    logger.info(`Scheduled task: ${action} (${cron})`);

    return task.id;
  }

  /**
   * Add price alert
   */
  addAlert(
    symbol: string,
    condition: '>' | '<' | 'cross-up' | 'cross-down',
    value: number,
    action: string
  ): string {
    const alert = this.alertManager.add(symbol, condition, value, action);
    metrics.increment('automation.alert.added', 1, { symbol });

    return alert.id;
  }

  /**
   * Start webhook server
   */
  async startWebhook(port?: number): Promise<void> {
    if (port) {
      this.webhook.setPort(port);
    }

    await this.webhook.start();
    metrics.increment('automation.webhook.started', 1);
  }

  /**
   * Run a shell script
   */
  async runScript(path: string, args?: string[]): Promise<ScriptResult> {
    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);

      const command = args ? `${path} ${args.join(' ')}` : path;
      const result = await execAsync(command, { timeout: 30000 });

      metrics.increment('automation.script.executed', 1, { path });

      return {
        success: true,
        output: result.stdout,
        error: result.stderr
      };
    } catch (err: any) {
      logger.error(`Script execution failed: ${path}`, err);

      return {
        success: false,
        output: '',
        error: err.message
      };
    }
  }

  /**
   * Start system monitoring
   */
  startMonitoring(interval: number = 10000): void {
    this.systemMonitor.start(interval);
    metrics.increment('automation.monitoring.started', 1);
  }

  /**
   * Get all scheduled tasks
   */
  getTasks(): Task[] {
    return this.scheduler.list();
  }

  /**
   * Get all alerts
   */
  getAlerts(): Alert[] {
    return this.alertManager.list();
  }

  /**
   * Get system stats
   */
  getSystemStats(): SystemStats {
    return this.systemMonitor.getStats();
  }

  /**
   * Close all resources
   */
  close(): void {
    this.scheduler.close();
    this.alertManager.close();
    this.webhook.close();
    this.systemMonitor.close();
    logger.info('AutomationEngine closed');
  }
}

export interface ScriptResult {
  success: boolean;
  output: string;
  error?: string;
}

export interface SystemStats {
  cpu: number;
  memory: number;
  disk: number;
  network: NetworkStats;
  uptime: number;
}

export interface NetworkStats {
  rx: number;
  tx: number;
}

// ============================================================================
// Default Export
// ============================================================================

export * from './types/AutomationTypes';
export { TaskScheduler } from './scheduler/TaskScheduler';
export { AlertManager } from './alerts/AlertManager';
export { WebhookServer } from './hooks/WebhookServer';
export { SystemMonitor } from './hooks/SystemMonitor';

export function createAutomation(config?: AutomationConfig): AutomationEngine {
  return new AutomationEngine(config);
}