import { NodeProgress, NodeProgressMap, TechEdge } from '../types'

const STORAGE_KEY_PREFIX = 'techtree_progress_'
const OLD_STORAGE_KEY_PREFIX = 'techtree_unlocked_'

const DEFAULT_PROGRESS: NodeProgress = {
  completedLevels: 0,
  levelScores: {},
  totalXp: 0,
}

function migrateOldData(userId: string): NodeProgressMap | null {
  const oldRaw = localStorage.getItem(OLD_STORAGE_KEY_PREFIX + userId)
  if (!oldRaw) return null
  try {
    const oldIds = JSON.parse(oldRaw) as string[]
    const progressMap: NodeProgressMap = {}
    const MIGRATED_PROGRESS: NodeProgress = {
      completedLevels: 4,
      levelScores: { 1: 100, 2: 100, 3: 100, 4: 100 },
      totalXp: 250,
    }
    for (const id of oldIds) {
      progressMap[id] = { ...MIGRATED_PROGRESS }
    }
    localStorage.setItem(STORAGE_KEY_PREFIX + userId, JSON.stringify(progressMap))
    localStorage.removeItem(OLD_STORAGE_KEY_PREFIX + userId)
    return progressMap
  } catch {
    return null
  }
}

export function getProgressMap(userId: string): NodeProgressMap {
  const raw = localStorage.getItem(STORAGE_KEY_PREFIX + userId)
  if (raw) {
    try {
      return JSON.parse(raw) as NodeProgressMap
    } catch {
      // corrupted — fall through
    }
  }
  // Try migrating old format
  const migrated = migrateOldData(userId)
  if (migrated) return migrated

  // Brand-new user — fire starts at 0 completed levels
  const initial: NodeProgressMap = {
    fire: { ...DEFAULT_PROGRESS },
  }
  localStorage.setItem(STORAGE_KEY_PREFIX + userId, JSON.stringify(initial))
  return initial
}

/** Nodes the user has unlocked: fire (always) + any node whose parent has completedLevels >= 2 */
export function getUnlockedNodeIds(progressMap: NodeProgressMap, edges: TechEdge[]): Set<string> {
  const unlocked = new Set<string>(['fire'])

  // Any node in progressMap with completedLevels >= 0 that was explicitly added is "known"
  // But unlock logic: a node is unlocked if it's fire, OR if any of its parents has >= 2 completed levels
  for (const edge of edges) {
    const parentProgress = progressMap[edge.source]
    if (parentProgress && parentProgress.completedLevels >= 2) {
      unlocked.add(edge.target)
    }
  }

  // Also add fire and any node already in progressMap (handles migration)
  for (const nodeId of Object.keys(progressMap)) {
    if (progressMap[nodeId].completedLevels >= 2) {
      // This node is "mastered enough" — make sure it's unlocked
      unlocked.add(nodeId)
      // Also unlock its children
      for (const edge of edges) {
        if (edge.source === nodeId) {
          unlocked.add(edge.target)
        }
      }
    }
  }

  // Always ensure nodes in progressMap are at least accessible
  for (const nodeId of Object.keys(progressMap)) {
    unlocked.add(nodeId)
  }

  return unlocked
}

/** Locked neighbor IDs: outgoing targets of unlocked nodes that aren't themselves unlocked */
export function getLockedNeighborIds(unlockedIds: Set<string>, edges: TechEdge[]): Set<string> {
  const locked = new Set<string>()
  for (const edge of edges) {
    if (unlockedIds.has(edge.source) && !unlockedIds.has(edge.target)) {
      locked.add(edge.target)
    }
  }
  return locked
}

/** Complete a quiz level for a node, returns updated progress map */
export function completeLevel(
  userId: string,
  nodeId: string,
  level: number,
  score: number,
  xp: number,
): NodeProgressMap {
  const progressMap = getProgressMap(userId)
  const current = progressMap[nodeId] ?? { ...DEFAULT_PROGRESS }

  current.levelScores[level] = Math.max(current.levelScores[level] ?? 0, score)
  current.completedLevels = Math.max(current.completedLevels, level)
  current.totalXp += xp

  progressMap[nodeId] = current
  localStorage.setItem(STORAGE_KEY_PREFIX + userId, JSON.stringify(progressMap))
  return { ...progressMap }
}
