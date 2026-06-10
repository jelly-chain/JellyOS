// System Monitor - Resource monitoring
// Author: Tentacle OS

import { Logger } from '../../../../src/core/utils/Logger';
import { Metrics } from '../../../../src/core/utils/Metrics';
import { cpus, totalmem, freemem } from 'os';
import { networkInterfaces } from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const logger = new Logger('SystemMonitor');
const metrics = new Metrics();

const execAsync = promisify(exec);

export class SystemMonitor {
  private interval: number = 10000;
  private timer: NodeJS.Timeout | null = null;
  private lastStats: SystemStats | null = null;

  /**
   * Start monitoring
   */
  start(interval: number = 10000): void {
    this.interval = interval;

    this.timer = setInterval(() => {
      this.collectStats();
    }, interval);

    this.collectStats(); // Initial collection
  }

  /**
   * Collect system statistics
   */
  private collectStats(): void {
    const stats: SystemStats = {
      cpu: this.getCpuUsage(),
      memory: this.getMemoryUsage(),
      disk: this.getDiskUsage(),
      network: { rx: 0, tx: 0 },
      uptime: process.uptime()
    };

    this.lastStats = stats;

    // Record metrics
    metrics.setGauge('system.cpu.usage', stats.cpu);
    metrics.setGauge('system.memory.usage', stats.memory);
    metrics.setGauge('system.uptime', stats.uptime);
  }

  /**
   * Get CPU usage
   */
  private getCpuUsage(): number {
    const cpusInfo = cpus();
    const total = cpusInfo.reduce((acc, cpu) => {
      acc.user += cpu.times.user;
      acc.nice += cpu.times.nice;
      acc.sys += cpu.times.sys;
      acc.idle += cpu.times.idle;
      acc.irq += cpu.times.irq;
      return acc;
    }, { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 });

    const totalTime = total.user + total.nice + total.sys + total.idle + total.irq;
    const idleTime = total.idle;

    // This is a snapshot - for real usage, compare over time
    return Math.round(((totalTime - idleTime) / totalTime) * 100);
  }

  /**
   * Get memory usage
   */
  private getMemoryUsage(): number {
    const total = totalmem();
    const free = freemem();
    const used = total - free;

    return Math.round((used / total) * 100);
  }

  /**
   * Get disk usage
   */
  private getDiskUsage(): number {
    try {
      // On macOS/Linux
      const stats = require('fs').statSync('/');
      // Simplified - would need to call df in production
      return 50; // Mock value
    } catch {
      return 0;
    }
  }

  /**
   * Get current stats
   */
  getStats(): SystemStats {
    return this.lastStats || {
      cpu: 0,
      memory: 0,
      disk: 0,
      network: { rx: 0, tx: 0 },
      uptime: 0
    };
  }

  /**
   * Check if resource is under pressure
   */
  checkPressure(): PressureCheck {
    const stats = this.getStats();

    return {
      cpu: stats.cpu > 80,
      memory: stats.memory > 80,
      disk: stats.disk > 90
    };
  }

  /**
   * Close monitor
   */
  close(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.lastStats = null;
    logger.info('SystemMonitor closed');
  }
}

export interface SystemStats {
  cpu: number;
  memory: number;
  disk: number;
  network: { rx: number; tx: number };
  uptime: number;
}

export interface PressureCheck {
  cpu: boolean;
  memory: boolean;
  disk: boolean;
}