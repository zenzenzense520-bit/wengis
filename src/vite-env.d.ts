/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 天地图开发者 key（.env.local 中配置，不提交到 git） */
  readonly VITE_TIANDITU_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
