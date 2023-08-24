const SC_CLIENT_ID = 'DgFeY88vapbGCcK7RrT2E33nmNQVWX82'

type ApiMethod = 'GET' | 'PUT'

function makeRequest<T>(method: ApiMethod, url: string) {
  return new Promise<T>((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open(method, url, true)
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve(JSON.parse(xhr.response))
        : reject({ status: xhr.status, statusText: xhr.statusText })
    xhr.onerror = () => reject({ status: xhr.status, statusText: xhr.statusText })
    xhr.send()
  })
}

export function oEmbed(params: {
  url: string
  maxwidth?: number
  maxheight?: number
  color?: string
  auto_play?: boolean
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
