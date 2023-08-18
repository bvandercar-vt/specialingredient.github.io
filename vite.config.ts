import { defineConfig } from 'vite'
export default defineConfig(() => ({
    base: `/specialingredientbass.com/`,
    build: {
        target: 'esnext',
        modulePreload: false,
    },
}))
