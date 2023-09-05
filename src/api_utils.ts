type ApiMethod = 'GET' | 'PUT' | 'POST'

export function makeRequest<T>(
  method: ApiMethod,
  url: string,
  params: Record<string, string | number | boolean> = {},
  headers: Record<string, string> = {},
): Promise<T> {
  const urlObj = new URL(url)

  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined) {
      urlObj.searchParams.set(key, String(val))
    }
  }

  return fetch(urlObj.href, { method, headers }).then((res) => res.json())
}
