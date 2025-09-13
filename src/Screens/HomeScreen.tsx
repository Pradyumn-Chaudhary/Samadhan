import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  PermissionsAndroid,
  Platform
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
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
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import { BACKEND_URL } from '@env';
import { UserType } from '../types/propType';
import Geolocation from '@react-native-community/geolocation';

export default function HomeScreen({ navigation }: any) {
  const [haveNotification, setHaveNotification] = useState(true);
  const [open, setOpen] = useState(true);
  const [mapType, setMapType] = useState<'standard' | 'hybrid'>('standard');
  const { user, setUser } = useUser();
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      // --- Android Permission Handling ---
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'We use your location to show you on the map',
              buttonPositive: 'OK',
              buttonNegative: 'Cancel',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Location permission granted');
            getLocation();
          } else {
            console.log('Location permission denied.');
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        // --- iOS Permission Handling ---
        // On iOS, the permission request is triggered automatically when you call Geolocation.getCurrentPosition().
        // You just need to ensure the necessary keys are in your Info.plist.
        getLocation();
      }
    };

    const getLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUser((prevUser: UserType) => ({
            ...prevUser,
            latitude,
            longitude,
          }));
          console.log(
            'User Context updated with location:',
            latitude,
            longitude,
          );
        },
        error => {
          // See error codes and messages in the library's documentation
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    };

    requestLocationPermission();
  }, []);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async currentUser => {
      if (currentUser && currentUser.email) {
        if (user.user_id) return;

        try {
          const response = await axios.get(`${BACKEND_URL}/users/getUser`, {
            params: { email: currentUser.email },
          });
          const userData = response.data;

          setUser((prevUser: UserType) => ({
            ...prevUser, // Keep existing data (like location)
            user_id: userData.user_id,
            full_name: userData.full_name,
            email: currentUser.email,
          }));
        } catch (error) {
          console.error('Failed to fetch user data from backend:', error);
        }
      } else {
        // ✅ CORRECTED LOGIC HERE
        // No user is signed in, clear ONLY the user-specific fields
        setUser((prevUser: UserType) => ({
          ...prevUser, // Keep existing latitude and longitude
          user_id: null,
          full_name: null,
          email: null,
        }));
      }
    });

    return unsubscribe;
  }, [user.user_id]);

  const centerOnUser = () => {
    // Check if the mapRef and user location are available
    if (mapRef.current && user.latitude && user.longitude) {
      const newRegion = {
        latitude: user.latitude,
        longitude: user.longitude,
        latitudeDelta: 0.005, // You can adjust the zoom level here
        longitudeDelta: 0.005,
      };
      // Animate the map to the new region
      mapRef.current.animateToRegion(newRegion, 1000); // 1000ms (1 second) animation
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('MyReport')}
          style={styles.reportButton}
        >
          <Text style={styles.headerText}>My Report</Text>
        </TouchableOpacity>
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
        {/* Check if we have valid coordinates before rendering the map */}
        {user.latitude && user.longitude ? (
          <>
            <MapView
              ref={mapRef}
              style={styles.map}
              mapType={mapType}
              region={{
                latitude: user.latitude,
                longitude: user.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            />
            <View style={styles.floatingButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor:
                      mapType === 'standard'
                        ? 'rgba(74, 85, 104, 0.9)'
                        : '#4299e1',
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
              <TouchableOpacity style={styles.button} onPress={centerOnUser}>
                <LocateFixed color="white" size={22} />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          // If we don't have coordinates yet, show a loading spinner
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={styles.loadingText}>Fetching your location...</Text>
          </View>
        )}
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
  // Added styles for the loading indicator
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4a5568',
  },
});
