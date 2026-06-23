import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import { Box, Breadcrumbs, Button, Container, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import type { CouponResponse, OrderCreatePayload } from '@/api'
import { couponsService, ordersService } from '@/api'
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

const toSafeNumber = (value: unknown): number => {
  const nextValue = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(nextValue) ? nextValue : 0
}

const toOptionalNumber = (value: unknown): number | null => {
  return value == null ? null : toSafeNumber(value)
}

const extractProductId = (cartItemId: string): string | null => {
  const match = cartItemId.match(UUID_PREFIX_PATTERN)
  return match ? match[0] : null
}

const extractUnitId = (cartItemId: string): string | null => {
  const matches = cartItemId.match(
    /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi,
  )
  if (!matches || matches.length < 2) {
    return null
  }
  return matches[1]
}

const calculateCouponDiscount = (coupon: CouponResponse, subtotalAmount: number): number => {
  const now = new Date()
  const startsAt = coupon.starts_at ? new Date(coupon.starts_at) : null
  const endsAt = coupon.ends_at ? new Date(coupon.ends_at) : null
  const statusCode = toSafeNumber(coupon.status_code)
  const discountType = toSafeNumber(coupon.discount_type)
  const discountValue = toSafeNumber(coupon.discount_value)
  const minOrderAmount = toOptionalNumber(coupon.min_order_amount)
  const maxDiscountAmount = toOptionalNumber(coupon.max_discount_amount)
  const usageLimit = toOptionalNumber(coupon.usage_limit)
  const usedCount = toSafeNumber(coupon.used_count)

  if (statusCode !== 1) return 0
  if (startsAt && startsAt > now) return 0
  if (endsAt && endsAt < now) return 0
  if (usageLimit !== null && usedCount >= usageLimit) return 0
  if (minOrderAmount !== null && subtotalAmount < minOrderAmount) return 0

  let discountAmount = 0

  if (discountType === 1) {
    discountAmount = discountValue
  } else if (discountType === 2) {
    discountAmount = Math.floor((subtotalAmount * discountValue) / 100)
  }

  if (maxDiscountAmount !== null) {
    discountAmount = Math.min(discountAmount, maxDiscountAmount)
  }

  return Math.max(0, Math.min(discountAmount, subtotalAmount))
}

const getCouponValidationError = (
  coupon: CouponResponse,
  subtotalAmount: number,
): string | null => {
  const now = new Date()
  const startsAt = coupon.starts_at ? new Date(coupon.starts_at) : null
  const endsAt = coupon.ends_at ? new Date(coupon.ends_at) : null
  const statusCode = toSafeNumber(coupon.status_code)
  const minOrderAmount = toOptionalNumber(coupon.min_order_amount)
  const usageLimit = toOptionalNumber(coupon.usage_limit)
  const usedCount = toSafeNumber(coupon.used_count)
  const couponCode = coupon.code.toUpperCase()

  if (statusCode !== 1) return `折扣碼 ${couponCode} 目前已停用`
  if (startsAt && startsAt > now) return `折扣碼 ${couponCode} 尚未開始使用`
  if (endsAt && endsAt < now) return `折扣碼 ${couponCode} 已過期`
  if (usageLimit !== null && usedCount >= usageLimit) {
    return `折扣碼 ${couponCode} 已達使用上限`
  }
  if (minOrderAmount !== null && subtotalAmount < minOrderAmount) {
    return `折扣碼 ${couponCode} 未達最低消費 $${formatter.format(minOrderAmount)}`
  }

  return null
}

const OrdersPaymentPage = () => {
  const navigate = useNavigate()
  const { items, clearCart } = useCart()
  const { showSnackbar } = useAppSnackbar()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0)
  const [couponValidationError, setCouponValidationError] = useState('')
  const checkoutDraft = readCheckoutDraft()
  const appliedCouponCode = checkoutDraft.couponCode.trim().toUpperCase()

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items],
  )
  const shippingFee = checkoutDraft.receiver.shippingMethod === '宅配' ? 120 : 0
  const totalAmount = Math.max(0, subtotal - couponDiscountAmount + shippingFee)

  useEffect(() => {
    let isMounted = true

    const loadCouponDiscount = async () => {
      if (!appliedCouponCode) {
        if (isMounted) {
          setCouponDiscountAmount(0)
          setCouponValidationError('')
        }
        return
      }

      try {
        const coupons = await couponsService.getList()
        const coupon = coupons.find((item) => item.code.toUpperCase() === appliedCouponCode)

        if (!coupon) {
          if (isMounted) {
            setCouponDiscountAmount(0)
            setCouponValidationError(`找不到折扣碼 ${appliedCouponCode}`)
          }
          return
        }

        const validationError = getCouponValidationError(coupon, subtotal)

        if (validationError) {
          if (isMounted) {
            setCouponDiscountAmount(0)
            setCouponValidationError(validationError)
          }
          return
        }

        if (isMounted) {
          setCouponDiscountAmount(calculateCouponDiscount(coupon, subtotal))
          setCouponValidationError('')
        }
      } catch (error) {
        if (isMounted) {
          setCouponDiscountAmount(0)
          setCouponValidationError(error instanceof Error ? error.message : '折扣碼驗證失敗')
        }
      }
    }

    void loadCouponDiscount()

    return () => {
      isMounted = false
    }
  }, [appliedCouponCode, subtotal])

  const createOrderPayload = (): OrderCreatePayload => {
    const mappedItems = items.map((item) => {
      const productId = extractProductId(item.id)
      const unitId = item.unit_id || extractUnitId(item.id)
      if (!productId) {
        throw new Error(`購物車商品識別格式錯誤：${item.name}`)
      }
      if (!unitId) {
        throw new Error(`購物車商品規格識別格式錯誤：${item.name}`)
      }

      return {
        product_id: productId,
        unit_id: unitId,
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

      navigate(`/${PATHS.mekarang.root}/${PATHS.mekarang.orders.root}/${createdOrder.id}`, {
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
            to={PATHS.root}
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

        <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', mb: 1.2 }}>商品明細</Typography>
        <Stack
          spacing={1.2}
          sx={{
            mb: 3,
            p: 2,
            border: '1px solid',
            borderColor: 'grey.300',
            borderRadius: 2,
          }}
        >
          {items.length ? (
            items.map((item) => {
              const lineTotal = item.unitPrice * item.quantity

              return (
                <Stack
                  key={item.id}
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={0.8}
                  sx={{
                    justifyContent: 'space-between',
                    py: 1,
                    borderBottom: '1px solid',
                    borderColor: 'grey.200',
                    '&:last-of-type': { borderBottom: 'none', pb: 0 },
                  }}
                >
                  <Stack spacing={0.4} sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {item.name}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.88rem' }}>
                      規格：{item.unit}
                    </Typography>
                  </Stack>
                  <Typography
                    sx={{ color: 'text.secondary', fontSize: '0.9rem', textAlign: 'right' }}
                  >
                    {item.quantity} x $ {formatter.format(item.unitPrice)} = ${' '}
                    {formatter.format(lineTotal)}
                  </Typography>
                </Stack>
              )
            })
          ) : (
            <Typography sx={{ color: 'text.secondary' }}>目前沒有商品</Typography>
          )}
        </Stack>

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
            折扣：
            <Typography
              component="span"
              sx={{
                fontWeight: 700,
                color: couponDiscountAmount > 0 ? 'success.main' : 'text.primary',
              }}
            >
              - $ {formatter.format(couponDiscountAmount)}
            </Typography>
          </Typography>
          <Typography>
            運費：
            <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              $ {formatter.format(shippingFee)}
            </Typography>
          </Typography>
          <Typography>
            訂單總計：
            <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              $ {formatter.format(totalAmount)}
            </Typography>
          </Typography>
          <Typography>
            套用折扣碼：
            <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {appliedCouponCode || '未使用'}
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

          {/* <Typography>
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
          </Typography> */}

          <Typography sx={{ color: 'error.main', mt: 1 }}>
            請確認以上訂單資訊無誤後送出，送出後將無法修改訂單內容。
          </Typography>

          {couponValidationError && (
            <Typography sx={{ color: 'error.main' }}>{couponValidationError}</Typography>
          )}

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
