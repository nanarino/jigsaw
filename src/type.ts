export type pst = `${0 | 1 | 2 | 3}${0 | 1 | 2 | 3}`

export type handle = (e: Event) => void | Promise<void | false> | false
