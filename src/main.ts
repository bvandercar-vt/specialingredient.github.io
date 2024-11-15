/**
 * CSS Imports -- ORDER MATTERS
 */
import 'font-awesome/css/font-awesome.min.css'
import './styles/index.css'

/**
 * Regular imports
 */
import data from '../soundcloud-data.json'
import { setSearchParams } from './api/api-utils'
import { Classes, IFRAME_HEIGHT } from './constants'
import {
  createElement,
  htmlToElement,
  isMobile,
  isScrollableY,
  isScrolledToBottom,
  isScrolledToTop,
  onClassChange,
  triggerClick,
} from './html-utils'

function setGridCardsCollapsible() {
  function isCollapsed(element: Element) {
    return element.classList.contains(Classes.HIDDEN)
  }

  function setCollapsed(cardTitle: Element, collapsed: boolean) {
    const collapsibleCard = cardTitle.parentElement!
    const collapseContent = collapsibleCard.getElementsByClassName(Classes.CARD_COLLAPSE_CONTENT)[0]
    const collapseArrow = collapsibleCard.getElementsByClassName(Classes.COLLAPSE_CARET)[0]
    collapseContent.classList.toggle(Classes.HIDDEN, collapsed)
    collapseArrow.classList.toggle(Classes.OPEN, !collapsed)
  }

  const cardTitles = Array.from(document.getElementsByClassName<HTMLDivElement>(Classes.CARD_TITLE))
  cardTitles.forEach((cardTitle) => {
    setCollapsed(cardTitle, isMobile())

    cardTitle.setAttribute('role', 'button')
    cardTitle.setAttribute('tabIndex', String(0))
    cardTitle.addEventListener('keypress', triggerClick)
    cardTitle.addEventListener('click', async () => {
      const collapsibleCard = cardTitle.parentElement!
      const collapseContent = collapsibleCard.getElementsByClassName<HTMLDivElement>(
        Classes.CARD_COLLAPSE_CONTENT,
      )[0]
      const wasCollapsed = isCollapsed(collapseContent)
      setCollapsed(cardTitle, !wasCollapsed)

      if (wasCollapsed) {
        // when becomes expanded, set scroll arrows if needed
        maybeSetScrollArrows(collapseContent)

        // when becomes expanded, place title at top of window
        collapsibleCard.scrollIntoView({ behavior: 'smooth', block: 'start' })

        // when becomes expanded, if mobile, close others
        if (isMobile()) {
          cardTitles.forEach((otherCardTitle) => {
            if (otherCardTitle !== cardTitle) {
              setCollapsed(otherCardTitle, true)
            }
          })
        }
      }
    })
  })

  window.addEventListener(
    'resize',
    () => {
      const newSizeIsMobile = isMobile()
      cardTitles.forEach((cardTitle) => setCollapsed(cardTitle, newSizeIsMobile))
    },
    true,
  )
}

function maybeSetScrollArrows(scrollRegion: HTMLElement) {
  if (
    // return if not scrollable
    !isScrollableY(scrollRegion) ||
    // return if already has arrows
    scrollRegion.parentElement!.getElementsByClassName(Classes.SCROLL_ARROW).length > 0
  )
    return

  const ARROW_CLICK_SCROLL_DIST = 150 // distance scrolled when arrow clicked
  const ARROW_MAGNET_DISTANCE = 100 // when new scroll is within this distance from top/bottom, just scroll all the way to top/bottom
  const baseScrollArrowClasses = [Classes.SCROLL_ARROW, 'fa', 'fa-2x']

  const upArrow = createElement('div', {
    classes: [...baseScrollArrowClasses, 'fa-caret-up'],
    onClick: () => {
      const newScrollTop = scrollRegion.scrollTop - ARROW_CLICK_SCROLL_DIST
      scrollRegion.scrollTo({
        top: isScrolledToTop({ scrollTop: newScrollTop }, ARROW_MAGNET_DISTANCE) ? 0 : newScrollTop,
        behavior: 'smooth',
      })
    },
  })

  const downArrow = createElement('div', {
    classes: [...baseScrollArrowClasses, 'fa-caret-down'],
    onClick: () => {
      const newScrollTop = scrollRegion.scrollTop + ARROW_CLICK_SCROLL_DIST
      scrollRegion.scrollTo({
        top: isScrolledToBottom(
          {
            scrollHeight: scrollRegion.scrollHeight,
            offsetHeight: scrollRegion.offsetHeight,
            scrollTop: newScrollTop,
          },
          ARROW_MAGNET_DISTANCE,
        )
          ? scrollRegion.scrollHeight
          : newScrollTop,
        behavior: 'smooth',
      })
    },
  })

  scrollRegion.parentElement!.insertBefore(upArrow, scrollRegion)
  scrollRegion.parentElement!.appendChild(downArrow)

  // since the arrows are now in the parent container, must y-position them with respect to the scrollable region they surround
  const DISTANCE_FROM_EDGE = 5 // pixels
  upArrow.style.top = scrollRegion.offsetTop + DISTANCE_FROM_EDGE + 'px'
  downArrow.style.top =
    scrollRegion.offsetTop +
    scrollRegion.getBoundingClientRect().height -
    downArrow.getBoundingClientRect().height -
    DISTANCE_FROM_EDGE +
    'px'

  // show or hide arrows based on scroll position
  function showOrHideArrows() {
    upArrow.classList.toggle(Classes.DISPLAY_NONE, isScrolledToTop(scrollRegion, 50))
    downArrow.classList.toggle(Classes.DISPLAY_NONE, isScrolledToBottom(scrollRegion, 50))
  }
  showOrHideArrows()
  scrollRegion.addEventListener('scroll', showOrHideArrows)
  onClassChange(scrollRegion, showOrHideArrows) // for when becomes hidden or unhidden
}

function setGridCardTitles() {
  const gridCards = document.getElementsByClassName(Classes.GRID_CARD)
  for (let i = 0; i < gridCards.length; i++) {
    const gridCard = gridCards[i]
    const cardUrl = gridCard.getAttribute('data-url')
    const cardTitle = gridCard.getAttribute('data-title')
    if (!cardUrl || !cardTitle) throw new Error('need data-url and data-title')

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
  Promise.all(
    itemsToTransform.map(async (itemToTransform) => {
      const originalLink = itemToTransform.getAttribute('data-sc-link')
      if (!originalLink) throw new Error('needs data-sc-link')

      const oEmbed = data.find((d) => d.originalLink === originalLink)
      if (!oEmbed) throw new Error(`no match for ${originalLink}`)

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
    }),
  )
}

function init() {
  // set global css var
  document.documentElement.style.setProperty('--iframe-height', `${IFRAME_HEIGHT}px`)

  // for iphone window
  const setAppHeight = () =>
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
  window.addEventListener('resize', setAppHeight)
  setAppHeight()

  setGridCardTitles()

  setSoundcloudTracks()

  setGridCardsCollapsible()

  Array.from(
    document.getElementsByClassName<HTMLDivElement>(Classes.CARD_COLLAPSE_CONTENT),
  ).forEach((collapseContent) => maybeSetScrollArrows(collapseContent))

  // All anchors should open in NEW TAB
  Array.from(document.getElementsByTagName('a')).forEach((el) => {
    el.target = '_blank'
  })
}

init()
