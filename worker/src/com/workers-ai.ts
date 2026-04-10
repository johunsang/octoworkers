import type { AppBindings } from './bindings'

type EmbeddingResponse = {
  data?: number[][]
}

type TextResponse = {
  response?: string
  result?: {
    response?: string
  }
}

export function workersAiConfigured(env: AppBindings) {
  return Boolean(env.AI && env.AI_TEXT_MODEL && env.AI_EMBED_MODEL)
}

export async function createEmbedding(env: AppBindings, text: string) {
  if (!env.AI || !env.AI_EMBED_MODEL) {
    throw new Error('Workers AI embedding binding is not configured')
  }

  const response = (await env.AI.run(env.AI_EMBED_MODEL, {
    text: [text],
  })) as EmbeddingResponse

  const vector = response.data?.[0]

  if (!vector) {
    throw new Error('Workers AI embedding returned no vector')
  }

  return vector
}

export async function generateTextWithWorkersAi(env: AppBindings, messages: Array<{ role: string; content: string }>) {
  if (!env.AI || !env.AI_TEXT_MODEL) {
    throw new Error('Workers AI text binding is not configured')
  }

  const response = (await env.AI.run(env.AI_TEXT_MODEL, {
    messages,
  })) as TextResponse

  return response.response ?? response.result?.response ?? ''
}
