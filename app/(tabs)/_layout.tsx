import { Tabs } from 'expo-router';
import 'react-native-reanimated';

import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RootLayout() {
  return (
    <>
      <Tabs screenOptions={{
        tabBarActiveTintColor: "teal",
        headerShown: false
      }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name='home'
                size={size}
                color={color}
              />
            )
          }} />
        <Tabs.Screen
          name="account"
          options={{
            title: "",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name='account'
                size={size}
                color={color}
              />
            )
          }} />
        <Tabs.Screen
          name="loan"
          options={{
            title: "",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name='account-cash'
                size={size}
                color={color}
              />
            )
          }} />
      </Tabs>
    </>
  )
}
