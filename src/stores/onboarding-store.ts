import { create } from "zustand"

interface OnboardingStore {
  selectedFields: string[]
  toggleField: (field: string) => void
  reset: () => void
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  selectedFields: [],
  toggleField: (field) =>
    set((s) => ({
      selectedFields: s.selectedFields.includes(field)
        ? s.selectedFields.filter((f) => f !== field)
        : s.selectedFields.length < 7
          ? [...s.selectedFields, field]
          : s.selectedFields,
    })),
  reset: () => set({ selectedFields: [] }),
}))
