import { useEffect, useState } from 'react'
import { Panel } from '../../../com/ui/Panel'
import { apiFetch } from '../../../com/api/client'

type KvKeysResponse = {
  keys: string[]
}

type WorkersAiStatus = {
  configured: boolean
  textModel: string | null
  embedModel: string | null
  vectorizeBound: boolean
}

type VectorMatch = {
  id: string
  score: number
  metadata?: Record<string, unknown>
}

type VectorSearchResponse = {
  matches: VectorMatch[]
}

type AgentTask = {
  id: string
  title: string
  done: boolean
  createdAt: string
}

type AgentSnapshot = {
  tasks: AgentTask[]
  notes: string[]
  lastSummary: string | null
}

export function CloudflareExamples() {
  const [kvKey, setKvKey] = useState('feature-flag')
  const [kvValue, setKvValue] = useState('enabled')
  const [kvKeys, setKvKeys] = useState<string[]>([])
  const [r2Key, setR2Key] = useState('hello.txt')
  const [r2Value, setR2Value] = useState('Hello from R2 example')
  const [messages, setMessages] = useState<string[]>([])
  const [socketMessage, setSocketMessage] = useState('hello realtime')
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [workersAi, setWorkersAi] = useState<WorkersAiStatus | null>(null)
  const [aiPrompt, setAiPrompt] = useState('Suggest three launch experiments for a Cloudflare-native SaaS.')
  const [aiOutput, setAiOutput] = useState('')
  const [vectorQuery, setVectorQuery] = useState('landing hero copy for founders')
  const [vectorMatches, setVectorMatches] = useState<VectorMatch[]>([])
  const [agentTaskTitle, setAgentTaskTitle] = useState('Review staging deployment checklist')
  const [agentNote, setAgentNote] = useState('Keep production rollout behind Cloudflare Access until smoke test passes.')
  const [agentSnapshot, setAgentSnapshot] = useState<AgentSnapshot | null>(null)
  const [feedback, setFeedback] = useState('')

  async function refreshKeys() {
    const response = await apiFetch<KvKeysResponse>('/api/admin/ext/kv')
    setKvKeys(response.keys)
  }

  async function refreshWorkersAi() {
    const response = await apiFetch<WorkersAiStatus>('/api/admin/ext/ai/workers')
    setWorkersAi(response)
  }

  async function refreshAgent() {
    const response = await apiFetch<AgentSnapshot>('/api/admin/agt')
    setAgentSnapshot(response)
  }

  useEffect(() => {
    void refreshKeys()
    void refreshWorkersAi()
    void refreshAgent()

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const nextSocket = new WebSocket(`${protocol}//${window.location.host}/api/admin/ext/rtm/ws`)

    nextSocket.onmessage = (event) => {
      setMessages((current) => [...current, event.data])
    }

    setSocket(nextSocket)

    return () => {
      nextSocket.close()
    }
  }, [])

  return (
    <Panel title="Cloudflare Examples" eyebrow="Realtime + KV">
      <div className="examples-grid">
        <div className="form-grid">
          <strong>Workers KV example</strong>
          <input value={kvKey} onChange={(event) => setKvKey(event.target.value)} placeholder="KV key" />
          <input value={kvValue} onChange={(event) => setKvValue(event.target.value)} placeholder="KV value" />
          <div className="button-row">
            <button
              onClick={async () => {
                await apiFetch(`/api/admin/ext/kv/${encodeURIComponent(kvKey)}`, {
                  method: 'PUT',
                  body: JSON.stringify({ value: kvValue }),
                })
                await refreshKeys()
              }}
            >
              Put
            </button>
            <button
              className="secondary-button"
              onClick={async () => {
                const response = await apiFetch<{ value: string | null }>(`/api/admin/ext/kv/${encodeURIComponent(kvKey)}`)
                setKvValue(response.value ?? '')
              }}
            >
              Get
            </button>
            <button
              className="secondary-button"
              onClick={async () => {
                await apiFetch(`/api/admin/ext/kv/${encodeURIComponent(kvKey)}`, {
                  method: 'DELETE',
                })
                await refreshKeys()
              }}
            >
              Delete
            </button>
          </div>
          <small>{kvKeys.join(', ') || 'No KV example keys yet'}</small>
        </div>

        <div className="form-grid">
          <strong>Realtime echo example</strong>
          <input value={socketMessage} onChange={(event) => setSocketMessage(event.target.value)} placeholder="Message to send" />
          <button onClick={() => socket?.send(socketMessage)}>Send over WebSocket</button>
          <div className="table-shell">
            {messages.map((message, index) => (
              <article key={`${message}-${index}`} className="list-row">
                <span>{message}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="form-grid">
          <strong>R2 object example</strong>
          <input value={r2Key} onChange={(event) => setR2Key(event.target.value)} placeholder="R2 object key" />
          <input value={r2Value} onChange={(event) => setR2Value(event.target.value)} placeholder="R2 object value" />
          <div className="button-row">
            <button
              onClick={async () => {
                await apiFetch(`/api/admin/ext/r2/${encodeURIComponent(r2Key)}`, {
                  method: 'PUT',
                  body: JSON.stringify({ value: r2Value }),
                })
              }}
            >
              Put
            </button>
            <button
              className="secondary-button"
              onClick={async () => {
                const response = await apiFetch<{ value: string | null }>(`/api/admin/ext/r2/${encodeURIComponent(r2Key)}`)
                setR2Value(response.value ?? '')
              }}
            >
              Get
            </button>
            <button
              className="secondary-button"
              onClick={async () => {
                await apiFetch(`/api/admin/ext/r2/${encodeURIComponent(r2Key)}`, {
                  method: 'DELETE',
                })
                setR2Value('')
              }}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="form-grid">
          <strong>Workers AI + Vectorize</strong>
          <small>
            {workersAi
              ? `AI ${workersAi.configured ? 'ready' : 'not ready'} / text: ${workersAi.textModel ?? 'n/a'} / embed: ${workersAi.embedModel ?? 'n/a'}`
              : 'Loading AI binding status...'}
          </small>
          <textarea rows={3} value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} placeholder="Prompt for Workers AI" />
          <div className="button-row">
            <button
              onClick={async () => {
                const response = await apiFetch<{ output: string }>('/api/admin/ext/ai/text', {
                  method: 'POST',
                  body: JSON.stringify({ prompt: aiPrompt }),
                })
                setAiOutput(response.output)
                setFeedback('Workers AI text call completed.')
              }}
            >
              Generate text
            </button>
            <button
              className="secondary-button"
              onClick={async () => {
                await apiFetch('/api/admin/vec/reindex', {
                  method: 'POST',
                })
                setFeedback('Vector index reindexed from D1 content.')
              }}
            >
              Reindex docs
            </button>
          </div>
          <textarea rows={4} value={aiOutput} onChange={(event) => setAiOutput(event.target.value)} placeholder="Workers AI output" />
          <input value={vectorQuery} onChange={(event) => setVectorQuery(event.target.value)} placeholder="Semantic search query" />
          <button
            className="secondary-button"
            onClick={async () => {
              const response = await apiFetch<VectorSearchResponse>('/api/admin/vec/search', {
                method: 'POST',
                body: JSON.stringify({ query: vectorQuery }),
              })
              setVectorMatches(response.matches)
              setFeedback(`Vector search returned ${response.matches.length} matches.`)
            }}
          >
            Search vectors
          </button>
          <div className="table-shell">
            {vectorMatches.map((match) => (
              <article key={match.id} className="list-row">
                <div>
                  <strong>{match.id}</strong>
                  <p>{String(match.metadata?.title ?? match.metadata?.type ?? 'No metadata')}</p>
                </div>
                <span>{match.score.toFixed(4)}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="form-grid">
          <strong>Ops Agent</strong>
          <small>Durable Object backed admin agent with persistent tasks, notes, and AI summaries.</small>
          <input value={agentTaskTitle} onChange={(event) => setAgentTaskTitle(event.target.value)} placeholder="New agent task" />
          <div className="button-row">
            <button
              onClick={async () => {
                await apiFetch('/api/admin/agt/tasks', {
                  method: 'POST',
                  body: JSON.stringify({ title: agentTaskTitle }),
                })
                await refreshAgent()
                setFeedback('Agent task created.')
              }}
            >
              Add task
            </button>
            <button
              className="secondary-button"
              onClick={async () => {
                const response = await apiFetch<{ summary: string }>('/api/admin/agt/summarize', {
                  method: 'POST',
                })
                await refreshAgent()
                setFeedback(response.summary)
              }}
            >
              Summarize
            </button>
          </div>
          <textarea rows={3} value={agentNote} onChange={(event) => setAgentNote(event.target.value)} placeholder="Persistent agent note" />
          <button
            className="secondary-button"
            onClick={async () => {
              await apiFetch('/api/admin/agt/notes', {
                method: 'POST',
                body: JSON.stringify({ note: agentNote }),
              })
              await refreshAgent()
              setFeedback('Agent note saved.')
            }}
          >
            Save note
          </button>
          <div className="table-shell">
            {(agentSnapshot?.tasks ?? []).map((task) => (
              <article key={task.id} className="list-row">
                <div>
                  <strong>{task.title}</strong>
                  <p>{new Date(task.createdAt).toLocaleString()}</p>
                </div>
                <button
                  className="secondary-button"
                  onClick={async () => {
                    await apiFetch(`/api/admin/agt/tasks/${encodeURIComponent(task.id)}/complete`, {
                      method: 'POST',
                    })
                    await refreshAgent()
                    setFeedback('Agent task completed.')
                  }}
                >
                  {task.done ? 'Done' : 'Complete'}
                </button>
              </article>
            ))}
          </div>
          <small>{agentSnapshot?.lastSummary ?? 'No agent summary yet'}</small>
        </div>
      </div>
      <small>{feedback || 'Examples are wired to live Worker endpoints for KV, R2, Workers AI, Vectorize, WebSocket, and Agents.'}</small>
    </Panel>
  )
}
