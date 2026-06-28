import type { Env } from '../../../types/env'
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { CallbackService } from './service'
import { callbackOAuthScheme } from './scheme'

const app = new Hono<Env>()

app.get('/', zValidator('query', callbackOAuthScheme), async (c) => {
  const query = c.req.valid('query')
  const db = c.get('db')
  const client = c.get('client')
  if (!query) return c.json({ error: true, message: "failed to parse request query" })
  const [result, code] = await CallbackService.show(query, db, client)

  return c.json(result, code)
})

export default app
