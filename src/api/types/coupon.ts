import type { StatusCode } from './shared'

export type CouponDiscountType = 1 | 2

export interface CouponResponse {
  id: string
  code: string
  name: string
  discount_type: CouponDiscountType
  discount_value: number
  min_order_amount: number | null
  max_discount_amount: number | null
  usage_limit: number | null
  starts_at: string | null
  ends_at: string | null
  status_code: StatusCode
  used_count: number
  created_at: string
  updated_at: string
}