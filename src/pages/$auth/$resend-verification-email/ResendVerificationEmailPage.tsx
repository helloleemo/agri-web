import { useState } from 'react'
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { authService } from '@/api'

const ResendVerificationEmailPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')
      setSuccessMessage('')

      const result = await authService.resendVerificationEmail({ email })

      if (result?.email) {
        if (result.verification_expires_in <= 0) {
          setSuccessMessage(`此信箱 ${result.email} 已完成驗證，系統不會重複寄送驗證信。`)
          return
        }

        setSuccessMessage(
          `已重寄驗證信到 ${result.email}，請在 ${Math.floor(result.verification_expires_in / 60)} 分鐘內完成驗證。`,
        )
      } else {
        setSuccessMessage('若信箱存在且尚未驗證，系統已寄出驗證信。')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '重寄驗證信失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        background:
          'linear-gradient(135deg, rgba(15, 52, 44, 0.96) 0%, rgba(26, 87, 74, 0.9) 45%, rgba(19, 61, 84, 0.9) 100%)',
      }}
    >
      <Paper sx={{ width: '100%', maxWidth: 500, p: 4 }}>
        <Stack spacing={2.4} component="form" onSubmit={handleSubmit}>
          <Box>
            <Typography variant="h4" sx={{ mb: 0.8 }}>
              重寄驗證信
            </Typography>
            <Typography color="text.secondary">輸入註冊信箱，重新取得驗證連結</Typography>
          </Box>

          {error ? <Alert severity="error">{error}</Alert> : null}
          {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            fullWidth
          />

          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? '送出中...' : '重寄驗證信'}
          </Button>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
            {/* <Button component={RouterLink} to="/auth/verify-email" variant="outlined" fullWidth>
              前往驗證頁
            </Button> */}
            <Button component={RouterLink} to="/auth/login" variant="outlined" fullWidth>
              返回登入
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  )
}

export default ResendVerificationEmailPage
