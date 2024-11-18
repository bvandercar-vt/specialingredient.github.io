import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

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
