import { StyleSheet, Text, View, Image } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React from 'react';

export default function SignIn() {
  const [isInProgress, setIsInProgress] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/SignIn.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <GoogleSigninButton
        // size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        style={styles.btn}
        onPress={() => console.log('SignIn')}
        disabled={isInProgress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4fafd',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    maxHeight: 550,
    margin: 15,
  },
  btn: {
    width: '100%',
    height: 60,
  },
});
