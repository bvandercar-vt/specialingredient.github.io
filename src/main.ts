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
} from './html-utils'

function setCollapsed(accordionTitle: HTMLDivElement, collapsed: boolean) {
  const parentElement = accordionTitle.parentElement!
  const collapseContent = parentElement.getElementsByClassName(Classes.CARD_COLLAPSE_CONTENT)[0]
  const collapseArrow = parentElement.getElementsByClassName(Classes.COLLAPSE_CARET)[0]
  collapseContent.classList.toggle(Classes.HIDDEN, collapsed)
  collapseArrow.classList.toggle(Classes.OPEN, !collapsed)
  accordionTitle.classList.toggle(Classes.FIXED_TOP, !collapsed)
}

function setGridCardsCollapsible() {
  // Collapsable titles
  const cardTitles = Array.from(
    document.getElementsByClassName(Classes.CARD_TITLE),
  ) as HTMLDivElement[]
  cardTitles.forEach((cardTitle) => {
    setCollapsed(cardTitle, isMobile())

    cardTitle.setAttribute('role', 'button')
    cardTitle.setAttribute('tabIndex', String(0))
    cardTitle.addEventListener('keypress', triggerClick)
    cardTitle.addEventListener('click', () => {
      const collapsibleCard = cardTitle.parentElement!
      const collapseContent = collapsibleCard.getElementsByClassName(
        Classes.CARD_COLLAPSE_CONTENT,
      )[0]
      const isCollapsed = collapseContent.classList.contains(Classes.HIDDEN)
      setCollapsed(cardTitle, !isCollapsed)

      if (isCollapsed) {
        // when becomes expanded, place title at top
        collapsibleCard.scrollIntoView({ behavior: 'smooth', block: 'end' })

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

function setCardContentScrollable() {
  const scrollRegions = document.getElementsByClassName(Classes.CARD_COLLAPSE_CONTENT)
  Array.from(scrollRegions).forEach((scrollRegion) => {
    if (!isScrollableY(scrollRegion)) return

    const ARROW_CLICK_SCROLL_DIST = 150
    const baseScrollArrowClasses = [Classes.SCROLL_ARROW, 'fa', 'fa-2x']

    const upDiv = createElement('div', {
      classes: [...baseScrollArrowClasses, Classes.SCROLL_ARROW_UP, 'fa-caret-up'],
      onClick: () => {
        const newScrollTop = scrollRegion.scrollTop - ARROW_CLICK_SCROLL_DIST
        scrollRegion.scrollTo({
          top: newScrollTop < 40 ? 0 : newScrollTop,
          behavior: 'smooth',
        })
      },
    })

    const downDiv = createElement('div', {
      classes: [...baseScrollArrowClasses, Classes.SCROLL_ARROW_DOWN, 'fa-caret-down'],
      onClick: () => {
        const newScrollTop = scrollRegion.scrollTop + ARROW_CLICK_SCROLL_DIST
        scrollRegion.scrollTo({
          top: newScrollTop,
          behavior: 'smooth',
        })
      },
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

function init() {
  setGridCardsCollapsible()

  setCardContentScrollable()

  // iphone window stuff
  const setAppHeight = () =>
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
  window.addEventListener('resize', setAppHeight)
  setAppHeight()
}

init()
