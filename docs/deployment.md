# Deploying JellyOS

JellyOS runs anywhere Node.js 20+ is available.

## Prerequisites

1. **API Keys** - Create `~/.jelly/.env`:
   ```bash
   OPENROUTER_API_KEY=sk-or-...
   TELEGRAM_BOT_TOKEN=               # Optional
   IRYS_PRIVATE_KEY=                 # For permanent storage
   ALCHEMY_API_KEY=                  # For blockchain data
   ```

2. **Telegram Bot (optional)** - Create via [@BotFather](https://t.me/BotFather)

---

## Railway

```bash
# Deploy via Railway UI or CLI
railway init
railway up
```
Set env vars in Railway dashboard. **$5/mo starter**.

---

## Render

Create `render.yaml`:
```yaml
services:
  - type: web
    name: jellyos
    env: node
    buildCommand: npm install && npm run build
    startCommand: node dist/cli.js
```
Push to GitHub, create Web Service. **$7/mo**.

---

## Fly.io

```bash
fly launch
fly secrets set OPENROUTER_API_KEY=sk-or-...
fly deploy
```
Global deployment with free tier.

---

## DigitalOcean

Create App or use Droplet:
```bash
ssh root@droplet
npm install -g @jellyos/agent
jellyos
```
**$5/mo basic droplet**.

---

## Headless Mode

For cloud deployments:
```bash
jellyos --headless "analyze market conditions"
```

---

## Notes

- Use persistent volumes for `~/.jelly/`
- Telegram requires HTTPS webhook (set in Railway/Render)
- All APIs work with free tiers