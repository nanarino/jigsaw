/* @refresh reload */
import { render } from 'solid-js/web'
import { setState } from './store'
import Jigsaw from './Jigsaw'

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?',
  )
}

const resize = () => setState({ width: Math.min(((window.innerWidth - 5) / 4) | 0, 195) })
resize()
window.onresize = resize
render(() => <Jigsaw />, root!)
