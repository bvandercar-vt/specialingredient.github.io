import react from '@vitejs/plugin-react'
import * as fs from 'fs'
import { defineConfig } from 'vite'
import { oEmbed } from './src/api/soundcloud'
import { IFRAME_HEIGHT } from './src/constants'

export default defineConfig(() => ({
  base: `/`,
  plugins: [
    {
      name: 'get-soundcloud-data',
      async buildStart() {
        const code = fs.readFileSync('./src/components/GridBody.tsx')
        const matches = code.toString().matchAll(/url="(.*)"/g)

        const soundcloudTracks = await Promise.all(
          Array.from(matches).map(async (match) => ({
            originalLink: match[1],
            ...(await oEmbed({
              url: match[1],
              maxheight: IFRAME_HEIGHT,
              auto_play: false,
            })),
          })),
        )

        fs.writeFileSync('soundcloud-data.json', JSON.stringify(soundcloudTracks, null, 2))
      },
    },
    react(),
  ],
  build: {
    target: 'esnext',
    modulePreload: false,
  },
}))
