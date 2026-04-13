import { describe, it, expect, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { FieldChip } from "@/components/onboarding/field-chip"
import { useOnboardingStore } from "@/stores/onboarding-store"

describe("FieldChip", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset()
  })

  it("renders the field name", () => {
    render(<FieldChip slug="physics" name="Physics" iconName="atom" />)
    expect(screen.getByText("Physics")).toBeInTheDocument()
  })

  it("renders as a button", () => {
    render(<FieldChip slug="physics" name="Physics" iconName="atom" />)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("toggles selection on click - adds field to store", async () => {
    const user = userEvent.setup()
    render(<FieldChip slug="physics" name="Physics" iconName="atom" />)

    await user.click(screen.getByRole("button"))
    expect(useOnboardingStore.getState().selectedFields).toContain("physics")
  })

  it("toggles selection on click - removes field from store", async () => {
    const user = userEvent.setup()
    useOnboardingStore.getState().toggleField("physics")

    render(<FieldChip slug="physics" name="Physics" iconName="atom" />)

    await user.click(screen.getByRole("button"))
    expect(useOnboardingStore.getState().selectedFields).not.toContain(
      "physics"
    )
  })

  it("shows selected visual state when field is in store", () => {
    useOnboardingStore.getState().toggleField("physics")
    render(<FieldChip slug="physics" name="Physics" iconName="atom" />)

    const button = screen.getByRole("button")
    expect(button.className).toContain("border-primary")
    expect(button.className).toContain("bg-primary")
  })

  it("shows unselected state when field is not in store", () => {
    render(<FieldChip slug="physics" name="Physics" iconName="atom" />)

    const button = screen.getByRole("button")
    expect(button.className).toContain("border-border")
    expect(button.className).toContain("bg-card")
  })
})
