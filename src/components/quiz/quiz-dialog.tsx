"use client"

import { useState, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useQuizQuestions, useSubmitQuiz } from "@/hooks/use-quiz"
import type { QuizAnswerSubmission, QuizResult, QuizQuestion } from "@/types/paper"
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
} from "lucide-react"

interface QuizDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paperId: string
  level: number
  levelName: string
}

export function QuizDialog({
  open,
  onOpenChange,
  paperId,
  level,
  levelName,
}: QuizDialogProps) {
  const { data: quizData, isLoading } = useQuizQuestions(paperId, open ? level : null)
  const submitQuiz = useSubmitQuiz()
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [result, setResult] = useState<QuizResult | null>(null)

  const handleAnswerChange = useCallback(
    (questionId: number, answer: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: answer }))
    },
    []
  )

  const handleSubmit = async () => {
    if (!quizData) return

    const submissions: QuizAnswerSubmission[] = quizData.questions.map((q) => ({
      questionId: q.id,
      answer: answers[q.id] || "",
    }))

    const res = await submitQuiz.mutateAsync({
      paperId,
      level,
      answers: submissions,
    })

    setResult(res)
  }

  const handleRetry = () => {
    setAnswers({})
    setResult(null)
  }

  const handleClose = (open: boolean) => {
    if (!open) {
      setAnswers({})
      setResult(null)
    }
    onOpenChange(open)
  }

  const allAnswered = quizData?.questions.every((q) => answers[q.id]?.trim()) ?? false

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {levelName} Quiz
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {result ? (
          <QuizResults result={result} onRetry={handleRetry} onClose={() => handleClose(false)} />
        ) : quizData ? (
          <div className="space-y-6">
            {quizData.questions.map((q, idx) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={idx}
                value={answers[q.id] || ""}
                onChange={(val) => handleAnswerChange(q.id, val)}
              />
            ))}

            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || submitQuiz.isPending}
              className="w-full"
            >
              {submitQuiz.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Grading...
                </>
              ) : (
                "Submit Answers"
              )}
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function QuestionCard({
  question,
  index,
  value,
  onChange,
}: {
  question: QuizQuestion
  index: number
  value: string
  onChange: (val: string) => void
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">
        {index + 1}. {question.questionText}
      </p>

      {question.questionType === "MULTIPLE_CHOICE" && question.options ? (
        <div className="space-y-2">
          {question.options.map((option) => (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm transition-colors ${
                value === option
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <input
                type="radio"
                name={`q-${question.id}`}
                value={option}
                checked={value === option}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              <div
                className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                  value === option ? "border-primary" : "border-muted-foreground/40"
                }`}
              >
                {value === option && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
              {option}
            </label>
          ))}
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer..."
          rows={3}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      )}
    </div>
  )
}

function QuizResults({
  result,
  onRetry,
  onClose,
}: {
  result: QuizResult
  onRetry: () => void
  onClose: () => void
}) {
  const percentage = Math.round(result.score * 100)

  return (
    <div className="space-y-4">
      <div className="text-center">
        {result.passed ? (
          <>
            <Trophy className="mx-auto h-12 w-12 text-yellow-500" />
            <h3 className="mt-2 text-lg font-semibold text-green-600">
              Passed!
            </h3>
          </>
        ) : (
          <>
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-lg font-semibold text-red-600">
              Not quite...
            </h3>
          </>
        )}

        <p className="mt-1 text-sm text-muted-foreground">
          {result.correctCount}/{result.totalQuestions} correct ({percentage}%)
        </p>

        {result.passed && result.xpEarned > 0 && (
          <Badge className="mt-2 bg-yellow-500 text-white">
            +{result.xpEarned} XP
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        {result.questionResults.map((qr, idx) => (
          <div
            key={qr.questionId}
            className={`rounded-md border p-3 text-sm ${
              qr.correct
                ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950"
                : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950"
            }`}
          >
            <div className="flex items-center gap-2">
              {qr.correct ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="font-medium">Question {idx + 1}</span>
            </div>
            {!qr.correct && (
              <p className="mt-1 text-xs text-muted-foreground">
                Correct answer: {qr.correctAnswer}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {!result.passed && (
          <Button variant="outline" onClick={onRetry} className="flex-1">
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
        <Button onClick={onClose} className="flex-1">
          {result.passed ? "Continue" : "Close"}
        </Button>
      </div>
    </div>
  )
}
