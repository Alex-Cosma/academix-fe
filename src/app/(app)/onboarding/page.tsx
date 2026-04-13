"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FieldSelector } from "@/components/onboarding/field-selector"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { FIELDS_OF_INTEREST } from "@/config/fields-of-interest"
import { apiClient } from "@/lib/api-client"
import { Loader2 } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const { selectedFields } = useOnboardingStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canContinue = selectedFields.length >= 3
  const selectionCount = selectedFields.length

  async function handleContinue() {
    if (!canContinue) return

    setIsSubmitting(true)
    try {
      await apiClient.put("/users/me/interests", {
        fieldIds: selectedFields,
      })
      router.push("/feed")
    } catch (error) {
      console.error("Failed to save interests:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">
            What topics excite you?
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Choose 3 to 7 fields to personalize your feed
          </p>
          <p className="text-sm font-medium text-primary">
            {selectionCount} of 3&ndash;7 selected
          </p>
        </div>

        <FieldSelector fields={FIELDS_OF_INTEREST} />

        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            className="min-w-[200px]"
            disabled={!canContinue || isSubmitting}
            onClick={handleContinue}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Continue to Feed"
            )}
          </Button>
        </div>
      </div>
    </main>
  )
}
