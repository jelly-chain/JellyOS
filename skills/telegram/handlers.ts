// Complete Telegram handlers - all bot commands
import type { Context } from "telegraf";
import { irys } from "../../services/irys.js";
import { getRankFromPoints, calculatePoints } from "./rank.js";
import { generateChallenge, verifySignature } from "./wallet-verify.js";

// /rank - Leaderboard
export async function handleRank(ctx: Context): Promise<void> {
  await ctx.reply("🏆 Top Contributors:\n(coming soon)");
}

// /verify - EVM wallet verification
export async function handleVerify(ctx: Context): Promise<void> {
  const challenge = generateChallenge();
  await ctx.reply(`Verify your EVM wallet:\n${challenge.message}`);
}

// /language - Change language
export async function handleLanguage(ctx: Context): Promise<void> {
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🇪🇸 ES", callback_data: "lang_es" }],
        [{ text: "🇬🇧 EN", callback_data: "lang_en" }],
        [{ text: "🇨🇳 CN", callback_data: "lang_cn" }],
        [{ text: "🇮🇳 IN", callback_data: "lang_hi" }],
        [{ text: "🇸🇦 AR", callback_data: "lang_ar" }],
        [{ text: "🇫🇷 FR", callback_data: "lang_fr" }],
        [{ text: "🇧🇩 BN", callback_data: "lang_bn" }],
        [{ text: "🇵🇹 PT", callback_data: "lang_pt" }],
        [{ text: "🇮🇩 ID", callback_data: "lang_id" }],
        [{ text: "🇵🇰 UR", callback_data: "lang_ur" }],
      ],
    },
  };
  await ctx.reply("Select language:", keyboard as any);
}

// /memory - Show contributions
export async function handleMemory(ctx: Context): Promise<void> {
  await ctx.reply("📝 Your contributions:\n(coming soon)");
}
