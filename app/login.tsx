import useLogin from "@/src/hooks/useAuth";
import { AuthRequest, AuthRequestSchema } from "@/src/schemas/auth.schema";
import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AuthRequest>({
    resolver: zodResolver(AuthRequestSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { mutate, isPending } = useLogin();

  const onSubmit = (data: AuthRequest) => {
    console.log("login clicked");
    mutate(data);
  };

  return (
    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Sign In</Text>
          <View style={styles.formContainer}>
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange, onBlur } }) => (
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputWithIcon}>
                    <MaterialIcons
                      name="email"
                      size={24}
                      color="blue"
                      style={styles.icon}
                    />
                    <TextInput
                      style={[styles.input, errors.email && styles.inputError]}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      placeholder="Enter your email"
                      value={value.toString()}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </View>
                  {errors.email && (
                    <Text style={styles.error}>{errors.email.message}</Text>
                  )}
                </View>
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputWithIcon}>
                    <MaterialIcons
                      name="password"
                      size={24}
                      color="blue"
                      style={styles.icon}
                    />
                    <TextInput
                      style={[
                        styles.input,
                        errors.password && styles.inputError,
                      ]}
                      secureTextEntry
                      placeholder="Enter your password"
                      value={value.toString()}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </View>
                  {errors.password && (
                    <Text style={styles.error}>{errors.password.message}</Text>
                  )}
                </View>
              )}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || isPending}
            >
              {isPending ? (
                <ActivityIndicator size="small" color="#020617" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    width: "90%", // ← O un ancho fijo: 300
    maxWidth: 400, // ← Máximo para pantallas grandes
    backgroundColor: "transparent",
  },
  fieldContainer: {
    marginBottom: 12,
  },
  title: {
    position: "absolute",
    top: "10%",
    left: "55%",
    transform: [{ translateX: -55 }],
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#ef4444",
  },
  error: { color: "red", marginBottom: 10 },
  label: { fontWeight: "bold", marginBottom: 4, fontSize: 14, color: "#fff" },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },

  icon: {
    marginRight: 8,
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});
