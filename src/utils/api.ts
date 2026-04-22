import { TechNode, TechEdge } from '../types'
import { API_BASE } from './constants'
import { getStoredAuth, clearStoredAuth, refreshTokens } from './authStorage'

function getAuthHeaders(): HeadersInit {
  const stored = getStoredAuth()
  if (stored?.accessToken) {
    return { Authorization: `Bearer ${stored.accessToken}` }
  }
  return {}
}

async function tryRefreshAndRetry(path: string): Promise<Response | null> {
  const stored = getStoredAuth()
  if (!stored?.refreshToken) return null

  const refreshed = await refreshTokens(stored.refreshToken)
  if (!refreshed) return null

  return fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${refreshed.accessToken}` },
  })
}

async function authFetch(path: string): Promise<Response> {
  let res = await fetch(`${API_BASE}${path}`, {
    headers: getAuthHeaders(),
  })

  if (res.status === 401) {
    const retried = await tryRefreshAndRetry(path)
    if (retried) res = retried
  }

  if (res.status === 401) {
    clearStoredAuth()
    window.location.href = '/login'
    throw new Error('Session expired')
  }

  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res
}

export async function fetchNodes(): Promise<TechNode[]> {
  const res = await authFetch('/nodes')
  return res.json()
}

export async function fetchEdges(): Promise<TechEdge[]> {
  const res = await authFetch('/edges')
  return res.json()
}
