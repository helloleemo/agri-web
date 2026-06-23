export const API_ENDPOINT = {
  // auth
  TOKEN: '/auth/token',
  LOGIN: '/auth/login',
  GET_USER_INFO: '/auth/me',
  REGISTER: '/auth/register',
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION_EMAIL: '/auth/resend-verification-email',

  // products
  PRODUCTS: '/products',
  PRODUCTS_ID: (id: string) => `/products/${id}`,

  // coupons
  COUPONS: '/coupons',
  COUPONS_ID: (id: string) => `/coupons/${id}`,

  // users
  USERS: '/users',
  USERS_ID: (id: string) => `/users/${id}`,
  USERS_CHANGE_PASSWORD: (id: string) => `/users/${id}/password`,

  // orders
  ORDERS: '/orders',
  ORDERS_QUERY: '/orders/query',
  ORDERS_ID: (id: string) => `/orders/${id}`,
  ORDERS_CANCEL: (id: string) => `/orders/${id}/cancel`,
  ORDERS_BANK_TRANSFER_LAST5: (id: string) => `/orders/${id}/bank-transfer-last5`,

  // cart
  CART: '/cart',

  // categories
  CATEGORIES: '/categories',
  CATEGORIES_ID: (id: string) => `/categories/${id}`,

  // images
  IMAGES_PRODUCT_ID: (productId: string) => `/images/${productId}`,
  IMAGES_ID: (imageId: string) => `/images/${imageId}`,

  // site content
  PUBLIC_SITE_CONTENTS_BY_PAGE: (pageKey: string) => `/public/site-contents/${pageKey}`,
}
