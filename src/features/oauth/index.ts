import { Hono } from 'hono'
import callbackRouter from './callback/service'

const app = new Hono()
  .route('/callback', callbackRouter)

export default app
