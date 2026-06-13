import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type AuthUser = {
  id: string
  email: string
  user_name: string
  role_id: string
  role_code: number
}

type AuthContextValue = {
  isAuthenticated: boolean
  user: AuthUser | null
  isLoginDialogOpen: boolean
  setAuthSession: (accessToken: string, nextUser: AuthUser) => void
  clearAuthSession: () => void
  openLoginDialog: () => void
  closeLoginDialog: () => void
}

const AUTH_USER_STORAGE_KEY = 'authUser'
const ACCESS_TOKEN_STORAGE_KEY = 'accessToken'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const readStoredUser = (): AuthUser | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(AUTH_USER_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser())
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)

  useEffect(() => {
    const syncSession = () => {
      setUser(readStoredUser())
    }

    window.addEventListener('storage', syncSession)
    return () => window.removeEventListener('storage', syncSession)
  }, [])

  const setAuthSession = (accessToken: string, nextUser: AuthUser) => {
    window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken)
    window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
  }

  const clearAuthSession = () => {
    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
    window.localStorage.removeItem(AUTH_USER_STORAGE_KEY)
    setUser(null)
  }

  const openLoginDialog = () => {
    setIsLoginDialogOpen(true)
  }

  const closeLoginDialog = () => {
    setIsLoginDialogOpen(false)
  }

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      user,
      isLoginDialogOpen,
      setAuthSession,
      clearAuthSession,
      openLoginDialog,
      closeLoginDialog,
    }),
    [isLoginDialogOpen, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
