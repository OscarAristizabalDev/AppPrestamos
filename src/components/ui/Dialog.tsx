import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type DialogMode = "info" | "decision";

interface AppDialogProps {
  visible: boolean;
  title?: string;
  message: string;
  icon?: string; // nombre del icono de MaterialCommunityIcons
  iconColor?: string;
  iconSize?: number;
  isDoingAction?: boolean;
  mode?: DialogMode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  onClose?: () => void; // al tocar backdrop o cerrar
  primaryColor?: string; // azul elegante por defecto
  backgroundColor?: string;
  textColor?: string;
  messageColor?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  confirmTextColor?: string;
  cancelTextColor?: string;
}

const { width: SCREEN_W } = Dimensions.get("window");

const DEFAULT_PRIMARY = "#2563EB"; // Azul Royal elegante

export const AppDialog = ({
  visible,
  title,
  message,
  icon,
  iconColor = DEFAULT_PRIMARY,
  iconSize = 56,
  isDoingAction = false,
  mode = "info",
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  onClose,
  primaryColor = DEFAULT_PRIMARY,
  backgroundColor = "#2C2C2E",
  textColor = "#FFFFFF",
  messageColor = "#CCCCCC",
  confirmButtonColor,
  cancelButtonColor,
  confirmTextColor = "#FFFFFF",
  cancelTextColor = "#FFFFFF",
}: AppDialogProps) => {
  const handleBackdropPress = () => {
    if (onClose) onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleBackdropPress}
    >
      <Pressable style={styles.backdrop} onPress={handleBackdropPress}>
        <View style={[styles.card, { backgroundColor }]}>
          {/* Icono */}
          {icon && (
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons
                name={icon as any}
                size={iconSize}
                color={iconColor}
              />
            </View>
          )}

          {/* Título */}
          {title && (
            <Text style={[styles.title, { color: textColor }]}>{title}</Text>
          )}

          {/* Mensaje */}
          <Text style={[styles.message, { color: messageColor }]}>
            {message}
          </Text>

          {/* Botones */}
          <View
            style={[
              styles.buttonRow,
              mode === "info" && styles.buttonRowSingle,
            ]}
          >
            {mode === "decision" && (
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.cancelButton,
                  {
                    backgroundColor:
                      cancelButtonColor || "rgba(255, 255, 255, 0.1)",
                  },
                  pressed && styles.pressed,
                ]}
                onPress={onCancel || onClose}
                disabled={isDoingAction}
              >
                <Text style={[styles.buttonText, { color: cancelTextColor }]}>
                  {cancelText}
                </Text>
              </Pressable>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: confirmButtonColor || primaryColor,
                },
                mode === "info" && styles.confirmButtonFull,
                pressed && styles.pressed,
              ]}
              disabled={isDoingAction}
              onPress={onConfirm}
            >
              {isDoingAction ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={[styles.buttonText, { color: confirmTextColor }]}>
                  {confirmText}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: Math.min(SCREEN_W - 48, 340),
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  iconWrapper: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  buttonRowSingle: {
    flexDirection: "column",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonFull: {
    flex: 0,
    width: "100%",
  },
  cancelButton: {
    // fondo sutil definido por prop
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
