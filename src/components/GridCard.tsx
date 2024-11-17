import classNames from 'classnames'
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { getIsMobile, isScrolledToBottom, isScrolledToTop, triggerClick } from '../utils/html-utils'

export type GridCardProps = PropsWithChildren<{
  title: string
}>

// Context to share expansion control across cards
export const GridCardContext = createContext<{
  expandedCards: string[]
  setExpandedCards: Dispatch<SetStateAction<string[]>>
  allowMultiple: boolean
  initiallyOpened?: boolean
}>({
  expandedCards: [],
  setExpandedCards: () => {},
  allowMultiple: false,
})

export const GridCard = ({ title, children }: GridCardProps) => {
  const { expandedCards, setExpandedCards, allowMultiple, initiallyOpened } =
    useContext(GridCardContext)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  const isExpanded = expandedCards.includes(id)

  // const [shouldScroll, setShouldScroll] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [height, setHeight] = useState(0)
  const titleRef = useRef<HTMLDivElement>(null)
  const collapseContentRef = useRef<HTMLDivElement>(null)

  const titleId = useId()

  useEffect(() => {
    if (initiallyOpened) {
      setExpandedCards((prev) => [...prev, id])
    }
  }, [])

  const scrollToTop = () => {
    const topItem = getIsMobile() ? titleRef : ref
    requestAnimationFrame(() => {
      topItem.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const handleCollapseClick = useCallback(() => {
    if (!isExpanded) {
      // scroll immediately if we can
      scrollToTop()
    }
    if (allowMultiple) {
      setExpandedCards((prev) =>
        isExpanded ? prev.filter((cardId) => cardId !== id) : [...prev, id],
      )
    } else {
      setExpandedCards(isExpanded ? [] : [id])
    }
  }, [isExpanded, expandedCards])

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.contentRect.height)
      }
    })

    if (collapseContentRef.current) {
      observer.observe(collapseContentRef.current)
    }

    return () => {
      if (collapseContentRef.current) {
        observer.unobserve(collapseContentRef.current)
      }
    }
  }, [])

  const [UpArrow, DownArrow] = useMemo(() => {
    const scrollRegion = collapseContentRef.current
    if (!scrollRegion || !isExpanded) return [null, null]

    const ARROW_CLICK_SCROLL_DIST = 150 // distance scrolled when arrow clicked
    const ARROW_MAGNET_DISTANCE = 100 // when new scroll is within this distance from top/bottom, just scroll all the way to top/bottom
    const ARROW_DISTANCE_FROM_EDGE = 5 // pixels
    const commonScrollArrowClasses = ['scroll-arrow', 'fa', 'fa-2x']

    const UpArrow = isScrolledToTop(scrollRegion, 50) ? null : (
      <div
        className={classNames(commonScrollArrowClasses, 'fa-caret-up')}
        onClick={() => {
          const newScrollTop = scrollRegion.scrollTop - ARROW_CLICK_SCROLL_DIST
          scrollRegion.scrollTo({
            top: isScrolledToTop({ scrollTop: newScrollTop }, ARROW_MAGNET_DISTANCE)
              ? 0
              : newScrollTop,
            behavior: 'smooth',
          })
        }}
        style={{ top: scrollRegion.offsetTop + ARROW_DISTANCE_FROM_EDGE }}
      />
    )

    const DownArrow = isScrolledToBottom(scrollRegion, 50) ? null : (
      <div
        className={classNames(commonScrollArrowClasses, 'fa-caret-down')}
        onClick={() => {
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
        }}
        style={{
          bottom: ARROW_DISTANCE_FROM_EDGE,
        }}
      />
    )
    return [UpArrow, DownArrow]
  }, [height, scrollPosition])

  return (
    <div className="grid-card" role="region" aria-labelledby={titleId} ref={ref}>
      <div
        className="card-title"
        role="button"
        tabIndex={0}
        onKeyDown={triggerClick}
        onClick={handleCollapseClick}
        ref={titleRef}
      >
        <h2 id={titleId}>{title}</h2>
        <span
          className={classNames(`fa fa-lg fa-caret-down collapse-caret`, { open: isExpanded })}
        ></span>
      </div>
      {isExpanded && UpArrow}
      <div
        className={classNames('collapse-content', { hidden: !isExpanded })}
        ref={collapseContentRef}
        onScroll={(e) => setScrollPosition(e.currentTarget.scrollTop)}
        // due to other cards collapsing, may need to scroll again once finished since proper position
        // on page can't be calculated while that collapse animation is occurring.
        onTransitionEnd={scrollToTop}
      >
        {children}
      </div>
      {isExpanded && DownArrow}
    </div>
  )
}
