import { createStore } from "solid-js/store"

export const [state, setState] = createStore({ 
    width: 100,
    imgGroupIndex: ~~(Math.random() * 3)
})