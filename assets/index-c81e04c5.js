const C="DgFeY88vapbGCcK7RrT2E33nmNQVWX82";function L(t,e){return new Promise((a,r)=>{var s=new XMLHttpRequest;s.open(t,e),s.onload=()=>s.status>=200&&s.status<300?a(JSON.parse(s.response)):r({status:s.status,statusText:s.statusText}),s.onerror=()=>r({status:s.status,statusText:s.statusText}),s.send()})}function _(t){const e=new URL("https://soundcloud.com/oembed");e.searchParams.set("client_id",C);for(const[a,r]of Object.entries(t))r!==void 0&&e.searchParams.set(a,String(r));return L("GET",e.href)}const h=800;function A(t,e=0){return t.scrollTop<e}function f(t,e=0){return t.scrollTop>t.scrollHeight-t.offsetHeight-e}function S(t){return t.scrollHeight>t.clientHeight}function R(){return window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth}function p(){return R()<h}function T(t){const e=document.createElement("template");return e.innerHTML=t.trim(),e.content.firstChild}function g(t,e){return new Promise(a=>{const r=t();if(r.length===e)return a(r);const s=new MutationObserver(()=>{const o=t();o.length===e&&(a(o),s.disconnect())});s.observe(document.body,{childList:!0,subtree:!0})})}function O(t){(t.key==="Enter"||t.key===" ")&&t.target?.dispatchEvent(new MouseEvent("click",{...t,view:void 0}))}const n={OPEN:"open",HIDDEN:"hidden",COLLAPSE_CARET:"collapse-caret",PLAYLIST_TITLE:"playlist-title",FIXED_TOP:"fixed-top",PLAYLIST_ITEMS:"playlist-items",TRANSFORM_TO_SC_ITEM:"transform-to-sc-item",TRACK_WRAPPER:"track-wrapper",TRACK_TITLE:"track-title",TRACK_GENRE_DESC:"track-genre-description",TRACK_ADDL_DESC:"track-addl-description",PRIVACY_POLICY_COVER:"privacy-policy-cover",SCROLL_ARROW:"scroll-arrow",SCROLL_ARROW_UP:"scroll-arrow-up",SCROLL_ARROW_DOWN:"scroll-arrow-down"};function u(t,e){const a=t.parentElement,r=a.getElementsByClassName(n.PLAYLIST_ITEMS)[0],s=a.getElementsByClassName(n.COLLAPSE_CARET)[0];r.classList.toggle(n.HIDDEN,e),s.classList.toggle(n.OPEN,!e),t.classList.toggle(n.FIXED_TOP,!e)}function P(){const t=document.getElementsByClassName(n.PLAYLIST_TITLE);Array.from(t).forEach(e=>{e.setAttribute("tabIndex",String(0)),e.addEventListener("keypress",O);const a=document.createElement("span");a.classList.add("fa","fa-lg","fa-caret-down",n.COLLAPSE_CARET),e.appendChild(a),u(e,p()),e.addEventListener("click",()=>{const r=e.parentElement,o=r.getElementsByClassName(n.PLAYLIST_ITEMS)[0].classList.contains(n.HIDDEN);u(e,!o),o&&(r.scrollIntoView({behavior:"smooth",block:"end"}),p()&&Array.from(t).forEach(c=>{c!==e&&u(c,!0)}))})})}async function w(){const t=document.getElementsByClassName(n.TRANSFORM_TO_SC_ITEM);Array.from(t).forEach(e=>_({url:e.getAttribute("data-sc-link"),maxheight:150,auto_play:!1}).then(a=>{const r=e.getAttribute("data-title")??a.title.replaceAll(" by Special Ingredient","").replaceAll("[w TRACKLIST]","").replaceAll("[MASHUP]",""),s=e.getAttribute("data-genre-desc"),o=e.getAttribute("data-addl-desc"),c=o==="GET_FROM_SC"?a.description:o,l=document.createElement("div");if(l.classList.add(n.TRACK_WRAPPER),r){const d=document.createElement("p");d.classList.add(n.TRACK_TITLE),d.appendChild(document.createTextNode(r)),l.appendChild(d)}if(s){const d=document.createElement("p");d.classList.add(n.TRACK_GENRE_DESC),d.appendChild(document.createTextNode(s)),l.appendChild(d)}if(c){const d=document.createElement("p");d.classList.add(n.TRACK_ADDL_DESC),d.appendChild(document.createTextNode(c)),l.appendChild(d)}const m=T(a.html);m.title=r;const i=new URL(m.src);i.searchParams.set("auto_play",String(!1)),i.searchParams.set("hide_related",String(!1)),i.searchParams.set("show_comments",String(!0)),i.searchParams.set("show_user",String(!1)),i.searchParams.set("show_reposts",String(!0)),i.searchParams.set("show_teaser",String(!1)),i.searchParams.set("visual",String(!0)),i.searchParams.set("show_artwork",String(!0)),m.src=i.href,l.appendChild(m);const E=document.createElement("div");E.classList.add(n.PRIVACY_POLICY_COVER),l.appendChild(E),e.replaceWith(l)})),await g(()=>document.getElementsByClassName(n.TRACK_WRAPPER),t.length)}function I(){const t=document.getElementsByClassName(n.PLAYLIST_ITEMS);Array.from(t).forEach(e=>{if(!S(e))return;const a=150,r=[n.SCROLL_ARROW,"fa","fa-2x"],s=document.createElement("div");s.classList.add(...r,n.SCROLL_ARROW_UP,"fa-caret-up"),s.addEventListener("click",()=>{const c=e.scrollTop-a;e.scrollTo({top:c<40?0:c,behavior:"smooth"})});const o=document.createElement("div");o.classList.add(...r,n.SCROLL_ARROW_DOWN,"fa-caret-down"),o.addEventListener("click",()=>{const c=e.scrollTop+a;e.scrollTo({top:c,behavior:"smooth"})}),e.insertBefore(s,e.firstChild),e.appendChild(o),e.addEventListener("scroll",c=>{const l=c.target,m=l.getElementsByClassName(n.SCROLL_ARROW_UP)[0],i=l.getElementsByClassName(n.SCROLL_ARROW_DOWN)[0];m.style.display=A(l,50)?"none":"inherit",i.style.display=f(l,50)?"none":"inherit"})})}async function y(){Array.from(document.getElementsByTagName("a")).forEach(t=>{t.target="_blank",t.rel="noreferrer noopener"}),P(),await w(),I()}y();
