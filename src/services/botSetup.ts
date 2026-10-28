/**
 * botSetup.ts
 * -----------
 * Telegram Bot API configuration helpers for the Locally Marketplace bot.
 *
 * Registers:
 *   1. Chat Menu Button  — appears next to the text input in every chat.
 *   2. Bot Commands      — /start (and others) visible in the command menu.
 *   3. Webhook or getMe  — verifies token connectivity.
 *
 * This module is safe to import inside the Vite app (no Node-only APIs).
 * Run the standalone Node script  `scripts/setup-bot.mjs`  to execute once.
 */

const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN as string
const WEBAPP_URL = import.meta.env.VITE_WEBAPP_URL as string
const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function tgPost<T = unknown>(
  method: string,
  body: Record<string, unknown>
): Promise<T> {
  const res = await fetch(`${API_BASE}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = (await res.json()) as { ok: boolean; result?: T; description?: string }
  if (!data.ok) {
    throw new Error(`Telegram ${method} failed: ${data.description}`)
  }
  return data.result as T
}

async function tgGet<T = unknown>(method: string): Promise<T> {
  const res = await fetch(`${API_BASE}/${method}`)
  const data = (await res.json()) as { ok: boolean; result?: T; description?: string }
  if (!data.ok) {
    throw new Error(`Telegram ${method} failed: ${data.description}`)
  }
  return data.result as T
}

// ─── 1. Verify bot token ──────────────────────────────────────────────────────

export interface BotInfo {
  id: number
  first_name: string
  username: string
  can_join_groups: boolean
  supports_inline_queries: boolean
}

export const verifyBotToken = (): Promise<BotInfo> => tgGet<BotInfo>('getMe')

// ─── 2. Set Chat Menu Button ──────────────────────────────────────────────────
//
//   Attaches a "🛍️ Open Locally" WebApp button to the bottom-left menu of
//   EVERY chat the user opens with the bot (global default, no chat_id).

export interface SetMenuButtonResult {
  ok: boolean
}

export const setChatMenuButton = (webAppUrl: string): Promise<boolean> =>
  tgPost<boolean>('setChatMenuButton', {
    menu_button: {
      type: 'web_app',
      text: '🛍️ Open Locally',
      web_app: { url: webAppUrl },
    },
  })

// ─── 3. Set Bot Commands ──────────────────────────────────────────────────────

export const setBotCommands = (): Promise<boolean> =>
  tgPost<boolean>('setMyCommands', {
    commands: [
      { command: 'start', description: '🛍️ Open Locally Marketplace' },
      { command: 'help', description: '❓ How to use Locally' },
      { command: 'orders', description: '📦 View my recent orders' },
    ],
    scope: { type: 'all_private_chats' },
  })

// ─── 4. Set Bot Description & Short Description ───────────────────────────────

export const setBotDescription = (): Promise<boolean> =>
  tgPost<boolean>('setMyDescription', {
    description:
      '🥐 Locally is your neighbourhood artisan marketplace inside Telegram.\n\n' +
      'Discover freshly baked sourdough, golden samsa, raw honey, handmade crafts — ' +
      'all delivered by local couriers straight to your door.',
  })

export const setBotShortDescription = (): Promise<boolean> =>
  tgPost<boolean>('setMyShortDescription', {
    short_description: '🛍️ Your neighbourhood artisan marketplace.',
  })

// ─── 5. Send /start welcome message to a user ────────────────────────────────
//
//   Called by a webhook handler or polling loop whenever a user sends /start.
//   Sends a rich welcome card with an inline keyboard WebApp launcher button.

export interface SendMessageResult {
  message_id: number
  chat: { id: number }
}

export const sendStartWelcome = (chatId: number, firstName: string, webAppUrl: string): Promise<SendMessageResult> => {
  const escapedName = firstName.replace(/[<>&]/g, (c) =>
    c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&amp;'
  )

  const text =
    `👋 <b>Salaam, ${escapedName}!</b>\n\n` +
    `Welcome to <b>Locally Marketplace</b> 🥐🍯🧵 — your neighbourhood hub for authentic, artisan-crafted goods made right here in your city.\n\n` +
    `<b>What you'll find:</b>\n` +
    `• 🍞 Fresh sourdough &amp; pastries baked daily\n` +
    `• 🥟 Golden samsa &amp; home-style meals\n` +
    `• 🍯 Pure raw honey &amp; organic preserves\n` +
    `• 🧵 Handmade crafts &amp; local artisan goods\n\n` +
    `Tap the button below to open the marketplace ↓`

  return tgPost<SendMessageResult>('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🛍️ Open Locally Marketplace',
            web_app: { url: webAppUrl },
          },
        ],
        [
          {
            text: '📦 View Orders',
            callback_data: 'view_orders',
          },
          {
            text: '❓ Help',
            callback_data: 'help',
          },
        ],
      ],
    },
  })
}

// ─── 6. Send /help message ────────────────────────────────────────────────────

export const sendHelpMessage = (chatId: number, webAppUrl: string): Promise<SendMessageResult> =>
  tgPost<SendMessageResult>('sendMessage', {
    chat_id: chatId,
    text:
      `❓ <b>How to use Locally Marketplace</b>\n\n` +
      `1️⃣ Tap <b>"🛍️ Open Locally"</b> in the menu button (bottom-left of this chat) or use /start\n` +
      `2️⃣ Browse artisan categories — Breads, Meals, Honey, Crafts\n` +
      `3️⃣ Add items to your basket and choose a delivery slot\n` +
      `4️⃣ Confirm checkout — we'll notify you of every status update right here in Telegram!\n\n` +
      `📍 Currently serving <b>Tashkent</b> neighbourhood deliveries.`,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: '🛍️ Open Marketplace', web_app: { url: webAppUrl } }],
      ],
    },
  })

// ─── 7. Answer callback queries ──────────────────────────────────────────────

export const answerCallbackQuery = (callbackQueryId: string, text?: string): Promise<boolean> =>
  tgPost<boolean>('answerCallbackQuery', {
    callback_query_id: callbackQueryId,
    text: text ?? '',
    show_alert: false,
  })

// ─── 8. Delete webhook (for polling mode) ────────────────────────────────────

export const deleteWebhook = (): Promise<boolean> =>
  tgPost<boolean>('deleteWebhook', { drop_pending_updates: false })

// ─── 9. Get webhook info ──────────────────────────────────────────────────────

export interface WebhookInfo {
  url: string
  has_custom_certificate: boolean
  pending_update_count: number
  last_error_date?: number
  last_error_message?: string
}

export const getWebhookInfo = (): Promise<WebhookInfo> => tgGet<WebhookInfo>('getWebhookInfo')

// ─── 10. Full setup runner (called from the standalone script) ────────────────

export const runFullBotSetup = async (webAppUrl: string): Promise<void> => {
  console.log('\n🤖 Locally Marketplace — Telegram Bot Setup\n' + '─'.repeat(48))

  // Verify token
  const bot = await verifyBotToken()
  console.log(`✅ Bot verified: @${bot.username} (ID: ${bot.id})`)

  // Set menu button
  await setChatMenuButton(webAppUrl)
  console.log(`✅ Chat menu button set → ${webAppUrl}`)

  // Set commands
  await setBotCommands()
  console.log('✅ Bot commands registered: /start, /help, /orders')

  // Set description
  await setBotDescription()
  await setBotShortDescription()
  console.log('✅ Bot description & short description updated')

  // Webhook info
  const wh = await getWebhookInfo()
  if (wh.url) {
    console.log(`ℹ️  Active webhook: ${wh.url}`)
  } else {
    console.log('ℹ️  No webhook active — bot is in polling mode')
  }

  console.log('\n🎉 Bot setup complete! Users can now:\n' +
    '   • Press the menu button to open the Mini App\n' +
    '   • Send /start to receive the welcome message\n' +
    '   • Send /help for usage instructions\n')
}
