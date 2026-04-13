import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { ThemeToggle } from "@/components/layout/theme-toggle"

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
}))

describe("ThemeToggle", () => {
  it("renders without crashing", () => {
    render(<ThemeToggle />)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("has accessible label 'Toggle theme'", () => {
    render(<ThemeToggle />)
    expect(screen.getByText("Toggle theme")).toBeInTheDocument()
  })

  it("the accessible label is screen-reader only", () => {
    render(<ThemeToggle />)
    const srLabel = screen.getByText("Toggle theme")
    expect(srLabel.className).toContain("sr-only")
  })
})
