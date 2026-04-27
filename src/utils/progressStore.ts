import { NodeProgress, NodeProgressMap, TechEdge, TechNode, Category, CATEGORY_ORDER, CLUSTER_CENTER_NODES } from '../types'

const STORAGE_KEY_PREFIX = 'techtree_progress_'
const OLD_STORAGE_KEY_PREFIX = 'techtree_unlocked_'
const LAST_NODE_KEY_PREFIX = 'techtree_lastnode_'

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

/** Split edges into intra-cluster (same category) and cross-cluster */
export function partitionEdges(
  edges: TechEdge[],
  nodes: TechNode[],
): { intraEdges: TechEdge[]; crossEdges: TechEdge[] } {
  const nodeCategory = new Map(nodes.map(n => [n.id, n.category]))
  const intraEdges: TechEdge[] = []
  const crossEdges: TechEdge[] = []
  for (const e of edges) {
    if (nodeCategory.get(e.source) === nodeCategory.get(e.target)) {
      intraEdges.push(e)
    } else {
      crossEdges.push(e)
    }
  }
  return { intraEdges, crossEdges }
}

/** Fraction of nodes per category with >= 2 completed quiz levels */
export function getClusterProgress(
  progressMap: NodeProgressMap,
  nodes: TechNode[],
): Map<Category, number> {
  const countByCategory = new Map<Category, number>()
  const masteredByCategory = new Map<Category, number>()

  for (const node of nodes) {
    countByCategory.set(node.category, (countByCategory.get(node.category) ?? 0) + 1)
    const progress = progressMap[node.id]
    if (progress && progress.completedLevels >= 2) {
      masteredByCategory.set(node.category, (masteredByCategory.get(node.category) ?? 0) + 1)
    }
  }

  const result = new Map<Category, number>()
  for (const [cat, total] of countByCategory) {
    result.set(cat, (masteredByCategory.get(cat) ?? 0) / total)
  }
  return result
}

/** Which clusters are unlocked — prehistoric always; subsequent unlock when previous >= 0.80, strict chain */
export function getUnlockedClusterIds(
  clusterProgress: Map<Category, number>,
): Set<Category> {
  const unlocked = new Set<Category>(['prehistoric'])
  for (let i = 1; i < CATEGORY_ORDER.length; i++) {
    const prev = CATEGORY_ORDER[i - 1]
    if ((clusterProgress.get(prev) ?? 0) >= 0.80) {
      unlocked.add(CATEGORY_ORDER[i])
    } else {
      break // strict chain — break at first miss
    }
  }
  return unlocked
}

/** Nodes in a category with no intra-cluster parents (root nodes) */
export function getClusterRootNodes(
  category: Category,
  nodes: TechNode[],
  intraEdges: TechEdge[],
): string[] {
  const categoryNodeIds = new Set(nodes.filter(n => n.category === category).map(n => n.id))
  const hasIntraParent = new Set<string>()
  for (const e of intraEdges) {
    if (categoryNodeIds.has(e.target) && categoryNodeIds.has(e.source)) {
      hasIntraParent.add(e.target)
    }
  }
  return [...categoryNodeIds].filter(id => !hasIntraParent.has(id))
}

/** Nodes the user has unlocked — cluster-aware: center auto-unlocks when cluster unlocks,
 *  then intra-edges propagate (parent ≥2 levels → children). */
export function getUnlockedNodeIds(
  progressMap: NodeProgressMap,
  intraEdges: TechEdge[],
  nodes: TechNode[],
  unlockedClusters: Set<Category>,
): Set<string> {
  const unlocked = new Set<string>()

  // Auto-unlock center node of each unlocked cluster
  for (const cat of unlockedClusters) {
    const centerNodeId = CLUSTER_CENTER_NODES[cat]
    if (centerNodeId) {
      unlocked.add(centerNodeId)
    }
  }

  // Edge propagation via intra-edges only: parent with >= 2 completed levels → children unlock
  // Iterate until stable (handles transitive chains)
  let changed = true
  while (changed) {
    changed = false
    for (const edge of intraEdges) {
      if (unlocked.has(edge.target)) continue
      const parentProgress = progressMap[edge.source]
      if (unlocked.has(edge.source) && parentProgress && parentProgress.completedLevels >= 2) {
        unlocked.add(edge.target)
        changed = true
      }
    }
  }

  // Nodes already in progressMap stay accessible (handles migration)
  for (const nodeId of Object.keys(progressMap)) {
    // Only keep nodes that belong to unlocked clusters
    const node = nodes.find(n => n.id === nodeId)
    if (node && unlockedClusters.has(node.category)) {
      unlocked.add(nodeId)
    }
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

export function getLastInteractedNodeId(userId: string): string | null {
  return localStorage.getItem(LAST_NODE_KEY_PREFIX + userId)
}

export function setLastInteractedNodeId(userId: string, nodeId: string): void {
  localStorage.setItem(LAST_NODE_KEY_PREFIX + userId, nodeId)
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
