import { createStore } from "solid-js/store"

export const [state, setState] = createStore<{
  ORDER: number
  width: number
  imgPackageIndex: number
  IMG_PACKAGE_LEN: number
}>({
  /**
   * 4*4 square
   */
  ORDER: 4,
  /**
   * square width (px)
   */
  width: 100,
  imgPackageIndex: ~~(Math.random() * 3),
  IMG_PACKAGE_LEN: 3
})
