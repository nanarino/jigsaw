export type idx = 0 | 1 | 2

export type pst = `${0 | 1 | 2 | 3}${0 | 1 | 2 | 3}`

export type handle = (e: Event) => (void | Promise<void | false> | false)

export type order = 2 | 3 | 4