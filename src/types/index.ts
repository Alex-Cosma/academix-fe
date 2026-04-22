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
  | 'fundamental'
  | 'agriculture'
  | 'materials'
  | 'energy'
  | 'transport'
  | 'communication'
  | 'science'
  | 'medicine'
  | 'computing'
  | 'space'

export const CATEGORY_COLORS: Record<Category, string> = {
  fundamental: '#e74c3c',
  agriculture: '#2ecc71',
  materials: '#e67e22',
  energy: '#f1c40f',
  transport: '#3498db',
  communication: '#9b59b6',
  science: '#1abc9c',
  medicine: '#e91e63',
  computing: '#00bcd4',
  space: '#607d8b',
}

export const CATEGORY_LABELS: Record<Category, string> = {
  fundamental: 'Fundamental',
  agriculture: 'Agriculture',
  materials: 'Materials',
  energy: 'Energy',
  transport: 'Transport',
  communication: 'Communication',
  science: 'Science',
  medicine: 'Medicine',
  computing: 'Computing',
  space: 'Space',
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
