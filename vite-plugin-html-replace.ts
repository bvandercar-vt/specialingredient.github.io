import { JSDOM } from 'jsdom'
import zip from 'lodash/zip'
import * as prettier from 'prettier'
import type { PluginOption } from 'vite'
import { setSearchParams } from './src/api/api-utils'
import { oEmbed } from './src/api/soundcloud'
import { Classes } from './src/constants'
import { createElement, htmlToElement } from './src/html-utils'

function setGridCardTitles() {
  const gridCards = document.getElementsByClassName(Classes.GRID_CARD)
  for (let i = 0; i < gridCards.length; i++) {
    const gridCard = gridCards[i]
    const cardUrl = gridCard.getAttribute('data-url')!
    const cardTitle = gridCard.getAttribute('data-title')!

    const labelId = `card-title-${i}`

    const titleWrapper = createElement('div', {
      classes: Classes.CARD_TITLE,
      attributes: { href: cardUrl },
      children: [
        // title
        createElement('h2', { attributes: { id: labelId }, children: cardTitle }),
        // collapseArrow
        createElement('span', {
          classes: [`fa`, `fa-lg`, `fa-caret-down`, Classes.COLLAPSE_CARET],
        }),
      ],
    })

    gridCard.setAttribute('aria-labelledby', labelId)
    gridCard.setAttribute('role', 'region')
    gridCard.removeAttribute('data-url')
    gridCard.removeAttribute('data-title')

    gridCard.insertBefore(titleWrapper, gridCard.firstChild)
  }
}

async function setSoundcloudTracks() {
  const itemsToTransform = Array.from(document.getElementsByClassName(Classes.TRANSFORM_TO_SC_ITEM))

  await Promise.all(
    itemsToTransform.map((item) =>
      oEmbed({
        url: item.getAttribute('data-sc-link')!,
        maxheight: 145,
        auto_play: false,
      }),
    ),
  ).then((oEmbeds) => {
    zip(itemsToTransform, oEmbeds).forEach(([itemToTransform, oEmbed]) => {
      if (!itemToTransform || !oEmbed) throw new Error('different array lengths')

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

      const trackWrapper = createElement('div', {
        classes: Classes.TRACK_WRAPPER,
        children: [
          titleStr
            ? createElement('p', { classes: Classes.TRACK_TITLE, children: titleStr })
            : undefined,
          genreDescription
            ? createElement('p', { classes: Classes.TRACK_GENRE_DESC, children: genreDescription })
            : undefined,
          addlDescription
            ? createElement('p', { classes: Classes.TRACK_ADDL_DESC, children: addlDescription })
            : undefined,
        ],
      })

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
      const scIframeWrapper = createElement('div', {
        classes: Classes.SC_IFRAME_WRAPPER,
        children: iframeElement,
        // privacy policy cover
        // createElement('div', { classes: Classes.PRIVACY_POLICY_COVER }),
      })
      trackWrapper.appendChild(scIframeWrapper)

      itemToTransform.outerHTML = trackWrapper.outerHTML
      itemToTransform.replaceWith(trackWrapper)

      console.log(`replaced ${titleStr}`)
    })
  })
}

async function makeHtmlMods(src: string) {
  const dom = new JSDOM(src)
  const { document } = dom.window
  global.document = document

  // All anchors should open in NEW TAB
  Array.from(document.getElementsByTagName('a')).forEach((el) => {
    el.target = '_blank'
  })

  setGridCardTitles()

  await setSoundcloudTracks()

  // const spotifyPlaylistFolderTree = document.getElementsByClassName('playlist-folder-tree')[0]
  // if (spotifyPlaylistFolderTree)
  //   spotifyPlaylistFolderTree.replaceWith(createFolderTree(getSpotifyPlaylistFolderTreeNodes()))

  const result = await prettier.format(dom.serialize(), { parser: 'html' })
  return result
}

export function customPluginReplaceHtml() {
  return {
    name: 'transform-html',
    async transformIndexHtml(html) {
      return await makeHtmlMods(html)
    },
  } satisfies PluginOption
}
