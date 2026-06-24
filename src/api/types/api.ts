interface API_RESPONSE<T> {
  success: boolean
  message: string
  code?: string
  statusCode?: string
  status_code?: string
  detail?: unknown
  data?: T
}

export class ApiError extends Error {
  public statusCode: string
  public message: string
  public status?: number
  public detail?: unknown

  constructor(statusCode: string, message: string, status?: number, detail?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.message = message
    this.status = status
    this.detail = detail
  }
}

type ApiErrorHolder = (error: ApiError) => void
type RequestParams = Record<string, unknown>
export type { ApiErrorHolder, API_RESPONSE, RequestParams }
