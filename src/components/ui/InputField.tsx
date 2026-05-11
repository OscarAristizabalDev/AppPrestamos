import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, View } from "react-native";

export const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  icon,
  isSaving,
  keyboardType = "default",
  containerStyle,
}: {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  icon?: string;
  isSaving?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  containerStyle?: any;
}) => {
  return (
    <View style={[styles.field, containerStyle]}>
      {label && <Text style={styles.fieldLabel}>{label}</Text>}
      <View style={styles.inputContainer}>
        {icon && (
          <MaterialCommunityIcons
            name={icon as any}
            size={18}
            color="#888"
            style={styles.inputIcon}
          />
        )}
        <TextInput
          style={styles.input}
          value={value || ""}
          onChangeText={onChangeText}
          onBlur={onBlur}
          editable={!isSaving}
          placeholderTextColor="#666"
          keyboardType={keyboardType}
          autoCapitalize="sentences"
          placeholder={placeholder}
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
  inputIcon: { marginRight: 8 },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 12,
  },
});
