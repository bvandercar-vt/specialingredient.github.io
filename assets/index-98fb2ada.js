const s={OPEN:"open",HIDDEN:"hidden",DISPLAY_NONE:"display-none",GRID_CARD:"grid-card",CARD_TITLE:"card-title",COLLAPSE_CARET:"collapse-caret",CARD_COLLAPSE_CONTENT:"collapse-content",SCROLL_ARROW:"scroll-arrow",TRANSFORM_TO_SC_ITEM:"transform-to-sc-item",TRACK_WRAPPER:"track-wrapper",SC_IFRAME_WRAPPER:"sc-iframe-wrapper",TRACK_TITLE:"track-title",TRACK_GENRE_DESC:"track-genre-description",TRACK_ADDL_DESC:"track-addl-description",PRIVACY_POLICY_COVER:"privacy-policy-cover",TREE:"tree",LEFT_ICON:"left-icon",RIGHT_SIDE:"right-side",FOLDER_TREE:"folder-tree",TOOLTIP:"tooltip",TOOLTIP_TEXT:"tooltiptext"},A=145;function _(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var m=Array.isArray,T=m,L=T;function h(){if(!arguments.length)return[];var t=arguments[0];return L(t)?t:[t]}var O=h;const E=_(O),y=800;function p(t,n=0){return t.scrollTop<n}function C(t,n=0){return t.scrollTop>t.scrollHeight-t.offsetHeight-n}function N(t){return t.scrollHeight>t.clientHeight}function S(){return window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth}function d(){return S()<y}function f(t,{attributes:n,classes:i,onClick:e,children:a=[]}={}){const r=document.createElement(t);return n&&Object.entries(n).forEach(([o,c])=>r.setAttribute(o,c)),i&&r.classList.add(...E(i)),e&&r.addEventListener("click",e),E(a).forEach(o=>{o!==void 0&&(typeof o=="string"?r.appendChild(document.createTextNode(o)):r.appendChild(o))}),r}function g(t){(t.key==="Enter"||t.key===" ")&&t.target?.dispatchEvent(new MouseEvent("click",{...t,view:void 0}))}function D(t,n){new MutationObserver(i=>{i.forEach(e=>{e.type==="attributes"&&e.attributeName==="class"&&n()})}).observe(t,{attributes:!0})}function I(){function t(e){return e.classList.contains(s.HIDDEN)}function n(e,a){const r=e.parentElement,o=r.getElementsByClassName(s.CARD_COLLAPSE_CONTENT)[0],c=r.getElementsByClassName(s.COLLAPSE_CARET)[0];o.classList.toggle(s.HIDDEN,a),c.classList.toggle(s.OPEN,!a)}const i=Array.from(document.getElementsByClassName(s.CARD_TITLE));i.forEach(e=>{n(e,d()),e.setAttribute("role","button"),e.setAttribute("tabIndex",String(0)),e.addEventListener("keypress",g),e.addEventListener("click",async()=>{const a=e.parentElement,r=a.getElementsByClassName(s.CARD_COLLAPSE_CONTENT)[0],o=t(r);n(e,!o),o&&(u(r),a.scrollIntoView({behavior:"smooth",block:"start"}),d()&&i.forEach(c=>{c!==e&&n(c,!0)}))})})}function u(t){if(!N(t)||t.parentElement.getElementsByClassName(s.SCROLL_ARROW).length>0)return;const n=150,i=100,e=[s.SCROLL_ARROW,"fa","fa-2x"],a=f("div",{classes:[...e,"fa-caret-up"],onClick:()=>{const l=t.scrollTop-n;t.scrollTo({top:p({scrollTop:l},i)?0:l,behavior:"smooth"})}}),r=f("div",{classes:[...e,"fa-caret-down"],onClick:()=>{const l=t.scrollTop+n;t.scrollTo({top:C({scrollHeight:t.scrollHeight,offsetHeight:t.offsetHeight,scrollTop:l},i)?t.scrollHeight:l,behavior:"smooth"})}});t.parentElement.insertBefore(a,t),t.parentElement.appendChild(r);const o=5;a.style.top=t.offsetTop+o+"px",r.style.top=t.offsetTop+t.getBoundingClientRect().height-r.getBoundingClientRect().height-o+"px";function c(){a.classList.toggle(s.DISPLAY_NONE,p(t,50)),r.classList.toggle(s.DISPLAY_NONE,C(t,50))}c(),t.addEventListener("scroll",c),D(t,c)}function w(){I(),document.documentElement.style.setProperty("--iframe-height",`${A}px`);const t=()=>document.documentElement.style.setProperty("--app-height",`${window.innerHeight}px`);window.addEventListener("resize",t),t(),Array.from(document.getElementsByClassName(s.CARD_COLLAPSE_CONTENT)).forEach(n=>u(n))}w();
