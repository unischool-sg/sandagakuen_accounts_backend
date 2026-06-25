import { Hono, Context } from 'hono'


const app = new Hono()

app.get('/', async (c: Context) => {
  const code = c.req.query('code')
  if (!code) {
    return c.json({
      error: true,
      message: 'code is required'
    }, 400)
  }


})

export default app
