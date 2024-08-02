import { createSignal, Index, createEffect, on } from "solid-js"
import type { Component } from "solid-js"
import "./index.styl"
import Alert from "@/components/Alert"
import { state, setState } from "@/store"
import type { pst, handle } from "@/type"
import { sleep, shuffle, isValid } from "@/util"

const { ORDER, IMG_PACKAGE_LEN } = state
const LAST = ORDER ** 2 - 1
const getInitPstArray = () =>
  new Array(LAST + 1)
    .fill(0)
    .map((i, j) => j.toString(ORDER).padStart(2, "0")) as pst[]
const orgArray: pst[] = getInitPstArray()
const DEFAULT_MESSAGE = "Are you OK?"

export default (() => {
  // init
  const [getAlertIsOpen, setAlertIsOpen] = createSignal(false)
  const [getMessage, setMessage] = createSignal(DEFAULT_MESSAGE)
  /**
   * **This saves which hole the square is in, not the number of the square in each hole**
   *
   * `getPstArray().at(LAST)` =>  **The hole where the empty square is**
   * `getPstArray().indexOf('33')` =>  **which square in the last hole**
   *
   *  hole does not exist
   */
  const [getPstArray, setPstArray] = createSignal<pst[]>(getInitPstArray(), {
    equals: false,
  })
  async function shuffleJigsaw(e: Event) {
    const pstArray = getPstArray()
    let shuffledPstArray: pst[]
    do {
      shuffledPstArray = shuffle([...pstArray])
    } while (!isValid(shuffledPstArray, { width: ORDER, height: ORDER }))
    for (const i of Object.keys(pstArray)) {
      await sleep(40)
      pstArray[i] = "00"
      setPstArray(pstArray)
    }
    for (const [i, pst] of Object.entries(shuffledPstArray)) {
      await sleep(40)
      pstArray[i] = pst
      setPstArray(pstArray)
    }
  }
  const [getHandleClose, bindHandleClose] = createSignal<handle>(shuffleJigsaw)

  // Start
  const [getStep, setStep] = createSignal(-2)
  createEffect(
    on(getStep, step => {
      if (step === 0) {
        bindHandleClose(() => shuffleJigsaw)
        setAlertIsOpen(true)
        return
      } else if (step > 0) {
        for (const [index, thisPst] of Object.entries(getPstArray())) {
          if (thisPst !== orgArray[index]) return
        }
        // when clear the game
        setMessage(`${step} steps to clear`)
        bindHandleClose(() => (e: Event) => {
          setState({
            imgPackageIndex: (state.imgPackageIndex + 1) % IMG_PACKAGE_LEN,
          })
          setMessage(DEFAULT_MESSAGE)
          setStep(-2)
        })
        setAlertIsOpen(true)
      }
    })
  )

  return (
    <div
      id="jigsawview"
      style={{
        width: `${ORDER * state.width}px`,
        height: `${ORDER * state.width}px`,
      }}
      onselect={() => false}
    >
      <Index each={getPstArray()}>
        {(getPst, THIS) => (
          <div
            class="jigsaw"
            style={{
              width: `${state.width}px`,
              height: `${state.width}px`,
              top: `${state.width * +getPst()[0]}px`,
              left: `${state.width * +getPst()[1]}px`,
              "pointer-events": getAlertIsOpen() ? "none" : "auto",
            }}
            onClick={() => {
              if (LAST !== THIS) {
                if (
                  [10, 1].includes(
                    Math.abs(+getPstArray()[LAST] - +getPstArray()[THIS])
                  )
                ) {
                  setPstArray(
                    now => (
                      ([now[LAST], now[THIS]] = [now[THIS], now[LAST]]), now
                    )
                  )
                  setStep(step => ++step)
                }
              }
            }}
          >
            <img
              draggable={false}
              src={`${import.meta.env.BASE_URL}img${state.imgPackageIndex}/img${
                orgArray[THIS]
              }.jpg`}
            />
          </div>
        )}
      </Index>
      <Alert
        show={[getAlertIsOpen, setAlertIsOpen]}
        message={getMessage()}
        onClose={getHandleClose()}
      />
    </div>
  )
}) as Component
