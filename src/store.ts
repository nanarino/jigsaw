import { createStore } from "solid-js/store"

export const [state, setState] = createStore({ 
    width: 100,
    imgPackageIndex: ~~(Math.random() * 3)
})