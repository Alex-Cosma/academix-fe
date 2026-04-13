"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getFieldColor } from "@/config/field-colors"
import { FIELDS_OF_INTEREST } from "@/config/fields-of-interest"
import type { Paper } from "@/types/paper"
import type { TileSize } from "@/hooks/use-metro-layout"
import { cn } from "@/lib/utils"

interface PaperTileProps {
  paper: Paper
  size: TileSize
}

function getFieldLabel(slug: string): string {
  const field = FIELDS_OF_INTEREST.find((f) => f.slug === slug)
  return field?.name ?? slug
}

export function PaperTile({ paper, size }: PaperTileProps) {
  const primaryField = paper.fields[0]
  const borderColor = primaryField ? getFieldColor(primaryField) : undefined

  const tileClass = cn(
    "group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground transition-shadow duration-200 hover:shadow-lg cursor-pointer",
    size === "large" && "tile-large",
    size === "medium" && "tile-medium",
    size === "small" && "tile-small"
  )

  return (
    <Link href={`/paper/${paper.id}`} className={tileClass}>
      {/* Left border accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
        style={{ backgroundColor: borderColor }}
      />

      <div className="flex flex-1 flex-col justify-between p-4 pl-5">
        {/* Top section */}
        <div className="flex-1 overflow-hidden">
          <h3
            className={cn(
              "font-serif font-bold leading-snug line-clamp-2",
              size === "large" ? "text-lg" : "text-sm"
            )}
          >
            {paper.title}
          </h3>

          {/* Venue + Year row */}
          {(size === "large" || size === "medium") && paper.journal && (
            <p className="mt-1 text-xs text-muted-foreground truncate">
              {paper.journal}
            </p>
          )}

          {/* TLDR for large tiles */}
          {size === "large" && paper.teaserSummary && (
            <p className="mt-2 text-xs text-muted-foreground line-clamp-3">
              {paper.teaserSummary}
            </p>
          )}
        </div>

        {/* Bottom section */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {/* Field badges */}
          {size === "large" &&
            paper.fields.slice(0, 2).map((slug) => (
              <Badge
                key={slug}
                variant="secondary"
                className="text-[10px] px-1.5 py-0"
                style={{
                  borderLeft: `3px solid ${getFieldColor(slug)}`,
                }}
              >
                {getFieldLabel(slug)}
              </Badge>
            ))}

          {size === "medium" && paper.fields[0] && (
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0"
              style={{
                borderLeft: `3px solid ${getFieldColor(paper.fields[0])}`,
              }}
            >
              {getFieldLabel(paper.fields[0])}
            </Badge>
          )}

          {/* Citation count + year */}
          <div className="ml-auto flex items-center gap-2 text-[11px] text-muted-foreground">
            {paper.publicationDate && (
              <span>{new Date(paper.publicationDate).getFullYear()}</span>
            )}
            <span className="flex items-center gap-0.5">
              <svg
                className="h-3 w-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21" />
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3" />
              </svg>
              {paper.citationCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
