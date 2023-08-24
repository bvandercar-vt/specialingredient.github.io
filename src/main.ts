import './styles/index.css'
import {
  htmlToElement,
  isScrolledToTop,
  isScrolledToBottom,
  isScrollableY,
  isMobile,
  waitForElements,
  triggerClick,
} from './utils'

const Classes = {
  OPEN: 'open',
  HIDDEN: 'hidden',
  COLLAPSE_CARET: 'collapse-caret',
  PLAYLIST_TITLE: 'playlist-title',
  FIXED_TOP: 'fixed-top',
  PLAYLIST_ITEMS: 'playlist-items',
  TRANSFORM_TO_SC_ITEM: 'transform-to-sc-item',
  TRACK_WRAPPER: 'track-wrapper',
  TRACK_TITLE: 'track-title',
  TRACK_GENRE_DESC: 'track-genre-description',
  TRACK_ADDL_DESC: 'track-addl-description',
  PRIVACY_POLICY_COVER: 'privacy-policy-cover',
  SCROLL_ARROW: 'scroll-arrow',
  SCROLL_ARROW_UP: 'scroll-arrow-up',
  SCROLL_ARROW_DOWN: 'scroll-arrow-down',
} as const

function setCollapsed(accordionTitle: HTMLDivElement, collapsed: boolean) {
  const parentElement = accordionTitle.parentElement!
  const collapseContent = parentElement.getElementsByClassName(Classes.PLAYLIST_ITEMS)[0]
  const collapseArrow = parentElement.getElementsByClassName(Classes.COLLAPSE_CARET)[0]
  collapseContent.classList.toggle(Classes.HIDDEN, collapsed)
  collapseArrow.classList.toggle(Classes.OPEN, !collapsed)
  accordionTitle.classList.toggle(Classes.FIXED_TOP, !collapsed)
}

function setPlaylistTitlesCollapsable() {
  // Collapsable titles
  const playlistTitles = document.getElementsByClassName(
    Classes.PLAYLIST_TITLE,
  ) as HTMLCollectionOf<HTMLDivElement>
  Array.from(playlistTitles).forEach((playlistTitle) => {
    playlistTitle.setAttribute('tabIndex', String(0))
    playlistTitle.addEventListener('keypress', triggerClick)

    const collapseArrow = document.createElement('span')
    collapseArrow.classList.add(`fa`, `fa-lg`, `fa-caret-down`, Classes.COLLAPSE_CARET)
    playlistTitle.appendChild(collapseArrow)

    setCollapsed(playlistTitle, isMobile())

    playlistTitle.addEventListener('click', () => {
      const playlistBlock = playlistTitle.parentElement!
      const collapseContent = playlistBlock.getElementsByClassName(Classes.PLAYLIST_ITEMS)[0]
      const isCollapsed = collapseContent.classList.contains(Classes.HIDDEN)
      setCollapsed(playlistTitle, !isCollapsed)

      if (isCollapsed) {
        // when becomes expanded, place title at top
        playlistBlock.scrollIntoView({ behavior: 'smooth', block: 'end' })

        // when becomes expanded, if mobile, close others
        if (isMobile()) {
          Array.from(playlistTitles).forEach((otherPlaylistTitle) => {
            if (otherPlaylistTitle !== playlistTitle) {
              setCollapsed(otherPlaylistTitle, true)
            }
          })
        }
      }
    })
  })
}

async function replaceSoundcloudTrackElements(soundCloud: typeof SC) {
  const itemsToTransform = document.getElementsByClassName(Classes.TRANSFORM_TO_SC_ITEM)
  Array.from(itemsToTransform).forEach((itemToTransform) =>
    soundCloud
      .oEmbed(itemToTransform.getAttribute('data-sc-link')!, { auto_play: false, maxheight: 150 })
      .then((oEmbed) => {
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

        /** @type {HTMLIframeElement} */
        const iframeElement = htmlToElement(oEmbed.html) as HTMLIFrameElement
        iframeElement.title = titleStr
        const url = new URL(iframeElement.src)
        url.searchParams.set('auto_play', String(false))
        url.searchParams.set('hide_related', String(false))
        url.searchParams.set('show_comments', String(true))
        url.searchParams.set('show_user', String(false))
        url.searchParams.set('show_reposts', String(true))
        url.searchParams.set('show_teaser', String(false))
        url.searchParams.set('visual', String(true)) // true =  artwork behind waveform, false = artwork to left
        url.searchParams.set('show_artwork', String(true)) // want true, unless no artwork
        iframeElement.src = url.href
        trackWrapper.appendChild(iframeElement)

        const privacyPolicyCoverElement = document.createElement('div')
        privacyPolicyCoverElement.classList.add(Classes.PRIVACY_POLICY_COVER)
        trackWrapper.appendChild(privacyPolicyCoverElement)

        itemToTransform.replaceWith(trackWrapper)
      }),
  )

  await waitForElements(
    () => document.getElementsByClassName(Classes.TRACK_WRAPPER),
    itemsToTransform.length,
  )
}

function setPlaylistsScrollable() {
  const scrollRegions = document.getElementsByClassName(Classes.PLAYLIST_ITEMS)
  Array.from(scrollRegions).forEach((scrollRegion) => {
    if (!isScrollableY(scrollRegion)) return

    const ARROW_CLICK_SCROLL_DIST = 150
    const baseScrollArrowClasses = [Classes.SCROLL_ARROW, 'fa', 'fa-2x']

    const upDiv = document.createElement('div')
    upDiv.classList.add(...baseScrollArrowClasses, Classes.SCROLL_ARROW_UP, 'fa-caret-up')
    upDiv.addEventListener('click', () => {
      const newScrollTop = scrollRegion.scrollTop - ARROW_CLICK_SCROLL_DIST
      scrollRegion.scrollTo({
        top: newScrollTop < 40 ? 0 : newScrollTop,
        behavior: 'smooth',
      })
    })

    const downDiv = document.createElement('div')
    downDiv.classList.add(...baseScrollArrowClasses, Classes.SCROLL_ARROW_DOWN, 'fa-caret-down')
    downDiv.addEventListener('click', () => {
      const newScrollTop = scrollRegion.scrollTop + ARROW_CLICK_SCROLL_DIST
      scrollRegion.scrollTo({
        top: newScrollTop,
        behavior: 'smooth',
      })
    })

    scrollRegion.insertBefore(upDiv, scrollRegion.firstChild)
    scrollRegion.appendChild(downDiv)

    scrollRegion.addEventListener('scroll', (event) => {
      const thisScrollRegion = event.target as HTMLDivElement
      const upArrow = thisScrollRegion.getElementsByClassName(
        Classes.SCROLL_ARROW_UP,
      )[0] as HTMLDivElement
      const downArrow = thisScrollRegion.getElementsByClassName(
        Classes.SCROLL_ARROW_DOWN,
      )[0] as HTMLDivElement

      upArrow.style.display = isScrolledToTop(thisScrollRegion, 50) ? 'none' : 'inherit'
      downArrow.style.display = isScrolledToBottom(thisScrollRegion, 50) ? 'none' : 'inherit'
    })
  })
}

async function init() {
  // All anchors should open in NEW TAB
  Array.from(document.getElementsByTagName('a')).forEach((el) => {
    el.target = '_blank'
    el.rel = 'noreferrer noopener'
  })

  setPlaylistTitlesCollapsable()

  // Soundcloud stuff
  const SC_CLIENT_ID = 'DgFeY88vapbGCcK7RrT2E33nmNQVWX82'
  SC.initialize({ client_id: SC_CLIENT_ID })

  await replaceSoundcloudTrackElements(SC)

  setPlaylistsScrollable()
}

init()
