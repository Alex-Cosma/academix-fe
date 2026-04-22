// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest'
import { getProgressMap, getUnlockedNodeIds, getLockedNeighborIds, completeLevel } from './progressStore'
import { TechEdge } from '../types'

const TEST_USER = 'test-user'
const STORAGE_KEY = `techtree_progress_${TEST_USER}`
const OLD_STORAGE_KEY = `techtree_unlocked_${TEST_USER}`

const edges: TechEdge[] = [
  { source: 'fire', target: 'pottery', relationship: 'enabled' },
  { source: 'fire', target: 'copper-smelting', relationship: 'enabled' },
  { source: 'pottery', target: 'glass', relationship: 'enabled' },
]

beforeEach(() => {
  localStorage.clear()
})

describe('getProgressMap', () => {
  it('returns initial map with fire for new user', () => {
    const map = getProgressMap(TEST_USER)
    expect(map).toHaveProperty('fire')
    expect(map.fire.completedLevels).toBe(0)
    expect(map.fire.totalXp).toBe(0)
  })

  it('persists initial map to localStorage', () => {
    getProgressMap(TEST_USER)
    const raw = localStorage.getItem(STORAGE_KEY)
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw!)
    expect(parsed.fire).toBeDefined()
  })

  it('returns existing map from localStorage', () => {
    const existing = { fire: { completedLevels: 3, levelScores: { 1: 90 }, totalXp: 150 } }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
    const map = getProgressMap(TEST_USER)
    expect(map.fire.completedLevels).toBe(3)
    expect(map.fire.totalXp).toBe(150)
  })

  it('migrates old format data', () => {
    localStorage.setItem(OLD_STORAGE_KEY, JSON.stringify(['fire', 'pottery']))
    const map = getProgressMap(TEST_USER)
    expect(map.fire.completedLevels).toBe(4)
    expect(map.pottery.completedLevels).toBe(4)
    // Old key should be removed
    expect(localStorage.getItem(OLD_STORAGE_KEY)).toBeNull()
    // New key should exist
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull()
  })

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json!')
    const map = getProgressMap(TEST_USER)
    // Falls through to default
    expect(map).toHaveProperty('fire')
    expect(map.fire.completedLevels).toBe(0)
  })
})

describe('getUnlockedNodeIds', () => {
  it('always includes fire', () => {
    const map = { fire: { completedLevels: 0, levelScores: {}, totalXp: 0 } }
    const unlocked = getUnlockedNodeIds(map, edges)
    expect(unlocked.has('fire')).toBe(true)
  })

  it('does not unlock children when fire has < 2 levels', () => {
    const map = { fire: { completedLevels: 1, levelScores: {}, totalXp: 25 } }
    const unlocked = getUnlockedNodeIds(map, edges)
    expect(unlocked.has('pottery')).toBe(false)
    expect(unlocked.has('copper-smelting')).toBe(false)
  })

  it('unlocks children when parent has >= 2 levels', () => {
    const map = { fire: { completedLevels: 2, levelScores: {}, totalXp: 75 } }
    const unlocked = getUnlockedNodeIds(map, edges)
    expect(unlocked.has('pottery')).toBe(true)
    expect(unlocked.has('copper-smelting')).toBe(true)
  })

  it('unlocks grandchildren transitively', () => {
    const map = {
      fire: { completedLevels: 2, levelScores: {}, totalXp: 75 },
      pottery: { completedLevels: 2, levelScores: {}, totalXp: 75 },
    }
    const unlocked = getUnlockedNodeIds(map, edges)
    expect(unlocked.has('glass')).toBe(true)
  })

  it('includes all nodes in progressMap as accessible', () => {
    const map = {
      fire: { completedLevels: 0, levelScores: {}, totalXp: 0 },
      pottery: { completedLevels: 0, levelScores: {}, totalXp: 0 },
    }
    const unlocked = getUnlockedNodeIds(map, edges)
    expect(unlocked.has('pottery')).toBe(true)
  })
})

describe('getLockedNeighborIds', () => {
  it('returns targets of unlocked nodes that are not themselves unlocked', () => {
    const unlocked = new Set(['fire'])
    const locked = getLockedNeighborIds(unlocked, edges)
    expect(locked.has('pottery')).toBe(true)
    expect(locked.has('copper-smelting')).toBe(true)
  })

  it('does not include already-unlocked targets', () => {
    const unlocked = new Set(['fire', 'pottery'])
    const locked = getLockedNeighborIds(unlocked, edges)
    expect(locked.has('pottery')).toBe(false)
    expect(locked.has('glass')).toBe(true)
  })

  it('returns empty set when all neighbors are unlocked', () => {
    const unlocked = new Set(['fire', 'pottery', 'copper-smelting', 'glass'])
    const locked = getLockedNeighborIds(unlocked, edges)
    expect(locked.size).toBe(0)
  })
})

describe('completeLevel', () => {
  it('records level completion and xp', () => {
    getProgressMap(TEST_USER) // initialize
    const updated = completeLevel(TEST_USER, 'fire', 1, 80, 25)
    expect(updated.fire.completedLevels).toBe(1)
    expect(updated.fire.levelScores[1]).toBe(80)
    expect(updated.fire.totalXp).toBe(25)
  })

  it('keeps higher score on replay', () => {
    getProgressMap(TEST_USER)
    completeLevel(TEST_USER, 'fire', 1, 90, 25)
    const updated = completeLevel(TEST_USER, 'fire', 1, 70, 25)
    expect(updated.fire.levelScores[1]).toBe(90) // kept the higher score
  })

  it('does not decrease completedLevels', () => {
    getProgressMap(TEST_USER)
    completeLevel(TEST_USER, 'fire', 2, 80, 50)
    const updated = completeLevel(TEST_USER, 'fire', 1, 100, 25)
    expect(updated.fire.completedLevels).toBe(2) // stays at 2
  })

  it('creates progress for a new node', () => {
    getProgressMap(TEST_USER)
    const updated = completeLevel(TEST_USER, 'pottery', 1, 85, 25)
    expect(updated.pottery).toBeDefined()
    expect(updated.pottery.completedLevels).toBe(1)
    expect(updated.pottery.levelScores[1]).toBe(85)
  })

  it('persists to localStorage', () => {
    getProgressMap(TEST_USER)
    completeLevel(TEST_USER, 'fire', 1, 80, 25)
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(raw.fire.completedLevels).toBe(1)
  })

  it('accumulates xp across levels', () => {
    getProgressMap(TEST_USER)
    completeLevel(TEST_USER, 'fire', 1, 80, 25)
    const updated = completeLevel(TEST_USER, 'fire', 2, 90, 50)
    expect(updated.fire.totalXp).toBe(75)
  })
})
