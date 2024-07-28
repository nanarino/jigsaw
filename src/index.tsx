/* @refresh reload */
import "./index.styl"
import { render } from "solid-js/web"
import { setState } from "@/store"
import Jigsaw from "@/components/Jigsaw"
import ThemeToggle from "@/components/ThemeToggle"

const root = document.getElementById("root")

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?"
  )
}

const resize = () => setState({ width: Math.min(window.innerWidth, 776) / 4 })
resize()
window.onresize = resize
render(
  () => (
    <>
      <Jigsaw />
      <ThemeToggle />
    </>
  ),
  root!
)
