import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  fetchCurrentUser,
  login as loginRequest,
  register as registerRequest,
} from '../api/authApi'
import { clearTokens, hasStoredTokens, setTokens } from '../api/tokenStorage'

const AuthContext = createContext(null)

function applyAuthResponse(data, setUser, setLoginOpen) {
  setTokens({ access: data.access, refresh: data.refresh })
  setUser(data.user)
  setLoginOpen(false)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loginOpen, setLoginOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [accountOpen, setAccountOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  const clearAuthErrors = useCallback(() => {
    setError(null)
    setFieldErrors({})
  }, [])

  const bootstrap = useCallback(async () => {
    if (!hasStoredTokens()) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const currentUser = await fetchCurrentUser()
      setUser(currentUser)
    } catch {
      clearTokens()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  const login = useCallback(async ({ login: loginValue, password }) => {
    setActionLoading(true)
    clearAuthErrors()
    try {
      const data = await loginRequest({ login: loginValue, password })
      applyAuthResponse(data, setUser, setLoginOpen)
      return data.user
    } catch (err) {
      setError(err.message)
      setFieldErrors(err.fieldErrors ?? {})
      throw err
    } finally {
      setActionLoading(false)
    }
  }, [clearAuthErrors])

  const register = useCallback(
    async ({ username, email, password, password_confirm }) => {
      setActionLoading(true)
      clearAuthErrors()
      try {
        const data = await registerRequest({
          username,
          email,
          password,
          password_confirm,
        })
        applyAuthResponse(data, setUser, setLoginOpen)
        return data.user
      } catch (err) {
        setError(err.message)
        setFieldErrors(err.fieldErrors ?? {})
        throw err
      } finally {
        setActionLoading(false)
      }
    },
    [clearAuthErrors],
  )

  const logout = useCallback(() => {
    clearTokens()
    setUser(null)
    setAccountOpen(false)
    setLoginOpen(false)
    setAuthMode('login')
    clearAuthErrors()
  }, [clearAuthErrors])

  const openLogin = useCallback(() => {
    setAccountOpen(false)
    setAuthMode('login')
    setLoginOpen(true)
    clearAuthErrors()
  }, [clearAuthErrors])

  const closeLogin = useCallback(() => {
    setLoginOpen(false)
    setAuthMode('login')
    clearAuthErrors()
  }, [clearAuthErrors])

  const switchToRegister = useCallback(() => {
    setAuthMode('register')
    clearAuthErrors()
  }, [clearAuthErrors])

  const switchToLogin = useCallback(() => {
    setAuthMode('login')
    clearAuthErrors()
  }, [clearAuthErrors])

  const toggleAccount = useCallback(() => {
    setAccountOpen((prev) => !prev)
    setLoginOpen(false)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      actionLoading,
      error,
      fieldErrors,
      loginOpen,
      authMode,
      accountOpen,
      login,
      register,
      logout,
      openLogin,
      closeLogin,
      switchToRegister,
      switchToLogin,
      clearFieldErrors: clearAuthErrors,
      toggleAccount,
      setAccountOpen,
    }),
    [
      user,
      loading,
      actionLoading,
      error,
      fieldErrors,
      loginOpen,
      authMode,
      accountOpen,
      login,
      register,
      logout,
      openLogin,
      closeLogin,
      switchToRegister,
      switchToLogin,
      clearAuthErrors,
      toggleAccount,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
