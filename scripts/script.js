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

    const linksToTransform = document.getElementsByClassName("transform-to-sc-item")

    Array.from(linksToTransform).forEach((el) => {
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
            iframeElement.src += "&hide_related=false&show_user=false&show_reposts=true&visual=false"
            trackWrapper.appendChild(iframeElement)

            const privacyPolicyCoverElement = document.createElement("div")
            privacyPolicyCoverElement.classList = "privacy-policy-cover"
            trackWrapper.appendChild(privacyPolicyCoverElement)


            el.replaceWith(trackWrapper)

        });
    })

    // Collapsable titles
    const playlistTitles = document.getElementsByClassName("playlist-title");
    Array.from(playlistTitles).forEach((el) => {
        const collapseContent = el.parentElement.getElementsByClassName('playlist-items')[0]
        collapseContent.style.display = getWindowWidth() < MOBILE_WIDTH ? "none" : "block"
        const isCollapsed = collapseContent.style.display === "none"

        const collapseArrow = document.createElement("span")
        collapseArrow.classList = "fa fa-lg collapse-caret"
        collapseArrow.classList.add(isCollapsed ? "fa-caret-right" : "fa-caret-down")
        el.appendChild(collapseArrow)

        el.addEventListener("click", function () {
            const collapseContent = this.parentElement.getElementsByClassName('playlist-items')[0]
            const isCollapsed = collapseContent.style.display === "none"
            if (isCollapsed) {
                collapseContent.style.display = "block";
                collapseArrow.classList.remove("fa-caret-right")
                collapseArrow.classList.add("fa-caret-down")
            } else {
                collapseContent.style.display = "none";
                collapseArrow.classList.add("fa-caret-right")
                collapseArrow.classList.remove("fa-caret-down")
            }
        });
    })


    // Scrollable playlists
    const scrolls = document.getElementsByClassName("scroll")

    Array.from(scrolls).forEach((el) => {
        const ARROW_BTN_CLICK_SCROLL_DIST = 150

        const upDiv = document.createElement("div")
        upDiv.classList = "scroll-arrow scroll-arrow-up fa fa-caret-up fa-2x"
        upDiv.onclick = function () {
            el.scrollTo({ top: el.scrollTop - ARROW_BTN_CLICK_SCROLL_DIST, behavior: 'smooth' })
        }

        const downDiv = document.createElement("div")
        downDiv.classList = "scroll-arrow scroll-arrow-down fa fa-caret-down fa-2x"
        downDiv.onclick = function () {
            el.scrollTo({ top: el.scrollTop + ARROW_BTN_CLICK_SCROLL_DIST, behavior: 'smooth' })
        }

        el.insertBefore(upDiv, el.firstChild);
        el.appendChild(downDiv);

        el.addEventListener("scroll", function (event) {
            /** @type {HTMLDivElement} */
            const scrollableDiv = event.target
            /** @type {HTMLDivElement} */
            const upArrow = scrollableDiv.getElementsByClassName("scroll-arrow-up")[0]
            /** @type {HTMLDivElement} */
            const downArrow = scrollableDiv.getElementsByClassName("scroll-arrow-down")[0]

            upArrow.style.display = isScrolledToTop(scrollableDiv, 50) ? "none" : "inherit"
            downArrow.style.display = isScrolledToBottom(scrollableDiv, 50) ? "none" : "inherit"
        });
    })
}

window.onload = init