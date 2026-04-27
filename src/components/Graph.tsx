import { useEffect, useRef, useCallback } from 'react'
import * as d3 from 'd3'
import { TechNode, TechEdge, SimNode, SimEdge, CATEGORY_COLORS, CATEGORY_CENTERS, CATEGORY_LABELS, Category, NodeProgressMap, ClusterData, CLUSTER_EDGES, CLUSTER_CENTER_NODES } from '../types'
import { NODE_ICONS, getCategoryFallbackIcon } from '../utils/nodeIcons'
import { formatYear } from '../utils/formatYear'
import { computeClusterData, rayHullIntersection } from '../utils/clusterGeometry'

interface Props {
  nodes: TechNode[]
  edges: TechEdge[]
  searchQuery: string
  selectedNodeId: string | null
  onSelectNode: (node: SimNode | null) => void
  unlockedIds: Set<string>
  lockedNeighborIds: Set<string>
  nodeProgressMap?: NodeProgressMap
  onZoomLimitReached?: (atLimit: boolean) => void
  initialFocusNodeId?: string | null
  clusterProgress?: Map<Category, number>
  unlockedClusters?: Set<Category>
}

const NODE_RADIUS = 70
const ICON_SIZE = 80
const MIN_ZOOM = 0.25
const MAX_ZOOM = 8
const VIEWPORT_PADDING = 200 // world-space pixels
const VIEWPORT_DEBOUNCE_MS = 100

export default function Graph({
  nodes, edges, searchQuery, selectedNodeId, onSelectNode,
  unlockedIds, lockedNeighborIds, nodeProgressMap, onZoomLimitReached,
  initialFocusNodeId, clusterProgress, unlockedClusters,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const simNodesRef = useRef<SimNode[]>([])
  const allSimEdgesRef = useRef<SimEdge[]>([])
  const gRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null)
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wasAtLimitRef = useRef(false)
  const forceRebuildRef = useRef(false)
  const isInitialMountRef = useRef(true)
  const clusterDataRef = useRef<Map<Category, ClusterData>>(new Map())

  // Store latest props in refs so render functions always see current values
  const unlockedIdsRef = useRef(unlockedIds)
  const lockedNeighborIdsRef = useRef(lockedNeighborIds)
  const nodeProgressMapRef = useRef(nodeProgressMap)
  const searchQueryRef = useRef(searchQuery)
  const selectedNodeIdRef = useRef(selectedNodeId)
  const onSelectNodeRef = useRef(onSelectNode)
  const clusterProgressRef = useRef(clusterProgress)
  const unlockedClustersRef = useRef(unlockedClusters)

  useEffect(() => { unlockedIdsRef.current = unlockedIds }, [unlockedIds])
  useEffect(() => { lockedNeighborIdsRef.current = lockedNeighborIds }, [lockedNeighborIds])
  useEffect(() => { nodeProgressMapRef.current = nodeProgressMap }, [nodeProgressMap])
  useEffect(() => { searchQueryRef.current = searchQuery }, [searchQuery])
  useEffect(() => { selectedNodeIdRef.current = selectedNodeId }, [selectedNodeId])
  useEffect(() => { onSelectNodeRef.current = onSelectNode }, [onSelectNode])
  useEffect(() => { clusterProgressRef.current = clusterProgress }, [clusterProgress])
  useEffect(() => { unlockedClustersRef.current = unlockedClusters }, [unlockedClusters])

  // Mark nodes/edges for full rebuild when progress or unlock state changes
  useEffect(() => {
    if (isInitialMountRef.current) return
    forceRebuildRef.current = true
  }, [unlockedIds, lockedNeighborIds, nodeProgressMap])

  const getConnectionCount = useCallback((nodeId: string) => {
    return edges.filter(e => e.source === nodeId || e.target === nodeId).length
  }, [edges])

  // Helper: is a node locked (not unlocked, not a locked neighbor = distant locked)
  const isLocked = useCallback((id: string) => {
    return !unlockedIdsRef.current.has(id)
  }, [])

  const isLockedNeighbor = useCallback((id: string) => {
    return lockedNeighborIdsRef.current.has(id)
  }, [])

  // Helper: get node opacity based on lock status and search
  const getNodeOpacity = useCallback((d: SimNode) => {
    const query = searchQueryRef.current.toLowerCase().trim()
    const locked = isLocked(d.id)
    const neighbor = isLockedNeighbor(d.id)

    if (locked && !neighbor) {
      // Distant locked node
      return query ? 0.05 : 0.5
    }
    if (neighbor) {
      // Locked neighbor
      return query ? 0.1 : 0.65
    }
    // Unlocked
    if (!query) return 1
    const match = d.name.toLowerCase().includes(query) ||
      d.category.toLowerCase().includes(query) ||
      d.era.toLowerCase().includes(query)
    return match ? 1 : 0.15
  }, [isLocked, isLockedNeighbor])

  // Helper: get edge styling
  const getEdgeColor = useCallback((srcId: string, tgtId: string) => {
    if (isLocked(srcId) || isLocked(tgtId)) return '#bbb'
    return '#c0c0c0'
  }, [isLocked])

  const getEdgeOpacity = useCallback((srcId: string, tgtId: string) => {
    const query = searchQueryRef.current.toLowerCase().trim()
    if (query) return 0.1
    if (isLocked(srcId) || isLocked(tgtId)) return 0.6
    return 0.8
  }, [isLocked])

  const getEdgeDashArray = useCallback((srcId: string, tgtId: string) => {
    if (isLocked(srcId) || isLocked(tgtId)) return '4 4'
    return 'none'
  }, [isLocked])

  // Highlight edges connected to a set of node IDs (boost opacity by 50%)
  const highlightEdges = useCallback((nodeIds: Set<string>) => {
    const g = gRef.current
    if (!g) return
    g.select('.links').selectAll<SVGPathElement, SimEdge>('path')
      .each(function (d) {
        const srcId = (d.source as SimNode).id
        const tgtId = (d.target as SimNode).id
        if (nodeIds.has(srcId) || nodeIds.has(tgtId)) {
          const baseOpacity = getEdgeOpacity(srcId, tgtId)
          d3.select(this)
            .transition().duration(200)
            .attr('stroke-opacity', Math.min(1, baseOpacity * 1.5))
            .attr('stroke-width', 2.5)
        }
      })
  }, [getEdgeOpacity])

  const restoreEdges = useCallback(() => {
    const g = gRef.current
    if (!g) return
    g.select('.links').selectAll<SVGPathElement, SimEdge>('path')
      .transition().duration(300)
      .attr('stroke-opacity', d => {
        const srcId = (d.source as SimNode).id
        const tgtId = (d.target as SimNode).id
        return getEdgeOpacity(srcId, tgtId)
      })
      .attr('stroke-width', 1.5)
  }, [getEdgeOpacity])

  // Append all visuals to a node group
  const appendNodeVisuals = useCallback((enter: d3.Selection<SVGGElement, SimNode, SVGGElement, unknown>) => {
    const locked = unlockedIdsRef.current
    const lockedNeighbors = lockedNeighborIdsRef.current
    const progressMap = nodeProgressMapRef.current

    // Background circle
    enter.append('circle')
      .attr('r', NODE_RADIUS)
      .attr('fill', d => {
        if (!locked.has(d.id)) return '#f5f5f5'
        const color = CATEGORY_COLORS[d.category as Category] || '#999'
        return color + '1A'
      })
      .attr('stroke', d => {
        if (!locked.has(d.id)) return '#ccc'
        return CATEGORY_COLORS[d.category as Category] || '#999'
      })
      .attr('stroke-width', d => !locked.has(d.id) ? 2 : 3)
      .attr('stroke-dasharray', d => !locked.has(d.id) ? '6 4' : 'none')

    // Icon image
    enter.append('image')
      .attr('href', d => NODE_ICONS[d.id] ?? getCategoryFallbackIcon(d.category))
      .attr('x', -ICON_SIZE / 2)
      .attr('y', -ICON_SIZE / 2)
      .attr('width', ICON_SIZE)
      .attr('height', ICON_SIZE)
      .attr('clip-path', d => `url(#clip-${d.id})`)
      .attr('pointer-events', 'none')
      .attr('filter', d => !locked.has(d.id) ? 'url(#grayscale)' : null)

    // Lock icon overlay for locked nodes
    enter.filter(d => !locked.has(d.id))
      .append('text')
      .attr('class', 'lock-icon')
      .attr('text-anchor', 'middle')
      .attr('dy', 6)
      .attr('font-size', 28)
      .attr('pointer-events', 'none')
      .text('\uD83D\uDD12')

    // Progress dots (4 dots above each node) — only for unlocked and locked neighbors
    const dotSpacing = 14
    const dotRadius = 4
    const dotsY = -(NODE_RADIUS + 16)
    const dotsStartX = -((4 - 1) * dotSpacing) / 2

    enter.each(function (d) {
      const isDistantLocked = !locked.has(d.id) && !lockedNeighbors.has(d.id)
      if (isDistantLocked) return // No dots for distant locked nodes

      const group = d3.select(this)
      const progress = progressMap?.[d.id]
      const completedLevels = progress?.completedLevels ?? 0
      const nodeColor = CATEGORY_COLORS[d.category as Category] || '#999'
      const isNodeLocked = !locked.has(d.id)

      for (let i = 0; i < 4; i++) {
        const isCompleted = i < completedLevels
        const isNext = i === completedLevels && completedLevels < 4 && !isNodeLocked

        group.append('circle')
          .attr('class', 'progress-dot')
          .attr('cx', dotsStartX + i * dotSpacing)
          .attr('cy', dotsY)
          .attr('r', dotRadius)
          .attr('fill', isCompleted ? nodeColor : (isNodeLocked ? '#ddd' : '#e0e0e0'))
          .attr('stroke', isNext ? nodeColor : 'none')
          .attr('stroke-width', isNext ? 2 : 0)
          .attr('pointer-events', 'none')
      }
    })

    // Name label
    enter.append('text')
      .attr('class', 'node-name')
      .text(d => d.name)
      .attr('font-size', 16)
      .attr('font-weight', 600)
      .attr('fill', d => !locked.has(d.id) ? '#bbb' : '#333')
      .attr('text-anchor', 'middle')
      .attr('dy', NODE_RADIUS + 20)
      .attr('pointer-events', 'none')

    // Year label
    enter.append('text')
      .attr('class', 'node-year')
      .text(d => formatYear(d.year))
      .attr('font-size', 11)
      .attr('fill', d => !locked.has(d.id) ? '#ccc' : '#999')
      .attr('text-anchor', 'middle')
      .attr('dy', NODE_RADIUS + 36)
      .attr('pointer-events', 'none')
  }, [])

  // Render nodes with D3 join transitions
  const renderNodes = useCallback((viewportNodes: SimNode[]) => {
    const g = gRef.current
    if (!g) return

    const nodesGroup = g.select<SVGGElement>('.nodes')

    nodesGroup.selectAll<SVGGElement, SimNode>('g')
      .data(viewportNodes, d => d.id)
      .join(
        enter => {
          const group = enter.append('g')
            .attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`)
            .attr('cursor', d => isLocked(d.id) && !isLockedNeighbor(d.id) ? 'default' :
              isLockedNeighbor(d.id) ? 'default' : 'pointer')
            .attr('opacity', 0)
            .on('click', (_event, d) => {
              if (isLocked(d.id)) return
              onSelectNodeRef.current(d)
            })
            .on('mouseenter', (_event, d) => {
              if (isLocked(d.id)) return
              highlightEdges(new Set([d.id]))
            })
            .on('mouseleave', (_event, d) => {
              if (isLocked(d.id)) return
              restoreEdges()
            })

          appendNodeVisuals(group)

          group.transition()
            .duration(1000)
            .attr('opacity', d => getNodeOpacity(d))

          return group
        },
        update => {
          update
            .attr('cursor', d => isLocked(d.id) ? 'default' : 'pointer')
            .transition()
            .duration(300)
            .attr('opacity', d => getNodeOpacity(d))

          // Update stroke for selection/search
          update.each(function (d) {
            if (isLocked(d.id)) return
            const group = d3.select(this)
            const circle = group.select('circle')
            const query = searchQueryRef.current.toLowerCase().trim()
            if (d.id === selectedNodeIdRef.current) {
              circle.attr('stroke', '#333').attr('stroke-width', 4)
            } else if (query && d.name.toLowerCase().includes(query)) {
              circle.attr('stroke', '#333').attr('stroke-width', 3.5)
            } else {
              circle
                .attr('stroke', CATEGORY_COLORS[d.category as Category] || '#999')
                .attr('stroke-width', 3)
            }
          })

          return update
        },
        exit => {
          exit.transition()
            .duration(300)
            .attr('opacity', 0)
            .remove()
        }
      )
  }, [isLocked, isLockedNeighbor, getNodeOpacity, appendNodeVisuals, highlightEdges, restoreEdges])

  // Compute a curved edge path (quadratic bezier offset perpendicular to the edge)
  const computeEdgePath = useCallback((d: SimEdge): string => {
    const x1 = (d.source as SimNode).x ?? 0
    const y1 = (d.source as SimNode).y ?? 0
    const x2 = (d.target as SimNode).x ?? 0
    const y2 = (d.target as SimNode).y ?? 0
    const dx = x2 - x1
    const dy = y2 - y1
    const len = Math.sqrt(dx * dx + dy * dy)
    if (len < 1) return `M${x1},${y1}L${x2},${y2}`

    // Control point offset perpendicular to midpoint (15% of edge length)
    const offset = len * 0.15
    const mx = (x1 + x2) / 2
    const my = (y1 + y2) / 2
    const cx = mx + offset * (-dy / len)
    const cy = my + offset * (dx / len)

    return `M${x1},${y1}Q${cx},${cy} ${x2},${y2}`
  }, [])

  // Render edges with D3 join transitions
  const renderEdges = useCallback((viewportEdges: SimEdge[]) => {
    const g = gRef.current
    if (!g) return

    const linksGroup = g.select<SVGGElement>('.links')

    linksGroup.selectAll<SVGPathElement, SimEdge>('path')
      .data(viewportEdges, d => {
        const srcId = typeof d.source === 'string' ? d.source : d.source.id
        const tgtId = typeof d.target === 'string' ? d.target : d.target.id
        return `${srcId}-${tgtId}`
      })
      .join(
        enter => {
          return enter.append('path')
            .attr('d', d => computeEdgePath(d))
            .attr('fill', 'none')
            .attr('stroke', d => {
              const srcId = (d.source as SimNode).id
              const tgtId = (d.target as SimNode).id
              return getEdgeColor(srcId, tgtId)
            })
            .attr('stroke-width', 1.5)
            .attr('stroke-opacity', 0)
            .attr('stroke-dasharray', d => {
              const srcId = (d.source as SimNode).id
              const tgtId = (d.target as SimNode).id
              return getEdgeDashArray(srcId, tgtId)
            })
            .call(sel => sel.transition()
              .duration(800)
              .attr('stroke-opacity', d => {
                const srcId = (d.source as SimNode).id
                const tgtId = (d.target as SimNode).id
                return getEdgeOpacity(srcId, tgtId)
              })
            )
        },
        update => {
          update.transition()
            .duration(300)
            .attr('stroke-opacity', d => {
              const srcId = (d.source as SimNode).id
              const tgtId = (d.target as SimNode).id
              return getEdgeOpacity(srcId, tgtId)
            })
          return update
        },
        exit => {
          exit.transition()
            .duration(300)
            .attr('stroke-opacity', 0)
            .remove()
        }
      )
  }, [getEdgeColor, getEdgeOpacity, getEdgeDashArray])

  // Render cluster boundaries (called once after simulation)
  const renderClusters = useCallback((
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    clusterData: Map<Category, ClusterData>,
  ) => {
    const clustersGroup = g.select<SVGGElement>('.clusters')
    let delay = 0

    for (const [category, data] of clusterData) {
      const color = CATEGORY_COLORS[category] || '#999'
      const clusterG = clustersGroup.append('g').attr('class', `cluster-${category}`)

      // Layer 1: Glow path (wide blurred stroke for gradient-like effect)
      clusterG.append('path')
        .attr('class', 'cluster-glow')
        .attr('d', data.hullPath)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 40)
        .attr('stroke-opacity', 0)
        .attr('filter', 'url(#cluster-glow)')
        .transition()
        .delay(500 + delay)
        .duration(1500)
        .attr('stroke-opacity', 0.08)

      // Layer 2: Crisp border path
      clusterG.append('path')
        .attr('class', 'cluster-border')
        .attr('d', data.hullPath)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2.5)
        .attr('stroke-opacity', 0)
        .transition()
        .delay(500 + delay)
        .duration(1500)
        .attr('stroke-opacity', 0.2)

      // Layer 3: Hit area (expanded, transparent)
      clusterG.append('path')
        .attr('class', 'cluster-hitarea')
        .attr('d', data.expandedHullPath)
        .attr('fill', 'transparent')
        .attr('stroke', 'transparent')
        .attr('stroke-width', 20)
        .style('pointer-events', 'all')
        .style('cursor', 'default')
        .on('mouseenter', () => {
          clusterG.select('.cluster-glow')
            .transition().duration(300)
            .attr('stroke-opacity', 0.25)
          clusterG.select('.cluster-border')
            .transition().duration(300)
            .attr('stroke-opacity', 0.5)
          clusterG.select('.cluster-label')
            .transition().duration(300)
            .attr('opacity', 1)
          // Highlight edges connected to this cluster's nodes
          const clusterNodeIds = new Set(
            simNodesRef.current.filter(n => n.category === category).map(n => n.id)
          )
          highlightEdges(clusterNodeIds)
        })
        .on('mouseleave', () => {
          const query = searchQueryRef.current.toLowerCase().trim()
          const isSearchMatch = query && category.includes(query)
          clusterG.select('.cluster-glow')
            .transition().duration(300)
            .attr('stroke-opacity', isSearchMatch ? 0.2 : 0.08)
          clusterG.select('.cluster-border')
            .transition().duration(300)
            .attr('stroke-opacity', isSearchMatch ? 0.4 : 0.2)
          clusterG.select('.cluster-label')
            .transition().duration(300)
            .attr('opacity', isSearchMatch ? 0.8 : 0)
          restoreEdges()
        })

      // Layer 4: Category label above cluster
      clusterG.append('text')
        .attr('class', 'cluster-label')
        .attr('x', data.labelAnchor.x)
        .attr('y', data.labelAnchor.y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'auto')
        .attr('font-size', 18)
        .attr('font-weight', 600)
        .attr('fill', color)
        .attr('opacity', 0)
        .text(CATEGORY_LABELS[category])

      delay += 100
    }
  }, [highlightEdges, restoreEdges])

  // Update cluster visuals when search changes
  const updateClusterSearch = useCallback(() => {
    const g = gRef.current
    if (!g) return
    const query = searchQueryRef.current.toLowerCase().trim()
    const categories = Object.keys(CATEGORY_COLORS) as Category[]

    for (const category of categories) {
      const clusterG = g.select(`.cluster-${category}`)
      if (clusterG.empty()) continue

      const isSearchMatch = query && category.includes(query)
      const dimmed = query && !isSearchMatch

      clusterG.select('.cluster-glow')
        .transition().duration(300)
        .attr('stroke-opacity', isSearchMatch ? 0.2 : dimmed ? 0.03 : 0.08)
      clusterG.select('.cluster-border')
        .transition().duration(300)
        .attr('stroke-opacity', isSearchMatch ? 0.4 : dimmed ? 0.08 : 0.2)
      clusterG.select('.cluster-label')
        .transition().duration(300)
        .attr('opacity', isSearchMatch ? 0.8 : 0)
    }
  }, [])

  // Render progress-bar edges between adjacent clusters
  const renderClusterEdges = useCallback(() => {
    const g = gRef.current
    if (!g) return
    const clusterData = clusterDataRef.current
    const progress = clusterProgressRef.current
    const unlocked = unlockedClustersRef.current

    const edgesGroup = g.select<SVGGElement>('.cluster-edges')
    edgesGroup.selectAll('*').remove()

    for (const ce of CLUSTER_EDGES) {
      const srcData = clusterData.get(ce.source)
      const tgtData = clusterData.get(ce.target)
      if (!srcData || !tgtData) continue

      const srcHull = srcData.hullPoints
      const tgtHull = tgtData.hullPoints

      // Find exit point of source hull and entry point of target hull
      const exitPt = rayHullIntersection(srcData.centroid, tgtData.centroid, srcHull)
      const entryPt = rayHullIntersection(tgtData.centroid, srcData.centroid, tgtHull)

      const srcUnlocked = unlocked?.has(ce.source) ?? false
      const progressVal = progress?.get(ce.source) ?? 0

      const edgeG = edgesGroup.append('g')
        .attr('class', `cluster-edge-${ce.source}-${ce.target}`)

      // Grey track line
      edgeG.append('line')
        .attr('class', 'cluster-edge-track')
        .attr('x1', exitPt.x)
        .attr('y1', exitPt.y)
        .attr('x2', entryPt.x)
        .attr('y2', entryPt.y)
        .attr('stroke', '#e0e0e0')
        .attr('stroke-width', 8)
        .attr('stroke-linecap', 'round')
        .attr('stroke-opacity', srcUnlocked ? 0.6 : 0.3)

      // Colored fill line (progress)
      const fillX = exitPt.x + (entryPt.x - exitPt.x) * progressVal
      const fillY = exitPt.y + (entryPt.y - exitPt.y) * progressVal
      const color = CATEGORY_COLORS[ce.source] || '#999'

      edgeG.append('line')
        .attr('class', 'cluster-edge-fill')
        .attr('x1', exitPt.x)
        .attr('y1', exitPt.y)
        .attr('x2', fillX)
        .attr('y2', fillY)
        .attr('stroke', color)
        .attr('stroke-width', 8)
        .attr('stroke-linecap', 'round')
        .attr('stroke-opacity', progressVal > 0 ? 0.8 : 0)
        .attr('data-source', ce.source)
        .attr('data-exit-x', exitPt.x)
        .attr('data-exit-y', exitPt.y)
        .attr('data-entry-x', entryPt.x)
        .attr('data-entry-y', entryPt.y)
    }
  }, [])

  // Core: compute viewport bounds and render visible subset
  const updateViewport = useCallback((transform: d3.ZoomTransform, width: number, height: number) => {
    const simNodes = simNodesRef.current
    const allEdges = allSimEdgesRef.current

    // World-space viewport bounds with padding
    const left = -transform.x / transform.k - VIEWPORT_PADDING
    const top = -transform.y / transform.k - VIEWPORT_PADDING
    const right = (width - transform.x) / transform.k + VIEWPORT_PADDING
    const bottom = (height - transform.y) / transform.k + VIEWPORT_PADDING

    // Filter nodes within viewport
    const viewportNodeIds = new Set<string>()
    const viewportNodes = simNodes.filter(n => {
      const x = n.x ?? 0
      const y = n.y ?? 0
      if (x >= left && x <= right && y >= top && y <= bottom) {
        viewportNodeIds.add(n.id)
        return true
      }
      return false
    })

    // Filter edges where at least one endpoint is in viewport
    const viewportEdges = allEdges.filter(e => {
      const srcId = typeof e.source === 'string' ? e.source : (e.source as SimNode).id
      const tgtId = typeof e.target === 'string' ? e.target : (e.target as SimNode).id
      return viewportNodeIds.has(srcId) || viewportNodeIds.has(tgtId)
    })

    renderNodes(viewportNodes)
    renderEdges(viewportEdges)
  }, [renderNodes, renderEdges])

  // Phase A+B: Run synchronous simulation and set up SVG on nodes/edges change
  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return

    const svg = d3.select(svgRef.current)
    const width = window.innerWidth
    const height = window.innerHeight

    svg.selectAll('*').remove()

    // Phase A: Synchronous simulation
    // Build set of center node IDs and their pinned positions
    const centerNodePositions = new Map<string, { x: number; y: number }>()
    for (const [cat, nodeId] of Object.entries(CLUSTER_CENTER_NODES)) {
      const pos = CATEGORY_CENTERS[cat as Category]
      if (pos) centerNodePositions.set(nodeId, pos)
    }

    // Compute fixed circular positions for layered spoke clusters
    // L2 nodes form an inner ring, L3 nodes form an outer ring
    const L2_RADIUS = 400
    const L3_RADIUS = 750
    const spokePositions = new Map<string, { x: number; y: number }>()

    const nodeCategory = new Map(nodes.map(n => [n.id, n.category]))

    for (const [cat, centerId] of Object.entries(CLUSTER_CENTER_NODES)) {
      const centerPos = CATEGORY_CENTERS[cat as Category]
      if (!centerPos) continue

      const clusterEdges = edges.filter(e =>
        nodeCategory.get(e.source) === cat &&
        nodeCategory.get(e.target) === cat
      )

      // Identify L2 (children of center) and L3 (children of L2)
      const l2Nodes = clusterEdges.filter(e => e.source === centerId).map(e => e.target)
      if (l2Nodes.length === 0) continue

      const l2Set = new Set(l2Nodes)
      const l3Edges = clusterEdges.filter(e => l2Set.has(e.source) && e.source !== centerId)

      // Only use circular layout if edges follow the layered pattern
      // (all edges are either center→L2 or L2→L3)
      const nonLayeredEdges = clusterEdges.filter(e =>
        e.source !== centerId && !l2Set.has(e.source)
      )
      if (nonLayeredEdges.length > 0) continue

      // Pin L2 nodes in inner circle
      l2Nodes.forEach((nodeId, i) => {
        const angle = (2 * Math.PI * i) / l2Nodes.length - Math.PI / 2
        spokePositions.set(nodeId, {
          x: centerPos.x + L2_RADIUS * Math.cos(angle),
          y: centerPos.y + L2_RADIUS * Math.sin(angle),
        })
      })

      // Pin L3 nodes in outer circle, grouped near their parent's angle
      if (l3Edges.length > 0) {
        // Build parent → children mapping preserving L2 order
        const l3ByParent = new Map<string, string[]>()
        for (const id of l2Nodes) l3ByParent.set(id, [])
        for (const e of l3Edges) {
          l3ByParent.get(e.source)?.push(e.target)
        }

        // Lay out all L3 nodes on one circle, grouped by parent
        const l3Ordered: { nodeId: string; parentIndex: number; childIndex: number; childCount: number }[] = []
        l2Nodes.forEach((parentId, pi) => {
          const children = l3ByParent.get(parentId) ?? []
          children.forEach((childId, ci) => {
            l3Ordered.push({ nodeId: childId, parentIndex: pi, childIndex: ci, childCount: children.length })
          })
        })

        const totalL3 = l3Ordered.length
        l3Ordered.forEach((item, globalIndex) => {
          const angle = (2 * Math.PI * globalIndex) / totalL3 - Math.PI / 2
          spokePositions.set(item.nodeId, {
            x: centerPos.x + L3_RADIUS * Math.cos(angle),
            y: centerPos.y + L3_RADIUS * Math.sin(angle),
          })
        })
      }
    }

    const simNodes: SimNode[] = nodes.map(n => {
      const pinPos = centerNodePositions.get(n.id) ?? spokePositions.get(n.id)
      return {
        ...n,
        connectionCount: getConnectionCount(n.id),
        // Pin center nodes and spoke-pattern nodes at fixed positions
        ...(pinPos ? { x: pinPos.x, y: pinPos.y, fx: pinPos.x, fy: pinPos.y } : {}),
      }
    })
    const simEdges: SimEdge[] = edges.map(e => ({ ...e }))

    const simulation = d3.forceSimulation<SimNode>(simNodes)
      .force('link', d3.forceLink<SimNode, SimEdge>(simEdges)
        .id(d => d.id)
        .distance(400)
        .strength(0.3))
      .force('charge', d3.forceManyBody().strength(-1200))
      .force('x', d3.forceX<SimNode>(d => CATEGORY_CENTERS[d.category as Category]?.x ?? 0).strength(0.45))
      .force('y', d3.forceY<SimNode>(d => CATEGORY_CENTERS[d.category as Category]?.y ?? 0).strength(0.45))
      .force('collision', d3.forceCollide<SimNode>().radius(120))
      .stop()

    // Run 500 synchronous ticks (strong positional forces need more convergence)
    for (let i = 0; i < 500; i++) {
      simulation.tick()
    }

    // Freeze positions
    simNodes.forEach(d => {
      d.fx = d.x
      d.fy = d.y
    })

    // Store in refs
    simNodesRef.current = simNodes
    allSimEdgesRef.current = simEdges // post-resolution: source/target are objects

    // Phase B: SVG setup
    const defs = svg.append('defs')

    // Cluster glow filter
    const glowFilter = defs.append('filter')
      .attr('id', 'cluster-glow')
      .attr('x', '-50%').attr('y', '-50%')
      .attr('width', '200%').attr('height', '200%')
    glowFilter.append('feGaussianBlur')
      .attr('in', 'SourceGraphic')
      .attr('stdDeviation', '8')

    // Grayscale filter
    const filter = defs.append('filter').attr('id', 'grayscale')
    filter.append('feColorMatrix')
      .attr('type', 'matrix')
      .attr('values', '0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 0.5 0')

    // Clip paths for ALL nodes
    simNodes.forEach(n => {
      defs.append('clipPath')
        .attr('id', `clip-${n.id}`)
        .append('circle')
        .attr('r', NODE_RADIUS)
        .attr('cx', 0)
        .attr('cy', 0)
    })

    const g = svg.append('g')
    g.append('g').attr('class', 'clusters')
    g.append('g').attr('class', 'cluster-edges')
    g.append('g').attr('class', 'links')
    g.append('g').attr('class', 'nodes')
    gRef.current = g

    // Render clusters once after simulation
    const clusterData = computeClusterData(simNodes, NODE_RADIUS, 60)
    clusterDataRef.current = clusterData
    renderClusters(g, clusterData)
    renderClusterEdges()

    // Zoom handler
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([MIN_ZOOM, MAX_ZOOM])
      .on('zoom', (event) => {
        // Apply transform immediately for smooth visuals
        g.attr('transform', event.transform)

        // Check zoom limit
        const atLimit = event.transform.k <= MIN_ZOOM
        if (atLimit !== wasAtLimitRef.current) {
          wasAtLimitRef.current = atLimit
          onZoomLimitReached?.(atLimit)
        }

        // Debounced viewport update
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }
        debounceTimerRef.current = setTimeout(() => {
          updateViewport(event.transform, width, height)
        }, VIEWPORT_DEBOUNCE_MS)
      })

    zoomRef.current = zoom
    svg.call(zoom)

    // Initial transform: focus on last interacted node, or "fire" as the starting node
    const focusId = initialFocusNodeId || 'fire'
    const focusNode = simNodes.find(n => n.id === focusId)
    const focusX = focusNode?.x ?? 0
    const focusY = focusNode?.y ?? 0
    const initialScale = 0.6
    const initialTransform = d3.zoomIdentity
      .translate(width / 2 - focusX * initialScale, height / 2 - focusY * initialScale)
      .scale(initialScale)
    svg.call(zoom.transform, initialTransform)

    // Initial viewport render
    updateViewport(initialTransform, width, height)

    isInitialMountRef.current = false

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [nodes, edges, getConnectionCount, onZoomLimitReached, updateViewport, renderClusters, renderClusterEdges, initialFocusNodeId])

  // Update viewport when search/selection/progress/unlock state changes
  useEffect(() => {
    if (!svgRef.current || !zoomRef.current) return

    // Force full rebuild of nodes/edges when progress or unlock state changed
    const g = gRef.current
    if (g && forceRebuildRef.current) {
      g.select('.nodes').selectAll('*').remove()
      g.select('.links').selectAll('*').remove()
      forceRebuildRef.current = false
    }

    const svg = d3.select(svgRef.current)
    const svgNode = svg.node()
    if (!svgNode) return

    const transform = d3.zoomTransform(svgNode)
    const width = window.innerWidth
    const height = window.innerHeight
    updateViewport(transform, width, height)
    updateClusterSearch()
  }, [searchQuery, selectedNodeId, unlockedIds, lockedNeighborIds, nodeProgressMap, updateViewport, updateClusterSearch])

  // Update cluster edge fill when progress changes
  useEffect(() => {
    const g = gRef.current
    if (!g || isInitialMountRef.current) return

    const progress = clusterProgressRef.current

    g.select('.cluster-edges').selectAll<SVGLineElement, unknown>('.cluster-edge-fill')
      .each(function () {
        const el = d3.select(this)
        const source = el.attr('data-source') as Category
        const exitX = parseFloat(el.attr('data-exit-x'))
        const exitY = parseFloat(el.attr('data-exit-y'))
        const entryX = parseFloat(el.attr('data-entry-x'))
        const entryY = parseFloat(el.attr('data-entry-y'))
        const progressVal = progress?.get(source) ?? 0

        const fillX = exitX + (entryX - exitX) * progressVal
        const fillY = exitY + (entryY - exitY) * progressVal

        el.transition().duration(600)
          .attr('x2', fillX)
          .attr('y2', fillY)
          .attr('stroke-opacity', progressVal > 0 ? 0.8 : 0)
      })
  }, [clusterProgress])

  return (
    <svg
      ref={svgRef}
      className="graph-svg"
    />
  )
}
