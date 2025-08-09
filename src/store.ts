import { createStore } from "solid-js/store"

const initImgPackageIndex = () => {
  const i = Number.parseInt(new URLSearchParams(location.search).get("img"))
  if (Number.isNaN(i) || i > 2 || i < 0) return ~~(Math.random() * 3)
  else return i
}

export const [state, setState] = createStore<{
  ORDER: 2 | 3 | 4
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
  imgPackageIndex: initImgPackageIndex(),
  IMG_PACKAGE_LEN: 3,
})
