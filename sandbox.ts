import { makeRequest } from './src/api_utils'
import { getToken } from './src/spotify'
// @ts-ignore-error
// import * as xmlhttprequest from 'xmlhttprequest'
// global.XMLHttpRequest = xmlhttprequest.XMLHttpRequest

console.log('SANDBOX')

getToken().then(({ token_type, access_token }) => {
  makeRequest(
    'GET',
    'https://api.spotify.com/v1/playlists/1WshUeiMnKMcGTyoUAfm8O',
    {},
    { headers: { Authorization: token_type + ' ' + access_token } },
  ).then((t) => console.log(t))
})
