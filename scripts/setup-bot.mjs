#!/usr/bin/env node
/**
 * setup-bot.mjs
 * ─────────────
 * One-shot Telegram Bot configuration script for Locally Marketplace.
 *
 * Usage:
 *   node scripts/setup-bot.mjs [WEBAPP_URL]
 *
 * Examples:
 *   node scripts/setup-bot.mjs https://locally-marketplace.pages.dev
 *   node scripts/setup-bot.mjs  # reads VITE_WEBAPP_URL from .env
 *
 * Requires Node.js ≥ 18 (native fetch). No extra npm packages needed.
 */

import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// ─── Load .env manually (no dotenv dep needed) ───────────────────────────────

function loadEnv() {
  const envPath = resolve(ROOT, '.env')
  if (!existsSync(envPath)) return {}
  const raw = readFileSync(envPath, 'utf8')
  const env = {}
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
    env[key] = val
  }
  return env
}

const env = loadEnv()

const BOT_TOKEN = env.VITE_TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN
const WEBAPP_URL =
  process.argv[2] ||
  env.VITE_APP_URL ||
  env.VITE_WEBAPP_URL ||
  process.env.VITE_APP_URL ||
  process.env.VITE_WEBAPP_URL ||
  'https://locally-marketplace-mini-app.jasminamurxamidinova08.workers.dev'

const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`

// ─── Validation ───────────────────────────────────────────────────────────────

if (!BOT_TOKEN || BOT_TOKEN === 'YOUR_BOT_TOKEN') {
  console.error('❌ VITE_TELEGRAM_BOT_TOKEN is not set in .env')
  process.exit(1)
}

if (!WEBAPP_URL || WEBAPP_URL === 'YOUR_CLOUDFLARE_PAGES_URL') {
  console.error(
    '❌ No WebApp URL provided.\n' +
    '   Pass it as an argument:  node scripts/setup-bot.mjs https://your-app.pages.dev\n' +
    '   Or add VITE_WEBAPP_URL=https://your-app.pages.dev to your .env file'
  )
  process.exit(1)
}

// ─── Telegram API helpers ─────────────────────────────────────────────────────

async function tgPost(method, body) {
  const res = await fetch(`${API_BASE}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!data.ok) {
    throw new Error(`❌ Telegram ${method} failed: ${data.description}`)
  }
  return data.result
}

async function tgGet(method) {
  const res = await fetch(`${API_BASE}/${method}`)
  const data = await res.json()
  if (!data.ok) {
    throw new Error(`❌ Telegram ${method} failed: ${data.description}`)
  }
  return data.result
}

// ─── Setup steps ──────────────────────────────────────────────────────────────

async function step(label, fn) {
  try {
    const result = await fn()
    console.log(`  ✅ ${label}`)
    return result
  } catch (err) {
    console.error(`  ❌ ${label}\n     ${err.message}`)
    return null
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════╗')
  console.log('║     🛍️  Locally Marketplace — Bot Setup Script       ║')
  console.log('╚══════════════════════════════════════════════════════╝\n')
  console.log(`  Bot Token : ${BOT_TOKEN.slice(0, 12)}...${BOT_TOKEN.slice(-6)}`)
  console.log(`  WebApp URL: ${WEBAPP_URL}\n`)
  console.log('─'.repeat(56))

  // 1. Verify bot token
  const bot = await step('Verifying bot token (getMe)', () => tgGet('getMe'))
  if (bot) {
    console.log(`     → Bot: @${bot.username}  (ID: ${bot.id})`)
  }

  // 2. Set Chat Menu Button (WebApp launcher)
  await step('Setting Chat Menu Button (web_app type)', () =>
    tgPost('setChatMenuButton', {
      menu_button: {
        type: 'web_app',
        text: '🛍️ Open Locally',
        web_app: { url: WEBAPP_URL },
      },
    })
  )

  // 3. Register bot commands
  await step('Registering /start, /help, /orders commands', () =>
    tgPost('setMyCommands', {
      commands: [
        { command: 'start', description: '🛍️ Open Locally Marketplace' },
        { command: 'help',  description: '❓ How to use Locally' },
        { command: 'orders', description: '📦 My recent orders' },
      ],
      scope: { type: 'all_private_chats' },
    })
  )

  // 4. Set bot description (shown in profile)
  await step('Setting bot description', () =>
    tgPost('setMyDescription', {
      description:
        '🥐 Locally is your neighbourhood artisan marketplace inside Telegram.\n\n' +
        'Discover freshly baked sourdough, golden samsa, raw honey, handmade crafts — ' +
        'all delivered by local couriers straight to your door in Tashkent.',
    })
  )

  // 5. Set short description (shown in empty chats)
  await step('Setting bot short description', () =>
    tgPost('setMyShortDescription', {
      short_description: '🛍️ Your neighbourhood artisan marketplace.',
    })
  )

  // 6. Check current webhook status
  const wh = await step('Checking webhook status', () => tgGet('getWebhookInfo'))
  if (wh) {
    if (wh.url) {
      console.log(`     → Active webhook: ${wh.url}`)
      if (wh.last_error_message) {
        console.warn(`     ⚠️  Last error: ${wh.last_error_message}`)
      }
    } else {
      console.log('     → No webhook set (polling mode)')
    }
  }

  // 7. Send a test /start welcome to the admin chat (if VITE_TELEGRAM_ADMIN_CHAT_ID is set)
  const adminChatId = env.VITE_TELEGRAM_ADMIN_CHAT_ID || process.env.VITE_TELEGRAM_ADMIN_CHAT_ID
  if (adminChatId) {
    await step(`Sending setup confirmation to admin chat (${adminChatId})`, () =>
      tgPost('sendMessage', {
        chat_id: adminChatId,
        text:
          `🤖 <b>Bot Setup Complete!</b>\n\n` +
          `✅ Chat menu button → <code>${WEBAPP_URL}</code>\n` +
          `✅ Commands: /start, /help, /orders\n` +
          `✅ Description updated\n\n` +
          `<i>Users can now tap "🛍️ Open Locally" to launch the Mini App directly.</i>`,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🛍️ Open Locally Marketplace', web_app: { url: WEBAPP_URL } }],
          ],
        },
      })
    )
  }

  console.log('\n' + '─'.repeat(56))
  console.log('🎉  Setup complete!\n')
  console.log('   Next steps:')
  console.log('   1. Open Telegram → @locally_marketplace_bot')
  console.log('   2. Send /start  →  welcome message with WebApp button')
  console.log('   3. Tap the menu button (📎) → Mini App opens directly')
  if (!adminChatId) {
    console.log('\n   💡 Tip: Set VITE_TELEGRAM_ADMIN_CHAT_ID in .env')
    console.log('      to receive setup confirmations and order alerts.')
  }
  console.log()

  // ─── Polling demo: respond to /start for 60 seconds ─────────────────────
  console.log('─'.repeat(56))
  console.log('🔄  Starting 60-second /start command listener...')
  console.log('   (Send /start to @locally_marketplace_bot now to test)\n')

  let offset = 0
  const deadline = Date.now() + 60_000

  while (Date.now() < deadline) {
    let updates
    try {
      const res = await fetch(
        `${API_BASE}/getUpdates?offset=${offset}&timeout=5&allowed_updates=["message","callback_query"]`
      )
      const data = await res.json()
      updates = data.ok ? data.result : []
    } catch {
      updates = []
    }

    for (const update of updates) {
      offset = update.update_id + 1

      // Handle /start
      const msg = update.message
      if (msg?.text?.startsWith('/start')) {
        const chatId = msg.chat.id
        const firstName = msg.from?.first_name ?? 'there'
        console.log(`  📩 /start received from ${firstName} (${chatId})`)

        try {
          await tgPost('sendMessage', {
            chat_id: chatId,
            text:
              `👋 <b>Salaam, ${firstName.replace(/[<>&]/g, c => c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&amp;')}!</b>\n\n` +
              `Welcome to <b>Locally Marketplace</b> 🥐🍯🧵 — your neighbourhood hub for authentic, artisan-crafted goods.\n\n` +
              `<b>What you'll find:</b>\n` +
              `• 🍞 Fresh sourdough &amp; pastries baked daily\n` +
              `• 🥟 Golden samsa &amp; home-style meals\n` +
              `• 🍯 Pure raw honey &amp; organic preserves\n` +
              `• 🧵 Handmade crafts &amp; local artisan goods\n\n` +
              `Tap the button below to browse the marketplace ↓`,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [{ text: '🛍️ Open Locally Marketplace', web_app: { url: WEBAPP_URL } }],
                [
                  { text: '📦 My Orders', callback_data: 'view_orders' },
                  { text: '❓ Help',      callback_data: 'help' },
                ],
              ],
            },
          })
          console.log(`  ✅ Welcome message sent to ${chatId}`)
        } catch (err) {
          console.error(`  ❌ Failed to send welcome: ${err.message}`)
        }
      }

      // Handle /help
      if (msg?.text?.startsWith('/help')) {
        const chatId = msg.chat.id
        try {
          await tgPost('sendMessage', {
            chat_id: chatId,
            text:
              `❓ <b>How to use Locally Marketplace</b>\n\n` +
              `1️⃣ Tap <b>"🛍️ Open Locally"</b> in the menu button or use /start\n` +
              `2️⃣ Browse artisan categories — Breads, Meals, Honey, Crafts\n` +
              `3️⃣ Add items to your basket and choose a delivery slot\n` +
              `4️⃣ Confirm checkout — track your order live inside Telegram!\n\n` +
              `📍 Currently serving <b>Tashkent</b> neighbourhood deliveries.`,
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: [
                [{ text: '🛍️ Open Marketplace', web_app: { url: WEBAPP_URL } }],
              ],
            },
          })
        } catch {/* ignore */}
      }

      // Answer callback queries silently
      if (update.callback_query) {
        try {
          await tgPost('answerCallbackQuery', {
            callback_query_id: update.callback_query.id,
            text: update.callback_query.data === 'view_orders'
              ? '📦 Order history coming soon!'
              : '❓ Send /help for usage guide',
            show_alert: false,
          })
        } catch {/* ignore */}
      }
    }

    // Small yield to prevent tight loop
    await new Promise((r) => setTimeout(r, 500))
  }

  console.log('\n⏹️  Polling stopped (60s elapsed).')
  console.log('   For persistent bot responses, set up a webhook or')
  console.log('   a Cloudflare Worker / server with the botSetup.ts service.\n')
}

main().catch((err) => {
  console.error('\n💥 Setup failed:', err.message)
  process.exit(1)
})
