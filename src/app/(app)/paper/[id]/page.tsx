"use client"

import { useState } from "react"
import { usePaperDetail, usePaperSummaries, useToggleBookmark } from "@/hooks/use-papers"
import { usePaperProgress } from "@/hooks/use-quiz"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ErrorBoundaryFallback } from "@/components/error-boundary"
import { QuizDialog } from "@/components/quiz/quiz-dialog"
import { ProgressIndicator } from "@/components/quiz/progress-indicator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getFieldColor } from "@/config/field-colors"
import { FIELDS_OF_INTEREST } from "@/config/fields-of-interest"
import type { PaperSummary, SummaryLevel, LevelProgress } from "@/types/paper"
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Loader2,
  Quote,
  BookOpen,
  AlertCircle,
  Lock,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"

const SUMMARY_LEVEL_LABELS: Record<SummaryLevel, string> = {
  1: "Foundation",
  2: "Context",
  3: "Mechanics",
  4: "Mastery",
}

const SUMMARY_LEVEL_DESCRIPTIONS: Record<SummaryLevel, string> = {
  1: "What did they find? Core discovery in plain language",
  2: "Why does this matter? History, significance, impact",
  3: "How did they do it? Methodology and experiments",
  4: "Full picture: statistics, limitations, comparisons",
}

function SummaryContent({
  summary,
  levelProgress,
  onTakeQuiz,
}: {
  summary?: PaperSummary
  levelProgress?: LevelProgress
  onTakeQuiz?: () => void
}) {
  if (!summary) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Summary not available yet.
      </p>
    )
  }

  if (summary.locked) {
    const prevLevel = (summary.level - 1) as SummaryLevel
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <Lock className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground text-center">
          Pass the {SUMMARY_LEVEL_LABELS[prevLevel]} quiz to unlock this level
        </p>
      </div>
    )
  }

  if (summary.status === "PENDING" || summary.status === "GENERATING") {
    return (
      <div className="flex items-center justify-center gap-3 py-8">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">
          Summary being generated...
        </span>
      </div>
    )
  }

  if (summary.status === "FAILED") {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
        <AlertCircle className="h-5 w-5" />
        <span className="text-sm">Summary unavailable</span>
      </div>
    )
  }

  return (
    <div className="py-4">
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5" />
          <span>{summary.readingTimeMinutes} min read</span>
        </div>
        <div className="font-serif leading-relaxed whitespace-pre-wrap">
          {summary.content}
        </div>
      </div>

      {/* Take Quiz button */}
      {levelProgress?.quizAvailable && !levelProgress.completed && (
        <Button
          onClick={onTakeQuiz}
          variant="outline"
          size="sm"
          className="mt-4"
        >
          <GraduationCap className="mr-2 h-4 w-4" />
          Take Quiz
        </Button>
      )}

      {levelProgress?.completed && (
        <div className="mt-4 flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
          <GraduationCap className="h-4 w-4" />
          <span>
            Quiz passed ({Math.round((levelProgress.score ?? 0) * 100)}%) &middot; +{levelProgress.xpEarned} XP
          </span>
        </div>
      )}
    </div>
  )
}

function SummaryTabs({
  summaries,
  progress,
  onTakeQuiz,
}: {
  summaries?: PaperSummary[]
  progress?: LevelProgress[]
  onTakeQuiz: (level: number, levelName: string) => void
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const levels: SummaryLevel[] = [1, 2, 3, 4]

  const getSummary = (level: SummaryLevel) =>
    summaries?.find((s) => s.level === level)

  const getLevelProgress = (level: SummaryLevel) =>
    progress?.find((p) => p.level === level)

  if (isDesktop) {
    return (
      <Tabs defaultValue="1">
        <TabsList className="w-full justify-start">
          {levels.map((level) => {
            const lp = getLevelProgress(level)
            const summary = getSummary(level)
            const isLocked = summary?.locked ?? false
            return (
              <TabsTrigger
                key={level}
                value={String(level)}
                className="flex-1 gap-1.5"
                disabled={isLocked}
              >
                {isLocked && <Lock className="h-3 w-3" />}
                {SUMMARY_LEVEL_LABELS[level]}
                {lp?.completed && (
                  <span className="ml-1 text-green-500">&#10003;</span>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>
        {levels.map((level) => (
          <TabsContent key={level} value={String(level)}>
            <p className="text-xs text-muted-foreground mt-2">
              {SUMMARY_LEVEL_DESCRIPTIONS[level]}
            </p>
            <SummaryContent
              summary={getSummary(level)}
              levelProgress={getLevelProgress(level)}
              onTakeQuiz={() => onTakeQuiz(level, SUMMARY_LEVEL_LABELS[level])}
            />
          </TabsContent>
        ))}
      </Tabs>
    )
  }

  // Mobile: accordion
  return (
    <Accordion type="single" collapsible defaultValue="1">
      {levels.map((level) => {
        const lp = getLevelProgress(level)
        const summary = getSummary(level)
        const isLocked = summary?.locked ?? false

        return (
          <AccordionItem key={level} value={String(level)}>
            <AccordionTrigger className={isLocked ? "opacity-50" : ""}>
              <span className="flex items-center gap-1.5">
                {isLocked && <Lock className="h-3 w-3" />}
                {SUMMARY_LEVEL_LABELS[level]}
                {lp?.completed && (
                  <span className="ml-1 text-green-500">&#10003;</span>
                )}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="mb-2 text-xs text-muted-foreground">
                {SUMMARY_LEVEL_DESCRIPTIONS[level]}
              </p>
              <SummaryContent
                summary={getSummary(level)}
                levelProgress={getLevelProgress(level)}
                onTakeQuiz={() =>
                  onTakeQuiz(level, SUMMARY_LEVEL_LABELS[level])
                }
              />
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

function PaperDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-3/4" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-28" />
      </div>
      <Skeleton className="h-5 w-1/2" />
      <Separator />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}

function getFieldLabel(slug: string): string {
  const field = FIELDS_OF_INTEREST.find((f) => f.slug === slug)
  return field?.name ?? slug
}

export default function PaperDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const [quizOpen, setQuizOpen] = useState(false)
  const [quizLevel, setQuizLevel] = useState<{
    level: number
    name: string
  } | null>(null)

  const {
    data: paper,
    isLoading,
    isError,
    error,
    refetch,
  } = usePaperDetail(params.id)

  const { data: summaries, isLoading: isSummariesLoading } =
    usePaperSummaries(params.id)

  const { data: progressData } = usePaperProgress(params.id)

  const toggleBookmark = useToggleBookmark()

  const handleBookmarkToggle = () => {
    if (!paper) return
    toggleBookmark.mutate({
      paperId: paper.id,
      isBookmarked: paper.isBookmarked,
    })
  }

  const handleTakeQuiz = (level: number, levelName: string) => {
    setQuizLevel({ level, name: levelName })
    setQuizOpen(true)
  }

  if (isLoading) {
    return (
      <main className="container mx-auto max-w-3xl p-4 sm:p-6">
        <PaperDetailSkeleton />
      </main>
    )
  }

  if (isError || !paper) {
    return (
      <main className="container mx-auto max-w-3xl p-4 sm:p-6">
        <ErrorBoundaryFallback
          message={error?.message ?? "Failed to load paper"}
          onRetry={() => refetch()}
        />
      </main>
    )
  }

  const year = paper.publicationDate
    ? new Date(paper.publicationDate).getFullYear()
    : null

  return (
    <main className="container mx-auto max-w-3xl p-4 sm:p-6">
      {/* Back link */}
      <Link
        href="/feed"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to feed
      </Link>

      {/* Title */}
      <h1 className="font-serif text-2xl font-bold leading-tight sm:text-3xl">
        {paper.title}
      </h1>

      {/* Authors */}
      {paper.authors.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
          {paper.authors.map((author, i) => (
            <span key={i}>
              {author.name}
              {author.affiliation && (
                <span className="text-xs"> ({author.affiliation})</span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Metadata row */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        {paper.journal && (
          <Badge variant="secondary">{paper.journal}</Badge>
        )}
        {year && <Badge variant="outline">{year}</Badge>}

        <span className="flex items-center gap-1 text-muted-foreground">
          <Quote className="h-3.5 w-3.5" />
          {paper.citationCount.toLocaleString()} citations
        </span>

        {paper.isOpenAccess && (
          <Badge className="bg-green-600 text-white hover:bg-green-700">
            Open Access
          </Badge>
        )}
      </div>

      {/* Field badges */}
      {paper.fields.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {paper.fields.map((slug) => (
            <Badge
              key={slug}
              variant="secondary"
              style={{ borderLeft: `3px solid ${getFieldColor(slug)}` }}
            >
              {getFieldLabel(slug)}
            </Badge>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant={paper.isBookmarked ? "default" : "outline"}
          size="sm"
          onClick={handleBookmarkToggle}
          disabled={toggleBookmark.isPending}
        >
          {paper.isBookmarked ? (
            <BookmarkCheck className="mr-2 h-4 w-4" />
          ) : (
            <Bookmark className="mr-2 h-4 w-4" />
          )}
          {paper.isBookmarked ? "Bookmarked" : "Bookmark"}
        </Button>

        {paper.doi && (
          <Button variant="outline" size="sm" asChild>
            <a
              href={`https://doi.org/${paper.doi}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              DOI
            </a>
          </Button>
        )}

        <Button variant="outline" size="sm" asChild>
          <a
            href={`https://www.semanticscholar.org/paper/${paper.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Semantic Scholar
          </a>
        </Button>
      </div>

      <Separator className="my-6" />

      {/* Abstract */}
      {paper.abstract && (
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-semibold">Abstract</h2>
          <p className="font-serif text-sm leading-relaxed text-muted-foreground">
            {paper.abstract}
          </p>
        </section>
      )}

      {/* Progress indicator */}
      {progressData && (
        <div className="mb-4">
          <ProgressIndicator levels={progressData.levels} />
          {progressData.totalXpEarned > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              {progressData.totalXpEarned} XP earned on this paper
            </p>
          )}
        </div>
      )}

      {/* Summaries */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">AI Summaries</h2>
        {isSummariesLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <SummaryTabs
            summaries={summaries}
            progress={progressData?.levels}
            onTakeQuiz={handleTakeQuiz}
          />
        )}
      </section>

      {/* Quiz dialog */}
      {quizLevel && (
        <QuizDialog
          open={quizOpen}
          onOpenChange={setQuizOpen}
          paperId={params.id}
          level={quizLevel.level}
          levelName={quizLevel.name}
        />
      )}
    </main>
  )
}
