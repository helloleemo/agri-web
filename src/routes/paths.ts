const PATHS = {
    root: "/",
    auth: {
        login: "/auth/login",
        register: "/auth/register",
    },
    mekarang: {
        root: "/mekarang",
        products: {
            root: "/mekarang/products",
            detail: "/mekarang/products/:id",
            product: (id: string) => `/mekarang/products/${id}`,
            create: "/mekarang/products/new",
            editPath: "/mekarang/products/:id/edit",
            edit: (id: string) => `/mekarang/products/${id}/edit`,
        },
        orders: {
            root: "/mekarang/orders",
            detail: "/mekarang/orders/:id",
            order: (id: string) => `/mekarang/orders/${id}`,
            create: "/mekarang/orders/new",
            editPath: "/mekarang/orders/:id/edit",
            edit: (id: string) => `/mekarang/orders/${id}/edit`,
        },
    },

    notfound: "*",
} as const;

export default PATHS;