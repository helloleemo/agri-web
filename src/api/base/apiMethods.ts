import { ApiError, type API_RESPONSE, type ApiErrorHolder, type RequestParams } from '../types/api'
import { getAccessToken } from '../utils'

type ValidationIssue = {
  type?: string
  loc?: Array<string | number>
  msg?: string
  ctx?: Record<string, unknown>
}

let globalApiErrorHandler: ApiErrorHolder | undefined

const setApiErrorHandler = (handler?: ApiErrorHolder) => {
  globalApiErrorHandler = handler
}

const getValidationMessage = (detail: unknown): string | null => {
  if (!Array.isArray(detail)) {
    return null
  }

  const issues = detail as ValidationIssue[]
  for (const issue of issues) {
    const field = issue.loc?.[1]

    if (field === 'password' && issue.type === 'string_too_short') {
      const minLength =
        typeof issue.ctx?.min_length === 'number' ? issue.ctx.min_length : String(issue.ctx?.min_length || '')
      return `密碼長度至少需要 ${minLength} 個字元。`
    }
  }

  if (issues.length > 0 && typeof issues[0]?.msg === 'string' && issues[0].msg.trim()) {
    return '輸入資料格式不正確，請檢查後再試。'
  }

  return null
}

const localizeAuthErrorMessage = (
  statusCode: string,
  status: number,
  message: string,
  detail: unknown,
): string => {
  if (
    statusCode === 'USER_INVALID_CREDENTIALS' ||
    /invalid email or password/i.test(message) ||
    (typeof detail === 'string' && /invalid email or password/i.test(detail))
  ) {
    return '帳號或密碼錯誤，請重新輸入。'
  }

  if (status === 422) {
    return getValidationMessage(detail) ?? '輸入資料格式不正確，請檢查後再試。'
  }

  return message
}

const createHeader = () => {
  const header: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  const bearer = getAccessToken()
  if (bearer) {
    header['Authorization'] = `Bearer ${bearer}`
  }
  return header
}

// response
export async function handleResponse<T>(res: Response): Promise<T> {
  // 204 - no content
  if (res.status === 204) {
    return undefined as T
  }

  // response - pasre json or text
  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')

  let payload: unknown
  if (isJson) {
    try {
      payload = await res.json()
    } catch {
      payload = null
    }
  } else {
    try {
      payload = await res.text()
    } catch {
      payload = null
    }
  }

  const json = payload as Partial<API_RESPONSE<T>> | null

  const statusCode =
    typeof json?.code === 'string'
      ? json.code
      : typeof json?.statusCode === 'string'
        ? json.statusCode
        : typeof json?.status_code === 'string'
          ? json.status_code
          : ''

  if (!res.ok) {
    // Only force logout when token/session is actually invalid.
    const shouldForceLogout =
      res.status === 401 &&
      (statusCode === 'UNAUTHORIZED' ||
        !statusCode ||
        (typeof json?.detail === 'string' && /token|expired|authentication/i.test(json.detail)))

    if (shouldForceLogout) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('authUser')
      window.location.href = '/#/'
      return undefined as T
    }

    const messageFromPayload =
      typeof json?.detail === 'string' && json.detail.trim()
        ? json.detail
        : typeof json?.message === 'string'
          ? json.message
        : typeof payload === 'string' && payload.trim()
          ? payload
          : `HTTP ${res.status}: ${res.statusText}`

    const localizedMessage = localizeAuthErrorMessage(
      statusCode,
      res.status,
      messageFromPayload,
      json?.detail,
    )

    const error = new ApiError(statusCode, localizedMessage, res.status, json?.detail)

    globalApiErrorHandler?.(error)

    throw error
  }

  // 200 + false
  if (json && typeof json.success === 'boolean' && !json.success) {
    const statusCode =
      typeof json.code === 'string'
        ? json.code
        : typeof json.statusCode === 'string'
          ? json.statusCode
          : typeof json.status_code === 'string'
            ? json.status_code
            : 'E000000'
    const message =
      typeof json.detail === 'string' && json.detail.trim()
        ? json.detail
        : typeof json.message === 'string'
          ? json.message
          : 'Unknown API error'
    const localizedMessage = localizeAuthErrorMessage(statusCode, res.status, message, json.detail)
    const error = new ApiError(statusCode, localizedMessage, res.status, json.detail)

    globalApiErrorHandler?.(error)

    throw error
  }

  // 200
  if (json && 'data' in json) {
    return json.data as T
  }

  return payload as T
}
//
const buildQueryString = (params?: RequestParams) => {
  if (!params) return ''
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((v) => query.append(key, String(v)))
      } else {
        query.append(key, String(value))
      }
    }
  })

  const queryString = query.toString()
  return queryString ? `?${queryString}` : ''
}

const request = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  baseUrl: string,
  endpoint: string,
  options?: {
    params?: RequestParams
    body?: unknown
  },
): Promise<T> => {
  const queryString = buildQueryString(options?.params)
  const url = `${baseUrl}${endpoint}${queryString}`

  const headers = createHeader()
  const hasBody = options?.body !== undefined && options?.body !== null

  const res = await fetch(url, {
    method,
    headers,
    body: hasBody ? JSON.stringify(options?.body) : undefined,
  })

  return handleResponse<T>(res)
}

// GET
const GET = async <T>(baseUrl: string, endpoint: string, params?: RequestParams): Promise<T> => {
  return request<T>('GET', baseUrl, endpoint, { params })
}

// POST
const POST = async <T>(
  baseUrl: string,
  endpoint: string,
  body?: unknown,
  params?: RequestParams,
): Promise<T> => {
  return request<T>('POST', baseUrl, endpoint, { params, body })
}

// PUT
const PUT = async <T>(
  baseUrl: string,
  endpoint: string,
  body?: unknown,
  params?: RequestParams,
): Promise<T> => {
  return request<T>('PUT', baseUrl, endpoint, { params, body })
}

// PATCH
const PATCH = async <T>(
  baseUrl: string,
  endpoint: string,
  body?: unknown,
  params?: RequestParams,
): Promise<T> => {
  return request<T>('PATCH', baseUrl, endpoint, { params, body })
}

// DELETE
const DELETE = async <T>(
  baseUrl: string,
  endpoint: string,
  body?: unknown,
  params?: RequestParams,
): Promise<T> => {
  return request<T>('DELETE', baseUrl, endpoint, { params, body })
}

export { createHeader, setApiErrorHandler, GET, POST, PUT, PATCH, DELETE }
