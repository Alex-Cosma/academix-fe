import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MetroGrid } from "@/components/feed/metro-grid"
import type { Paper } from "@/types/paper"

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string
    children: React.ReactNode
    className?: string
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

const makePaper = (id: string, title: string, citationCount = 50): Paper => ({
  id,
  title,
  authors: [{ name: "Author" }],
  abstract: "Abstract text",
  journal: "Journal",
  publicationDate: "2024-01-01",
  doi: "10.1234/test",
  citationCount,
  fields: ["computer-science"],
  keywords: ["test"],
  teaserSummary: "A short summary",
  isOpenAccess: false,
  isBookmarked: false,
})

describe("MetroGrid", () => {
  it("renders paper tiles with their titles", () => {
    const papers = [
      makePaper("1", "Paper Alpha", 200),
      makePaper("2", "Paper Beta"),
      makePaper("3", "Paper Gamma"),
    ]

    render(<MetroGrid papers={papers} />)

    expect(screen.getByText("Paper Alpha")).toBeInTheDocument()
    expect(screen.getByText("Paper Beta")).toBeInTheDocument()
    expect(screen.getByText("Paper Gamma")).toBeInTheDocument()
  })

  it("renders correct number of tiles for given papers", () => {
    const papers = [
      makePaper("1", "First Paper", 200),
      makePaper("2", "Second Paper"),
    ]

    render(<MetroGrid papers={papers} />)

    const links = screen.getAllByRole("link")
    expect(links).toHaveLength(2)
  })

  it("shows skeletons while loading", () => {
    const { container } = render(<MetroGrid papers={[]} isLoading={true} />)

    // SKELETON_SIZES has 8 entries, so we expect 8 skeleton elements
    // PaperTileSkeleton renders divs with "tile-large", "tile-medium", "tile-small" classes
    const skeletonContainer = container.querySelector(".metro-grid")
    expect(skeletonContainer).toBeTruthy()
    // 8 skeleton divs (one per SKELETON_SIZES entry)
    expect(skeletonContainer?.children.length).toBe(8)
  })

  it("does not show any paper tiles while loading", () => {
    const papers = [makePaper("1", "Should Not Appear")]

    render(<MetroGrid papers={papers} isLoading={true} />)

    expect(screen.queryByText("Should Not Appear")).not.toBeInTheDocument()
  })

  it("shows empty grid when no papers and not loading", () => {
    const { container } = render(<MetroGrid papers={[]} isLoading={false} />)

    const grid = container.querySelector(".metro-grid")
    expect(grid).toBeTruthy()
    expect(grid?.children.length).toBe(0)
  })

  it("renders a metro-grid container div", () => {
    const { container } = render(<MetroGrid papers={[]} />)
    expect(container.querySelector(".metro-grid")).toBeTruthy()
  })
})
