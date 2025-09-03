import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import SignIn from './Screens/SignIn';
import HomeScreen from './Screens/HomeScreen';
import Notification from './Screens/Notification';
import MyReport from './Screens/MyReport';
import NewReport from './Screens/NewReport';
import { UserProvider } from './context/UserContext';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="MyReport" component={MyReport} />
          <Stack.Screen name="NewReport" component={NewReport} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="Notification" component={Notification} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({});
