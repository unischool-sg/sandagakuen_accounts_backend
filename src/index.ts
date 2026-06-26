import { Env } from './types/env'
import { Hono } from 'hono'
import { rootMiddleware } from './middlewares/root'
import oauthRouter from './features/oauth/index'

const app = new Hono<Env>()
  .use(rootMiddleware)
  .route('oauth', oauthRouter)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
