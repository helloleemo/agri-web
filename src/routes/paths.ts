const PATHS = {
  root: '/',
  auth: {
    root: 'auth',
    login: 'login',
    register: 'register',
  },
  mekarang: {
    root: 'mekarang',
    products: {
      root: 'products',
      detail: 'products/:id',
    },
    orders: {
      root: 'orders',
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
