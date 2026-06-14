// Telegram Skill - Main entry point
import { Telegraf } from "telegraf";
import type { Context } from "telegraf";
import { irys } from "../../services/irys.js";
import type { IrysTag, IrysUploadResult } from "../../services/irys.js";
import { getRankFromPoints, calculatePoints } from "./rank.js";
import type { UserProfile } from "./types.js";

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
    this.bot.start(async (ctx) => {
      const uidHash = hashUid(ctx.from.id);
      const lang = ctx.from.language_code || "en";
      await ctx.reply(`Welcome to JellyOS! Language: ${lang}`);
    });

    this.bot.help(async (ctx) => {
      await ctx.reply(`/contribute - Submit contribution\n/status - View points\n/rank - Leaderboard`);
    });

    this.bot.on("text", async (ctx) => {
      const text = ctx.message.text;
      if (text.length >= 20 && !text.startsWith("/")) {
        await this.handleContribution(ctx, text);
      }
    });
  }

  private async handleContribution(ctx: Context, text: string): Promise<void> {
    const score = Math.random() * 10;
    const points = calculatePoints(score);
    const tags: IrysTag[] = [
      { name: "App-Name", value: "JellyOS" },
      { name: "data-type", value: "contribution" },
      { name: "quality-score", value: score.toFixed(2) },
      { name: "points", value: String(points) },
    ];
    try {
      const result: IrysUploadResult = await irys.upload(Buffer.from(text), tags);
      await ctx.reply(`Saved! CID: ${result.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      await ctx.reply(`Failed: ${msg}`);
    }
  }
}

export function createTelegramSkill(opts?: TelegramSkillOptions): TelegramSkill {
  return new TelegramSkill(opts);
}
