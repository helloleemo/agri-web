import BASE_URL from '../base/apiBaseUrl'
import { API_ENDPOINT } from '../base/apiEndpoint'
import { GET, PUT } from '../base/apiMethods'

export interface CartItemInput {
  product_id: string
  unit_id: string | null
  quantity: number
}

export interface CartItemResponse {
  id: string
  product_id: string
  unit_id: string | null
  quantity: number
  product_name: string | null
  unit_name: string | null
  unit_price: number | null
  image_url: string | null
}

export interface CartResponse {
  id: string
  items: CartItemResponse[]
}

export const cartService = {
  getCart: async () => {
    return GET<CartResponse>(BASE_URL, API_ENDPOINT.CART)
  },
  syncCart: async (items: CartItemInput[]) => {
    return PUT<CartResponse>(BASE_URL, API_ENDPOINT.CART, {
      items,
    })
  },
}
