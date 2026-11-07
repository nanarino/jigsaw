/**
 * Center-crop `img` to a square, then show cell `(row, col)` of an
 * `order`×`order` grid by scaling that square onto the board and
 * shifting it with `background-position`.
 */
export function squareSliceBackground(
  img: { src: string; width: number; height: number },
  cell: { row: number; col: number },
  grid: { order: number; tile: number },
) {
  const side = Math.min(img.width, img.height)
  const cropX = (img.width - side) / 2
  const cropY = (img.height - side) / 2
  const scale = (grid.tile * grid.order) / side
  const srcX = cropX + (cell.col * side) / grid.order
  const srcY = cropY + (cell.row * side) / grid.order
  return {
    "background-image": `url(${JSON.stringify(img.src)})`,
    "background-repeat": "no-repeat",
    "background-size": `${img.width * scale}px ${img.height * scale}px`,
    "background-position": `${-srcX * scale}px ${-srcY * scale}px`,
  }
}

export function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time))
}

export function shuffle<T>(arr: T[]): T[] {
  const len = arr.length
  for (let i = 0; i < len - 1; i++) {
    let idx = Math.floor(Math.random() * (len - i))
    let temp = arr[idx]
    arr[idx] = arr[len - i - 1]
    arr[len - i - 1] = temp
  }
  return arr
}

function resolveInversionNumber<T>(arr: T[]): number {
  let count = 0
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[i]) count++
    }
  }
  return count
}

/**
 *
 * @param arr the arr.length = width * height,
 *     For this project, it's interval `['00', '01', ..., '88']`
 *
 * @param jigsaw Each coordinate is one digit, so the width and height
 *     stay between 2 and 9.
 *     For this project, it's `{width: 3, height: 3}` by default.
 *
 * @returns it was supposed to be inversion number,
 *     But moved times of the empty squares is also taken into `(inversion number % 2) === (moved time % 2)`
 */
export const isValid = (
  arr: string[],
  jigsaw: { width: number; height: number },
) => {
  const { width, height } = jigsaw
  const [x, y] = arr.at(-1)!
  return (
    ((+x + width - 1) % 2 === (+y + height - 1) % 2) ===
    (resolveInversionNumber(arr) % 2 === 0)
  )
}
