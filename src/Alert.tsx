import './Alert.scss';
import { state } from './store';
import { Show } from 'solid-js';
import type { Signal } from 'solid-js';

export default function Alert(props: {
  openSign: Signal<boolean>
  message: string
}) {
  const { width } = state;
  const [getOpenSign, setOpenSign] = props.openSign;
  return (<Show when={getOpenSign()}>
    <div id="alert-box" style={{
      left: (2 * width - 75) + 'px',
      top: (2 * width - 75) + 'px',
    }}>
      <p>{props.message}</p>
      <button onclick={() => setOpenSign(false)}>yes</button>
    </div>
  </Show>);
}
