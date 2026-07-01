import { Google } from "google-oauth-lib"
import { serviceResponse, success, failure } from "../../../libs/response"
class OAuthService {
  static show(client: Google, baseUrl: string) {
    try {
      const url = client.oauth.url({
        response_type: "code",
        redirect_uri: baseUrl + "/oauth/callback",
        access_type: "offline",
        prompt: "consent"
      })
      return serviceResponse(success({
        url
      }, "Success to create url"), 201)
    } catch {
      return serviceResponse(failure(null, "Failed to get url"), 500)
    }
  }
}

export { OAuthService }
