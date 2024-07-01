import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

const HOST = 'https://music-api-jwfe.onrender.com/musics'

export default function TabTwoScreen() {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [artwork, setArtwork] = useState('')
  const [playlist, setPlaylist] = useState('')

  const handleAddMusic = async () => {
    const newMusic = {
      url,
      title,
      artist,
      artwork,
      playlist: playlist.split(',').map((item) => item.trim()),
    }

    try {
      const response = await fetch(HOST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMusic),
      })

      if (response.ok) {
        Alert.alert('Success', 'Music added successfully!')
        // Clear the input fields after successful submission
        setUrl('')
        setTitle('')
        setArtist('')
        setArtwork('')
        setPlaylist('')
      } else {
        const errorData = await response.json()
        Alert.alert('Error', `Failed to add music: ${errorData.message}`)
      }
    } catch (error) {
      Alert.alert('Error', `Failed to add music`)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Music</Text>
      <TextInput style={styles.input} placeholder="URL" value={url} onChangeText={setUrl} />
      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput
        style={styles.input}
        placeholder="Artist"
        value={artist}
        onChangeText={setArtist}
      />
      <TextInput
        style={styles.input}
        placeholder="Artwork URL"
        value={artwork}
        onChangeText={setArtwork}
      />
      <TextInput
        style={styles.input}
        placeholder="Playlists (comma separated)"
        value={playlist}
        onChangeText={setPlaylist}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddMusic}>
        <Text style={styles.buttonText}>Add Music</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    backgroundColor: 'black',
    color: 'white',
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
})
