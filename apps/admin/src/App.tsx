import { useState } from 'react'
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

type NavItem = {
  id: string
  label: string
  group: string
  icon: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', group: 'Overview', icon: '/' },
  { id: 'system', label: 'System', group: 'Overview', icon: '#' },
  { id: 'users', label: 'Users', group: 'Management', icon: '@' },
  { id: 'leads', label: 'Leads', group: 'Management', icon: '>' },
  { id: 'media', label: 'Media', group: 'Management', icon: '*' },
  { id: 'pages', label: 'Pages', group: 'Management', icon: '~' },
  { id: 'email', label: 'Email', group: 'Management', icon: '+' },
  { id: 'settings', label: 'Settings', group: 'Config', icon: '%' },
  { id: 'search', label: 'Search', group: 'Tools', icon: '?' },
  { id: 'access-logs', label: 'Access Logs', group: 'Logs', icon: '!' },
  { id: 'api-logs', label: 'API Logs', group: 'Logs', icon: '&' },
  { id: 'extensions', label: 'Extensions', group: 'Tools', icon: '^' },
]

function groupItems(items: NavItem[]): Map<string, NavItem[]> {
  const groups = new Map<string, NavItem[]>()
  for (const item of items) {
    const list = groups.get(item.group) ?? []
    list.push(item)
    groups.set(item.group, list)
  }
  return groups
}

function AuthenticatedAdmin({ email, logout }: { email: string; logout: () => Promise<void> }) {
  const { leads } = useLeads()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const groups = groupItems(NAV_ITEMS)

  function renderPanel() {
    switch (activeTab) {
      case 'dashboard': return <OverviewPanel />
      case 'system': return <SystemPanel />
      case 'users': return <UserPanel />
      case 'leads': return <LeadListPanel />
      case 'media': return <MediaPanel />
      case 'pages': return <PagePanel />
      case 'email': return <EmailPanel leads={leads} />
      case 'settings': return <SettingsPanel />
      case 'search': return <SearchPanel />
      case 'access-logs': return <AccessLogPanel />
      case 'api-logs': return <ApiLogPanel />
      case 'extensions': return <CloudflareExamples />
      default: return <OverviewPanel />
    }
  }

  return (
    <main className="admin-shell">
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle navigation"
      >
        {sidebarOpen ? '\u2715' : '\u2630'}
      </button>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-brand">
          <span className="brand-badge">Cloudflare Admin</span>
          <h1>Octoworkers</h1>
        </div>

        <nav className="sidebar-nav">
          {[...groups.entries()].map(([group, items]) => (
            <div key={group} className="nav-group">
              <span className="nav-group-label">{group}</span>
              {items.map((item) => (
                <button
                  key={item.id}
                  className={`nav-item${activeTab === item.id ? ' active' : ''}`}
                  onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">{email[0].toUpperCase()}</div>
            <span className="user-email">{email}</span>
          </div>
          <button className="logout-btn" onClick={logout}>Log out</button>
        </div>
      </aside>

      <section className="admin-content">
        <header className="content-header">
          <h2 className="content-title">
            {NAV_ITEMS.find(i => i.id === activeTab)?.label ?? 'Dashboard'}
          </h2>
        </header>
        <div className="content-body">
          {renderPanel()}
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
