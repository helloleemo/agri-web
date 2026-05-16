const PATHS = {
    root: "/",
    auth: {
        root: "auth",
        login: "login",
        register: "register",
    },
    megarang: {
        root: "megarang",
        products: {
            root: "products",
            detail: "products/:id",
        },
        orders: {
            root: "orders",
            detail: "orders/:id",
        },
    },

    notfound: "*",
} as const;

export default PATHS;