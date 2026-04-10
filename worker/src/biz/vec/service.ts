import type { AppBindings } from '../../com/bindings'
import { createEmbedding } from '../../com/workers-ai'
import { listLeads } from '../led/repository'
import { listMedia } from '../med/repository'
import { getSiteSettings } from '../set/repository'

type VectorDocument = {
  id: string
  text: string
  metadata: Record<string, unknown>
}

function buildDocuments(
  settings: Awaited<ReturnType<typeof getSiteSettings>>,
  leads: Awaited<ReturnType<typeof listLeads>>,
  media: Awaited<ReturnType<typeof listMedia>>,
) {
  const docs: VectorDocument[] = [
    {
      id: 'settings:1',
      text: [settings.brand, settings.heroLabel, settings.heroTitle, settings.heroSubtitle, settings.ctaPrimary, settings.ctaSecondary].join('\n'),
      metadata: {
        type: 'settings',
        title: settings.heroTitle,
        updatedAt: settings.updatedAt,
      },
    },
  ]

  for (const lead of leads) {
    docs.push({
      id: `lead:${lead.id}`,
      text: [lead.name, lead.email, lead.company ?? '', lead.message ?? ''].join('\n'),
      metadata: {
        type: 'lead',
        title: lead.name,
        email: lead.email,
        company: lead.company ?? '',
        createdAt: lead.createdAt,
      },
    })
  }

  for (const asset of media) {
    docs.push({
      id: `media:${asset.imageId}`,
      text: [asset.title, asset.alt ?? '', asset.imageId].join('\n'),
      metadata: {
        type: 'media',
        title: asset.title,
        imageId: asset.imageId,
        status: asset.status,
      },
    })
  }

  return docs
}

export async function reindexDocuments(env: AppBindings) {
  if (!env.DOC_INDEX) {
    throw new Error('Vectorize binding is not configured')
  }

  const [settings, leads, media] = await Promise.all([
    getSiteSettings(env.DB),
    listLeads(env.DB, 50),
    listMedia(env.DB, 50),
  ])

  const docs = buildDocuments(settings, leads, media)
  const vectors = await Promise.all(
    docs.map(async (doc) => ({
      id: doc.id,
      values: await createEmbedding(env, doc.text),
      metadata: {
        ...doc.metadata,
        snippet: doc.text.slice(0, 220),
      },
      namespace: 'app',
    })),
  )

  await env.DOC_INDEX.upsert(vectors)

  return {
    count: vectors.length,
    ids: vectors.map((vector) => vector.id),
  }
}

export async function semanticSearch(env: AppBindings, query: string) {
  if (!env.DOC_INDEX) {
    throw new Error('Vectorize binding is not configured')
  }

  const queryVector = await createEmbedding(env, query)
  return env.DOC_INDEX.query(queryVector, {
    topK: 8,
    namespace: 'app',
    returnMetadata: 'all',
  })
}
