import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { RouterProvider } from 'react-router-dom'
import router from './routes/router'
import appTheme from './theme/appTheme'
import { CartProvider } from '@/contexts/CartContext'
import { SnackbarProvider } from '@/contexts/SnackbarContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <SnackbarProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </StrictMode>,
)
