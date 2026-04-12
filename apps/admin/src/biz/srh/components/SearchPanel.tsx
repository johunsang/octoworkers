import { Panel } from '../../../com/ui/Panel'
import { useSearch } from '../hooks/useSearch'

export function SearchPanel() {
  const { query, setQuery, results, search } = useSearch()

  return (
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
  )
}
