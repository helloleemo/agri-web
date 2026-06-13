export interface OrderItemCreatePayload {
  product_id: string
  unit: string
  quantity: number
}

export interface OrderItemUpdatePayload {
  product_id: string
  unit: string
  quantity: number
}

export interface OrderCreatePayload {
  user_id?: string | null
  customer_email: string
  customer_name?: string | null
  address?: string | null
  coupon_code?: string | null
  delivery_method?: number
  payment_method?: number
  orderer_name?: string | null
  orderer_phone?: string | null
  orderer_email?: string | null
  status_code?: number
  order_status_code?: number
  items: OrderItemCreatePayload[]
}

export interface OrderUpdatePayload {
  customer_email?: string
  customer_name?: string | null
  address?: string | null
  delivery_method?: number
  payment_method?: number
  orderer_name?: string | null
  orderer_phone?: string | null
  orderer_email?: string | null
  status_code?: number
  order_status_code?: number
  items?: OrderItemUpdatePayload[]
}

export interface OrderItemResponse {
  id: string
  order_id: string
  product_id: string
  product_name: string | null
  unit: string | null
  quantity: number
}

export interface OrderResponse {
  id: string
  order_no: string
  user_id: string
  user_name: string | null
  customer_email: string
  customer_name: string | null
  address: string | null
  coupon_code: string | null
  delivery_method: number
  payment_method: number
  orderer_name: string | null
  orderer_phone: string | null
  orderer_email: string | null
  subtotal_amount: number
  discount_amount: number
  total_amount: number
  status_code: number
  order_status_code: number
  order_status_name: string | null
  delivery_method_label: string | null
  payment_method_label: string | null
  created_at: string
  updated_at: string
  items: OrderItemResponse[]
}
