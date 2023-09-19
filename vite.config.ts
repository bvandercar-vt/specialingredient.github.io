import { defineConfig } from 'vite'
import { customPluginReplaceHtml } from './vite-plugin-html-replace'
import react from '@vitejs/plugin-react'

export default defineConfig(() => ({
  base: `/`,
  plugins: [customPluginReplaceHtml(), react()],
  build: {
    target: 'esnext',
    modulePreload: false,
  },
}))
