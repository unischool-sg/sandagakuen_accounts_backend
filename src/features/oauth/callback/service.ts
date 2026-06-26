import { DrizzleD1Database } from "drizzle-orm/d1"
import type { APIResponse } from "../../../types/api"
import { CallbackOAuthScheme } from "./scheme"
import { Google } from "google-oauth-lib"
import { ContentfulStatusCode } from "hono/utils/http-status"

type ServiceResponse<T> = [T, ContentfulStatusCode]

class CallbackService {
  static async show(query: CallbackOAuthScheme, db: DrizzleD1Database, client: Google): Promise<ServiceResponse<APIResponse>> {
    const { code, state } = query

    const result = await client.oauth.token(code)
    if ("error" in result) {
      return [{
        error: true,
        message: "Failed to exchange token",
        details: result
      }, 400]
    }

    const token = result.id_token
    client.accessToken = result.id_token

    const profile = await client.user.profile()
    const { email } = profile

    return [{ error: false, message: "success", data: null }, 200]
  }
}

export { CallbackService }
