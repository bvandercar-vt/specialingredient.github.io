import 'font-awesome/css/font-awesome.min.css'
import './styles/index.css'

import './api/soundcloud_player.js'

import { GridBody } from './components/GridBody'
import { Header } from './components/Header'

type ScWidgetEventKeys =
  | 'LOAD_PROGRESS'
  | 'PLAY_PROGRESS'
  | 'PLAY'
  | 'PAUSE'
  | 'FINISH'
  | 'SEEK'
  | 'READY'
  | 'CLICK_DOWNLOAD'
  | 'CLICK_BUY'
  | 'OPEN_SHARE_PANEL'
  | 'ERROR'

declare global {
  interface Window {
    SC: {
      Widget: {
        (el: HTMLIFrameElement | string): {
          play(): void
          pause(): void
          toggle(): void
          bind(eventName: string, listener: () => void): void
          unbind(eventName: string): void
          load(url: string, options: Record<string, unknown>): void
        }
        Events: Record<ScWidgetEventKeys, string>
      }
    }
  }
}

export const App = () => {
  return (
    <>
      {<Header />}
      {<GridBody />}
    </>
  )
}
