import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import PATHS from '@/routes/paths'

const heroImage =
  'https://images.unsplash.com/photo-1471194402529-8e0f5a675de6?auto=format&fit=crop&w=1800&q=80'

const OrdersQueryPage = () => {
  const navigate = useNavigate()
  const [orderNumber, setOrderNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit = () => {
    const trimmed = orderNumber.trim()

    if (!trimmed) {
      setErrorMessage('請輸入訂單編號')
      return
    }

    setErrorMessage('')

    // Temporarily route to complete page. Replace with real lookup once backend query API is wired.
    navigate(`/${PATHS.mekarang.root}/${PATHS.mekarang.orders.complete}`)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F2F3F4' }}>
      <Header alwaysSolidBackground />

      <Stack direction={{ xs: 'column', md: 'row' }} sx={{ minHeight: '100vh' }}>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 3, md: 8 },
            pt: { xs: 14, md: 4 },
            pb: { xs: 8, md: 4 },
          }}
        >
          <Stack spacing={3} sx={{ width: '100%', maxWidth: 460 }}>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.78rem' }}>
              首頁 / 訂單查詢 / 單號查詢
            </Typography>

            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.4rem' } }}>
              訂單查詢
            </Typography>

            <Typography sx={{ color: 'text.secondary', lineHeight: 1.9 }}>
              輸入你的訂單編號，立即查看付款狀態、配送進度與收件資訊。
              若你剛完成下單，也可以在這裡快速追蹤最新處理狀態。
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
              <TextField
                fullWidth
                size="small"
                placeholder="請輸入訂單編號"
                value={orderNumber}
                onChange={(event) => setOrderNumber(event.target.value)}
                error={Boolean(errorMessage)}
                helperText={errorMessage || ''}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    onSubmit()
                  }
                }}
              />
              <Button
                variant="contained"
                color="secondary"
                size="small"
                sx={{ minWidth: 96, height: 40 }}
                onClick={onSubmit}
              >
                查詢
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: { xs: 320, md: '100vh' },
            backgroundImage: `linear-gradient(180deg, rgba(17, 24, 39, 0.15), rgba(17, 24, 39, 0.2)), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </Stack>
    </Box>
  )
}

export default OrdersQueryPage
