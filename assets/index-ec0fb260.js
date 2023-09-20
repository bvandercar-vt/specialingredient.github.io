const n={OPEN:"open",HIDDEN:"hidden",GRID_CARD:"grid-card",CARD_TITLE:"card-title",COLLAPSE_CARET:"collapse-caret",CARD_COLLAPSE_CONTENT:"collapse-content",FIXED_TOP:"fixed-top",TRANSFORM_TO_SC_ITEM:"transform-to-sc-item",TRACK_WRAPPER:"track-wrapper",TRACK_TITLE:"track-title",TRACK_GENRE_DESC:"track-genre-description",TRACK_ADDL_DESC:"track-addl-description",PRIVACY_POLICY_COVER:"privacy-policy-cover",SCROLL_ARROW:"scroll-arrow",SCROLL_ARROW_UP:"scroll-arrow-up",SCROLL_ARROW_DOWN:"scroll-arrow-down"},_=800;function p(e,t=0){return e.scrollTop<t}function A(e,t=0){return e.scrollTop>e.scrollHeight-e.offsetHeight-t}function R(e){return e.scrollHeight>e.clientHeight}function O(){return window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth}function C(){return O()<_}function E(e,{attributes:t,classes:o,onClick:r}={}){const s=document.createElement(e);return t&&Object.entries(t).forEach(([i,c])=>s.setAttribute(i,c)),o&&s.classList.add(...o),r&&s.addEventListener("click",r),s}function f(e){(e.key==="Enter"||e.key===" ")&&e.target?.dispatchEvent(new MouseEvent("click",{...e,view:void 0}))}function a(e,t){const o=e.parentElement,r=o.getElementsByClassName(n.CARD_COLLAPSE_CONTENT)[0],s=o.getElementsByClassName(n.COLLAPSE_CARET)[0];r.classList.toggle(n.HIDDEN,t),s.classList.toggle(n.OPEN,!t),e.classList.toggle(n.FIXED_TOP,!t)}function m(){const e=Array.from(document.getElementsByClassName(n.CARD_TITLE));e.forEach(t=>{a(t,C()),t.setAttribute("role","button"),t.setAttribute("tabIndex",String(0)),t.addEventListener("keypress",f),t.addEventListener("click",()=>{const o=t.parentElement,s=o.getElementsByClassName(n.CARD_COLLAPSE_CONTENT)[0].classList.contains(n.HIDDEN);a(t,!s),s&&(o.scrollIntoView({behavior:"smooth",block:"end"}),C()&&e.forEach(i=>{i!==t&&a(i,!0)}))})}),window.addEventListener("resize",()=>{e.forEach(t=>{a(t,C())})},!0)}function u(){const e=document.getElementsByClassName(n.CARD_COLLAPSE_CONTENT);Array.from(e).forEach(t=>{if(!R(t))return;const o=150,r=[n.SCROLL_ARROW,"fa","fa-2x"],s=E("div",{classes:[...r,n.SCROLL_ARROW_UP,"fa-caret-up"],onClick:()=>{const c=t.scrollTop-o;t.scrollTo({top:c<40?0:c,behavior:"smooth"})}}),i=E("div",{classes:[...r,n.SCROLL_ARROW_DOWN,"fa-caret-down"],onClick:()=>{const c=t.scrollTop+o;t.scrollTo({top:c,behavior:"smooth"})}});t.insertBefore(s,t.firstChild),t.appendChild(i),t.addEventListener("scroll",c=>{const l=c.target,d=l.getElementsByClassName(n.SCROLL_ARROW_UP)[0],L=l.getElementsByClassName(n.SCROLL_ARROW_DOWN)[0];d.style.display=p(l,50)?"none":"inherit",L.style.display=A(l,50)?"none":"inherit"})})}function T(){m(),u();const e=()=>document.documentElement.style.setProperty("--app-height",`${window.innerHeight}px`);window.addEventListener("resize",e),e()}T();
