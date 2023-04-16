import { Component, createSignal, Index, createEffect, on } from 'solid-js'
import './Jigsaw.scss'
import Alert from './components/Alert'
import { state, setState } from './store'
import type { idx, pst, hook } from './type'
import { shuffle, isValid } from './util'


const LAST = 15
const getInitPstArray = () => (new Array(LAST + 1).fill(0)).map((i, j) => ('0' + j.toString(4)).slice(-2)) as pst[]
const orgArray: pst[] = getInitPstArray()


const Jigsaw: Component = () => {

  // init
  const { width } = state
  const [getSign, setSign] = createSignal(false)
  const [getMessage, setMessage] = createSignal('Are you OK?')
  const [getPstArray, setPstArray] = createSignal<pst[]>(getInitPstArray(), { equals: false })
  function shuffleJigsaw() {
    do {
      setPstArray(shuffle)
    } while (!isValid(getPstArray()))
  }
  const [getCloseHook, bindCloseHook] = createSignal<hook>(shuffleJigsaw)


  // Start
  const [getStep, setStep] = createSignal(-2)
  createEffect(on(getStep, step => {
    if (step === -1) {
      bindCloseHook(() => shuffleJigsaw)
      setSign(true)
      return
    }
    if (step > 0) {
      for (const [index, thisPst] of Object.entries(getPstArray())) {
        if (thisPst !== orgArray[index]) return
      }
      // when clear the game
      setMessage(`${step} steps to clear`)
      bindCloseHook(() => () => {
        setMessage('Are you OK?')
        setState({ imgPackageIndex: ((state.imgPackageIndex + 1) % 3) as idx })
        setStep(-2)
      })
      setSign(true)
    }
  }))

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
              "pointer-events": (getSign() ? "none" : "auto")
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
      <Alert openSign={[getSign, setSign]} message={getMessage()} closeHook={getCloseHook()} />
    </div>
  )
}

export default Jigsaw
