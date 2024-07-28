import { defineConfig } from "vite"
import solid from "vite-plugin-solid"
import alias from "@holy-two/vite-plugin-alias"

export default defineConfig({
  plugins: [solid(), alias()],
  publicDir: "jigsaw",
})
