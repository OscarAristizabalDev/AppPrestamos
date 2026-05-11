import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { SearchableDropdown } from "@/src/components/ui/SearchableDropdown";
import { useState } from "react";
import { useSearchClients } from "@/src/features/clients/hooks/useSearchClient";
import { Controller, useForm } from "react-hook-form";
import {
  Client,
  ClientSchema,
} from "@/src/features/clients/schemas/client.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SimpleDropdown } from "@/src/components/ui/Dropdown";
import { useLogout } from "@/src/hooks/useLogout";
import { useDocTypes } from "@/src/features/clients/hooks/useDocTypes";

type DocType = { id: string; label: string };

function DocTypesLoader() {
  useDocTypes();
  return null;
}

export default function IndexScreen() {
  const { handleLogout } = useLogout();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Client>({
    resolver: zodResolver(ClientSchema),
    mode: "onChange",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useSearchClients(searchQuery);
  const [selectedDocType, setSelectedDocType] = useState<DocType | null>(null);

  const clients = data?.data ?? [];
  console.log(
    "[Index Tab]Clientes recibidos para SearchableDropdown...",
    clients,
  );

  return (
    <View style={styles.container}>
      <DocTypesLoader />
      <Text>Index</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="id"
          render={({ field: { onChange, onBlur, value } }) => (
            <SearchableDropdown
              data={clients}
              labelKey="fullName"
              valueKey="id"
              value={clients.find((c) => c.id === value) || null}
              label="Cliente"
              onSelect={(client) => onChange(client.id)}
              placeholder="Buscar cliente..."
              searchPlaceholder="Buscar..."
              icon="account"
              isSaving={isLoading}
              searchable={true}
              onSearchChange={setSearchQuery}
              searchLoading={isLoading}
            />
          )}
        />
        {errors.id && <Text style={styles.error}>{errors.id.message}</Text>}
        <SimpleDropdown
          data={[
            { id: "cc", label: "Cédula de ciudadanía" },
            { id: "ce", label: "Cédula de extranjería" },
            { id: "pasaporte", label: "Pasaporte" },
          ]}
          labelKey="label"
          valueKey="id"
          value={selectedDocType}
          onSelect={setSelectedDocType}
          label="Tipo de documento"
          placeholder="Seleccione"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5,
    gap: 5,
    justifyContent: "center",
    backgroundColor: "#B8B6C2",
  },
  error: { color: "#FF453A", fontSize: 12, marginTop: 6 },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 25, // Increased vertical padding for height
    marginVertical: 10,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
