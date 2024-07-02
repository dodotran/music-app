import songs from '@/assets/data/music.json'
import { MusicCard, MusicCardProps } from '@/components/MusicCard'
import { useSoundStore } from '@/store/music'
import { FlashList } from '@shopify/flash-list'
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useState } from 'react'
import { RefreshControl, StatusBar, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AudioModal } from '../components'

const HOST = 'https://music-api-jwfe.onrender.com/musics'

const HomeScreen = () => {
  const {
    duration,
    setSource,
    play,
    pause,
    position,
    progress,
    isPlay,
    playFromPosition,
    setFinishFunc,
    sound,
    unLoadSound,
    loadSound,
    source,
  } = useSoundStore()

  const [data, setData] = useState<MusicCardProps[]>([])

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: false,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
    })
  }, [])

  const getListMusic = async () => {
    try {
      const response = await fetch(HOST)
      const data = await response.json()
      setData(data?.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getListMusic()
  }, [])

  useEffect(() => {
    sound && unLoadSound()
    source && loadSound()
  }, [source])

  const [selected, setSelected] = useState<number | null>(null)
  const [modal, setModal] = useState(false)

  function playSound(index: number, shouldPlay: boolean) {
    if (index !== null) {
      setSource({ uri: songs[index].url, shouldPlay })
    } else {
      setSource(null)
    }

    setSelected(index)
  }

  const onSelect = (index: number): void => {
    if (index === selected) {
      setSelected(null)
    } else {
      setSelected(index)
    }
    playSound(index, selected === null || isPlay)
  }

  const prev = () => {
    const index = selected === 0 ? songs.length - 1 : selected ? selected - 1 : 0
    playSound(index, isPlay)
  }

  const next = () => {
    const index = selected === songs.length - 1 ? 0 : selected ? selected + 1 : 0
    playSound(index, isPlay)
  }

  useEffect(() => {
    setFinishFunc(() => next.bind(this))
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="light" />

      <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} locations={[0.1, 0.4, 0.9]}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            height: 40,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              fontWeight: '500',
              color: 'white',
            }}
          >
            SONGS
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.main}>
        <FlashList
          data={data}
          renderItem={({ item, index }) => (
            <MusicCard
              {...item}
              key={index}
              onSelect={() => {
                onSelect(index)
                setModal(!modal)
              }}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={getListMusic} tintColor="white" />
          }
          estimatedItemSize={100}
        />

        {selected !== null && (
          <AudioModal
            item={songs[selected]}
            duration={duration}
            visible={modal}
            close={() => {
              setModal(!modal)
              setSelected(null)
              setSource(null)
            }}
            progress={progress}
            position={position}
            isPlay={isPlay}
            pause={pause}
            play={play}
            prev={prev}
            next={next}
            playFromPosition={playFromPosition}
            index={selected}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

export { HomeScreen }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  main: {
    flex: 1,
    padding: 12,
  },
})
