import { describe, it, expect } from "vitest"
import { assignTileSize } from "@/hooks/use-metro-layout"
import type { Paper } from "@/types/paper"

const basePaper: Paper = {
  id: "1",
  title: "Test Paper",
  authors: [],
  abstract: "Test",
  journal: "Test Journal",
  publicationDate: "2024-01-01",
  doi: "10.1234/test",
  citationCount: 10,
  fields: ["physics"],
  keywords: [],
  teaserSummary: "Test",
  isOpenAccess: false,
  isBookmarked: false,
}

describe("assignTileSize", () => {
  it("assigns large to the first paper", () => {
    expect(assignTileSize(basePaper, 0)).toBe("large")
  })

  it("assigns medium to highly cited papers", () => {
    const cited = { ...basePaper, citationCount: 200 }
    expect(assignTileSize(cited, 5)).toBe("medium")
  })

  it("assigns medium to every 7th paper (index % 7 === 3)", () => {
    expect(assignTileSize(basePaper, 3)).toBe("medium")
    expect(assignTileSize(basePaper, 10)).toBe("medium")
  })

  it("assigns small to regular papers", () => {
    expect(assignTileSize(basePaper, 1)).toBe("small")
    expect(assignTileSize(basePaper, 2)).toBe("small")
  })
})
