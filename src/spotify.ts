import { makeRequest } from './api_utils'
import { Buffer } from 'node:buffer'
import * as fs from 'fs'
import * as dotenv from 'dotenv'

dotenv.config({ path: `.env.local` })

const SPOTIFY_DATA_FILE = './spotify-data.json'

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

type AuthCodeResponse = {
  access_token: string
  token_type: 'Bearer'
  expires_in: number
  scope: string
  refresh_token: string
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
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  ).then(
    (res) =>
      res.json() as Promise<Pick<AuthCodeResponse, 'access_token' | 'token_type' | 'expires_in'>>,
  )
}

export function getAuthorizationCode() {
  return makeRequest('GET', 'https://accounts.spotify.com/authorize', {
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: SPOTIFY_REDIRECT_URI,
    scope: 'playlist-read-private',
    show_dialog: true,
    // state: string
  }).then((res) => {
    console.log('visit URL to get the code:')
    console.log(res.url)
  })
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
    { headers: { ...basicAuthHeader, 'Content-Type': 'application/x-www-form-urlencoded' } },
  )
    .then((res) => res.json() as Promise<AuthCodeResponse>)
    .then((res) => {
      fs.writeFileSync(SPOTIFY_DATA_FILE, JSON.stringify(res, null, 2), { encoding: 'utf-8' })
      return res
    })
}

export function readCurrentToken() {
  const tokenInfo = JSON.parse(
    fs.readFileSync(SPOTIFY_DATA_FILE, { encoding: 'utf-8' }),
  ) as AuthCodeResponse
  return { ...tokenInfo, authHeader: tokenInfo.token_type + ' ' + tokenInfo.access_token }
}

export function getRefreshedToken() {
  return makeRequest(
    'POST',
    'https://accounts.spotify.com/api/token',
    {
      grant_type: 'refresh_token',
      refresh_token: readCurrentToken().refresh_token,
    },
    { headers: { ...basicAuthHeader, 'Content-Type': 'application/x-www-form-urlencoded' } },
  ).then(
    (res) =>
      res.json() as Promise<
        Pick<AuthCodeResponse, 'access_token' | 'token_type' | 'expires_in' | 'scope'>
      >,
  )
}

export function getPlaylist(playlist_id: string) {
  return makeRequest(
    'GET',
    `https://api.spotify.com/v1/playlists/${playlist_id}`,
    {},
    { headers: { Authorization: readCurrentToken().authHeader } },
  ).then((res) => res.json() as Promise<SpotifyApi.PlaylistBaseObject>)
}
