import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterEach,
  afterAll,
  beforeEach,
} from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createElement, type ReactNode } from "react"
import FeedPage from "@/app/(app)/feed/page"
import { useFeedStore } from "@/stores/feed-store"
import type { Paper } from "@/types/paper"
import type { PaginatedResponse } from "@/types/api"

// --- Mocks ---
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/feed",
}))

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: { name: "Test User", email: "test@example.com", onboardingComplete: true },
      accessToken: "test-token",
    },
    status: "authenticated",
  }),
  getSession: () => Promise.resolve({ accessToken: "test-token" }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}))

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

// --- Test data ---
const makePaper = (
  id: string,
  title: string,
  citationCount = 50
): Paper => ({
  id,
  title,
  authors: [{ name: "Author" }],
  abstract: "Abstract",
  journal: "Test Journal",
  publicationDate: "2024-01-15",
  doi: "10.1234/test",
  citationCount,
  fields: ["computer-science"],
  keywords: ["test"],
  teaserSummary: "Short summary of the paper",
  isOpenAccess: false,
  isBookmarked: false,
})

const userProfile = {
  id: "user-1",
  displayName: "Test User",
  email: "test@example.com",
  interests: [
    { id: 1, name: "Computer Science", slug: "computer-science", iconName: null },
    { id: 2, name: "Physics", slug: "physics", iconName: null },
  ],
  onboardingComplete: true,
}

const feedResponse = (
  papers: Paper[]
): PaginatedResponse<Paper> => ({
  content: papers,
  page: 0,
  size: 20,
  totalElements: papers.length,
  totalPages: 1,
  hasNext: false,
})

// --- MSW Server ---
const server = setupServer(
  http.get("http://localhost:8080/api/users/me", () => {
    return HttpResponse.json(userProfile)
  }),
  http.get("http://localhost:8080/api/feed", () => {
    return HttpResponse.json(
      feedResponse([
        makePaper("p1", "Deep Learning Advances", 500),
        makePaper("p2", "Quantum Computing Survey", 120),
        makePaper("p3", "Graph Neural Networks", 30),
      ])
    )
  })
)

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }))
afterEach(() => {
  server.resetHandlers()
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

function renderFeedPage() {
  const Wrapper = createWrapper()
  return render(
    <Wrapper>
      <FeedPage />
    </Wrapper>
  )
}

describe("Feed Page", () => {
  beforeEach(() => {
    useFeedStore.setState({ activeFields: [], sortOrder: "newest" })
  })

  it("renders the page heading", () => {
    renderFeedPage()
    expect(screen.getByText("Your Feed")).toBeInTheDocument()
    expect(
      screen.getByText("Papers from your fields of interest")
    ).toBeInTheDocument()
  })

  it("renders paper tiles from API data", async () => {
    renderFeedPage()

    await waitFor(() => {
      expect(screen.getByText("Deep Learning Advances")).toBeInTheDocument()
    })

    expect(screen.getByText("Quantum Computing Survey")).toBeInTheDocument()
    expect(screen.getByText("Graph Neural Networks")).toBeInTheDocument()
  })

  it("sort button shows 'Latest' by default (newest sort)", () => {
    renderFeedPage()
    expect(
      screen.getByRole("button", { name: /latest/i })
    ).toBeInTheDocument()
  })

  it("sort toggle switches between Latest and Most Cited", async () => {
    const user = userEvent.setup()
    renderFeedPage()

    const sortButton = screen.getByRole("button", { name: /latest/i })
    await user.click(sortButton)

    // After clicking, it should show "Most Cited"
    expect(
      screen.getByRole("button", { name: /most cited/i })
    ).toBeInTheDocument()
    expect(useFeedStore.getState().sortOrder).toBe("cited")

    // Click again to switch back
    await user.click(screen.getByRole("button", { name: /most cited/i }))
    expect(
      screen.getByRole("button", { name: /latest/i })
    ).toBeInTheDocument()
    expect(useFeedStore.getState().sortOrder).toBe("newest")
  })

  it("shows empty state when no papers are returned", async () => {
    server.use(
      http.get("http://localhost:8080/api/feed", () => {
        return HttpResponse.json(feedResponse([]))
      })
    )

    renderFeedPage()

    await waitFor(() => {
      expect(
        screen.getByText("No papers found for your interests")
      ).toBeInTheDocument()
    })

    expect(
      screen.getByText(
        "Try adjusting your field filters or updating your interests in settings."
      )
    ).toBeInTheDocument()
  })

  it("shows field filter chips after user profile loads", async () => {
    renderFeedPage()

    await waitFor(() => {
      expect(screen.getByText("Computer Science")).toBeInTheDocument()
    })

    expect(screen.getByText("Physics")).toBeInTheDocument()
  })
})
