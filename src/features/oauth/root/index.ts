import { Hono } from "hono";
import { Env } from "../../../types/env";
import { OAuthService } from "./service";

const app = new Hono<Env>()

app.get('/', (c) => {
  const client = c.get('client')
  const baseUrl = c.get('BASE_URL')
  const redirectUrl = OAuthService.show(client, baseUrl)
  return c.redirect(redirectUrl)
})

export default app
