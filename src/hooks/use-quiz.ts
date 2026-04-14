"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type {
  PaperProgress,
  QuizData,
  QuizResult,
  QuizAnswerSubmission,
} from "@/types/paper"

export function usePaperProgress(paperId: string) {
  return useQuery<PaperProgress>({
    queryKey: ["paper-progress", paperId],
    queryFn: () =>
      apiClient.get<PaperProgress>(`/papers/${paperId}/progress`),
    enabled: !!paperId,
  })
}

export function useQuizQuestions(paperId: string, level: number | null) {
  return useQuery<QuizData>({
    queryKey: ["quiz-questions", paperId, level],
    queryFn: () =>
      apiClient.get<QuizData>(`/papers/${paperId}/quiz/${level}`),
    enabled: !!paperId && level !== null,
  })
}

export function useSubmitQuiz() {
  const queryClient = useQueryClient()

  return useMutation<
    QuizResult,
    Error,
    { paperId: string; level: number; answers: QuizAnswerSubmission[] }
  >({
    mutationFn: async ({ paperId, level, answers }) => {
      return apiClient.post<QuizResult>(
        `/papers/${paperId}/quiz/${level}`,
        { answers }
      )
    },
    onSuccess: (_data, { paperId }) => {
      queryClient.invalidateQueries({ queryKey: ["paper-progress", paperId] })
      queryClient.invalidateQueries({
        queryKey: ["paper-summaries", paperId],
      })
    },
  })
}
