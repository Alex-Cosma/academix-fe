import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { TileSize } from "@/hooks/use-metro-layout"

interface PaperTileSkeletonProps {
  size: TileSize
}

export function PaperTileSkeleton({ size }: PaperTileSkeletonProps) {
  const tileClass = cn(
    "relative flex flex-col overflow-hidden rounded-lg border bg-card p-4 pl-5",
    size === "large" && "tile-large",
    size === "medium" && "tile-medium",
    size === "small" && "tile-small"
  )

  return (
    <div className={tileClass}>
      {/* Left border accent skeleton */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        {/* Title */}
        <div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-1.5 h-4 w-3/4" />

          {/* Venue line for medium/large */}
          {(size === "large" || size === "medium") && (
            <Skeleton className="mt-2 h-3 w-1/2" />
          )}

          {/* TLDR lines for large */}
          {size === "large" && (
            <div className="mt-3 space-y-1.5">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          )}
        </div>

        {/* Bottom badges + meta */}
        <div className="mt-2 flex items-center gap-2">
          {(size === "large" || size === "medium") && (
            <Skeleton className="h-4 w-20 rounded-full" />
          )}
          {size === "large" && (
            <Skeleton className="h-4 w-16 rounded-full" />
          )}
          <div className="ml-auto flex items-center gap-2">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
      </div>
    </div>
  )
}
