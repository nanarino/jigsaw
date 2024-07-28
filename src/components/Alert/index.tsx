import "./index.styl"
import { state } from "@/store"
import { Show } from "solid-js"
import type { Component, Signal } from "solid-js"
import type { handle } from "@/type"

type attr = {
  show: Signal<boolean>
  message: string
  /**
   * Default behavior is to hide the popup, unless `event.preventDefault()` or `return false`
   */
  onClose?: handle
}

export default ((props: attr) => {
  const [getOpen, setOpen] = props.show
  const close = async (e: Event) => {
    if ((props.onClose && (await props.onClose(e))) === false) return
    if (e.defaultPrevented) return
    setOpen(false)
  }
  return (
    <Show when={getOpen()}>
      <div
        id="alert-box"
        class="na-dialog"
        style={{
          width: state.width * Math.sqrt(2) + "px",
          height: state.width * Math.sqrt(2) + "px",
          padding: state.width / 10 + "px",
          gap: state.width / 10 + "px",
        }}
      >
        <p
          style={{
            "font-size": `${state.width / 150}rem`,
          }}
        >
          {props.message}
        </p>
        <button
          class="na-button"
          style={{
            padding: `${state.width / 20}px ${state.width / 10}px`,
            "border-radius": state.width / 50 + "px",
          }}
          onclick={close}
        >
          yes
        </button>
      </div>
    </Show>
  )
}) as Component<attr>
