import { useEffect } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const LoginPage = () => {
  const { openLoginDialog } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    openLoginDialog()

    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/', { replace: true })
  }, [navigate, openLoginDialog])

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <CircularProgress />
    </Box>
  )
}

export default LoginPage
