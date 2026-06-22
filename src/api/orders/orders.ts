import BASE_URL from '../base/apiBaseUrl'
import { API_ENDPOINT } from '../base/apiEndpoint'
import { DELETE, GET, PATCH, POST } from '../base/apiMethods'
import type { PaginationParams } from '../types/shared'
import type {
  OrderBankTransferLast5Payload,
  OrderCreatePayload,
  OrderResponse,
  OrderUpdatePayload,
} from '../types/order'

interface DeletedData {
  id: string
}

export const ordersService = {
  getList: async (params?: PaginationParams) => {
    return GET<OrderResponse[]>(BASE_URL, API_ENDPOINT.ORDERS, params)
  },
  queryByOrderNoAndEmail: async (orderNo: string, email: string) => {
    return GET<OrderResponse>(BASE_URL, API_ENDPOINT.ORDERS_QUERY, {
      order_no: orderNo,
      email,
    })
  },
  getById: async (id: string) => {
    return GET<OrderResponse>(BASE_URL, API_ENDPOINT.ORDERS_ID(id))
  },
  create: async (payload: OrderCreatePayload) => {
    return POST<OrderResponse>(BASE_URL, API_ENDPOINT.ORDERS, payload)
  },
  update: async (id: string, payload: OrderUpdatePayload) => {
    return PATCH<OrderResponse>(BASE_URL, API_ENDPOINT.ORDERS_ID(id), payload)
  },
  delete: async (id: string) => {
    return DELETE<DeletedData>(BASE_URL, API_ENDPOINT.ORDERS_ID(id))
  },
  cancel: async (id: string) => {
    return PATCH<OrderResponse>(BASE_URL, API_ENDPOINT.ORDERS_CANCEL(id))
  },
  submitBankTransferLast5: async (id: string, payload: OrderBankTransferLast5Payload) => {
    return PATCH<OrderResponse>(BASE_URL, API_ENDPOINT.ORDERS_BANK_TRANSFER_LAST5(id), payload)
  },
}
