import { defineConfig } from 'vite'
import { customPluginReplaceHtml } from './vite-plugin-html-replace'

export default defineConfig(() => ({
  base: `/`,
  plugins: [customPluginReplaceHtml()],
  build: {
    target: 'esnext',
    modulePreload: false,
  },
}))
