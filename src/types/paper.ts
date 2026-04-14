export interface Paper {
  id: string
  title: string
  authors: Author[]
  abstract: string
  journal: string
  publicationDate: string
  doi: string
  citationCount: number
  fields: string[]
  keywords: string[]
  teaserSummary: string
  isOpenAccess: boolean
  isBookmarked: boolean
}

export interface PaperDetail extends Paper {
  summaries: PaperSummary[]
}

export interface PaperSummary {
  id: number
  paperId: number
  level: SummaryLevel
  title: string
  content: string | null
  status: SummaryStatus
  readingTimeMinutes: number
  locked: boolean
  aiProvider?: string
  aiModel?: string
  tokenCount?: number
  generatedAt?: string
}

export type SummaryLevel = 1 | 2 | 3 | 4
export type SummaryStatus = "PENDING" | "GENERATING" | "COMPLETED" | "FAILED"

export interface Author {
  name: string
  affiliation?: string
  avatarUrl?: string
}

// ── Quiz types ──

export interface PaperProgress {
  paperId: number
  levels: LevelProgress[]
  totalXpEarned: number
}

export interface LevelProgress {
  level: number
  levelName: string
  unlocked: boolean
  quizAvailable: boolean
  completed: boolean
  score: number | null
  xpEarned: number
  attempts: number
  completedAt: string | null
}

export interface QuizQuestion {
  id: number
  questionOrder: number
  questionType: "MULTIPLE_CHOICE" | "FREE_TEXT"
  questionText: string
  options: string[] | null
}

export interface QuizData {
  paperId: number
  level: number
  levelName: string
  questions: QuizQuestion[]
}

export interface QuizAnswerSubmission {
  questionId: number
  answer: string
}

export interface QuizResult {
  paperId: number
  level: number
  levelName: string
  passed: boolean
  score: number
  xpEarned: number
  totalQuestions: number
  correctCount: number
  questionResults: QuestionResult[]
}

export interface QuestionResult {
  questionId: number
  correct: boolean
  userAnswer: string
  correctAnswer: string
  explanation: string | null
}
