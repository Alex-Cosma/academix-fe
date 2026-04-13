import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { OAuthButton } from "@/components/auth/oauth-button"

describe("OAuthButton", () => {
  const defaultProps = {
    provider: "google",
    icon: <svg data-testid="test-icon" />,
    label: "Continue with Google",
    onClick: vi.fn(),
  }

  it("renders with label and icon", () => {
    render(<OAuthButton {...defaultProps} />)
    expect(screen.getByText("Continue with Google")).toBeInTheDocument()
    expect(screen.getByTestId("test-icon")).toBeInTheDocument()
  })

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<OAuthButton {...defaultProps} onClick={handleClick} />)

    await user.click(screen.getByRole("button"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("is disabled when disabled prop is true", () => {
    render(<OAuthButton {...defaultProps} disabled />)
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<OAuthButton {...defaultProps} onClick={handleClick} disabled />)

    await user.click(screen.getByRole("button"))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it("has correct CSS classes including w-full", () => {
    render(<OAuthButton {...defaultProps} />)
    const button = screen.getByRole("button")
    expect(button.className).toContain("w-full")
  })

  it("applies additional className when provided", () => {
    render(<OAuthButton {...defaultProps} className="opacity-50" />)
    const button = screen.getByRole("button")
    expect(button.className).toContain("opacity-50")
  })

  it("renders as outline variant with border styles", () => {
    render(<OAuthButton {...defaultProps} />)
    const button = screen.getByRole("button")
    expect(button.className).toContain("border")
  })
})
