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

function getWindowWidth() {
    return window.innerWidth || document.documentElement.clientWidth ||
        document.body.clientWidth;
}

function isMobile() {
    return getWindowWidth() < MOBILE_WIDTH
}

function init() {
    // All anchors
    const allAnchors = document.getElementsByTagName("a")
    Array.from(allAnchors).forEach((el) => {
        // Open in new tab
        el.target = "_blank"
        el.rel = "noreferrer noopener"
    })

    // Soundcloud stuff
    SC.initialize({
        client_id: 'DgFeY88vapbGCcK7RrT2E33nmNQVWX82'
    });

    Array.from(document.getElementsByClassName("transform-to-sc-item")).forEach((el) => {
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
            const trackWrapper = document.createElement("div")
            trackWrapper.classList = "track-wrapper"

            const titleWrapper = document.createElement("div")
            titleWrapper.classList = "track-title-wrapper"
            const titleStr = el.getAttribute("data-title") ? el.getAttribute("data-title") :
                oEmbed.title.replaceAll(' by Special Ingredient', '')
                    .replaceAll('[w TRACKLIST]', '')
                    .replaceAll('[MASHUP]', '')
            const titleElement = document.createElement("span")
            titleElement.classList = "track-title"
            titleElement.appendChild(document.createTextNode(titleStr))
            titleWrapper.appendChild(titleElement)

            const genreDescription = el.getAttribute("data-genre-desc")
            if (genreDescription) {
                const genreDescriptionElement = document.createElement("span")
                genreDescriptionElement.classList = "track-genre-description"
                genreDescriptionElement.appendChild(document.createTextNode(" (" + genreDescription + ")"))
                titleWrapper.appendChild(genreDescriptionElement)
            }

            trackWrapper.appendChild(titleWrapper)

            const addlDescription = el.getAttribute("data-addl-desc") ? el.getAttribute("data-addl-desc") : oEmbed.description
            if (addlDescription) {
                const addlDescriptionElement = document.createElement("p")
                addlDescriptionElement.classList = "track-addl-description"
                addlDescriptionElement.appendChild(document.createTextNode(addlDescription))
                trackWrapper.appendChild(addlDescriptionElement)
            }

            /** @type {HTMLIframeElement} */
            const iframeElement = htmlToElement(oEmbed.html)
            iframeElement.title = titleStr
            iframeElement.src += "&auto_play=false&hide_related=false&show_comments=true&show_user=false&show_reposts=true&show_teaser=false&visual=true"
            trackWrapper.appendChild(iframeElement)

            const privacyPolicyCoverElement = document.createElement("div")
            privacyPolicyCoverElement.classList = "privacy-policy-cover"
            trackWrapper.appendChild(privacyPolicyCoverElement)

            el.replaceWith(trackWrapper)
        });
    })

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
    Array.from(playlistTitles).forEach((
        /** @type {HTMLDivElement} */
        playlistTitle) => {
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


    // Scrollable playlists
    const scrollRegions = document.getElementsByClassName("scroll")

    Array.from(scrollRegions).forEach((scrollRegion) => {
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

window.onload = init