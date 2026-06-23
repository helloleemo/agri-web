import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import PATHS from '@/routes/paths'
import { clearCheckoutDraft, readCheckoutDraft, writeCheckoutDraft } from './checkoutDraft'

const formatter = new Intl.NumberFormat('zh-TW')

const OrdersListPage = () => {
  const { items, totalQuantity, updateItemQuantity, removeItem, clearCart } = useCart()
  const [couponInput, setCouponInput] = useState(() => readCheckoutDraft().couponCode)
  const [appliedCoupon, setAppliedCoupon] = useState(() => readCheckoutDraft().couponCode)

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items],
  )

  const grandTotal = subtotal

  useEffect(() => {
    const draft = readCheckoutDraft()
    writeCheckoutDraft({
      ...draft,
      couponCode: appliedCoupon,
    })
  }, [appliedCoupon])

  const clearCartAndCoupon = () => {
    clearCart()
    setCouponInput('')
    setAppliedCoupon('')
    clearCheckoutDraft()
  }

  const applyCoupon = () => {
    const normalizedCoupon = couponInput.trim().toUpperCase()
    setCouponInput(normalizedCoupon)
    setAppliedCoupon(normalizedCoupon)
  }

  return (
    <Box component="main" sx={{ py: { xs: 5, md: 7 } }}>
      <Container maxWidth="lg">
        <Breadcrumbs sx={{ mb: 4, color: 'text.secondary', fontSize: '0.82rem' }}>
          <Typography
            component={RouterLink}
            to={PATHS.root}
            sx={{ color: 'inherit', textDecoration: 'none' }}
          >
            首頁
          </Typography>
          <Typography
            component={RouterLink}
            to={`/${PATHS.mekarang.root}/${PATHS.mekarang.products.root}`}
            sx={{ color: 'inherit', textDecoration: 'none' }}
          >
            常規農產品
          </Typography>
          <Typography color="text.primary">購物車</Typography>
        </Breadcrumbs>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 8 }}>
          {[
            { icon: CalendarMonthRoundedIcon, title: '步驟一：確認商品', active: true },
            { icon: LocalShippingRoundedIcon, title: '步驟二：填寫資料', active: false },
            { icon: CheckCircleOutlineRoundedIcon, title: '步驟三：完成下單', active: false },
          ].map((step, index) => (
            <Stack
              key={step.title}
              direction="row"
              spacing={1.2}
              sx={{
                flex: 1,
                alignItems: 'center',
                pb: 1.5,
                borderBottom: '2px solid',
                borderColor: step.active ? 'secondary.main' : 'grey.300',
                color: step.active ? 'secondary.main' : 'grey.500',
              }}
            >
              <step.icon fontSize="small" />
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>{step.title}</Typography>
              {index < 2 && (
                <Box
                  sx={{
                    display: { xs: 'none', md: 'block' },
                    ml: 'auto',
                    mr: -1,
                    width: 12,
                    height: 1,
                    bgcolor: 'transparent',
                  }}
                />
              )}
            </Stack>
          ))}
        </Stack>

        <Typography variant="h3" sx={{ mb: 3, fontSize: { xs: '1.4rem', md: '1.7rem' } }}>
          購物車內容
        </Typography>

        <Stack
          direction="row"
          sx={{
            px: 1,
            pb: 1,
            borderBottom: '1px solid',
            borderColor: 'grey.300',
            color: 'text.secondary',
            fontSize: '0.82rem',
            display: { xs: 'none', md: 'flex' },
          }}
        >
          <Box sx={{ flex: 1.6 }}>商品</Box>
          <Box sx={{ width: 160, textAlign: 'center' }}>數量</Box>
          <Box sx={{ width: 160, textAlign: 'right' }}>價格</Box>
        </Stack>

        <Stack spacing={2.5} sx={{ mt: 2.5 }}>
          {items.map((item) => {
            const lineTotal = item.unitPrice * item.quantity

            return (
              <Stack
                key={item.id}
                direction={{ xs: 'column', md: 'row' }}
                spacing={2.5}
                sx={{
                  alignItems: { md: 'center' },
                  py: 2,
                  borderBottom: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <Stack direction="row" spacing={2} sx={{ flex: 1.6, minWidth: 0 }}>
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{
                      width: { xs: 120, md: 140 },
                      height: { xs: 88, md: 104 },
                      objectFit: 'cover',
                      borderRadius: 2,
                      bgcolor: 'grey.200',
                      flexShrink: 0,
                    }}
                  />
                  <Stack sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.05rem' }}>
                      {item.name}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', mt: 0.6, fontSize: '0.9rem' }}>
                      {item.description}
                    </Typography>
                    <Typography sx={{ color: 'grey.600', mt: 0.4, fontSize: '0.84rem' }}>
                      單位：{item.unit}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack
                  direction="row"
                  spacing={0.6}
                  sx={{
                    width: { xs: '100%', md: 160 },
                    justifyContent: { xs: 'flex-start', md: 'center' },
                    alignItems: 'center',
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                    sx={{ border: '1px solid', borderColor: 'grey.300', borderRadius: 1.5 }}
                  >
                    <Typography sx={{ fontWeight: 700, lineHeight: 1 }}>-</Typography>
                  </IconButton>
                  <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 700 }}>
                    {item.quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                    sx={{ border: '1px solid', borderColor: 'grey.300', borderRadius: 1.5 }}
                  >
                    <Typography sx={{ fontWeight: 700, lineHeight: 1 }}>+</Typography>
                  </IconButton>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1.4}
                  sx={{
                    width: { xs: '100%', md: 160 },
                    justifyContent: { xs: 'space-between', md: 'flex-end' },
                    alignItems: 'center',
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }}>$ {formatter.format(lineTotal)}</Typography>
                  <Button
                    variant="text"
                    color="inherit"
                    onClick={() => removeItem(item.id)}
                    sx={{ color: 'grey.500', minWidth: 'auto', px: 0.5 }}
                  >
                    移除
                  </Button>
                </Stack>
              </Stack>
            )
          })}

          {items.length === 0 && (
            <Box
              sx={{
                py: 6,
                border: '1px dashed',
                borderColor: 'grey.300',
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Typography sx={{ color: 'text.secondary', mb: 2 }}>目前購物車沒有商品</Typography>
              <Button
                variant="contained"
                component={RouterLink}
                to={`/${PATHS.mekarang.root}/${PATHS.mekarang.products.root}`}
              >
                前往選購
              </Button>
            </Box>
          )}
        </Stack>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ mt: 4, justifyContent: 'space-between', alignItems: { md: 'center' } }}
        >
          <Stack direction="row" spacing={1.2} sx={{ width: { xs: '100%', md: 480 } }}>
            <TextField
              fullWidth
              size="small"
              placeholder="折扣碼"
              value={couponInput}
              onChange={(event) => setCouponInput(event.target.value)}
              helperText="折扣金額將在建立訂單時由系統驗證並計算"
            />
            <Button variant="outlined" onClick={applyCoupon} sx={{ minWidth: 96 }}>
              確認
            </Button>
          </Stack>
          <Stack sx={{ minWidth: { md: 320 }, ml: { md: 'auto' } }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', py: 0.8 }}>
              <Typography color="text.secondary">小計</Typography>
              <Typography>$ {formatter.format(subtotal)}</Typography>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: 'space-between', py: 0.8 }}>
              <Typography color="text.secondary">折扣</Typography>
              <Typography color="text.secondary">送出訂單後計算</Typography>
            </Stack>
            <Stack
              direction="row"
              sx={{
                justifyContent: 'space-between',
                py: 1.2,
                mt: 0.6,
                borderTop: '1px solid',
                borderColor: 'grey.300',
              }}
            >
              <Typography sx={{ fontWeight: 800 }}>總計（{totalQuantity} 件）</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.2rem' }}>
                $ {formatter.format(grandTotal)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1.6} sx={{ justifyContent: 'flex-end', mt: 4 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={clearCartAndCoupon}
            sx={{ minWidth: 130 }}
          >
            清空
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={items.length === 0}
            component={RouterLink}
            to={`/${PATHS.mekarang.root}/${PATHS.mekarang.orders.info}`}
            onClick={applyCoupon}
            sx={{ minWidth: 220 }}
          >
            確認，繼續填寫寄送資訊
          </Button>
        </Stack>

        {appliedCoupon && (
          <Typography
            sx={{ mt: 1.5, textAlign: 'right', color: 'success.main', fontSize: '0.9rem' }}
          >
            已套用折扣碼：{appliedCoupon}
          </Typography>
        )}
      </Container>
    </Box>
  )
}

export default OrdersListPage
