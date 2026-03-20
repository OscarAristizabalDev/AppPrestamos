import { Redirect, Tabs } from "expo-router";
import "react-native-reanimated";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuthStore } from "@/src/store/auth.store";

export default function RootLayout() {
  const accessToken = useAuthStore((state) => state.accessToken);

  // Protección: si no hay token, redirige al login
  if (!accessToken) {
    return <Redirect href="/login" />;
  }
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "teal",
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="loan"
          options={{
            title: "",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account-cash"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="clients"
          options={{
            title: "",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account-group"
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
