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
        <span>Contact</span>
        <h2>옥토워커스로 SaaS를 시작하세요</h2>
        <p>문의를 남기시면 D1에 바로 저장되고, 어드민 콘솔에서 확인할 수 있습니다. 이 폼 자체가 보일러플레이트의 리드 캡처 데모입니다.</p>
      </div>
      <form className="lead-form" onSubmit={handleSubmit}>
        <input
          placeholder="이름"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          required
        />
        <input
          placeholder="업무 이메일"
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          required
        />
        <input
          placeholder="회사명"
          value={form.company}
          onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
        />
        <textarea
          placeholder="어떤 서비스를 만들고 계신가요?"
          rows={5}
          value={form.message}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
        />
        <button disabled={status === 'saving'} type="submit">
          {status === 'saving' ? '저장 중...' : '문의 보내기'}
        </button>
        <p className="form-status">
          {status === 'done' && '문의가 접수되었습니다. 빠르게 연락드리겠습니다.'}
          {status === 'error' && '오류가 발생했습니다. 잠시 후 다시 시도해주세요.'}
        </p>
      </form>
    </section>
  )
}
