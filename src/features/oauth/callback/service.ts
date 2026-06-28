import { DrizzleD1Database } from "drizzle-orm/d1"
import type { APIResponse } from "../../../types/api"
import { CallbackOAuthScheme } from "./scheme"
import { Google } from "google-oauth-lib"
import { CallbackRepository } from "./repository"
import { ServiceResponse } from "../../../libs/response"
import { randomUUID } from "../../../libs/crypto"
import { users } from "../../../db/scheme"
import { success, failure } from "../../../libs/response"

class CallbackService {
  static async show(query: CallbackOAuthScheme, db: DrizzleD1Database, client: Google): Promise<ServiceResponse<APIResponse<typeof users.$inferInsert, unknown>>> {
    const { code } = query

    const repository = new CallbackRepository(db)

    const result = await client.oauth.token(code)
    if ("error" in result) {
      return [failure(result, "Failed to exchange token"), 400]
    }

    const token = result.id_token
    client.accessToken = token

    const profile = await client.user.profile()
    const { email } = profile
    if (!email) return [failure(null, "Failed to get email"), 400]

    const isEmailUsed = await repository.findUser({ email })
    if (isEmailUsed) return [failure(null, "This resource is conflicted"), 409]

    try {
      const uid = randomUUID()
      const userData = {
        id: uid,
        username: email,
        name: profile.name,
        emailVerified: false,
        avatarUrl: profile.avatar,
        role: 'user' as const,
        status: 'suspended' as const,
      }
      await repository.insert(userData)

      return [success(userData, "Success to create user"), 201]
    } catch (e) {
      const parsedError: Error = e as Error
      console.log(parsedError)

      return [failure(parsedError, parsedError.message), 400]
    }
  }
}

export { CallbackService }
