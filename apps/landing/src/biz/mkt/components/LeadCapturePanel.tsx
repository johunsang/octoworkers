import { useState } from 'react'
import type { FormEvent } from 'react'
import type { LeadSubmissionInput } from '@octoworkers/com'
import { apiFetch } from '../../../com/api/client'

const initialForm: LeadSubmissionInput = {
  name: '',
  email: '',
  company: '',
  message: '',
}

export function LeadCapturePanel() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('saving')

    try {
      await apiFetch('/api/public/leads', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      setForm(initialForm)
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="lead-capture" id="lead-capture">
      <div className="section-copy">
        <span>Pipeline</span>
        <h2>Start collecting leads into D1 right away</h2>
        <p>The form writes to D1 through Hono routes, and the admin console reads the same records without any extra backend service.</p>
      </div>
      <form className="lead-form" onSubmit={handleSubmit}>
        <input
          placeholder="Your name"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          required
        />
        <input
          placeholder="Work email"
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          required
        />
        <input
          placeholder="Company"
          value={form.company}
          onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
        />
        <textarea
          placeholder="What are you building?"
          rows={5}
          value={form.message}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
        />
        <button disabled={status === 'saving'} type="submit">
          {status === 'saving' ? 'Saving...' : 'Send to D1'}
        </button>
        <p className="form-status">
          {status === 'done' && 'Lead captured successfully.'}
          {status === 'error' && 'Something went wrong. Check the Worker logs and try again.'}
        </p>
      </form>
    </section>
  )
}
