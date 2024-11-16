import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { IFRAME_HEIGHT } from './constants'

// set global css var
document.documentElement.style.setProperty('--iframe-height', `${IFRAME_HEIGHT}px`)

// for iphone window
const setAppHeight = () =>
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
window.addEventListener('resize', setAppHeight)
setAppHeight()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
