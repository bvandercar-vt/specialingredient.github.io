import classNames from 'classnames'
import { setSearchParams } from '../utils/api-utils'
import { htmlToElement } from '../utils/html-utils'

export interface SoundcloudIframeProps {
  html: string
  title: string
  className?: string
}

export const SoundcloudIframe = ({ html, title, className }: SoundcloudIframeProps) => {
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
    visual: true, // true =  artwork behind waveform, false = artwork to left
    show_artwork: true,
  })
  dummyElement.src = iframeUrl.href

  return (
    <div
      className={classNames('sc-iframe-wrapper', className)}
      dangerouslySetInnerHTML={{ __html: dummyElement.outerHTML }}
    />
  )
}
