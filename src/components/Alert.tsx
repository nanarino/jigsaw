import './Alert.scss'
import { state } from '../store'
import { Show } from 'solid-js'
import type { Component, Signal } from 'solid-js'
import type { handle } from '../type'

type attr = {
  show: Signal<boolean>
  message: string
  /**
   * Default behavior is to hide the popup, unless `event.preventDefault()` or `return false`
   */
  onClose?: handle
}

export default ((props: attr) => {
  const { width } = state
  const [getOpen, setOpen] = props.show
  const close = async (e: Event) => {
    if ((props.onClose && await props.onClose(e)) === false) return
    if (e.defaultPrevented) return
    setOpen(false)
  }
  return (<Show when={getOpen()}>
    <div id="alert-box" style={{
      width: width * Math.sqrt(2) + 'px',
      height: width * Math.sqrt(2) + 'px',
      padding: width / 10 + 'px',
      gap: width / 10 + 'px',
    }}>
      <p style={{
        "font-size": `${width / 150}rem`
      }}>{props.message}</p>
      <button style={{
        padding: `${width / 20}px ${width / 10}px`,
        "border-radius": width / 50 + 'px',
      }} onclick={close}>yes</button>
    </div>
  </Show>)
}) as Component<attr>