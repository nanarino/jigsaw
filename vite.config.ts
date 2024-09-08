import { defineConfig } from "vite"
import solid from "vite-plugin-solid"
import alias from "@holy-two/vite-plugin-alias"
import { insertHtml as insert, h } from "vite-plugin-insert-html"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

export default defineConfig({
  plugins: [
    solid(),
    alias(),
    insert({
      head: [
        h(
          "script",
          { fetchpriority: "high" },
          readFileSync(
            fileURLToPath(
              import.meta.resolve("@holy-two/data-theme/dist/iife/index.js")
            ),
            "utf8"
          )
        ),
      ],
    }),
  ],
  publicDir: "jigsaw",
})
