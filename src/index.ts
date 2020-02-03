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

      await this.evalLoad({
        [name]: window["paths"][name],
      })

      const res: RenderResponse = {}
      const req: RenderRequest = {
        path: window.location.pathname,
        method: "GET",
        params: new URLSearchParams(location.search),
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

  route(path?: string): any {
    return this.app.router.route(
      path || document.location.pathname
    )
  }
}

export default new RenderClient()
