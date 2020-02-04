import loaded from "@fn2/loaded"
import {
  RenderRequest,
  RenderResponse,
} from "@fn2/render-server"

import app from "./app"

export class RenderClient {
  app: typeof app = null
  evalLoad: typeof loaded.evalLoad = null
  libs: typeof loaded.libs = null

  loaded(): void {
    this.app.router.patchHistory(window.history.pushState)

    window.onpopstate = async (): Promise<void> => {
      const name = this.route()

      const searchParams = new URLSearchParams(
        location.search
      )
      const params = this.paramsToObject(
        searchParams.entries()
      )

      await this.evalLoad({
        [name]: window["paths"][name],
      })

      const res: RenderResponse = {}
      const req: RenderRequest = {
        path: window.location.pathname,
        method: "GET",
        files: {},
        params,
        user: window["user"],
      }

      const component = this.libs[name]
      const el = await component.element(req, res)

      document.body.innerHTML = ""

      if (res.body) {
        document.body.innerHTML = res.body
      } else {
        document.body.append(el)
      }
    }
  }

  paramsToObject(
    entries: IterableIterator<[string, string]>
  ): Record<string, string> {
    const result = {}
    for (const entry of entries) {
      const [key, value] = entry
      result[key] = value
    }
    return result
  }

  route(path?: string): any {
    return this.app.router.route(
      path || document.location.pathname
    )
  }
}

export default new RenderClient()
