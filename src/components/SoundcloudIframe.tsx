import classNames from 'classnames'
import { useEffect, useId, useRef, useState } from 'react'
import type { TrackInfo } from '../api/soundcloudPlayer'
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
  const [trackInfo, setTrackInfo] = useState<TrackInfo>()
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
    visual: false, // true =  artwork behind waveform, false = artwork to left
    show_artwork: false,
  })
  dummyElement.src = iframeUrl.href
  dummyElement.id = id
  dummyElement.allow = 'autoplay'

  useEffect(() => {
    if (wrapperRef.current?.firstElementChild && !trackInfo) {
      const widget = window.SC.Widget(id)
      widget.bind(window.SC.Widget.Events.READY, () => {
        widget.getCurrentSound((sound) => setTrackInfo(sound))
      })
      widget.bind(window.SC.Widget.Events.PLAY, () => setIsPlaying(true))
      widget.bind(window.SC.Widget.Events.PAUSE, () => setIsPlaying(false))
      widget.bind(window.SC.Widget.Events.FINISH, () => setIsPlaying(false))
    }
  }, [wrapperRef.current?.firstElementChild])

  return (
    <div className="sc-player">
      <button
        onClick={() => {
          const widget = window.SC.Widget(id)
          widget.toggle()
        }}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className={classNames('circle fa fa-solid', {
          'fa-play': !isPlaying,
          'fa-pause': isPlaying,
        })}
      />
      {trackInfo?.artwork_url && <img src={trackInfo.artwork_url} className="album-art" />}
      <div
        className={classNames('sc-iframe-wrapper', className, { playing: isPlaying })}
        dangerouslySetInnerHTML={{ __html: dummyElement.outerHTML }}
        ref={wrapperRef}
      />
    </div>
  )
}
