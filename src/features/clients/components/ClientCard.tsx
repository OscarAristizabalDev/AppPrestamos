import {
  Pressable,
  View,
  StyleSheet,
  Text,
  useWindowDimensions,
} from "react-native";
import { Client } from "../schemas/client.schema";
import { useState } from "react";
import Popover, { PopoverPlacement } from "react-native-popover-view";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

export interface MenuOption {
  label: string;
  icon: string;
  iconFamily?: "MaterialCommunityIcons" | "MaterialIcons";
  onPress: (client: Client) => void;
  color?: string;
}

const ClientCard = ({
  client,
  onClientPress,
  menuOptions,
}: ClientCardProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleOptionPress = (action: (client: Client) => void) => {
    setShowMenu(false);
    setTimeout(() => action(client), 300);
  };
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const renderMenuContent = () => (
    <View style={styles.menuContainer}>
      {menuOptions.map((option: MenuOption, index: number) => {
        const IconComponent =
          option.iconFamily === "MaterialCommunityIcons"
            ? MaterialCommunityIcons
            : MaterialIcons;
        return (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.menuItemPressed,
              index < menuOptions.length - 1 && styles.menuItemBorder,
            ]}
            onPress={() => handleOptionPress(option.onPress)}
          >
            <IconComponent
              key={index}
              name={option.icon as any}
              size={20}
              color={option.color || "#fff"}
            />
            <Text
              style={[styles.menuText, option.color && { color: option.color }]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => onClientPress?.(client)}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.name}>{client.fullName}</Text>
          <Text style={styles.documentNumber}>{client.documentNumber}</Text>
        </View>
        <Popover
          isVisible={showMenu}
          onRequestClose={() => setShowMenu(false)}
          onCloseComplete={() => setShowMenu(false)}
          from={
            <Pressable
              onPress={() => setShowMenu(true)}
              style={({ pressed }) => [
                styles.menuButton,
                pressed && styles.menuButtonPressed,
              ]}
              hitSlop={8}
            >
              <MaterialIcons name="more-vert" size={24} color="#fff" />
            </Pressable>
          }
          placement={PopoverPlacement.AUTO}
          offset={4}
          // RESTRICCIÓN CLAVE: definimos el área de pantalla con márgenes de seguridad.
          // Esto fuerza al popover a recalcular su posición X si se sale del borde.
          displayArea={{
            x: 0,
            y: 0,
            width: screenWidth,
            height: screenHeight,
          }}
          displayAreaInsets={{ left: 16, right: 16, top: 16, bottom: 16 }}
          popoverStyle={styles.popover}
          backgroundStyle={styles.popoverBackground}
          animationConfig={{ duration: 200 }}
        >
          {renderMenuContent()}
        </Popover>
      </View>
      <Text style={styles.email}>{client.email}</Text>
      {client.phoneNumber && (
        <Text style={styles.phoneNumber}>📞{client.phoneNumber}</Text>
      )}
    </Pressable>
  );
};

interface ClientCardProps {
  client: Client;
  onClientPress?: (client: Client) => void;
  menuOptions: MenuOption[];
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: "100%",
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  headerContent: {
    flex: 1,
    marginRight: 8,
  },
  id: {
    fontSize: 14,
    color: "#aaa",
  },
  menuButton: {
    padding: 4,
    borderRadius: 20,
    marginTop: -4,
    marginRight: -4,
  },
  menuButtonPressed: {
    opacity: 0.6,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  popover: {
    borderRadius: 12,
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  popoverBackground: {
    backgroundColor: "transparent",
  },
  menuContainer: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    minWidth: 180,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemPressed: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  menuText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  email: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 4,
  },
  documentNumber: {
    fontSize: 12,
    color: "#888",
    marginTop: 6,
  },
});

export default ClientCard;
