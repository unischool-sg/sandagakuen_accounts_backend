import { D1Database } from "@cloudflare/workers-types"
import { DrizzleD1Database } from "drizzle-orm/d1"
import { Context } from "hono"

type Env = {
  Variables: {
    // Google OAuth Configure
    GOOGLE_CLIENT_ID: string,
    GOOGLE_CLIENT_SECRET: string,

    // API Configure
    RESEND_API_TOKEN?: string,


    JWT_SECRET: string,


    db: DrizzleD1Database
  },
  Bindings: {
    DB: D1Database
  },
}

type CtxWithEnv = Context<Env>

export type { Env, CtxWithEnv }
