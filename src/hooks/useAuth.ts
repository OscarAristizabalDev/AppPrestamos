import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../store/auth.store";
import { AuthRequest } from "../schemas/auth.schema";
import { router } from "expo-router";
import login from "../api/auth.api";
import Toast from "react-native-root-toast";

const useLogin = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const queryClient = useQueryClient();

  const showToast = (message: string, type: "success" | "error") => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.TOP,
      shadow: true,
      animation: true,
      hideOnPress: true,
      backgroundColor: type === "success" ? "#4CAF50" : "#F44336",
      textColor: "#FFFFFF",
      opacity: 1,
      delay: 0,
    });
  };

  return useMutation({
    mutationFn: ({ email, password }: AuthRequest) =>
      login({ email, password }),

    onSuccess: async (data) => {
      console.log("login success");
      setAccessToken(data.accessToken);
      await SecureStore.setItemAsync("accessToken", data.accessToken);
      await SecureStore.setItemAsync("refreshToken", data.refreshToken);
      queryClient.clear();
      router.replace("/(tabs)");
    },

    onError: (error: any) => {
      console.log("Error details:", {
        message: error.message,
        code: error.code,
        data: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
        },
      });
      // Aquí puedes manejar el error como prefieras
      // Por ejemplo, mostrar un mensaje al usuario
      showToast(error.toString(), "error");
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    logout();
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    queryClient.clear();
    router.replace("/login");
  };

  return { logout: handleLogout };
};

export default useLogin;
