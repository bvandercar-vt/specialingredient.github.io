type ApiMethod = 'GET' | 'PUT'

export function makeRequest<T>(method: ApiMethod, url: string) {
  return new Promise<T>((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve(JSON.parse(xhr.response))
        : reject({ status: xhr.status, statusText: xhr.statusText })
    xhr.onerror = () => reject({ status: xhr.status, statusText: xhr.statusText })
    xhr.send()
  })
}
