import type { Paper } from "@/types/paper"

export type TileSize = "small" | "medium" | "large"

export function assignTileSize(paper: Paper, index: number): TileSize {
  if (index === 0) return "large"
  if (paper.citationCount > 100) return "medium"
  if (index % 7 === 3) return "medium"
  return "small"
}
