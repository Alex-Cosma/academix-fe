"use client"

import { useEffect, useRef, useCallback } from "react"
import { useFeedStore } from "@/stores/feed-store"
import { useFeed } from "@/hooks/use-papers"
import { useUserFields } from "@/hooks/use-user-fields"
import { MetroGrid } from "@/components/feed/metro-grid"
import { ErrorBoundaryFallback } from "@/components/error-boundary"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FIELDS_OF_INTEREST } from "@/config/fields-of-interest"
import { getFieldColor } from "@/config/field-colors"
import { cn } from "@/lib/utils"
import { ArrowDownUp, Loader2 } from "lucide-react"

export default function FeedPage() {
  const { activeFields, sortOrder, toggleField, setActiveFields, setSortOrder } =
    useFeedStore()
  const { data: userProfile, isLoading: isLoadingProfile } = useUserFields()

  // Initialize active fields from user interests once loaded
  const initializedRef = useRef(false)
  useEffect(() => {
    if (userProfile?.interests && !initializedRef.current) {
      setActiveFields(userProfile.interests)
      initializedRef.current = true
    }
  }, [userProfile?.interests, setActiveFields])

  const {
    data,
    isLoading: isLoadingFeed,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useFeed(
    activeFields.length > 0 ? activeFields : undefined,
    sortOrder
  )

  // Infinite scroll via IntersectionObserver
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0]
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  )

  useEffect(() => {
    const el = loadMoreRef.current
    if (!el) return
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "200px",
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [handleObserver])

  // Flatten all pages of papers
  const papers = data?.pages.flatMap((page) => page.content) ?? []

  // User's interest fields for filter chips
  const userInterestFields = FIELDS_OF_INTEREST.filter(
    (f) => userProfile?.interests?.includes(f.slug)
  )

  const toggleSort = () => {
    setSortOrder(sortOrder === "cited" ? "newest" : "cited")
  }

  return (
    <main className="container mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold sm:text-3xl">
            Your Feed
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Papers from your fields of interest
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleSort}
          className="self-start sm:self-auto"
        >
          <ArrowDownUp className="mr-2 h-4 w-4" />
          {sortOrder === "cited" ? "Most Cited" : "Latest"}
        </Button>
      </div>

      {/* Field filter chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {isLoadingProfile ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-24 rounded-full" />
            ))}
          </>
        ) : (
          userInterestFields.map((field) => {
            const isActive = activeFields.includes(field.slug)
            return (
              <button
                key={field.slug}
                type="button"
                onClick={() => toggleField(field.slug)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  isActive
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-secondary"
                )}
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: getFieldColor(field.slug) }}
                />
                {field.name}
              </button>
            )
          })
        )}
      </div>

      {/* Error state */}
      {isError && (
        <ErrorBoundaryFallback
          message={error?.message ?? "Failed to load papers"}
          onRetry={() => refetch()}
        />
      )}

      {/* Feed content */}
      {!isError && (
        <div className="mt-6">
          <MetroGrid papers={papers} isLoading={isLoadingFeed} />

          {/* Empty state */}
          {!isLoadingFeed && papers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-lg font-medium text-muted-foreground">
                No papers found for your interests
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your field filters or updating your interests in
                settings.
              </p>
            </div>
          )}

          {/* Load more sentinel */}
          <div ref={loadMoreRef} className="py-4 text-center">
            {isFetchingNextPage && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Loading more papers...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
