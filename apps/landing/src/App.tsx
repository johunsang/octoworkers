import { Section } from './com/ui/Section'
import { FeatureGrid } from './biz/mkt/components/FeatureGrid'
import { HeroPanel } from './biz/mkt/components/HeroPanel'
import { DownloadPanel } from './biz/mkt/components/DownloadPanel'
import { usePublicBootstrap } from './biz/mkt/hooks/usePublicBootstrap'

export function App() {
  const { data, loading } = usePublicBootstrap()

  const metrics = [
    {
      label: 'Current version',
      value: data?.settings?.brand ?? 'v0.1.69',
    },
    {
      label: 'Platform',
      value: 'macOS / Windows',
    },
    {
      label: 'License',
      value: 'Free',
    },
  ]

  return (
    <main className="landing-shell">
      <HeroPanel metrics={metrics} loading={loading} />
      <Section
        eyebrow="Features"
        title="AI-powered terminal with everything built in"
        description="File manager, multi-project workspaces, split panels, Telegram remote control, and native AI agent integration."
      >
        <FeatureGrid />
      </Section>
      <DownloadPanel />
      <Section
        eyebrow="Open Source"
        title="Built with Tauri v2 + React"
        description="Native performance, small bundle size, and cross-platform support."
      >
        <div className="ops-rail">
          <article>
            <h3>Terminal</h3>
            <p>xterm.js with WebGL rendering, PTY bridge, IME support for CJK input.</p>
          </article>
          <article>
            <h3>AI Agents</h3>
            <p>Run Claude, Codex, Kimi, or Ollama directly in the terminal with full MCP integration.</p>
          </article>
          <article>
            <h3>Remote</h3>
            <p>Mirror terminal I/O to Telegram for remote monitoring and command injection.</p>
          </article>
        </div>
      </Section>
    </main>
  )
}
