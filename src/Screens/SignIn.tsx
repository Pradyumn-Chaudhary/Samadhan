import auth, {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { BACKEND_URL } from '@env';

export default function SignIn({ navigation }: any) {
  const [isInProgress, setIsInProgress] = useState(false);

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [currentUser, setCurrentUser] = useState();
  const { user, setUser } = useUser();

  // Handle user state changes
  function handleAuthStateChanged(currentUser: any) {
    setCurrentUser(currentUser);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (currentUser) {
      navigation.navigate('HomeScreen');
    }
  }, [currentUser, navigation]);

  if (initializing) return null;

  GoogleSignin.configure({
    webClientId:
      '622717700596-gbta68375h0vuk5jn6if5jsip4849b2f.apps.googleusercontent.com',
  });

  const createUserInDB = async ({ user }: any) => {
    // Use your deployed URL for the base API
    const baseUrl = `${BACKEND_URL}/users`;
    let userData;

    try {
      // Step 1: Attempt to get the user
      const response = await axios.get(`${baseUrl}/getUser`, {
        params: {
          user_id: user.uid,
          full_name: user.displayName,
          email: user.email,
        },
      });

      // If the GET is successful (status 200), set the user data from the response.
      userData = response.data;
      console.log('User already exists. API Response:', userData);
    } catch (error: any) {
      // If the GET request fails with a 404, the user does not exist.
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 404
      ) {
        console.log('User not found. Creating a new user...');
        try {
          // Step 2: Create the new user with a POST request
          const createResponse = await axios.post(`${baseUrl}/createUser`, {
            user_id: user.uid,
            full_name: user.displayName,
            email: user.email,
          });

          // If the POST is successful (status 201), set the user data from this response.
          userData = createResponse.data;
          console.log('New user created. API Response:', userData);
        } catch (createError) {
          // Handle any errors during the user creation
          console.error('Error creating new user:', createError);
          throw createError;
        }
      } else {
        // Handle other types of errors (e.g., network issues, 500 status codes)
        console.error('Error fetching user data:', error);
        throw error;
      }
    }

    // Set the user state once, after a successful get or create.
    if (userData) {
      setUser({
        user_id: userData.user_id,
        full_name: userData.full_name,
        email: userData.email,
      });
    }

    return userData;
  };

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

      // Sign in the user with the credential
      const userCredential = await signInWithCredential(
        getAuth(),
        googleCredential,
      );
      const currentUser = userCredential.user;

      // create user in db if not exist
      await createUserInDB({ user: currentUser });
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
