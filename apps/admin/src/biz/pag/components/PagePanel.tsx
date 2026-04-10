import { useState } from 'react'
import type { Page } from '@octoworkers/com'
import { Panel } from '../../../com/ui/Panel'
import { usePages } from '../hooks/usePages'

export function PagePanel() {
  const { pages, selectedPage, loading, fetchPage, closePage, create, update, publish, unpublish, remove } = usePages()

  const [showEditor, setShowEditor] = useState(false)
  const [editSlug, setEditSlug] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

  function startNew() {
    setEditingId(null)
    setEditSlug('')
    setEditTitle('')
    setEditContent('')
    setShowEditor(true)
  }

  function startEdit(page: Page) {
    setEditingId(page.id)
    setEditSlug(page.slug)
    setEditTitle(page.title)
    setEditContent(page.contentMd)
    setShowEditor(true)
  }

  async function handleSave() {
    const input = { slug: editSlug, title: editTitle, contentMd: editContent }
    if (editingId) {
      await update(editingId, input)
    } else {
      await create(input)
    }
    setShowEditor(false)
  }

  return (
    <>
      <Panel title="Pages" eyebrow="CMS">
        <div className="button-row">
          <button onClick={startNew}>New Page</button>
        </div>
        <div className="table-shell" style={{ marginTop: '0.5rem' }}>
          {pages.map((page) => (
            <article key={page.id} className="list-row" style={{ cursor: 'pointer' }} onClick={() => fetchPage(page.id)}>
              <div>
                <strong>{page.title}</strong>
                <p>/{page.slug}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    color: page.status === 'published' ? 'var(--accent, #4ade80)' : 'var(--muted, #888)',
                  }}
                >
                  {page.status}
                </span>
                <br />
                <small>{page.publishedAt ? new Date(page.publishedAt).toLocaleDateString() : 'Not published'}</small>
              </div>
            </article>
          ))}
        </div>
      </Panel>

      {selectedPage && !showEditor && (
        <Panel title={selectedPage.title} eyebrow="Page Detail">
          <div className="button-row">
            <button onClick={() => startEdit(selectedPage)}>Edit</button>
            {selectedPage.status === 'draft' ? (
              <button onClick={() => publish(selectedPage.id)}>Publish</button>
            ) : (
              <button className="secondary-button" onClick={() => unpublish(selectedPage.id)}>
                Unpublish
              </button>
            )}
            <button className="secondary-button" onClick={() => remove(selectedPage.id)}>
              Delete
            </button>
            <button className="secondary-button" onClick={closePage}>
              Close
            </button>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Slug:</strong> /{selectedPage.slug}
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Status:</strong> {selectedPage.status}
              </div>
              <div
                style={{ marginTop: '1rem', padding: '1rem', background: 'var(--surface, #f5f5f5)', borderRadius: '8px' }}
                dangerouslySetInnerHTML={{ __html: selectedPage.contentHtml }}
              />
            </>
          )}
        </Panel>
      )}

      {showEditor && (
        <Panel title={editingId ? 'Edit Page' : 'New Page'} eyebrow="CMS Editor">
          <div className="form-grid">
            <input value={editSlug} onChange={(e) => setEditSlug(e.target.value)} placeholder="slug (e.g. about-us)" />
            <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Page title" />
            <textarea rows={12} value={editContent} onChange={(e) => setEditContent(e.target.value)} placeholder="Write markdown..." style={{ fontFamily: 'monospace' }} />
          </div>
          <div className="button-row" style={{ marginTop: '0.5rem' }}>
            <button onClick={handleSave}>Save</button>
            <button className="secondary-button" onClick={() => setShowEditor(false)}>
              Cancel
            </button>
          </div>
        </Panel>
      )}
    </>
  )
}
