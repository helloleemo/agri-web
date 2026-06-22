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
import { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import PATHS from '@/routes/paths'
import {
  type BuyerForm,
  type ReceiverForm,
  readCheckoutDraft,
  writeCheckoutDraft,
} from '../checkoutDraft'

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/

const OrdersInfoPage = () => {
  const navigate = useNavigate()
  const { items } = useCart()
  const [buyer, setBuyer] = useState<BuyerForm>(() => readCheckoutDraft().buyer)
  const [receiver, setReceiver] = useState<ReceiverForm>(() => readCheckoutDraft().receiver)
  const [sameAsBuyer, setSameAsBuyer] = useState(false)

  const canContinue = useMemo(() => {
    const buyerValid =
      buyer.name.trim() &&
      buyer.phone.trim() &&
      buyer.email.trim() &&
      EMAIL_PATTERN.test(buyer.email.trim())
    const receiverValid = receiver.name.trim() && receiver.phone.trim() && receiver.address.trim()
    return Boolean(items.length > 0 && buyerValid && receiverValid)
  }, [buyer, receiver, items.length])

  useEffect(() => {
    const draft = readCheckoutDraft()
    writeCheckoutDraft({
      ...draft,
      buyer,
      receiver,
    })
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

  const continueToPayment = () => {
    if (!canContinue) {
      return
    }

    const draft = readCheckoutDraft()
    writeCheckoutDraft({
      ...draft,
      buyer,
      receiver,
    })

    navigate(`/${PATHS.mekarang.root}/${PATHS.mekarang.orders.payment}`)
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
              type="email"
              required
              size="small"
              value={buyer.email}
              helperText="無論是否註冊，下單皆需填寫 Email"
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
                  setReceiver((prev) => ({
                    ...prev,
                    shippingMethod: event.target.value as ReceiverForm['shippingMethod'],
                  }))
                }
              >
                <MenuItem value="宅配">宅配</MenuItem>
                <MenuItem value="其他">其他</MenuItem>
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
                  setReceiver((prev) => ({
                    ...prev,
                    paymentMethod: event.target.value as ReceiverForm['paymentMethod'],
                  }))
                }
              >
                <MenuItem value="匯款">匯款</MenuItem>
                {/* <MenuItem value="面交">面交</MenuItem>
                <MenuItem value="Line Pay">Line Pay</MenuItem> */}
              </Select>
            </Stack>

            {receiver.paymentMethod === '匯款' && (
              <Typography sx={{ color: 'error.main', fontSize: '0.82rem', lineHeight: 1.6 }}>
                匯款方式：訂單確認後將提供銀行帳戶資訊，請留意信箱，並於24小時內完成匯款並回填回款末五碼，逾時訂單將自動取消。
              </Typography>
            )}
            {/* {receiver.paymentMethod === 'Line Pay' && (
              <Typography sx={{ color: 'error.main', fontSize: '0.82rem', lineHeight: 1.6 }}>
                Line Pay：下一步將導向付款資訊與訂單狀態。
              </Typography>
            )} */}
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
            onClick={continueToPayment}
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
