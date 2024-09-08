import type { Component } from "solid-js"
import moon from "@/assets/moon.svg?raw"
import sun from "@/assets/sun.svg?raw"
import toggle from "@holy-two/data-theme/dist/toggle"
import "./index.styl"

export default (() => {
  return (
    <button
      id="themeToggle"
      class="na-button"
      innerHTML={moon + sun}
      title="theme toggle"
      data-round
      onclick={toggle}
    />
  )
}) as Component
