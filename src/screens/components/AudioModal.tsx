import UnknownArtistImg from '@/assets/unknown_artist.png'
import { MusicCardProps } from '@/components/MusicCard'
import { useSoundStore } from '@/store/music'
import { AntDesign, Fontisto, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'
import React from 'react'
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

const { width } = Dimensions.get('window')

interface AudioModalProps {
  item: MusicCardProps
  visible: boolean
  close: () => void
  duration: string
  progress: number
  position: string
  isPlay: boolean
  pause: () => void
  play: () => void
  next: () => void
  prev: () => void
  playFromPosition: (progress: number) => void
  index: number
}

const AudioModal = (props: AudioModalProps) => {
  const {
    item,
    visible,
    close,
    duration,
    progress,
    position,
    isPlay,
    pause,
    play,
    next,
    prev,
    playFromPosition,
    index,
  } = props

  const { calcPositionProgress } = useSoundStore()

  const scrollX = React.useRef(new Animated.Value(0)).current
  const ref = React.useRef<any>(null)
  const [scrollIndex, setScrollIndex] = React.useState(index)

  React.useEffect(() => {
    scrollX.addListener(({ value }) => {
      const newIndex = Math.round(value / width)
      setScrollIndex(newIndex)
    })
    return () => scrollX.removeAllListeners()
  }, [scrollX])

  React.useEffect(() => {
    if (scrollIndex > index) {
      next()
    } else if (scrollIndex < index) {
      prev()
    }
  }, [scrollIndex])

  React.useEffect(() => {
    if (ref.current && index) {
      ref.current.scrollToIndex({ index })
    }
  }, [index])

  React.useEffect(() => {
    if (isPlay) {
      const interval = setInterval(async () => {
        await calcPositionProgress()
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isPlay])

  return (
    <Modal animationType="slide" visible={visible}>
      <View style={{ backgroundColor: 'black', flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={close} style={{ position: 'absolute', left: 20 }}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>

          <Text style={{ color: 'white', fontSize: 18 }}>Now playing</Text>
        </View>

        <View style={styles.container}>
          <View>
            <Image
              source={item.artwork ? item.artwork : UnknownArtistImg}
              style={{ width: '100%', objectFit: 'contain' }}
              height={Dimensions.get('screen').height / 2}
            />
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
              }}
            >
              <Text style={styles.title}>{item.title}</Text>
              <Text style={{ color: 'white' }}>{item.artist}</Text>
            </View>
          </View>

          <View style={styles.timing}>
            <Text style={styles.timingText}>{position}</Text>
            <Text style={styles.timingText}>{duration}</Text>
          </View>

          <Slider
            style={styles.progress}
            minimumTrackTintColor="white"
            maximumTrackTintColor="lightgray"
            onSlidingComplete={playFromPosition}
            thumbTintColor="white"
            value={progress}
          />

          <View style={styles.controls}>
            <TouchableOpacity onPress={prev}>
              <View style={styles.button}>
                <MaterialCommunityIcons name="skip-previous" size={34} color="white" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => (isPlay ? pause() : play())}>
              <View
                style={
                  (styles.button,
                  {
                    borderWidth: 1,
                    borderRadius: 100,
                    backgroundColor: 'white',
                    padding: 10,
                    width: 50,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  })
                }
              >
                {isPlay ? (
                  <AntDesign name="pause" size={24} color="black" />
                ) : (
                  <Fontisto name="play" size={16} color="black" />
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={next}>
              <View style={styles.button}>
                <MaterialCommunityIcons name="skip-next" size={34} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  header: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 25,
    height: 25,
  },
  container: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 20,
    color: 'white',
  },
  progress: {
    marginHorizontal: -15,
  },
  timing: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timingText: {
    fontSize: 12,
    color: 'white',
  },
  controls: {
    flexDirection: 'row',
    marginTop: 40,
    justifyContent: 'center',
    gap: 28,
    alignItems: 'center',
  },
  iconPlay: {
    width: 40,
    height: 40,
  },
  next: {
    transform: [{ rotate: '180deg' }],
  },
})

export { AudioModal }
