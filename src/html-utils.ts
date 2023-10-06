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

export function isMobile() {
  return getWindowWidth() < MOBILE_WIDTH
}

export function createElement<T extends keyof HTMLElementTagNameMap>(
  tagName: T,
  {
    attributes,
    classes,
    onClick,
    children = [],
  }: {
    attributes?: Record<string, string>
    classes?: string[]
    onClick?: () => void
    children?: (Node | string | undefined)[]
  } = {},
) {
  const element = document.createElement(tagName)

  if (attributes) {
    Object.entries(attributes).forEach(([attribute, value]) =>
      element.setAttribute(attribute, value),
    )
  }

  if (classes) {
    element.classList.add(...classes)
  }

  if (onClick) {
    element.addEventListener('click', onClick)
  }

  children.forEach((child) => {
    if (child === undefined) return
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child))
    } else {
      element.appendChild(child)
    }
  })

  return element
}

export function toNode(item: string | Node) {
  return typeof item == 'string' ? document.createTextNode(item) : item
}

export function htmlToElement(html: string) {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  return template.content.firstChild
}

export function waitForElements(
  checkFunction: () => HTMLCollectionOf<Element>,
  expectedLength: number,
) {
  return new Promise((resolve) => {
    const items = checkFunction()
    if (items.length === expectedLength) {
      return resolve(items)
    }

    const observer = new MutationObserver(() => {
      const items = checkFunction()
      if (items.length === expectedLength) {
        resolve(items)
        observer.disconnect()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })
}

export function triggerClick(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.target?.dispatchEvent(new MouseEvent('click', { ...event, view: undefined }))
  }
}

export function onClassChange(element: Element, func: () => void) {
  new MutationObserver((mutationList) => {
    mutationList.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        func()
      }
    })
  }).observe(element, { attributes: true })
}
