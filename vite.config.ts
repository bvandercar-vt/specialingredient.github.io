import react from '@vitejs/plugin-react'
import * as fs from 'fs'
import { defineConfig } from 'vite'
import { getOEmbed } from './src/api/soundcloud'

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
            ...(await getOEmbed({
              url: match[1],
              maxheight: 166,
              auto_play: false,
            })),
          })),
        )

        fs.writeFileSync('soundcloud-data.json', JSON.stringify(soundcloudTracks, null, 2) + '\n')
      },
    },
    react(),
  ],
  build: {
    target: 'esnext',
    modulePreload: false,
  },
}))
