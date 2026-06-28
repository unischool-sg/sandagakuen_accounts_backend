import { Google } from "google-oauth-lib"

class OAuthService {
  static show(client: Google, baseUrl: string) {
    return client.oauth.url({
      response_type: "code",
      redirect_uri: baseUrl + "/oauth/callback",
      access_type: "offline",
      prompt: "consent"
    })
  }
}

export { OAuthService }
