import { Google } from "google-oauth-lib";
import { CtxWithEnv } from "../types/env";
import { drizzle } from "drizzle-orm/d1";
import { Next } from "hono";
import { relations } from "../db/scheme";

const rootMiddleware = async (c: CtxWithEnv, next: Next) => {
  c.set("googleClient", Google.OAuth({
    clientId: c.get('GOOGLE_CLIENT_ID'),
    clientSecret: c.get('GOOGLE_CLIENT_SECRET')
  }))
  c.set('db', drizzle(c.env.DB, { relations }))

  return next()
}

export { rootMiddleware }
