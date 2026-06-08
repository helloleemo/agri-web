import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import { Box, Breadcrumbs, Button, Container, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import PATHS from '@/routes/paths'

const OrdersPaymentPage = () => {
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
            訂單已成立：
            <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              #OC202606040001
            </Typography>
          </Typography>
          <Typography>
            訂單總額：
            <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              $ 3,000
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
            如使用線上刷卡，下一頁將導向付款狀態與訂單追蹤。
          </Typography>
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
            component={RouterLink}
            to={`/${PATHS.mekarang.root}/${PATHS.mekarang.orders.complete}`}
            sx={{ minWidth: 180 }}
          >
            下一步，查看訂單狀態
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}

export default OrdersPaymentPage
