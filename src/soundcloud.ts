import { makeRequest } from './api_utils'

const SC_CLIENT_ID = 'DgFeY88vapbGCcK7RrT2E33nmNQVWX82'

export function oEmbed(params: {
  url: string
  /** @default 100% */
  maxwidth?: number
  /** @default 166 for tracks, 450 for sets */
  maxheight?: number
  color?: string
  /** @default false */
  auto_play?: boolean
  /** @default true */
  show_comments?: boolean
}) {
  return makeRequest<{
    title: string
    thumbnail_url: string
    html: string
    description: string
  }>('GET', `https://soundcloud.com/oembed`, { client_id: SC_CLIENT_ID, ...params })
}
