"use client"

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Paper, PaperDetail, PaperSummary } from "@/types/paper"
import type { PaginatedResponse } from "@/types/api"

// ---------- Feed (infinite) ----------
export function useFeed(
  fieldIds?: string[],
  sort: "newest" | "cited" | "trending" = "newest",
  pageSize = 20
) {
  return useInfiniteQuery({
    queryKey: ["feed", fieldIds, sort] as const,
    queryFn: ({ pageParam }: { pageParam: number }) => {
      const params: Record<string, string> = {
        page: String(pageParam),
        size: String(pageSize),
        sort,
      }
      if (fieldIds && fieldIds.length > 0) {
        params.fields = fieldIds.join(",")
      }
      return apiClient.get<PaginatedResponse<Paper>>("/feed", params)
    },
    getNextPageParam: (lastPage: PaginatedResponse<Paper>) =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
    initialPageParam: 0,
  })
}

// ---------- Paper detail ----------
export function usePaperDetail(paperId: string) {
  return useQuery<PaperDetail>({
    queryKey: ["paper", paperId],
    queryFn: () => apiClient.get<PaperDetail>(`/papers/${paperId}`),
    enabled: !!paperId,
  })
}

// ---------- Paper summaries ----------
export function usePaperSummaries(paperId: string) {
  return useQuery<PaperSummary[]>({
    queryKey: ["paper-summaries", paperId],
    queryFn: () =>
      apiClient.get<PaperSummary[]>(`/papers/${paperId}/summaries`),
    enabled: !!paperId,
    refetchInterval: (query) => {
      const data = query.state.data
      if (!data) return false
      const hasPending = data.some(
        (s) => s.status === "PENDING" || s.status === "GENERATING"
      )
      return hasPending ? 5000 : false
    },
  })
}

// ---------- Bookmarks ----------
export function useBookmarks(page = 0) {
  return useQuery<PaginatedResponse<Paper>>({
    queryKey: ["bookmarks", page],
    queryFn: () =>
      apiClient.get<PaginatedResponse<Paper>>("/bookmarks", {
        page: String(page),
      }),
  })
}

// ---------- Toggle bookmark ----------
export function useToggleBookmark() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { paperId: string; isBookmarked: boolean }>({
    mutationFn: async ({ paperId, isBookmarked }) => {
      if (isBookmarked) {
        await apiClient.delete(`/bookmarks/${paperId}`)
      } else {
        await apiClient.post<void>(`/bookmarks`, { paperId })
      }
    },
    onSuccess: (_data, { paperId }) => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] })
      queryClient.invalidateQueries({ queryKey: ["paper", paperId] })
      queryClient.invalidateQueries({ queryKey: ["feed"] })
    },
  })
}
