import { makeRequest } from './api_utils'

const SPOTIFY_CLIENT_ID = 'b3fd438e0745429aa72465f6ff56e2ba'
const SPOTIFY_CLIENT_SECRET = '0a5b0c89ed89445a8c7c272c4f3ff5c7'

export function getToken() {
  return makeRequest<{ access_token: string; token_type: 'Bearer'; expires_in: number }>(
    'POST',
    'https://accounts.spotify.com/api/token',
    {
      grant_type: 'client_credentials',
      client_id: SPOTIFY_CLIENT_ID,
      client_secret: SPOTIFY_CLIENT_SECRET,
    },
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  )
}
