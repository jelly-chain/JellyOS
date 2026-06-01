---
name: social-bridge
description: Send/receive via Telegram and Discord — automated responses, alerts, and chatbot integration
---

# Social Bridge

Bridge JellyOS to Telegram and Discord for automated alerts, command responses, and chatbot interaction.

## Telegram Setup

Requires:
- `TELEGRAM_BOT_TOKEN` — from @BotFather
- `TELEGRAM_CHAT_ID` — your chat or group ID

The agent polls Telegram every 3 seconds. When a message arrives, it is injected into the agent's context before the next turn and the agent responds using `send_telegram`.

## Discord Setup

Requires:
- `DISCORD_BOT_TOKEN` — from Discord Developer Portal
- `DISCORD_CHANNEL_ID` — channel ID to monitor

The agent polls Discord every 5 seconds. Messages are batched and presented to the agent for response via `send_discord`.

## Alert Triggers

Configure automatic alerts via `set_alert`:

```text
set_alert symbol:BTC condition:">" threshold:80000
```

When the condition is met, the agent fires an alert to both Telegram and Discord.

Available conditions: `>` (above), `<` (below)

## Commands via Chat

Users can send slash commands directly through Telegram/Discord:
- `/status` — system status
- `/prices` — top prices
- `/vault` — vault balance
- `/pnl` — profit/loss report
- `/panic` — emergency shutdown (requires confirmation)

## Webhook Signals

The agent runs an HTTP server on `JELLY_WEBHOOK_PORT` (default 9090) for TradingView alerts. POST a JSON body:

```json
{
  "ticker": "BTCUSDT",
  "action": "buy",
  "price": 75000,
  "ts": 1700000000000
}
```

## Response Format

When responding via Telegram/Discord, the agent should:
- Keep messages under Telegram's 4096-char limit
- Use plain text (Telegram Markdown is optional)
- Include actionable next steps or slash commands
- Sign off with 🪼 for brand consistency
