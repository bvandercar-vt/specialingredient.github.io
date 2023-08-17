
export type SoundCloud = {
    // https://developers.soundcloud.com/docs/api/sdks#javascript
    initialize(options: { client_id: string, redirect_uri?: string, oauth_token?: string }): void,
    // connect(options: { client_id: string, redirect_uri?: string, oauth_token?: string }): void,

    // get(path: string): Promise<string> // TODO: improve type, if ever used
    // post(path: string): Promise<string> // TODO: improve type, if ever used
    // put(path: string): Promise<string> // TODO: improve type, if ever used
    // delete(path: string): Promise<void> // TODO: improve type, if ever used
    // upload(path: string): Promise<string> // TODO: improve type, if ever used

    // stream(path: string): Promise<string> // TODO: improve type, if ever used
    oEmbed(url: string, params: { auto_play?: boolean, element?: HTMLElement, maxheight?: number }): Promise<{
        title: string,
        thumbnail_url: string,
        html: string,
        description: string,
    }>
}


const { SC: soundCloud } = window as unknown as { SC: SoundCloud }

export { soundCloud }


