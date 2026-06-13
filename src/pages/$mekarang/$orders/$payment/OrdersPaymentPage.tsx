import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import { Box, Breadcrumbs, Button, Container, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import type { OrderCreatePayload } from '@/api'
import { ordersService } from '@/api'
import { useCart } from '@/contexts/CartContext'
import { useAppSnackbar } from '@/contexts/SnackbarContext'
import PATHS from '@/routes/paths'
import {
  clearCheckoutDraft,
  readCheckoutDraft,
  toDeliveryMethodCode,
  toPaymentMethodCode,
} from '../checkoutDraft'

const formatter = new Intl.NumberFormat('zh-TW')
const UUID_PREFIX_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i

const extractProductId = (cartItemId: string): string | null => {
  const match = cartItemId.match(UUID_PREFIX_PATTERN)
  return match ? match[0] : null
}

const OrdersPaymentPage = () => {
  const navigate = useNavigate()
  const { items, clearCart } = useCart()
  const { showSnackbar } = useAppSnackbar()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const checkoutDraft = readCheckoutDraft()

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items],
  )

  const createOrderPayload = (): OrderCreatePayload => {
    const mappedItems = items.map((item) => {
      const productId = extractProductId(item.id)
      if (!productId) {
        throw new Error(`購物車商品識別格式錯誤：${item.name}`)
      }

      return {
        product_id: productId,
        unit: item.unit,
        quantity: item.quantity,
      }
    })

    return {
      customer_email: checkoutDraft.buyer.email.trim().toLowerCase(),
      customer_name: checkoutDraft.receiver.name.trim() || null,
      address: checkoutDraft.receiver.address.trim() || null,
      coupon_code: checkoutDraft.couponCode.trim() || null,
      delivery_method: toDeliveryMethodCode(checkoutDraft.receiver.shippingMethod),
      payment_method: toPaymentMethodCode(checkoutDraft.receiver.paymentMethod),
      orderer_name: checkoutDraft.buyer.name.trim() || null,
      orderer_phone: checkoutDraft.buyer.phone.trim() || null,
      orderer_email: checkoutDraft.buyer.email.trim().toLowerCase() || null,
      items: mappedItems,
    }
  }

  const submitOrder = async () => {
    if (isSubmitting) {
      return
    }
    if (!items.length) {
      setSubmitError('購物車目前沒有商品，請先選購商品')
      return
    }

    setSubmitError('')
    setIsSubmitting(true)

    try {
      const payload = createOrderPayload()
      const createdOrder = await ordersService.create(payload)

      clearCart()
      clearCheckoutDraft()
      showSnackbar(`訂單 ${createdOrder.order_no} 建立成功`, { severity: 'success' })

      navigate(`/${PATHS.mekarang.root}/${PATHS.mekarang.orders.complete}`, {
        state: { createdOrder },
      })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '建立訂單失敗，請稍後再試')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box component="main" sx={{ py: { xs: 5, md: 7 } }}>
      <Container maxWidth="lg">
        <Breadcrumbs sx={{ mb: 4, color: 'text.secondary', fontSize: '0.82rem' }}>
          <Typography
            component={RouterLink}
            to={`/${PATHS.root}`}
            sx={{ color: 'inherit', textDecoration: 'none' }}
          >
            首頁
          </Typography>
          <Typography
            component={RouterLink}
            to={`/${PATHS.mekarang.root}/${PATHS.mekarang.orders.root}`}
            sx={{ color: 'inherit', textDecoration: 'none' }}
          >
            購物車
          </Typography>
          <Typography color="text.primary">付款資料</Typography>
        </Breadcrumbs>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 8 }}>
          {[
            { icon: CalendarMonthRoundedIcon, title: '步驟一：確認商品', active: false },
            { icon: LocalShippingRoundedIcon, title: '步驟二：填寫資料', active: false },
            { icon: CheckCircleOutlineRoundedIcon, title: '步驟三：完成下單', active: true },
          ].map((step) => (
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
            </Stack>
          ))}
        </Stack>

        <Typography variant="h3" sx={{ mb: 2, fontSize: { xs: '1.45rem', md: '1.7rem' } }}>
          付款資料
        </Typography>

        <Stack
          spacing={1.1}
          sx={{
            py: 1,
            color: 'text.secondary',
            maxWidth: 700,
            lineHeight: 1.8,
          }}
        >
          <Typography>
            訂購人 Email：
            <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {checkoutDraft.buyer.email || '-'}
            </Typography>
          </Typography>
          <Typography>
            商品小計：
            <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              $ {formatter.format(subtotal)}
            </Typography>
          </Typography>
          <Typography>
            套用折扣碼：
            <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {checkoutDraft.couponCode || '未使用'}
            </Typography>
          </Typography>
          <Typography>
            配送方式：
            <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {checkoutDraft.receiver.shippingMethod}
            </Typography>
          </Typography>
          <Typography>
            付款方式：
            <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {checkoutDraft.receiver.paymentMethod}
            </Typography>
          </Typography>
          <Typography>
            收件資訊：
            <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {checkoutDraft.receiver.name || '-'} / {checkoutDraft.receiver.phone || '-'} /{' '}
              {checkoutDraft.receiver.address || '-'}
            </Typography>
          </Typography>

          <Typography>
            一般戶名：
            <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Mekarang Fruits
            </Typography>
          </Typography>
          <Typography>
            銀行代號：
            <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              808 玉山銀行
            </Typography>
          </Typography>
          <Typography>
            分行：
            <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              民生分行
            </Typography>
          </Typography>
          <Typography>
            帳號：
            <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              0000-0000-0000-0000
            </Typography>
          </Typography>
          <Typography>
            戶名：
            <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              美卡榮有限公司
            </Typography>
          </Typography>

          <Typography sx={{ color: 'error.main', mt: 1 }}>
            匯款後請於 24 小時內回填末五碼，逾時系統將自動取消本筆訂單。
          </Typography>
          <Typography sx={{ color: 'error.main' }}>
            如使用 Line Pay，送出後可直接在下一頁查看付款與訂單狀態。
          </Typography>

          {submitError && <Typography sx={{ color: 'error.main' }}>{submitError}</Typography>}
        </Stack>

        <Box sx={{ mt: 8, borderTop: '1px solid', borderColor: 'grey.300' }} />

        <Stack direction="row" spacing={1.6} sx={{ justifyContent: 'flex-end', mt: 4 }}>
          <Button
            variant="outlined"
            color="inherit"
            component={RouterLink}
            to={`/${PATHS.mekarang.root}/${PATHS.mekarang.orders.info}`}
            sx={{ minWidth: 180 }}
          >
            返回上一步，修改資料
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              void submitOrder()
            }}
            disabled={isSubmitting || !items.length}
            sx={{ minWidth: 180 }}
          >
            {isSubmitting ? '送出中...' : '確認送出訂單'}
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}

export default OrdersPaymentPage
