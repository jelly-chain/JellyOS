// Task Scheduler - Cron-like task scheduling
// Author: Tentacle OS

import type { Task, AutomationConfig } from '../types/AutomationTypes';
import { Logger } from '../../../../src/core/utils/Logger';

const logger = new Logger('TaskScheduler');

export class TaskScheduler {
  private tasks: Map<string, Task> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
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
   * Schedule a task
   */
  schedule(cron: string, action: string, params?: any): Task {
    const id = `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const task: Task = {
      id,
      cron,
      action,
      params,
      enabled: true,
      createdAt: Date.now()
    };

    this.tasks.set(id, task);
    this.scheduleTimer(task);

    logger.info(`Scheduled task ${id}: ${action}`);

    return task;
  }

  /**
   * Schedule a timer based on cron expression
   */
  private scheduleTimer(task: Task): void {
    const interval = this.parseCron(task.cron);

    if (interval > 0) {
      const timer = setTimeout(() => {
        this.execute(task);
      }, interval);

      this.timers.set(task.id, timer);
    }
  }

  /**
   * Parse cron expression to milliseconds
   */
  private parseCron(cron: string): number {
    // Simple cron parsing - supports minute/hour/day patterns
    if (cron.includes('*/')) {
      const parts = cron.split(' ');
      const minutePart = parts[0];

      if (minutePart.startsWith('*/')) {
        const minutes = parseInt(minutePart.slice(2));
        return minutes * 60000;
      }
    }

    // Daily pattern
    if (cron.includes('@daily') || cron.includes('@day')) {
      return 86400000;
    }

    // Hourly pattern
    if (cron.includes('@hourly') || cron.includes('@hour')) {
      return 3600000;
    }

    // Default: 4 hours
    return 14400000;
  }

  /**
   * Execute a task
   */
  private execute(task: Task): void {
    logger.info(`Executing task: ${task.action}`);

    // In production - would execute the actual action
    // This could be: price scan, yield scan, whale scan, etc.

    // Reschedule if recurring
    if (task.cron !== '@once') {
      this.scheduleTimer(task);
    } else {
      this.tasks.delete(task.id);
      this.timers.delete(task.id);
    }
  }

  /**
   * Enable/disable task
   */
  setEnabled(taskId: string, enabled: boolean): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.enabled = enabled;
    }
  }

  /**
   * Remove task
   */
  remove(taskId: string): boolean {
    const timer = this.timers.get(taskId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(taskId);
    }

    return this.tasks.delete(taskId);
  }

  /**
   * List all tasks
   */
  list(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Close scheduler
   */
  close(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }

    this.timers.clear();
    this.tasks.clear();
    logger.info('TaskScheduler closed');
  }
}