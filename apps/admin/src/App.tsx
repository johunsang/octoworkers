import { useState } from 'react'
import type { FormEvent } from 'react'
import { Panel } from './com/ui/Panel'
import { LoginScreen } from './biz/aut/components/LoginScreen'
import { useAuth } from './biz/aut/hooks/useAuth'
import { useAiCopy } from './biz/aid/hooks/useAiCopy'
import { useDashboard } from './biz/dsh/hooks/useDashboard'
import { CloudflareExamples } from './biz/ext/components/CloudflareExamples'
import { useLeads } from './biz/led/hooks/useLeads'
import { LeadDetailPanel } from './biz/led/components/LeadDetailPanel'
import { MediaManager } from './biz/med/components/MediaManager'
import { useMedia } from './biz/med/hooks/useMedia'
import { EmailPanel } from './biz/eml/components/EmailPanel'
import { PagePanel } from './biz/pag/components/PagePanel'
import { useSearch } from './biz/srh/hooks/useSearch'
import { useSettings } from './biz/set/hooks/useSettings'

function AuthenticatedAdmin({ email, logout }: { email: string; logout: () => Promise<void> }) {
  const { dashboard } = useDashboard()
  const { leads, selectedLead, loading: leadLoading, fetchLeadDetail, closeLead, updateStatus, addTag, removeTag, addNote } = useLeads()
  const { media, createDirectUpload, refreshAsset, updateAsset, deleteAsset } = useMedia()
  const { form, saving, setForm, save } = useSettings()
  const { loading: aiLoading, suggestion, generate } = useAiCopy()
  const { query, setQuery, results, search } = useSearch()
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadAlt, setUploadAlt] = useState('')

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const payload = await createDirectUpload(uploadTitle, uploadAlt)
    window.open(payload.uploadURL, '_blank', 'noopener,noreferrer')
    setUploadTitle('')
    setUploadAlt('')
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <span>Cloudflare Admin</span>
        <h1>옥토워커스 Ops</h1>
        <p>Manage landing content, leads, media, realtime, KV, and AI-assisted copy from one Cloudflare-hosted console.</p>
        <div className="sidebar-footer">
          <strong>{email}</strong>
          <button className="secondary-button" onClick={logout}>
            Log out
          </button>
        </div>
      </aside>
      <section className="admin-content">
        <div className="admin-grid">
          <Panel title="Overview" eyebrow="Dashboard">
            <div className="stats-grid">
              <article>
                <span>Total leads</span>
                <strong>{dashboard?.stats.totalLeads ?? 0}</strong>
              </article>
              <article>
                <span>Total media</span>
                <strong>{dashboard?.stats.totalMedia ?? 0}</strong>
              </article>
              <article>
                <span>AI Gateway</span>
                <strong>{dashboard?.aiConfigured ? 'Ready' : 'Configure token'}</strong>
              </article>
            </div>
          </Panel>

          <Panel title="Search" eyebrow="Operations">
            <div className="button-row">
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search leads, emails, companies, assets..." />
              <button onClick={() => search()}>Search</button>
            </div>
            <div className="table-shell">
              {results.leads.map((lead) => (
                <article key={`lead-${lead.id}`} className="list-row">
                  <div>
                    <strong>{lead.name}</strong>
                    <p>{lead.email}</p>
                  </div>
                  <span>{lead.company ?? 'No company'}</span>
                </article>
              ))}
              {results.media.map((asset) => (
                <article key={`media-${asset.image_id}`} className="list-row">
                  <div>
                    <strong>{asset.title}</strong>
                    <p>{asset.image_id}</p>
                  </div>
                  <span>{asset.alt ?? 'No alt text'}</span>
                </article>
              ))}
            </div>
          </Panel>

          <Panel title="Landing Content" eyebrow="Settings">
            <div className="form-grid">
              <input value={form.brand} onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value }))} placeholder="Brand" />
              <input
                value={form.heroLabel}
                onChange={(event) => setForm((current) => ({ ...current, heroLabel: event.target.value }))}
                placeholder="Hero label"
              />
              <textarea
                rows={3}
                value={form.heroTitle}
                onChange={(event) => setForm((current) => ({ ...current, heroTitle: event.target.value }))}
                placeholder="Hero title"
              />
              <textarea
                rows={4}
                value={form.heroSubtitle}
                onChange={(event) => setForm((current) => ({ ...current, heroSubtitle: event.target.value }))}
                placeholder="Hero subtitle"
              />
              <input
                value={form.ctaPrimary}
                onChange={(event) => setForm((current) => ({ ...current, ctaPrimary: event.target.value }))}
                placeholder="Primary CTA"
              />
              <input
                value={form.ctaSecondary}
                onChange={(event) => setForm((current) => ({ ...current, ctaSecondary: event.target.value }))}
                placeholder="Secondary CTA"
              />
            </div>
            <div className="button-row">
              <button onClick={save} disabled={saving}>
                {saving ? 'Saving...' : 'Save to D1'}
              </button>
              <button
                className="secondary-button"
                onClick={() =>
                  generate({
                    objective: form.heroTitle,
                    audience: 'B2B SaaS founders and operators',
                    tone: 'confident, sharp, premium',
                  })
                }
                disabled={aiLoading}
              >
                {aiLoading ? 'Thinking...' : 'Generate with AI Gateway'}
              </button>
            </div>
            {suggestion ? (
              <div className="suggestion-card">
                <strong>{suggestion.heroTitle}</strong>
                <p>{suggestion.heroSubtitle}</p>
                <small>{suggestion.rationale}</small>
              </div>
            ) : null}
          </Panel>

          <Panel title="Inbound Leads" eyebrow="Pipeline">
            <div className="table-shell">
              {leads.map((lead) => (
                <article key={lead.id} className="list-row" style={{ cursor: 'pointer' }} onClick={() => fetchLeadDetail(lead.id)}>
                  <div>
                    <strong>{lead.name}</strong>
                    <p>{lead.email}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span>{lead.company ?? 'No company'}</span>
                    <br />
                    <small style={{ opacity: 0.7 }}>{lead.status}</small>
                  </div>
                </article>
              ))}
            </div>
          </Panel>

          {selectedLead && (
            <LeadDetailPanel
              lead={selectedLead}
              loading={leadLoading}
              onClose={closeLead}
              onStatusChange={updateStatus}
              onAddTag={addTag}
              onRemoveTag={removeTag}
              onAddNote={addNote}
            />
          )}

          <Panel title="Cloudflare Images" eyebrow="Media">
            <form className="form-grid" onSubmit={handleUpload}>
              <input value={uploadTitle} onChange={(event) => setUploadTitle(event.target.value)} placeholder="Asset title" required />
              <input value={uploadAlt} onChange={(event) => setUploadAlt(event.target.value)} placeholder="Alt text" />
              <button type="submit">Create direct upload URL</button>
            </form>
            <MediaManager media={media} onRefresh={refreshAsset} onUpdate={updateAsset} onDelete={deleteAsset} />
          </Panel>

          <EmailPanel leads={leads} />

          <PagePanel />

          <CloudflareExamples />
        </div>
      </section>
    </main>
  )
}

export function App() {
  const { loading, user, login, logout } = useAuth()

  if (loading) {
    return <main className="admin-loading">Checking admin session...</main>
  }

  if (!user) {
    return <LoginScreen onLogin={login} />
  }

  return <AuthenticatedAdmin email={user.email} logout={logout} />
}
