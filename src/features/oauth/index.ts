import { Env } from '../../types/env'
import { Hono } from 'hono'
import callbackRouter from './callback/index'

const app = new Hono<Env>()
  .route('/callback', callbackRouter)

export default app
