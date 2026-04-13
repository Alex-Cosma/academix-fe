import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { PaperTile } from "@/components/feed/paper-tile"
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

const makePaper = (overrides: Partial<Paper> = {}): Paper => ({
  id: "paper-123",
  title: "Attention Is All You Need",
  authors: [{ name: "A. Vaswani" }],
  abstract: "The dominant sequence transduction models...",
  journal: "NeurIPS 2017",
  publicationDate: "2017-06-12",
  doi: "10.5555/3295222",
  citationCount: 90_000,
  fields: ["computer-science", "mathematics"],
  keywords: ["transformers", "attention"],
  teaserSummary:
    "This paper introduces the Transformer architecture, replacing recurrence with self-attention for sequence-to-sequence tasks.",
  isOpenAccess: true,
  isBookmarked: false,
  ...overrides,
})

describe("PaperTile", () => {
  it("renders the paper title", () => {
    render(<PaperTile paper={makePaper()} size="large" />)
    expect(screen.getByText("Attention Is All You Need")).toBeInTheDocument()
  })

  it("renders the citation count formatted with locale string", () => {
    render(<PaperTile paper={makePaper()} size="large" />)
    expect(screen.getByText("90,000")).toBeInTheDocument()
  })

  it("links to the correct paper detail URL", () => {
    render(<PaperTile paper={makePaper({ id: "abc-42" })} size="small" />)
    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/paper/abc-42")
  })

  it("shows the colored left border based on primary field", () => {
    const { container } = render(
      <PaperTile paper={makePaper()} size="large" />
    )
    const borderDiv = container.querySelector(
      ".absolute.left-0.top-0.bottom-0.w-1"
    )
    expect(borderDiv).toBeTruthy()
    // computer-science maps to "hsl(210, 70%, 50%)" — jsdom converts HSL to RGB
    const style = borderDiv?.getAttribute("style") ?? ""
    expect(
      style.includes("hsl(210, 70%, 50%)") ||
        style.includes("rgb(38, 128, 217)")
    ).toBe(true)
  })

  // ---- Large tile specifics ----
  it("large tile shows TLDR text", () => {
    render(<PaperTile paper={makePaper()} size="large" />)
    expect(
      screen.getByText(/This paper introduces the Transformer architecture/)
    ).toBeInTheDocument()
  })

  it("large tile shows field badges", () => {
    render(<PaperTile paper={makePaper()} size="large" />)
    expect(screen.getByText("Computer Science")).toBeInTheDocument()
    expect(screen.getByText("Mathematics")).toBeInTheDocument()
  })

  it("large tile shows journal name", () => {
    render(<PaperTile paper={makePaper()} size="large" />)
    expect(screen.getByText("NeurIPS 2017")).toBeInTheDocument()
  })

  it("large tile shows publication year", () => {
    render(<PaperTile paper={makePaper()} size="large" />)
    expect(screen.getByText("2017")).toBeInTheDocument()
  })

  // ---- Medium tile specifics ----
  it("medium tile shows journal but not TLDR", () => {
    render(<PaperTile paper={makePaper()} size="medium" />)
    expect(screen.getByText("NeurIPS 2017")).toBeInTheDocument()
    expect(
      screen.queryByText(/This paper introduces the Transformer architecture/)
    ).not.toBeInTheDocument()
  })

  it("medium tile shows only the first field badge", () => {
    render(<PaperTile paper={makePaper()} size="medium" />)
    expect(screen.getByText("Computer Science")).toBeInTheDocument()
    expect(screen.queryByText("Mathematics")).not.toBeInTheDocument()
  })

  // ---- Small tile specifics ----
  it("small tile shows minimal info: no TLDR, no journal, no field badges", () => {
    render(<PaperTile paper={makePaper()} size="small" />)
    expect(screen.getByText("Attention Is All You Need")).toBeInTheDocument()
    expect(screen.queryByText("NeurIPS 2017")).not.toBeInTheDocument()
    expect(
      screen.queryByText(/This paper introduces the Transformer architecture/)
    ).not.toBeInTheDocument()
    expect(screen.queryByText("Computer Science")).not.toBeInTheDocument()
  })

  it("small tile still renders citation count", () => {
    render(<PaperTile paper={makePaper()} size="small" />)
    expect(screen.getByText("90,000")).toBeInTheDocument()
  })

  // ---- Edge cases ----
  it("renders without TLDR when teaserSummary is empty", () => {
    render(
      <PaperTile paper={makePaper({ teaserSummary: "" })} size="large" />
    )
    expect(screen.getByText("Attention Is All You Need")).toBeInTheDocument()
  })

  it("renders with tile-large class for large size", () => {
    const { container } = render(
      <PaperTile paper={makePaper()} size="large" />
    )
    const link = container.querySelector("a")
    expect(link?.className).toContain("tile-large")
  })

  it("renders with tile-small class for small size", () => {
    const { container } = render(
      <PaperTile paper={makePaper()} size="small" />
    )
    const link = container.querySelector("a")
    expect(link?.className).toContain("tile-small")
  })
})
