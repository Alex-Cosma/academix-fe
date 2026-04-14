"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

interface FieldOfStudyDto {
  id: number
  name: string
  slug: string
  iconName?: string
}

interface UserProfile {
  id: string
  displayName: string
  email: string
  avatarUrl?: string
  interests: FieldOfStudyDto[]
  onboardingComplete: boolean
}

// ---------- User fields (interests) ----------
export function useUserFields() {
  return useQuery<UserProfile>({
    queryKey: ["user-profile"],
    queryFn: () => apiClient.get<UserProfile>("/users/me"),
  })
}

// ---------- Update interests ----------
export function useUpdateFields() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string[]>({
    mutationFn: async (fieldSlugs) => {
      await apiClient.put<void>("/users/me/interests", { fieldSlugs })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] })
      queryClient.invalidateQueries({ queryKey: ["feed"] })
    },
  })
}
