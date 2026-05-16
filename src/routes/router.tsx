import { createBrowserRouter, Navigate } from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage";
import Index from "../pages/Index";
import PATHS from "./paths";
import ProductsListPage from "../pages/$megarang/$products/ProductsListPage";
import Layout from "../pages/$megarang";
import ProductInfoPage from "../pages/$megarang/$products/[id]/ProductInfoPage";

const router = createBrowserRouter([
    {
        path: PATHS.root,
        element: <Index />
    },
    {
        path: PATHS.megarang.root,
        element: <Layout />,
        children: [
            {
                path: PATHS.megarang.products.root,
                element: <ProductsListPage />

            },
            {
                path: PATHS.megarang.products.detail,
                element: <ProductInfoPage />
            },
            {
                index: true,
                element: <Navigate to={`${PATHS.megarang.products.root}`} replace />,
                    
            }
        ]
    },
    {
        path: PATHS.notfound, 
        element: <NotFoundPage />
    },
]);

export default router;
