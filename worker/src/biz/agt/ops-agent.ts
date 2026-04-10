import { Agent, callable } from 'agents'
import type { AppBindings } from '../../com/bindings'
import { generateTextWithWorkersAi } from '../../com/workers-ai'

export type AgentTask = {
  id: string
  title: string
  done: boolean
  createdAt: string
}

export type OpsAgentState = {
  tasks: AgentTask[]
  notes: string[]
  lastSummary: string | null
}

export class OpsAgent extends Agent<AppBindings, OpsAgentState> {
  initialState: OpsAgentState = {
    tasks: [],
    notes: [],
    lastSummary: null,
  }

  @callable()
  addTask(title: string) {
    const task: AgentTask = {
      id: crypto.randomUUID(),
      title,
      done: false,
      createdAt: new Date().toISOString(),
    }

    this.setState({
      ...this.state,
      tasks: [task, ...this.state.tasks],
    })

    return task
  }

  @callable()
  completeTask(id: string) {
    const tasks = this.state.tasks.map((task) => (task.id === id ? { ...task, done: true } : task))

    this.setState({
      ...this.state,
      tasks,
    })

    return tasks
  }

  @callable()
  addNote(note: string) {
    const notes = [note, ...this.state.notes].slice(0, 20)

    this.setState({
      ...this.state,
      notes,
    })

    return notes
  }

  @callable()
  listTasks() {
    return this.state.tasks
  }

  @callable()
  getSnapshot() {
    return this.state
  }

  @callable()
  async summarizeTasks() {
    const taskLines = this.state.tasks.map((task) => `- [${task.done ? 'x' : ' '}] ${task.title}`).join('\n')
    const env = (this as unknown as { env: AppBindings }).env

    if (!taskLines) {
      return 'No tasks yet.'
    }

    try {
      const summary = await generateTextWithWorkersAi(env, [
        {
          role: 'system',
          content: 'Summarize operations tasks for a SaaS admin team in 4 short bullets.',
        },
        {
          role: 'user',
          content: taskLines,
        },
      ])

      this.setState({
        ...this.state,
        lastSummary: summary,
      })

      return summary
    } catch {
      const fallback = `Tasks tracked: ${this.state.tasks.length}, completed: ${this.state.tasks.filter((task) => task.done).length}`
      this.setState({
        ...this.state,
        lastSummary: fallback,
      })
      return fallback
    }
  }
}
