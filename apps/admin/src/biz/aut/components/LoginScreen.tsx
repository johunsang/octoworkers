import { useState } from 'react'

type LoginScreenProps = {
  onLogin: (email: string, password: string) => Promise<void>
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('founder@example.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  return (
    <main className="login-shell">
      <section className="login-card">
        <span>Admin Login</span>
        <h1>Sign in to 옥토워커스 Ops</h1>
        <p>Use the Cloudflare-backed admin session or pair this with Cloudflare Access in staging and production.</p>
        <div className="form-grid">
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Admin email" />
          <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" />
          <button
            onClick={async () => {
              try {
                setError('')
                await onLogin(email, password)
              } catch {
                setError('Login failed. Check ADMIN_LOGIN_EMAIL and ADMIN_LOGIN_PASSWORD.')
              }
            }}
          >
            Sign in
          </button>
          {error ? <p className="login-error">{error}</p> : null}
        </div>
      </section>
    </main>
  )
}
