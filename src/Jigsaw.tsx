import { Component, createSignal, Index, createEffect, untrack, on } from 'solid-js'
import './Jigsaw.scss'
import Alert from './Alert'
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
  const width: number = Math.min((window.innerWidth / 4 - 2.5) | 0, 194)
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
              left: (width * (+getPst()[1])) + 'px',
              "pointer-events": (openSign[0]() ? "none" : "auto")
            }} onClick={
              () => {
                const lastPstNum = +getPstArray()[LAST]
                const thisPstNum = +getPstArray()[THIS]
                if (LAST !== THIS && [10, -10, 1, -1].includes(lastPstNum - thisPstNum)) {
                  setPstArray(now => (
                    [now[LAST], now[THIS]] = [now[THIS], now[LAST]], now
                  ))
                  setStep(step => ++step)
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
  )
}

export default Jigsaw
