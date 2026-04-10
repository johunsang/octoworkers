const items = [
  {
    title: 'PTY Terminal',
    description: 'Real pseudo-terminal sessions with WebGL-accelerated rendering, split panels, and 5000-line scrollback.',
  },
  {
    title: 'Multi-Project Workspace',
    description: 'Each project gets its own working directory, terminal tabs, theme, and font settings. Session state persists across restarts.',
  },
  {
    title: 'Built-in File Manager',
    description: 'File tree sidebar with drag-and-drop, multi-select copy/cut, undo stack, and integrated text/image/docx/xlsx editors.',
  },
  {
    title: 'AI Agent Integration',
    description: 'Run Claude, Codex, OpenCode, Kimi, or Ollama CLI agents directly in the terminal with MCP browser bridge.',
  },
]

export function FeatureGrid() {
  return (
    <div className="feature-grid">
      {items.map((item) => (
        <article key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </article>
      ))}
    </div>
  )
}
