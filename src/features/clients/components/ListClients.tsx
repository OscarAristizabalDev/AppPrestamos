import {
  View,
  StyleSheet,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import useInfiniteClients from "../hooks/useClient";
import ClientCard, { MenuOption } from "./ClientCard";
import Loader from "@src/components/Loader";
import { Client, UpdateClient } from "../schemas/client.schema";
import { useEffect, useMemo, useState } from "react";
import { ClientDetailModal } from "./ClientDetailsModal";
import { AppDialog } from "@src/components/ui/Dialog";
import EditModal from "./ClientEditModal";
import useDeleteClient from "../hooks/useDeleteClient";
import useUpdateClient from "../hooks/useUpdateClient";
import useCreateClient from "../hooks/useCreateClient";
import CreateModal from "./ClientCreateModal";
import { useClientStore } from "../store/client.store";
import { InputField } from "@/src/components/ui/InputField";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  DeleteDialogState,
  getDeleteDialogConfig,
} from "../helpers/deleteDialog.config";

const ListClients = () => {
  const [searchText, setSearchText] = useState("");
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    isPending,
    isError, // <-- agregá esto
    error, // <-- y est
    refetch,
  } = useInfiniteClients(searchText);
  const { mutate: deleteClient, isPending: isDeleting } = useDeleteClient();
  const { mutate: updateClient, isPending: isUpdating } = useUpdateClient();
  const { mutate: createClient, isPending: isCreating } = useCreateClient();

  const [deleteState, setDeleteState] = useState<DeleteDialogState>("confirm");

  //const clients = data?.pages.flatMap((page) => page.data) ?? [];
  const clients = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const {
    showDetails,
    showCreateModal,
    showEditModal,
    showConfirmDelete,
    selectedClient,
    setShowDetails,
    setShowCreateModal,
    setShowEditModal,
    setShowConfirmDelete,
    setSelectedClient,
  } = useClientStore();

  // Configuración dinámica según estado
  const currentConfig = getDeleteDialogConfig(
    deleteState,
    selectedClient?.fullName ?? "El cliente",
  );

  const handleDeleteClient = (id: string) => {
    setDeleteState("deleting");
    deleteClient(id, {
      onSuccess: () => {
        setDeleteState("success");
      },
      onError: () => {
        // Si falla, volvemos a confirm para que reintente o cierre
        setDeleteState("confirm");
        console.error("Error al eliminar el cliente");
      },
    });
  };

  const handleCloseDeleteDialog = () => {
    setShowConfirmDelete(false);
    setDeleteState("confirm");
  };

  const handleCloseModalDetails = () => {
    setShowDetails(false);
  };

  const handleCloseModalEdit = () => {
    setShowEditModal(false);
  };

  /*const handleCloseModalDelete = () => {
    setShowConfirmDelete(false);
    };*/

  const handleOpenConfirmDelete = (c: Client) => {
    setSelectedClient(c);
    setShowConfirmDelete(true);
  };

  const handleOpenModalDetails = (c: Client) => {
    setSelectedClient(c);
    setShowDetails(true);
  };

  const handleOpenModalEdit = (c: Client) => {
    setSelectedClient(c);
    setShowEditModal(true);
  };

  const handleOpenModalCreate = () => {
    setShowCreateModal(true);
  };

  const handleCloseModalCreate = () => {
    setShowCreateModal(false);
  };

  const handleCreate = (data: Client) => {
    console.info("Entrando");
    createClient(data, {
      onSuccess: () => {
        setShowCreateModal(false);
      },
      onError: () => {
        console.error("Error al crear el cliente");
      },
    });
  };

  const handleUpdate = (data: UpdateClient) => {
    updateClient(
      { data },
      {
        onSuccess: () => {
          setShowEditModal(false);
        },
        onError: () => {
          console.error("Error al actualizar el cliente");
        },
      },
    );
  };

  const menuOptions: MenuOption[] = [
    {
      label: "Detalles",
      icon: "search",
      iconFamily: "MaterialIcons",
      color: "#FFF",
      onPress: (c: Client) => {
        handleOpenModalDetails(c);
      },
    },
    {
      label: "Editar",
      icon: "edit",
      iconFamily: "MaterialIcons",
      color: "#FFF",
      onPress: (c: Client) => {
        handleOpenModalEdit(c);
      },
    },
    {
      label: "Eliminar",
      icon: "delete",
      iconFamily: "MaterialCommunityIcons",
      color: "#FF3B30",
      onPress: (c: Client) => {
        handleOpenConfirmDelete(c);
      },
    },
  ];

  useEffect(() => {
    console.log("[ListClients] isPending:", isPending, "isError:", isError);
    console.log("[ListClients] error:", error?.message || error);
    console.log("[ListClients] clients count:", clients.length);
  }, [isPending, data, clients, isError, error]);
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <InputField
          containerStyle={{ flex: 1, marginBottom: 0 }}
          onChangeText={(text) => {
            setSearchText(text);
          }}
          placeholder="Buscar..."
          value={searchText}
        />
        <Pressable
          onPress={handleOpenModalCreate}
          style={[styles.createButton]}
        >
          <MaterialCommunityIcons name="account-plus" size={24} color="#fff" />
        </Pressable>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <FlatList
          data={clients}
          renderItem={({ item }) => (
            <ClientCard
              client={item}
              onClientPress={(client) => {
                console.log("Cliente seleccionado:", client.fullName);
              }}
              menuOptions={menuOptions}
            />
          )}
          keyExtractor={(item) => item.id!}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Listado Clientes</Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              {isPending ? <Loader /> : <Text>No se encontraron clientes</Text>}
            </View>
          }
          ListFooterComponent={isFetchingNextPage ? <Loader /> : null}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          decelerationRate={"fast"}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
        />
      </KeyboardAvoidingView>
      {selectedClient && (
        <ClientDetailModal
          client={selectedClient}
          visible={showDetails}
          onClose={handleCloseModalDetails}
        />
      )}
      {selectedClient && (
        <EditModal
          client={selectedClient}
          isVisible={showEditModal}
          onClose={handleCloseModalEdit}
          onSave={handleUpdate}
          isSaving={isUpdating}
        />
      )}
      <CreateModal
        isVisible={showCreateModal}
        onClose={handleCloseModalCreate}
        onSave={handleCreate}
        isSaving={isCreating}
      />
      {selectedClient && (
        <AppDialog
          visible={showConfirmDelete}
          title={currentConfig.title}
          message={currentConfig.message}
          icon={currentConfig.icon}
          iconColor={currentConfig.iconColor}
          isDoingAction={isDeleting}
          mode={currentConfig.mode}
          confirmText={currentConfig.confirmText}
          cancelText={currentConfig.cancelText}
          confirmButtonColor={currentConfig.confirmButtonColor}
          onConfirm={() => {
            if (deleteState === "confirm") {
              handleDeleteClient(selectedClient?.id!);
            } else if (deleteState === "success") {
              handleCloseDeleteDialog();
            }
          }}
          onCancel={() => {
            if (deleteState === "confirm") {
              setShowConfirmDelete(false);
            }
          }}
          onClose={handleCloseDeleteDialog}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1, // This is crucial for FlatList to scroll
    paddingTop: 15,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 15,
    marginLeft: 10,
    marginTop: 25,
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
    marginBottom: 10, // espacio entre header y lista
    paddingHorizontal: 5, // alineado con el padding del container
    zIndex: 10,
  },
  header: {
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E1E1E",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  createButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
  },
  // title: {
  //     fontSize: 18,
  //     fontWeight: 'bold',
  //     marginBottom: 12,
  // },
  contentContainer: {
    padding: 5,
  },
  quoteItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  quoteText: {
    fontSize: 14,
    color: "#333",
  },
});

export default ListClients;
