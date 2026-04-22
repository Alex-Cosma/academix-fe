import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { API_BASE } from '../utils/constants'
import { getStoredAuth, setStoredAuth, clearStoredAuth, refreshTokens, StoredAuth } from '../utils/authStorage'

interface User {
  id: string
  email: string
  displayName: string
  avatarUrl: string | null
  authProvider: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  loading: boolean
}

interface AuthContextValue extends AuthState {
  login: (googleAccessToken: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function tryRestoreSession(stored: StoredAuth): Promise<StoredAuth | null> {
  // Try access token first
  if (stored.accessToken) {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${stored.accessToken}` },
      })
      if (res.ok) return stored
    } catch {
      // Network error — fall through to refresh
    }
  }
  // Access token expired or failed — try refresh
  if (stored.refreshToken) {
    return refreshTokens(stored.refreshToken)
  }
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    loading: true,
  })

  useEffect(() => {
    const stored = getStoredAuth()
    if (!stored) {
      setState(s => ({ ...s, loading: false }))
      return
    }

    tryRestoreSession(stored).then(result => {
      if (result) {
        setState({ user: result.user, accessToken: result.accessToken, loading: false })
      } else {
        clearStoredAuth()
        setState({ user: null, accessToken: null, loading: false })
      }
    })
  }, [])

  const login = useCallback(async (googleAccessToken: string) => {
    const res = await fetch(`${API_BASE}/auth/oauth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: googleAccessToken }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Login failed' }))
      throw new Error(err.message || 'Login failed')
    }

    const data = await res.json()
    const auth: StoredAuth = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
    }
    setStoredAuth(auth)
    setState({ user: auth.user, accessToken: auth.accessToken, loading: false })
  }, [])

  const logout = useCallback(() => {
    clearStoredAuth()
    setState({ user: null, accessToken: null, loading: false })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
