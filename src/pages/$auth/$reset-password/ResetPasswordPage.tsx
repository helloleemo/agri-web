import { useMemo, useState } from 'react'
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'
import { authService } from '@/api'

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const initialToken = useMemo(() => searchParams.get('token') ?? '', [searchParams])

  const [token, setToken] = useState(initialToken)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const passwordMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (newPassword.length < 8) {
      setError('新密碼至少需要 8 個字元。')
      return
    }

    if (passwordMismatch) {
      setError('兩次輸入的新密碼不一致。')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccessMessage('')

      await authService.resetPassword({
        token: token.trim(),
        new_password: newPassword,
      })

      setSuccessMessage('密碼已重設完成，請使用新密碼重新登入。')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : '重設密碼失敗，請重新取得重設連結')
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
      <Paper sx={{ width: '100%', maxWidth: 560, p: 4 }}>
        <Stack spacing={2.4} component="form" onSubmit={handleSubmit}>
          <Box>
            <Typography variant="h4" sx={{ mb: 0.8 }}>
              重設密碼
            </Typography>
            <Typography color="text.secondary">請貼上重設 token，並輸入新的密碼</Typography>
          </Box>

          {error ? <Alert severity="error">{error}</Alert> : null}
          {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}

          <TextField
            label="重設 Token"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            required
            fullWidth
            multiline
            minRows={3}
          />
          <TextField
            label="新密碼"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            fullWidth
            helperText="至少 8 個字元"
          />
          <TextField
            label="確認新密碼"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            fullWidth
            error={passwordMismatch}
            helperText={passwordMismatch ? '兩次輸入的新密碼不一致' : '再次輸入新密碼'}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={
              loading || !token.trim() || !newPassword || !confirmPassword || passwordMismatch
            }
          >
            {loading ? '處理中...' : '確認重設密碼'}
          </Button>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
            <Button component={RouterLink} to="/auth/forgot-password" variant="outlined" fullWidth>
              重新寄送重設信
            </Button>
            <Button component={RouterLink} to="/auth/login" variant="outlined" fullWidth>
              返回登入
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  )
}

export default ResetPasswordPage
