import auth, { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithCredential } from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignIn({ navigation }: any) {
  const [isInProgress, setIsInProgress] = useState(false);

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function handleAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (user) {
      navigation.navigate('HomeScreen');
    }
  }, [user, navigation]);

  if (initializing) return null;

  GoogleSignin.configure({
    webClientId:
      '622717700596-gbta68375h0vuk5jn6if5jsip4849b2f.apps.googleusercontent.com',
  });

  const handleSignIn = async () => {
    setIsInProgress(true);
    try {
      // Check if the device supports Google Play Services
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Get the user's ID token from Google Sign-In
      const signInResult: any = await GoogleSignin.signIn();

      // Safely retrieve the ID token, checking for both new and old library versions
      let idToken = signInResult.data?.idToken || signInResult.idToken;
      if (!idToken) {
        throw new Error('No ID token found');
      }

      // Create a Google credential with the token to authenticate with Firebase
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign in the user with the credential and return the result
      return signInWithCredential(getAuth(), googleCredential);
    } catch (error) {
      // Log the error for debugging purposes
      console.error('Google Sign-In Error:', error);

      // Optional: You could show a user-friendly error message here
      // For example: Alert.alert('Sign-In Failed', 'Please try again later.');
    } finally {
      // This block always runs, whether the sign-in was successful or failed
      setIsInProgress(false);
    }
  };

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
        onPress={handleSignIn}
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
