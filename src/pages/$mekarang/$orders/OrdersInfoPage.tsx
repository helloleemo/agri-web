import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import {
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import PATHS from '@/routes/paths'

interface ContactForm {
  name: string
  phone: string
  email: string
  note: string
}

interface ReceiverForm {
  name: string
  phone: string
  address: string
  shippingMethod: string
  paymentMethod: string
}

const emptyBuyer: ContactForm = {
  name: '',
  phone: '',
  email: '',
  note: '',
}

const emptyReceiver: ReceiverForm = {
  name: '',
  phone: '',
  address: '',
  shippingMethod: '宅配',
  paymentMethod: '匯款',
}

const OrdersInfoPage = () => {
  const [buyer, setBuyer] = useState<ContactForm>(emptyBuyer)
  const [receiver, setReceiver] = useState<ReceiverForm>(emptyReceiver)
  const [sameAsBuyer, setSameAsBuyer] = useState(false)

  const canContinue = useMemo(() => {
    const buyerValid = buyer.name.trim() && buyer.phone.trim() && buyer.email.trim()
    const receiverValid = receiver.name.trim() && receiver.phone.trim() && receiver.address.trim()
    return Boolean(buyerValid && receiverValid)
  }, [buyer, receiver])

  const handleSameAsBuyer = (checked: boolean) => {
    setSameAsBuyer(checked)

    if (checked) {
      setReceiver((prev) => ({
        ...prev,
        name: buyer.name,
        phone: buyer.phone,
      }))
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
          <Typography color="text.primary">填寫資料</Typography>
        </Breadcrumbs>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 8 }}>
          {[
            { icon: CalendarMonthRoundedIcon, title: '步驟一：確認商品', active: false },
            { icon: LocalShippingRoundedIcon, title: '步驟二：填寫資料', active: true },
            { icon: CheckCircleOutlineRoundedIcon, title: '步驟三：完成下單', active: false },
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

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={5}
          sx={{ alignItems: 'flex-start' }}
        >
          <Stack spacing={2} sx={{ flex: 1, width: '100%' }}>
            <Typography variant="h3" sx={{ mb: 1, fontSize: { xs: '1.45rem', md: '1.7rem' } }}>
              訂購人資料
            </Typography>
            <TextField
              label="訂購人姓名"
              size="small"
              value={buyer.name}
              onChange={(event) => {
                const nextName = event.target.value
                setBuyer((prev) => ({ ...prev, name: nextName }))

                if (sameAsBuyer) {
                  setReceiver((prev) => ({ ...prev, name: nextName }))
                }
              }}
            />
            <TextField
              label="電話"
              size="small"
              value={buyer.phone}
              onChange={(event) => {
                const nextPhone = event.target.value
                setBuyer((prev) => ({ ...prev, phone: nextPhone }))

                if (sameAsBuyer) {
                  setReceiver((prev) => ({ ...prev, phone: nextPhone }))
                }
              }}
            />
            <TextField
              label="Email"
              size="small"
              value={buyer.email}
              onChange={(event) => setBuyer((prev) => ({ ...prev, email: event.target.value }))}
            />
            <TextField
              label="備註說明"
              multiline
              minRows={4}
              value={buyer.note}
              onChange={(event) => setBuyer((prev) => ({ ...prev, note: event.target.value }))}
            />
          </Stack>

          <Stack spacing={2} sx={{ flex: 1, width: '100%' }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 1 }}
            >
              <Typography variant="h3" sx={{ fontSize: { xs: '1.45rem', md: '1.7rem' } }}>
                收件人資料
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sameAsBuyer}
                    onChange={(event) => handleSameAsBuyer(event.target.checked)}
                  />
                }
                label="同訂購人資料"
                sx={{ m: 0 }}
              />
            </Stack>

            <TextField
              label="收件人姓名"
              size="small"
              value={receiver.name}
              onChange={(event) => setReceiver((prev) => ({ ...prev, name: event.target.value }))}
            />
            <TextField
              label="電話"
              size="small"
              value={receiver.phone}
              onChange={(event) => setReceiver((prev) => ({ ...prev, phone: event.target.value }))}
            />
            <TextField
              label="地址"
              size="small"
              value={receiver.address}
              onChange={(event) =>
                setReceiver((prev) => ({ ...prev, address: event.target.value }))
              }
            />

            <Stack spacing={0.8}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.88rem' }}>
                配送方式
              </Typography>
              <Select
                size="small"
                value={receiver.shippingMethod}
                onChange={(event) =>
                  setReceiver((prev) => ({ ...prev, shippingMethod: event.target.value }))
                }
              >
                <MenuItem value="宅配">宅配</MenuItem>
                <MenuItem value="超商取貨">超商取貨</MenuItem>
                <MenuItem value="面交">面交</MenuItem>
              </Select>
            </Stack>

            <Stack spacing={0.8}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.88rem' }}>
                付款方式
              </Typography>
              <Select
                size="small"
                value={receiver.paymentMethod}
                onChange={(event) =>
                  setReceiver((prev) => ({ ...prev, paymentMethod: event.target.value }))
                }
              >
                <MenuItem value="匯款">匯款</MenuItem>
                <MenuItem value="貨到付款">貨到付款</MenuItem>
                <MenuItem value="線上刷卡">線上刷卡</MenuItem>
              </Select>
            </Stack>

            {receiver.paymentMethod === '匯款' && (
              <Typography sx={{ color: 'error.main', fontSize: '0.82rem', lineHeight: 1.6 }}>
                匯款方式：下一步將顯示匯款帳號資訊。
              </Typography>
            )}
            {receiver.paymentMethod === '線上刷卡' && (
              <Typography sx={{ color: 'error.main', fontSize: '0.82rem', lineHeight: 1.6 }}>
                線上刷卡：下一步將導向付款頁面。
              </Typography>
            )}
          </Stack>
        </Stack>

        <Box sx={{ mt: 8, borderTop: '1px solid', borderColor: 'grey.300' }} />

        <Stack direction="row" spacing={1.6} sx={{ justifyContent: 'flex-end', mt: 4 }}>
          <Button
            variant="outlined"
            color="inherit"
            component={RouterLink}
            to={`/${PATHS.mekarang.root}/${PATHS.mekarang.orders.root}`}
            sx={{ minWidth: 200 }}
          >
            返回上一步，修改資料
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={!canContinue}
            component={RouterLink}
            to={`/${PATHS.mekarang.root}/${PATHS.mekarang.orders.payment}`}
            sx={{ minWidth: 220 }}
          >
            下一步，選擇付款方式
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}

export default OrdersInfoPage
