"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryFallbackProps {
  message?: string
  onRetry?: () => void
}

export function ErrorBoundaryFallback({
  message = "Something went wrong",
  onRetry,
}: ErrorBoundaryFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <div>
        <h3 className="text-lg font-semibold">Oops!</h3>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      )}
    </div>
  )
}
