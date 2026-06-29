import type { ContentfulStatusCode } from "hono/utils/http-status"
import type { APIResponse } from "../types/api"

type ServiceResponse<T> = [T, ContentfulStatusCode]

function success<T>(data: T, message: string) {
  return { error: false as const, message, data }
}

function failure<T>(details: T, message: string) {
  return { error: true as const, message, details }
}

function serviceResponse<ST = null, ET = null>(data: APIResponse<ST, ET>, status: ContentfulStatusCode = 200): ServiceResponse<APIResponse<ST, ET>> {
  return [data, status]
}

export { success, failure, serviceResponse }
export type { ServiceResponse }
