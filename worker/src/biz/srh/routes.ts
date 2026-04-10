import { Hono } from 'hono'
import type { AppBindings } from '../../com/bindings'
import { allRows } from '../../com/db'

type SearchLead = {
  id: number
  name: string
  email: string
  company: string | null
}

type SearchMedia = {
  image_id: string
  title: string
  alt: string | null
}

export const searchRoutes = new Hono<{ Bindings: AppBindings }>()

searchRoutes.get('/', async (c) => {
  const query = c.req.query('q')?.trim()

  if (!query) {
    return c.json({ leads: [], media: [] })
  }

  const keyword = `%${query}%`
  const leads = await allRows<SearchLead>(
    c.env.DB.prepare(
      `
        SELECT id, name, email, company
        FROM leads
        WHERE name LIKE ? OR email LIKE ? OR company LIKE ?
        ORDER BY id DESC
        LIMIT 10
      `,
    ).bind(keyword, keyword, keyword),
  )

  const media = await allRows<SearchMedia>(
    c.env.DB.prepare(
      `
        SELECT image_id, title, alt
        FROM media_assets
        WHERE title LIKE ? OR alt LIKE ?
        ORDER BY id DESC
        LIMIT 10
      `,
    ).bind(keyword, keyword),
  )

  return c.json({ leads, media })
})
