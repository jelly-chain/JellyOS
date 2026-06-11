/**
 * @jellyos/agent — public API
 *
 * Extension files import from here:
 *   import { Type } from "@jellyos/agent"
 *   import type { ExtensionAPI } from "@jellyos/agent"
 */

// Re-export TypeBox Type builder — drop-in for Pi's @earendil-works/pi-ai
export { Type, type Static } from "@sinclair/typebox";

// Extension API types
export type {
  ExtensionAPI,
  ExtensionModule,
  CommandDef,
  CommandContext,
  UIContext,
  ThemeContext,
  ToolDef,
  ToolContent,
  SkillDef,
  SessionEvent,
  SessionContext,
} from "./api/ExtensionAPI";

// text() helper — same as what Pi provides
export { text } from "./api/ExtensionAPI";

// Registry (for advanced use / testing)
export { Registry } from "./api/Registry";

// Runner components
export { AgentRunner }    from "./runner/AgentRunner";
export { ModelClient, resolveModelConfig } from "./runner/ModelClient";
export { ToolDispatcher } from "./runner/ToolDispatcher";

// Loader (for embedding the agent in other tools)
export { loadExtension } from "./loader";

// Theme
export { makeTheme, T, JELLY_COLORS } from "./tui/theme";

// Model intelligence
export { ModelRegistry, modelRegistry, classifyModel } from "./models/ModelRegistry";
export { CostTracker } from "./models/CostTracker";
export type { OpenRouterModel, TieredModel, TieredPool, ModelTier } from "./models/ModelRegistry";
export type { UsageEntry, SessionUsage, LifetimeUsage } from "./models/CostTracker";

// Tools
export { fullAnalysis, rsi, macd, ema, sma, bollingerBands, atr, getCandlesTool, getCandlesParams } from "./tools/TechnicalAnalysis";
export { PriceFeed, priceFeed, getPricesTool, topMoversTool, marketOverviewTool } from "./tools/PriceFeed";
export { NewsFeed, newsFeed, getNewsTool, scoreSentiment } from "./tools/NewsSentiment";
export {
  getFearGreedTool, fundingRatesParams, getFundingRatesTool,
  getBtcMempoolTool, getDefiTvlTool, getSolanaStatsTool,
} from "./tools/MarketSentiment";
export type { OHLCV, AnalysisResult } from "./tools/TechnicalAnalysis";
export type { PriceTick } from "./tools/PriceFeed";
export type { NewsItem, SentimentReport } from "./tools/NewsSentiment";

// Session / Memory / Goals / Context
export { SessionManager } from "./session/SessionManager";
export { MemoryStore, memoryStore } from "./session/MemoryStore";
export { GoalManager, goalManager } from "./session/GoalManager";
export { ContextStore, contextStore } from "./session/ContextStore";
export type { MemoryEntry, RecentSession } from "./session/MemoryStore";
export type { Goal } from "./session/GoalManager";
export type { TaskContext } from "./session/ContextStore";
export type { ContextPressure } from "./session/SessionManager";

// MCP server
export { MCPServer } from "./mcp/server";

// Scheduler
export { AgentScheduler, agentScheduler } from "./scheduler/AgentScheduler";
export type { ScheduledTask, PriceTrigger } from "./scheduler/AgentScheduler";

// Telemetry
export { Tracer } from "./telemetry/Tracer";
export type { Span, Trace } from "./telemetry/Tracer";
