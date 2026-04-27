export interface TechNode {
  id: string
  name: string
  year: number
  era: string
  category: Category
  description: string
  wikipediaUrl: string
  thumbnailUrl: string
}

export interface TechEdge {
  source: string
  target: string
  relationship: string
}

export type Category =
  | 'prehistoric'
  | 'neolithic'
  | 'ancient'
  | 'classical'
  | 'medieval'
  | 'renaissance'
  | 'enlightenment'
  | 'industrial'
  | 'gilded-age'
  | 'modern-age'
  | 'atomic-age'
  | 'space-age'
  | 'digital-age'

export const CATEGORY_ORDER: Category[] = [
  'prehistoric', 'neolithic', 'ancient', 'classical', 'medieval',
  'renaissance', 'enlightenment', 'industrial', 'gilded-age',
  'modern-age', 'atomic-age', 'space-age', 'digital-age',
]

export interface ClusterEdge {
  source: Category
  target: Category
}

export const CLUSTER_EDGES: ClusterEdge[] = CATEGORY_ORDER.slice(0, -1).map((src, i) => ({
  source: src,
  target: CATEGORY_ORDER[i + 1],
}))

export const CATEGORY_COLORS: Record<Category, string> = {
  'prehistoric':    '#8D6E63',
  'neolithic':      '#FFA726',
  'ancient':        '#EF5350',
  'classical':      '#EC407A',
  'medieval':       '#AB47BC',
  'renaissance':    '#5C6BC0',
  'enlightenment':  '#66BB6A',
  'industrial':     '#78909C',
  'gilded-age':     '#FFCA28',
  'modern-age':     '#FF7043',
  'atomic-age':     '#26C6DA',
  'space-age':      '#42A5F5',
  'digital-age':    '#26A69A',
}

export const CLUSTER_CENTER_NODES: Record<Category, string> = {
  'prehistoric':    'fire',
  'neolithic':      'agriculture',
  'ancient':        'mathematics',
  'classical':      'geometry',
  'medieval':       'printing-press',
  'renaissance':    'scientific-method',
  'enlightenment':  'steam-engine',
  'industrial':     'electromagnetism',
  'gilded-age':     'power-grid',
  'modern-age':     'quantum-mechanics',
  'atomic-age':     'integrated-circuit',
  'space-age':      'microprocessor',
  'digital-age':    'world-wide-web',
}

export const CATEGORY_CENTERS: Record<Category, { x: number; y: number }> = {
  'prehistoric':    { x: -7200, y: -3000 },
  'neolithic':      { x: -3600, y: -3000 },
  'ancient':        { x: 0,     y: -3000 },
  'classical':      { x: 3600,  y: -3000 },
  'medieval':       { x: 7200,  y: -3000 },
  'renaissance':    { x: -5400, y: 0 },
  'enlightenment':  { x: -1800, y: 0 },
  'industrial':     { x: 1800,  y: 0 },
  'gilded-age':     { x: 5400,  y: 0 },
  'modern-age':     { x: -5400, y: 3000 },
  'atomic-age':     { x: -1800, y: 3000 },
  'space-age':      { x: 1800,  y: 3000 },
  'digital-age':    { x: 5400,  y: 3000 },
}

export interface ClusterData {
  category: Category
  centroid: { x: number; y: number }
  labelAnchor: { x: number; y: number }
  hullPath: string
  expandedHullPath: string
  hullPoints: [number, number][]
}

export const CATEGORY_LABELS: Record<Category, string> = {
  'prehistoric':    'Prehistoric',
  'neolithic':      'Neolithic',
  'ancient':        'Ancient',
  'classical':      'Classical',
  'medieval':       'Medieval',
  'renaissance':    'Renaissance',
  'enlightenment':  'Enlightenment',
  'industrial':     'Industrial',
  'gilded-age':     'Gilded Age',
  'modern-age':     'Modern Age',
  'atomic-age':     'Atomic Age',
  'space-age':      'Space Age',
  'digital-age':    'Digital Age',
}

// D3 simulation node (extends TechNode with x, y, etc.)
export interface SimNode extends TechNode {
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
  connectionCount: number
}

export interface SimEdge {
  source: SimNode | string
  target: SimNode | string
  relationship: string
}

// ── Quiz & Progress ──────────────────────────────

export type QuizLevel = 1 | 2 | 3 | 4

export interface QuizLevelInfo {
  level: QuizLevel
  name: string
  xp: number
}

export const QUIZ_LEVELS: QuizLevelInfo[] = [
  { level: 1, name: 'Foundation', xp: 25 },
  { level: 2, name: 'Context', xp: 50 },
  { level: 3, name: 'Mechanics', xp: 75 },
  { level: 4, name: 'Mastery', xp: 100 },
]

export interface QuizQuestion {
  id: string
  questionType: 'multiple-choice' | 'free-text'
  questionText: string
  options?: string[]
  correctAnswer: string
  keywords?: string[]
  minKeywords?: number
}

export interface NodeProgress {
  completedLevels: number
  levelScores: Record<number, number>
  totalXp: number
}

export type NodeProgressMap = Record<string, NodeProgress>
