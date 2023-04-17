import { createStore } from "solid-js/store"
import type { idx, order } from './type'

export const [state, setState] = createStore<{
  ORDER: order
  width: number
  imgPackageIndex: idx
}>({
  /**
   * 4*4 square
   */
  ORDER: 4,
  /**
   * square width (px)
   */
  width: 100,
  imgPackageIndex: ~~(Math.random() * 3) as idx
})