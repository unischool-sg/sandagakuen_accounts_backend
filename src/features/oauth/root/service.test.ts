import { describe, it, expect, vi } from "vitest"
import { Google } from "google-oauth-lib"
import { OAuthService } from "./service"

vi.mock("google-oauth-lib", () => {
  const mockUrl = vi.fn()
  const MockGoogle = {
    OAuth: vi.fn().mockImplementation(() => {
      return {
        oauth: {
          url: mockUrl,
        },
      }
    })
  }
  return { Google: MockGoogle }
})

describe("OAuthService", () => {
  it("calls client.oauth.url with the correct parameters", () => {
    const client = Google.OAuth({ clientId: "test", clientSecret: "test" })
    const mockUrl = client.oauth.url as ReturnType<typeof vi.fn>
    mockUrl.mockReturnValue("https://accounts.google.com/o/oauth2/v2/auth?client_id=test&response_type=code&redirect_uri=http://localhost:8787/oauth/callback&scope=openid+email+profile&access_type=offline&prompt=consent")

    const result = OAuthService.show(client, "http://localhost:8787")

    expect(mockUrl).toHaveBeenCalledWith({
      response_type: "code",
      redirect_uri: "http://localhost:8787/oauth/callback",
      access_type: "offline",
      prompt: "consent",
    })
    expect(result).toContain("response_type=code")
    expect(result).toContain("redirect_uri=http://localhost:8787/oauth/callback")
    expect(result).toContain("access_type=offline")
    expect(result).toContain("prompt=consent")
  })
})
