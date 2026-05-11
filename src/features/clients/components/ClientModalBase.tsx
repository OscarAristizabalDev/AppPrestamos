import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import Modal from "react-native-modal";

const BaseModal = ({
  mode,
  isVisible,
  onClose,
  isSaving,
  isValid,
  onSubmit,
  children,
}: {
  mode: string;
  isVisible: boolean;
  onClose: () => void;
  isSaving?: boolean;
  isValid: boolean;
  onSubmit: () => void;
  children: React.ReactNode;
}) => (
  <Modal
    isVisible={isVisible}
    onBackdropPress={!isSaving ? onClose : undefined}
    animationIn="slideInUp"
    animationOut="slideOutDown"
    backdropOpacity={0.7}
  >
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardView}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {mode === "create" ? "Crear Cliente" : "Editar Cliente"}
          </Text>
          {!isSaving && (
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#fff" />
            </Pressable>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.form}>
          <View style={styles.formContainer}>{children}</View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={styles.cancelButton}
            onPress={onClose}
            disabled={isSaving}
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </Pressable>
          <Pressable
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={onSubmit}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.saveText}>
                {mode === "create" ? "Guardar" : "Actualizar"}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  </Modal>
);

export default BaseModal;

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    backgroundColor: "#2C2C2E",
    borderRadius: 20,
    padding: 20,
    maxHeight: "85%",
  },
  formContainer: {
    width: "90%", // ← O un ancho fijo: 300
    maxWidth: 400, // ← Máximo para pantallas grandes
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#fff" },
  closeButton: { padding: 4 },
  form: { marginBottom: 16 },
  footer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
  },
  cancelText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#0A84FF",
    alignItems: "center",
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
