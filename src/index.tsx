/* @refresh reload */
import "./index.styl"
import { render } from "solid-js/web"
import { state, setState } from "@/store"
import Jigsaw from "@/components/Jigsaw"
import ThemeToggle from "@/components/ThemeToggle"

const root = document.getElementById("root")

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?"
  )
}

/**
 * Reduce difficulty to test
 */
// setState({ ORDER: 2 })
const resize = () =>
  setState({
    width: Math.min(window.innerWidth, window.innerHeight, 776) / state.ORDER,
  })
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
