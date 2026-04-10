import { useEffect, useState } from 'react'
import { apiFetch } from '../../../com/api/client'

type ReleaseAsset = { name: string; url: string; size: number }
type Release = { tag: string; name: string; publishedAt: string; body: string; assets: ReleaseAsset[] }

function formatSize(bytes: number) {
  if (bytes > 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`
  return `${(bytes / 1_000).toFixed(0)} KB`
}

function getPlatformLabel(name: string) {
  if (name.endsWith('.dmg')) return 'macOS (DMG)'
  if (name.endsWith('.app.tar.gz') || name.includes('aarch64')) return 'macOS (Apple Silicon)'
  if (name.endsWith('.msi')) return 'Windows (MSI)'
  if (name.endsWith('.exe')) return 'Windows (EXE)'
  if (name.endsWith('.nsis.zip')) return 'Windows (NSIS)'
  return name
}

export function DownloadPanel() {
  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    apiFetch<Release[]>('/api/public/releases')
      .then((data) => {
        if (mounted) setReleases(data)
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const latest = releases[0]

  return (
    <section className="download-panel" id="download">
      <div className="section-copy">
        <span>Download</span>
        <h2>Get Octo Terminal</h2>
        <p>macOS and Windows builds are available. Auto-update is built in.</p>
      </div>
      {loading && <p style={{ textAlign: 'center', opacity: 0.6 }}>Loading releases...</p>}
      {latest && (
        <div className="download-grid">
          <div className="download-version">
            <strong>{latest.name ?? latest.tag}</strong>
            <small>{new Date(latest.publishedAt).toLocaleDateString()}</small>
          </div>
          <div className="download-assets">
            {latest.assets
              .filter((a) => !a.name.endsWith('.sig') && !a.name.endsWith('.json'))
              .map((asset) => (
                <a key={asset.name} href={asset.url} className="download-button" download>
                  <strong>{getPlatformLabel(asset.name)}</strong>
                  <small>{formatSize(asset.size)}</small>
                </a>
              ))}
          </div>
        </div>
      )}
      {releases.length > 1 && (
        <details className="older-releases">
          <summary>Previous versions</summary>
          {releases.slice(1).map((r) => (
            <div key={r.tag} className="older-release-row">
              <span>
                {r.name ?? r.tag} — {new Date(r.publishedAt).toLocaleDateString()}
              </span>
              <div>
                {r.assets
                  .filter((a) => !a.name.endsWith('.sig') && !a.name.endsWith('.json'))
                  .map((a) => (
                    <a key={a.name} href={a.url} download>
                      {getPlatformLabel(a.name)}
                    </a>
                  ))}
              </div>
            </div>
          ))}
        </details>
      )}
    </section>
  )
}
