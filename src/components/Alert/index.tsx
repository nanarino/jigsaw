import classes from "./index.module.styl"
import { state } from "@/store"
import { createSignal, createEffect, on } from "solid-js"
import type { Component, Signal } from "solid-js"
import type { HandleClick } from "@/type"

type attr = {
  open: Signal<boolean>
  message: string
  /**
   * Default behavior is to hide the popup, unless `event.preventDefault()` or `return false`
   */
  onClose?: HandleClick
}

export default ((props: attr) => {
  let dialogRef: HTMLDialogElement
  const [getOpen, setOpen] = props.open
  createEffect(
    on(getOpen, open => {
      if (open) {
        dialogRef.show()
      } else {
        dialogRef.close()
      }
    })
  )
  const [getButtonDisabled, setButtonDisabled] = createSignal(false)
  const close = async (e: MouseEvent) => {
    setButtonDisabled(true)
    if ((props.onClose && (await props.onClose(e))) === false) return false
    if (e.defaultPrevented) return
    setOpen(false)
    setButtonDisabled(false)
  }
  return (
    <dialog
      class={`na-dialog glass ${classes.dialog}`}
      closedby="none"
      ref={dialogRef}
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
        disabled={getButtonDisabled()}
      >
        yes
      </button>
    </dialog>
  )
}) as Component<attr>
