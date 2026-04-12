import { LoginScreen } from './biz/aut/components/LoginScreen'
import { useAuth } from './biz/aut/hooks/useAuth'
import { OverviewPanel } from './biz/dsh/components/OverviewPanel'
import { SystemPanel } from './biz/log/components/SystemPanel'
import { UserPanel } from './biz/usr/components/UserPanel'
import { AccessLogPanel } from './biz/log/components/AccessLogPanel'
import { ApiLogPanel } from './biz/log/components/ApiLogPanel'
import { SearchPanel } from './biz/srh/components/SearchPanel'
import { SettingsPanel } from './biz/set/components/SettingsPanel'
import { LeadListPanel } from './biz/led/components/LeadListPanel'
import { MediaPanel } from './biz/med/components/MediaPanel'
import { EmailPanel } from './biz/eml/components/EmailPanel'
import { PagePanel } from './biz/pag/components/PagePanel'
import { CloudflareExamples } from './biz/ext/components/CloudflareExamples'
import { useLeads } from './biz/led/hooks/useLeads'

function AuthenticatedAdmin({ email, logout }: { email: string; logout: () => Promise<void> }) {
  const { leads } = useLeads()

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <span>Cloudflare Admin</span>
        <h1>옥토워커스 Ops</h1>
        <p>사용자, 리드, 미디어, 이메일, CMS, AI, 로그를 하나의 콘솔에서 관리합니다.</p>
        <div className="sidebar-footer">
          <strong>{email}</strong>
          <button className="secondary-button" onClick={logout}>Log out</button>
        </div>
      </aside>
      <section className="admin-content">
        <div className="admin-grid">
          <SystemPanel />
          <OverviewPanel />
          <UserPanel />
          <AccessLogPanel />
          <ApiLogPanel />
          <SearchPanel />
          <SettingsPanel />
          <LeadListPanel />
          <MediaPanel />
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

  if (loading) return <main className="admin-loading">Checking admin session...</main>
  if (!user) return <LoginScreen onLogin={login} />

  return <AuthenticatedAdmin email={user.email} logout={logout} />
}
