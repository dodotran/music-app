import { SimpleLineIcons } from '@expo/vector-icons'
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native'

export type MusicCardProps = {
  url: string
  title?: string
  artist?: string
  artwork?: string
}

const MusicCard = (data: MusicCardProps & { onSelect: () => void }) => {
  const { title, artwork, onSelect, artist } = data

  return (
    <Pressable onPress={onSelect}>
      <View style={styles.card}>
        {artwork ? (
          <Image source={{ uri: artwork }} style={{ width: 40, height: 40 }} />
        ) : (
          <SimpleLineIcons name="music-tone-alt" size={24} color="white" />
        )}
        <View>
          <Text style={styles.text}>{title}</Text>
          <Text style={styles.text_mini}>{artist}</Text>
        </View>
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
  text_mini: {
    color: 'white',
    fontSize: 11,
  },
})
