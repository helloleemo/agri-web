import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded'
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { usersService } from '@/api'
import { useAuth } from '@/contexts/AuthContext'
import { useAppSnackbar } from '@/contexts/SnackbarContext'
import PATHS from '@/routes/paths'

const ChangePasswordPage = () => {
  const navigate = useNavigate()
  const { showSnackbar } = useAppSnackbar()
  const { isAuthenticated, user } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const confirmPasswordError = useMemo(() => {
    if (!confirmPassword) {
      return ''
    }

    if (newPassword !== confirmPassword) {
      return '新密碼與確認密碼不一致'
    }

    return ''
  }, [confirmPassword, newPassword])

  const newPasswordError = useMemo(() => {
    if (!newPassword) {
      return ''
    }

    if (newPassword.length < 8) {
      return '新密碼至少需要 8 碼'
    }

    if (newPassword === currentPassword) {
      return '新密碼不可與目前密碼相同'
    }

    return ''
  }, [currentPassword, newPassword])

  const handleSubmit = async () => {
    if (!isAuthenticated || !user) {
      navigate(`/${PATHS.auth.root}/${PATHS.auth.login}`, { replace: true })
      return
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('請完整填寫所有欄位')
      return
    }

    if (newPasswordError || confirmPasswordError) {
      return
    }

    try {
      setLoading(true)
      setError('')
      await usersService.changePassword(user.id, {
        current_password: currentPassword,
        new_password: newPassword,
      })

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      showSnackbar('密碼已更新', { severity: 'success' })
    } catch (err) {
      setError(err instanceof Error ? err.message : '更改密碼失敗')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <Box sx={{ py: 8 }}>
        <Container maxWidth="sm">
          <Alert severity="warning">請先登入會員再更改密碼</Alert>
        </Container>
      </Box>
    )
  }

  return (
    <Box component="main" sx={{ py: { xs: 5, md: 7 } }}>
      <Container maxWidth="sm">
        <Breadcrumbs sx={{ mb: 4, color: 'text.secondary', fontSize: '0.82rem' }}>
          <Typography
            component={RouterLink}
            to={PATHS.root}
            sx={{ color: 'inherit', textDecoration: 'none' }}
          >
            首頁
          </Typography>
          <Typography color="text.primary">更改密碼</Typography>
        </Breadcrumbs>

        <Paper sx={{ p: { xs: 2.4, md: 3.2 } }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2.5 }}>
            <LockResetRoundedIcon color="primary" />
            <Typography variant="h5">更改密碼</Typography>
          </Stack>

          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              type="password"
              label="目前密碼"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              autoComplete="current-password"
              fullWidth
            />

            <TextField
              type="password"
              label="新密碼"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              fullWidth
              error={Boolean(newPasswordError)}
              helperText={newPasswordError || '至少 8 碼，且不可與目前密碼相同'}
            />

            <TextField
              type="password"
              label="確認新密碼"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              fullWidth
              error={Boolean(confirmPasswordError)}
              helperText={confirmPasswordError || '再次輸入新密碼'}
            />

            <Stack direction="row" spacing={1.2} sx={{ justifyContent: 'flex-end', pt: 1 }}>
              <Button
                variant="text"
                color="inherit"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                取消
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || Boolean(newPasswordError) || Boolean(confirmPasswordError)}
              >
                {loading ? '更新中...' : '更新密碼'}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}

export default ChangePasswordPage
