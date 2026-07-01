import type { Env } from '../../../types/env'
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { CallbackService } from './service'
import { callbackOAuthScheme } from './scheme'
import { setCookie } from 'hono/cookie'

const app = new Hono<Env>()

app.get('/', zValidator('query', callbackOAuthScheme), async (c) => {
  const query = c.req.valid('query')
  const db = c.get('db')
  const client = c.get('client')
  const jwtSecret = c.env.JWT_SECRET
  const frontendUrl = c.env.FRONTEND_URL || 'http://localhost:5173'
  const cookieDomain = c.env.COOKIE_DOMAIN

  if (!query) {
    return c.redirect(`${frontendUrl}/auth/callback?error=${encodeURIComponent("failed to parse request query")}`)
  }

  const [result] = await CallbackService.show(query, db, client, jwtSecret)

  if (result.error) {
    return c.redirect(`${frontendUrl}/auth/callback?error=${encodeURIComponent(result.message)}`)
  }

  // Set JWT inside httpOnly secure cookie
  setCookie(c, 'session', result.data.token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    domain: cookieDomain || undefined,
    path: '/',
    maxAge: 7200
  })

  return c.redirect(`${frontendUrl}/_auth/callback`)
})

export default app
