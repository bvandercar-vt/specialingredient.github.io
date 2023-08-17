const MOBILE_WIDTH = 800

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function isScrolledToTop(element, offset = 0) {
    return element.scrollTop < offset
}

function isScrolledToBottom(element, offset = 0) {
    return element.scrollTop > (element.scrollHeight - element.offsetHeight - offset)
}

function isScrollableY(element) {
    return element.scrollHeight > element.clientHeight
}

function getWindowWidth() {
    return window.innerWidth || document.documentElement.clientWidth ||
        document.body.clientWidth;
}

function isMobile() {
    return getWindowWidth() < MOBILE_WIDTH
}

function waitForElements(
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

function setPlaylistTitlesCollapsable() {
    function setCollapsed(
        /** @type {boolean} */
        collapsed,
        /** @type {HTMLDivElement} */
        playlistTitleEl) {
        const collapseContent = playlistTitleEl.parentElement.getElementsByClassName('playlist-items')[0]
        const collapseArrow = playlistTitleEl.parentElement.getElementsByClassName('collapse-caret')[0]
        if (collapsed) {
            collapseContent.classList.add('hidden')
            collapseArrow.classList.remove("open")
        } else {
            collapseContent.classList.remove('hidden')
            collapseArrow.classList.add("open")
        }
    }

    // Collapsable titles
    const playlistTitles = document.getElementsByClassName("playlist-title")
    Array.from(playlistTitles).forEach((playlistTitle) => {
        const collapseArrow = document.createElement("span")
        collapseArrow.classList = "fa fa-lg fa-caret-down collapse-caret"
        playlistTitle.appendChild(collapseArrow)
        setCollapsed(isMobile(), playlistTitle)

        playlistTitle.addEventListener("click", function () {
            const collapseContent = this.parentElement.getElementsByClassName('playlist-items')[0]
            const isCollapsed = collapseContent.classList.contains('hidden')
            setCollapsed(!isCollapsed, this)

            if (isMobile() && isCollapsed) {
                Array.from(playlistTitles).forEach((otherPlaylistTitleEl) => {
                    if (otherPlaylistTitleEl !== this) {
                        setCollapsed(true, otherPlaylistTitleEl)
                    }
                })
            }

        });
    })
}

async function setScTracksElements(SC) {
    const transformItems = document.getElementsByClassName("transform-to-sc-item")
    Array.from(transformItems).forEach((el) => {
        SC.oEmbed(el.getAttribute("data-sc-link"), { auto_play: false, maxheight: 150 }).then((
            /**
             * @type { { 
             *      title: string
             *      thumbnail_url: string
             *      html: string 
             *      description: string
             * } } 
             */
            oEmbed) => {
            const titleStr = el.getAttribute("data-title") ?? oEmbed.title.replaceAll(' by Special Ingredient', '').replaceAll('[w TRACKLIST]', '').replaceAll('[MASHUP]', '')
            const genreDescription = el.getAttribute("data-genre-desc")
            const addlDescription = el.getAttribute("data-addl-desc")

            const trackWrapper = document.createElement("div")
            trackWrapper.classList = "track-wrapper"

            const titleElement = document.createElement("p")
            titleElement.classList = "track-title"
            titleElement.appendChild(document.createTextNode(titleStr))
            trackWrapper.appendChild(titleElement)


            if (genreDescription) {
                genreDescriptionElement = document.createElement("p")
                genreDescriptionElement.classList = "track-genre-description"
                genreDescriptionElement.appendChild(document.createTextNode(genreDescription))
                trackWrapper.appendChild(genreDescriptionElement)
            }

            if (addlDescription) {
                const addlDescriptionElement = document.createElement("p")
                addlDescriptionElement.classList = "track-addl-description"
                const addlDescriptionTxt = addlDescription === "GET_FROM_SC" ? oEmbed.description : addlDescription
                addlDescriptionElement.appendChild(document.createTextNode(addlDescriptionTxt))
                trackWrapper.appendChild(addlDescriptionElement)
            }

            /** @type {HTMLIframeElement} */
            const iframeElement = htmlToElement(oEmbed.html)
            iframeElement.title = titleStr
            const url = new URL(iframeElement.src)
            url.searchParams.set('auto_play', false)
            url.searchParams.set('hide_related', false)
            url.searchParams.set('show_comments', true)
            url.searchParams.set('show_user', false)
            url.searchParams.set('show_reposts', true)
            url.searchParams.set('show_teaser', false)
            url.searchParams.set('visual', true) // true =  artwork behind waveform, false = artwork to left
            url.searchParams.set('show_artwork', true) // want true, unless no artwork
            iframeElement.src = url.href
            trackWrapper.appendChild(iframeElement)

            const privacyPolicyCoverElement = document.createElement("div")
            privacyPolicyCoverElement.classList = "privacy-policy-cover"
            trackWrapper.appendChild(privacyPolicyCoverElement)

            el.replaceWith(trackWrapper)
        });
    })

    await waitForElements(() => document.getElementsByClassName('track-wrapper'), transformItems.length)
}

function setPlaylistsScrollable() {
    const scrollRegions = document.getElementsByClassName("playlist-items")
    Array.from(scrollRegions).forEach((scrollRegion) => {
        if (!isScrollableY(scrollRegion)) return

        const ARROW_BTN_CLICK_SCROLL_DIST = 150

        const upDiv = document.createElement("div")
        upDiv.classList = "scroll-arrow scroll-arrow-up fa fa-caret-up fa-2x"
        upDiv.onclick = function () {
            scrollRegion.scrollTo({ top: scrollRegion.scrollTop - ARROW_BTN_CLICK_SCROLL_DIST, behavior: 'smooth' })
        }

        const downDiv = document.createElement("div")
        downDiv.classList = "scroll-arrow scroll-arrow-down fa fa-caret-down fa-2x"
        downDiv.onclick = function () {
            scrollRegion.scrollTo({ top: scrollRegion.scrollTop + ARROW_BTN_CLICK_SCROLL_DIST, behavior: 'smooth' })
        }

        scrollRegion.insertBefore(upDiv, scrollRegion.firstChild);
        scrollRegion.appendChild(downDiv);

        scrollRegion.addEventListener("scroll", function (event) {
            /** @type {HTMLDivElement} */
            const thisScrollRegion = event.target
            /** @type {HTMLDivElement} */
            const upArrow = thisScrollRegion.getElementsByClassName("scroll-arrow-up")[0]
            /** @type {HTMLDivElement} */
            const downArrow = thisScrollRegion.getElementsByClassName("scroll-arrow-down")[0]

            upArrow.style.display = isScrolledToTop(thisScrollRegion, 50) ? "none" : "inherit"
            downArrow.style.display = isScrolledToBottom(thisScrollRegion, 50) ? "none" : "inherit"
        });
    })
}


async function init() {
    // All anchors should open in NEW TAB
    const allAnchors = document.getElementsByTagName("a")
    Array.from(allAnchors).forEach((el) => {
        el.target = "_blank"
        el.rel = "noreferrer noopener"
    })

    setPlaylistTitlesCollapsable()

    // Soundcloud stuff
    SC.initialize({
        client_id: 'DgFeY88vapbGCcK7RrT2E33nmNQVWX82'
    });

    await setScTracksElements(SC)

    setPlaylistsScrollable()
}

window.onload = init