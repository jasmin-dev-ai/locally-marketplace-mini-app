/**
 * initBot.ts
 * ──────────
 * Auto-initialization module for the Locally Marketplace Telegram Bot.
 *
 * Responsibilities:
 *   1. Bind the live Cloudflare Workers URL as the Bot Menu Button WebApp target.
 *   2. Register bot commands (/start, /help, /orders).
 *   3. Expose a lightweight `initBot()` function callable from any environment
 *      (browser fetch, Node.js script, Cloudflare Worker).
 *
 * Called automatically from `scripts/setup-bot.mjs` and can also be triggered
 * from within the Mini App itself (admin-only) via the exported helpers below.
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const LIVE_CLOUDFLARE_URL =
  'https://locally-marketplace-mini-app.jasminamurxamidinova08.workers.dev'

const BOT_TOKEN = '8850768299:AAFn1jyiGevunwq3O7kMqev1AqxIBKdu28A'

const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InitBotResult {
  success: boolean
  steps: InitBotStep[]
  webAppUrl: string
}

export interface InitBotStep {
  name: string
  ok: boolean
  error?: string
}

interface TgApiResponse<T = unknown> {
  ok: boolean
  result?: T
  description?: string
}

// ─── API Helper ───────────────────────────────────────────────────────────────

async function tgPost<T = unknown>(
  method: string,
  body: Record<string, unknown>
): Promise<T> {
  const res = await fetch(`${TG_API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data: TgApiResponse<T> = await res.json()
  if (!data.ok) {
    throw new Error(data.description ?? `Telegram ${method} returned ok=false`)
  }
  return data.result as T
}

// ─── Step 1: Set Chat Menu Button ────────────────────────────────────────────
//
//   Registers a global WebApp menu button that appears for every user who
//   opens a chat with the bot. No chat_id = applies to ALL private chats.

export async function setChatMenuButton(webAppUrl: string = LIVE_CLOUDFLARE_URL): Promise<boolean> {
  return tgPost<boolean>('setChatMenuButton', {
    menu_button: {
      type: 'web_app',
      text: '🛍️ Locally',
      web_app: { url: webAppUrl },
    },
  })
}

// ─── Step 2: Register Commands ────────────────────────────────────────────────

export async function registerBotCommands(): Promise<boolean> {
  return tgPost<boolean>('setMyCommands', {
    commands: [
      { command: 'start',  description: '🛍️ Open Locally Marketplace' },
      { command: 'help',   description: '❓ How to use Locally' },
      { command: 'orders', description: '📦 View my recent orders' },
    ],
    scope: { type: 'all_private_chats' },
  })
}

// ─── Step 3: Update Bot Description ──────────────────────────────────────────

export async function updateBotDescription(): Promise<boolean> {
  await tgPost<boolean>('setMyDescription', {
    description:
      '🥐 Locally is your neighbourhood artisan marketplace inside Telegram.\n\n' +
      'Discover freshly baked sourdough, golden samsa, raw honey, handmade crafts — ' +
      'all delivered by local couriers straight to your door in Tashkent.',
  })
  await tgPost<boolean>('setMyShortDescription', {
    short_description: '🛍️ Your neighbourhood artisan marketplace.',
  })
  return true
}

// ─── Step 4: Send /start welcome message ─────────────────────────────────────
//
//   Called by the bot's message handler whenever a user sends /start.
//   Delivers a rich HTML welcome card with a WebApp launch button.

export async function sendWelcomeMessage(
  chatId: number,
  firstName: string,
  webAppUrl: string = LIVE_CLOUDFLARE_URL
): Promise<void> {
  const safeName = firstName
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  await tgPost('sendMessage', {
    chat_id: chatId,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    text:
      `👋 <b>Salaam, ${safeName}!</b>\n\n` +
      `Welcome to <b>Locally Marketplace</b> 🥐🍯🧵\n` +
      `Your neighbourhood hub for authentic, artisan-crafted goods.\n\n` +
      `<b>What you'll find:</b>\n` +
      `• 🍞 Fresh sourdough &amp; pastries baked daily\n` +
      `• 🥟 Golden samsa &amp; home-style meals\n` +
      `• 🍯 Pure raw honey &amp; organic preserves\n` +
      `• 🧵 Handmade crafts &amp; local artisan goods\n\n` +
      `Tap the button below to browse the marketplace ↓`,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🛍️ Open Locally Marketplace',
            web_app: { url: webAppUrl },
          },
        ],
        [
          { text: '📦 My Orders', callback_data: 'view_orders' },
          { text: '❓ Help',      callback_data: 'help' },
        ],
      ],
    },
  })
}

// ─── Step 5: Send /help message ───────────────────────────────────────────────

export async function sendHelpMessage(
  chatId: number,
  webAppUrl: string = LIVE_CLOUDFLARE_URL
): Promise<void> {
  await tgPost('sendMessage', {
    chat_id: chatId,
    parse_mode: 'HTML',
    text:
      `❓ <b>How to use Locally Marketplace</b>\n\n` +
      `1️⃣ Tap <b>"🛍️ Locally"</b> in the menu button (bottom-left of this chat)\n` +
      `2️⃣ Browse artisan categories — Breads, Meals, Honey, Crafts &amp; more\n` +
      `3️⃣ Add items to your basket and pick a delivery slot\n` +
      `4️⃣ Checkout — track your order live right here in Telegram\n\n` +
      `📍 Currently serving <b>Tashkent</b> neighbourhood deliveries.\n\n` +
      `🔗 Direct link: <code>${webAppUrl}</code>`,
    reply_markup: {
      inline_keyboard: [
        [{ text: '🛍️ Open Marketplace', web_app: { url: webAppUrl } }],
      ],
    },
  })
}

// ─── Main: initBot() ──────────────────────────────────────────────────────────
//
//   Orchestrates all setup steps and returns a structured result object.
//   Safe to call from Node.js, Cloudflare Workers, or browser (admin flow).

export async function initBot(
  webAppUrl: string = LIVE_CLOUDFLARE_URL
): Promise<InitBotResult> {
  const steps: InitBotStep[] = []

  const run = async (name: string, fn: () => Promise<unknown>) => {
    try {
      await fn()
      steps.push({ name, ok: true })
    } catch (err) {
      steps.push({
        name,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  await run('Set Chat Menu Button (WebApp)', () => setChatMenuButton(webAppUrl))
  await run('Register bot commands', () => registerBotCommands())
  await run('Update bot description', () => updateBotDescription())

  const allOk = steps.every((s) => s.ok)

  return { success: allOk, steps, webAppUrl }
}

// ─── Convenience: printResult ─────────────────────────────────────────────────

export function printInitResult(result: InitBotResult): void {
  console.log('\n🤖 Locally Bot Initialization Report')
  console.log('─'.repeat(48))
  console.log(`  WebApp URL : ${result.webAppUrl}`)
  console.log(`  Overall    : ${result.success ? '✅ SUCCESS' : '⚠️  PARTIAL'}`)
  console.log()
  for (const step of result.steps) {
    const icon = step.ok ? '✅' : '❌'
    console.log(`  ${icon} ${step.name}`)
    if (step.error) console.log(`     ↳ ${step.error}`)
  }
  console.log()
}
