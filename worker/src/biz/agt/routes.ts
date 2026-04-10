import { zValidator } from '@hono/zod-validator'
import { getAgentByName } from 'agents'
import { Hono } from 'hono'
import { z } from 'zod'
import type { AppBindings } from '../../com/bindings'
import { jsonError } from '../../com/http'
import type { AgentTask, OpsAgentState } from './ops-agent'

type OpsAgentStub = {
  addTask(title: string): Promise<AgentTask>
  completeTask(id: string): Promise<AgentTask[]>
  addNote(note: string): Promise<string[]>
  listTasks(): Promise<AgentTask[]>
  getSnapshot(): Promise<OpsAgentState>
  summarizeTasks(): Promise<string>
}

const taskSchema = z.object({
  title: z.string().min(2).max(160),
})

const noteSchema = z.object({
  note: z.string().min(2).max(800),
})

async function getOpsAgentStub(env: AppBindings) {
  if (!env.OpsAgent) {
    throw new Error('OpsAgent binding is not configured')
  }

  const stub = await getAgentByName(env.OpsAgent as never, 'admin-ops')
  return stub as unknown as OpsAgentStub
}

export const agentRoutes = new Hono<{ Bindings: AppBindings }>()

agentRoutes.get('/', async (c) => {
  try {
    const agent = await getOpsAgentStub(c.env)
    return c.json(await agent.getSnapshot())
  } catch (error) {
    return jsonError(c, 503, error instanceof Error ? error.message : 'Agent is not available')
  }
})

agentRoutes.post('/tasks', zValidator('json', taskSchema), async (c) => {
  try {
    const agent = await getOpsAgentStub(c.env)
    const task = await agent.addTask(c.req.valid('json').title)
    return c.json(task, 201)
  } catch (error) {
    return jsonError(c, 503, error instanceof Error ? error.message : 'Failed to create agent task')
  }
})

agentRoutes.post('/tasks/:id/complete', async (c) => {
  try {
    const agent = await getOpsAgentStub(c.env)
    return c.json({
      tasks: await agent.completeTask(c.req.param('id')),
    })
  } catch (error) {
    return jsonError(c, 503, error instanceof Error ? error.message : 'Failed to complete agent task')
  }
})

agentRoutes.post('/notes', zValidator('json', noteSchema), async (c) => {
  try {
    const agent = await getOpsAgentStub(c.env)
    return c.json({
      notes: await agent.addNote(c.req.valid('json').note),
    })
  } catch (error) {
    return jsonError(c, 503, error instanceof Error ? error.message : 'Failed to add agent note')
  }
})

agentRoutes.post('/summarize', async (c) => {
  try {
    const agent = await getOpsAgentStub(c.env)
    return c.json({
      summary: await agent.summarizeTasks(),
    })
  } catch (error) {
    return jsonError(c, 503, error instanceof Error ? error.message : 'Failed to summarize agent tasks')
  }
})
