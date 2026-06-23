import BASE_URL from '../base/apiBaseUrl'
import { API_ENDPOINT } from '../base/apiEndpoint'
import { GET } from '../base/apiMethods'
import type { CouponResponse } from '../types/coupon'

export const couponsService = {
  getList: async () => {
    return GET<CouponResponse[]>(BASE_URL, API_ENDPOINT.COUPONS)
  },
}