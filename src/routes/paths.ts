const PATHS = {
  root: '/',
  auth: {
    root: 'auth',
    login: 'login',
    register: 'register',
    verifyEmail: 'verify-email',
    resendVerificationEmail: 'resend-verification-email',
  },
  mekarang: {
    root: 'mekarang',
    products: {
      root: 'products',
      detail: 'products/:id',
    },
    orders: {
      root: 'orders',
      query: 'orders/query',
      info: 'orders/info',
      payment: 'orders/payment',
      complete: 'orders/complete',
      detail: 'orders/:id',
    },
    stories: {
      root: 'stories',
      detail: 'stories/:id',
    },
  },

  notfound: '*',
} as const

export default PATHS
