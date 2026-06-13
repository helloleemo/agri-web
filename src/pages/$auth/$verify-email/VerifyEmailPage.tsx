import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '@/api'

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialToken = useMemo(() => searchParams.get('token') ?? '', [searchParams])

  const [token, setToken] = useState(initialToken)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const verifyToken = useCallback(
    async (rawToken: string) => {
      const trimmedToken = rawToken.trim()

      if (!trimmedToken) {
        setError('請輸入有效的驗證 token')
        return
      }

      try {
        setLoading(true)
        setError('')
        setSuccessMessage('')

        const result = await authService.verifyEmail({ token: trimmedToken })
        setSuccessMessage(`信箱 ${result.email} 驗證成功，正在返回首頁...`)
        navigate('/?verified=success', { replace: true })
      } catch (err) {
        setError(err instanceof Error ? err.message : '驗證失敗，請確認 token 是否正確或已過期')
      } finally {
        setLoading(false)
      }
    },
    [navigate],
  )

  useEffect(() => {
    if (!initialToken.trim()) {
      return
    }

    void verifyToken(initialToken)
  }, [initialToken, verifyToken])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await verifyToken(token)
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
              驗證信箱
            </Typography>
            <Typography color="text.secondary">
              貼上驗證 token，或直接透過信件連結進入本頁完成驗證
            </Typography>
          </Box>

          {error ? <Alert severity="error">{error}</Alert> : null}
          {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}

          <TextField
            label="驗證 Token"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            required
            fullWidth
            multiline
            minRows={3}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading || !token.trim()}
          >
            {loading ? '驗證中...' : '驗證 Email'}
          </Button>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
            {error ? (
              <Button
                component={RouterLink}
                to="/auth/resend-verification-email"
                variant="outlined"
                fullWidth
              >
                重寄驗證信
              </Button>
            ) : null}
            <Button component={RouterLink} to="/auth/login" variant="outlined" fullWidth>
              返回登入
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  )
}

export default VerifyEmailPage
