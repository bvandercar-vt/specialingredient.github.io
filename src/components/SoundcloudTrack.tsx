import { useEffect, useRef } from 'react'
import data from '../../soundcloud-data.json'
import { setSearchParams } from '../utils/api-utils'
import { htmlToElement } from '../utils/html-utils'

export const SoundcloudTrack = ({
  url,
  title: _title,
  genreDescription,
  additionalDescription: _additionalDescription,
}: {
  url: string
  title?: string
  genreDescription?: string
  additionalDescription?: string
}) => {
  const info = data.find((d) => d.originalLink === url)
  if (!info) throw new Error(`no info found from url ${url}`)

  const title =
    _title ??
    info.title
      .replaceAll(' by Special Ingredient', '')
      .replaceAll('[w TRACKLIST]', '')
      .replaceAll('[MASHUP]', '')

  const addlDescription =
    _additionalDescription === 'GET_FROM_SC' ? info.description : _additionalDescription

  const iframeWrapperRef = useRef<HTMLDivElement | null>(null)

  const iframeElement = htmlToElement(info.html) as HTMLIFrameElement
  iframeElement.title = title
  const iframeUrl = new URL(iframeElement.src)
  setSearchParams(iframeUrl, {
    auto_play: false,
    hide_related: false,
    show_comments: true,
    show_user: false,
    show_reposts: true,
    show_teaser: false,
    visual: true, // true =  artwork behind waveform, false = artwork to left
    show_artwork: true,
  })
  iframeElement.src = iframeUrl.href

  useEffect(() => {
    iframeWrapperRef.current?.appendChild(iframeElement)
  }, [])

  return (
    <div className="track-wrapper">
      <p className="track-title">{title}</p>
      {genreDescription && <p className="track-genre-description">{genreDescription}</p>}
      {addlDescription && <p className="track-addl-description">{addlDescription}</p>}
      <div className="sc-iframe-wrapper" ref={iframeWrapperRef} />
    </div>
  )
}
