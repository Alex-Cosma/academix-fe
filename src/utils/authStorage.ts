import { API_BASE, AUTH_STORAGE_KEY } from './constants'

export interface StoredAuth {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    displayName: string
    avatarUrl: string | null
    authProvider: string
  }
}

export function getStoredAuth(): StoredAuth | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredAuth
  } catch {
    return null
  }
}

export function setStoredAuth(auth: StoredAuth): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
}

export function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export async function refreshTokens(refreshToken: string): Promise<StoredAuth | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    if (!res.ok) return null
    const data = await res.json()
    const auth: StoredAuth = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
    }
    setStoredAuth(auth)
    return auth
  } catch {
    return null
  }
}
