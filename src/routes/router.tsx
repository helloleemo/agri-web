import { createBrowserRouter, Navigate } from 'react-router-dom'
import NotFoundPage from '@/pages/NotFoundPage'
// import Index from "../pages/Index";
import PATHS from '@/routes/paths'
import ProductsListPage from '@/pages/$mekarang/$products/ProductsListPage'
import Layout from '@/pages/$mekarang'
import ProductInfoPage from '@/pages/$mekarang/$products/[id]/ProductInfoPage'
import LoginPage from '@/pages/$auth/$login/LoginPage'
import MainPage from '@/pages/$index/MainPage'

const router = createBrowserRouter([
  {
    path: PATHS.root,
    element: <MainPage />,
  },
  {
    path: PATHS.auth.root,
    children: [
      {
        path: PATHS.auth.login,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: PATHS.mekarang.root,
    element: <Layout />,
    children: [
      {
        path: PATHS.mekarang.products.root,
        element: <ProductsListPage />,
      },
      {
        path: PATHS.mekarang.products.detail,
        element: <ProductInfoPage />,
      },
      {
        index: true,
        element: <Navigate to={`${PATHS.mekarang.products.root}`} replace />,
      },
    ],
  },
  {
    path: PATHS.notfound,
    element: <NotFoundPage />,
  },
])

export default router
