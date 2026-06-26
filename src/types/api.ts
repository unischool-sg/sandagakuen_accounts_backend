type BaseResponse = {
  message: string
}

type SuccessResponse<T = null> = {
  error: false
  data: T
}

type ErrorResponse<T = null> = {
  error: true,
  details: T
}

type APIResponse = BaseResponse & (
  SuccessResponse | ErrorResponse
)

export type { BaseResponse, SuccessResponse, ErrorResponse }
export type { APIResponse }
