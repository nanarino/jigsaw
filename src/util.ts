import type { pst } from './type'

export function shuffle<T>(arr: T[]): T[] { //打乱数组
  const len = arr.length
  for (let i = 0; i < len - 1; i++) {
    let idx = Math.floor(Math.random() * (len - i))
    let temp = arr[idx]
    arr[idx] = arr[len - i - 1]
    arr[len - i - 1] = temp
  }
  return arr
}

export const isValid = (arr: pst[]) => { //判断数列的逆序是否为偶数  偶数=>有解
  let count = 0, len = arr.length
  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[i]) {
        count++
      }
    }
  }
  return count % 2 === 0
}
