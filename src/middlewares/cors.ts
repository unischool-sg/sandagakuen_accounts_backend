import { cors } from "hono/cors"


const corsConf = async (c, next) => {
  const frontendUrl = c.env.FRONTEND_URL || 'http://localhost:5173'
  const corsMiddleware = cors({
    origin: (origin) => {
      const allowed = [frontendUrl, 'http://localhost:5173']
      return allowed.includes(origin) ? origin : frontendUrl
    },
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
  return corsMiddleware(c, next)
}

