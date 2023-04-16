import { createStore } from "solid-js/store"
import type { idx } from './type'

export const [state, setState] = createStore<{
  width: number
  imgPackageIndex: idx
}>({
  width: 100,
  imgPackageIndex: ~~(Math.random() * 3) as idx
})