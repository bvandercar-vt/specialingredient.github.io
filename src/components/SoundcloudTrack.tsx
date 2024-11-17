import data from '../../soundcloud-data.json'
import { SoundcloudIframe } from './SoundcloudIframe'

export interface SoundcloudTrackProps {
  url: string
  title?: string
  genreDescription?: string
  additionalDescription?: string
}

export const SoundcloudTrack = ({
  url,
  title: _title,
  genreDescription,
  additionalDescription: _additionalDescription,
}: SoundcloudTrackProps) => {
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

  return (
    <div className="track-wrapper">
      <p className="track-title">{title}</p>
      {genreDescription && <p className="track-genre-description">{genreDescription}</p>}
      {addlDescription && <p className="track-addl-description">{addlDescription}</p>}
      <SoundcloudIframe html={info.html} title={title} />
    </div>
  )
}
