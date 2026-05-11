import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
  Keyboard,
  ActivityIndicator,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type KeyOrFn<T> = keyof T | ((item: T) => string);

interface SearchableDropdownProps<T> {
  // === Datos ===
  data: T[];
  labelKey: KeyOrFn<T>;
  valueKey?: keyof T;
  value?: T | null;
  onSelect: (item: T) => void;

  // === Trigger ===
  label?: string;
  placeholder?: string;
  icon?: string;
  disabled?: boolean;
  isSaving?: boolean;

  // === Modal ===
  modalTitle?: string;
  emptyText?: string;

  // === Búsqueda ===
  searchable?: boolean;
  searchIcon?: string;
  searchPlaceholder?: string;

  // === Remota ===
  onSearchChange?: (text: string) => void;
  searchLoading?: boolean;

  // === Render custom ===
  renderItem?: (item: T, isSelected: boolean) => React.ReactNode;

  // === Colores ===
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  placeholderColor?: string;
  selectedColor?: string;
  selectedTextColor?: string;
  searchBackground?: string;
  searchTextColor?: string;
  searchPlaceholderColor?: string;
  itemPressedColor?: string;
  confirmButtonColor?: string;
  confirmButtonTextColor?: string;
}

function getLabel<T>(item: T, labelKey: KeyOrFn<T>): string {
  if (typeof labelKey === "function") return labelKey(item);
  return String(item[labelKey] ?? "");
}

function getValue<T>(item: T, valueKey?: keyof T): string {
  if (!valueKey) return JSON.stringify(item);
  return String(item[valueKey] ?? "");
}

function isSameItem<T>(a: T, b: T, valueKey?: keyof T): boolean {
  if (!valueKey) return JSON.stringify(a) === JSON.stringify(b);
  return (a as any)[valueKey] === (b as any)[valueKey];
}

export function SearchableDropdown<T>({
  data,
  labelKey,
  valueKey,
  value,
  onSelect,
  label,
  placeholder = "Seleccionar...",
  icon = "chevron-down",
  disabled = false,
  isSaving = false,
  modalTitle = "Seleccionar",
  emptyText = "No hay opciones disponibles",
  searchable = false,
  searchIcon = "magnify",
  searchPlaceholder = "Buscar...",
  onSearchChange,
  searchLoading = false,
  renderItem,
  backgroundColor = "#2C2C2E",
  textColor = "#FFFFFF",
  borderColor = "rgba(255,255,255,0.1)",
  placeholderColor = "#666666",
  selectedColor = "rgba(10, 132, 255, 0.15)",
  selectedTextColor = "#0A84FF",
  searchBackground = "#1E1E1E",
  searchTextColor = "#FFFFFF",
  searchPlaceholderColor = "#666666",
  itemPressedColor = "rgba(255,255,255,0.08)",
  confirmButtonColor = "#2563EB",
  confirmButtonTextColor = "#FFFFFF",
}: SearchableDropdownProps<T>) {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");

  // Debounce interno para modo remoto
  useEffect(() => {
    if (!onSearchChange || !visible) return;
    const timer = setTimeout(() => onSearchChange(query), 400);
    return () => clearTimeout(timer);
  }, [query, onSearchChange, visible]);

  // Filtro local (solo si NO hay onSearchChange)
  const filteredData = useMemo(() => {
    if (onSearchChange) return data;
    if (!searchable || !query.trim()) return data;
    const q = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return data.filter((item) => {
      const label = getLabel(item, labelKey)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return label.includes(q);
    });
  }, [data, query, labelKey, searchable, onSearchChange]);

  const selectedLabel = value ? getLabel(value, labelKey) : null;

  const handleSelect = useCallback(
    (item: T) => {
      onSelect(item);
      setQuery("");
      setVisible(false);
      Keyboard.dismiss();
    },
    [onSelect],
  );

  const handleClose = useCallback(() => {
    setVisible(false);
    setQuery("");
    Keyboard.dismiss();
  }, []);

  const renderDefaultItem = useCallback(
    ({ item }: { item: T }) => {
      const isSelected = value ? isSameItem(item, value, valueKey) : false;
      const label = getLabel(item, labelKey);

      if (renderItem) {
        return (
          <Pressable onPress={() => handleSelect(item)}>
            {renderItem(item, isSelected)}
          </Pressable>
        );
      }

      return (
        <Pressable
          style={({ pressed }) => [
            styles.item,
            { backgroundColor: isSelected ? selectedColor : "transparent" },
            pressed && { backgroundColor: itemPressedColor },
          ]}
          onPress={() => handleSelect(item)}
        >
          <Text
            style={[
              styles.itemText,
              { color: isSelected ? selectedTextColor : textColor },
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
          {isSelected && (
            <MaterialCommunityIcons
              name="check"
              size={20}
              color={selectedTextColor}
            />
          )}
        </Pressable>
      );
    },
    [
      value,
      valueKey,
      labelKey,
      renderItem,
      handleSelect,
      textColor,
      selectedColor,
      selectedTextColor,
      itemPressedColor,
    ],
  );

  const keyExtractor = useCallback(
    (item: T, index: number) => {
      if (valueKey) return String(getValue(item, valueKey));
      return `${index}-${getLabel(item, labelKey)}`;
    },
    [valueKey, labelKey],
  );

  return (
    <>
      {label && (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
      <Pressable
        onPress={() => !disabled && !isSaving && setVisible(true)}
        style={({ pressed }) => [
          styles.trigger,
          { backgroundColor, borderColor },
          pressed && !isSaving && !disabled && styles.triggerPressed,
          disabled && isSaving && styles.triggerDisabled,
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
          name={visible ? "chevron-up" : (icon as any)}
          size={20}
          color={placeholderColor}
        />
      </Pressable>

      <Modal
        isVisible={visible}
        onBackdropPress={handleClose}
        onBackButtonPress={handleClose}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={250}
        animationOutTiming={200}
        backdropOpacity={0.6}
        style={styles.modal}
        avoidKeyboard
      >
        <View style={[styles.modalContent, { backgroundColor }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: textColor }]}>
              {modalTitle}
            </Text>
            <Pressable onPress={handleClose} style={styles.closeBtn}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={textColor}
              />
            </Pressable>
          </View>

          {/* Search */}
          {searchable && (
            <View
              style={[
                styles.searchContainer,
                { backgroundColor: searchBackground, borderColor },
              ]}
            >
              <MaterialCommunityIcons
                name={searchIcon as any}
                size={20}
                color={searchPlaceholderColor}
                style={styles.searchIcon}
              />
              <TextInput
                style={[styles.searchInput, { color: searchTextColor }]}
                placeholder={searchPlaceholder}
                placeholderTextColor={searchPlaceholderColor}
                value={query}
                onChangeText={setQuery}
                autoFocus
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchLoading ? (
                <ActivityIndicator size="small" color={selectedTextColor} />
              ) : query.length > 0 ? (
                <Pressable onPress={() => setQuery("")} hitSlop={8}>
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={18}
                    color={searchPlaceholderColor}
                  />
                </Pressable>
              ) : null}
            </View>
          )}

          {/* List */}
          <FlatList
            data={filteredData}
            keyExtractor={keyExtractor}
            renderItem={renderDefaultItem}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={
              filteredData.length === 0
                ? styles.emptyContainer
                : styles.listContent
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="text-search"
                  size={40}
                  color={searchPlaceholderColor}
                />
                <Text
                  style={[styles.emptyText, { color: searchPlaceholderColor }]}
                >
                  {searchLoading ? "Buscando..." : emptyText}
                </Text>
              </View>
            }
          />

          {/* Done button */}
          <Pressable
            style={[styles.doneButton, { backgroundColor: confirmButtonColor }]}
            onPress={handleClose}
          >
            <Text
              style={[styles.doneButtonText, { color: confirmButtonTextColor }]}
            >
              Listo
            </Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
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
  triggerText: { flex: 1, fontSize: 16, fontWeight: "500" },
  modal: { justifyContent: "flex-end", margin: 0 },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: "700" },
  closeBtn: { padding: 4 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 2 },
  listContent: { paddingHorizontal: 16, paddingBottom: 8 },
  emptyContainer: { flexGrow: 1, justifyContent: "center" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  itemText: { flex: 1, fontSize: 16 },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: { fontSize: 15, marginTop: 12 },
  doneButton: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  doneButtonText: { fontSize: 16, fontWeight: "600" },
});
/*import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
  Keyboard,
  Platform,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type KeyOrFn<T> = keyof T | ((item: T) => string);

interface SearchableDropdownProps<T> {
  data: T[];
  labelKey: KeyOrFn<T>;
  valueKey?: keyof T;
  value?: T | null;
  onSelect: (item: T) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  icon?: string;
  disabled?: boolean;
  emptyText?: string;
  renderItem?: (item: T, isSelected: boolean) => React.ReactNode;
  isSaving?: boolean;
  onSearchChange?: (text: string) => void; // si existe, dispara búsqueda remota
  searchLoading?: boolean; // spinner mientras busca en servidor
}

function getLabel<T>(item: T, labelKey: KeyOrFn<T>): string {
  if (typeof labelKey === "function") return labelKey(item);
  return String(item[labelKey] ?? "");
}

function getValue<T>(item: T, valueKey?: keyof T): string {
  if (!valueKey) return JSON.stringify(item);
  return String(item[valueKey] ?? "");
}

function isSameItem<T>(a: T, b: T, valueKey?: keyof T): boolean {
  if (!valueKey) return JSON.stringify(a) === JSON.stringify(b);
  return (a as any)[valueKey] === (b as any)[valueKey];
}

export function SearchableDropdown<T>({
  data,
  labelKey,
  valueKey,
  value,
  onSelect,
  placeholder = "Seleccionar...",
  searchPlaceholder = "Buscar...",
  icon = "magnify",
  disabled = false,
  emptyText = "No se encontraron resultados",
  renderItem,
  isSaving,
  onSearchChange,
  searchLoading,
}: SearchableDropdownProps<T>) {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");

  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedQuery(query),
      onSearchChange ? 400 : 0,
    );
    return () => clearTimeout(timer);
  }, [query, onSearchChange]);

  // Disparar búsqueda remota cuando cambia el debouncedQuery
  useEffect(() => {
    if (onSearchChange && visible) {
      onSearchChange(debouncedQuery);
    }
  }, [debouncedQuery, onSearchChange, visible]);

  const filteredData = useMemo(() => {
    if (onSearchChange) return data; // modo remoto: el padre filtra
    if (!query.trim()) return data;

    const q = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return data.filter((item) => {
      const label = getLabel(item, labelKey)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return label.includes(q);
    });
  }, [data, query, labelKey, onSearchChange]);

  const selectedLabel = value ? getLabel(value, labelKey) : null;

  const handleSelect = useCallback(
    (item: T) => {
      onSelect(item);
      setQuery("");
      setDebouncedQuery("");
      setVisible(false);
      Keyboard.dismiss();
    },
    [onSelect],
  );

  const handleClose = useCallback(() => {
    setVisible(false);
    setQuery("");
    setDebouncedQuery("");
    Keyboard.dismiss();
  }, []);

  const renderDefaultItem = useCallback(
    ({ item }: { item: T }) => {
      const isSelected = value ? isSameItem(item, value, valueKey) : false;
      const label = getLabel(item, labelKey);

      if (renderItem) {
        return (
          <Pressable onPress={() => handleSelect(item)}>
            {renderItem(item, isSelected)}
          </Pressable>
        );
      }

      return (
        <Pressable
          style={({ pressed }) => [
            styles.item,
            isSelected && styles.itemSelected,
            pressed && styles.itemPressed,
          ]}
          onPress={() => handleSelect(item)}
        >
          <Text
            style={[styles.itemText, isSelected && styles.itemTextSelected]}
            numberOfLines={1}
          >
            {label}
          </Text>
          {isSelected && (
            <MaterialCommunityIcons name="check" size={20} color="#0A84FF" />
          )}
        </Pressable>
      );
    },
    [value, valueKey, labelKey, renderItem, handleSelect],
  );

  const keyExtractor = useCallback(
    (item: T, index: number) => {
      if (valueKey) return String(getValue(item, valueKey));
      return `${index}-${getLabel(item, labelKey)}`;
    },
    [valueKey, labelKey],
  );

  return (
    <>

      <Pressable
        onPress={() => !disabled && !isSaving && setVisible(true)}
        style={({ pressed }) => [
          styles.trigger,
          (disabled || isSaving) && styles.triggerDisabled,
          pressed && !disabled && !isSaving && styles.triggerPressed,
        ]}
      >
        <MaterialCommunityIcons
          name={icon as any}
          size={20}
          color="#888"
          style={styles.triggerIcon}
        />
        <Text
          style={[
            styles.triggerText,
            !selectedLabel && styles.triggerPlaceholder,
          ]}
          numberOfLines={1}
        >
          {selectedLabel || placeholder}
        </Text>
        <MaterialCommunityIcons
          name={visible ? "chevron-up" : "chevron-down"}
          size={20}
          color="#888"
        />
      </Pressable>


      <Modal
        isVisible={visible}
        onBackdropPress={handleClose}
        onBackButtonPress={handleClose}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={250}
        animationOutTiming={200}
        backdropOpacity={0.6}
        style={styles.modal}
        avoidKeyboard
      >
        <View style={styles.modalContent}>

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Seleccionar</Text>
            <Pressable onPress={handleClose} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={24} color="#fff" />
            </Pressable>
          </View>


          <View style={styles.searchContainer}>
            <MaterialCommunityIcons
              name="magnify"
              size={20}
              color="#888"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              placeholderTextColor="#666"
              value={query}
              onChangeText={setQuery}
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchLoading ? (
              <ActivityIndicator size="small" color="#0A84FF" />
            ) : query.length > 0 ? (
              <Pressable onPress={() => setQuery("")} hitSlop={8}>
                <MaterialCommunityIcons
                  name="close-circle"
                  size={18}
                  color="#888"
                />
              </Pressable>
            ) : null}
          </View>


          <FlatList
            data={filteredData}
            keyExtractor={keyExtractor}
            renderItem={renderDefaultItem}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={
              filteredData.length === 0
                ? styles.emptyContainer
                : styles.listContent
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="text-search"
                  size={40}
                  color="#555"
                />
                <Text style={styles.emptyText}>
                  {searchLoading ? "Buscando..." : emptyText}
                </Text>
              </View>
            }
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  triggerPressed: {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  triggerDisabled: {
    opacity: 0.5,
  },
  triggerIcon: {
    marginRight: 10,
  },
  triggerText: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  triggerPlaceholder: {
    color: "#666",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#2C2C2E",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  closeBtn: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  itemSelected: {
    backgroundColor: "rgba(10, 132, 255, 0.15)",
  },
  itemPressed: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  itemText: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  itemTextSelected: {
    color: "#0A84FF",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#888",
    fontSize: 15,
    marginTop: 12,
  },
  });*/
