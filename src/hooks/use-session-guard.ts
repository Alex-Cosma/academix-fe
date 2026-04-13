"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"

export function useSessionGuard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (
      session &&
      !session.user?.onboardingComplete &&
      pathname !== "/onboarding"
    ) {
      router.push("/onboarding")
    }
  }, [session, status, router, pathname])

  return { session, status }
}
