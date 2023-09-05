type ApiMethod = 'GET' | 'PUT' | 'POST'

export function makeRequest(
  method: ApiMethod,
  url: string,
  params: Record<string, string | number | boolean> = {},
  requestArgs: Omit<RequestInit, 'method'> = {},
) {
  const urlObj = new URL(url)

  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined) {
      urlObj.searchParams.set(key, String(val))
    }
  }

  return fetch(urlObj.href, { ...requestArgs, method }).then(async (response) => {
    if (response.status < 200 || response.status > 300) {
      throw new Error(`${response.status}: ${response.statusText} - ${await response.text()}`)
    }
    return response
  })
}
