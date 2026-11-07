import { createSignal, Index, createEffect, on, onCleanup } from "solid-js"
import type { Component } from "solid-js"
import classes from "./index.module.styl"
import Alert from "@/components/Alert"
import { pickPhotoFile, replaceInvalidImg, state, useImgUrl } from "@/store"
import type { Pst, HandleClick } from "@/type"
import { sleep, shuffle, isValid, squareSliceBackground } from "@/util"

const { order } = state
const LAST = order ** 2 - 1
const getInitPstArray = () =>
  new Array(LAST + 1)
    .fill(0)
    .map((i, j) => j.toString(order).padStart(2, "0")) as Pst[]
const orgArray: Pst[] = getInitPstArray()
const DEFAULT_MESSAGE = "Are you OK?"

export default (() => {
  // init
  const [getAlertIsOpen, setAlertIsOpen] = createSignal(false)
  const [getMessage, setMessage] = createSignal(DEFAULT_MESSAGE)
  /**
   * **This saves which hole the square is in, not the number of the square in each hole**
   *
   * `getPstArray().at(LAST)` =>  **The hole where the empty square is**
   * `getPstArray().indexOf('22')` =>  **which square is in the last hole**
   *
   *  hole does not exist
   */
  const [getPstArray, setPstArray] = createSignal<Pst[]>(getInitPstArray(), {
    equals: false,
  })
  async function shuffleJigsaw(e: Event) {
    const pstArray = getPstArray()
    let shuffledPstArray: Pst[]
    do {
      shuffledPstArray = shuffle([...pstArray])
    } while (!isValid(shuffledPstArray, { width: order, height: order }))
    for (const i of Object.keys(pstArray)) {
      await sleep(40)
      Reflect.set(pstArray, i, "00")
      setPstArray(pstArray)
    }
    for (const [i, pst] of Object.entries(shuffledPstArray)) {
      await sleep(40)
      Reflect.set(pstArray, i, pst)
      setPstArray(pstArray)
    }
  }
  const [getHandleClose, bindHandleClose] =
    createSignal<HandleClick>(shuffleJigsaw)

  const [getImg, setImg] = createSignal<{
    src: string
    width: number
    height: number
  } | null>(null)
  createEffect(() => {
    const src = state.imgUrl
    if (!src) return
    let stale = false
    const img = new Image()
    img.onload = () => {
      if (stale || !img.naturalWidth || !img.naturalHeight) return
      setImg({ src, width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      if (!stale) replaceInvalidImg(src)
    }
    img.src = src
    onCleanup(() => {
      stale = true
    })
  })

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
          if (thisPst !== Reflect.get(orgArray, index)) return
        }
        // when clear the game
        setMessage(`${step} steps to clear`)
        bindHandleClose(() => () => {
          const pending = pickPhotoFile()
          return pending.then(url => {
            if (url) useImgUrl(url)
            setMessage(DEFAULT_MESSAGE)
            setStep(-2)
          })
        })
        setAlertIsOpen(true)
      }
    }),
  )

  return (
    <div
      class={classes.view}
      style={{
        width: `${order * state.width}px`,
        height: `${order * state.width}px`,
      }}
      onselect={() => false}
    >
      <Index each={getPstArray()}>
        {(getPst, THIS) => (
          <div
            class={`na-image ${classes.item}`}
            style={{
              width: `${state.width}px`,
              height: `${state.width}px`,
              top: `${state.width * +getPst()[0]}px`,
              left: `${state.width * +getPst()[1]}px`,
              "pointer-events": getAlertIsOpen() ? "none" : "auto",
              ...(() => {
                const img = getImg()
                if (!img) return {}
                const cell = orgArray[THIS]
                return squareSliceBackground(
                  img,
                  { row: +cell[0], col: +cell[1] },
                  { order, tile: state.width },
                )
              })(),
            }}
            onClick={() => {
              if (LAST !== THIS) {
                if (
                  [10, 1].includes(
                    Math.abs(+getPstArray()[LAST] - +getPstArray()[THIS]),
                  )
                ) {
                  setPstArray(
                    now => (
                      ([now[LAST], now[THIS]] = [now[THIS], now[LAST]]),
                      now
                    ),
                  )
                  setStep(step => ++step)
                }
              }
            }}
          ></div>
        )}
      </Index>
      <Alert
        open={[getAlertIsOpen, setAlertIsOpen]}
        message={getMessage()}
        onClose={getHandleClose()}
      />
    </div>
  )
}) as Component
