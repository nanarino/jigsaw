import { createSignal, Index, createEffect, on } from 'solid-js'
import type { Component } from 'solid-js'
import './Jigsaw.scss'
import Alert from './components/Alert'
import { state, setState } from './store'
import type { idx, pst, hook } from './type'
import { shuffle, isValid } from './util'


/**
 * Reduce difficulty to test
 */
// setState({ ORDER: 2 })
const { ORDER } = state
const LAST = ORDER ** 2 - 1
const getInitPstArray = () => (new Array(LAST + 1).fill(0)).map((i, j) => j.toString(ORDER).padStart(2, '0')) as pst[]
const orgArray: pst[] = getInitPstArray()


export default (() => {
  // init
  const { width } = state
  const [getAlertIsOpen, setAlertIsOpen] = createSignal(false)
  const [getMessage, setMessage] = createSignal('Are you OK?')
  /**
   * **This saves which hole the square is in, not the number of the square in each hole**
   * 
   * `getPstArray().at(LAST)` =>  **The hole where the empty square is**
   * `getPstArray().indexOf('33')` =>  **which square in the last hole**
   * 
   *  hole does not exist
   */
  const [getPstArray, setPstArray] = createSignal<pst[]>(getInitPstArray(), { equals: false })
  function shuffleJigsaw() {
    do {
      setPstArray(shuffle)
    } while (!isValid(getPstArray(), { width: ORDER, height: ORDER }))
  }
  const [getCloseHook, bindCloseHook] = createSignal<hook>(shuffleJigsaw)


  // Start
  const [getStep, setStep] = createSignal(-2)
  createEffect(on(getStep, step => {
    if (step === 0) {
      bindCloseHook(() => shuffleJigsaw)
      setAlertIsOpen(true)
      return
    }
    if (step > 0) {
      for (const [index, thisPst] of Object.entries(getPstArray())) {
        if (thisPst !== orgArray[index]) return
      }
      // when clear the game
      setMessage(`${step} steps to clear`)
      bindCloseHook(() => (e: Event) => {
        //e.preventDefault()
        setState({ imgPackageIndex: ((state.imgPackageIndex + 1) % 3) as idx })
        setMessage('Are you OK?')
        setStep(-2)
      })
      setAlertIsOpen(true)
    }
  }))

  return (
    <div id="jigsawview" style={{
      width: (ORDER * width + 1) + 'px',
      height: (ORDER * width + 1) + 'px',
    }} onselect={() => false}>
      <Index each={getPstArray()}>
        {
          (getPst, THIS) => (
            <div class="jigsaw" style={{
              width: `${width}px`,
              height: `${width}px`,
              top: (width * (+getPst()[0])) + 'px',
              left: (width * (+getPst()[1])) + 'px',
              "pointer-events": (getAlertIsOpen() ? "none" : "auto")
            }} onClick={
              () => {
                if (LAST !== THIS) {
                  if ([10, 1].includes(Math.abs((+getPstArray()[LAST]) - (+getPstArray()[THIS])))) {
                    setPstArray(now => (
                      [now[LAST], now[THIS]] = [now[THIS], now[LAST]], now
                    ))
                    setStep(step => ++step)
                  }
                }
              }
            }>
              <img draggable={false} src={`${import.meta.env.BASE_URL.replace(/\/$/, '')}/img${state.imgPackageIndex}/img${orgArray[THIS]}.jpg`} />
            </div>
          )
        }
      </Index>
      <Alert show={[getAlertIsOpen, setAlertIsOpen]} message={getMessage()} onClose={getCloseHook()} />
    </div>
  )
}) as Component
