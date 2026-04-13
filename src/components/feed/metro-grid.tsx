"use client"

import type { Paper } from "@/types/paper"
import { assignTileSize } from "@/hooks/use-metro-layout"
import { PaperTile } from "./paper-tile"
import { PaperTileSkeleton } from "./paper-tile-skeleton"

interface MetroGridProps {
  papers: Paper[]
  isLoading?: boolean
}

const SKELETON_SIZES: Array<"small" | "medium" | "large"> = [
  "large",
  "small",
  "small",
  "medium",
  "small",
  "small",
  "medium",
  "small",
]

export function MetroGrid({ papers, isLoading }: MetroGridProps) {
  if (isLoading) {
    return (
      <div className="metro-grid">
        {SKELETON_SIZES.map((size, i) => (
          <PaperTileSkeleton key={i} size={size} />
        ))}
      </div>
    )
  }

  return (
    <div className="metro-grid">
      {papers.map((paper, index) => (
        <PaperTile
          key={paper.id}
          paper={paper}
          size={assignTileSize(paper, index)}
        />
      ))}
    </div>
  )
}
