import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createElement, type ReactNode } from "react"
import { usePaperDetail, usePaperSummaries, useFeed } from "@/hooks/use-papers"

// Mock the api-client module
vi.mock("@/lib/api-client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

// Mock next-auth/react (needed by api-client internally)
vi.mock("next-auth/react", () => ({
  getSession: () => Promise.resolve({ accessToken: "test-token" }),
}))

import { apiClient } from "@/lib/api-client"

const mockedGet = vi.mocked(apiClient.get)

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe("usePaperDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("fetches paper detail when paperId is provided", async () => {
    const mockPaper = { id: "paper-1", title: "Test Paper" }
    mockedGet.mockResolvedValueOnce(mockPaper)

    const { result } = renderHook(() => usePaperDetail("paper-1"), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockedGet).toHaveBeenCalledWith("/papers/paper-1")
    expect(result.current.data).toEqual(mockPaper)
  })

  it("does not fetch when paperId is empty string", () => {
    const { result } = renderHook(() => usePaperDetail(""), {
      wrapper: createWrapper(),
    })

    // enabled: !!paperId will be false for empty string
    expect(result.current.fetchStatus).toBe("idle")
    expect(mockedGet).not.toHaveBeenCalled()
  })
})

describe("usePaperSummaries", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("fetches summaries for a paper", async () => {
    const mockSummaries = [
      { level: 1, title: "Simple", content: "Easy explanation", status: "COMPLETED", readingTimeMinutes: 2 },
    ]
    mockedGet.mockResolvedValueOnce(mockSummaries)

    const { result } = renderHook(() => usePaperSummaries("paper-1"), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockedGet).toHaveBeenCalledWith("/papers/paper-1/summaries")
    expect(result.current.data).toEqual(mockSummaries)
  })

  it("does not fetch when paperId is empty string", () => {
    const { result } = renderHook(() => usePaperSummaries(""), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe("idle")
    expect(mockedGet).not.toHaveBeenCalled()
  })
})

describe("useFeed", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("calls api with correct params for default sort", async () => {
    const mockResponse = {
      content: [],
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
      hasNext: false,
    }
    mockedGet.mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useFeed(undefined, "newest"), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockedGet).toHaveBeenCalledWith("/feed", {
      page: "0",
      size: "20",
      sort: "newest",
    })
  })

  it("includes field IDs when provided", async () => {
    const mockResponse = {
      content: [],
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
      hasNext: false,
    }
    mockedGet.mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(
      () => useFeed(["computer-science", "physics"], "cited"),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockedGet).toHaveBeenCalledWith("/feed", {
      page: "0",
      size: "20",
      sort: "cited",
      fields: "computer-science,physics",
    })
  })
})
