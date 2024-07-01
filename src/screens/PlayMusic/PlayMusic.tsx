import { Header } from '@/components/Header'
import { useLocalSearchParams } from 'expo-router'
import { StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const PlayMusicScreen = () => {
  const { url, title } = useLocalSearchParams()

  return (
    <SafeAreaView style={styles.container}>
      <Header showLeading title={String(title)} />

      <Text
        style={{
          color: 'white',
          fontSize: 24,
          textAlign: 'center',
        }}
      >
        P:AY
      </Text>
    </SafeAreaView>
  )
}

export { PlayMusicScreen }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
})
