/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_LOCAL_STORAGE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
