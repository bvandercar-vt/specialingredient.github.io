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

export interface TrackInfo extends Record<string, unknown> {
  artwork_url: string
}

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
          getCurrentSound(callback: (trackInfo: TrackInfo) => void): TrackInfo
        }
        Events: Record<ScWidgetEventKeys, string>
      }
    }
  }
}
