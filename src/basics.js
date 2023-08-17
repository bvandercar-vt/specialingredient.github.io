const MOBILE_WIDTH = 800

export function isScrolledToTop(element, offset = 0) {
    return element.scrollTop < offset
}

export function isScrolledToBottom(element, offset = 0) {
    return element.scrollTop > (element.scrollHeight - element.offsetHeight - offset)
}

export function isScrollableY(element) {
    return element.scrollHeight > element.clientHeight
}

export function getWindowWidth() {
    return window.innerWidth || document.documentElement.clientWidth ||
        document.body.clientWidth;
}

export function isMobile() {
    return getWindowWidth() < MOBILE_WIDTH
}

export function htmlToElement(html) {
    var template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
}

export function waitForElements(
    /** @type {() => NodeListOf<any>} */
    checkFunction,
    /** @type {number} */
    expectedLength) {
    return new Promise(resolve => {
        const items = checkFunction()
        if (items.length === expectedLength) {
            return resolve(items);
        }

        const observer = new MutationObserver(mutations => {
            const items = checkFunction()
            if (items.length === expectedLength) {
                resolve(items);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}