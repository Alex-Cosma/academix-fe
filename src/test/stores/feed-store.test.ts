import { describe, it, expect, beforeEach } from "vitest"
import { useFeedStore } from "@/stores/feed-store"

describe("feedStore", () => {
  beforeEach(() => {
    useFeedStore.setState({ activeFields: [], sortOrder: "newest" })
  })

  it("starts with empty activeFields and newest sort", () => {
    const state = useFeedStore.getState()
    expect(state.activeFields).toEqual([])
    expect(state.sortOrder).toBe("newest")
  })

  it("toggleField adds a field", () => {
    useFeedStore.getState().toggleField("physics")
    expect(useFeedStore.getState().activeFields).toEqual(["physics"])
  })

  it("toggleField removes a field that is already present", () => {
    useFeedStore.getState().toggleField("physics")
    useFeedStore.getState().toggleField("physics")
    expect(useFeedStore.getState().activeFields).toEqual([])
  })

  it("toggleField adds multiple fields", () => {
    useFeedStore.getState().toggleField("physics")
    useFeedStore.getState().toggleField("chemistry")
    useFeedStore.getState().toggleField("biology")
    expect(useFeedStore.getState().activeFields).toEqual([
      "physics",
      "chemistry",
      "biology",
    ])
  })

  it("toggleField removes only the targeted field", () => {
    useFeedStore.getState().toggleField("physics")
    useFeedStore.getState().toggleField("chemistry")
    useFeedStore.getState().toggleField("physics")
    expect(useFeedStore.getState().activeFields).toEqual(["chemistry"])
  })

  it("setActiveFields replaces the list", () => {
    useFeedStore.getState().toggleField("physics")
    useFeedStore.getState().setActiveFields(["art", "history"])
    expect(useFeedStore.getState().activeFields).toEqual(["art", "history"])
  })

  it("setActiveFields can set an empty list", () => {
    useFeedStore.getState().setActiveFields(["art", "history"])
    useFeedStore.getState().setActiveFields([])
    expect(useFeedStore.getState().activeFields).toEqual([])
  })

  it("setSortOrder changes sort to cited", () => {
    useFeedStore.getState().setSortOrder("cited")
    expect(useFeedStore.getState().sortOrder).toBe("cited")
  })

  it("setSortOrder changes sort to trending", () => {
    useFeedStore.getState().setSortOrder("trending")
    expect(useFeedStore.getState().sortOrder).toBe("trending")
  })

  it("setSortOrder changes sort back to newest", () => {
    useFeedStore.getState().setSortOrder("cited")
    useFeedStore.getState().setSortOrder("newest")
    expect(useFeedStore.getState().sortOrder).toBe("newest")
  })
})
