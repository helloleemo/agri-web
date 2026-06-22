import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  confirmColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
  onConfirm: () => void
  onClose: () => void
}

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmText = '確認',
  cancelText = '取消',
  loading = false,
  confirmColor = 'primary',
  onConfirm,
  onClose,
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      {description && (
        <DialogContent>
          <Typography color="text.secondary">{description}</Typography>
        </DialogContent>
      )}
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} disabled={loading} variant="outlined">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} disabled={loading} variant="contained" color={confirmColor}>
          {loading ? '處理中...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
