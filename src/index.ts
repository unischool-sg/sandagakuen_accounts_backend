import { Env } from './types/env'
import { Hono } from 'hono'
import oauthRouter from './features/oauth'

const app = new Hono<Env>()
  .route('oauth', oauthRouter)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
