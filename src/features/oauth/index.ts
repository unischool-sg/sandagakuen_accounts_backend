import { Env } from '../../types/env'
import { Hono } from 'hono'
import rootRouter from './root/index'
import callbackRouter from './callback/index'

const app = new Hono<Env>()
  .route('/', rootRouter)
  .route('/callback', callbackRouter)

export default app
