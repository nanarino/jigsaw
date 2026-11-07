export type Pst = `${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`

export type HandleClick = (
  e: MouseEvent
) => void | Promise<void | false> | false
