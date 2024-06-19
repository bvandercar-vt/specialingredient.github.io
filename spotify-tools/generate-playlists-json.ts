import fs from 'vite-plugin-fs/browser'
import { sdk } from './spotify'

const { display_name } = await sdk.currentUser.profile()

sdk.getAllPlaylists().then((playlists) => {
  const data = playlists
    .filter(({ owner }) => owner.display_name === display_name)
    .map((pl) => ({
      name: pl.name,
      id: pl.id,
      url: pl.external_urls.spotify,
      track_count: pl.tracks?.total,
      description: pl.description,
      public: pl.public,
    }))
  fs.writeFile('spotify-playlists.json', JSON.stringify(data, null, 2))
})
