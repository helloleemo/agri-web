import { CircularProgress, Dialog, Stack } from '@mui/material'

interface LoadingDialogProps {
  open: boolean
}

const LoadingDialog = ({ open }: LoadingDialogProps) => {
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            px: 3,
            py: 4,
            bgcolor: 'background.paper',
            opacity: 0.9,
          },
        },
      }}
    >
      <Stack sx={{ alignItems: 'center', justifyContent: 'center', minHeight: 120 }}>
        <CircularProgress size={40} thickness={4} />
      </Stack>
    </Dialog>
  )
}

export default LoadingDialog
