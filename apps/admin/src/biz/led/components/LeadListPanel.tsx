import { Panel } from '../../../com/ui/Panel'
import { LeadDetailPanel } from './LeadDetailPanel'
import { useLeads } from '../hooks/useLeads'

export function LeadListPanel() {
  const { leads, selectedLead, loading: leadLoading, fetchLeadDetail, closeLead, updateStatus, addTag, removeTag, addNote } = useLeads()

  return (
    <>
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
    </>
  )
}
