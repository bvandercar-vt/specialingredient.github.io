import * as fs from 'fs'
import { JSDOM } from 'jsdom'
import { defineConfig } from 'vite'
import { oEmbed } from './src/api/soundcloud'
import { Classes, IFRAME_HEIGHT } from './src/constants'

export default defineConfig(() => ({
  base: `/`,
  plugins: [
    {
      name: 'get-soundcloud-data',
      async transformIndexHtml(html) {
        const dom = new JSDOM(html)

        const trackElements = Array.from(
          dom.window.document.getElementsByClassName<HTMLDivElement>(Classes.TRANSFORM_TO_SC_ITEM),
        )

        const soundcloudTracks = await Promise.all(
          trackElements.map(async (el) => {
            const originalLink = el.getAttribute('data-sc-link')
            if (!originalLink) throw new Error('needs data-sc-link')
            return {
              originalLink,
              ...(await oEmbed({
                url: originalLink,
                maxheight: IFRAME_HEIGHT,
                auto_play: false,
              })),
            }
          }),
        )

        fs.writeFileSync('soundcloud-data.json', JSON.stringify(soundcloudTracks, null, 2))

        return html
      },
    },
  ],
  build: {
    target: 'esnext',
    modulePreload: false,
  },
}))
