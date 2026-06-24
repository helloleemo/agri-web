import { useState } from 'react'
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { authService } from '@/api'

const ForgotPasswordPage = () => {
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

      await authService.forgotPassword({ email })
      setSuccessMessage('若此信箱已註冊，系統已寄出密碼重設信。請至信箱查收。')
    } catch (err) {
      setError(err instanceof Error ? err.message : '忘記密碼請求失敗')
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
              忘記密碼
            </Typography>
            <Typography color="text.secondary">
              輸入你的會員 Email，我們會寄送密碼重設連結
            </Typography>
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
            {loading ? '送出中...' : '寄送重設密碼信'}
          </Button>

          <Button component={RouterLink} to="/auth/login" variant="outlined" fullWidth>
            返回登入
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}

export default ForgotPasswordPage
