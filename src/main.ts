/**
 * CSS Imports -- ORDER MATTERS
 */
import 'font-awesome/css/font-awesome.min.css'
import './styles/index.css'

/**
 * Regular imports
 */
import {
  isScrolledToTop,
  isScrolledToBottom,
  isScrollableY,
  isMobile,
  triggerClick,
} from './html_utils'
import { Classes } from './constants'

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
    setCollapsed(playlistTitle, isMobile())

    playlistTitle.setAttribute('tabIndex', String(0))
    playlistTitle.addEventListener('keypress', triggerClick)
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

function init() {
  setPlaylistTitlesCollapsable()

  setPlaylistsScrollable()
}

init()
