import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { authService } from '@/api'
import { useAuth } from '@/contexts/AuthContext'
import { useAppSnackbar } from '@/contexts/SnackbarContext'

const LoginDialog = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { showSnackbar } = useAppSnackbar()
  const { isLoginDialogOpen, closeLoginDialog, setAuthSession } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const isVerifiedFromEmail = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('verified') === 'success'
  }, [location.search])

  const passwordError = useMemo(() => {
    if (!confirmPassword) {
      return ''
    }

    if (password !== confirmPassword) {
      return '兩次輸入的密碼不一致'
    }

    return ''
  }, [confirmPassword, password])

  const switchMode = (nextMode: 'login' | 'register') => {
    setMode(nextMode)
    setError('')
    setSuccessMessage('')
    setLoading(false)
  }

  const resetDialog = () => {
    setMode('login')
    setEmail('')
    setUserName('')
    setPassword('')
    setConfirmPassword('')
    setError('')
    setSuccessMessage('')
    setLoading(false)
  }

  const handleClose = () => {
    closeLoginDialog()
    resetDialog()
  }

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')
      setSuccessMessage('')

      const response = await authService.login({ email, password })
      setAuthSession(response.access_token, response.user)
      showSnackbar(`歡迎回來，${response.user.user_name}`, { severity: 'success' })
      handleClose()
      navigate('/mekarang/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : '登入失敗')
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (password !== confirmPassword) {
      setError('兩次輸入的密碼不一致')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccessMessage('')

      const result = await authService.register({
        email,
        user_name: userName,
        password,
        role_code: 3,
      })

      setSuccessMessage(
        `註冊成功，驗證信已送往 ${result.email}。請於20分鐘內點擊信件中的連結完成驗證後再登入。若未有註冊信請檢查垃圾郵件，或重新發送驗證信。`,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : '註冊失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={isLoginDialogOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            overflow: 'hidden',
            background:
              'linear-gradient(155deg, rgba(244, 237, 223, 0.98) 0%, rgba(251, 248, 240, 0.98) 48%, rgba(234, 245, 237, 0.98) 100%)',
            boxShadow: '0 28px 70px rgba(14, 30, 23, 0.28)',
          },
        },
      }}
    >
      <DialogContent sx={{ p: { xs: 3, md: 4 } }}>
        <Stack
          spacing={3}
          component="form"
          onSubmit={mode === 'login' ? handleLoginSubmit : handleRegisterSubmit}
        >
          <Box>
            <Typography variant="overline" sx={{ letterSpacing: 3, color: 'text.secondary' }}>
              MEMBER ACCESS
            </Typography>
            <Typography variant="h4" sx={{ mb: 1 }}>
              {mode === 'login' ? '登入會員帳戶' : '建立新帳號'}
            </Typography>
            <Typography color="text.secondary">
              {mode === 'login'
                ? '登入後可查詢訂單、保存聯絡資訊，並更快完成下次購物。'
                : '註冊完成後請先驗證信箱，再回來登入使用會員功能。'}
            </Typography>
          </Box>

          {error ? <Alert severity="error">{error}</Alert> : null}
          {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
          {!successMessage && mode === 'login' && isVerifiedFromEmail ? (
            <Alert severity="success">驗證成功，請重新登入</Alert>
          ) : null}

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            fullWidth
          />
          {mode === 'register' ? (
            <TextField
              label="使用者名稱"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              required
              fullWidth
              helperText="最多 20 個字元"
            />
          ) : null}
          <TextField
            label={mode === 'login' ? '密碼' : '設定密碼'}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            fullWidth
          />
          {mode === 'register' ? (
            <TextField
              label="確認密碼"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              error={Boolean(passwordError)}
              helperText={passwordError || '再次輸入密碼'}
              fullWidth
            />
          ) : null}

          {mode === 'login' ? (
            <Button type="submit" variant="contained" size="large" disabled={loading}>
              {loading ? '登入中...' : '登入'}
            </Button>
          ) : (
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || Boolean(passwordError)}
            >
              {loading ? '註冊中...' : '註冊'}
            </Button>
          )}

          <Stack
            direction={{
              xs: 'column',
              sm: 'row',
            }}
            spacing={1}
            sx={{
              justifyContent: 'center',
            }}
          >
            {mode === 'login' ? (
              <Button
                variant="text"
                sx={{
                  textAlign: 'center',
                  mx: 'auto',
                }}
                onClick={() => switchMode('register')}
              >
                建立新帳號
              </Button>
            ) : (
              <Button variant="outlined" fullWidth onClick={() => switchMode('login')}>
                返回登入
              </Button>
            )}

            {mode === 'login' ? (
              <Button
                component={RouterLink}
                to="/auth/forgot-password"
                variant="text"
                sx={{
                  textAlign: 'center',
                  mx: 'auto',
                }}
                onClick={handleClose}
              >
                忘記密碼？
              </Button>
            ) : null}

            {/* <Button
              component={RouterLink}
              to="/auth/verify-email"
              variant="outlined"
              fullWidth
              onClick={handleClose}
            >
              驗證信箱
            </Button> */}
            <Button
              component={RouterLink}
              to="/auth/resend-verification-email"
              variant="text"
              sx={{
                textAlign: 'center',
                mx: 'auto',
              }}
              onClick={handleClose}
            >
              已註冊，尚未驗證完成？
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default LoginDialog
