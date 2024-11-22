export type Pst = `${0 | 1 | 2 | 3}${0 | 1 | 2 | 3}`

export type HandleClick = (
  e: MouseEvent
) => void | Promise<void | false> | false
