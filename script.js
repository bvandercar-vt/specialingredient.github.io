function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
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
            console.log(oEmbed)

            const trackWrapper = document.createElement("div")
            trackWrapper.classList = "track-wrapper"

            const titleWrapper = document.createElement("div")
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
                genreDescriptionElement.appendChild(document.createTextNode(" - " + genreDescription))
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


            // const coverElement = document.createElement("span")
            // coverElement.appendChild(document.createTextNode(oEmbed.description))
            // coverElement.classList = "tooltip-text"
            // trackWrapper.appendChild(coverElement)


            el.replaceWith(trackWrapper)

        });
    })
}

window.onload = init