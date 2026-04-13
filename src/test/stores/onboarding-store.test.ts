import { describe, it, expect, beforeEach } from "vitest"
import { useOnboardingStore } from "@/stores/onboarding-store"

describe("onboardingStore", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset()
  })

  it("starts with empty selection", () => {
    expect(useOnboardingStore.getState().selectedFields).toEqual([])
  })

  it("toggles a field on", () => {
    useOnboardingStore.getState().toggleField("physics")
    expect(useOnboardingStore.getState().selectedFields).toEqual(["physics"])
  })

  it("toggles a field off", () => {
    useOnboardingStore.getState().toggleField("physics")
    useOnboardingStore.getState().toggleField("physics")
    expect(useOnboardingStore.getState().selectedFields).toEqual([])
  })

  it("limits selection to 7 fields", () => {
    const fields = ["a", "b", "c", "d", "e", "f", "g"]
    fields.forEach((f) => useOnboardingStore.getState().toggleField(f))
    useOnboardingStore.getState().toggleField("h")
    expect(useOnboardingStore.getState().selectedFields).toHaveLength(7)
    expect(useOnboardingStore.getState().selectedFields).not.toContain("h")
  })

  it("resets selection", () => {
    useOnboardingStore.getState().toggleField("physics")
    useOnboardingStore.getState().reset()
    expect(useOnboardingStore.getState().selectedFields).toEqual([])
  })
})
