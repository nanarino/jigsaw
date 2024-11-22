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
 *     For this project, it's interval `['00', '01', ..., '33']`
 *
 * @param jigsaw Since more than decimal will be format by letters
 *     the width and height should be between 2 and 10 🤔，
 *     For this project, it's `{width: 4, height: 4}`
 *
 * @returns it was supposed to be inversion number,
 *     But moved times of the empty squares is also taken into `(inversion number % 2) === (moved time % 2)`
 */
export const isValid = (
  arr: string[],
  jigsaw: { width: number; height: number }
) => {
  const { width, height } = jigsaw
  const [x, y] = arr.at(-1)
  return (
    ((+x + width - 1) % 2 === (+y + height - 1) % 2) ===
    (resolveInversionNumber(arr) % 2 === 0)
  )
}
