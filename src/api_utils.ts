type ApiMethod = 'GET' | 'PUT' | 'POST'

export function makeRequest<T>(
  method: ApiMethod,
  url: string,
  params: Record<string, string | number | boolean> = {},
  headers: Record<string, string | number | boolean> = {},
) {
  const urlObj = new URL(url)

  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined) {
      urlObj.searchParams.set(key, String(val))
    }
  }

  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, urlObj.href)
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve(JSON.parse(xhr.response))
        : reject({ status: xhr.status, statusText: xhr.statusText })
    xhr.onerror = () => reject({ status: xhr.status, statusText: xhr.statusText })
    for (const [key, val] of Object.entries(headers)) {
      xhr.setRequestHeader(key, String(val))
    }
    xhr.send()
  })
}
