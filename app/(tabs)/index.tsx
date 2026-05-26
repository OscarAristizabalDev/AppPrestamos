import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { SearchableDropdown } from "@/src/components/ui/SearchableDropdown";
import { useMemo, useState } from "react";
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
import {
  ProductFormData,
  ProductSchema,
} from "@/src/features/products/schemas/product.schema";
import { useSearchProducts } from "@/src/features/products/hooks/useSearchProducts";

type DocType = { id: string; label: string };

function DocTypesLoader() {
  useDocTypes();
  return null;
}

export default function IndexScreen() {
  const { handleLogout } = useLogout();
  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors, isValid },
  // } = useForm<Client>({
  //   resolver: zodResolver(ClientSchema),
  //   mode: "onChange",
  // });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
    mode: "onChange",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const { data: clientsData, isLoading: isLoadingClients } =
    useSearchClients(searchQuery);
  const { data: productsData, isLoading: isLoadingProducts } =
    useSearchProducts(searchQuery);

  const [selectedDocType, setSelectedDocType] = useState<DocType | null>(null);

  const clients = clientsData?.data ?? [];
  const products = productsData?.data ?? [];

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
            // <SearchableDropdown
            //   data={clients}
            //   labelKey="fullName"
            //   valueKey="id"
            //   value={clients.find((c) => c.id === value) || null}
            //   label="Cliente"
            //   onSelect={(client) => onChange(client.id)}
            //   placeholder="Buscar cliente..."
            //   searchPlaceholder="Buscar..."
            //   icon="account"
            //   isSaving={isLoading}
            //   searchable={true}
            //   onSearchChange={setSearchQuery}
            //   searchLoading={isLoading}
            // />
            <SearchableDropdown
              data={products}
              labelKey="name"
              valueKey="id"
              value={
                products.find((c: ProductFormData) => c.id === value) || null
              }
              label="Productos"
              onSelect={(product) => onChange(product.id)}
              placeholder="Buscar producto..."
              searchPlaceholder="Buscar..."
              icon="package-variant"
              isSaving={isLoadingProducts}
              searchable={true}
              onSearchChange={setSearchQuery}
              searchLoading={isLoadingProducts}
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
