import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { authService } from '@/api'
import { Footer, Header } from '@/components/layout'

const roleOptions = [
  { value: 1, label: '管理員' },
  { value: 2, label: '員工' },
  { value: 3, label: '會員' },
] as const

const featureHighlights = ['產地直送', '訂單查詢', '快速補貨']

const registerImage =
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1600&q=80'

const RegisterPage = () => {
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [verificationToken, setVerificationToken] = useState('')
  const [roleCode, setRoleCode] = useState<number>(3)
  const [loading, setLoading] = useState(false)
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [verificationError, setVerificationError] = useState('')
  const [verificationSuccessMessage, setVerificationSuccessMessage] = useState('')

  const passwordError = useMemo(() => {
    if (!confirmPassword) {
      return ''
    }

    if (password !== confirmPassword) {
      return '兩次輸入的密碼不一致'
    }

    return ''
  }, [confirmPassword, password])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (password !== confirmPassword) {
      setError('兩次輸入的密碼不一致')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccessMessage('')
      setVerificationError('')
      setVerificationSuccessMessage('')
      setVerificationToken('')

      const result = await authService.register({
        email,
        user_name: userName,
        password,
        role_code: roleCode as 1 | 2 | 3,
      })

      setSuccessMessage(
        `註冊成功，驗證信已送往 ${result.email}。收到信後請把驗證碼或驗證 token 貼到下方，並在 ${Math.floor(result.verification_expires_in / 60)} 分鐘內完成驗證。`,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : '註冊失敗')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setVerificationLoading(true)
      setVerificationError('')
      setVerificationSuccessMessage('')

      const result = await authService.verifyEmail({ token: verificationToken.trim() })
      setVerificationSuccessMessage(`信箱 ${result.email} 驗證成功，現在可以登入。`)
    } catch (err) {
      setVerificationError(
        err instanceof Error ? err.message : '驗證失敗，請確認驗證碼是否正確或已過期',
      )
    } finally {
      setVerificationLoading(false)
    }
  }

  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      <Header alwaysSolidBackground />

      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background:
            'radial-gradient(circle at top left, rgba(109, 143, 96, 0.18), transparent 38%), linear-gradient(180deg, #0d1b15 0%, #16261e 28%, #f2ede1 28%, #f8f4eb 100%)',
        }}
      >
        <Container sx={{ pt: { xs: 15, md: 18 }, pb: { xs: 8, md: 10 } }}>
          <Box
            sx={{
              display: 'grid',
              gap: { xs: 4, md: 6 },
              alignItems: 'stretch',
              gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1fr)' },
            }}
          >
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={3.5} sx={{ color: { xs: 'common.white', md: 'text.primary' } }}>
                <Box>
                  <Typography
                    variant="overline"
                    sx={{
                      letterSpacing: 4,
                      color: { xs: 'rgba(255,255,255,0.7)', md: 'text.secondary' },
                    }}
                  >
                    JOIN MEKARANG
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      mt: 1,
                      maxWidth: 520,
                      fontSize: { xs: '2.4rem', md: '3.8rem' },
                      lineHeight: 1.05,
                    }}
                  >
                    把採收節奏、配送資訊與會員服務，留在同一個入口。
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    maxWidth: 520,
                    color: { xs: 'rgba(255,255,255,0.8)', md: 'text.secondary' },
                  }}
                >
                  註冊後你可以更快完成下單、追蹤訂單狀態，並在收到驗證信後立即啟用帳號。
                </Typography>

                <Stack direction="row" spacing={1.2} sx={{ flexWrap: 'wrap', gap: 1.2 }}>
                  {featureHighlights.map((item) => (
                    <Chip
                      key={item}
                      label={item}
                      sx={{
                        bgcolor: { xs: 'rgba(255,255,255,0.16)', md: 'rgba(18, 50, 38, 0.08)' },
                        color: 'inherit',
                        borderRadius: 999,
                      }}
                    />
                  ))}
                </Stack>

                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    pr: 2,
                    borderRadius: 4,
                    overflow: 'hidden',
                    bgcolor: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(8px)',
                    display: { xs: 'none', md: 'block' },
                  }}
                >
                  <Box
                    component="img"
                    src={registerImage}
                    alt="農產品包裝"
                    sx={{
                      width: '100%',
                      height: 340,
                      objectFit: 'cover',
                      borderRadius: 3,
                    }}
                  />
                </Paper>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 5,
                  boxShadow: '0 26px 60px rgba(15, 27, 22, 0.14)',
                }}
              >
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h4" sx={{ mb: 1 }}>
                      建立帳號
                    </Typography>
                    <Typography color="text.secondary">
                      先完成會員資料，再用 email 裡的驗證碼或驗證 token 啟用帳號。
                    </Typography>
                  </Box>

                  <Alert severity="info" sx={{ alignItems: 'flex-start' }}>
                    若註冊後沒有收到信，請先確認後端 SMTP 設定是否完成；目前未配置 SMTP
                    時，系統不會真的寄信，只會把驗證連結寫進伺服器 log。
                  </Alert>

                  <Stack spacing={2.2} component="form" onSubmit={handleSubmit}>
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

                    <TextField
                      label="使用者名稱"
                      value={userName}
                      onChange={(event) => setUserName(event.target.value)}
                      required
                      fullWidth
                      helperText="最多 20 個字元"
                    />

                    <TextField
                      label="角色"
                      select
                      value={roleCode}
                      onChange={(event) => setRoleCode(Number(event.target.value))}
                      required
                      fullWidth
                    >
                      {roleOptions.map((role) => (
                        <MenuItem key={role.value} value={role.value}>
                          {role.label}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      label="密碼"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      fullWidth
                      helperText="至少 8 個字元"
                    />

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

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading || Boolean(passwordError)}
                    >
                      {loading ? '註冊中...' : '註冊'}
                    </Button>
                  </Stack>

                  {successMessage ? (
                    <Stack
                      spacing={2}
                      component="form"
                      onSubmit={handleVerifySubmit}
                      sx={{
                        p: 2.2,
                        borderRadius: 4,
                        bgcolor: 'rgba(29, 77, 57, 0.05)',
                        border: '1px solid rgba(29, 77, 57, 0.12)',
                      }}
                    >
                      <Box>
                        <Typography variant="h6" sx={{ mb: 0.6 }}>
                          輸入驗證碼
                        </Typography>
                        <Typography color="text.secondary">
                          將 email 內的驗證碼或完整驗證 token 貼到這裡，就能直接完成帳號啟用。
                        </Typography>
                      </Box>

                      {verificationError ? (
                        <Alert severity="error">{verificationError}</Alert>
                      ) : null}
                      {verificationSuccessMessage ? (
                        <Alert severity="success">{verificationSuccessMessage}</Alert>
                      ) : null}

                      <TextField
                        label="驗證碼 / 驗證 Token"
                        value={verificationToken}
                        onChange={(event) => setVerificationToken(event.target.value)}
                        required
                        fullWidth
                        multiline
                        minRows={3}
                      />

                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={verificationLoading || !verificationToken.trim()}
                          fullWidth
                        >
                          {verificationLoading ? '驗證中...' : '立即驗證'}
                        </Button>
                        <Button
                          component={RouterLink}
                          to="/auth/resend-verification-email"
                          variant="outlined"
                          fullWidth
                        >
                          重寄驗證信
                        </Button>
                      </Stack>
                    </Stack>
                  ) : null}

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
                    <Button component={RouterLink} to="/auth/login" variant="outlined" fullWidth>
                      返回登入
                    </Button>
                    <Button component={RouterLink} to="/auth/verify-email" variant="text" fullWidth>
                      進入獨立驗證頁
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  )
}

export default RegisterPage
