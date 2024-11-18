import classNames from 'classnames'
import { useEffect, useId, useRef, useState } from 'react'
import { setSearchParams } from '../utils/api-utils'
import { htmlToElement } from '../utils/html-utils'

export interface SoundcloudIframeProps {
  html: string
  title: string
  className?: string
}

export const SoundcloudIframe = ({ html, title, className }: SoundcloudIframeProps) => {
  const id = useId()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const dummyElement = htmlToElement(html) as HTMLIFrameElement
  dummyElement.title = title
  const iframeUrl = new URL(dummyElement.src)
  setSearchParams(iframeUrl, {
    auto_play: false,
    hide_related: true,
    show_comments: true,
    show_user: false,
    show_reposts: true,
    show_teaser: false,
    visual: true, // true =  artwork behind waveform, false = artwork to left. If false though, requires taller height to see comments
    show_artwork: true,
  })
  dummyElement.src = iframeUrl.href
  dummyElement.id = id

  useEffect(() => {
    if (wrapperRef.current?.firstElementChild) {
      const widget = window.SC.Widget(id)
      widget.bind(window.SC.Widget.Events.PLAY, () => setIsPlaying(true))
      widget.bind(window.SC.Widget.Events.PAUSE, () => setIsPlaying(false))
      widget.bind(window.SC.Widget.Events.FINISH, () => setIsPlaying(false))
    }
  }, [wrapperRef.current?.firstElementChild])

  return (
    <div
      className={classNames('sc-iframe-wrapper', className, { playing: isPlaying })}
      dangerouslySetInnerHTML={{ __html: dummyElement.outerHTML }}
      ref={wrapperRef}
    />
  )
}
