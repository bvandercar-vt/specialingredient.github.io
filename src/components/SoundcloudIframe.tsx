import { setSearchParams } from '../utils/api-utils'
import { htmlToElement } from '../utils/html-utils'

export interface SoundcloudIframeProps {
  html: string
  title: string
}

export const SoundcloudIframe = ({ html, title }: SoundcloudIframeProps) => {
  const iframeElement = htmlToElement(html) as HTMLIFrameElement
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

  return <div className="sc-iframe-wrapper" ref={(ref) => ref?.appendChild(iframeElement)} />
}
