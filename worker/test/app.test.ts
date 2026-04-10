import { describe, expect, it, vi } from 'vitest'
vi.mock('agents', () => ({
  Agent: class {},
  callable: () => (target: unknown) => target,
  getAgentByName: vi.fn(),
}))
vi.mock('hono-agents', () => ({
  agentsMiddleware: () => async (_c: unknown, next: () => Promise<void>) => next(),
}))
vi.mock('../src/biz/agt/ops-agent', () => ({
  OpsAgent: class {},
}))
import { createApp } from '../src/index'
import { exampleCopyRequest } from '../src/biz/ext/ai/exampleCopyRequest'

// In-memory store for test data
const testLeads: Record<number, { id: number; name: string; email: string; company: string | null; message: string | null; status: string; assigned_to: string | null; source: string | null; created_at: string }> = {}
const testLeadTags: Array<{ id: number; lead_id: number; tag: string; created_at: string }> = []
const testLeadNotes: Array<{ id: number; lead_id: number; content: string; created_by: string; created_at: string }> = []
const testEmailTemplates: Array<{ id: number; name: string; subject: string; body_html: string; body_text: string; created_at: string; updated_at: string }> = []
const testEmailLogs: Array<{ id: number; lead_id: number; template_id: number | null; subject: string; status: string; sent_at: string }> = []
const testPages: Array<{ id: number; slug: string; title: string; content_md: string; content_html: string; status: string; published_at: string | null; created_at: string; updated_at: string }> = []
let autoId = 1

function resetTestData() {
  for (const key of Object.keys(testLeads)) delete testLeads[Number(key)]
  testLeadTags.length = 0
  testLeadNotes.length = 0
  testEmailTemplates.length = 0
  testEmailLogs.length = 0
  testPages.length = 0
  autoId = 1
}

function createSettingsDb() {
  return {
    prepare(query: string) {
      return {
        _boundValues: [] as unknown[],
        bind(...values: unknown[]) {
          this._boundValues = values
          return this
        },
        async first<T>() {
          if (query.includes('FROM site_settings')) {
            return {
              id: 1,
              brand: '옥토워커스',
              hero_label: 'Cloudflare-native SaaS boilerplate',
              hero_title: 'Ship SaaS faster on Cloudflare.',
              hero_subtitle: 'Landing, admin, D1, Images, and AI Gateway in one runtime.',
              cta_primary: 'Open admin workspace',
              cta_secondary: 'Collect first lead',
              updated_at: new Date().toISOString(),
            } as T
          }

          if (query.includes('FROM leads WHERE id')) {
            const id = this._boundValues[0] as number
            const lead = testLeads[id]
            return (lead ?? null) as T
          }

          if (query.includes('SELECT email, name FROM leads WHERE id')) {
            const id = this._boundValues[0] as number
            const lead = testLeads[id]
            return lead ? ({ email: lead.email, name: lead.name } as T) : null
          }

          if (query.includes('COUNT(*)')) {
            return { count: Object.keys(testLeads).length } as T
          }

          if (query.includes('FROM pages WHERE slug')) {
            const slug = this._boundValues[0] as string
            const page = testPages.find((p) => p.slug === slug)
            return (page ?? null) as T
          }

          if (query.includes('FROM pages WHERE id')) {
            const id = this._boundValues[0] as number
            const page = testPages.find((p) => p.id === id)
            return (page ?? null) as T
          }

          if (query.includes('FROM email_templates WHERE id')) {
            const id = this._boundValues[0] as number
            const tpl = testEmailTemplates.find((t) => t.id === id)
            return (tpl ?? null) as T
          }

          return null
        },
        async all<T>() {
          if (query.includes('FROM leads') && !query.includes('WHERE')) {
            return { results: Object.values(testLeads) as T[] }
          }
          if (query.includes('FROM lead_tags WHERE lead_id')) {
            const leadId = this._boundValues[0] as number
            return { results: testLeadTags.filter((t) => t.lead_id === leadId) as T[] }
          }
          if (query.includes('FROM lead_notes WHERE lead_id')) {
            const leadId = this._boundValues[0] as number
            return { results: testLeadNotes.filter((n) => n.lead_id === leadId) as T[] }
          }
          if (query.includes('FROM email_templates')) {
            return { results: testEmailTemplates as T[] }
          }
          if (query.includes('FROM email_logs')) {
            return { results: testEmailLogs as T[] }
          }
          if (query.includes('FROM pages')) {
            if (query.includes("status = 'published'")) {
              return { results: testPages.filter((p) => p.status === 'published') as T[] }
            }
            return { results: testPages as T[] }
          }
          return { results: [] as T[] }
        },
        async run() {
          if (query.includes('INSERT INTO leads')) {
            const id = autoId++
            testLeads[id] = {
              id,
              name: this._boundValues[0] as string,
              email: this._boundValues[1] as string,
              company: (this._boundValues[2] as string) ?? null,
              message: (this._boundValues[3] as string) ?? null,
              status: 'new',
              assigned_to: null,
              source: 'website',
              created_at: this._boundValues[4] as string,
            }
          }
          if (query.includes('UPDATE leads SET status')) {
            const status = this._boundValues[0] as string
            const id = this._boundValues[1] as number
            if (testLeads[id]) testLeads[id].status = status
          }
          if (query.includes('INSERT') && query.includes('lead_tags')) {
            testLeadTags.push({
              id: autoId++,
              lead_id: this._boundValues[0] as number,
              tag: this._boundValues[1] as string,
              created_at: this._boundValues[2] as string,
            })
          }
          if (query.includes('DELETE') && query.includes('lead_tags')) {
            const leadId = this._boundValues[0] as number
            const tag = this._boundValues[1] as string
            const idx = testLeadTags.findIndex((t) => t.lead_id === leadId && t.tag === tag)
            if (idx !== -1) testLeadTags.splice(idx, 1)
          }
          if (query.includes('INSERT INTO lead_notes')) {
            testLeadNotes.push({
              id: autoId++,
              lead_id: this._boundValues[0] as number,
              content: this._boundValues[1] as string,
              created_by: this._boundValues[2] as string,
              created_at: this._boundValues[3] as string,
            })
          }
          if (query.includes('INSERT INTO email_templates')) {
            testEmailTemplates.push({
              id: autoId++,
              name: this._boundValues[0] as string,
              subject: this._boundValues[1] as string,
              body_html: this._boundValues[2] as string,
              body_text: this._boundValues[3] as string,
              created_at: this._boundValues[4] as string,
              updated_at: this._boundValues[5] as string,
            })
          }
          if (query.includes('DELETE FROM email_templates')) {
            const id = this._boundValues[0] as number
            const idx = testEmailTemplates.findIndex((t) => t.id === id)
            if (idx !== -1) testEmailTemplates.splice(idx, 1)
          }
          if (query.includes('INSERT INTO email_logs')) {
            testEmailLogs.push({
              id: autoId++,
              lead_id: this._boundValues[0] as number,
              template_id: this._boundValues[1] as number | null,
              subject: this._boundValues[2] as string,
              status: this._boundValues[3] as string,
              sent_at: this._boundValues[4] as string,
            })
          }
          if (query.includes('INSERT INTO pages')) {
            testPages.push({
              id: autoId++,
              slug: this._boundValues[0] as string,
              title: this._boundValues[1] as string,
              content_md: this._boundValues[2] as string,
              content_html: this._boundValues[3] as string,
              status: this._boundValues[4] as string,
              published_at: null,
              created_at: this._boundValues[5] as string,
              updated_at: this._boundValues[6] as string,
            })
          }
          if (query.includes('UPDATE pages SET slug')) {
            const id = this._boundValues[5] as number
            const page = testPages.find((p) => p.id === id)
            if (page) {
              page.slug = this._boundValues[0] as string
              page.title = this._boundValues[1] as string
              page.content_md = this._boundValues[2] as string
              page.content_html = this._boundValues[3] as string
              page.updated_at = this._boundValues[4] as string
            }
          }
          if (query.includes("SET status = 'published'")) {
            const id = this._boundValues[2] as number
            const page = testPages.find((p) => p.id === id)
            if (page) {
              page.status = 'published'
              page.published_at = this._boundValues[0] as string
            }
          }
          if (query.includes("SET status = 'draft'")) {
            const id = this._boundValues[1] as number
            const page = testPages.find((p) => p.id === id)
            if (page) page.status = 'draft'
          }
          if (query.includes('DELETE FROM pages')) {
            const id = this._boundValues[0] as number
            const idx = testPages.findIndex((p) => p.id === id)
            if (idx !== -1) testPages.splice(idx, 1)
          }
          return {}
        },
      }
    },
  }
}

function createTestEnv() {
  return {
    DB: createSettingsDb(),
    ASSETS: {
      fetch,
    },
    APP_KV: {
      async get() {
        return null
      },
      async put() {},
      async delete() {},
      async list() {
        return { keys: [] }
      },
    },
    APP_DOMAIN: 'example.com',
    ADMIN_DOMAIN: 'admin.example.com',
    ADMIN_ACCESS_MODE: 'off',
  }
}

function createAiVectorEnv() {
  return {
    ...createTestEnv(),
    AI: {
      async run(model: string) {
        if (model.includes('bge')) {
          return {
            data: [[0.11, 0.22, 0.33]],
          }
        }

        return {
          response: 'Launch experiments: founder waitlist, partner webinar, migration teardown.',
        }
      },
    },
    AI_TEXT_MODEL: '@cf/meta/llama-3.1-8b-instruct-fast',
    AI_EMBED_MODEL: '@cf/baai/bge-small-en-v1.5',
    DOC_INDEX: {
      async upsert() {
        return { ok: true }
      },
      async query() {
        return {
          count: 1,
          matches: [
            {
              id: 'settings:1',
              score: 0.991,
              metadata: {
                title: 'Ship SaaS faster on Cloudflare.',
                type: 'settings',
              },
            },
          ],
        }
      },
    },
  }
}

import { beforeEach } from 'vitest'

beforeEach(() => {
  resetTestData()
})

describe('worker health route', () => {
  it('responds successfully', async () => {
    const app = createApp()
    const response = await app.request('http://localhost/api/health', undefined, createTestEnv())

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      ok: true,
      runtime: 'cloudflare-workers',
    })
  })

  it('calls AI Gateway through the admin route', async () => {
    const originalFetch = globalThis.fetch
    const app = createApp()

    globalThis.fetch = (async () =>
      new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  heroTitle: 'Launch your SaaS stack on Cloudflare in one sprint.',
                  heroSubtitle: 'Use a single edge runtime for landing, admin, data, media, and AI.',
                  ctaPrimary: 'Start from the boilerplate',
                  rationale: 'Highlights speed, simplicity, and operational leverage.',
                }),
              },
            },
          ],
        }),
        { status: 200 },
      )) as typeof fetch

    try {
      const response = await app.request(
        'http://localhost/api/admin/ai/copy',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(exampleCopyRequest),
        },
        {
          ...createTestEnv(),
          AI_GATEWAY_ACCOUNT_ID: 'acc',
          AI_PROVIDER: 'workers-ai',
          AI_MODEL: '@cf/meta/llama-3.1-8b-instruct',
          AI_PROVIDER_API_KEY: 'token',
        },
      )

      expect(response.status).toBe(200)
      await expect(response.json()).resolves.toMatchObject({
        heroTitle: 'Launch your SaaS stack on Cloudflare in one sprint.',
      })
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('reports Workers AI and Vectorize bindings', async () => {
    const app = createApp()
    const response = await app.request('http://localhost/api/admin/ext/ai/workers', undefined, createAiVectorEnv())

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      configured: true,
      textModel: '@cf/meta/llama-3.1-8b-instruct-fast',
      embedModel: '@cf/baai/bge-small-en-v1.5',
      vectorizeBound: true,
    })
  })

  it('performs semantic search with Vectorize', async () => {
    const app = createApp()
    const response = await app.request(
      'http://localhost/api/admin/vec/search',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          query: 'hero copy for founders',
        }),
      },
      createAiVectorEnv(),
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({
      count: 1,
      matches: [
        {
          id: 'settings:1',
        },
      ],
    })
  })
})

// --- Phase 1: Lead CRM ---

describe('lead CRM routes', () => {
  async function seedLead(app: ReturnType<typeof createApp>, env: ReturnType<typeof createTestEnv>) {
    await app.request(
      'http://localhost/api/public/leads',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: 'John', email: 'john@test.com', company: 'Acme' }),
      },
      env,
    )
  }

  it('should list leads', async () => {
    const app = createApp()
    const env = createTestEnv()
    await seedLead(app, env)

    const res = await app.request('http://localhost/api/admin/leads', undefined, env)
    expect(res.status).toBe(200)
    const leads = await res.json()
    expect(leads).toHaveLength(1)
    expect(leads[0].name).toBe('John')
  })

  it('should get lead detail with tags and notes', async () => {
    const app = createApp()
    const env = createTestEnv()
    await seedLead(app, env)

    const res = await app.request('http://localhost/api/admin/leads/1', undefined, env)
    expect(res.status).toBe(200)
    const lead = await res.json()
    expect(lead.name).toBe('John')
    expect(lead.tags).toEqual([])
    expect(lead.notes).toEqual([])
  })

  it('should return 404 for non-existent lead', async () => {
    const app = createApp()
    const res = await app.request('http://localhost/api/admin/leads/999', undefined, createTestEnv())
    expect(res.status).toBe(404)
  })

  it('should update lead status', async () => {
    const app = createApp()
    const env = createTestEnv()
    await seedLead(app, env)

    const res = await app.request(
      'http://localhost/api/admin/leads/1/status',
      {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: 'contacted' }),
      },
      env,
    )
    expect(res.status).toBe(200)
    expect(testLeads[1].status).toBe('contacted')
  })

  it('should reject invalid status', async () => {
    const app = createApp()
    const env = createTestEnv()
    await seedLead(app, env)

    const res = await app.request(
      'http://localhost/api/admin/leads/1/status',
      {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: 'invalid' }),
      },
      env,
    )
    expect(res.status).toBe(400)
  })

  it('should add and remove tags', async () => {
    const app = createApp()
    const env = createTestEnv()
    await seedLead(app, env)

    const addRes = await app.request(
      'http://localhost/api/admin/leads/1/tags',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tag: 'hot-lead' }),
      },
      env,
    )
    expect(addRes.status).toBe(201)
    expect(testLeadTags).toHaveLength(1)

    const delRes = await app.request('http://localhost/api/admin/leads/1/tags/hot-lead', { method: 'DELETE' }, env)
    expect(delRes.status).toBe(200)
    expect(testLeadTags).toHaveLength(0)
  })

  it('should add notes', async () => {
    const app = createApp()
    const env = createTestEnv()
    await seedLead(app, env)

    const res = await app.request(
      'http://localhost/api/admin/leads/1/notes',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ content: 'Called and left voicemail', createdBy: 'admin' }),
      },
      env,
    )
    expect(res.status).toBe(201)
    expect(testLeadNotes).toHaveLength(1)
    expect(testLeadNotes[0].content).toBe('Called and left voicemail')
  })

  it('should reject invalid lead ID', async () => {
    const app = createApp()
    const env = createTestEnv()
    const res = await app.request('http://localhost/api/admin/leads/abc', undefined, env)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain('Invalid')
  })

  it('should reject tags on non-existent lead', async () => {
    const app = createApp()
    const env = createTestEnv()
    const res = await app.request(
      'http://localhost/api/admin/leads/999/tags',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tag: 'orphan' }),
      },
      env,
    )
    expect(res.status).toBe(404)
  })

  it('should list notes for a lead', async () => {
    const app = createApp()
    const env = createTestEnv()
    await seedLead(app, env)

    await app.request(
      'http://localhost/api/admin/leads/1/notes',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ content: 'First call', createdBy: 'admin' }),
      },
      env,
    )

    const res = await app.request('http://localhost/api/admin/leads/1/notes', undefined, env)
    expect(res.status).toBe(200)
    const notes = await res.json()
    expect(notes).toHaveLength(1)
  })
})

// --- Phase 2: Email ---

describe('email routes', () => {
  it('should create and list templates', async () => {
    const app = createApp()
    const env = createTestEnv()

    const createRes = await app.request(
      'http://localhost/api/admin/email/templates',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: 'Welcome', subject: 'Welcome aboard!', bodyHtml: '<h1>Hi</h1>', bodyText: 'Hi' }),
      },
      env,
    )
    expect(createRes.status).toBe(201)

    const listRes = await app.request('http://localhost/api/admin/email/templates', undefined, env)
    expect(listRes.status).toBe(200)
    const templates = await listRes.json()
    expect(templates).toHaveLength(1)
    expect(templates[0].name).toBe('Welcome')
  })

  it('should delete template', async () => {
    const app = createApp()
    const env = createTestEnv()

    await app.request(
      'http://localhost/api/admin/email/templates',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: 'Old', subject: 'old', bodyHtml: '', bodyText: '' }),
      },
      env,
    )

    const delRes = await app.request(`http://localhost/api/admin/email/templates/${testEmailTemplates[0].id}`, { method: 'DELETE' }, env)
    expect(delRes.status).toBe(200)
    expect(testEmailTemplates).toHaveLength(0)
  })

  it('should fail send without RESEND_API_KEY', async () => {
    const app = createApp()
    const env = createTestEnv()

    // Seed a lead
    testLeads[1] = { id: 1, name: 'Jane', email: 'jane@test.com', company: null, message: null, status: 'new', assigned_to: null, source: 'website', created_at: new Date().toISOString() }

    const res = await app.request(
      'http://localhost/api/admin/email/send',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ leadId: 1, subject: 'Hello', bodyHtml: '<p>Hi</p>' }),
      },
      env,
    )
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toContain('RESEND_API_KEY')
  })

  it('should send email successfully and create log', async () => {
    const app = createApp()
    const env = {
      ...createTestEnv(),
      RESEND_API_KEY: 'test-api-key',
      RESEND_FROM_ADDRESS: 'test@example.com',
    }

    testLeads[1] = { id: 1, name: 'Jane', email: 'jane@test.com', company: null, message: null, status: 'new', assigned_to: null, source: 'website', created_at: new Date().toISOString() }

    const originalFetch = globalThis.fetch
    globalThis.fetch = (async (url: string) => {
      if (url === 'https://api.resend.com/emails') {
        return new Response(JSON.stringify({ id: 'email-123' }), { status: 200 })
      }
      return originalFetch(url)
    }) as typeof fetch

    try {
      const res = await app.request(
        'http://localhost/api/admin/email/send',
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ leadId: 1, subject: 'Welcome!', bodyHtml: '<p>Hello Jane</p>' }),
        },
        env,
      )
      expect(res.status).toBe(200)
      expect(testEmailLogs).toHaveLength(1)
      expect(testEmailLogs[0].status).toBe('sent')
      expect(testEmailLogs[0].subject).toBe('Welcome!')
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('should log failure when Resend API returns error', async () => {
    const app = createApp()
    const env = {
      ...createTestEnv(),
      RESEND_API_KEY: 'test-api-key',
    }

    testLeads[1] = { id: 1, name: 'Jane', email: 'jane@test.com', company: null, message: null, status: 'new', assigned_to: null, source: 'website', created_at: new Date().toISOString() }

    const originalFetch = globalThis.fetch
    globalThis.fetch = (async (url: string) => {
      if (url === 'https://api.resend.com/emails') {
        return new Response('Unauthorized', { status: 401 })
      }
      return originalFetch(url)
    }) as typeof fetch

    try {
      const res = await app.request(
        'http://localhost/api/admin/email/send',
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ leadId: 1, subject: 'Test', bodyHtml: '<p>test</p>' }),
        },
        env,
      )
      expect(res.status).toBe(500)
      expect(testEmailLogs).toHaveLength(1)
      expect(testEmailLogs[0].status).toBe('failed')
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('should list email logs', async () => {
    const app = createApp()
    const env = createTestEnv()
    const res = await app.request('http://localhost/api/admin/email/logs', undefined, env)
    expect(res.status).toBe(200)
    const logs = await res.json()
    expect(logs).toEqual([])
  })

  it('should reject invalid template ID', async () => {
    const app = createApp()
    const res = await app.request('http://localhost/api/admin/email/templates/abc', undefined, createTestEnv())
    expect(res.status).toBe(400)
  })
})

// --- Phase 3: CMS Pages ---

describe('page CMS routes', () => {
  it('should create and list pages', async () => {
    const app = createApp()
    const env = createTestEnv()

    const createRes = await app.request(
      'http://localhost/api/admin/pages',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug: 'about-us', title: 'About Us', contentMd: '# About\n\nWe are great.' }),
      },
      env,
    )
    expect(createRes.status).toBe(201)

    const listRes = await app.request('http://localhost/api/admin/pages', undefined, env)
    expect(listRes.status).toBe(200)
    const pages = await listRes.json()
    expect(pages).toHaveLength(1)
    expect(pages[0].slug).toBe('about-us')
  })

  it('should get page by id', async () => {
    const app = createApp()
    const env = createTestEnv()

    await app.request(
      'http://localhost/api/admin/pages',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug: 'test-page', title: 'Test', contentMd: 'Hello **world**' }),
      },
      env,
    )

    const res = await app.request(`http://localhost/api/admin/pages/${testPages[0].id}`, undefined, env)
    expect(res.status).toBe(200)
    const page = await res.json()
    expect(page.title).toBe('Test')
    expect(page.contentHtml).toContain('<strong>world</strong>')
  })

  it('should publish and unpublish page', async () => {
    const app = createApp()
    const env = createTestEnv()

    await app.request(
      'http://localhost/api/admin/pages',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug: 'news', title: 'News', contentMd: 'Breaking news' }),
      },
      env,
    )

    const publishRes = await app.request(`http://localhost/api/admin/pages/${testPages[0].id}/publish`, { method: 'POST' }, env)
    expect(publishRes.status).toBe(200)
    expect(testPages[0].status).toBe('published')

    const unpublishRes = await app.request(`http://localhost/api/admin/pages/${testPages[0].id}/unpublish`, { method: 'POST' }, env)
    expect(unpublishRes.status).toBe(200)
    expect(testPages[0].status).toBe('draft')
  })

  it('should delete page', async () => {
    const app = createApp()
    const env = createTestEnv()

    await app.request(
      'http://localhost/api/admin/pages',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug: 'temp', title: 'Temp', contentMd: 'temp' }),
      },
      env,
    )

    const delRes = await app.request(`http://localhost/api/admin/pages/${testPages[0].id}`, { method: 'DELETE' }, env)
    expect(delRes.status).toBe(200)
    expect(testPages).toHaveLength(0)
  })

  it('should escape HTML in markdown headings to prevent XSS', async () => {
    const app = createApp()
    const env = createTestEnv()

    const res = await app.request(
      'http://localhost/api/admin/pages',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          slug: 'xss-test',
          title: 'XSS Test',
          contentMd: '# <img src=x onerror=alert(1)>\n\n[click](javascript:alert("xss"))',
        }),
      },
      env,
    )
    expect(res.status).toBe(201)

    const pageRes = await app.request(`http://localhost/api/admin/pages/${testPages[0].id}`, undefined, env)
    const page = await pageRes.json()
    // Verify script-injecting tags are escaped, not rendered as HTML
    expect(page.contentHtml).not.toContain('<img')
    expect(page.contentHtml).not.toContain('<script')
    expect(page.contentHtml).toContain('&lt;img')
    // Verify javascript: protocol is blocked in links
    expect(page.contentHtml).not.toContain('href="javascript:')
  })

  it('should reject invalid page ID', async () => {
    const app = createApp()
    const res = await app.request('http://localhost/api/admin/pages/abc', undefined, createTestEnv())
    expect(res.status).toBe(400)
  })

  it('should reject invalid slug format', async () => {
    const app = createApp()
    const env = createTestEnv()

    const res = await app.request(
      'http://localhost/api/admin/pages',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug: 'Invalid Slug!', title: 'Bad', contentMd: '' }),
      },
      env,
    )
    expect(res.status).toBe(400)
  })

  it('should serve published pages via public API', async () => {
    const app = createApp()
    const env = createTestEnv()

    await app.request(
      'http://localhost/api/admin/pages',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug: 'public-page', title: 'Public', contentMd: '# Public' }),
      },
      env,
    )

    // Not published yet
    const notFoundRes = await app.request('http://localhost/api/public/pages/public-page', undefined, env)
    expect(notFoundRes.status).toBe(404)

    // Publish it
    await app.request(`http://localhost/api/admin/pages/${testPages[0].id}/publish`, { method: 'POST' }, env)

    const publicRes = await app.request('http://localhost/api/public/pages/public-page', undefined, env)
    expect(publicRes.status).toBe(200)
    const page = await publicRes.json()
    expect(page.title).toBe('Public')
  })
})
