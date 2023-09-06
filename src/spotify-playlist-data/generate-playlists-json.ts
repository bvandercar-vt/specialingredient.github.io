import { getPlaylists } from '../api/spotify'
import * as fs from 'fs'

getPlaylists().then((playlists) => {
  const data = playlists
    .filter(({ owner }) => owner.display_name === 'Blake Vandercar')
    .map((pl) => ({
      name: pl.name,
      id: pl.id,
      url: pl.external_urls.spotify,
      track_count: pl.tracks.total,
      description: pl.description,
      public: pl.public,
    }))
  fs.writeFileSync(
    `./src/spotify-playlist-data/spotify-playlists.json`,
    JSON.stringify(data, null, 2),
  )
})
