import { QuizQuestion } from '../types'

export function gradeQuestion(question: QuizQuestion, answer: string): boolean {
  if (question.questionType === 'multiple-choice') {
    return answer === question.correctAnswer
  }
  const lower = answer.toLowerCase()
  const matched = (question.keywords ?? []).filter(kw => lower.includes(kw.toLowerCase()))
  return matched.length >= (question.minKeywords ?? 1)
}

export function computeScore(correctCount: number, totalCount: number): number {
  if (totalCount === 0) return 0
  return Math.round((correctCount / totalCount) * 100)
}

export const PASS_THRESHOLD = 70
