export { authService } from './auth'
export { productService } from './product'
export { couponsService } from './coupons'
export { usersService } from './users'
export { ordersService } from './orders'
export { categoriesService } from './categories'
export { imagesService } from './images'

export { API_ENDPOINT } from './base/apiEndpoint'
export { setApiErrorHandler } from './base/apiMethods'

export type { API_RESPONSE, RequestParams } from './types/api'
export type {
	LoginRequest,
	RegisterRequest,
	RegisterResponse,
	LoginResponse,
	AuthUser,
	TokenResponse,
	VerifyEmailRequest,
	VerifyEmailResponse,
	ResendVerificationEmailRequest,
} from './types/auth'
export type { ProductResponse, ProductCreatePayload, ProductUpdatePayload } from './types/product'
export type { CouponResponse } from './types/coupon'
export type { UserResponse, UserCreatePayload, UserUpdatePayload } from './types/user'
export type {
	OrderResponse,
	OrderCreatePayload,
	OrderUpdatePayload,
	OrderBankTransferLast5Payload,
} from './types/order'
export type { CategoryResponse, CategoryCreatePayload, CategoryUpdatePayload } from './types/category'
export type { ImageResponse, CreateImagePayload, ImageUpdatePayload } from './types/image'
export type { StatusCode, RoleCode, PaginationParams } from './types/shared'
