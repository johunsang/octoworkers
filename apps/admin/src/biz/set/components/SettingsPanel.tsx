import { Panel } from '../../../com/ui/Panel'
import { useSettings } from '../hooks/useSettings'
import { useAiCopy } from '../../aid/hooks/useAiCopy'

export function SettingsPanel() {
  const { form, saving, setForm, save } = useSettings()
  const { loading: aiLoading, suggestion, generate } = useAiCopy()

  return (
    <Panel title="Landing Content" eyebrow="Settings">
      <div className="form-grid">
        <input value={form.brand} onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value }))} placeholder="Brand" />
        <input value={form.heroLabel} onChange={(event) => setForm((current) => ({ ...current, heroLabel: event.target.value }))} placeholder="Hero label" />
        <textarea rows={3} value={form.heroTitle} onChange={(event) => setForm((current) => ({ ...current, heroTitle: event.target.value }))} placeholder="Hero title" />
        <textarea rows={4} value={form.heroSubtitle} onChange={(event) => setForm((current) => ({ ...current, heroSubtitle: event.target.value }))} placeholder="Hero subtitle" />
        <input value={form.ctaPrimary} onChange={(event) => setForm((current) => ({ ...current, ctaPrimary: event.target.value }))} placeholder="Primary CTA" />
        <input value={form.ctaSecondary} onChange={(event) => setForm((current) => ({ ...current, ctaSecondary: event.target.value }))} placeholder="Secondary CTA" />
      </div>
      <div className="button-row">
        <button onClick={save} disabled={saving}>
          {saving ? 'Saving...' : 'Save to D1'}
        </button>
        <button
          className="secondary-button"
          onClick={() => generate({ objective: form.heroTitle, audience: 'B2B SaaS founders and operators', tone: 'confident, sharp, premium' })}
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
  )
}
