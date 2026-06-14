// Telegram Skill - Main entry point
import { Telegraf } from "telegraf";
import type { Context } from "telegraf";
import { irys } from "../../services/irys.js";
import { getRankFromPoints, calculatePoints } from "./rank.js";
import type { UserProfile, RankTier } from "./types.js";

const JELLY_HOME = process.env.JELLYOS_HOME || require("node:path").join(require("node:os").homedir(), ".jelly");
const envPath = `${JELLY_HOME}/.env`;

// Hash Telegram UID for privacy
function hashUid(uid: number): string {
  return require("node:crypto")
    .createHash("sha256")
    .update(`JellyOS_${uid}`)
    .digest("hex")
    .slice(0, 12);
}

// Load env file
function loadEnv(): Record<string, string> {
  const fs = require("node:fs");
  const env: Record<string, string> = {};
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m) env[m[1]] = m[2];
    }
  }
  return env;
}

export interface TelegramSkillOptions {
  botToken?: string;
  adminIds?: number[];
  jurors?: string[];
  thinkers?: string[];
}

export class TelegramSkill {
  private bot: Telegraf<Context>;
  private env: Record<string, string>;

  constructor(opts: TelegramSkillOptions = {}) {
    this.env = loadEnv();
    const token = opts.botToken || this.env.TELEGRAM_BOT_TOKEN || "";
    this.bot = new Telegraf(token);
  }

  async start(): Promise<void> {
    if (!this.env.TELEGRAM_BOT_TOKEN) {
      console.error("TELEGRAM_BOT_TOKEN not configured");
      return;
    }
    await irys.start();
    this.registerHandlers();
    this.bot.launch();
    console.log("Telegram bot started");
  }

  async stop(): Promise<void> {
    this.bot.stop();
    await irys.stop();
  }

  private registerHandlers(): void {
    // /start
    this.bot.start(async (ctx) => {
      const lang = ctx.from.language_code || "en";
      await ctx.reply(`🪼 JellyOS Bot\nLanguage: ${lang}\nSend /help for commands`);
    });

    // /help
    this.bot.help(async (ctx) => {
      await ctx.reply(`Commands:
/contribute - Submit contribution  
/status   - View points + rank
/rank     - Leaderboard
/memory   - Your contributions
/verify   - EVM wallet verification
/language - Change language`);
    });

    // /contribute - just tell user to send text
    this.bot.command("contribute", async (ctx) => {
      await ctx.reply("Send your contribution (min 20 chars):");
    });

    // /rank - Leaderboard
    this.bot.command("rank", async (ctx) => {
      await ctx.reply("🏆 Top 10:\n(coming soon)");
    });

    // /memory
    this.bot.command("memory", async (ctx) => {
      await ctx.reply("📝 Your contributions:\n(coming soon)");
    });

    // /verify - EVM wallet
    this.bot.command("verify", async (ctx) => {
      const { generateChallenge } = await import("./wallet-verify.js");
      const challenge = generateChallenge();
      await ctx.reply(`Verify EVM wallet:\n${challenge.message}`);
    });

    // /language
    this.bot.command("language", async (ctx) => {
      await ctx.reply("Select language:", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "🇪🇸 ES", callback_data: "lang_es" }],
            [{ text: "🇬🇧 EN", callback_data: "lang_en" }],
            [{ text: "🇨🇳 CN", callback_data: "lang_cn" }],
            [{ text: "🇮🇳 IN", callback_data: "lang_hi" }],
          ],
        } as any,
      });
    });

    // Text handler for contributions
    this.bot.on("text", async (ctx) => {
      const text = ctx.message.text;
      if (text.length >= 20 && !text.startsWith("/")) {
        await this.handleContribution(ctx, text);
      }
    });

    // /status
    this.bot.command("status", async (ctx) => {
      const profile: UserProfile = {
        points: 0,
        rank: "Seedling",
        language: ctx.from.language_code || "en",
        trustScore: 5.0,
        dailyAportesCount: 0,
        contributionCount: 0,
        totalUsesCount: 0,
        lastSeenTs: Date.now(),
      };
      const rank: RankTier = getRankFromPoints(profile.points);
      await ctx.reply(`Points: ${profile.points}
Rank: ${rank.emoji} ${rank.name}
Daily: ${profile.dailyAportesCount}/${rank.dailyLimit}`);
    });
  }

  private async handleContribution(ctx: Context, text: string): Promise<void> {
    const score = Math.random() * 10;
    const points = calculatePoints(score);
    const tags = [
      { name: "App-Name", value: "JellyOS" },
      { name: "data-type", value: "contribution" },
      { name: "quality-score", value: score.toFixed(2) },
      { name: "points", value: String(points) },
      { name: "Content-Type", value: "text/plain" },
    ];
    try {
      const result = await irys.upload(Buffer.from(text), tags);
      await ctx.reply(`✅ Saved! CID: https://gateway.irys.xyz/${result.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      await ctx.reply(`❌ Failed: ${msg}`);
    }
  }
}

export function createTelegramSkill(opts?: TelegramSkillOptions): TelegramSkill {
  return new TelegramSkill(opts);
}
