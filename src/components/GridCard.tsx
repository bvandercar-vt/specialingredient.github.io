import classNames from 'classnames'
import {
  createRef,
  PropsWithChildren,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { isMobile, isScrolledToBottom, isScrolledToTop, triggerClick } from '../utils/html-utils'

export const GridCard = ({
  title,
  collapsed,
  onCollapse,
  outerRef = createRef(),
  children,
}: PropsWithChildren<{
  title: string
  collapsed?: boolean
  onCollapse?: (isCollapsed: boolean) => void
  outerRef?: React.RefObject<HTMLDivElement>
}>) => {
  const [isCollapsed, setCollapsed] = useState(collapsed ?? isMobile())
  const [shouldScroll, setShouldScroll] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [height, setHeight] = useState(0)
  const titleRef = useRef<HTMLDivElement>(null)
  const collapseContentRef = useRef<HTMLDivElement>(null)

  const titleId = useId()

  const performCollapse = useCallback(
    (collapsed: boolean) => {
      onCollapse?.(collapsed)
      setCollapsed(!collapsed)
    },
    [onCollapse],
  )

  const handleCollapseClick = useCallback(() => {
    if (isCollapsed) {
      setShouldScroll(true)
    }
    performCollapse(isCollapsed)
  }, [isCollapsed])

  useEffect(() => {
    if (collapsed !== undefined) {
      performCollapse(!collapsed)
    }
  }, [collapsed])

  useEffect(() => {
    if (shouldScroll) {
      const topItem = isMobile() ? titleRef : outerRef
      topItem.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setShouldScroll(false)
    }
  }, [shouldScroll])

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
    if (!scrollRegion || isCollapsed) return [null, null]

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
    <div className="grid-card" role="region" aria-labelledby={titleId} ref={outerRef}>
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
          className={classNames(`fa fa-lg fa-caret-down collapse-caret`, { open: !isCollapsed })}
        ></span>
      </div>
      {!isCollapsed && UpArrow}
      <div
        className={classNames('collapse-content', { hidden: isCollapsed })}
        ref={collapseContentRef}
        onScroll={(e) => setScrollPosition(e.currentTarget.scrollTop)}
      >
        {children}
      </div>
      {!isCollapsed && DownArrow}
    </div>
  )
}
