import { makeRequest } from './src/api_utils'
//@ts-ignore-error
// import * as xmlhttprequest from 'xmlhttprequest'
// global.XMLHttpRequest = xmlhttprequest.XMLHttpRequest

console.log('SANDBOX')

const client_id = 'b3fd438e0745429aa72465f6ff56e2ba'
const client_secret = '0a5b0c89ed89445a8c7c272c4f3ff5c7'

makeRequest<{ access_token: string; token_type: 'Bearer'; expires_in: number }>(
  'POST',
  'https://accounts.spotify.com/api/token',
  { grant_type: 'client_credentials', client_id, client_secret },
  { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
).then(({ token_type, access_token }) => {
  makeRequest(
    'GET',
    'https://api.spotify.com/v1/playlists/1WshUeiMnKMcGTyoUAfm8O',
    {},
    { headers: { Authorization: token_type + ' ' + access_token } },
  ).then((t) => console.log(t))
})
