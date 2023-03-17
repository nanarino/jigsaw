import { Component, createSignal, Index } from 'solid-js';
import './Jigsaw.scss';
import Alert from './Alert';
import { state, setState } from './store';


type pst = `${0 | 1 | 2 | 3}${0 | 1 | 2 | 3}`
const LAST = 15
const getInitPstArray = () => (new Array(LAST + 1).fill(0)).map((i, j) => ('0' + j.toString(4)).slice(-2)) as pst[]
const orgArray: pst[] = getInitPstArray();


const Jigsaw: Component = () => {

  // init
  const openSign = createSignal(false);
  const [getMessage, setMessage] = createSignal('Are you OK?');
  const width: number = Math.min((window.innerWidth / 4 - 2.5) | 0, 194);
  setState({ width });
  const [getPstArray, setPstArray] = createSignal<pst[]>(getInitPstArray(), { equals: false });

  return (
    <div id="jigsawview" style={{
      width: (4 * width + 2) + 'px',
      height: (4 * width + 2) + 'px',
    }}>
      <Index each={getPstArray()}>
        {
          (getPst, THIS) => (
            <div class="jigsaw" style={{
              width: (width - 2) + 'px',
              height: (width - 2) + 'px',
              top: (width * (+getPst()[0])) + 'px',
              left: (width * (+getPst()[1])) + 'px'
            }} onClick={
              () => {
                const lastPstNum = +getPstArray()[LAST];
                const thisPstNum = +getPstArray()[THIS]; 
                if (LAST !== THIS && [10, -10, 1, -1].includes(lastPstNum - thisPstNum)) {
                  setPstArray(now => (
                    [now[LAST], now[THIS]] = [now[THIS], now[LAST]], now
                  ))
                } else {
                  
                }
              }
            }>
              <img src={`./../jigsaw/img${state.imgGroupIndex}/img${orgArray[THIS]}.jpg`} />
            </div>
          )
        }
      </Index>
      <Alert openSign={openSign} message={getMessage()} />
    </div>
  );
};

export default Jigsaw;
