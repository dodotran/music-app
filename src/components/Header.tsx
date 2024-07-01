import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native'

type Props = {
  showLeading?: boolean
  showLeadingTitle?: boolean
  title?: string
  onBack?: () => void
}

const Header = ({ showLeading = false, title = 'Title', onBack }: Props) => {
  const router = useRouter()

  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" />
      <View
        style={{
          flexDirection: 'row',
          height: 44,
          alignItems: 'center',
          position: 'relative',
          borderBottomColor: 'white',
          borderBottomWidth: 0.2,
          justifyContent: 'center',
        }}
      >
        {showLeading ? (
          <View
            style={{
              position: 'absolute',
              alignItems: 'center',
              left: 8,
            }}
          >
            <TouchableOpacity onPress={onBack ? onBack : () => router.back()}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View />
        )}

        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            fontSize: 18,
          }}
        >
          {title}
        </Text>
      </View>
    </SafeAreaView>
  )
}

export { Header }
