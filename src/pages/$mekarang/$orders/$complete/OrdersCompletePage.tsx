import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import { Box, Breadcrumbs, Button, Container, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import PATHS from '@/routes/paths'

const progressSteps = [
  { title: '訂單成立', description: '系統已收到訂單', done: true },
  { title: '付款確認', description: '待完成付款', done: true, active: true },
  { title: '準備中', description: '商品包裝處理中', done: false },
  { title: '出貨', description: '配送中，敬請留意', done: false },
]

const OrdersCompletePage = () => {
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
          <Typography color="text.primary">訂單完成</Typography>
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
          <Stack
            direction="row"
            sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="h3" sx={{ fontSize: { xs: '1.35rem', md: '1.55rem' } }}>
              訂單資訊
            </Typography>
            <Button
              size="small"
              variant="outlined"
              component={RouterLink}
              to={`/${PATHS.mekarang.root}/${PATHS.mekarang.products.root}`}
            >
              回首頁，繼續購物
            </Button>
          </Stack>

          <Stack spacing={1} sx={{ color: 'text.secondary' }}>
            <Typography>
              訂單編號：
              <Typography component="span" sx={{ color: 'text.primary', fontWeight: 700 }}>
                #OC202606040001
              </Typography>
            </Typography>
            <Typography>日期：2026/06/04 14:20</Typography>
            <Typography>付款方式：匯款</Typography>
            <Typography>狀態：付款確認中</Typography>
            <Typography>寄件人資訊：王小明 / 09xx-xxx-xxx</Typography>
            <Typography>收件人資訊：王小明 / 台北市中山區民生東路 100 號</Typography>
          </Stack>
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
                  sx={{ color: step.done || step.active ? 'secondary.main' : 'grey.400', mt: 0.1 }}
                />
                <Box sx={{ minWidth: 0, width: '100%' }}>
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 0.3 }}>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        color: step.done || step.active ? 'text.primary' : 'text.secondary',
                      }}
                    >
                      {step.title}
                    </Typography>
                    {index < progressSteps.length - 1 && (
                      <Box
                        sx={{
                          flex: 1,
                          height: 2,
                          bgcolor: step.done ? 'secondary.main' : 'grey.300',
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
      </Container>
    </Box>
  )
}

export default OrdersCompletePage
