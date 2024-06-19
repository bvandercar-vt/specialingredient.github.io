import { Scopes, SpotifyApi, type Page } from '@spotify/web-api-ts-sdk'

const ROOT_URL = 'https://api.spotify.com/v1/'

const SCOPES = [...Scopes.playlistRead, ...Scopes.userDetails, ...Scopes.userLibraryRead]

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } = process.env
if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REDIRECT_URI)
  throw new Error('need env file')

const sdk = SpotifyApi.withUserAuthorization(SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI, SCOPES)

async function getPaginatedItems<T>(this: SpotifyApi, func: () => Promise<Page<T>>): Promise<T[]> {
  let response = await func()

  let items = response.items

  while (response.next) {
    const next = response.next.split(ROOT_URL)[1]
    response = (await this.makeRequest('GET', next)) as typeof response

    items = items.concat(response.items)
  }

  return items
}

async function getAllPlaylists(this: SpotifyApi) {
  return this.getPaginatedItems(() => this.currentUser.playlists.playlists(50))
}

declare module '@spotify/web-api-ts-sdk' {
  export interface SpotifyApi {
    getPaginatedItems: typeof getPaginatedItems
    getAllPlaylists: typeof getAllPlaylists
  }
}

sdk.getPaginatedItems = getPaginatedItems
sdk.getAllPlaylists = getAllPlaylists

export { sdk }
