<div align="center">

<pre>
     ██╗███████╗██╗     ██╗  ██╗   ██╗  ██████╗ ███████╗
     ██║██╔════╝██║     ██║  ╚██╗ ██╔╝ ██╔═══██╗██╔════╝
     ██║█████╗  ██║     ██║   ╚████╔╝  ██║   ██║███████╗
██   ██║██╔══╝  ██║     ██║    ╚██╔╝   ██║   ██║╚════██║
╚█████╔╝███████╗███████╗███████╗██║    ╚██████╔╝███████║
 ╚════╝ ╚══════╝╚══════╝╚══════╝╚═╝     ╚═════╝ ╚══════╝
</pre>

**Autonomous AI trading agent — runs 100% locally on your machine**

[![npm](https://img.shields.io/badge/npm-%40jellyos%2Fagent-14b8a6?style=for-the-badge)](https://www.npmjs.com/package/@jellyos/agent)
[![Node](https://img.shields.io/badge/Node.js-18%2B-green?style=for-the-badge)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

[Website](http://jelly-os.xyz) · [Telegram](https://t.me/jellyxchain) · [X / Twitter](https://x.com/agentz010)




</div>



---

JellyOS is a terminal AI agent for blockchain analytics, prediction markets, automated trading signal generation, and multi-chain portfolio management. It streams responses live, calls tools in parallel, encrypts profits in a local vault, and can automate your Mac or Linux machine directly — open apps, run scripts, read files, schedule tasks.

All data stays on your machine. No cloud. No server. No exposure.

---

## Quick Start

```bash
git clone https://github.com/jelly-chain/JellyOS.git
cd JellyOS
bash setup.sh
```

That's it. `setup.sh` installs dependencies, compiles the extension, walks you through your API keys, and generates your wallets. When it finishes:

```bash
jelly
```

Both `jelly` and `jellyos` work — same binary.

**Windows:**
```powershell
powershell -ExecutionPolicy Bypass -File setup.ps1
```

---

## Requirements

- **Node.js 18+**
- **OpenRouter API key** — [openrouter.ai/keys](https://openrouter.ai/keys) (free tier works)
- Optional: Alchemy key for on-chain data, CoinGecko Pro for higher rate limits

---

## What it can do

### Trading & Markets
- Real-time prices, 24h change, volume across all major assets
- Perpetual funding rates across exchanges
- Fear & Greed index, DeFi TVL by chain or protocol
- Polymarket prediction markets with live odds
- AI trading signal generation from cross-source analysis
- Risk/reward calculator, position sizing
- DEX swap execution (Jupiter on Solana, Uniswap on EVM)

### Blockchain
- Wallet balances across 16 chains: Ethereum, BSC, Arbitrum, Base, Polygon, Avalanche, Optimism, Scroll, Linea, ZkSync, Mantle, Blast, Solana, Cosmos, and more
- Whale scanning — large transaction detection on any chain
- Gas prices across EVM networks
- On-chain wallet address generation (EVM, Solana, Cosmos)

### Live Data Feeds (21 sources)
Runs in the background and updates continuously:
- CoinGecko prices and trending
- Binance 24h tickers
- Alternative.me Fear & Greed
- DeFiLlama TVL
- Messari & CoinTelegraph RSS news
- Coinglass funding rates and open interest
- ETH gas oracle, BTC mempool
- Solana TPS, Reddit sentiment
- Dune Analytics, Glassnode, CryptoCompare social

### Local Machine Automation
JellyOS runs locally and has full access to your machine:
- Open any app — Brave, Chrome, Finder, anything
- Run shell commands and scripts
- Read and write files anywhere on disk
- Schedule recurring tasks via crontab
- Search the web by opening a browser

Example: *"open Brave and search for BTC news"*, *"run my trading script"*, *"save this analysis to my desktop"*

### Vault & Security
- AES-256-GCM encrypted profit vault
- Auto-sweeps realized profits when P&L crosses a configurable threshold
- Cold vault address (separate keypair, you hold the private key)
- Hot trading wallet for autonomous agent operations
- `/panic` command: instantly stops all feeds, sweeps profits, and locks vault

---

## Commands

Type `/` in the terminal to see all commands:

```
/vault              Vault balance and lock status
/wallets            All wallet addresses (hot + cold vault)
/status             Full system status
/feeds              Recent live feed items
/signals            Active trading signals
/positions          Open positions
/risk               Risk profile and exposure
/history [N]        Vault sweep history
/pnl                Profit and loss summary
/watchlist          Track assets — /watchlist add BTC
/gas                Gas prices across chains
/tvl [protocol]     DeFi TVL
/whale <address>    Whale scan any address
/chain [name]       Set active chain context
/effect [level]     Trading intensity: eco / normal / turbo / max
/model [N|next]     Switch or rotate AI model
/config             Current settings (keys masked)
/export             Export vault ledger to CSV
/panic              Emergency stop — sweep, lock, close positions
/lock / /unlock     Lock or unlock the vault
/changelog          Release notes
```

---

## Model Rotation

Switch models mid-session with `/model`:

```
/model              Show picker with all available models
/model next         Cycle to next model
/model prev         Cycle to previous model
/model 3            Pick by number
/model deepseek/deepseek-r1   Set by full ID
```

Available models: Claude Opus 4.5, Claude Sonnet 4.5, Claude Haiku 3.5, GPT-4o, GPT-4o Mini, o3-mini, DeepSeek R1, DeepSeek V3, Gemini 2.5 Flash, Gemini 2.5 Pro, Llama 4 Maverick, Grok 3

---

## Effect Levels

Control how many tools and how much analysis the agent does per response:

| Level | Behavior |
|-------|----------|
| `eco` | Minimal tool calls, fastest responses |
| `normal` | Standard tool usage — default |
| `turbo` | Parallel multi-tool analysis |
| `max` | Every relevant tool, full signal synthesis |

Switch with `/effect turbo` or ask the agent directly.

---

## Configuration

Setup writes to `~/.jelly/.env`. You can edit it directly or run `jellyos config` to update keys.

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | AI model gateway — [openrouter.ai](https://openrouter.ai/keys) |
| `ALCHEMY_KEY` | No | On-chain data across 16 EVM chains |
| `COINGECKO_API_KEY` | No | Higher rate limits for price data |
| `POLYMARKET_API_KEY` | No | Prediction market trading |
| `DEFAULT_MODEL` | No | Active model ID (set via `/model`) |
| `AUTO_VAULT_THRESHOLD` | No | Auto-sweep at this USD P&L (default: 500) |
| `JELLY_DASHBOARD_PORT` | No | WebSocket port for dashboard (default: 4320) |

---

## Wallet Architecture

**Trading wallet (hot):** Generated at setup, stored encrypted at `~/.jelly/wallets/`. The agent uses this to sign transactions autonomously. Fund it to give the agent capital.

**Vault (cold):** A separate keypair generated at setup. The private keys are shown once during setup — write them down on paper. They are **never saved to disk**. Only the public addresses are saved to `~/.jelly/vault-addresses.json`. The agent can send profits to these addresses, but only you can withdraw using the private keys you wrote down.

> Write down your vault private keys during setup and store them somewhere safe (paper, offline). They cannot be recovered — if you lose them, the vault funds are inaccessible.

---

## Dashboard

An optional local React dashboard connects to the agent via WebSocket on port 4320:

```bash
cd dashboard
npm install
npm run dev
# open http://localhost:4321
```

Live events: prices, signals, trades, vault sweeps, whale alerts, agent activity.

---

## Security

- Private keys never leave the process — signing happens in memory
- Vault encrypted with AES-256-GCM, key derived from your passphrase via scrypt
- API keys stored in `~/.jelly/.env` (mode 600), never logged
- `~/.jelly/wallets/` is excluded from git
- `/panic` auto-locks vault on emergency exit

---

## License

MIT — see [LICENSE](LICENSE)
