import { useState } from 'react'
import { getIsMobile } from '../utils/html-utils'
import {
  GridCard,
  GridCardContext,
  type CardsExpandedState,
  type IsExpandingState,
} from './GridCard'
import { SoundcloudTrack } from './SoundcloudTrack'

export const GridBody = () => {
  const allowMultiple = !getIsMobile()
  const initiallyOpened = allowMultiple

  const [gridCardStates, setGridCardStates] = useState<CardsExpandedState>()
  const [isExpanding, setIsExpanding] = useState<IsExpandingState>()

  const anyExpanded = gridCardStates?.some((c) => c.expanded)

  return (
    <div id="main-body" role="main" aria-label="DJ Mixes">
      {!anyExpanded && (
        <span id="click-below">
          Click for SoundCloud mixes! <span className="fa fa-arrow-down"></span>
        </span>
      )}
      <div id="main-grid">
        <GridCardContext.Provider
          value={{
            gridCardStates,
            setGridCardStates,
            allowMultiple,
            initiallyOpened,
            isExpanding,
            setIsExpanding,
          }}
        >
          <GridCard title="Wave / Downtempo / Psydub">
            <SoundcloudTrack
              url="https://soundcloud.com/special-ingredient/plant-life-vol-1?in=special-ingredient/sets/trippy-melty-wavy-bass"
              title="Plant Life Vol. 1"
              subTitle="Psydub & Downtempo Bass Journey"
            />
            <SoundcloudTrack
              url="https://soundcloud.com/special-ingredient/bass-canyon-late-night-trippy-set-pt-1-back-2-camp?in=special-ingredient/sets/trippy-melty-wavy-bass"
              title="Late Night Set @ Bass Canyon Pt. 1"
              subTitle="Trippy Genre Journey - Wave, Psydub, Downtempo, etc."
            />
            <SoundcloudTrack
              url="https://soundcloud.com/special-ingredient/bass-canyon-late-night-trippy-set-pt-2?in=special-ingredient/sets/trippy-melty-wavy-bass"
              title="Late Night Set @ Bass Canyon Pt. 2"
              subTitle="Trippy Genre Journey - Wave, Psydub, Downtempo, etc."
            />
            <SoundcloudTrack
              url="https://soundcloud.com/special-ingredient/plant-life-vol-2?in=special-ingredient/sets/trippy-melty-wavy-bass"
              title="Plant Life Vol. 2"
              subTitle="Halftime Squelch-Hop & Uptempo Tribal Bass"
            />
          </GridCard>
          <GridCard title="Dubstep & Riddim">
            <SoundcloudTrack
              url="https://soundcloud.com/special-ingredient/subwoofer-sauce-vol-1?in=special-ingredient/sets/heavier-dubstep"
              title="Subwoofer Sauce Vol. 1"
              subTitle="OG Deeper Late Night Wonky Riddim"
              additionalInfo="I'm super picky about riddim, so if you're not a fan yet maybe I can bring you to the dark side 😉 Headphones recommended, Lotta wild sounds bouncing around the 3D space in this one."
            />
            <SoundcloudTrack
              url="https://soundcloud.com/special-ingredient/aged-cheddar-mix-vol-1?in=special-ingredient/sets/heavier-dubstep"
              title="Aged Cheddar Vol. 1"
              subTitle="Early 2010s Wompy Dubstep— Liquid Stranger, Bar9, etc."
              additionalInfo="For this mix, I mainly wanted to capture all my favorite tracks of Liquid Stranger's 2010 album Mechanoid Meltdown, a style that I think is completely unique and unmatched to this day, and fill in with my favorite bangers of the era/sound."
            />
            <SoundcloudTrack
              url="https://soundcloud.com/special-ingredient/special-ingredient-b2b-saumii-larimer-lounge-1-26-2023?in=special-ingredient/sets/heavier-dubstep"
              title="Special Ingredient B2B Saumii @ Larimer Lounge 1/26/2023"
              subTitle="Multi-Genre Dubstep Journey"
              additionalInfo="Cooked up an extra special bass journey set with Saumii for a sold out crowd at Larimer Lounge, rinsing some of our favorite tracks we've shared over the years of DJing together."
            />
            <SoundcloudTrack
              url="https://soundcloud.com/special-ingredient/bass-kitchen-mix-rage-dubstep-mix-briddim-riddim?in=special-ingredient/sets/heavier-dubstep"
              title="Bass Kitchen Vol. 1"
              subTitle="Briddim, Riddim, Heavy Dubstep"
              additionalInfo="Wanted to make a heavy mix of newer-style briddim-type dubstep, while also journeying into some deeper genres at times."
            />
          </GridCard>
          <GridCard title="Mashups / Flips">
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
        </GridCardContext.Provider>
      </div>
      {
        // create a div at the bottom when expanding so can scroll title to the top
        isExpanding && !isExpanding.wereAnyExpanded && (
          <div
            style={{
              height:
                parseInt(window.getComputedStyle(isExpanding.ref.current!).maxHeight) -
                isExpanding.ref.current!.offsetHeight,
            }}
          ></div>
        )
      }
    </div>
  )
}
