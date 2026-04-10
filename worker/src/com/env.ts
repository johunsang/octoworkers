import type { AppBindings } from './bindings'

export function cloudflareAccountId(env: AppBindings) {
  return env.CLOUDFLARE_ACCOUNT_ID ?? env.AI_GATEWAY_ACCOUNT_ID
}

export function imagesConfigured(env: AppBindings) {
  return Boolean(cloudflareAccountId(env) && env.CLOUDFLARE_IMAGES_API_TOKEN)
}

export function aiGatewayConfigured(env: AppBindings) {
  return Boolean((env.AI_GATEWAY_ACCOUNT_ID ?? env.CLOUDFLARE_ACCOUNT_ID) && env.AI_PROVIDER && env.AI_MODEL && env.AI_PROVIDER_API_KEY)
}

export function normalizeHost(hostname: string) {
  return hostname.toLowerCase().replace(/\.$/, '')
}
