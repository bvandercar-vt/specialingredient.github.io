import { defineConfig } from 'vite'
export default defineConfig(() => ({
  base: `/specialingredient.github.io/`,
  build: {
    target: 'esnext',
    modulePreload: false,
  },
}))
