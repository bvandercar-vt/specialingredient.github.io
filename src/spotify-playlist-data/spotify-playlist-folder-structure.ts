import type { TreeNode } from '../list-tree'
import spotifyPlaylistInfo from './spotify-playlists.json'

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
      'Trippy Psydub & Breaks',
      'Deeper Stanky Space Bass',
      'Noisier Stanky Space Bass',
    ],
  },
  {
    folderName: 'DnB',
    items: [
      'Neurofunk',
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

export const spotifyPlaylistFolders: TreeNode[] = spotifyPlaylistFoldersRaw.map(
  ({ folderName, items }) => {
    const folderIcon = document.createElement('span')
    folderIcon.classList.add('fa', 'fa-folder-open')

    return {
      class: 'folder',
      text: `${folderIcon.outerHTML} ${folderName}`,
      nodes: items.map((item) => {
        const playlistInfo = spotifyPlaylistInfo.find(({ name }) => name == item)
        if (!playlistInfo) throw new Error(`no playlist info with name ${item}`)
        const divWrapper = document.createElement('div')
        let outerWrapper: HTMLElement = divWrapper

        if (playlistInfo.description) {
          divWrapper.classList.add('tooltip')
          const tooltipText = document.createElement('span')
          tooltipText.classList.add('tooltiptext')
          tooltipText.append(document.createTextNode(playlistInfo.description))
          divWrapper.appendChild(tooltipText)
        }

        divWrapper.appendChild(document.createTextNode(playlistInfo.name))

        const playCount = document.createElement('span')
        playCount.classList.add('playlist-track-count')
        playCount.appendChild(document.createTextNode(playlistInfo.track_count.toString()))
        divWrapper.appendChild(playCount)

        if (playlistInfo.public) {
          const linkWrapper = document.createElement('a')
          linkWrapper.setAttribute('href', playlistInfo.url)
          linkWrapper.setAttribute('target', '_blank')
          linkWrapper.appendChild(divWrapper)
          outerWrapper = linkWrapper
        }

        return {
          class: 'item',
          text: outerWrapper.outerHTML,
        }
      }),
    }
  },
)
