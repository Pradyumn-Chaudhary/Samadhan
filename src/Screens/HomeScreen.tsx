import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView from 'react-native-maps';
import {
  Bell,
  BellDot,
  TriangleAlert,
  Satellite,
  LocateFixed,
} from 'lucide-react-native';

export default function HomeScreen({ navigation }: any) {
  const [haveNotification, setHaveNotification] = useState(true);
  const [open, setOpen] = useState(true);
  const [mapType, setMapType] = useState<'standard' | 'hybrid'>('standard');

  return (
    <SafeAreaView style={styles.container}>
      {/*  Header */}
      <View style={styles.header}>
        {/* right side */}
        <TouchableOpacity onPress={() => navigation.navigate('MyReport')}>
          <Text style={styles.headerText}>My Report</Text>
        </TouchableOpacity>
        {/* left side */}
        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notification')}
            style={styles.iconContainer}
          >
            {haveNotification ? <BellDot color="red" /> : <Bell color="#000" />}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('NewReport')}
            style={styles.iconContainer}
          >
            <TriangleAlert color="#000" />
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
                  mapType === 'standard' ? 'rgba(0,0,0,0.5)' : 'dodgerblue',
              },
            ]}
            onPress={() =>
              setMapType(mapType === 'standard' ? 'hybrid' : 'standard')
            }
          >
            <Satellite
              color={mapType === 'standard' ? 'white' : 'white'}
              size={25}
            />
          </TouchableOpacity>

          {/* The Locate Fixed Button */}
          <TouchableOpacity style={styles.button}>
            <LocateFixed color="white" size={25} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => setOpen(true)}
          style={[
            styles.footerButton,
            { backgroundColor: open ? 'green' : '#000' },
          ]}
        >
          <Text style={styles.footerButtonText}>Open Issues</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setOpen(false)}
          style={[
            styles.footerButton,
            { backgroundColor: !open ? 'green' : '#000' },
          ]}
        >
          <Text style={styles.footerButtonText}>Closed Issues</Text>
        </TouchableOpacity>
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
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconContainer: {
    marginLeft: 15,
  },
  map: {
    flex: 1,
  },
  floatingButtonsContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    // Add margin between the buttons
    gap: 10,
    // Add a slight shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    padding: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  footerButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
