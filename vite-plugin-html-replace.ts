import type { PluginOption } from 'vite'
import * as path from 'path'
import { JSDOM } from 'jsdom'
import { htmlToElement } from './src/html-utils'
import { Classes } from './src/constants'
import { oEmbed } from './src/api/soundcloud'
import * as prettier from 'prettier'
import { sleep } from './src/utils'
import { setSearchParams } from './src/api/api-utils'

function setPlaylistTitles() {
  const playlists = document.getElementsByClassName(Classes.PLAYLIST_BLOCK)
  for (let i = 0; i < playlists.length; i++) {
    const playlist = playlists[i]
    const playlistUrl = playlist.getAttribute('data-url')!
    const playlistTitle = playlist.getAttribute('data-title')!

    const labelId = `playlist-title-${i}`

    const titleWrapper = document.createElement('div')
    titleWrapper.classList.add(Classes.PLAYLIST_TITLE)
    titleWrapper.setAttribute('href', playlistUrl)

    const titleElement = document.createElement('h2')
    titleElement.appendChild(document.createTextNode(playlistTitle))
    titleElement.setAttribute('id', labelId)
    titleWrapper.appendChild(titleElement)

    const collapseArrow = document.createElement('span')
    collapseArrow.classList.add(`fa`, `fa-lg`, `fa-caret-down`, Classes.COLLAPSE_CARET)
    titleWrapper.appendChild(collapseArrow)

    playlist.setAttribute('aria-labelledby', labelId)
    playlist.setAttribute('role', 'region')
    playlist.removeAttribute('data-url')
    playlist.removeAttribute('data-title')

    playlist.insertBefore(titleWrapper, playlist.firstChild)
  }
}

async function setSoundcloudTracks() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const itemToTransform = document.getElementsByClassName(Classes.TRANSFORM_TO_SC_ITEM)[0]
    if (!itemToTransform) break

    await oEmbed({
      url: itemToTransform.getAttribute('data-sc-link')!,
      maxheight: 150,
      auto_play: false,
    }).then((oEmbed) => {
      const titleStr =
        itemToTransform.getAttribute('data-title') ??
        oEmbed.title
          .replaceAll(' by Special Ingredient', '')
          .replaceAll('[w TRACKLIST]', '')
          .replaceAll('[MASHUP]', '')

      const genreDescription = itemToTransform.getAttribute('data-genre-desc')
      const addlDescriptionSet = itemToTransform.getAttribute('data-addl-desc')
      const addlDescription =
        addlDescriptionSet === 'GET_FROM_SC' ? oEmbed.description : addlDescriptionSet

      const trackWrapper = document.createElement('div')
      trackWrapper.classList.add(Classes.TRACK_WRAPPER)

      if (titleStr) {
        const titleElement = document.createElement('p')
        titleElement.classList.add(Classes.TRACK_TITLE)
        titleElement.appendChild(document.createTextNode(titleStr))
        trackWrapper.appendChild(titleElement)
      }

      if (genreDescription) {
        const genreDescriptionElement = document.createElement('p')
        genreDescriptionElement.classList.add(Classes.TRACK_GENRE_DESC)
        genreDescriptionElement.appendChild(document.createTextNode(genreDescription))
        trackWrapper.appendChild(genreDescriptionElement)
      }

      if (addlDescription) {
        const addlDescriptionElement = document.createElement('p')
        addlDescriptionElement.classList.add(Classes.TRACK_ADDL_DESC)
        addlDescriptionElement.appendChild(document.createTextNode(addlDescription))
        trackWrapper.appendChild(addlDescriptionElement)
      }

      const iframeElement = htmlToElement(oEmbed.html) as HTMLIFrameElement
      iframeElement.title = titleStr
      const url = new URL(iframeElement.src)
      setSearchParams(url, {
        auto_play: false,
        hide_related: false,
        show_comments: true,
        show_user: false,
        show_reposts: true,
        show_teaser: false,
        visual: true, // true =  artwork behind waveform, false = artwork to left
        show_artwork: true,
      })
      iframeElement.src = url.href
      trackWrapper.appendChild(iframeElement)

      const privacyPolicyCoverElement = document.createElement('div')
      privacyPolicyCoverElement.classList.add(Classes.PRIVACY_POLICY_COVER)
      trackWrapper.appendChild(privacyPolicyCoverElement)

      itemToTransform.outerHTML = trackWrapper.outerHTML
      itemToTransform.replaceWith(trackWrapper)

      console.log(`replaced ${titleStr}`)
    })
  }
}

async function makeHtmlMods(src: string) {
  const dom = new JSDOM(src)
  const { document } = dom.window
  global.document = document

  // All anchors should open in NEW TAB
  Array.from(document.getElementsByTagName('a')).forEach((el) => {
    el.target = '_blank'
  })

  setPlaylistTitles()

  await setSoundcloudTracks()

  sleep(2000)

  return prettier.format(dom.serialize(), { parser: 'html' })
}

export function customPluginReplaceHtml() {
  return {
    name: 'transform-html',
    async transform(src, id) {
      if (path.basename(id) == 'index.html') {
        return {
          code: await makeHtmlMods(src),
          map: null, // provide source map if available
        }
      }
    },
  } satisfies PluginOption
}