import { useState } from "react";
import { Pressable, StyleSheet, Text, View, Platform } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface DatePickerFieldProps {
  label: string;
  value?: string; // "YYYY-MM-DD" o null
  onChange: (dateString: string) => void;
  error?: string;
  icon?: string;
  isSaving?: boolean;
}

const parseDate = (isoString?: string): Date => {
  if (!isoString || isoString === "Invalid Date") return new Date();
  // Si viene con hora (del backend), extraemos solo YYYY-MM-DD
  const datePart = isoString.split("T")[0];
  const d = new Date(datePart + "T00:00:00");
  return isNaN(d.getTime()) ? new Date() : d;
};

const formatDisplay = (isoString?: string): string => {
  if (!isoString || isoString === "Invalid Date") return "";
  const datePart = isoString.split("T")[0];
  const [year, month, day] = datePart.split("-");
  if (!year || !month || !day) return "";
  return `${day}/${month}/${year}`; // DD/MM/YYYY
};

export const DatePickerField = ({
  label,
  value,
  onChange,
  error,
  icon = "calendar",
  isSaving,
}: DatePickerFieldProps) => {
  const [open, setOpen] = useState(false);

  const currentDate = parseDate(value);

  const onDateSelected = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") setOpen(false);
    if (event.type === "dismissed") return;
    if (!selectedDate) return;

    // Normaliza YYYY-MM-DD sin timezone
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    onChange(`${year}-${month}-${day}`);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={() => !isSaving && setOpen(true)}
        style={({ pressed }) => [
          styles.container,
          pressed && styles.pressed,
          error && styles.errorBorder,
        ]}
      >
        <MaterialCommunityIcons
          name={icon as any}
          size={20}
          color="#888"
          style={styles.icon}
        />
        <Text style={[styles.text, !value && styles.placeholder]}>
          {value ? formatDisplay(value) : "Seleccionar fecha"}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={20} color="#888" />
      </Pressable>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {open && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateSelected}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  label: {
    fontSize: 13,
    color: "#888",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  pressed: { opacity: 0.8, backgroundColor: "rgba(255,255,255,0.05)" },
  errorBorder: { borderColor: "#FF453A" },
  icon: { marginRight: 10 },
  text: { flex: 1, color: "#fff", fontSize: 16 },
  placeholder: { color: "#666" },
  errorText: { color: "#FF453A", fontSize: 12, marginTop: 4 },
});
