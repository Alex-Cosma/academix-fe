import { useEffect, useRef, useCallback } from 'react'
import * as d3 from 'd3'
import { TechNode, TechEdge, SimNode, SimEdge, CATEGORY_COLORS, Category, NodeProgressMap } from '../types'
import { NODE_ICONS, getCategoryFallbackIcon } from '../utils/nodeIcons'
import { formatYear } from '../utils/formatYear'

interface Props {
  nodes: TechNode[]
  edges: TechEdge[]
  searchQuery: string
  selectedNodeId: string | null
  onSelectNode: (node: SimNode | null) => void
  lockedNodeIds?: Set<string>
  nodeProgressMap?: NodeProgressMap
}

const NODE_RADIUS = 70
const ICON_SIZE = 80

export default function Graph({
  nodes, edges, searchQuery, selectedNodeId, onSelectNode,
  lockedNodeIds, nodeProgressMap,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const simulationRef = useRef<d3.Simulation<SimNode, SimEdge> | null>(null)

  const locked = lockedNodeIds ?? new Set<string>()

  const getConnectionCount = useCallback((nodeId: string) => {
    return edges.filter(e => e.source === nodeId || e.target === nodeId).length
  }, [edges])

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return

    const svg = d3.select(svgRef.current)
    const width = window.innerWidth
    const height = window.innerHeight

    svg.selectAll('*').remove()

    const simNodes: SimNode[] = nodes.map(n => ({
      ...n,
      connectionCount: getConnectionCount(n.id),
    }))
    const simEdges: SimEdge[] = edges.map(e => ({ ...e }))

    const defs = svg.append('defs')

    // Arrow marker for unlocked edges
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 78)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#bbb')

    // Arrow marker for locked edges
    defs.append('marker')
      .attr('id', 'arrowhead-locked')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 78)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#ddd')

    // Grayscale filter for locked icons
    const filter = defs.append('filter').attr('id', 'grayscale')
    filter.append('feColorMatrix')
      .attr('type', 'matrix')
      .attr('values', '0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 0.5 0')

    // Clip paths
    simNodes.forEach(n => {
      defs.append('clipPath')
        .attr('id', `clip-${n.id}`)
        .append('circle')
        .attr('r', NODE_RADIUS)
        .attr('cx', 0)
        .attr('cy', 0)
    })

    const g = svg.append('g')

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })
    svg.call(zoom)
    svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(1))

    // Draw edges
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(simEdges)
      .join('line')
      .attr('stroke', d => {
        const srcId = typeof d.source === 'string' ? d.source : d.source.id
        const tgtId = typeof d.target === 'string' ? d.target : d.target.id
        return (locked.has(srcId) || locked.has(tgtId)) ? '#e8e8e8' : '#ddd'
      })
      .attr('stroke-width', 1)
      .attr('stroke-opacity', d => {
        const srcId = typeof d.source === 'string' ? d.source : d.source.id
        const tgtId = typeof d.target === 'string' ? d.target : d.target.id
        return (locked.has(srcId) || locked.has(tgtId)) ? 0.3 : 0.6
      })
      .attr('stroke-dasharray', d => {
        const srcId = typeof d.source === 'string' ? d.source : d.source.id
        const tgtId = typeof d.target === 'string' ? d.target : d.target.id
        return (locked.has(srcId) || locked.has(tgtId)) ? '4 4' : 'none'
      })
      .attr('marker-end', d => {
        const srcId = typeof d.source === 'string' ? d.source : d.source.id
        const tgtId = typeof d.target === 'string' ? d.target : d.target.id
        return (locked.has(srcId) || locked.has(tgtId)) ? 'url(#arrowhead-locked)' : 'url(#arrowhead)'
      })

    // Draw node groups
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll<SVGGElement, SimNode>('g')
      .data(simNodes)
      .join('g')
      .attr('cursor', d => locked.has(d.id) ? 'default' : 'pointer')
      .on('click', (_event, d) => {
        if (locked.has(d.id)) return
        onSelectNode(d)
      })

    // Background circle
    node.append('circle')
      .attr('r', NODE_RADIUS)
      .attr('fill', d => {
        if (locked.has(d.id)) return '#f5f5f5'
        const color = CATEGORY_COLORS[d.category as Category] || '#999'
        return color + '1A'
      })
      .attr('stroke', d => {
        if (locked.has(d.id)) return '#ccc'
        return CATEGORY_COLORS[d.category as Category] || '#999'
      })
      .attr('stroke-width', d => locked.has(d.id) ? 2 : 3)
      .attr('stroke-dasharray', d => locked.has(d.id) ? '6 4' : 'none')

    // Icon image
    node.append('image')
      .attr('href', d => NODE_ICONS[d.id] ?? getCategoryFallbackIcon(d.category))
      .attr('x', -ICON_SIZE / 2)
      .attr('y', -ICON_SIZE / 2)
      .attr('width', ICON_SIZE)
      .attr('height', ICON_SIZE)
      .attr('clip-path', d => `url(#clip-${d.id})`)
      .attr('pointer-events', 'none')
      .attr('filter', d => locked.has(d.id) ? 'url(#grayscale)' : null)

    // Lock icon overlay for locked nodes
    node.filter(d => locked.has(d.id))
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 6)
      .attr('font-size', 28)
      .attr('pointer-events', 'none')
      .text('\uD83D\uDD12')

    // Progress dots (4 dots above each node)
    const dotSpacing = 14
    const dotRadius = 4
    const dotsY = -(NODE_RADIUS + 16)
    const dotsStartX = -((4 - 1) * dotSpacing) / 2

    node.each(function (d) {
      const group = d3.select(this)
      const progress = nodeProgressMap?.[d.id]
      const completedLevels = progress?.completedLevels ?? 0
      const nodeColor = CATEGORY_COLORS[d.category as Category] || '#999'

      for (let i = 0; i < 4; i++) {
        const isCompleted = i < completedLevels
        const isNext = i === completedLevels && completedLevels < 4 && !locked.has(d.id)

        group.append('circle')
          .attr('cx', dotsStartX + i * dotSpacing)
          .attr('cy', dotsY)
          .attr('r', dotRadius)
          .attr('fill', isCompleted ? nodeColor : (locked.has(d.id) ? '#ddd' : '#e0e0e0'))
          .attr('stroke', isNext ? nodeColor : 'none')
          .attr('stroke-width', isNext ? 2 : 0)
          .attr('pointer-events', 'none')
      }
    })

    // Name label
    node.append('text')
      .text(d => d.name)
      .attr('font-size', 16)
      .attr('font-weight', 600)
      .attr('fill', d => locked.has(d.id) ? '#bbb' : '#333')
      .attr('text-anchor', 'middle')
      .attr('dy', NODE_RADIUS + 20)
      .attr('pointer-events', 'none')

    // Year label
    node.append('text')
      .text(d => formatYear(d.year))
      .attr('font-size', 11)
      .attr('fill', d => locked.has(d.id) ? '#ccc' : '#999')
      .attr('text-anchor', 'middle')
      .attr('dy', NODE_RADIUS + 36)
      .attr('pointer-events', 'none')

    // Force simulation
    const simulation = d3.forceSimulation<SimNode>(simNodes)
      .force('link', d3.forceLink<SimNode, SimEdge>(simEdges)
        .id(d => d.id)
        .distance(350)
        .strength(0.3))
      .force('charge', d3.forceManyBody().strength(-1500))
      .force('center', d3.forceCenter(0, 0))
      .force('collision', d3.forceCollide<SimNode>().radius(90))
      .on('tick', () => {
        link
          .attr('x1', d => (d.source as SimNode).x ?? 0)
          .attr('y1', d => (d.source as SimNode).y ?? 0)
          .attr('x2', d => (d.target as SimNode).x ?? 0)
          .attr('y2', d => (d.target as SimNode).y ?? 0)

        node.attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`)
      })
      .on('end', () => {
        simNodes.forEach(d => {
          d.fx = d.x
          d.fy = d.y
        })
      })

    simulationRef.current = simulation

    return () => {
      simulation.stop()
    }
  }, [nodes, edges, getConnectionCount, onSelectNode, locked, nodeProgressMap])

  // Update highlight on search/selection changes
  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    const query = searchQuery.toLowerCase().trim()

    svg.selectAll<SVGGElement, SimNode>('.nodes g')
      .attr('opacity', d => {
        if (locked.has(d.id)) return query ? 0.1 : 0.5
        if (!query) return 1
        const match = d.name.toLowerCase().includes(query) ||
          d.category.toLowerCase().includes(query) ||
          d.era.toLowerCase().includes(query)
        return match ? 1 : 0.15
      })

    svg.selectAll<SVGGElement, SimNode>('.nodes g').each(function (d) {
      if (locked.has(d.id)) return
      const group = d3.select(this)
      const circle = group.select('circle')
      if (d.id === selectedNodeId) {
        circle.attr('stroke', '#333').attr('stroke-width', 4)
      } else if (query && d.name.toLowerCase().includes(query)) {
        circle.attr('stroke', '#333').attr('stroke-width', 3.5)
      } else {
        circle
          .attr('stroke', CATEGORY_COLORS[d.category as Category] || '#999')
          .attr('stroke-width', 3)
      }
    })

    svg.selectAll<SVGLineElement, SimEdge>('.links line')
      .attr('stroke-opacity', () => query ? 0.1 : 0.6)
  }, [searchQuery, selectedNodeId, locked])

  return (
    <svg
      ref={svgRef}
      className="graph-svg"
    />
  )
}
