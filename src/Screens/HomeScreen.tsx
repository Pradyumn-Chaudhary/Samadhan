import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView from 'react-native-maps';
import { Bell, BellDot, TriangleAlert } from 'lucide-react-native';

export default function HomeScreen({ navigation }: any) {
  const [haveNotification, setHaveNotification] = useState(true);
  const [open, setOpen] = useState(true);
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

      {/* main view */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 26.27,
          longitude: 73.04,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      />

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
