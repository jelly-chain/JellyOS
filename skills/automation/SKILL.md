---
name: automation
description: Local machine automation with scheduling, alerts, webhooks, and system monitoring
author: Tentacle OS
version: 2.0.0
category: system
dependencies:
  - @jellyos/agent
---

# Automation Engine

Local machine automation including task scheduling, alert triggers, webhook handling, and system monitoring.

## Capabilities

- **Task Scheduler**: Cron-like scheduling with crontab integration
- **Price Alerts**: Multi-condition price alerts with notifications
- **Webhook Server**: HTTP server for external integrations
- **File Monitor**: Watch files for changes and trigger actions
- **Script Runner**: Execute shell scripts with output capture
- **System Stats**: Resource monitoring and performance tracking

## Alert Conditions

- Price above/below threshold
- TX confirmation (whale moves, contract events)
- Time-based triggers (daily reports, weekly scans)
- File changes (new logs, updated configs)

## Commands

- `/task schedule <cron> <action>` — schedule recurring task
- `/alert add <symbol> <condition> <value>` — add price alert
- `/script run <path>` — execute shell script
- `/webhook <port>` — start webhook server
- `/monitor start` — start system monitoring