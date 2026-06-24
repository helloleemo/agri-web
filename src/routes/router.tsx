import { createHashRouter, Navigate } from 'react-router-dom'
import NotFoundPage from '@/pages/NotFoundPage'
// import Index from "../pages/Index";
import PATHS from '@/routes/paths'
import ProductsListPage from '@/pages/$mekarang/$products/ProductsListPage'
import { productsListLoader } from '@/pages/$mekarang/$products/productsListLoader'
import Layout from '@/pages/$mekarang'
import ProductInfoPage from '@/pages/$mekarang/$products/[id]/ProductInfoPage'
import OrdersListPage from '@/pages/$mekarang/$orders/OrdersListPage'
import OrdersInfoPage from '@/pages/$mekarang/$orders/$info/OrdersInfoPage'
import OrdersPaymentPage from '@/pages/$mekarang/$orders/$payment/OrdersPaymentPage'
import OrdersCompletePage from '@/pages/$mekarang/$orders/$complete/OrdersCompletePage'
import OrdersQueryPage from '@/pages/$mekarang/$orders/OrdersQueryPage'
import OrdersHistoryPage from '@/pages/$mekarang/OrdersHistoryPage'
import ChangePasswordPage from '@/pages/$mekarang/ChangePasswordPage'
import LoginPage from '@/pages/$auth/$login/LoginPage'
import RegisterPage from '../pages/$auth/$register/RegisterPage'
import VerifyEmailPage from '../pages/$auth/$verify-email/VerifyEmailPage'
import ResendVerificationEmailPage from '../pages/$auth/$resend-verification-email/ResendVerificationEmailPage'
import ForgotPasswordPage from '../pages/$auth/$forgot-password/ForgotPasswordPage'
import ResetPasswordPage from '../pages/$auth/$reset-password/ResetPasswordPage'
import MainPage from '@/pages/$index/MainPage'

const router = createHashRouter([
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
      {
        path: PATHS.auth.register,
        element: <RegisterPage />,
      },
      {
        path: PATHS.auth.verifyEmail,
        element: <VerifyEmailPage />,
      },
      {
        path: PATHS.auth.resendVerificationEmail,
        element: <ResendVerificationEmailPage />,
      },
      {
        path: PATHS.auth.forgotPassword,
        element: <ForgotPasswordPage />,
      },
      {
        path: PATHS.auth.resetPassword,
        element: <ResetPasswordPage />,
      },
    ],
  },
  {
    path: `${PATHS.mekarang.root}/${PATHS.mekarang.orders.query}`,
    element: <OrdersQueryPage />,
  },
  {
    path: PATHS.mekarang.root,
    element: <Layout />,
    children: [
      {
        path: PATHS.mekarang.orders.detail,
        element: <OrdersCompletePage />,
      },
      {
        path: PATHS.mekarang.products.root,
        element: <ProductsListPage />,
        loader: productsListLoader,
      },
      {
        path: PATHS.mekarang.products.detail,
        element: <ProductInfoPage />,
      },
      {
        path: PATHS.mekarang.orders.root,
        element: <OrdersListPage />,
      },
      {
        path: PATHS.mekarang.orders.info,
        element: <OrdersInfoPage />,
      },
      {
        path: PATHS.mekarang.orders.payment,
        element: <OrdersPaymentPage />,
      },
      {
        path: PATHS.mekarang.orders.complete,
        element: <OrdersCompletePage />,
      },
      {
        path: PATHS.mekarang.orders.history,
        element: <OrdersHistoryPage />,
      },
      {
        path: PATHS.mekarang.account.changePassword,
        element: <ChangePasswordPage />,
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
