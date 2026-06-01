# JellyOS Improvement Roadmap — 40 Ideas (Full Audit Edition)

Every recommendation is grounded in the actual code at `extensions/jellyos.ts` (2,890 lines),
`src/` (16 modules), `dashboard/` (React + Vite), and `bin/jellyos` (launcher). No vague wishes.

## TABLE OF CONTENTS

| # | Category | Count |
|---|----------|-------|
| 1–8 | Terminal UI & Visual Polish | 8 |
| 9–18 | Architecture & Code Quality | 10 |
| 19–26 | Trading, Risk & Automation | 8 |
| 27–34 | Data Pipeline & Feeds | 8 |
| 35–40 | Dashboard & Cross-Platform | 6 |

---

## ██ TERMINAL UI & VISUAL POLISH (Items 1–8)

### 1. ★ Fix Double-Border Rendering at Boot
**Current:** Lines 462-469 in `jellyos.ts` have a 9-line comment explaining that `ctx.ui.setStatus()` during boot
causes `+----------+` border stacking because Ink's cursor-up is off by 1 when wide emoji (🪼, 🔒, ⚡)
occupy 2 visual columns but Ink counts them as 1. The "fix" is simply avoiding setStatus during boot.
**Real fix:** The `@jellyos/agent` SDK should expose `ui.batchUpdates(fn)` — queue all setStatus/setTheme/setHeader
calls into a single Ink `render()` cycle. OR: fix Ink's `measureElement` to count wcwidth correctly for
characters outside the BMP. The comment says "deferred below" — the actual `setStatus("models", ...)` is
on a `setTimeout(..., 2000)` and the `setStatus("skills", ...)` call I added does the same. Neither fires
during initial render, but the whole workaround exists because setStatus triggers a full re-render
rather than a dirty-flag queue.
**Implementation:** In `@jellyos/agent`'s UIContext, change setStatus from `setState() → rerender()`
to `markDirty(key) → requestAnimationFrame → batch rerender()`. Or expose a `ui.flush()` that extensions
call explicitly after batch mutations.

### 2. ★ Tool Execution Spinner with Duration
**Current:** The agent calls 45 tools (`registerTool` calls) but the user sees nothing between
"calling get_market_data..." and the result appearing. The extension has no hook into tool lifecycle.
**Fix:** The `@jellyos/agent` SDK's `ToolDispatcher` should emit lifecycle events:
`tool:start`, `tool:complete`, `tool:error`. Extensions subscribe via `agent.on("tool_start", ...)`.
Render a spinner row with `⠋ tool_name — 1.2s` that updates every 100ms using `setInterval`.
On completion, flash green checkmark for 500ms then clear. The `Metrics` class already tracks
durations — pipe that into the spinner display.
**Files:** Extension registers `agent.on("tool_start", handler)` → handler renders spinner in TUI panel.

### 3. ☆ Token Streaming Delta Visualization
**Current:** Agent responses appear character-by-character. No visual distinction between agent narration
and tool output blocks. The dashboard has `text_delta` / `turn_done` events in its WebSocket protocol
(`useDashboardStream.ts` lines 113-117), but the TUI has nothing equivalent.
**Fix:** The TUI renderer should treat `type: "text"` content blocks differently from agent stream output.
Prefix tool outputs with a `│` gutter in dim theme color. Agent stream gets normal styling. If the
stream contains ASCII tables, switch to box-drawing on detection of `|` column separators.
**Bonus:** Auto-detect table-like output (`contains multiple lines with same number of | characters`)
and re-render with `┌─┬─┐` borders on stream completion.

### 4. ☆ Colored Badge Component for Risk/Severity
**Current:** Risk levels appear as plain text throughout skills. The theme has `fg("error"/"warn"/"success"...)
but no composite badge rendering.
**Fix:** Add helper in TUI theme:
```
[🔴 HIGH RISK]  → red background, white text
[🟡 MODERATE]   → yellow background, black text
[🟢 LOW RISK]    → green background, white text
```
Use unicode half-block characters for a compact 8-char badge that works at any terminal width.
Implement as `ui.renderBadge(level: 'high'|'medium'|'low', label: string): string`.

### 5. · Terminal Tab Title
**Current:** Terminal title bar shows whatever shell was running. `bin/jellyos` never sets the title.
**Fix:** In `bin/jellyos`, add after agent start:
```js
process.stdout.write('\x1b]0;🪼 JellyOS — ' + modelName + '\x07');
```
Update on model change and vault lock/unlock. The dashboard's `agentStatus` WebSocket event
(line 102 in `useDashboardStream.ts`) already carries the data — pipe it to a CLI title update.

### 6. ☆ Box-Drawing Table Renderer
**Current:** Every skill and the agent prompt uses ASCII dashes and pipes for tables:
```
Symbol   Side    Size          Entry     Current   P&L
BTC      Long    $5,000        73,200    76,450    +$222
```
**Fix:** Ship a `renderTable(headers: string[], rows: string[][], widths?: number[]): string` utility
in the TUI layer. Auto-calculate column widths from content. Render with:
```
┌────────┬──────┬──────────┬──────────┬──────────┬────────┐
│ Symbol │ Side │   Size   │  Entry   │ Current  │  P&L   │
├────────┼──────┼──────────┼──────────┼──────────┼────────┤
│ BTC    │ Long │  $5,000  │  73,200  │  76,450  │ +$222  │
└────────┴──────┴──────────┴──────────┴──────────┴────────┘
```
Support right-aligned numbers, colored cells (green positive, red negative), and truncation with `…`.

### 7. · Boot Splash Screen
**Current:** Running `jellyos` prints a few NPM logs then drops into the agent prompt. Feels like a script,
not an OS.
**Fix:** In `bin/jellyos`, before spawning the agent process, render a 1.5-second splash:
```
   🪼  🪼  🪼
  JellyOS v2.0.0
  16 chains · 32 skills · 21 data feeds
  ⠋ Loading...
```
Use a spinner that cycles through ⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏. Fade out on agent ready.
The launcher already knows about JELLY_HOME, the env file, and the extension — it has everything
needed to render this before passing control to the agent.

### 8. · Command Auto-Completion
**Current:** `bin/jellyos` uses node readline but never registers a completer. Slash commands are
typed manually. The `Registry.listCommands()` in `@jellyos/agent` exposes all registered commands
but nothing in the launcher reads them.
**Fix:** In the launcher's readline setup, import the Registry and register a completer:
```js
const commands = registry.listCommands().map(([name]) => '/' + name);
const skills   = registry.listSkills().map(s => s.name);
const chains   = ['ethereum','arbitrum','base','solana','bsc','polygon'];
const allCompletions = [...commands, ...skills, ...chains];
rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: (line) => {
    const hits = allCompletions.filter(c => c.startsWith(line));
    return [hits.length ? hits : allCompletions, line];
  }
});
```

---

## ██ ARCHITECTURE & CODE QUALITY (Items 9–18)

### 9. ★★★ Split 2,890-Line Monolith Into Modules
**Current:** `extensions/jellyos.ts` is 2,890 lines. It contains: 45 tool definitions, ~30 slash commands,
Telegram polling, Discord polling, TradingView webhook server, dashboard WebSocket server, alert
checking, whale wallet polling, context injection, and the boot/shutdown sequences. All in one file.
**Fix:** Split into:
```
extensions/
  jellyos/
    index.ts            — entry point, boot wiring, session lifecycle
    tools/
      market.ts          — get_market_data, get_funding_rates, get_fear_greed, etc.
      blockchain.ts      — scan_chain, whale_scan, get_gas_prices, get_defi_tvl
      trading.ts         — calculate_risk, execute_trade, set_stop_loss, journal_trade
      vault.ts           — vault_sweep, vault_status, vault_history
      social.ts          — send_telegram, send_discord, set_alert
      automation.ts      — schedule_task, daily_briefing
      portfolio.ts       — portfolio_report, list_positions, close_position
      advanced.ts        — scan_arbitrage, backtest_strategy, scan_dex
      filesystem.ts      — read_file, write_file, run_shell, open_app
    bridges/
      telegram.ts        — Telegram polling + sending
      discord.ts         — Discord polling + sending
      webhook.ts         — TradingView HTTP webhook server
    dashboard.ts         — WebSocket server + broadcast
    alerts.ts            — Alert checking logic
    commands/
      vault.ts           — /vault, /unlock, /lock, /panic, /export
      status.ts          — /status, /feeds, /signals, /positions, /pnl
      settings.ts        — /effect, /model, /chain, /config
      social.ts          — /debate, /skills, /schedule
    context.ts           — before_agent_start context injection logic
```
This is not cosmetic. The file is unmaintainable at its current size. Every tool addition requires
scrolling through 1,500+ lines of unrelated code. The `_tgPoll`, `_dcPoll`, `_checkAlerts`, `_pollWatchedWallets`,
and `_startWebhookServer` functions are defined in the middle of tool definitions — they should be
imported from dedicated modules.

### 10. ★ Eliminate `require()` for Static Imports
**Current:** 18 instances of `const { readFileSync, writeFileSync, existsSync, mkdirSync } = require("node:fs")`
inside tool handlers and lifecycle hooks. These are dynamic requires inside async functions —
Node can't tree-shake them, they add overhead per invocation, and they defeat TypeScript type checking.
**Fix:** Add top-level imports:
```ts
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
```
Every module already imports from `node:fs`, `node:path`, `node:os` at the top. The dynamic requires
are a code smell from copy-paste. The `execSync` inside `_checkAlerts` (for osascript notifications)
is the only one that makes sense as a conditional require (Darwin-only).

### 11. ☆ Extract Context Persistence to a `ConfigStore`
**Current:** At least 12 places read/write `~/.jelly/context.json` with duplicated try/catch blocks:
- `_checkAlerts` (alerts.json)
- `before_agent_start` context injection
- `/effect` handler
- `/panic` handler
- `schedule_task` tool
- Dashboard `set_effect` handler
- `_pollWatchedWallets` (watched-wallets.json)
- AutoVault threshold
- `position` tracking

Every one of these reimplements `existsSync → readFileSync → JSON.parse → modify → JSON.stringify → writeFileSync`.
**Fix:** Create a `ConfigStore` class at `src/core/ConfigStore.ts`:
```ts
class ConfigStore {
  private cache: Record<string, any> = {};
  private paths: Map<string, string> = new Map();

  get<T>(file: string, key: string, defaultVal: T): T { ... }
  set<T>(file: string, key: string, value: T): void { ... }
  getAll<T>(file: string): T { ... }
  // Atomic writes, file locking via rename(2)
}
```
The `ContextStore` in `src/context/ContextStore.ts` already exists but is unused by the extension —
it's an in-memory store with TTL and search. The extension writes directly to disk instead. Bridge them.

### 12. ☆ TypeScript: Eliminate `any` Types
**Current:** Critical untyped variables:
- `_statusV: any, _statusF: any, _statusS: any, _statusW: any` (line ~370)
- `let _dashboardMessages: Array<{ text: string; ts: number }>` — typed, but `_status*` aren't
- `(import.meta as any).url` — the ESM dirname hack
- `require("../src/trading/PositionManager")` — dynamic require with no type
- `data as any` — every RPC response
- `store: any = {}` — context.json reads

**Fix:** Define interfaces:
```ts
interface BootServices {
  vault: VaultManager | null;
  feeds: FeedManager | null;
  signals: SignalEngine | null;
  wallet: WalletManager | null;
}
```
Remove `import.meta as any` — the `fileURLToPath` pattern works fine with ESM namespace imports.
For RPC responses, define response types or use `unknown` with a type guard instead of `any`.

### 13. · Replace `_esm_dirname` Hack with Proper Path Resolution
**Current:** Lines 10-18:
```ts
const _esm_dirname = (() => {
  try { return path.dirname(fileURLToPath((import.meta as any).url)); }
  catch { return typeof __dirname !== "undefined" ? __dirname : process.cwd(); }
})();
```
This exists because the file can be run as `.ts` (CJS compiled), `.js` (CJS), or `.mjs` (ESM).
Three formats for one file.
**Fix:** Pick one format and stick to it. The launcher (`bin/jellyos`) already prefers `.mjs` → `.js` → `.ts`.
If the build process outputs CJS, use `__dirname`. If ESM, use `import.meta.url`. Don't support both —
the `dist` directory exists; use it. For the prompt path: use `process.env.JELLYOS_HOME` or `path.resolve(__dirname, "..")`.

### 14. ☆ Dead Code & Stub Removal
**Current:**
- `CheckpointManager` (`src/core/CheckpointManager.ts`, 200 lines) — fully implemented with encryption, hashing,
  auto-cleanup, metadata search. Referenced by zero other modules. The `checkpoints` singleton export
  is never imported anywhere.
- `TaskQueue` (`src/core/TaskQueue.ts`, 200 lines) — full priority queue with dependency resolution,
  retry with exponential backoff, stats tracking. Exported as `taskQueue` singleton. Imported by nothing.
- `ContextStore` (`src/context/ContextStore.ts`, 170 lines) — in-memory store with TTL, tag indexing,
  relevance decay, search. The `context` singleton is imported by `src/Index.ts` but never used by
  the extension, which writes directly to `~/.jelly/context.json` instead.
- `/debate` command (lines ~2710-2730) — tells the user "send the topic as a message to the agent"
  and does nothing. It's a stub.
- `PortfolioManager` (`src/trading/PortfolioManager.ts`) — `getSummary()` computes Sharpe ratio as 0.5
  or 0 with no real calculation. `dailyReturn` = `totalReturn / 365` — garbage math.
- `/multisig`, `/dex`, `/arb`, `/yield`, `/airdrop` commands are referenced in skill files but don't
  exist in the command registry.

**Fix:** Either integrate `CheckpointManager` and `TaskQueue` into the extension (they're well-built)
or delete them. The ContextStore should be the single persistence layer instead of duplicated
readFile/writeFile. The `/debate` stub should either implement multi-agent or be removed.
PortfolioManager's math should be fixed or replaced.

### 15. ☆ Configurable Polling Intervals
**Current:** Hardcoded polling intervals:
- Telegram: 3,000ms (line ~445)
- Discord: 5,000ms (line ~449)
- Alerts: 30,000ms (line ~453)
- Whale wallets: 60,000ms (line ~455)
- FeedManager sources: hardcoded per source (60s to 7,200s)
**Fix:** All intervals should be configurable via env vars with sensible defaults:
```
JELLY_TELEGRAM_POLL_MS=3000
JELLY_DISCORD_POLL_MS=5000
JELLY_ALERT_CHECK_MS=30000
JELLY_WALLET_POLL_MS=60000
JELLY_FEED_PRICE_MS=60000
JELLY_FEED_NEWS_MS=300000
```
The `EnvLoader` class already has `getNumber(key, default)` — use it.

### 16. · Memory Management & Unbounded Collections
**Current:** Three collections grow without bounds:
- `_seenTxHashes: Set<string>` (line ~375) — never pruned. Every transaction hash ever seen stays forever.
- `FeedManager.items[]` — capped at 500 (line in FeedManager.ts). Good, but the limit is hardcoded.
- `_dashboardMessages[]` — capped at 50 with splice (line ~120). Good.
- `_telegramPending[]` — spliced on read, but if agent is idle, messages accumulate.
- `ctx.ui.setStatus` calls — each one triggers a re-render. No dedup queue.

**Fix:** `_seenTxHashes` should be an LRU set capped at 10,000:
```ts
const MAX_TX_HASHES = 10_000;
function addTxHash(hash: string) {
  if (_seenTxHashes.size >= MAX_TX_HASHES) {
    const first = _seenTxHashes.values().next().value;
    _seenTxHashes.delete(first);
  }
  _seenTxHashes.add(hash);
}
```
Make limits configurable. Add a `/memory` command that reports heap usage, collection sizes, and cache hit ratios.

### 17. ☆ Service Health Tracking
**Current:** If any service fails during boot, the catch block (`} catch { /* non-fatal */ }`) swallows
the error silently. The user has no idea Discord/Twitter/feeds failed until they try to use them.
**Fix:** Add a health map:
```ts
const serviceHealth = new Map<string, 'ok' | 'degraded' | 'down'>();

function setHealth(service: string, status: 'ok' | 'degraded' | 'down', error?: string) {
  serviceHealth.set(service, status);
  if (status !== 'ok') console.error(`[JellyOS] ${service}: ${error}`);
}
```
Expose via `/health` command and dashboard. Color-code: green dot for ok, yellow for degraded, red for down.
Services: telegram, discord, webhook, feeds_price, feeds_news, feeds_fng, feeds_whale, vault, wallet_evm,
wallet_solana, wallet_cosmos, alchemy, dashboard_ws.

### 18. · Plugin/Skill Installer
**Current:** Skills are static `.md` files in `skills/`. The `load-skills.ts` script only scans that directory.
No way to install community skills or extensions.
**Fix:** Add `~/.jelly/skills/` as a user skills directory. `loadSkills()` scans both `./skills` (built-in)
and `~/.jelly/skills` (user-installed). Add `/skill install <url|npm-package>` that downloads skill
files. Define a `jelly-skill.json` manifest:
```json
{
  "name": "birdeye-token-analyst",
  "version": "1.0.0",
  "description": "Analyze tokens via Birdeye API",
  "tools": ["get_token_overview", "get_token_holders", "get_wallet_pnl"],
  "envVars": ["BIRDEYE_API_KEY"],
  "skills": ["token-analyst", "wallet-manager"]
}
```
Manifest enables dependency checking, tool mapping, and env var validation at install time.

---

## ██ TRADING, RISK & AUTOMATION (Items 19–26)

### 19. ★ Real Backtesting Engine
**Current:** `backtest_strategy` tool (lines ~1489-1520) generates random synthetic price data:
```ts
let price = 100 + Math.random() * 900;
for (let i = 0; i < days * 24; i++) {
  price *= 1 + (Math.random() - 0.48) * 0.02;
  prices.push(Math.round(price * 100) / 100);
}
```
This is not a backtest. It's a random number generator. Completely useless for strategy evaluation.
The comment says "Note: Demo backtest with synthetic data. Use real OHLCV for production."
**Fix:** Pull real OHLCV from Birdeye API or CoinGecko historical endpoint. Implement:
```ts
interface BacktestResult {
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  trades: BacktestTrade[];
  equityCurve: number[];
}
```
Support strategy JSON format (see Item 20). Cache historical data to avoid re-fetching.

### 20. ☆ Strategy Builder DSL
**Current:** The backtest tool accepts strategy description in natural language:
```ts
strategy: Type.String({ description: "Strategy description, e.g. 'Buy when RSI < 30, sell when RSI > 70'" })
```
Natural language strategies are inherently unreproducible — the agent interprets them differently each run.
**Fix:** Define a JSON strategy format:
```json
{
  "name": "RSI mean reversion",
  "timeframe": "1h",
  "entry": [
    { "indicator": "rsi", "period": 14, "operator": "<", "value": 30 },
    { "indicator": "volume", "condition": "above_average" }
  ],
  "exit": [
    { "indicator": "rsi", "period": 14, "operator": ">", "value": 70 }
  ],
  "filters": [
    { "indicator": "ema", "period": 200, "condition": "price_above" }
  ],
  "positionSize": { "type": "kelly", "fraction": 0.5 },
  "stopLoss": { "type": "atr", "multiplier": 2 }
}
```
Add `/strategy create` interactive wizard that builds this JSON. Save to `~/.jelly/strategies/`.
Backtest and paper-trade strategies with `/strategy backtest <name>`.

### 21. ☆ Risk Engine Integration
**Current:** The `risk-engine` and `position-manager` skills describe risk rules (max 5% position,
min 1.5:1 R/R, max 3x leverage, 10% daily drawdown cap) but these are NOT enforced anywhere.
The `PositionManager.ts` has `config.maxLeverage: 5` (not 3 as skills claim) and no portfolio-level
drawdown tracking. Tools like `execute_trade` have no pre-flight risk check.
**Fix:** Add a `RiskGate` middleware that wraps trade execution tools:
```ts
function riskGate(toolName: string, params: any): { allowed: boolean; reason?: string } {
  const portfolio = positionManager.getStats();
  if (params.leverage > 3) return { allowed: false, reason: 'Leverage cap: 3x' };
  const exposure = params.position_size_usd / portfolio.totalValue;
  if (exposure > 0.05) return { allowed: false, reason: 'Position size > 5% portfolio' };
  if (portfolio.dailyDrawdown > 0.10) return { allowed: false, reason: 'Daily drawdown > 10% — trading paused' };
  return { allowed: true };
}
```
The `calculate_risk` tool should call this before returning. The `execute_trade` tool should
call it before signing. Enforce the skill docs in code.

### 22. ☆ Replace AutoVault's Synthetic PnL with Real PnL
**Current:** `AutoVault.ts` (lines 1-60):
```ts
start(getPnL: () => number, onSweep?: (amount: number) => void): void {
  this.checkInterval = setInterval(() => this.check(getPnL), 60_000);
}
```
The `getPnL` callback is wired in `jellyos.ts` (line ~410):
```ts
let getPnL = (): number => 0;
try {
  const { PositionManager } = require("../src/trading/PositionManager");
  const pm = new PositionManager(new Metrics(new Logger("AutoVault")));
  getPnL = () => { try { return pm.getTotalPnL?.() ?? 0; } catch { return 0; } };
} catch { /* PositionManager unavailable, PnL stays 0 */ }
```
Two problems: (1) It creates a NEW PositionManager with no positions — PnL is always 0. (2) `getTotalPnL()`
doesn't exist on PositionManager — it has `getStats().totalUnrealizedPnL + totalRealizedPnL`.
**Fix:** The extension should maintain a single PositionManager instance. AutoVault's `start()` should
receive it from boot. The PnL callback should be `() => pm.getTotalPnL()` with a proper method added:
```ts
// In PositionManager.ts
getTotalPnL(): number {
  const stats = this.getStats();
  return stats.totalRealizedPnL + stats.totalUnrealizedPnL;
}
```
Right now AutoVault is a 60-line loop that checks `0 >= $500` every minute. It will never trigger.

### 23. ☆ Journal/Audit Trail
**Current:** Only vault sweeps are recorded (in `profits.vault`). No record of:
- Trades executed (entry/exit prices, sizes, reasons)
- Bridges initiated
- Alerts triggered
- Skills used
- Tool calls made

**Fix:** Add `~/.jelly/journal.jsonl` — append-only line-delimited JSON:
```jsonl
{"ts":1700000000,"type":"trade","symbol":"ETH","side":"long","size":0.5,"entry":3245,"stop":3100,"reason":"MACD crossover on 4h"}
{"ts":1700000100,"type":"bridge","from":"ethereum","to":"arbitrum","token":"USDC","amount":5000,"tx":"0x..."}
{"ts":1700000200,"type":"alert","symbol":"BTC","condition":">","threshold":80000,"triggered":true}
{"ts":1700000300,"type":"vault_sweep","amount":125.50,"note":"ETH long closed +3.8%"}
```
Rotate monthly: `journal-2026-05.jsonl`. Use for tax reporting, performance analysis, and debuggability.
The Logger already writes to `logs/jellyos-YYYY-MM-DD.log` — journal is for structured events, not logs.

### 24. · Tool Call Caching
**Current:** The `get_market_data` tool fetches prices fresh every call. If the agent calls it 3 times
for BTC, ETH, SOL in one turn, that's 3 HTTP requests. Same for `get_gas_prices`, `get_defi_tvl`, etc.
**Fix:** Add a TTL cache layer in the tool dispatcher:
```ts
const toolCache = new Map<string, { result: ToolContent; expiresAt: number }>();

const TTL: Record<string, number> = {
  get_market_data: 30_000,    // 30s — prices move fast
  get_gas_prices: 30_000,     // 30s
  get_defi_tvl: 300_000,      // 5min — TVL is slow
  get_fear_greed: 3_600_000,  // 1hr — Alternative.me updates hourly
  get_token_overview: 60_000, // 60s
  scan_chain: 15_000,         // 15s — on-chain data moves fast
};
// Cache key = `${toolName}:${JSON.stringify(params)}`
```
Invalidate cache on write operations. Expose cache stats via `/debug cache`.

### 25. ☆ Parallel Tool Execution for Turbo/Max Modes
**Current:** All 45 tools execute sequentially. `effect_level: turbo` and `max` are just labels —
the agent prompt mentions them, but no code changes execution behavior.
**Fix:** In the `@jellyos/agent` ToolDispatcher: when effect level is turbo or max, analyze the
tool call list for independent calls (different assets, different chains) and batch them:
```ts
// Dependency analysis: calls with different symbols are independent
const batches = partition(toolCalls, (a, b) => a.params.symbol !== b.params.symbol);
for (const batch of batches) {
  await Promise.all(batch.map(tc => executeTool(tc)));
}
```
This cuts 3-second turns to 1-second turns when the agent requests BTC, ETH, SOL prices simultaneously.

### 26. · Dry-Run Mode
**Current:** No way to preview what `execute_trade`, `bridge_assets`, or `vault_sweep` would do.
Users have to trust the agent or manually verify by reading the code.
**Fix:** Add `effect_level: dryrun`:
```ts
if (ctx.effectLevel === 'dryrun' && isWriteOperation(toolName)) {
  return text(`[DRY RUN] Would have called ${toolName} with:` +
    `\n${JSON.stringify(params, null, 2)}` +
    `\n\nTransaction NOT broadcast. Run /effect normal to enable execution.`);
}
```
All write tools (execute_trade, vault_sweep, bridge_assets, mint_nft, place_prediction_order)
return simulated results. Read tools work normally. The dashboard shows `DRY RUN` banner.

---

## ██ DATA PIPELINE & FEEDS (Items 27–34)

### 27. ★ Replace REST Polling with WebSocket Streams
**Current:** `FeedManager.ts` registers 21 data sources, every single one using `fetch()` + polling:
Binance REST (120s), CoinGecko REST (60s), CryptoCompare REST (300s). Prices are ~30-60s stale.
**Fix:** Add a WebSocket price source:
```ts
import WebSocket from 'ws';

this.register({
  name: 'binance_ws',
  interval: 0, // WebSocket — no polling
  enabled: true,
  fetch: async () => { /* handled by ws events, not polling */ },
});
// In start():
const ws = new WebSocket('wss://stream.binance.com:9443/ws/!miniTicker@arr');
ws.on('message', (data) => {
  const ticks = JSON.parse(data.toString());
  ticks.filter((t: any) => t.s.endsWith('USDT')).forEach((t: any) => {
    // Emit directly to listeners — bypass the polling queue
    for (const listener of this.listeners) {
      listener({ id: `ws-${t.s}-${Date.now()}`, source: 'binance_ws', ... });
    }
  });
});
```
Price feed becomes real-time. The REST source becomes a fallback. The `priceFeed` from `@jellyos/agent`
already has a `track()` + `start()` interface that could be backed by WebSocket.

### 28. ☆ Multi-Source Price Aggregation
**Current:** Prices come from a single source per endpoint. If CoinGecko returns stale data or a bad
price, every decision based on it is wrong.
**Fix:** Fetch prices from 3 sources and take the median:
```ts
const sources = [
  { name: 'coingecko', url: '...', parser: (d) => d.bitcoin.usd },
  { name: 'binance',   url: '...', parser: (d) => d.price },
  { name: 'birdeye',   url: '...', parser: (d) => d.price },
];

const prices = await Promise.allSettled(sources.map(s => fetchFrom(s)));
const validPrices = prices.filter(p => p.status === 'fulfilled').map(p => p.value);
const medianPrice = validPrices.sort((a,b) => a-b)[Math.floor(validPrices.length/2)];
const spread = Math.max(...validPrices) - Math.min(...validPrices);

if (spread / medianPrice > 0.02) {
  // Flag: >2% spread between sources — data quality issue
}
```
The `SignalEngine` should weight signal confidence by source agreement.

### 29. ☆ Full Birdeye API Surface
**Current:** `get_token_overview` returns basic data. The Birdeye API has 20+ endpoints:
- `/defi/token_security` — audit, honeypot check, ownership analysis
- `/defi/ohlcv` — candles for technical analysis
- `/defi/wallet/pnl` — wallet profit/loss history
- `/defi/token/top_traders` — most active/profitable traders
- `/defi/token/holders` — holder distribution over time
- `/defi/token/trade_data` — individual trade history
- `/defi/tokens/new_listing` — new tokens in timeframe

**Fix:** Expose each as a dedicated tool:
```ts
agent.registerTool({ name: "get_token_security", ... });
agent.registerTool({ name: "get_wallet_pnl", ... });
agent.registerTool({ name: "get_top_traders", ... });
agent.registerTool({ name: "get_new_listings", ... });
agent.registerTool({ name: "get_ohlcv", ... });
```
These are the most-used features in skills like `token-analyst`, `security-auditor`, and `dex-scanner`,
but they have no tool backing.

### 30. ☆ On-Chain Event Log Scanner
**Current:** `scan_chain` calls `alchemy_getAssetTransfers` which returns top-level transfers only.
No ERC-20 Transfer events, no Swap events, no PoolCreated events, no NFT transfer events.
**Fix:** Add `scan_events` tool that queries `eth_getLogs` with event signature topics:
```ts
const TOPICS = {
  ERC20_TRANSFER: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  UNISWAP_SWAP:   '0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbccfba',
  POOL_CREATED:   '0x783cca1c0412dd0d695e784568c96da2e9c22ff989357a2e8b1d9b2b4e6b7ce1',
};

const logs = await alchemy.getLogs({
  address: tokenAddress,
  topics: [TOPICS.ERC20_TRANSFER],
  fromBlock: currentBlock - 1000,
  toBlock: 'latest',
});
```
Index the last 1,000 blocks in memory. Detect: whale accumulation (wallet received > $50K), distribution
(wallet sent > 10% of holdings), contract deployments, MEV sandwich patterns.

### 31. ☆ Social Sentiment Scraper
**Current:** The `sentiment-analyzer` skill mentions "social buzz" and "volume spike > 3x normal"
but no tool scrapes social media. The `FeedManager` has a Reddit source that fetches
r/CryptoCurrency hot posts, and a CryptoCompare social stats source (followers, subscribers).
Neither does sentiment scoring.
**Fix:** Add `scan_social` tool that:
1. Queries the Reddit source for keyword mentions
2. Queries a simple keyword classifier for sentiment per post
3. Detects volume spikes (> 3σ above 7-day mean)
4. Returns aggregated sentiment score with volume context
```ts
agent.registerTool({
  name: "scan_social",
  description: "Scan social media for keyword mentions and sentiment",
  parameters: Type.Object({
    keyword: Type.String(),
    platforms: Type.Optional(Type.Array(Type.String(), { default: ['reddit'] })),
  }),
  async execute(_id, p) {
    // Get recent Reddit mentions matching keyword
    // Score each mention: positive/negative/neutral
    // Detect volume anomaly
    // Return sentiment score + volume context
  },
});
```

### 32. · RPC Health Dashboard
**Current:** `AlchemyClient.ts` has a `supportsChain(networkName)` method but no latency tracking or
rate-limit monitoring. If the Alchemy key is rate-limited, everything fails silently with `[]` returns.
**Fix:** Track per-endpoint latency and error rates in `Metrics`:
```ts
class RpcHealthTracker {
  private latencies: Map<string, number[]> = new Map();
  private errors: Map<string, number> = new Map();

  record(endpoint: string, latencyMs: number, error?: string): void { ... }
  getHealth(endpoint: string): { avgLatency: number; errorRate: number; status: 'ok' | 'slow' | 'error' } { ... }
  getAllHealth(): Record<string, { avgLatency: number; errorRate: number; status: string }> { ... }
}
```
The `/network` command should show: endpoint URL, avg latency, error rate, and color-coded status
(green < 50ms, yellow < 200ms, red > 200ms or errored). Read rate-limit remaining from response
headers (`x-ratelimit-remaining` on Alchemy responses).

### 33. ☆ DeFiLlama Deep Integration
**Current:** `get_defi_tvl` returns basic TVL for protocols and chains. The FeedManager polls
`https://api.llama.fi/v2/chains` for top-5 chain TVL. DeFiLlama has much more:
- Protocol TVL history `/protocol/{slug}` — shows TVL over time
- Chain TVL breakdown `/chain/{name}` — protocol-level breakdown
- TVL changers `/protocols` — gainers and losers sorted by change
- Fees/revenue `/overview/fees/{slug}` — protocol fee generation
- Stablecoin TVL `/stablecoin/{chain}` — stablecoin dominance

**Fix:** Map these to tools that the `defi-tvl-predictor` skill can use:
```ts
agent.registerTool({ name: "get_protocol_tvl", ... });      // Protocol TVL + history
agent.registerTool({ name: "get_tvl_changers", ... });      // Top gainers/losers
agent.registerTool({ name: "get_protocol_fees", ... });     // Fee generation
agent.registerTool({ name: "get_stablecoin_tvl", ... });    // Stablecoin dominance
```

### 34. ☆ RPC Transport Pool
**Current:** Every Alchemy call creates a new `fetch()`. No connection pooling, no keepalive, no
request pipelining. For back-to-back calls (getBalance + getTokenBalances + getAssetTransfers),
each opens a new HTTPS connection.
**Fix:** Create a shared HTTP agent with keepalive:
```ts
import { Agent } from 'node:https';

const rpcAgent = new Agent({
  keepAlive: true,
  keepAliveMsecs: 30_000,
  maxSockets: 10,
  maxFreeSockets: 5,
  timeout: 15_000,
});

const res = await fetch(url, { agent: rpcAgent, ... });
```
For WebSocket RPC sources (Binance, Solana), use a single persistent connection that multiplexes
subscription channels instead of opening per-source connections.

---

## ██ DASHBOARD & CROSS-PLATFORM (Items 35–40)

### 35. ★ Streaming Agent Responses to Dashboard
**Current:** The dashboard's `useDashboardStream.ts` handles `text_delta` and `turn_done` events
(lines 113-117) — it accumulates streaming text. But the extension never emits these events.
The `broadcastWs` function only maps `vault_sweep`, `prices`, `trade`, `signals`, `log`, `agent`,
and `swarm` — no `text_delta` or any streaming event types.
**Fix:** The extension needs to intercept the agent's streaming response. The `@jellyos/agent` SDK's
`AgentRunner` streams tokens through a callback — the extension should subscribe and broadcast:
```ts
agent.on("agent_stream", (token: string) => {
  broadcastWs("text_delta", { text: token });
});
agent.on("agent_turn_complete", () => {
  broadcastWs("turn_done", { ts: Date.now() });
});
```
This enables the dashboard to show the agent's response as it's generated, not just after completion.

### 36. ☆ Dashboard PWA & Mobile Support
**Current:** The dashboard runs on `localhost:4320` via WebSocket. Desktop-only. No PWA manifest,
no service worker, no mobile layout.
**Fix:** Add `public/manifest.json` for PWA support. The dashboard already uses Vite + React + Tailwind —
it needs responsive breakpoints:
```css
/* Current layout is desktop grid. Add: */
@media (max-width: 768px) {
  .dashboard-grid { grid-template-columns: 1fr; }
  .sidebar { display: none; }
  .mobile-nav { display: flex; }
}
```
Register a service worker for offline caching of static assets. Add `--dashboard-host 0.0.0.0` flag
to `bin/jellyos` for LAN access from mobile devices.

### 37. · Agent Message Stream in Dashboard
**Current:** Dashboard can send messages to agent via `sendMessage()` (WebSocket type: `agent_message`),
and the extension injects them via `_dashboardMessages` array in `before_agent_start`. The dashboard
shows its own messages in the state but has no way to see the agent's response to those messages
(no streaming support — see Item 35).
**Fix:** Once streaming is wired (Item 35), add a chat-like interface to the dashboard:
```
[User]   What's the BTC price?
[Agent]  BTC $76,450 — up 2.3% in 24h...
```
Show agent typing indicator while response is streaming. Use the dashboard's `dashboardMessages`
array already in state management.

### 38. ☆ Historical Vault Chart
**Current:** `VaultManager.getStats()` returns current balance and entry count. No historical data
beyond the raw entry list (only accessible via `/history` command). The dashboard shows a single
`vaultBalance` number.
**Fix:** Expose vault history as structured time-series data:
```ts
// In VaultManager
getBalanceHistory(): { ts: number; balance: number; event: string }[] {
  let runningBalance = 0;
  return this.data!.entries.map(e => {
    runningBalance += e.amount;
    return { ts: e.timestamp, balance: runningBalance, event: e.note };
  });
}
```
The dashboard renders a balance-over-time line chart (sparkline or lightweight chart library).
Green line going up = profits accumulating. Red dips = withdrawals.

### 39. · Dashboard Signal Feed Panel
**Current:** Dashboard receives `signal_update` events but the `broadcastWs` function never maps
any event name to `signal_update`. The `signals` array in dashboard state is always empty.
**Fix:** In `SignalEngine.processItem()`, after generating a signal, broadcast:
```ts
broadcastWs("signal_update", { id: signal.id, asset: signal.asset,
  direction: signal.direction, strength: signal.strength,
  rationale: signal.rationale.slice(0, 100) });
```
The dashboard renders: asset, direction arrow (↑↓), strength bar, and rationale. Sorted by
recency. Expired signals fade to gray instead of being removed.

### 40. ☆ Headless Bot Mode
**Current:** The launcher supports `jellyos` (interactive TUI) and `jellyos setup` (wizard).
No headless daemon mode. The Telegram and Discord bridges only work while the TUI is open.
**Fix:** Add `--bot` flag:
```bash
jellyos --bot --no-tui
```
In headless mode: no Ink TUI, no readline. Instead, starts the agent loop, connects Telegram/Discord
bridges, and runs scheduled tasks on a timer. Agent receives messages from Telegram/Discord/webhook,
processes them, sends responses. Exits on SIGTERM.
```ts
if (process.argv.includes('--bot')) {
  // Skip TUI, start agent directly
  const agent = new AgentRunner({ ... });
  agent.on("message", handleMessage);
  // Poll Telegram/Discord on intervals
  setInterval(tgPoll, 3000);
  setInterval(dcPoll, 5000);
  // Scheduled task loop
  setInterval(runScheduledTasks, 60_000);
}
```
This turns JellyOS from a CLI tool into a 24/7 trading bot that lives in a tmux session.
Combined with the journal (Item 23) and health tracking (Item 17), it becomes production-grade.
