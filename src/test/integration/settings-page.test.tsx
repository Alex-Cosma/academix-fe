import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterEach,
  afterAll,
} from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createElement, type ReactNode } from "react"
import SettingsPage from "@/app/(app)/settings/page"

// --- Mocks ---
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/settings",
}))

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: {
        name: "Jane Researcher",
        email: "jane@university.edu",
        image: "https://example.com/avatar.jpg",
      },
      accessToken: "test-token",
    },
    status: "authenticated",
  }),
  getSession: () => Promise.resolve({ accessToken: "test-token" }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// --- Test data ---
const userProfile = {
  id: "user-1",
  name: "Jane Researcher",
  email: "jane@university.edu",
  image: "https://example.com/avatar.jpg",
  interests: ["computer-science", "physics", "mathematics"],
  onboardingComplete: true,
}

let capturedInterests: unknown = null

// --- MSW Server ---
const server = setupServer(
  http.get("http://localhost:8080/api/users/me", () => {
    return HttpResponse.json(userProfile)
  }),
  http.put(
    "http://localhost:8080/api/users/me/interests",
    async ({ request }) => {
      capturedInterests = await request.json()
      return HttpResponse.json({ success: true })
    }
  )
)

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }))
afterEach(() => {
  server.resetHandlers()
  capturedInterests = null
})
afterAll(() => server.close())

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
    },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

function renderSettingsPage() {
  const Wrapper = createWrapper()
  return render(
    <Wrapper>
      <SettingsPage />
    </Wrapper>
  )
}

describe("Settings Page", () => {
  it("renders the Settings heading", () => {
    renderSettingsPage()
    expect(screen.getByText("Settings")).toBeInTheDocument()
    expect(
      screen.getByText("Manage your profile and preferences")
    ).toBeInTheDocument()
  })

  it("shows user profile info from session", () => {
    renderSettingsPage()
    expect(screen.getByText("Jane Researcher")).toBeInTheDocument()
    expect(screen.getByText("jane@university.edu")).toBeInTheDocument()
  })

  it("shows Profile card", () => {
    renderSettingsPage()
    expect(screen.getByText("Profile")).toBeInTheDocument()
    expect(screen.getByText("Your account information")).toBeInTheDocument()
  })

  it("shows Fields of Interest card", () => {
    renderSettingsPage()
    expect(screen.getByText("Fields of Interest")).toBeInTheDocument()
  })

  it("shows field selector with current interests after loading", async () => {
    renderSettingsPage()

    // Wait for user profile to load and fields to appear
    await waitFor(() => {
      expect(screen.getByText("Computer Science")).toBeInTheDocument()
    })

    // Physics and Mathematics should also be visible as all fields are rendered
    expect(screen.getByText("Physics")).toBeInTheDocument()
    expect(screen.getByText("Mathematics")).toBeInTheDocument()
  })

  it("shows field count after profile loads", async () => {
    renderSettingsPage()

    await waitFor(() => {
      expect(screen.getByText("3/7 fields selected")).toBeInTheDocument()
    })
  })

  it("Save button is disabled when no changes are made", async () => {
    renderSettingsPage()

    await waitFor(() => {
      expect(screen.getByText("3/7 fields selected")).toBeInTheDocument()
    })

    const saveButton = screen.getByRole("button", { name: /save changes/i })
    expect(saveButton).toBeDisabled()
  })

  it("Save button enables when user toggles a field", async () => {
    const user = userEvent.setup()
    renderSettingsPage()

    // Wait for fields to load
    await waitFor(() => {
      expect(screen.getByText("3/7 fields selected")).toBeInTheDocument()
    })

    // Click Biology to add it (it's not in current interests)
    await user.click(screen.getByText("Biology"))

    await waitFor(() => {
      expect(screen.getByText("4/7 fields selected")).toBeInTheDocument()
    })

    const saveButton = screen.getByRole("button", { name: /save changes/i })
    expect(saveButton).toBeEnabled()
  })

  it("Save button calls PUT /api/users/me/interests", async () => {
    const user = userEvent.setup()
    renderSettingsPage()

    await waitFor(() => {
      expect(screen.getByText("3/7 fields selected")).toBeInTheDocument()
    })

    // Add Biology
    await user.click(screen.getByText("Biology"))

    await waitFor(() => {
      expect(screen.getByText("4/7 fields selected")).toBeInTheDocument()
    })

    const saveButton = screen.getByRole("button", { name: /save changes/i })
    await user.click(saveButton)

    await waitFor(() => {
      expect(capturedInterests).toEqual({
        fieldSlugs: expect.arrayContaining([
          "computer-science",
          "physics",
          "mathematics",
          "biology",
        ]),
      })
    })
  })

  it("shows Account section with Delete Account button", () => {
    renderSettingsPage()
    expect(screen.getByText("Account")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /delete account/i })
    ).toBeInTheDocument()
  })
})
