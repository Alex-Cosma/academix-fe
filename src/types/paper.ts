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
  level: SummaryLevel
  title: string
  content: string
  status: SummaryStatus
  readingTimeMinutes: number
}

export type SummaryLevel = 1 | 2 | 3 | 4
export type SummaryStatus = "PENDING" | "GENERATING" | "COMPLETED" | "FAILED"

export interface Author {
  name: string
  affiliation?: string
  avatarUrl?: string
}
