/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_CONFIG_FILE_ORIGIN: string;
    readonly VITE_PROXY_TARGET: string;
    readonly VITE_AUTHORIZATION_TYPE: string;
    // 更多环境变量...
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
