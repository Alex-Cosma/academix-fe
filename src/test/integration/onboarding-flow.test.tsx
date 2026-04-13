import { describe, it, expect, vi, beforeAll, afterEach, afterAll, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import OnboardingPage from "@/app/(app)/onboarding/page"
import { useOnboardingStore } from "@/stores/onboarding-store"

const pushMock = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn() }),
  usePathname: () => "/onboarding",
}))

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { onboardingComplete: false }, accessToken: "test-token" },
    status: "authenticated",
  }),
  getSession: () =>
    Promise.resolve({ accessToken: "test-token" }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}))

let capturedBody: unknown = null

const server = setupServer(
  http.put("http://localhost:8080/api/users/me/interests", async ({ request }) => {
    capturedBody = await request.json()
    return HttpResponse.json({ success: true })
  })
)

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  capturedBody = null
})
afterAll(() => server.close())

describe("Onboarding Flow", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset()
    pushMock.mockClear()
  })

  it("renders the onboarding page heading and instructions", () => {
    render(<OnboardingPage />)

    expect(screen.getByText("What topics excite you?")).toBeInTheDocument()
    expect(
      screen.getByText("Choose 3 to 7 fields to personalize your feed")
    ).toBeInTheDocument()
  })

  it("shows initial counter as 0 selected", () => {
    render(<OnboardingPage />)

    expect(screen.getByText(/0 of 3/)).toBeInTheDocument()
  })

  it("has Continue button disabled initially", () => {
    render(<OnboardingPage />)

    const button = screen.getByRole("button", { name: /continue to feed/i })
    expect(button).toBeDisabled()
  })

  it("selecting 3 fields enables the Continue button and updates counter", async () => {
    const user = userEvent.setup()
    render(<OnboardingPage />)

    await user.click(screen.getByText("Computer Science"))
    await user.click(screen.getByText("Physics"))
    await user.click(screen.getByText("Mathematics"))

    expect(screen.getByText(/3 of 3/)).toBeInTheDocument()

    const button = screen.getByRole("button", { name: /continue to feed/i })
    expect(button).toBeEnabled()
  })

  it("selecting fewer than 3 fields keeps Continue disabled", async () => {
    const user = userEvent.setup()
    render(<OnboardingPage />)

    await user.click(screen.getByText("Computer Science"))
    await user.click(screen.getByText("Physics"))

    expect(screen.getByText(/2 of 3/)).toBeInTheDocument()

    const button = screen.getByRole("button", { name: /continue to feed/i })
    expect(button).toBeDisabled()
  })

  it("clicking Continue submits interests and navigates to feed", async () => {
    const user = userEvent.setup()
    render(<OnboardingPage />)

    await user.click(screen.getByText("Computer Science"))
    await user.click(screen.getByText("Physics"))
    await user.click(screen.getByText("Mathematics"))

    const button = screen.getByRole("button", { name: /continue to feed/i })
    await user.click(button)

    // Wait for the API call to complete and navigation to happen
    await vi.waitFor(() => {
      expect(capturedBody).toEqual({
        fieldIds: ["computer-science", "physics", "mathematics"],
      })
    })

    await vi.waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/feed")
    })
  })

  it("deselecting a field removes it from count", async () => {
    const user = userEvent.setup()
    render(<OnboardingPage />)

    await user.click(screen.getByText("Computer Science"))
    await user.click(screen.getByText("Physics"))
    await user.click(screen.getByText("Mathematics"))
    expect(screen.getByText(/3 of 3/)).toBeInTheDocument()

    // Deselect one
    await user.click(screen.getByText("Physics"))
    expect(screen.getByText(/2 of 3/)).toBeInTheDocument()

    const button = screen.getByRole("button", { name: /continue to feed/i })
    expect(button).toBeDisabled()
  })
})
