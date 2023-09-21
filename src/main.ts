/**
 * CSS Imports -- ORDER MATTERS
 */
import 'font-awesome/css/font-awesome.min.css'
import './styles/index.css'

/**
 * Regular imports
 */
import { Classes } from './constants'
import {
  createElement,
  isMobile,
  isScrollableY,
  isScrolledToBottom,
  isScrolledToTop,
  triggerClick,
  waitForElements,
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

  // Collapsable titles
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
        const newArrowsCreated = maybeSetScrollArrows(collapseContent)
        // if new arrows were created, wait until finished before scrolling-- else, scrolling is glitchy
        if (newArrowsCreated) {
          await waitForElements(
            () => collapseContent.getElementsByClassName(Classes.SCROLL_ARROW),
            2,
          )
        } else {
          // since is now scrolled to top, reset arrow states
          const arrows = collapseContent.getElementsByClassName(Classes.SCROLL_ARROW)
          if (arrows.length > 0) {
            setArrowHidden(arrows[0], true)
            setArrowHidden(arrows[1], false)
          }
        }

        // when becomes expanded, place title at top of window
        collapsibleCard.scrollIntoView({ behavior: 'smooth', block: 'center' })

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

function setArrowHidden(element: Element, hidden: boolean) {
  element.classList.toggle(Classes.DISPLAY_NONE, hidden)
}

/**
 * @returns `true` if new arrows set, `false` otherwise
 */
function maybeSetScrollArrows(scrollRegion: HTMLElement): boolean {
  if (
    // return if not scrollable
    !isScrollableY(scrollRegion) ||
    // return if already has arrows
    scrollRegion.getElementsByClassName(Classes.SCROLL_ARROW).length > 0
  )
    return false

  // distance scrolled when arrow clicked
  const ARROW_CLICK_SCROLL_DIST = 150
  // when new scroll is within this distance from top/bottom, just scroll all the way to top/bottom
  const ARROW_MAGNET_DISTANCE = 100
  const baseScrollArrowClasses = [Classes.SCROLL_ARROW, 'fa', 'fa-2x']

  const upArrow = createElement('div', {
    classes: [...baseScrollArrowClasses, Classes.SCROLL_ARROW_UP, 'fa-caret-up'],
    onClick: () => {
      const newScrollTop = scrollRegion.scrollTop - ARROW_CLICK_SCROLL_DIST
      scrollRegion.scrollTo({
        top: isScrolledToTop({ scrollTop: newScrollTop }, ARROW_MAGNET_DISTANCE) ? 0 : newScrollTop,
        behavior: 'smooth',
      })
    },
  })

  const downArrow = createElement('div', {
    classes: [...baseScrollArrowClasses, Classes.SCROLL_ARROW_DOWN, 'fa-caret-down'],
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

  setArrowHidden(upArrow, true)
  setArrowHidden(downArrow, false)

  scrollRegion.insertBefore(upArrow, scrollRegion.firstChild)
  scrollRegion.appendChild(downArrow)
  scrollRegion.addEventListener('scroll', () => {
    setArrowHidden(upArrow, isScrolledToTop(scrollRegion, 50))
    setArrowHidden(downArrow, isScrolledToBottom(scrollRegion, 50))
  })

  return true
}

function init() {
  // iphone window stuff
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
