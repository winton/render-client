import expect from "./expect"
import { RenderClient } from "../src"

describe("renderClient", () => {
  it("should instantiate", () => {
    new RenderClient()
  })

  it("should assert", () => {
    expect(true).toBe(true)
  })
})
