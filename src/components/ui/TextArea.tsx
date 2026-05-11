import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

interface TextAreaProps {
  label: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  icon?: string;
  isSaving?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  placeholder?: string;
  maxLength?: number;
  editable?: boolean;
  numberOfLines?: number; // Líneas visibles iniciales
  resizable?: boolean; // Si true, crece automáticamente con el contenido
  minHeight?: number; // Altura mínima (cuando resizable=true)
  maxHeight?: number; // Altura máxima (cuando resizable=true)
  textAlignVertical?: "auto" | "top" | "center" | "bottom";
}

export const TextArea = ({
  label,
  value,
  onChangeText,
  onBlur,
  icon,
  isSaving = false,
  keyboardType = "default",
  placeholder,
  maxLength,
  editable = true,
  numberOfLines = 3,
  resizable = true,
  minHeight = 80,
  maxHeight = 200,
  textAlignVertical = "top",
}: TextAreaProps) => {
  const [contentHeight, setContentHeight] = useState(minHeight);

  const handleContentSizeChange = (event: any) => {
    if (!resizable) return;
    const newHeight = event.nativeEvent.contentSize.height;
    let finalHeight = Math.min(Math.max(newHeight, minHeight), maxHeight);
    setContentHeight(finalHeight);
  };

  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputContainer, { alignItems: "flex-start" }]}>
        {icon && (
          <MaterialCommunityIcons
            name={icon as any}
            size={18}
            color="#888"
            style={styles.inputIcon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            resizable ? { height: contentHeight } : { minHeight: minHeight },
          ]}
          value={value || ""}
          onChangeText={onChangeText}
          onBlur={onBlur}
          editable={!isSaving && editable}
          placeholderTextColor="#666"
          keyboardType={keyboardType}
          autoCapitalize="sentences"
          multiline
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          placeholder={placeholder}
          textAlignVertical={textAlignVertical}
          onContentSizeChange={handleContentSizeChange}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  field: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 13,
    color: "#888",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
  },
  inputIcon: { marginRight: 8, marginTop: 12 }, // alinear con primera línea del texto
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 12,
    paddingTop: 12,
    paddingBottom: 12,
  },
});
