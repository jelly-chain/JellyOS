// Automation Types
// Author: Tentacle OS

export interface Task {
  id: string;
  cron: string;
  action: string;
  params?: any;
  enabled: boolean;
  lastRun?: number;
  nextRun?: number;
  createdAt: number;
}

export interface Alert {
  id: string;
  symbol: string;
  condition: string;
  value: number;
  action: string;
  triggered: boolean;
  lastTrigger?: number;
  createdAt: number;
}

export interface AutomationConfig {
  webhookPort?: number;
  scriptTimeout?: number;
  maxParallelTasks?: number;
  alertCooldown?: number;
}

export interface SystemConfig {
  monitorInterval: number;
  alertThresholds: {
    cpu: number;
    memory: number;
    disk: number;
  };
}