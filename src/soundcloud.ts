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
  const url = new URL(`https://soundcloud.com/oembed`)
  url.searchParams.set('client_id', SC_CLIENT_ID)

  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined) {
      url.searchParams.set(key, String(val))
    }
  }

  return makeRequest<{
    title: string
    thumbnail_url: string
    html: string
    description: string
  }>('GET', url.href)
}
