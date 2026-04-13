import { create } from "zustand"

interface FeedStore {
  activeFields: string[]
  sortOrder: "newest" | "cited" | "trending"
  setActiveFields: (fields: string[]) => void
  toggleField: (field: string) => void
  setSortOrder: (order: FeedStore["sortOrder"]) => void
}

export const useFeedStore = create<FeedStore>((set) => ({
  activeFields: [],
  sortOrder: "newest",
  setActiveFields: (fields) => set({ activeFields: fields }),
  toggleField: (field) =>
    set((s) => ({
      activeFields: s.activeFields.includes(field)
        ? s.activeFields.filter((f) => f !== field)
        : [...s.activeFields, field],
    })),
  setSortOrder: (order) => set({ sortOrder: order }),
}))
