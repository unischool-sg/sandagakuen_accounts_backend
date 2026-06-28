import { D1Database } from "@cloudflare/workers-types"
import { DrizzleD1Database } from "drizzle-orm/d1"
import { Google } from "google-oauth-lib"
import { Context } from "hono"


type Env = {
  Variables: {
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    RESEND_API_TOKEN?: string
    JWT_SECRET: string
    BASE_URL: string

    db: DrizzleD1Database
    client: Google
  },
  Bindings: {
    DB: D1Database
  },
}

type CtxWithEnv = Context<Env>

export type { Env, CtxWithEnv }
