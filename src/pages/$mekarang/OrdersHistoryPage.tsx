import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { ordersService } from '@/api'
import type { OrderResponse } from '@/api'
import { useAuth } from '@/contexts/AuthContext'
import PATHS from '@/routes/paths'

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

const statusLabelMap: Record<number, string> = {
  [ORDER_STATUS_CODE.ORDER_CREATED]: '訂單成立',
  [ORDER_STATUS_CODE.ORDER_CONFIRMED_AND_PENDING_PAYMENT]: '確認訂單待付款',
  [ORDER_STATUS_CODE.PAID_AND_PREPARING]: '已付款備貨中',
  [ORDER_STATUS_CODE.SHIPPING]: '配送中',
  [ORDER_STATUS_CODE.DELIVERED]: '已送達',
  [ORDER_STATUS_CODE.CANCELED]: '訂單已取消',
  [ORDER_STATUS_CODE.REFUNDED]: '已退款',
  [ORDER_STATUS_CODE.OTHER]: '其他',
}

const statusColorMap: Record<
  number,
  'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
> = {
  [ORDER_STATUS_CODE.ORDER_CREATED]: 'primary',
  [ORDER_STATUS_CODE.ORDER_CONFIRMED_AND_PENDING_PAYMENT]: 'warning',
  [ORDER_STATUS_CODE.PAID_AND_PREPARING]: 'info',
  [ORDER_STATUS_CODE.SHIPPING]: 'secondary',
  [ORDER_STATUS_CODE.DELIVERED]: 'success',
  [ORDER_STATUS_CODE.CANCELED]: 'error',
  [ORDER_STATUS_CODE.REFUNDED]: 'warning',
  [ORDER_STATUS_CODE.OTHER]: 'default',
}

const formatter = new Intl.NumberFormat('zh-TW')

const OrdersHistoryPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/${PATHS.auth.root}/${PATHS.auth.login}`, { replace: true })
      return
    }

    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await ordersService.getList({ skip: 0, limit: 100 })
        setOrders(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '載入訂單資料失敗')
      } finally {
        setLoading(false)
      }
    }

    void fetchOrders()
  }, [isAuthenticated, navigate])

  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    [orders],
  )

  const handleRefresh = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await ordersService.getList({ skip: 0, limit: 200 })
      setOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '重新整理失敗')
    } finally {
      setLoading(false)
    }
  }

  const handleViewOrder = (order: OrderResponse) => {
    navigate(`/${PATHS.mekarang.root}/${PATHS.mekarang.orders.root}/${order.id}`, {
      state: { queriedOrder: order },
    })
  }

  if (!isAuthenticated) {
    return null
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
          <Typography color="text.primary">我的訂單</Typography>
        </Breadcrumbs>

        <Paper sx={{ p: 2.4 }}>
          <Stack
            direction="row"
            sx={{ mb: 2, alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <LocalShippingRoundedIcon color="primary" />
              <Typography variant="h5">我的訂單</Typography>
              {user && (
                <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                  ({user.user_name})
                </Typography>
              )}
            </Stack>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshRoundedIcon />}
              onClick={handleRefresh}
              disabled={loading}
            >
              重新整理
            </Button>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading && (
            <Stack sx={{ py: 4, alignItems: 'center' }}>
              <CircularProgress size={28} />
            </Stack>
          )}

          {!loading && orders.length === 0 && (
            <Stack sx={{ py: 4, alignItems: 'center' }}>
              <Typography sx={{ color: 'text.secondary' }}>還沒有任何訂單</Typography>
            </Stack>
          )}

          {!loading && orders.length > 0 && (
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>訂單編號</TableCell>
                    <TableCell>建立日期</TableCell>
                    <TableCell align="right">金額</TableCell>
                    <TableCell>商品數</TableCell>
                    <TableCell>狀態</TableCell>
                    <TableCell align="center">操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedOrders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>{order.order_no}</Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString('zh-TW')}
                      </TableCell>
                      <TableCell align="right">$ {formatter.format(order.total_amount)}</TableCell>
                      <TableCell>{order.items.length}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            statusLabelMap[order.order_status_code] ||
                            `狀態 ${order.order_status_code}`
                          }
                          size="small"
                          color={statusColorMap[order.order_status_code] || 'default'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button size="small" variant="text" onClick={() => handleViewOrder(order)}>
                          查看
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  )
}

export default OrdersHistoryPage
