// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest'
import { getProgressMap, getUnlockedNodeIds, getLockedNeighborIds, completeLevel, partitionEdges, getClusterProgress, getUnlockedClusterIds, getClusterRootNodes } from './progressStore'
import { TechEdge, TechNode, Category } from '../types'

const TEST_USER = 'test-user'
const STORAGE_KEY = `techtree_progress_${TEST_USER}`
const OLD_STORAGE_KEY = `techtree_unlocked_${TEST_USER}`

function makeNode(id: string, category: Category): TechNode {
  return { id, name: id, year: 0, era: '', category, description: '', wikipediaUrl: '', thumbnailUrl: '' }
}

const nodes: TechNode[] = [
  makeNode('fire', 'prehistoric'),
  makeNode('stone-tools', 'prehistoric'),
  makeNode('bow-and-arrow', 'prehistoric'),
  makeNode('agriculture', 'neolithic'),
  makeNode('irrigation', 'neolithic'),
  makeNode('copper-smelting', 'neolithic'),
  makeNode('mathematics', 'ancient'),
]

// Intra-cluster edges only (layered pattern)
const intraEdges: TechEdge[] = [
  // prehistoric: fire → stone-tools → bow-and-arrow
  { source: 'fire', target: 'stone-tools', relationship: 'enabled' },
  { source: 'stone-tools', target: 'bow-and-arrow', relationship: 'enabled' },
  // neolithic: agriculture → irrigation, agriculture → copper-smelting
  { source: 'agriculture', target: 'irrigation', relationship: 'enabled' },
  { source: 'agriculture', target: 'copper-smelting', relationship: 'enabled' },
]

const crossEdges: TechEdge[] = [
  { source: 'fire', target: 'agriculture', relationship: 'enabled' },
]

const allEdges: TechEdge[] = [...intraEdges, ...crossEdges]

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
    localStorage.setItem(OLD_STORAGE_KEY, JSON.stringify(['fire', 'agriculture']))
    const map = getProgressMap(TEST_USER)
    expect(map.fire.completedLevels).toBe(4)
    expect(map.agriculture.completedLevels).toBe(4)
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

describe('partitionEdges', () => {
  it('splits edges by same/different category', () => {
    const result = partitionEdges(allEdges, nodes)
    expect(result.intraEdges).toHaveLength(4)
    expect(result.crossEdges).toHaveLength(1)
    expect(result.intraEdges.every(e => {
      const srcCat = nodes.find(n => n.id === e.source)!.category
      const tgtCat = nodes.find(n => n.id === e.target)!.category
      return srcCat === tgtCat
    })).toBe(true)
  })

  it('returns all as intra when all same category', () => {
    const sameNodes = [makeNode('a', 'prehistoric'), makeNode('b', 'prehistoric')]
    const sameEdges: TechEdge[] = [{ source: 'a', target: 'b', relationship: 'r' }]
    const result = partitionEdges(sameEdges, sameNodes)
    expect(result.intraEdges).toHaveLength(1)
    expect(result.crossEdges).toHaveLength(0)
  })
})

describe('getClusterProgress', () => {
  it('returns 0 for categories with no mastered nodes', () => {
    const map = { fire: { completedLevels: 1, levelScores: {}, totalXp: 25 } }
    const progress = getClusterProgress(map, nodes)
    expect(progress.get('prehistoric')).toBe(0)
  })

  it('returns correct fraction for partially mastered category', () => {
    const map = { fire: { completedLevels: 2, levelScores: {}, totalXp: 75 } }
    const progress = getClusterProgress(map, nodes)
    // prehistoric has 3 nodes (fire, stone-tools, bow-and-arrow), 1 mastered = 1/3
    expect(progress.get('prehistoric')).toBeCloseTo(1 / 3)
  })

  it('returns 1.0 for fully mastered category', () => {
    const map = {
      fire: { completedLevels: 2, levelScores: {}, totalXp: 75 },
      'stone-tools': { completedLevels: 2, levelScores: {}, totalXp: 75 },
      'bow-and-arrow': { completedLevels: 2, levelScores: {}, totalXp: 75 },
    }
    const progress = getClusterProgress(map, nodes)
    expect(progress.get('prehistoric')).toBe(1)
  })
})

describe('getUnlockedClusterIds', () => {
  it('always includes prehistoric', () => {
    const progress = new Map<Category, number>()
    const unlocked = getUnlockedClusterIds(progress)
    expect(unlocked.has('prehistoric')).toBe(true)
    expect(unlocked.size).toBe(1)
  })

  it('unlocks next cluster at >= 0.80', () => {
    const progress = new Map<Category, number>([['prehistoric', 0.8]])
    const unlocked = getUnlockedClusterIds(progress)
    expect(unlocked.has('neolithic')).toBe(true)
  })

  it('does not unlock next cluster below 0.80', () => {
    const progress = new Map<Category, number>([['prehistoric', 0.79]])
    const unlocked = getUnlockedClusterIds(progress)
    expect(unlocked.has('neolithic')).toBe(false)
  })

  it('breaks chain at first miss', () => {
    const progress = new Map<Category, number>([
      ['prehistoric', 1.0],
      ['neolithic', 0.5],
      ['ancient', 1.0],
    ])
    const unlocked = getUnlockedClusterIds(progress)
    expect(unlocked.has('prehistoric')).toBe(true)
    expect(unlocked.has('neolithic')).toBe(true) // prehistoric >= 0.8
    expect(unlocked.has('ancient')).toBe(false) // neolithic < 0.8, chain breaks
  })
})

describe('getClusterRootNodes', () => {
  it('returns nodes with no intra-cluster parents', () => {
    const roots = getClusterRootNodes('neolithic', nodes, intraEdges)
    // agriculture has no intra parents, irrigation and copper-smelting have agriculture as parent
    expect(roots).toContain('agriculture')
    expect(roots).not.toContain('irrigation')
    expect(roots).not.toContain('copper-smelting')
  })

  it('returns all nodes if no intra edges exist', () => {
    const roots = getClusterRootNodes('ancient', nodes, intraEdges)
    expect(roots).toEqual(['mathematics'])
  })
})

describe('getUnlockedNodeIds', () => {
  const prehistoricUnlocked = new Set<Category>(['prehistoric'])
  const prehistoricAndNeolithicUnlocked = new Set<Category>(['prehistoric', 'neolithic'])

  it('auto-unlocks center node of unlocked clusters', () => {
    const map = {}
    const unlocked = getUnlockedNodeIds(map, intraEdges, nodes, prehistoricUnlocked)
    expect(unlocked.has('fire')).toBe(true)
  })

  it('only center is unlocked on first login (no other nodes)', () => {
    const map = { fire: { completedLevels: 0, levelScores: {}, totalXp: 0 } }
    const unlocked = getUnlockedNodeIds(map, intraEdges, nodes, prehistoricUnlocked)
    // fire is unlocked (center), nothing else since fire has 0 levels
    expect(unlocked.has('fire')).toBe(true)
    expect(unlocked.has('stone-tools')).toBe(false)
    expect(unlocked.has('bow-and-arrow')).toBe(false)
  })

  it('does not unlock L2 children when center has < 2 levels', () => {
    const map = { fire: { completedLevels: 1, levelScores: {}, totalXp: 25 } }
    const unlocked = getUnlockedNodeIds(map, intraEdges, nodes, prehistoricUnlocked)
    expect(unlocked.has('stone-tools')).toBe(false)
  })

  it('unlocks L2 children when center has >= 2 levels', () => {
    const map = { fire: { completedLevels: 2, levelScores: {}, totalXp: 75 } }
    const unlocked = getUnlockedNodeIds(map, intraEdges, nodes, prehistoricUnlocked)
    expect(unlocked.has('stone-tools')).toBe(true)
  })

  it('unlocks L3 when L2 parent has >= 2 levels', () => {
    const map = {
      fire: { completedLevels: 2, levelScores: {}, totalXp: 75 },
      'stone-tools': { completedLevels: 2, levelScores: {}, totalXp: 75 },
    }
    const unlocked = getUnlockedNodeIds(map, intraEdges, nodes, prehistoricUnlocked)
    expect(unlocked.has('bow-and-arrow')).toBe(true)
  })

  it('does not unlock L3 when L2 parent has < 2 levels', () => {
    const map = {
      fire: { completedLevels: 2, levelScores: {}, totalXp: 75 },
      'stone-tools': { completedLevels: 1, levelScores: {}, totalXp: 25 },
    }
    const unlocked = getUnlockedNodeIds(map, intraEdges, nodes, prehistoricUnlocked)
    expect(unlocked.has('bow-and-arrow')).toBe(false)
  })

  it('auto-unlocks center of newly unlocked cluster', () => {
    const map = { fire: { completedLevels: 2, levelScores: {}, totalXp: 75 } }
    const unlocked = getUnlockedNodeIds(map, intraEdges, nodes, prehistoricAndNeolithicUnlocked)
    expect(unlocked.has('agriculture')).toBe(true)
  })

  it('locked cluster nodes stay locked even if in progressMap', () => {
    const lockedCluster = new Set<Category>(['prehistoric']) // neolithic locked
    const map = {
      fire: { completedLevels: 0, levelScores: {}, totalXp: 0 },
      agriculture: { completedLevels: 2, levelScores: {}, totalXp: 75 },
    }
    const unlocked = getUnlockedNodeIds(map, intraEdges, nodes, lockedCluster)
    // agriculture is in progressMap but neolithic is locked, so it stays locked
    expect(unlocked.has('agriculture')).toBe(false)
  })

  it('includes progressMap nodes in unlocked clusters', () => {
    const map = {
      fire: { completedLevels: 0, levelScores: {}, totalXp: 0 },
      'stone-tools': { completedLevels: 0, levelScores: {}, totalXp: 0 },
    }
    const unlocked = getUnlockedNodeIds(map, intraEdges, nodes, prehistoricUnlocked)
    // stone-tools in progressMap and prehistoric is unlocked
    expect(unlocked.has('stone-tools')).toBe(true)
  })
})

describe('getLockedNeighborIds', () => {
  it('returns targets of unlocked nodes that are not themselves unlocked', () => {
    const unlocked = new Set(['fire'])
    const locked = getLockedNeighborIds(unlocked, intraEdges)
    expect(locked.has('stone-tools')).toBe(true)
  })

  it('does not include already-unlocked targets', () => {
    const unlocked = new Set(['fire', 'stone-tools'])
    const locked = getLockedNeighborIds(unlocked, intraEdges)
    expect(locked.has('stone-tools')).toBe(false)
  })

  it('returns empty set when all neighbors are unlocked', () => {
    const unlocked = new Set(['fire', 'stone-tools', 'bow-and-arrow', 'agriculture', 'irrigation', 'copper-smelting', 'mathematics'])
    const locked = getLockedNeighborIds(unlocked, intraEdges)
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
    const updated = completeLevel(TEST_USER, 'agriculture', 1, 85, 25)
    expect(updated.agriculture).toBeDefined()
    expect(updated.agriculture.completedLevels).toBe(1)
    expect(updated.agriculture.levelScores[1]).toBe(85)
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
