import * as d3 from 'd3'
import { Category, ClusterData, SimNode } from '../types'

/**
 * Compute cluster visualization data for each category.
 * Returns a Map of category → ClusterData with convex hull paths.
 */
export function computeClusterData(
  simNodes: SimNode[],
  nodeRadius: number,
  padding: number,
): Map<Category, ClusterData> {
  const clusters = new Map<Category, ClusterData>()

  // Group nodes by category
  const groups = new Map<Category, SimNode[]>()
  for (const node of simNodes) {
    const cat = node.category as Category
    if (!groups.has(cat)) groups.set(cat, [])
    groups.get(cat)!.push(node)
  }

  for (const [category, nodes] of groups) {
    const points: [number, number][] = nodes.map(n => [n.x ?? 0, n.y ?? 0])

    // Compute centroid
    const cx = d3.mean(points, p => p[0]) ?? 0
    const cy = d3.mean(points, p => p[1]) ?? 0
    const centroid = { x: cx, y: cy }

    let hullPoints: [number, number][]
    const expandAmount = nodeRadius + padding

    if (points.length === 1) {
      // Single node: create a synthetic circle (8-point polygon)
      hullPoints = createCirclePoints(points[0][0], points[0][1], expandAmount)
    } else if (points.length === 2) {
      // Two nodes: create a capsule shape
      hullPoints = createCapsulePoints(points[0], points[1], expandAmount)
    } else {
      // 3+ nodes: compute convex hull and expand outward
      const hull = d3.polygonHull(points)
      if (!hull) {
        // Collinear fallback
        hullPoints = createCapsulePoints(points[0], points[points.length - 1], expandAmount)
      } else {
        hullPoints = expandHull(hull, cx, cy, expandAmount)
      }
    }

    const expandedHullPoints = expandHull(hullPoints, cx, cy, 20)

    const hullPath = pointsToSmoothPath(hullPoints)
    const expandedHullPath = pointsToSmoothPath(expandedHullPoints)

    // Label anchor: centered horizontally, above the topmost hull point
    const minY = Math.min(...hullPoints.map(p => p[1]))
    const labelAnchor = { x: cx, y: minY - 30 }

    clusters.set(category, { category, centroid, labelAnchor, hullPath, expandedHullPath, hullPoints })
  }

  return clusters
}

/** Expand hull points outward from centroid by `amount` pixels */
function expandHull(
  hull: [number, number][],
  cx: number,
  cy: number,
  amount: number,
): [number, number][] {
  return hull.map(([x, y]) => {
    const dx = x - cx
    const dy = y - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist === 0) return [x + amount, y] as [number, number]
    const scale = (dist + amount) / dist
    return [cx + dx * scale, cy + dy * scale] as [number, number]
  })
}

/** Create 8 points forming a circle for single-node clusters */
function createCirclePoints(cx: number, cy: number, radius: number): [number, number][] {
  const pts: [number, number][] = []
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    pts.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius])
  }
  return pts
}

/** Create a capsule shape around two points */
function createCapsulePoints(
  a: [number, number],
  b: [number, number],
  radius: number,
): [number, number][] {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist === 0) return createCirclePoints(a[0], a[1], radius)

  const nx = -dy / dist
  const ny = dx / dist

  const pts: [number, number][] = []
  // Semi-circle around point a
  const angleA = Math.atan2(-ny, -nx)
  for (let i = 0; i < 4; i++) {
    const angle = angleA + (i / 3) * Math.PI - Math.PI / 2
    pts.push([a[0] + Math.cos(angle) * radius, a[1] + Math.sin(angle) * radius])
  }
  // Semi-circle around point b
  const angleB = Math.atan2(ny, nx)
  for (let i = 0; i < 4; i++) {
    const angle = angleB + (i / 3) * Math.PI - Math.PI / 2
    pts.push([b[0] + Math.cos(angle) * radius, b[1] + Math.sin(angle) * radius])
  }
  return pts
}

/** Convert points to a smooth closed SVG path using CatmullRom interpolation */
function pointsToSmoothPath(points: [number, number][]): string {
  const lineGen = d3.line()
    .curve(d3.curveCatmullRomClosed.alpha(0.7))

  return lineGen(points) ?? ''
}

/**
 * Find where the ray from `origin` to `target` exits a convex hull polygon.
 * Returns the intersection point closest to origin (first exit).
 */
export function rayHullIntersection(
  origin: { x: number; y: number },
  target: { x: number; y: number },
  hull: [number, number][],
): { x: number; y: number } {
  const dx = target.x - origin.x
  const dy = target.y - origin.y

  let bestT = Infinity

  for (let i = 0; i < hull.length; i++) {
    const j = (i + 1) % hull.length
    const ex = hull[j][0] - hull[i][0]
    const ey = hull[j][1] - hull[i][1]

    const denom = dx * ey - dy * ex
    if (Math.abs(denom) < 1e-10) continue

    const ox = hull[i][0] - origin.x
    const oy = hull[i][1] - origin.y

    const t = (ox * ey - oy * ex) / denom
    const u = (ox * dy - oy * dx) / denom

    if (t > 0 && u >= 0 && u <= 1 && t < bestT) {
      bestT = t
    }
  }

  if (bestT === Infinity) {
    // Fallback: return origin (shouldn't happen with valid hull)
    return { x: origin.x, y: origin.y }
  }

  return {
    x: origin.x + dx * bestT,
    y: origin.y + dy * bestT,
  }
}
