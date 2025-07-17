export interface Env {
  ENVIRONMENT: string;
  USE_OPENAI?: string;
  OPENAI_API_KEY?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
  AI_GATEWAY_ID?: string;
  KV?: KVNamespace;
}

declare module 'hono' {
  interface HonoRequest {
    env: Env;
  }
}