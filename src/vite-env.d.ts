/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TELEGRAM_BOT_TOKEN: string
  readonly VITE_TELEGRAM_ADMIN_CHAT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
