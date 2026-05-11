import * as SecureStore from "expo-secure-store";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useAuthStore } from "../store/auth.store";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");

      // Limpiar TODA la caché de React Query (incluye clients, docTypes, etc.)
      await queryClient.clear();

      // Invalidar queries activas para forzar re-fetch si vuelve a entrar
      queryClient.removeQueries();

      logout();
      router.replace("/login");
      console.info("User logged out");
    } catch (error) {
      console.error("Error during logout:", error);
      // Aunque falle algo, forzá la salida
      router.replace("/login");
    }
  };

  return { handleLogout };
};
