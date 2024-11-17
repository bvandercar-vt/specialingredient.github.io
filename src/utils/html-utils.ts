const MOBILE_WIDTH = 800

export function isScrolledToTop(element: Pick<HTMLElement, 'scrollTop'>, offset = 0) {
  return element.scrollTop < offset
}

export function isScrolledToBottom(
  element: Pick<HTMLElement, 'scrollTop' | 'scrollHeight' | 'offsetHeight'>,
  offset = 0,
) {
  return element.scrollTop > element.scrollHeight - element.offsetHeight - offset
}

export function isScrollableY(element: Pick<HTMLElement, 'scrollHeight' | 'clientHeight'>) {
  return element.scrollHeight > element.clientHeight
}

export function getWindowWidth() {
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
}

export function getIsMobile() {
  return getWindowWidth() < MOBILE_WIDTH
}

export function htmlToElement(html: string) {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  return template.content.firstChild
}

export function triggerClick(event: React.KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.target?.dispatchEvent(new MouseEvent('click', { ...event, view: undefined }))
  }
}
