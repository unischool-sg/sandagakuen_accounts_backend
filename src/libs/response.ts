import type { ContentfulStatusCode } from "hono/utils/http-status"

type ServiceResponse<T> = [T, ContentfulStatusCode]

function success<T>(data: T, message: string) {
  return { error: false as const, message, data }
}

function failure<T>(details: T, message: string) {
  return { error: true as const, message, details }
}

export { success, failure }
export type { ServiceResponse }
