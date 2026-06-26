

type Config = {
  clientId: string
  clientSecret: string
  scopes?: string[]
  accessToken?: string
}

const BASE_ENDPOINT = "https://googleapis.com"

class GoogleAPIClient {
  private readonly clientId: string
  private readonly clientSecret: string
  private readonly scopes: string[]

  private accessToken?: string

  constructor(config: Config) {
    this.clientId = config.clientId
    this.clientSecret = config.clientSecret
    this.scopes = ['openid', 'profile', 'email'].concat(config.scopes ?? [])
    this.accessToken = config.accessToken

    if (!this.clientId || !this.clientSecret || this.scopes.length == 0) throw new Error('config is required')
  }

  private isAbsoluteUrl(url: string): boolean {
    return /^https?:\/\//i.test(url);
  }

  setAccessToken(token: string) {
    this.accessToken = token
  }

  async fetch(endpoint: string, options: RequestInit = {
    method: "GET",
  }): Promise<Response> {
    const url = this.isAbsoluteUrl(endpoint)
      ? endpoint
      : BASE_ENDPOINT + endpoint;
    const headers = {
      ...(this.accessToken ? { "Authorization": `Bearer ${this.accessToken}` } : {}),
      "Content-Type": "application/json",
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }
}

export { GoogleAPIClient }
export type { Config }
