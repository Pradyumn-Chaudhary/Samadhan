import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView from 'react-native-maps';
import {
  Bell,
  BellDot,
  TriangleAlert,
  Satellite,
  LocateFixed,
} from 'lucide-react-native';
import { useUser } from '../context/UserContext';
import auth from '@react-native-firebase/auth'; // Correct import for React Native Firebase
import axios from 'axios';
import { BACKEND_URL } from '@env'; // Ensure you have this environment variable

export default function HomeScreen({ navigation }: any) {
  const [haveNotification, setHaveNotification] = useState(true);
  const [open, setOpen] = useState(true);
  const [mapType, setMapType] = useState<'standard' | 'hybrid'>('standard');
  const { user, setUser } = useUser();

  useEffect(() => {
    // Correctly subscribe to auth changes using the React Native Firebase library
    const unsubscribe = auth().onAuthStateChanged(async (currentUser) => {
      if (currentUser && currentUser.email) {
        // If a user is logged in and their email exists, fetch details
        if (user.user_id) return; // a user is already set in the context, do nothing

        try {
          const response = await axios.get(`${BACKEND_URL}/users/getUser`, {
            params: { email: currentUser.email },
          });
          
          const userData = response.data;
          
          // Set the user in the global context
          setUser({
            user_id: userData.user_id,
            full_name: userData.full_name,
            email: currentUser.email,
          });

        } catch (error) {
          console.error("Failed to fetch user data from backend:", error);
          // Handle error, maybe navigate to a login screen or show a message
        }
      } else {
        // No user is signed in, clear the context
        setUser({
          user_id: null,
          full_name: null,
          email: null,
        });
      }
    });
    console.log(user)
    // Cleanup subscription on component unmount
    return unsubscribe; // The returned function from onAuthStateChanged is the unsubscriber
  }, [user.user_id]); // Rerun effect if the user_id changes

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* right side */}
        <TouchableOpacity
          onPress={() => navigation.navigate('MyReport')}
          style={styles.reportButton}
        >
          <Text style={styles.headerText}>My Report</Text>
        </TouchableOpacity>
        {/* left side */}
        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notification')}
            style={styles.iconContainer}
          >
            {haveNotification ? (
              <View style={styles.notificationWrapper}>
                <BellDot color="#ff6b6b" size={24} />
                <View style={styles.notificationBadge} />
              </View>
            ) : (
              <Bell color="#4a5568" size={24} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('NewReport')}
            style={[styles.iconContainer, styles.alertIconContainer]}
          >
            <TriangleAlert color="#ff8c42" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.container}>
        {/* The MapView takes up the full space of the container */}
        <MapView
          style={styles.map}
          mapType={mapType}
          initialRegion={{
            latitude: 26.27,
            longitude: 73.04,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        />

        {/* A container for all floating buttons on the top-right */}
        <View style={styles.floatingButtonsContainer}>
          {/* The Map Type Toggle Button */}
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  mapType === 'standard' ? 'rgba(74, 85, 104, 0.9)' : '#4299e1',
              },
            ]}
            onPress={() =>
              setMapType(mapType === 'standard' ? 'hybrid' : 'standard')
            }
          >
            <Satellite
              color={mapType === 'standard' ? 'white' : 'white'}
              size={22}
            />
          </TouchableOpacity>

          {/* The Locate Fixed Button */}
          <TouchableOpacity style={styles.button}>
            <LocateFixed color="white" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContainer}>
          <TouchableOpacity
            onPress={() => setOpen(true)}
            style={[
              styles.footerButton,
              styles.footerButtonLeft,
              { backgroundColor: open ? '#48bb78' : '#e2e8f0' },
            ]}
          >
            <Text
              style={[
                styles.footerButtonText,
                { color: open ? 'white' : '#4a5568' },
              ]}
            >
              Open Issues
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setOpen(false)}
            style={[
              styles.footerButton,
              styles.footerButtonRight,
              { backgroundColor: !open ? '#48bb78' : '#e2e8f0' },
            ]}
          >
            <Text
              style={[
                styles.footerButtonText,
                { color: !open ? 'white' : '#4a5568' },
              ]}
            >
              Closed Issues
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  reportButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginLeft: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f7fafc',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  alertIconContainer: {
    backgroundColor: '#fff5f5',
  },
  notificationWrapper: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    backgroundColor: '#e53e3e',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'white',
  },
  map: {
    flex: 1,
  },
  floatingButtonsContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  button: {
    backgroundColor: 'rgba(74, 85, 104, 0.9)',
    borderRadius: 28,
    padding: 14,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  footerContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 30,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonLeft: {
    borderTopLeftRadius: 26,
    borderBottomLeftRadius: 26,
    marginRight: 2,
  },
  footerButtonRight: {
    borderTopRightRadius: 26,
    borderBottomRightRadius: 26,
    marginLeft: 2,
  },
  footerButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});