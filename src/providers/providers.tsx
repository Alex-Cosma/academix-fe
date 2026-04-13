"use client"

import { SessionProvider } from "next-auth/react"
import type { ReactNode } from "react"
import { QueryProvider } from "./query-provider"
import { ThemeProvider } from "./theme-provider"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </QueryProvider>
    </SessionProvider>
  )
}
