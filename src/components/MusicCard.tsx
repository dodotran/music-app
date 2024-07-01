import { SimpleLineIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'

export type MusicCardProps = {
  url: string
  title?: string
  artist?: string
  artwork?: string
}

const MusicCard = (data: MusicCardProps & { onSelect: () => void }) => {
  const { title, artist, artwork, url, onSelect } = data
  const router = useRouter()

  return (
    <Pressable onPress={onSelect}>
      <View style={styles.card}>
        <SimpleLineIcons name="music-tone-alt" size={24} color="white" />
        <Text style={styles.text}>{title}</Text>
      </View>
    </Pressable>
  )
}

export { MusicCard }

const styles = StyleSheet.create({
  card: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    paddingVertical: 10,
    width: Dimensions.get('screen').width,
  },
  text: {
    color: 'white',
  },
})
