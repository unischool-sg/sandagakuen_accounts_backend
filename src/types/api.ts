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

type APIResponse<ST = null, ET = null> = BaseResponse & (
  SuccessResponse<ST> | ErrorResponse<ET>
)

export type { BaseResponse, SuccessResponse, ErrorResponse }
export type { APIResponse }
