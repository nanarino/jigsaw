import './Alert.scss'
import { state } from '../store'
import { Show } from 'solid-js'
import type { Signal } from 'solid-js'
import type { hook } from '../type'

export default function Alert(props: {
  openSign: Signal<boolean>
  message: string
  closeHook?: hook
}) {
  const { width } = state
  const [getOpenSign, setOpenSign] = props.openSign
  return (<Show when={getOpenSign()}>
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
      }} onclick={async () => { // The default behavior is `setOpenSign(false)`
        if ((props.closeHook && await props.closeHook()) === false) return
        setOpenSign(false)
      }}>yes</button>
    </div>
  </Show>)
}
