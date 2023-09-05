type ApiMethod = 'GET' | 'PUT' | 'POST'

export function makeRequest<T>(
  method: ApiMethod,
  url: string,
  params: Record<string, string | number | boolean> = {},
  requestArgs: Omit<RequestInit, 'method'> = {},
): Promise<T> {
  const urlObj = new URL(url)

  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined) {
      urlObj.searchParams.set(key, String(val))
    }
  }

  return fetch(urlObj.href, { ...requestArgs, method }).then((res) => {
    if (res.status < 200 || res.status > 300) throw new Error(`${res.status}: ${res.statusText}`)

    return res.json()
  })
}
