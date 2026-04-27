import { useEffect, useState, useMemo, useCallback } from 'react'
import { TechNode, TechEdge, SimNode, NodeProgressMap } from '../types'
import { fetchNodes, fetchEdges } from '../utils/api'
import { getProgressMap, getUnlockedNodeIds, getLockedNeighborIds, completeLevel, getLastInteractedNodeId, setLastInteractedNodeId, getClusterProgress, getUnlockedClusterIds, partitionEdges } from '../utils/progressStore'
import { useAuth } from '../contexts/AuthContext'
import Graph from '../components/Graph'
import NodeDetail from '../components/NodeDetail'
import QuizDialog from '../components/QuizDialog'

export default function MainPage() {
  const { user, logout } = useAuth()
  const [allNodes, setAllNodes] = useState<TechNode[]>([])
  const [allEdges, setAllEdges] = useState<TechEdge[]>([])
  const [selectedNode, setSelectedNode] = useState<SimNode | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [quizNodeId, setQuizNodeId] = useState<string | null>(null)
  const [progressMap, setProgressMap] = useState<NodeProgressMap>({})
  const [zoomAtLimit, setZoomAtLimit] = useState(false)

  const userId = user?.id ?? 'anonymous'
  const [initialFocusNodeId] = useState(() => getLastInteractedNodeId(userId))

  useEffect(() => {
    Promise.all([fetchNodes(), fetchEdges()])
      .then(([n, e]) => {
        setAllNodes(n)
        setAllEdges(e)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // Initialize progress map once we have userId
  useEffect(() => {
    setProgressMap(getProgressMap(userId))
  }, [userId])

  const clusterProgress = useMemo(
    () => getClusterProgress(progressMap, allNodes),
    [progressMap, allNodes]
  )

  const unlockedClusters = useMemo(
    () => getUnlockedClusterIds(clusterProgress),
    [clusterProgress]
  )

  const { intraEdges } = useMemo(
    () => partitionEdges(allEdges, allNodes),
    [allEdges, allNodes]
  )

  const unlockedIds = useMemo(
    () => getUnlockedNodeIds(progressMap, intraEdges, allNodes, unlockedClusters),
    [progressMap, intraEdges, allNodes, unlockedClusters]
  )

  const lockedNeighborIds = useMemo(
    () => getLockedNeighborIds(unlockedIds, intraEdges),
    [unlockedIds, intraEdges]
  )

  const handleSelectNode = useCallback((node: SimNode | null) => {
    setSelectedNode(node)
    if (node) {
      setLastInteractedNodeId(userId, node.id)
    }
  }, [userId])

  const handleStartQuiz = useCallback((nodeId: string) => {
    setQuizNodeId(nodeId)
  }, [])

  const handleQuizComplete = useCallback((level: number, score: number, xp: number) => {
    if (!quizNodeId) return
    const updated = completeLevel(userId, quizNodeId, level, score, xp)
    setProgressMap(updated)
  }, [userId, quizNodeId])

  const quizNode = useMemo(
    () => allNodes.find(n => n.id === quizNodeId) ?? null,
    [allNodes, quizNodeId]
  )

  const handleZoomLimitReached = useCallback((atLimit: boolean) => {
    setZoomAtLimit(atLimit)
  }, [])

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <p>Loading tech tree...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="loading">
        <p className="error-text">Failed to load data: {error}</p>
        <p>Make sure the backend is running on localhost:8080</p>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1>TechTree</h1>
        <span className="subtitle">The History of Human Innovation</span>
        <div className="user-menu">
          {user?.avatarUrl && (
            <img src={user.avatarUrl} alt="" className="user-avatar" referrerPolicy="no-referrer" />
          )}
          <span className="user-name">{user?.displayName}</span>
          <button className="logout-button" onClick={logout}>Sign out</button>
        </div>
      </header>
      <Graph
        nodes={allNodes}
        edges={intraEdges}
        searchQuery=""
        selectedNodeId={selectedNode?.id ?? null}
        onSelectNode={handleSelectNode}
        unlockedIds={unlockedIds}
        lockedNeighborIds={lockedNeighborIds}
        nodeProgressMap={progressMap}
        onZoomLimitReached={handleZoomLimitReached}
        initialFocusNodeId={initialFocusNodeId}
        clusterProgress={clusterProgress}
        unlockedClusters={unlockedClusters}
      />
      {zoomAtLimit && (
        <div className="zoom-limit-overlay">
          <p>Pan in any direction to explore more</p>
        </div>
      )}
      {selectedNode && (
        <NodeDetail
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          progress={progressMap[selectedNode.id]}
          isLocked={lockedNeighborIds.has(selectedNode.id)}
          onStartQuiz={handleStartQuiz}
        />
      )}
      {quizNodeId && quizNode && (
        <QuizDialog
          nodeId={quizNodeId}
          nodeName={quizNode.name}
          progress={progressMap[quizNodeId] ?? { completedLevels: 0, levelScores: {}, totalXp: 0 }}
          onComplete={handleQuizComplete}
          onClose={() => setQuizNodeId(null)}
        />
      )}
    </div>
  )
}
