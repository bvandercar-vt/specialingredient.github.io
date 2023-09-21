const r={OPEN:"open",HIDDEN:"hidden",DISPLAY_NONE:"display-none",GRID_CARD:"grid-card",CARD_TITLE:"card-title",COLLAPSE_CARET:"collapse-caret",CARD_COLLAPSE_CONTENT:"collapse-content",SCROLL_ARROW:"scroll-arrow",SCROLL_ARROW_UP:"scroll-arrow-up",SCROLL_ARROW_DOWN:"scroll-arrow-down",TRANSFORM_TO_SC_ITEM:"transform-to-sc-item",TRACK_WRAPPER:"track-wrapper",TRACK_TITLE:"track-title",TRACK_GENRE_DESC:"track-genre-description",TRACK_ADDL_DESC:"track-addl-description",PRIVACY_POLICY_COVER:"privacy-policy-cover",TREE:"tree",LEFT_ICON:"left-icon",RIGHT_SIDE:"right-side",FOLDER_TREE:"folder-tree",TOOLTIP:"tooltip",TOOLTIP_TEXT:"tooltiptext"},O=800;function d(t,s=0){return t.scrollTop<s}function L(t,s=0){return t.scrollTop>t.scrollHeight-t.offsetHeight-s}function _(t){return t.scrollHeight>t.clientHeight}function u(){return window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth}function E(){return u()<O}function A(t,{attributes:s,classes:i,onClick:e}={}){const o=document.createElement(t);return s&&Object.entries(s).forEach(([n,c])=>o.setAttribute(n,c)),i&&o.classList.add(...i),e&&o.addEventListener("click",e),o}function m(t,s){return new Promise(i=>{const e=t();if(e.length===s)return i(e);const o=new MutationObserver(()=>{const n=t();n.length===s&&(i(n),o.disconnect())});o.observe(document.body,{childList:!0,subtree:!0})})}function p(t){(t.key==="Enter"||t.key===" ")&&t.target?.dispatchEvent(new MouseEvent("click",{...t,view:void 0}))}function R(){function t(e){return e.classList.contains(r.HIDDEN)}function s(e,o){const n=e.parentElement,c=n.getElementsByClassName(r.CARD_COLLAPSE_CONTENT)[0],C=n.getElementsByClassName(r.COLLAPSE_CARET)[0];c.classList.toggle(r.HIDDEN,o),C.classList.toggle(r.OPEN,!o)}const i=Array.from(document.getElementsByClassName(r.CARD_TITLE));i.forEach(e=>{s(e,E()),e.setAttribute("role","button"),e.setAttribute("tabIndex",String(0)),e.addEventListener("keypress",p),e.addEventListener("click",async()=>{const o=e.parentElement,n=o.getElementsByClassName(r.CARD_COLLAPSE_CONTENT)[0],c=t(n);if(s(e,!c),c){if(f(n))await m(()=>n.getElementsByClassName(r.SCROLL_ARROW),2);else{const l=n.getElementsByClassName(r.SCROLL_ARROW);l.length>0&&(a(l[0],!0),a(l[1],!1))}o.scrollIntoView({behavior:"smooth",block:"center"}),E()&&i.forEach(l=>{l!==e&&s(l,!0)})}})}),window.addEventListener("resize",()=>{i.forEach(e=>{s(e,E())})},!0)}function a(t,s){t.classList.toggle(r.DISPLAY_NONE,s)}function f(t){if(!_(t)||t.getElementsByClassName(r.SCROLL_ARROW).length>0)return!1;const s=150,i=100,e=[r.SCROLL_ARROW,"fa","fa-2x"],o=A("div",{classes:[...e,r.SCROLL_ARROW_UP,"fa-caret-up"],onClick:()=>{const c=t.scrollTop-s;t.scrollTo({top:d({scrollTop:c},i)?0:c,behavior:"smooth"})}}),n=A("div",{classes:[...e,r.SCROLL_ARROW_DOWN,"fa-caret-down"],onClick:()=>{const c=t.scrollTop+s;t.scrollTo({top:L({scrollHeight:t.scrollHeight,offsetHeight:t.offsetHeight,scrollTop:c},i)?t.scrollHeight:c,behavior:"smooth"})}});return a(o,!0),a(n,!1),t.insertBefore(o,t.firstChild),t.appendChild(n),t.addEventListener("scroll",()=>{a(o,d(t,50)),a(n,L(t,50))}),!0}function T(){const t=()=>document.documentElement.style.setProperty("--app-height",`${window.innerHeight}px`);window.addEventListener("resize",t),t(),R(),Array.from(document.getElementsByClassName(r.CARD_COLLAPSE_CONTENT)).forEach(s=>f(s))}T();
