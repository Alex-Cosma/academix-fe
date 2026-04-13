import { describe, it, expect, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { FieldSelector } from "@/components/onboarding/field-selector"
import { useOnboardingStore } from "@/stores/onboarding-store"

const testFields = [
  { name: "Physics", slug: "physics", iconName: "atom" },
  { name: "Chemistry", slug: "chemistry", iconName: "flask-conical" },
  { name: "Biology", slug: "biology", iconName: "leaf" },
]

describe("FieldSelector", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset()
  })

  it("renders all fields passed as props", () => {
    render(<FieldSelector fields={testFields} />)

    expect(screen.getByText("Physics")).toBeInTheDocument()
    expect(screen.getByText("Chemistry")).toBeInTheDocument()
    expect(screen.getByText("Biology")).toBeInTheDocument()
  })

  it("renders the correct number of field chips", () => {
    render(<FieldSelector fields={testFields} />)

    const buttons = screen.getAllByRole("button")
    expect(buttons).toHaveLength(3)
  })

  it("each field is clickable and updates the store", async () => {
    const user = userEvent.setup()
    render(<FieldSelector fields={testFields} />)

    await user.click(screen.getByText("Physics"))
    expect(useOnboardingStore.getState().selectedFields).toContain("physics")

    await user.click(screen.getByText("Chemistry"))
    expect(useOnboardingStore.getState().selectedFields).toContain("chemistry")
  })

  it("renders an empty grid when no fields are provided", () => {
    const { container } = render(<FieldSelector fields={[]} />)

    const grid = container.querySelector(".grid")
    expect(grid).toBeInTheDocument()
    expect(screen.queryAllByRole("button")).toHaveLength(0)
  })
})
