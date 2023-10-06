/**
 * CSS Imports -- ORDER MATTERS
 */
import 'font-awesome/css/font-awesome.min.css'
import './styles/index.css'

/**
 * Regular imports
 */
import { Classes, IFRAME_HEIGHT } from './constants'
import {
  createElement,
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

  function setCollapsed(accordionTitle: Element, collapsed: boolean) {
    const parentElement = accordionTitle.parentElement!
    const collapseContent = parentElement.getElementsByClassName(Classes.CARD_COLLAPSE_CONTENT)[0]
    const collapseArrow = parentElement.getElementsByClassName(Classes.COLLAPSE_CARET)[0]
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
      cardTitles.forEach((otherCardTitle) => {
        setCollapsed(otherCardTitle, isMobile())
      })
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

function init() {
  // set global css var
  document.documentElement.style.setProperty('--iframe-height', `${IFRAME_HEIGHT}px`)

  // for iphone window
  const setAppHeight = () =>
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
  window.addEventListener('resize', setAppHeight)
  setAppHeight()

  setGridCardsCollapsible()

  Array.from(
    document.getElementsByClassName<HTMLDivElement>(Classes.CARD_COLLAPSE_CONTENT),
  ).forEach((collapseContent) => maybeSetScrollArrows(collapseContent))
}

init()
