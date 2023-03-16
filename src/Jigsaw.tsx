import { Component, createSignal } from 'solid-js';
import './Jigsaw.scss';
import Alert from './Alert';
import { setState } from './store';

const Jigsaw: Component = () => {
  const openSign = createSignal(false);
  const [getMessage, setMessage] = createSignal('Are you OK?');
  const width: number = Math.min((window.innerWidth / 4 - 2.5) | 0, 194);
  setState({ width });

  return (
    <div id="jigsawview" style={{
      width: (4 * width + 2) + 'px',
      height: (4 * width + 2) + 'px',
    }}>

      <Alert openSign={openSign} message={getMessage()} />
    </div>
  );
};

export default Jigsaw;
