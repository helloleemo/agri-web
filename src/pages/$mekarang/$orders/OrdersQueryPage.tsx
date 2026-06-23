import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ordersService, siteContentService, type HomePageContent } from '@/api'
import Header from '@/components/layout/Header'
import PATHS from '@/routes/paths'

const HOME_PAGE_KEY = 'home'
const defaultHeroImage =
  'https://images.unsplash.com/photo-1471194402529-8e0f5a675de6?auto=format&fit=crop&w=1800&q=80'
const defaultDescription =
  '輸入你的訂單編號與 Email，立即查看付款狀態、配送進度與收件資訊。若你剛完成下單，也可以在這裡快速追蹤最新處理狀態。'

const OrdersQueryPage = () => {
  const navigate = useNavigate()
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [orderNumberError, setOrderNumberError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [description, setDescription] = useState(defaultDescription)
  const [heroImage, setHeroImage] = useState(defaultHeroImage)

  useEffect(() => {
    const loadOrdersQueryContent = async () => {
      try {
        const data = await siteContentService.getPublicByPageKey<HomePageContent>(HOME_PAGE_KEY)
        const managedDescription = data.content_data?.orders_query?.description?.trim()
        const managedImage = data.content_data?.orders_query?.image_url?.trim()

        if (managedDescription) {
          setDescription(managedDescription)
        }
        if (managedImage) {
          setHeroImage(managedImage)
        }
      } catch {
        // Keep fallback content when API is unavailable.
      }
    }

    void loadOrdersQueryContent()
  }, [])

  const validate = (trimmedOrderNo: string, trimmedEmail: string) => {
    let valid = true

    if (!trimmedOrderNo) {
      setOrderNumberError('請輸入訂單編號')
      valid = false
    } else {
      setOrderNumberError('')
    }

    if (!trimmedEmail) {
      setEmailError('請輸入 Email')
      valid = false
    } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setEmailError('Email 格式不正確')
      valid = false
    } else {
      setEmailError('')
    }

    return valid
  }

  const onSubmit = async () => {
    if (isSubmitting) {
      return
    }

    const trimmedOrderNo = orderNumber.trim()
    const trimmedEmail = email.trim().toLowerCase()
    const isValid = validate(trimmedOrderNo, trimmedEmail)

    if (!isValid) {
      return
    }

    setSubmitError('')
    setIsSubmitting(true)

    try {
      const order = await ordersService.queryByOrderNoAndEmail(trimmedOrderNo, trimmedEmail)

      navigate(`/${PATHS.mekarang.root}/${PATHS.mekarang.orders.root}/${order.id}`, {
        state: { queriedOrder: order },
      })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '訂單查詢失敗，請稍後再試')
    } finally {
      setIsSubmitting(false)
    }
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

            <Typography sx={{ color: 'text.secondary', lineHeight: 1.9 }}>{description}</Typography>

            <Stack spacing={1.2}>
              <TextField
                fullWidth
                size="small"
                placeholder="請輸入訂單編號"
                value={orderNumber}
                onChange={(event) => setOrderNumber(event.target.value)}
                error={Boolean(orderNumberError)}
                helperText={orderNumberError || ''}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    void onSubmit()
                  }
                }}
              />
              <TextField
                fullWidth
                size="small"
                type="email"
                placeholder="請輸入下單 Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                error={Boolean(emailError)}
                helperText={emailError || '請輸入訂購時使用的Email'}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    void onSubmit()
                  }
                }}
              />
              {submitError && (
                <Typography sx={{ color: 'error.main', fontSize: '0.85rem' }}>
                  {submitError}
                </Typography>
              )}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  sx={{ minWidth: 96, height: 40 }}
                  onClick={() => {
                    void onSubmit()
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '查詢中...' : '查詢'}
                </Button>
              </Stack>
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
