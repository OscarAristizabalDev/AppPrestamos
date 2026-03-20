import { Pressable, View, StyleSheet, Text } from "react-native";
import { Client } from "../schemas/client.schema";

const ClientCard = ({ client, onClientPress }: ClientCardProps) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => onClientPress?.(client)}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{client.fullName}</Text>
        <Text style={styles.documentNumber}>{client.documentNumber}</Text>
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
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: "100%",
    backgroundColor: "#1E1E1E",
    padding: 16,
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
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  id: {
    fontSize: 14,
    color: "#aaa",
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
