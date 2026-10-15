/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_PASSPHRASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
