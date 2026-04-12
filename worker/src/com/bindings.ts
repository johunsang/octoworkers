export interface D1PreparedStatementLike {
  bind(...values: unknown[]): D1PreparedStatementLike
  first<T>(): Promise<T | null>
  all<T>(): Promise<{ results: T[] }>
  run(): Promise<unknown>
}

export interface D1DatabaseLike {
  prepare(query: string): D1PreparedStatementLike
}

export interface AssetFetcherLike {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>
}

export interface KVNamespaceLike {
  get(key: string): Promise<string | null>
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>
  delete(key: string): Promise<void>
  list(options?: { prefix?: string; limit?: number }): Promise<{ keys: Array<{ name: string }> }>
}

export interface R2ObjectBodyLike {
  text(): Promise<string>
}

export interface R2BucketLike {
  get(key: string): Promise<R2ObjectBodyLike | null>
  put(key: string, value: string | ArrayBuffer | ArrayBufferView): Promise<void>
  delete(key: string): Promise<void>
}

export interface AiBindingLike {
  run(model: string, input: unknown): Promise<unknown>
}

export interface VectorizeMatchLike {
  id: string
  score: number
  metadata?: Record<string, unknown>
  values?: number[]
}

export interface VectorizeIndexLike {
  upsert(vectors: Array<{ id: string; values: number[]; metadata?: Record<string, unknown>; namespace?: string }>): Promise<unknown>
  query(
    vector: number[] | Float32Array | Float64Array,
    options?: {
      topK?: number
      returnValues?: boolean
      returnMetadata?: 'none' | 'indexed' | 'all'
      namespace?: string
      filter?: Record<string, unknown>
    },
  ): Promise<{ count: number; matches: VectorizeMatchLike[] }>
}

export interface DurableObjectNamespaceLike<T = unknown> {
  idFromName(name: string): unknown
  get(id: unknown): T
}

export type AppBindings = {
  DB: D1DatabaseLike
  ASSETS: AssetFetcherLike
  AI?: AiBindingLike
  DOC_INDEX?: VectorizeIndexLike
  OpsAgent?: DurableObjectNamespaceLike
  APP_KV: KVNamespaceLike
  MEDIA_R2?: R2BucketLike
  ENV_NAME?: string
  APP_DOMAIN: string
  ADMIN_DOMAIN: string
  SAAS_DOMAIN?: string
  ADMIN_ACCESS_MODE?: string
  ADMIN_ALLOWED_EMAILS?: string
  ADMIN_LOGIN_EMAIL?: string
  ADMIN_LOGIN_PASSWORD?: string
  ADMIN_JWT_SECRET?: string
  CLOUDFLARE_ACCOUNT_ID?: string
  CLOUDFLARE_IMAGES_API_TOKEN?: string
  CLOUDFLARE_IMAGES_DELIVERY_HASH?: string
  AI_GATEWAY_ACCOUNT_ID?: string
  AI_GATEWAY_ID?: string
  AI_PROVIDER?: string
  AI_MODEL?: string
  AI_TEXT_MODEL?: string
  AI_EMBED_MODEL?: string
  AI_PROVIDER_API_KEY?: string
  RESEND_API_KEY?: string
  RESEND_FROM_ADDRESS?: string
  GITHUB_CLIENT_ID?: string
  GITHUB_CLIENT_SECRET?: string
  GITHUB_ALLOWED_USERS?: string
}
