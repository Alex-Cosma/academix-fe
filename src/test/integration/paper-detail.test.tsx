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
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createElement, type ReactNode } from "react"
import PaperDetailPage from "@/app/(app)/paper/[id]/page"
import type { PaperDetail, PaperSummary, PaperProgress } from "@/types/paper"

// --- Mocks ---
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/paper/paper-42",
}))

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: { name: "Test User", email: "test@example.com" },
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

// Mock useMediaQuery to return true (desktop) by default
vi.mock("@/hooks/use-media-query", () => ({
  useMediaQuery: () => true,
}))

// --- Test data ---
const mockPaper: PaperDetail = {
  id: "paper-42",
  title: "Transformers for Natural Language Processing",
  authors: [
    { name: "Jane Smith", affiliation: "MIT" },
    { name: "John Doe", affiliation: "Stanford" },
  ],
  abstract:
    "We present a comprehensive survey of transformer architectures for NLP tasks.",
  journal: "Nature Machine Intelligence",
  publicationDate: "2023-03-15",
  doi: "10.1038/s41234",
  citationCount: 1_234,
  fields: ["computer-science", "linguistics"],
  keywords: ["NLP", "transformers"],
  teaserSummary: "A survey of transformers in NLP",
  isOpenAccess: true,
  isBookmarked: false,
  summaries: [],
}

const mockSummaries: PaperSummary[] = [
  {
    id: 1,
    paperId: 42,
    level: 1,
    title: "Foundation",
    content: "This paper talks about how computers learn to read.",
    status: "COMPLETED",
    readingTimeMinutes: 2,
    locked: false,
  },
  {
    id: 2,
    paperId: 42,
    level: 2,
    title: "Context",
    content:
      "Transformers use attention mechanisms to process sequences in parallel.",
    status: "COMPLETED",
    readingTimeMinutes: 5,
    locked: true,
  },
  {
    id: 3,
    paperId: 42,
    level: 3,
    title: "Mechanics",
    content: null,
    status: "PENDING",
    readingTimeMinutes: 0,
    locked: true,
  },
  {
    id: 4,
    paperId: 42,
    level: 4,
    title: "Mastery",
    content: null,
    status: "PENDING",
    readingTimeMinutes: 0,
    locked: true,
  },
]

const mockProgress: PaperProgress = {
  paperId: 42,
  levels: [
    { level: 1, levelName: "Foundation", unlocked: true, quizAvailable: true, completed: false, score: null, xpEarned: 0, attempts: 0, completedAt: null },
    { level: 2, levelName: "Context", unlocked: false, quizAvailable: false, completed: false, score: null, xpEarned: 0, attempts: 0, completedAt: null },
    { level: 3, levelName: "Mechanics", unlocked: false, quizAvailable: false, completed: false, score: null, xpEarned: 0, attempts: 0, completedAt: null },
    { level: 4, levelName: "Mastery", unlocked: false, quizAvailable: false, completed: false, score: null, xpEarned: 0, attempts: 0, completedAt: null },
  ],
  totalXpEarned: 0,
}

// --- MSW Server ---
const server = setupServer(
  http.get("http://localhost:8080/api/papers/paper-42", () => {
    return HttpResponse.json(mockPaper)
  }),
  http.get("http://localhost:8080/api/papers/paper-42/summaries", () => {
    return HttpResponse.json(mockSummaries)
  }),
  http.get("http://localhost:8080/api/papers/paper-42/progress", () => {
    return HttpResponse.json(mockProgress)
  })
)

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }))
afterEach(() => server.resetHandlers())
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

function renderPaperDetail(id = "paper-42") {
  const Wrapper = createWrapper()
  return render(
    <Wrapper>
      <PaperDetailPage params={{ id }} />
    </Wrapper>
  )
}

describe("Paper Detail Page", () => {
  it("shows the paper title", async () => {
    renderPaperDetail()

    await waitFor(() => {
      expect(
        screen.getByText("Transformers for Natural Language Processing")
      ).toBeInTheDocument()
    })
  })

  it("shows author names and affiliations", async () => {
    renderPaperDetail()

    await waitFor(() => {
      expect(screen.getByText(/Jane Smith/)).toBeInTheDocument()
    })

    expect(screen.getByText(/MIT/)).toBeInTheDocument()
    expect(screen.getByText(/John Doe/)).toBeInTheDocument()
    expect(screen.getByText(/Stanford/)).toBeInTheDocument()
  })

  it("shows journal name", async () => {
    renderPaperDetail()

    await waitFor(() => {
      expect(
        screen.getByText("Nature Machine Intelligence")
      ).toBeInTheDocument()
    })
  })

  it("shows publication year", async () => {
    renderPaperDetail()

    await waitFor(() => {
      expect(screen.getByText("2023")).toBeInTheDocument()
    })
  })

  it("shows citation count", async () => {
    renderPaperDetail()

    await waitFor(() => {
      expect(screen.getByText(/1,234 citations/)).toBeInTheDocument()
    })
  })

  it("shows Open Access badge", async () => {
    renderPaperDetail()

    await waitFor(() => {
      expect(screen.getByText("Open Access")).toBeInTheDocument()
    })
  })

  it("shows field badges", async () => {
    renderPaperDetail()

    await waitFor(() => {
      expect(screen.getByText("Computer Science")).toBeInTheDocument()
    })

    expect(screen.getByText("Linguistics")).toBeInTheDocument()
  })

  it("shows the abstract", async () => {
    renderPaperDetail()

    await waitFor(() => {
      expect(
        screen.getByText(
          "We present a comprehensive survey of transformer architectures for NLP tasks."
        )
      ).toBeInTheDocument()
    })
  })

  it("shows Bookmark button", async () => {
    renderPaperDetail()

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /bookmark/i })
      ).toBeInTheDocument()
    })
  })

  it("shows Back to feed link", async () => {
    renderPaperDetail()

    await waitFor(() => {
      expect(screen.getByText("Back to feed")).toBeInTheDocument()
    })

    const backLink = screen.getByText("Back to feed").closest("a")
    expect(backLink).toHaveAttribute("href", "/feed")
  })

  it("shows AI Summaries heading", async () => {
    renderPaperDetail()

    await waitFor(() => {
      expect(screen.getByText("AI Summaries")).toBeInTheDocument()
    })
  })

  it("shows summary level tabs (desktop mode)", async () => {
    renderPaperDetail()

    await waitFor(() => {
      expect(screen.getAllByText(/Foundation/).length).toBeGreaterThanOrEqual(1)
    })

    expect(screen.getAllByText(/Context/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Mechanics/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Mastery/).length).toBeGreaterThanOrEqual(1)
  })

  it("shows 'Summary being generated' for PENDING summaries", async () => {
    // Override to return only PENDING unlocked summary
    server.use(
      http.get("http://localhost:8080/api/papers/paper-42/summaries", () => {
        return HttpResponse.json([
          {
            id: 1,
            paperId: 42,
            level: 1,
            title: "Foundation",
            content: null,
            status: "PENDING",
            readingTimeMinutes: 0,
            locked: false,
          },
        ])
      })
    )

    renderPaperDetail()

    await waitFor(() => {
      expect(
        screen.getByText("Summary being generated...")
      ).toBeInTheDocument()
    })
  })

  it("shows DOI link when paper has a doi", async () => {
    renderPaperDetail()

    await waitFor(() => {
      expect(screen.getByRole("link", { name: /doi/i })).toBeInTheDocument()
    })

    const doiLink = screen.getByRole("link", { name: /doi/i })
    expect(doiLink).toHaveAttribute("href", "https://doi.org/10.1038/s41234")
  })

  it("shows Semantic Scholar link", async () => {
    renderPaperDetail()

    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: /semantic scholar/i })
      ).toBeInTheDocument()
    })

    const ssLink = screen.getByRole("link", { name: /semantic scholar/i })
    expect(ssLink).toHaveAttribute(
      "href",
      "https://www.semanticscholar.org/paper/paper-42"
    )
  })
})
