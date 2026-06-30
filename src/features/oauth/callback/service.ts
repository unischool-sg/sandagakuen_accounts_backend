import { DrizzleD1Database } from "drizzle-orm/d1"
import type { APIResponse } from "../../../types/api"
import { CallbackOAuthScheme } from "./scheme"
import { Google } from "google-oauth-lib"
import { CallbackRepository } from "./repository"
import { ServiceResponse } from "../../../libs/response"
import { randomUUID } from "../../../libs/crypto"
import { users } from "../../../db/scheme"
import { success, failure } from "../../../libs/response"
import { generateToken } from "../../../libs/jwt"

class CallbackService {
  static async show(
    query: CallbackOAuthScheme,
    db: DrizzleD1Database,
    client: Google,
    jwtSecret: string
  ): Promise<ServiceResponse<APIResponse<{ user: typeof users.$inferSelect; token: string }, unknown>>> {
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

    let user: typeof users.$inferSelect | null = null
    const existingUsers = await repository.findUser({ email })
    
    if (existingUsers && existingUsers.length > 0) {
      user = existingUsers[0]
    } else {
      try {
        const uid = randomUUID()
        const userData = {
          id: uid,
          username: email,
          email: email,
          name: profile.name,
          emailVerified: false,
          avatarUrl: profile.avatar,
          role: 'user' as const,
          status: 'suspended' as const,
        }
        await repository.insert(userData)
        
        const createdUsers = await repository.findUser({ email })
        if (!createdUsers || createdUsers.length === 0) {
          return [failure(null, "Failed to retrieve created user"), 500]
        }
        user = createdUsers[0]
      } catch (e) {
        console.error("Failed to create user", e)
        return [failure(null, "Internal server error"), 500]
      }
    }

    try {
      const jwtToken = await generateToken({
        id: user.id,
        email: user.email || user.username,
        name: user.name,
        role: user.role,
        status: user.status
      }, jwtSecret)

      return [success({ user, token: jwtToken }, "Success to authenticate"), 200]
    } catch (e) {
      console.error("Failed to generate JWT", e)
      return [failure(null, "Failed to generate session"), 500]
    }
  }
}

export { CallbackService }
