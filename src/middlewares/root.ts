import { Google } from "google-oauth-lib";
import { CtxWithEnv } from "../types/env";
import { drizzle } from "drizzle-orm/d1";
import { Next } from "hono";

const rootMiddleware = async (c: CtxWithEnv, next: Next) => {
  c.set("client", Google.OAuth({
    clientId: c.env.GOOGLE_CLIENT_ID,
    clientSecret: c.env.GOOGLE_CLIENT_SECRET
  }))
  c.set('db', drizzle(c.env.DB))

  return next()
}

export { rootMiddleware }
