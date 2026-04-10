import type { AiCopySuggestion, AiCopySuggestionRequest, SiteSettings } from '@octoworkers/com'
import type { AppBindings } from './bindings'
import { aiGatewayConfigured } from './env'

type ChatCompletionPayload = {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
  error?: {
    message?: string
  }
}

export async function generateCopySuggestion(
  env: AppBindings,
  settings: SiteSettings,
  request: AiCopySuggestionRequest,
) {
  if (!aiGatewayConfigured(env)) {
    throw new Error('AI Gateway is not configured')
  }

  const accountId = env.AI_GATEWAY_ACCOUNT_ID ?? env.CLOUDFLARE_ACCOUNT_ID
  const gatewayId = env.AI_GATEWAY_ID ?? 'default'
  const model = `${env.AI_PROVIDER}/${env.AI_MODEL}`

  const response = await fetch(`https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/compat/chat/completions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${env.AI_PROVIDER_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.8,
      messages: [
        {
          role: 'system',
          content:
            'You write conversion-focused SaaS landing copy. Return strict JSON with heroTitle, heroSubtitle, ctaPrimary, rationale.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            current: settings,
            objective: request.objective,
            audience: request.audience,
            tone: request.tone,
          }),
        },
      ],
      response_format: {
        type: 'json_object',
      },
    }),
  })

  const payload = (await response.json()) as ChatCompletionPayload

  if (!response.ok) {
    throw new Error(payload.error?.message ?? 'AI Gateway request failed')
  }

  const content = payload.choices?.[0]?.message?.content

  if (!content) {
    throw new Error('AI Gateway returned no content')
  }

  return JSON.parse(content) as AiCopySuggestion
}
