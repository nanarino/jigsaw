import { Component, createSignal, Index, createEffect, untrack, on } from 'solid-js'
import './Jigsaw.scss'
import Alert from './components/Alert'
import { state, setState } from './store'
import type { pst } from './tools'
import { shuffle, isValid } from './tools'


const LAST = 15
const getInitPstArray = () => (new Array(LAST + 1).fill(0)).map((i, j) => ('0' + j.toString(4)).slice(-2)) as pst[]
const orgArray: pst[] = getInitPstArray()


const Jigsaw: Component = () => {

  // init
  const openSign = createSignal(false)
  const [getMessage, setMessage] = createSignal('Are you OK?')
  const width: number = Math.min(((window.innerWidth - 5) / 4) | 0, 195)
  setState({ width })
  const [getPstArray, setPstArray] = createSignal<pst[]>(getInitPstArray(), { equals: false })


  // Start
  const [getStep, setStep] = createSignal(-2)
  createEffect(() => {
    if (getStep() === -1) { // when step: -1 -> 0
      openSign[1](true)
    }
  })
  createEffect(on(openSign[0], () => {
    if (openSign[0]() === false) { // when step: true -> false
      do {
        setPstArray(shuffle)
      } while (!isValid(getPstArray()))
      setStep(0)
    }
  }, { defer: true }))


  // Win
  createEffect(() => {
    if (getStep() > 0) {
      for (const [index, thisPst] of Object.entries(untrack(getPstArray))) {
        if (thisPst !== orgArray[index]) return
      }
      setMessage('All Clear')
      openSign[1](true)
    }
  })


  return (
    <div id="jigsawview" style={{
      width: (4 * width + 1) + 'px',
      height: (4 * width + 1) + 'px',
    }} onselect={() => false}>
      <Index each={getPstArray()}>
        {
          (getPst, THIS) => (
            <div class="jigsaw" style={{
              width: `${width}px`,
              height: `${width}px`,
              top: (width * (+getPst()[0])) + 'px',
              left: (width * (+getPst()[1])) + 'px',
              "pointer-events": (openSign[0]() ? "none" : "auto")
            }} onClick={
              () => {
                if (LAST !== THIS) {
                  const step = Math.abs((+getPstArray()[LAST]) - (+getPstArray()[THIS]))
                  if ([10, 1].includes(step)) {
                    setPstArray(now => (
                      [now[LAST], now[THIS]] = [now[THIS], now[LAST]], now
                    ))
                    setStep(step => ++step)
                  }
                }
              }
            }>
              <img draggable={false} src={`./../jigsaw/img${state.imgPackageIndex}/img${orgArray[THIS]}.jpg`} />
            </div>
          )
        }
      </Index>
      <Alert openSign={openSign} message={getMessage()} />
    </div>
  )
}

export default Jigsaw
