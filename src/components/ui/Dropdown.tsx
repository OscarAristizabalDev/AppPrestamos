import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type KeyOrFn<T> = keyof T | ((item: T) => string);

interface SimpleDropdownProps<T> {
  data: T[];
  labelKey: KeyOrFn<T>;
  valueKey?: keyof T;
  value?: T | null;
  onSelect: (item: T) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  emptyText?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  placeholderColor?: string;
  selectedColor?: string;
  selectedTextColor?: string;
  itemPressedColor?: string;
  dropdownBackground?: string;
  maxHeight?: number;
}

function getLabel<T>(item: T, labelKey: KeyOrFn<T>): string {
  if (typeof labelKey === "function") return labelKey(item);
  return String(item[labelKey] ?? "");
}

function isSameItem<T>(a: T, b: T, valueKey?: keyof T): boolean {
  if (!valueKey) return JSON.stringify(a) === JSON.stringify(b);
  return (a as any)[valueKey] === (b as any)[valueKey];
}

export function SimpleDropdown<T>({
  data,
  labelKey,
  valueKey,
  value,
  onSelect,
  label,
  placeholder = "Seleccionar...",
  disabled = false,
  emptyText = "No hay opciones",
  backgroundColor = "#2C2C2E",
  textColor = "#FFFFFF",
  borderColor = "rgba(255,255,255,0.1)",
  placeholderColor = "#666666",
  selectedColor = "rgba(10, 132, 255, 0.15)",
  selectedTextColor = "#0A84FF",
  itemPressedColor = "rgba(255,255,255,0.08)",
  dropdownBackground = "#1E1E1E",
  maxHeight = 220,
}: SimpleDropdownProps<T>) {
  const [open, setOpen] = useState(false);

  const selectedLabel = value ? getLabel(value, labelKey) : null;

  const handleSelect = (item: T) => {
    onSelect(item);
    setOpen(false);
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}

      {/* Trigger */}
      <Pressable
        onPress={() => !disabled && setOpen(!open)}
        style={({ pressed }) => [
          styles.trigger,
          { backgroundColor, borderColor },
          pressed && !disabled && styles.triggerPressed,
          disabled && styles.triggerDisabled,
          open && styles.triggerOpen,
        ]}
      >
        <Text
          style={[
            styles.triggerText,
            { color: selectedLabel ? textColor : placeholderColor },
          ]}
          numberOfLines={1}
        >
          {selectedLabel || placeholder}
        </Text>
        <MaterialCommunityIcons
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color={placeholderColor}
        />
      </Pressable>

      {/* Dropdown inline */}
      {open && (
        <View
          style={[
            styles.dropdown,
            { backgroundColor: dropdownBackground, borderColor, maxHeight },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
            {data.length === 0 ? (
              <Text style={[styles.emptyText, { color: placeholderColor }]}>
                {emptyText}
              </Text>
            ) : (
              data.map((item, index) => {
                const isSelected = value
                  ? isSameItem(item, value, valueKey)
                  : false;
                const itemLabel = getLabel(item, labelKey);

                return (
                  <Pressable
                    key={index}
                    style={({ pressed }) => [
                      styles.item,
                      {
                        backgroundColor: isSelected
                          ? selectedColor
                          : "transparent",
                      },
                      pressed && { backgroundColor: itemPressedColor },
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text
                      style={[
                        styles.itemText,
                        { color: isSelected ? selectedTextColor : textColor },
                      ]}
                    >
                      {itemLabel}
                    </Text>
                    {isSelected && (
                      <MaterialCommunityIcons
                        name="check"
                        size={18}
                        color={selectedTextColor}
                      />
                    )}
                  </Pressable>
                );
              })
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: "relative", zIndex: 10 },
  label: {
    fontSize: 13,
    marginBottom: 6,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  triggerPressed: { opacity: 0.9 },
  triggerDisabled: { opacity: 0.4 },
  triggerOpen: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  triggerText: { flex: 1, fontSize: 16, fontWeight: "500" },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: "hidden",
    zIndex: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemText: { flex: 1, fontSize: 15 },
  emptyText: { textAlign: "center", paddingVertical: 20, fontSize: 14 },
});
