// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest'
import { getStoredAuth, setStoredAuth, clearStoredAuth, StoredAuth } from './authStorage'

const mockAuth: StoredAuth = {
  accessToken: 'access-123',
  refreshToken: 'refresh-456',
  user: {
    id: 'user-1',
    email: 'test@example.com',
    displayName: 'Test User',
    avatarUrl: null,
    authProvider: 'GOOGLE',
  },
}

beforeEach(() => {
  localStorage.clear()
})

describe('authStorage', () => {
  it('returns null when nothing stored', () => {
    expect(getStoredAuth()).toBeNull()
  })

  it('stores and retrieves auth data', () => {
    setStoredAuth(mockAuth)
    const retrieved = getStoredAuth()
    expect(retrieved).toEqual(mockAuth)
  })

  it('clears auth data', () => {
    setStoredAuth(mockAuth)
    clearStoredAuth()
    expect(getStoredAuth()).toBeNull()
  })

  it('returns null for corrupted data', () => {
    localStorage.setItem('techtree_auth', '{bad json')
    expect(getStoredAuth()).toBeNull()
  })
})
