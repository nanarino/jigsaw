import { createStore } from "solid-js/store"

const TEST_IMG = new URL(
  "20210909_test.jpg",
  new URL(import.meta.env.BASE_URL, location.origin),
).href

type UrlParam =
  | { kind: "absent" }
  | { kind: "empty" }
  | { kind: "value"; value: string }

const defaultOrder = 3
const minOrder = 2
const maxOrder = 9

/** An integer from 2 to 9. Anything else, when `order` is present, is illegal. */
function parseOrder(raw: string): number | null {
  if (!/^[1-9]$/.test(raw)) return null
  const n = Number(raw)
  if (n < minOrder || n > maxOrder) return null
  return n
}

function redirectOrder(q: string, matched: RegExpExecArray | null) {
  const tokenAt = matched
    ? q[matched.index] === "&"
      ? matched.index + 1
      : matched.index
    : q.length
  const beforeEnd =
    tokenAt > 0 && q[tokenAt - 1] === "&" ? tokenAt - 1 : tokenAt
  const params = new URLSearchParams(q.slice(0, beforeEnd))
  params.set("order", String(defaultOrder))
  const prefix = params.toString()
  const rest = matched ? q.slice(tokenAt) : ""
  const search = rest ? `${prefix}&${rest}` : prefix
  return `${location.pathname}?${search}${location.hash}`
}

/**
 * `order` is read only from the query in front of `url`.
 * Everything after `url=` is the image address, so it may contain `?` and `&`.
 * `?url` and `?url=` are present but empty.
 */
function readLocation(): {
  order: number
  url: UrlParam
  redirectTo: string | null
} {
  const q = location.search.startsWith("?")
    ? location.search.slice(1)
    : location.search
  const matched = /(?:^|&)url(?:=|&|$)/.exec(q)
  const before = matched
    ? q.slice(0, q[matched.index] === "&" ? matched.index : 0)
    : q
  const params = new URLSearchParams(before)
  const parsed = params.has("order")
    ? parseOrder(params.get("order") ?? "")
    : defaultOrder
  const redirectTo = parsed == null ? redirectOrder(q, matched) : null
  const order = parsed ?? defaultOrder
  if (!matched) return { order, url: { kind: "absent" }, redirectTo }
  const tokenAt = q[matched.index] === "&" ? matched.index + 1 : matched.index
  if (!q.startsWith("url=", tokenAt))
    return { order, url: { kind: "empty" }, redirectTo }
  const raw = q.slice(tokenAt + 4)
  let value = raw
  try {
    value = decodeURIComponent(raw)
  } catch {
    value = raw
  }
  value = value.trim()
  return {
    order,
    url: value ? { kind: "value", value } : { kind: "empty" },
    redirectTo,
  }
}

let blobUrl = ""

export function useImgUrl(url: string) {
  if (blobUrl && blobUrl !== url) URL.revokeObjectURL(blobUrl)
  blobUrl = url.startsWith("blob:") ? url : ""
  setState({ imgUrl: url })
}

let pendingInput: HTMLInputElement | null = null
let pickerTicket = 0

/**
 * Native photo library picker. `click()` runs before the promise settles.
 * Resolves `undefined` when a newer picker supersedes this one.
 */
export function pickPhotoFile(): Promise<string | null | undefined> {
  const mine = ++pickerTicket
  pendingInput?.remove()
  return new Promise(resolve => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.tabIndex = -1
    input.style.cssText =
      "position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0"
    pendingInput = input
    let settled = false
    const finish = (file: File | null) => {
      if (settled) return
      settled = true
      if (pendingInput === input) pendingInput = null
      input.remove()
      if (mine !== pickerTicket) {
        resolve(undefined)
        return
      }
      resolve(file ? URL.createObjectURL(file) : null)
    }
    input.addEventListener("change", () => finish(input.files?.[0] ?? null))
    input.addEventListener("cancel", () => finish(null))
    document.body.append(input)
    input.click()
  })
}

/** `window.prompt`. Cancel or an empty answer returns `""`. */
function askImgUrl(defaultUrl: string) {
  return window.prompt("Image URL", defaultUrl)?.trim() || ""
}

/** `?url` was empty or the image failed. Cancel falls back to the test photo. */
export function replaceInvalidImg(failedSrc: string) {
  if (failedSrc === TEST_IMG) return
  if (failedSrc.startsWith("blob:")) {
    useImgUrl(TEST_IMG)
    return
  }
  const next = askImgUrl(failedSrc)
  useImgUrl(!next || next === failedSrc ? TEST_IMG : next)
}

function initialImgUrl(param: UrlParam) {
  if (param.kind === "value") return param.value
  if (param.kind === "empty") return askImgUrl(TEST_IMG) || TEST_IMG
  return ""
}

const located = readLocation()
if (located.redirectTo) location.replace(located.redirectTo)
const { order, url: urlParam } = located

export const [state, setState] = createStore<{
  order: number
  width: number
  imgUrl: string
}>({
  /**
   * n×n square. `?order=` before `url` is an integer from 2 to 9, otherwise 3.
   */
  order,
  /**
   * square width (px)
   */
  width: 100,
  imgUrl: located.redirectTo ? "" : initialImgUrl(urlParam),
})

/** No `url` param: open the photo library. A blocked dialog waits for the next gesture. */
function startPhotoPicker() {
  let settled = false
  const stop = () => {
    window.removeEventListener("pointerdown", openFromGesture, true)
    window.removeEventListener("keydown", openFromGesture, true)
  }
  const apply = (url: string | null | undefined) => {
    if (settled || url === undefined) return
    settled = true
    stop()
    useImgUrl(url || TEST_IMG)
  }
  const openFromGesture = (e: Event) => {
    if (settled) return
    e.preventDefault()
    e.stopPropagation()
    void pickPhotoFile().then(apply)
  }
  window.addEventListener("pointerdown", openFromGesture, true)
  window.addEventListener("keydown", openFromGesture, true)
  void pickPhotoFile().then(apply)
}

if (!located.redirectTo && urlParam.kind === "absent") startPhotoPicker()
