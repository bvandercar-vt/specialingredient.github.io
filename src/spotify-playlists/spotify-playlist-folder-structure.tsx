import spotifyPlaylistInfo from '../../spotify-playlists.json'
import type { TreeNode } from '../components/Tree'

const spotifyPlaylistFoldersRaw = [
  {
    folderName: 'Chill Electronic',
    items: [
      'Chill Electronic',
      'Vibey Future Bass',
      'Mellow Electronic',
      //
    ],
  },
  {
    folderName: 'Heaver Dubstep / Bass',
    items: [
      'Proper Brostep',
      'Hardest Crunchy Briddim',
      'Hardest Hybrid Trap & Breaks',
      'Harder Brosteppy Riddim',
      'Wonky Monxxy Riddim',
      'Marchy Mechanical Riddim',
      'True OG Deeper Riddim',
      'Melodic Riddim',
      'Groovy MonkeyStep',
      'Hard Midtempo (Rezz)',
      // 'Party Trap'
    ],
  },
  {
    folderName: 'Vibey Hype Dubstep',
    items: [
      'Hypest Melodic Dubstep & Future Bass',
      'Harder Wavey Experimental & Dubstep',
      'Old Sounding Dubstep',
    ],
  },
  {
    folderName: 'Glitch-Hop',
    items: [
      'Groovy Funky Breaks',
      'Vibey Experimental Breaks',
      //
    ],
  },
  {
    folderName: 'Late Night Bass',
    items: [
      'Deep Dubstep',
      'Wave Dubstep',
      'Trippy Nasty Wavey',
      'Psydub & Squelches',
      'Trippy CTF Downtempo',
      'Deeper Stanky Space Bass',
      'Noisier Stanky Space Bass',
    ],
  },
  {
    folderName: 'DnB',
    items: [
      'Neurofunk & Heavier DnB',
      'Spacey DnB',
      'Vibey DnB & Liquid DnB',
      //
    ],
  },
  {
    folderName: 'House, Techno, Trance',
    items: [
      'Hardest Bass House',
      'Nightbass/Confession Type House',
      'Clubby Tech House',
      'Upbeat Poppy House',
      'Disco House',
      'Chill House',
      'Progressive House',
      'Tribal House',
      'Psytrance',
      'Trance',
      'Eurodance',
      'Hardstyle',
      'Big Room House',
      'Moombahton',
    ],
  },
  {
    folderName: 'Rap & Hip-Hop / Pop',
    items: [
      'Rap Hits',
      // 'Ignant Hype Rap',
      // 'Ignant LowerKey Rap',
      'Upbeat Newer Rap',
      'Hip-Hop Classics',
      'R&B',
      'Throwback Pop',
    ],
  },
  {
    folderName: 'Rock',
    items: [
      'Psychedelic Rock, Blues Rock, Folk Rock',
      'Acoustic & Mellow',
      'Indie Rock',
      'Surf Rock',
      'Pop Rock',
      'Grunge & Throwback Hard Rock',
      'Screamo/Metal Throwbacks',
      'Pop Punk',
      'Classic Rock',
      // 'Oldies',
      // "Country",
    ],
  },
  {
    folderName: 'Reggae',
    items: [
      'Reggae & Dancehall',
      'Reggae-Rock',
      // 'Beachy Hip-Hop',
    ],
  },
  {
    folderName: 'Funk & Disco',
    items: [
      'Funky Retro Grooves',
      //
    ],
  },
] satisfies Array<{ folderName: string; items: string[] }>

export function getSpotifyPlaylistFolderTreeNodes(): TreeNode[] {
  return spotifyPlaylistFoldersRaw.map(({ folderName, items }, index) => ({
    rightElement: index === 0 ? `# tracks` : undefined,
    classes: 'folder',
    leftIcon: 'fa-folder-open',
    text: folderName,
    nodes: items.map((item) => {
      const playlistInfo = spotifyPlaylistInfo.find(({ name }) => name == item)
      if (!playlistInfo) throw new Error(`no playlist info with name ${item}`)

      let tooltip: React.ReactNode
      if (playlistInfo.public) {
        if (playlistInfo.description) {
          tooltip = <>{playlistInfo.description}</>
        }
      } else {
        tooltip = (
          <span>
            {playlistInfo.description}
            {playlistInfo.description && <br />}
            <i>- Private Playlist -</i>
          </span>
        )
      }

      return {
        text: playlistInfo.name,
        tooltip,
        rightElement: String(playlistInfo.track_count),
        url: playlistInfo.public ? playlistInfo.url : undefined,
        classes: playlistInfo.public ? ['item'] : ['item', 'item-disabled'],
      } satisfies TreeNode
    }),
  }))
}
