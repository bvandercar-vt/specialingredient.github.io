import './styles/index.css'
import { htmlToElement, isScrolledToTop, isScrolledToBottom, isScrollableY, isMobile, waitForElements } from './basics'
import { SoundCloud, soundCloud } from './soundcloud'
const Classes = {
    OPEN: 'open',
    HIDDEN: 'hidden',
    COLLAPSE_CARET: 'collapse-caret',
    PLAYLIST_TITLE: "playlist-title",
    PLAYLIST_ITEMS: 'playlist-items',
    TRANSFORM_TO_SC_ITEM: "transform-to-sc-item",
    TRACK_WRAPPER: "track-wrapper",
    TRACK_TITLE: "track-title",
    TRACK_GENRE_DESC: "track-genre-description",
    TRACK_ADDL_DESC: "track-addl-description",
    PRIVACY_POLICY_COVER: "privacy-policy-cover",
    SCROLL_ARROW: "scroll-arrow",
    SCROLL_ARROW_UP: "scroll-arrow-up",
    SCROLL_ARROW_DOWN: "scroll-arrow-down"
} as const



function setPlaylistTitlesCollapsable() {
    function setCollapsed(collapsed: boolean, playlistTitleEl: HTMLDivElement) {
        const parentElement = playlistTitleEl.parentElement!
        const collapseContent = parentElement.getElementsByClassName(Classes.PLAYLIST_ITEMS)[0]
        const collapseArrow = parentElement.getElementsByClassName(Classes.COLLAPSE_CARET)[0]
        if (collapsed) {
            collapseContent.classList.add(Classes.HIDDEN)
            collapseArrow.classList.remove(Classes.OPEN)
        } else {
            collapseContent.classList.remove(Classes.HIDDEN)
            collapseArrow.classList.add(Classes.OPEN)
        }
    }

    // Collapsable titles
    const playlistTitles = document.getElementsByClassName(Classes.PLAYLIST_TITLE) as HTMLCollectionOf<HTMLDivElement>
    Array.from(playlistTitles).forEach((playlistTitle) => {
        const collapseArrow = document.createElement("span")
        collapseArrow.classList.add(`fa`, `fa-lg`, `fa-caret-down`, Classes.COLLAPSE_CARET)
        playlistTitle.appendChild(collapseArrow)
        setCollapsed(isMobile(), playlistTitle)

        playlistTitle.addEventListener("click", function () {
            const collapseContent = this.parentElement!.getElementsByClassName(Classes.PLAYLIST_ITEMS)[0]
            const isCollapsed = collapseContent.classList.contains(Classes.HIDDEN)
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

async function setScTracksElements(soundCloud: SoundCloud) {
    const transformItems = document.getElementsByClassName(Classes.TRANSFORM_TO_SC_ITEM)
    Array.from(transformItems).forEach((el) => {
        soundCloud.oEmbed(el.getAttribute("data-sc-link")!, { auto_play: false, maxheight: 150 }).then((oEmbed) => {
            const titleStr = el.getAttribute("data-title") ?? oEmbed.title.replaceAll(' by Special Ingredient', '').replaceAll('[w TRACKLIST]', '').replaceAll('[MASHUP]', '')
            const genreDescription = el.getAttribute("data-genre-desc")
            const addlDescription = el.getAttribute("data-addl-desc")

            const trackWrapper = document.createElement("div")
            trackWrapper.classList.add(Classes.TRACK_WRAPPER)

            const titleElement = document.createElement("p")
            titleElement.classList.add(Classes.TRACK_TITLE)
            // if (!genreDescription) titleElement.classList.add("track-genre-description")
            titleElement.appendChild(document.createTextNode(titleStr))
            trackWrapper.appendChild(titleElement)


            if (genreDescription) {
                const genreDescriptionElement = document.createElement("p")
                genreDescriptionElement.classList.add(Classes.TRACK_GENRE_DESC)
                genreDescriptionElement.appendChild(document.createTextNode(genreDescription))
                trackWrapper.appendChild(genreDescriptionElement)
            }

            if (addlDescription) {
                const addlDescriptionElement = document.createElement("p")
                addlDescriptionElement.classList.add(Classes.TRACK_ADDL_DESC)
                const addlDescriptionTxt = addlDescription === "GET_FROM_SC" ? oEmbed.description : addlDescription
                addlDescriptionElement.appendChild(document.createTextNode(addlDescriptionTxt))
                trackWrapper.appendChild(addlDescriptionElement)
            }

            /** @type {HTMLIframeElement} */
            const iframeElement = htmlToElement(oEmbed.html) as HTMLIFrameElement
            iframeElement.title = titleStr
            const url = new URL(iframeElement.src)
            url.searchParams.set('auto_play', String(false))
            url.searchParams.set('hide_related', String(false))
            url.searchParams.set('show_comments', String(true))
            url.searchParams.set('show_user', String(false))
            url.searchParams.set('show_reposts', String(true))
            url.searchParams.set('show_teaser', String(false))
            url.searchParams.set('visual', String(true))// true =  artwork behind waveform, false = artwork to left
            url.searchParams.set('show_artwork', String(true)) // want true, unless no artwork
            iframeElement.src = url.href
            trackWrapper.appendChild(iframeElement)

            const privacyPolicyCoverElement = document.createElement("div")
            privacyPolicyCoverElement.classList.add(Classes.PRIVACY_POLICY_COVER)
            trackWrapper.appendChild(privacyPolicyCoverElement)

            el.replaceWith(trackWrapper)
        });
    })


    await waitForElements(() => document.getElementsByClassName(Classes.TRACK_WRAPPER), transformItems.length)
}

function setPlaylistsScrollable() {
    const scrollRegions = document.getElementsByClassName(Classes.PLAYLIST_ITEMS)
    Array.from(scrollRegions).forEach((scrollRegion) => {
        if (!isScrollableY(scrollRegion)) return

        const ARROW_BTN_CLICK_SCROLL_DIST = 150

        const upDiv = document.createElement("div")
        upDiv.classList.add(Classes.SCROLL_ARROW, Classes.SCROLL_ARROW_UP, 'fa', 'fa-caret-up', 'fa-2x')
        upDiv.addEventListener("click", function () {
            scrollRegion.scrollTo({ top: scrollRegion.scrollTop - ARROW_BTN_CLICK_SCROLL_DIST, behavior: 'smooth' })
        })

        const downDiv = document.createElement("div")
        downDiv.classList.add(Classes.SCROLL_ARROW, Classes.SCROLL_ARROW_DOWN, 'fa', 'fa-caret-down', 'fa-2x')
        downDiv.addEventListener("click", function () {
            scrollRegion.scrollTo({ top: scrollRegion.scrollTop + ARROW_BTN_CLICK_SCROLL_DIST, behavior: 'smooth' })
        })

        scrollRegion.insertBefore(upDiv, scrollRegion.firstChild);
        scrollRegion.appendChild(downDiv);

        scrollRegion.addEventListener("scroll", function (event) {
            const thisScrollRegion = event.target as HTMLDivElement
            const upArrow = thisScrollRegion.getElementsByClassName(Classes.SCROLL_ARROW_UP)[0] as HTMLDivElement
            const downArrow = thisScrollRegion.getElementsByClassName(Classes.SCROLL_ARROW_DOWN)[0] as HTMLDivElement

            upArrow.style.display = isScrolledToTop(thisScrollRegion, 50) ? "none" : "inherit"
            downArrow.style.display = isScrolledToBottom(thisScrollRegion, 50) ? "none" : "inherit"
        });
    })
}


async function init() {
    // All anchors should open in NEW TAB
    Array.from(document.getElementsByTagName("a")).forEach((el) => {
        el.target = "_blank"
        el.rel = "noreferrer noopener"
    })

    setPlaylistTitlesCollapsable()

    // Soundcloud stuff
    soundCloud.initialize({ client_id: 'DgFeY88vapbGCcK7RrT2E33nmNQVWX82' });

    await setScTracksElements(soundCloud)

    setPlaylistsScrollable()
}

init()
