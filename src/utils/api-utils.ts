type ApiMethod = 'GET' | 'PUT' | 'POST'

type SearchParams = Record<string, string | number | boolean>

export function setSearchParams(url: URL, params: SearchParams = {}) {
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined) {
      url.searchParams.set(key, String(val))
    }
  }
}

export function makeRequest(
  method: ApiMethod,
  url: string,
  params: SearchParams = {},
  requestArgs: Omit<RequestInit, 'method'> = {},
) {
  const urlObj = new URL(url)
  setSearchParams(urlObj, params)

  return fetch(urlObj.href, { ...requestArgs, method }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText} - ${await response.text()}`)
    }
    return response
  })
}
