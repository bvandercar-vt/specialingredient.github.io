import { useCallback, useState } from 'react'
import { isMobile as checkIsMobile } from '../utils/html-utils'
import { GridCard, type GridCardProps } from './GridCard'
import { SoundcloudTrack } from './SoundcloudTrack'

export const GridBody = () => {
  const [expandedIndex, setExpandedIndex] = useState<number>()
  const [isMobile, setIsMobile] = useState<boolean>(checkIsMobile())

  const getProps = useCallback(
    (index: number) =>
      isMobile
        ? ({
            onCollapse: (isCollapsed: boolean) => setExpandedIndex(isCollapsed ? index : undefined),
            collapsed: expandedIndex === undefined ? undefined : expandedIndex !== index,
          } satisfies Partial<GridCardProps>)
        : {},
    [isMobile, expandedIndex],
  )

  window.addEventListener(
    'resize',
    () => {
      const isNowMobile = checkIsMobile()
      if (isNowMobile) {
        setExpandedIndex(-1) // collapse all
      }
      setIsMobile(isNowMobile)
    },
    true,
  )

  return (
    <div id="main-grid" role="main" aria-label="Special Ingredient DJ Mixes">
      <GridCard title="Trippy Bass — Wave / Downtempo / Psydub / etc." {...getProps(0)}>
        <SoundcloudTrack
          url="https://soundcloud.com/special-ingredient/plant-life-vol-1?in=special-ingredient/sets/trippy-melty-wavy-bass"
          title="Plant Life Vol. 1"
          genreDescription="Psydub & Trippy Vibey Bass Journey"
        />
        <SoundcloudTrack
          url="https://soundcloud.com/special-ingredient/bass-canyon-late-night-trippy-set-pt-1-back-2-camp?in=special-ingredient/sets/trippy-melty-wavy-bass"
          title="Late Night Set @ Bass Canyon Pt. 1"
          genreDescription="Trippy Melty Genre Journey - Wave, Psydub, Downtempo, etc."
        />
        <SoundcloudTrack
          url="https://soundcloud.com/special-ingredient/bass-canyon-late-night-trippy-set-pt-2?in=special-ingredient/sets/trippy-melty-wavy-bass"
          title="Late Night Set @ Bass Canyon Pt. 2"
          genreDescription="Trippy Melty Genre Journey - Wave, Psydub, Downtempo, etc."
        />
        <SoundcloudTrack
          url="https://soundcloud.com/special-ingredient/plant-life-vol-2?in=special-ingredient/sets/trippy-melty-wavy-bass"
          title="Plant Life Vol. 2"
          genreDescription="Halftime Squelch-Hop & Uptempo Tribal Bass"
        />
      </GridCard>
      <GridCard title="Dubstep & Riddim" {...getProps(1)}>
        <SoundcloudTrack
          url="https://soundcloud.com/special-ingredient/subwoofer-sauce-vol-1?in=special-ingredient/sets/heavier-dubstep"
          title="Subwoofer Sauce Vol. 1"
          genreDescription="OG Deeper Late Night Wonky Riddim"
          additionalDescription="I'm super picky about riddim, so if you're not a fan yet maybe I can bring you to the dark side 😉 Lotta wild sounds bouncing around the 3D space in this one, headphones recommended!"
        />
        <SoundcloudTrack
          url="https://soundcloud.com/special-ingredient/aged-cheddar-mix-vol-1?in=special-ingredient/sets/heavier-dubstep"
          title="Aged Cheddar Vol. 1"
          genreDescription="Early 2010s Wompy Dubstep— Liquid Stranger, Bar9, etc."
          additionalDescription="For this mix, I mainly wanted to capture all my favorite tracks of Liquid Stranger's 2010 album Mechanoid Meltdown, a style that I think is completely unique and unmatched to this day, and fill in with my favorite bangers of the era/sound."
        />
        <SoundcloudTrack
          url="https://soundcloud.com/special-ingredient/special-ingredient-b2b-saumii-larimer-lounge-1-26-2023?in=special-ingredient/sets/heavier-dubstep"
          title="Special Ingredient B2B Saumii @ Larimer Lounge 1/26/2023"
          genreDescription="Multi-Genre Dubstep Journey"
          additionalDescription="Cooked up an extra special bass journey set with Saumii for a sold out crowd at Larimer Lounge, rinsing some of our favorite tracks we've shared over the years of DJing together."
        />
        <SoundcloudTrack
          url="https://soundcloud.com/special-ingredient/bass-kitchen-mix-rage-dubstep-mix-briddim-riddim?in=special-ingredient/sets/heavier-dubstep"
          title="Bass Kitchen Vol. 1"
          genreDescription="Briddim, Riddim, Heavy Dubstep"
          additionalDescription="Wanted to make a heavy mix of newer-style briddim-type dubstep, while also journeying into some deeper genres at times."
        />
      </GridCard>
      <GridCard title="Mashups / Flips" {...getProps(2)}>
        <SoundcloudTrack url="https://soundcloud.com/special-ingredient/meduso-a-moment-vip-x-baby-bash-cyclone?in=special-ingredient/sets/mashups-flips" />
        <SoundcloudTrack url="https://soundcloud.com/special-ingredient/skeler-x-jojo-x-blackstreet-no-diggity-mashup?in=special-ingredient/sets/mashups-flips" />
        <SoundcloudTrack url="https://soundcloud.com/special-ingredient/akon-love-right-now-na-na-na-x-nit-grit-mashup?in=special-ingredient/sets/mashups-flips" />
        <SoundcloudTrack url="https://soundcloud.com/special-ingredient/ian-snow-revelation-x-travis-scott-kid-cudi-through-the-late-night?in=special-ingredient/sets/mashups-flips" />
      </GridCard>
      {/* <GridCard title="Spotify Playlists">
      <div className="collapse-content">
        <div className="playlist-folder-tree"></div>
      </div>
    </GridCard>  */}
    </div>
  )
}
