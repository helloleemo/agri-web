/* eslint-disable react-refresh/only-export-components */
import { Alert, Snackbar, type AlertColor, type SnackbarCloseReason } from '@mui/material'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

interface SnackbarState {
  open: boolean
  message: string
  severity: AlertColor
}

interface ShowSnackbarOptions {
  severity?: AlertColor
}

interface SnackbarContextValue {
  showSnackbar: (message: string, options?: ShowSnackbarOptions) => void
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined)

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  })

  const showSnackbar = (message: string, options?: ShowSnackbarOptions) => {
    setSnackbarState({
      open: true,
      message,
      severity: options?.severity ?? 'success',
    })
  }

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return
    }

    setSnackbarState((prev) => ({ ...prev, open: false }))
  }

  const value = useMemo(() => ({ showSnackbar }), [])

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={2200}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbarState.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}

export const useAppSnackbar = () => {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useAppSnackbar must be used within a SnackbarProvider')
  }

  return context
}
