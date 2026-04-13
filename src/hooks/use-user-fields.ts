"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

interface UserProfile {
  id: string
  name: string
  email: string
  image?: string
  interests: string[]
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
      await apiClient.put<void>("/users/me/interests", { interests: fieldSlugs })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] })
      queryClient.invalidateQueries({ queryKey: ["feed"] })
    },
  })
}
