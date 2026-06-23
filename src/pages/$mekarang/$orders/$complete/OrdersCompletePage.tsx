import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom'
import type { OrderResponse } from '@/api'
import { ordersService } from '@/api'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { useAuth } from '@/contexts/AuthContext'
import PATHS from '@/routes/paths'

const formatter = new Intl.NumberFormat('zh-TW')

const ORDER_STATUS_CODE = {
  ORDER_CREATED: 1,
  ORDER_CONFIRMED_AND_PENDING_PAYMENT: 2,
  PAID_AND_PREPARING: 3,
  SHIPPING: 4,
  DELIVERED: 5,
  CANCELED: 6,
  REFUNDED: 7,
  OTHER: 99,
} as const

const ORDER_FLOW = [
  {
    code: ORDER_STATUS_CODE.ORDER_CREATED,
    title: '訂單成立',
    description: '系統已收到你的訂單。',
    statusLabel: '訂單成立',
    notice: '您的訂單已成立，待確認後會提供付款資訊，請留意信箱通知。',
  },
  {
    code: ORDER_STATUS_CODE.ORDER_CONFIRMED_AND_PENDING_PAYMENT,
    title: '確認待付款',
    description: '管理員已確認訂單，請由信件中匯款資訊完成付款。',
    statusLabel: '確認訂單待付款',
    notice: '管理員已確認你的訂單，請由信件中匯款資訊完成付款。',
  },
  {
    code: ORDER_STATUS_CODE.PAID_AND_PREPARING,
    title: '備貨中',
    description: '已收到付款，商品正在備貨。',
    statusLabel: '已付款備貨中',
    notice: '已收到付款，商品正在備貨。',
  },
  {
    code: ORDER_STATUS_CODE.SHIPPING,
    title: '配送中',
    description: '商品已寄出，請留意收件。',
    statusLabel: '配送中',
    notice: '商品已寄出，請留意收件。',
  },
  {
    code: ORDER_STATUS_CODE.DELIVERED,
    title: '已送達',
    description: '訂單已送達，感謝你的訂購。',
    statusLabel: '已送達',
    notice: '訂單已送達，感謝你的訂購。',
  },
] as const

interface ProgressStep {
  title: string
  description: string
  done: boolean
  active: boolean
  isError?: boolean
}

const getProgressSteps = (orderStatusCode?: number): ProgressStep[] => {
  if (orderStatusCode === ORDER_STATUS_CODE.CANCELED) {
    return [
      {
        title: '訂單成立',
        description: '系統已收到你的訂單。',
        done: true,
        active: false,
      },
      {
        title: '訂單已取消',
        description: '此訂單已由顧客或管理員取消。',
        done: false,
        active: true,
        isError: true,
      },
    ]
  }

  const currentStepIndex = ORDER_FLOW.findIndex((step) => step.code === orderStatusCode)
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0

  return ORDER_FLOW.map((step, index) => ({
    title: step.title,
    description: step.description,
    done: index < activeIndex,
    active: index === activeIndex,
  }))
}

const getStatusLabel = (order?: OrderResponse): string => {
  if (!order) {
    return '訂單成立'
  }

  if (order.order_status_code === ORDER_STATUS_CODE.CANCELED) {
    return '訂單已取消'
  }

  const matched = ORDER_FLOW.find((step) => step.code === order.order_status_code)
  if (matched) {
    return matched.statusLabel
  }

  return order.order_status_name ?? '狀態更新中'
}

interface OrdersCompleteLocationState {
  createdOrder?: OrderResponse
  queriedOrder?: OrderResponse
}

const OrdersCompletePage = () => {
  const location = useLocation()
  const { id: orderIdFromPath } = useParams<{ id: string }>()
  const { isAuthenticated, openLoginDialog } = useAuth()
  const state = (location.state as OrdersCompleteLocationState | null) ?? null
  const orderFromState = state?.createdOrder ?? state?.queriedOrder

  const [latestOrder, setLatestOrder] = useState<OrderResponse | null>(null)
  const [isLoadingOrder, setIsLoadingOrder] = useState(false)
  const [loadOrderError, setLoadOrderError] = useState('')
  const [refreshVersion, setRefreshVersion] = useState(0)
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false)

  const [isCanceling, setIsCanceling] = useState(false)
  const [cancelError, setCancelError] = useState('')
  const [cancelSuccess, setCancelSuccess] = useState(false)
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [transferLast5, setTransferLast5] = useState('')
  const [transferError, setTransferError] = useState('')
  const [transferSuccess, setTransferSuccess] = useState('')
  const [isSubmittingTransfer, setIsSubmittingTransfer] = useState(false)

  const resolvedOrderId = orderIdFromPath ?? orderFromState?.id
  const order = latestOrder ?? orderFromState

  useEffect(() => {
    // Guests can land here with created order data in navigation state.
    // Skip authenticated detail fetch for guests to avoid 401-triggered global redirect.
    if (!resolvedOrderId || !isAuthenticated) {
      return
    }

    let isMounted = true

    const fetchLatestOrder = async () => {
      try {
        setIsLoadingOrder(true)
        setLoadOrderError('')
        const latestOrder = await ordersService.getById(resolvedOrderId)
        if (isMounted) {
          setLatestOrder(latestOrder)
        }
      } catch (error) {
        if (isMounted) {
          setLoadOrderError(error instanceof Error ? error.message : '載入訂單資料失敗')
          // Keep current data when refresh fails to avoid breaking the page.
        }
      } finally {
        if (isMounted) {
          setIsLoadingOrder(false)
        }
      }
    }

    void fetchLatestOrder()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, resolvedOrderId, refreshVersion])

  const progressSteps = getProgressSteps(order?.order_status_code)

  const canCancelByStatus =
    order &&
    order.order_status_code !== ORDER_STATUS_CODE.DELIVERED &&
    order.order_status_code !== ORDER_STATUS_CODE.CANCELED &&
    order.order_status_code !== ORDER_STATUS_CODE.SHIPPING
  const canCancel = canCancelByStatus && isAuthenticated

  const handleCancelOrder = async () => {
    if (!order) return
    if (!isAuthenticated) {
      setCancelError('取消訂單需要先登入。')
      setIsCancelConfirmOpen(false)
      openLoginDialog()
      return
    }
    setIsCanceling(true)
    setCancelError('')
    setCancelSuccess(false)
    try {
      await ordersService.cancel(order.id)
      setCancelSuccess(true)
      setIsCancelConfirmOpen(false)
      setRefreshVersion((prev) => prev + 1)
    } catch (error) {
      if (error instanceof Error && 'status' in error && error.status === 401) {
        setCancelError('登入狀態已失效，請重新登入後再取消訂單。')
      } else {
        setCancelError(error instanceof Error ? error.message : '取消訂單失敗，請稍後再試')
      }
    } finally {
      setIsCanceling(false)
    }
  }

  const orderNo = order?.order_no ?? '-'
  const orderDate = order
    ? new Date(order.created_at).toLocaleString('zh-TW', { hour12: false })
    : '-'
  const orderStatus = getStatusLabel(order)
  const customerEmail = order?.customer_email ?? '-'
  const paymentMethod = order?.payment_method_label ?? '-'
  const deliveryMethod = order?.delivery_method_label ?? '-'
  const shippingFee = order?.shipping_fee ?? 0
  const displayedTotalAmount = Math.max(
    0,
    (order?.subtotal_amount ?? 0) - (order?.discount_amount ?? 0) + shippingFee,
  )
  const canSubmitTransferLast5 =
    order?.order_status_code === ORDER_STATUS_CODE.ORDER_CONFIRMED_AND_PENDING_PAYMENT &&
    order?.payment_method === 1

  const handleSubmitTransferLast5 = async () => {
    if (!order) {
      return
    }

    const normalizedLast5 = transferLast5.trim()
    if (!/^\d{5}$/.test(normalizedLast5)) {
      setTransferError('請輸入 5 碼數字')
      return
    }

    try {
      setIsSubmittingTransfer(true)
      setTransferError('')
      await ordersService.submitBankTransferLast5(order.id, {
        bank_transfer_last5: normalizedLast5,
        customer_email: order.customer_email,
      })
      setTransferSuccess('已送出匯款後五碼，管理員將收到通知。')
      setIsTransferDialogOpen(false)
      setRefreshVersion((prev) => prev + 1)
    } catch (error) {
      setTransferError(error instanceof Error ? error.message : '送出後五碼失敗，請稍後再試')
    } finally {
      setIsSubmittingTransfer(false)
    }
  }

  return (
    <Box component="main" sx={{ py: { xs: 5, md: 7 } }}>
      <Container maxWidth="lg">
        {isLoadingOrder && !order && (
          <Stack sx={{ py: 4, alignItems: 'center' }}>
            <CircularProgress size={28} />
          </Stack>
        )}
        {!isLoadingOrder && !order && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {loadOrderError || '找不到對應訂單，請重新查詢訂單編號與 Email。'}
          </Alert>
        )}
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
          <Typography color="text.primary">訂單詳情</Typography>
        </Breadcrumbs>
        <Box
          sx={{
            p: { xs: 2.5, md: 3.2 },
            border: '1px solid',
            borderColor: 'grey.300',
            borderRadius: 2,
            bgcolor: 'background.paper',
            mb: 2,
          }}
        >
          <Typography variant="h3" sx={{ mb: 3, fontSize: { xs: '1.35rem', md: '1.55rem' } }}>
            {order?.order_status_code === ORDER_STATUS_CODE.CANCELED
              ? '此訂單已取消。'
              : (ORDER_FLOW.find((step) => step.code === order?.order_status_code)?.notice ??
                '你的訂單狀態正在更新中，請稍後重新整理或稍後再查看。')}
          </Typography>
        </Box>
        <Box
          sx={{
            p: { xs: 2.5, md: 3.2 },
            border: '1px solid',
            borderColor: 'grey.300',
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="h3" sx={{ mb: 3, fontSize: { xs: '1.35rem', md: '1.55rem' } }}>
            商品追蹤
          </Typography>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2.5, md: 1.8 }}>
            {progressSteps.map((step, index) => (
              <Stack
                key={step.title}
                direction="row"
                spacing={1.2}
                sx={{
                  flex: 1,
                  alignItems: 'flex-start',
                }}
              >
                <Inventory2OutlinedIcon
                  sx={{
                    color: step.isError
                      ? 'error.main'
                      : step.done || step.active
                        ? 'secondary.main'
                        : 'grey.400',
                    mt: 0.1,
                  }}
                />
                <Box sx={{ minWidth: 0, width: '100%' }}>
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 0.3 }}>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        color: step.isError
                          ? 'error.main'
                          : step.done || step.active
                            ? 'text.primary'
                            : 'text.secondary',
                      }}
                    >
                      {step.title}
                    </Typography>
                    {index < progressSteps.length - 1 && (
                      <Box
                        sx={{
                          flex: 1,
                          height: 2,
                          bgcolor: step.isError
                            ? 'error.main'
                            : step.done
                              ? 'secondary.main'
                              : 'grey.300',
                        }}
                      />
                    )}
                  </Stack>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.84rem' }}>
                    {step.description}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>
        <Box
          sx={{
            p: { xs: 2.5, md: 3.2 },
            border: '1px solid',
            borderColor: 'grey.300',
            borderRadius: 2,
            bgcolor: 'background.paper',
            mt: 2,
          }}
        >
          <Stack spacing={1.5} sx={{ mb: 2 }}>
            {cancelSuccess && <Alert severity="success">訂單已取消，狀態已即時更新。</Alert>}
            {cancelError && <Alert severity="error">{cancelError}</Alert>}
            {transferSuccess && <Alert severity="success">{transferSuccess}</Alert>}
            {transferError && !isTransferDialogOpen && (
              <Alert severity="error">{transferError}</Alert>
            )}
          </Stack>
          <Stack
            direction="row"
            sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="h3" sx={{ fontSize: { xs: '1.35rem', md: '1.55rem' } }}>
              訂單資訊
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                component={RouterLink}
                to={`/${PATHS.mekarang.root}/${PATHS.mekarang.products.root}`}
              >
                回首頁，繼續購物
              </Button>
              {canCancel && (
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => setIsCancelConfirmOpen(true)}
                  disabled={isCanceling}
                >
                  {isCanceling ? '取消中...' : '取消訂單'}
                </Button>
              )}
            </Stack>
          </Stack>

          <Stack spacing={1} sx={{ color: 'text.secondary' }}>
            <Typography>
              訂單編號：
              <Typography component="span" sx={{ color: 'text.primary', fontWeight: 700 }}>
                #{orderNo}
              </Typography>
            </Typography>
            <Typography>日期：{orderDate}</Typography>
            <Typography>付款方式：{paymentMethod}</Typography>
            <Typography>配送方式：{deliveryMethod}</Typography>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
              <Typography> 狀態：{orderStatus}</Typography>{' '}
              {canSubmitTransferLast5 && (
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => {
                    setTransferError('')
                    setTransferSuccess('')
                    setTransferLast5(order?.bank_transfer_last5 ?? '')
                    setIsTransferDialogOpen(true)
                  }}
                >
                  填寫匯款後五碼
                </Button>
              )}
            </Box>
            <Typography>顧客信箱：{customerEmail}</Typography>
            <Typography>
              訂購人資訊：{order?.orderer_name || '-'} / {order?.orderer_phone || '-'}
            </Typography>
            <Typography>
              收件資訊：{order?.customer_name || '-'} / {order?.address || '-'}
            </Typography>
            {order?.coupon_code && <Typography>折扣碼：{order.coupon_code}</Typography>}
            <Typography>匯款後五碼：{order?.bank_transfer_last5 || '-'}</Typography>
          </Stack>

          {order && (
            <Stack
              spacing={1.2}
              sx={{ mt: 2.5, pt: 2, borderTop: '1px dashed', borderColor: 'grey.300' }}
            >
              <Typography sx={{ fontWeight: 800, color: 'text.primary' }}>訂單商品明細</Typography>

              {order.items.length === 0 && (
                <Typography sx={{ color: 'text.secondary' }}>此訂單目前無商品明細</Typography>
              )}

              {order.items.map((item) => (
                <Stack
                  key={item.id}
                  direction="row"
                  sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box>
                    <Typography sx={{ color: 'text.primary', fontWeight: 700 }}>
                      {item.product_name || `商品 ${item.product_id.slice(0, 8)}`}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.84rem' }}>
                      商品編號：{item.product_id}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {item.unit || '未提供規格'} / 數量 {item.quantity}
                  </Typography>
                </Stack>
              ))}

              <Stack
                spacing={0.6}
                sx={{ mt: 0.8, pt: 1.4, borderTop: '1px dashed', borderColor: 'grey.300' }}
              >
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">小計</Typography>
                  <Typography>$ {formatter.format(order.subtotal_amount)}</Typography>
                </Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">折扣</Typography>
                  <Typography color={order.discount_amount > 0 ? 'success.main' : 'text.primary'}>
                    - $ {formatter.format(order.discount_amount)}
                  </Typography>
                </Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">運費</Typography>
                  <Typography>$ {formatter.format(shippingFee)}</Typography>
                </Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 800 }}>總計</Typography>
                  <Typography sx={{ fontWeight: 800 }}>
                    $ {formatter.format(displayedTotalAmount)}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          )}
        </Box>
      </Container>

      <ConfirmDialog
        open={isCancelConfirmOpen}
        title="確認取消訂單？"
        description="取消後將無法恢復，且此筆訂單狀態會立即更新為已取消。"
        confirmText="確認取消"
        cancelText="先不要"
        confirmColor="error"
        loading={isCanceling}
        onClose={() => setIsCancelConfirmOpen(false)}
        onConfirm={handleCancelOrder}
      />

      <Dialog
        open={isTransferDialogOpen}
        onClose={isSubmittingTransfer ? undefined : () => setIsTransferDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>輸入匯款後五碼</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.2} sx={{ pt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              狀態為「確認待付款」時可提交匯款帳號後五碼給管理員核對。
            </Typography>
            <TextField
              label="匯款後五碼"
              value={transferLast5}
              onChange={(event) => {
                setTransferLast5(event.target.value.replace(/\D/g, '').slice(0, 5))
                setTransferError('')
              }}
              placeholder="例如：12345"
              slotProps={{ htmlInput: { inputMode: 'numeric', pattern: '\\d{5}', maxLength: 5 } }}
              fullWidth
            />
            {transferError ? <Alert severity="error">{transferError}</Alert> : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsTransferDialogOpen(false)} disabled={isSubmittingTransfer}>
            取消
          </Button>
          <Button
            onClick={() => void handleSubmitTransferLast5()}
            variant="contained"
            disabled={isSubmittingTransfer}
          >
            {isSubmittingTransfer ? '送出中...' : '送出'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default OrdersCompletePage
