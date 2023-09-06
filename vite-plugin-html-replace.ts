import type { PluginOption } from 'vite'
import * as path from 'path'
import { JSDOM } from 'jsdom'

function makeHtmlMods(src: string) {
  const dom = new JSDOM(src)
  const { document } = dom.window
  global.document = document

  // All anchors should open in NEW TAB
  Array.from(document.getElementsByTagName('a')).forEach((el) => {
    el.target = '_blank'
  })

  return dom.serialize()
}

export function customPluginReplaceHtml() {
  return {
    name: 'transform-html',
    transform(src, id) {
      if (path.basename(id) == 'index.html') {
        return {
          code: makeHtmlMods(src),
          map: null, // provide source map if available
        }
      }
    },
  } satisfies PluginOption
}
