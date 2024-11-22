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
  // incomplete
  artwork_url: string
  caption: string
  comment_count: number
  description: string
  likes_count: number
  permalink_url: string
  playback_count: number
  reposts_count: number
  waveform_url: string
}

declare global {
  interface Window {
    SC: {
      Widget: {
        (el: HTMLIFrameElement | string): {
          play(): void
          pause(): void
          toggle(): void
          bind(eventName: string, listener: (info: Record<string, unknown>) => void): void
          unbind(eventName: string): void
          load(url: string, options: Record<string, unknown>): void
          getCurrentSound(callback: (trackInfo: TrackInfo) => void): TrackInfo
          getPosition(callback: (position: number) => void): number
        }
        Events: Record<ScWidgetEventKeys, string>
      }
    }
  }
}
