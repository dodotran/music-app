import { MusicCardProps } from '@/components/MusicCard'
import { Audio } from 'expo-av'
import { create } from 'zustand'

interface InitSource {
  uri: string
  shouldPlay?: boolean
}

interface SoundStore {
  source: InitSource | null
  sound: any
  duration: string
  position: string
  progress: number
  isPlay: boolean
  finishFunc: () => void
  setSource: (source: InitSource | null) => void
  play: () => Promise<void>
  pause: () => Promise<void>
  playFromPosition: (progress: number) => Promise<void>
  setFinishFunc: (func: () => void) => void
  playSound: (index: number, shouldPlay: boolean) => void
  selectedMusic: number | null
  setSelectedMusic: (index: number) => void
  songs: MusicCardProps[]
  onSelect: (index: number) => void
  nextSong: () => void
  prevSong: () => void
  unLoadSound: () => void
  loadSound: () => void
  calcPositionProgress: () => void
}

function millisToTime(millis: number) {
  const minutes = Math.floor(millis / 60000)
  const seconds = Number(((millis % 60000) / 1000).toFixed(0))
  return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}

export const useSoundStore = create<SoundStore>((set, get) => ({
  source: null,
  sound: null,
  duration: '00:00',
  position: '00:00',
  progress: 0,
  isPlay: false,
  selectedMusic: null,
  songs: [],
  setSelectedMusic: (index) => set({ selectedMusic: index }),
  finishFunc: () => {},
  setSource: (source) => set({ source }),
  nextSong: () => {
    const { selectedMusic, songs } = get()
    const index = selectedMusic === songs.length - 1 ? 0 : selectedMusic ? selectedMusic + 1 : 0
    set({ selectedMusic: index })
  },
  prevSong: () => {
    const { selectedMusic, songs } = get()
    const index = selectedMusic === 0 ? songs.length - 1 : selectedMusic ? selectedMusic - 1 : 0
    set({ selectedMusic: index })
  },
  play: async () => {
    const { sound, isPlay } = get()
    if (!isPlay && sound) {
      console.log(1111)
      await sound.playAsync()
      set({ isPlay: true })
    }
  },
  pause: async () => {
    const { sound, isPlay } = get()
    if (isPlay && sound) {
      await sound.pauseAsync()
      set({ isPlay: false })
    }
  },
  playFromPosition: async (progress) => {
    const { sound, calcPositionProgress } = get()
    if (sound) {
      const status = await sound.getStatusAsync()
      const millis = Math.ceil(status.durationMillis * progress)
      await sound.setPositionAsync(millis)
      calcPositionProgress()
    }
  },
  setFinishFunc: (func) => set({ finishFunc: func }),
  playSound: (index, shouldPlay) => {
    const { sound, source, isPlay, songs } = get()
    if (index) {
      if (sound) {
        sound.unloadAsync()
      }
      if (source) {
        set({ source: { ...source, shouldPlay } })
      } else {
        set({ source: { uri: songs[index].url, shouldPlay } })
      }
    } else {
      set({ source: null })
    }

    if (sound) {
      sound.unloadAsync()
    }
    set({ selectedMusic: index })
  },
  onSelect: (index) => {
    const { selectedMusic, isPlay, playSound } = get()
    if (index === selectedMusic) {
      set({ selectedMusic: null })
    } else {
      set({ selectedMusic: index })
    }
    playSound(index, selectedMusic === null || isPlay)
  },
  unLoadSound: async () => {
    const { sound } = get()
    if (sound) {
      await sound.unloadAsync()
      set({ isPlay: false, position: '00:00', progress: 0 })
    }
  },
  loadSound: async () => {
    const { source } = get()
    const { sound } = source ? await Audio.Sound.createAsync(source) : { sound: null }
    const status = await sound?.getStatusAsync()
    console.log(status)
    set({ duration: millisToTime(status?.durationMillis), sound })

    if (source?.shouldPlay) {
      await sound?.playAsync()
      set({ isPlay: true })
    }
  },
  calcPositionProgress: async () => {
    const { sound } = get()
    if (sound) {
      const status = await sound.getStatusAsync()
      set({
        position: millisToTime(status.positionMillis),
        progress: status.positionMillis / status.durationMillis,
      })
    }
  },
}))
