import * as dotenv from 'dotenv'
import * as fs from 'fs'
import { Buffer } from 'node:buffer'
import { checkHasExactKeys, retryPromise, sleep } from '../utils'
import { makeRequest, setSearchParams } from './api-utils'

dotenv.config({ path: `.env.local` })

const SPOTIFY_DATA_FILE = `./src/api/spotify-token.json`

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_AUTHORIZATION_CODE,
  SPOTIFY_REDIRECT_URI,
} = process.env as {
  SPOTIFY_CLIENT_ID: string
  SPOTIFY_CLIENT_SECRET: string
  SPOTIFY_AUTHORIZATION_CODE: string
  SPOTIFY_REDIRECT_URI: string
}
if (
  !SPOTIFY_CLIENT_ID ||
  !SPOTIFY_CLIENT_SECRET ||
  !SPOTIFY_AUTHORIZATION_CODE ||
  !SPOTIFY_REDIRECT_URI
)
  throw new Error('need env file')

const basicAuthHeader = {
  Authorization: `Basic ${Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString(
    'base64',
  )}` as const,
}

const contentTypeHeader = { 'Content-Type': 'application/x-www-form-urlencoded' }

type AuthCodeResponse = {
  access_token: string
  token_type: 'Bearer'
  expires_in: number
  scope: string
  refresh_token: string
}

function writeCurrentToken(tokenInfo: AuthCodeResponse) {
  checkHasExactKeys(tokenInfo, [
    'access_token',
    'token_type',
    'expires_in',
    'scope',
    'refresh_token',
  ])

  fs.writeFileSync(SPOTIFY_DATA_FILE, JSON.stringify(tokenInfo, null, 2), { encoding: 'utf-8' })
}

function readCurrentToken() {
  return JSON.parse(fs.readFileSync(SPOTIFY_DATA_FILE, { encoding: 'utf-8' })) as AuthCodeResponse
}

function getCurrentTokenAuthHeader() {
  const tokenInfo = readCurrentToken()
  return { Authorization: tokenInfo.token_type + ' ' + tokenInfo.access_token }
}

export function getTokenSimple() {
  return makeRequest(
    'POST',
    'https://accounts.spotify.com/api/token',
    {
      grant_type: 'client_credentials',
      client_id: SPOTIFY_CLIENT_ID,
      client_secret: SPOTIFY_CLIENT_SECRET,
    },
    { headers: contentTypeHeader },
  ).then(
    (res) =>
      res.json() as Promise<Pick<AuthCodeResponse, 'access_token' | 'token_type' | 'expires_in'>>,
  )
}

export function getAuthorizationCode() {
  const url = new URL('https://accounts.spotify.com/authorize')
  setSearchParams(url, {
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: SPOTIFY_REDIRECT_URI,
    scope: 'playlist-read-private',
    show_dialog: true,
  })

  console.log('visit URL to get the code:')
  console.log(url.href)
}

export function getTokenFromAuthorizationCode(code: string = SPOTIFY_AUTHORIZATION_CODE) {
  return makeRequest(
    'POST',
    'https://accounts.spotify.com/api/token',
    {
      grant_type: 'authorization_code',
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
    },
    { headers: { ...basicAuthHeader, ...contentTypeHeader } },
  )
    .then((res) => res.json() as Promise<AuthCodeResponse>)
    .then((res) => {
      writeCurrentToken(res)
      return res
    })
}

export function refreshToken() {
  const currentToken = readCurrentToken()

  return makeRequest(
    'POST',
    'https://accounts.spotify.com/api/token',
    {
      grant_type: 'refresh_token',
      refresh_token: currentToken.refresh_token,
    },
    { headers: { ...basicAuthHeader, ...contentTypeHeader } },
  )
    .then(
      (res) =>
        res.json() as Promise<
          Pick<AuthCodeResponse, 'access_token' | 'token_type' | 'expires_in' | 'scope'>
        >,
    )
    .then((res) => {
      writeCurrentToken({ ...currentToken, ...res })
      return res
    })
}

function refreshTokenOnFail<T>(promise: () => Promise<T>) {
  return retryPromise(promise, {
    retries: 2,
    onRetry: async () => {
      await refreshToken()
      await sleep(500)
    },
  })
}

async function getPaginatedEndpoint<T extends SpotifyApi.PagingObject<unknown>>(
  url: string,
): Promise<T['items']> {
  const headers = getCurrentTokenAuthHeader()
  let res = await makeRequest('GET', url, { limit: 50 }, { headers }).then(
    (res) => res.json() as Promise<T>,
  )
  let items = res.items

  while (res.next) {
    res = await makeRequest('GET', res.next, {}, { headers }).then(
      (res) => res.json() as Promise<T>,
    )
    items = items.concat(res.items)
  }

  return items
}

export function getPlaylist(playlist_id: string) {
  return refreshTokenOnFail(() =>
    makeRequest(
      'GET',
      `https://api.spotify.com/v1/playlists/${playlist_id}`,
      {},
      { headers: getCurrentTokenAuthHeader() },
    ).then((res) => res.json() as Promise<SpotifyApi.PlaylistBaseObject>),
  )
}

export async function getPlaylists() {
  return refreshTokenOnFail(() =>
    getPaginatedEndpoint<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>(
      `https://api.spotify.com/v1/me/playlists`,
    ),
  )
}
