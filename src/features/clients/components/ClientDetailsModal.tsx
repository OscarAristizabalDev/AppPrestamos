import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import { Client } from "../schemas/client.schema";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  client: Client | null;
  visible: boolean;
  onClose: () => void;
}

const DetailRow = ({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null;
  icon: string;
}) => {
  if (!value) return null;

  return (
    <View style={styles.row}>
      <MaterialCommunityIcons name={icon as any} size={20} color="#888" />
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
};

export const ClientDetailModal = ({ client, visible, onClose }: Props) => {
  if (!visible || !client) return null;

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      animationIn="zoomIn"
      animationOut="zoomOut"
      animationInTiming={300}
      animationOutTiming={200}
      backdropOpacity={0.7}
    >
      <View style={styles.container}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={styles.title}>Detalles del Cliente</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color="#fff" />
          </Pressable>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <DetailRow
            label="Nombre completo"
            value={client.fullName}
            icon="account"
          />
          <DetailRow
            label="Documento"
            value={client.documentNumber}
            icon="card-account-details"
          />
          <DetailRow
            label="Correo electrónico"
            value={client.email}
            icon="email"
          />
          <DetailRow label="Teléfono" value={client.phoneNumber} icon="phone" />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2C2C2E",
    borderRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#555",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#fff" },
  closeButton: { padding: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  rowContent: { flex: 1 },
  rowLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  rowValue: { fontSize: 16, color: "#fff", fontWeight: "500" },
});
