import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "@/src/store/auth.store";

export default function Index() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStoredToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("accessToken");
        if (storedToken && !accessToken) {
          setAccessToken(storedToken);
        }
      } catch (error) {
        console.error("Error reading token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStoredToken();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  console.log("la ruta es: ", accessToken ? "/(tabs)" : "/login");
  // Redirección inicial basada en autenticación
  return accessToken ? <Redirect href="/(tabs)" /> : <Redirect href="/login" />;
}
