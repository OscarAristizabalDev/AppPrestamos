import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { RootSiblingParent } from "react-native-root-siblings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 1000 * 60,
    },
  },
});

export default function Layout() {
  // Hidratar auth al iniciar
  useEffect(() => {
    const hydrateAuth = async () => {
      const storedToken = await SecureStore.getItemAsync("accessToken");
      if (storedToken) {
        useAuthStore.getState().setAccessToken(storedToken);
      }
    };
    hydrateAuth();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <RootSiblingParent>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#f4511e",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="login"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              // headerRight: () => (
              //     <Button
              //         onPress={() => alert('Button pressed!')}
              //         title="Press me"
              //         color="#000"
              //     />
              // ),
              // headerLeft: () => (
              //     <Button
              //         onPress={() => alert('Button pressed!')}
              //         title="Press me"
              //         color="#000"
              //     />
              // ),
              // headerSearchBarOptions: {
              //     placeholder: 'Search...',
              //     onChangeText: (event) => {
              //         console.log('Search text:', event.nativeEvent.text);
              //     },
              //     onCancelButtonPress: () => {
              //         console.log('Search canceled');
              //     },
              //     onSearchButtonPress: (event) => {
              //         console.log('Search submitted:', event.nativeEvent.text);
              //     },
              // },
            }}
          />
        </Stack>
      </RootSiblingParent>
    </QueryClientProvider>
  );
}
