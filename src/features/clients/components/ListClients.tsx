import { View, StyleSheet, Text, FlatList } from "react-native";
import useInfiniteClients from "../hooks/useClient";
import ClientCard from "./ClientCard";
import Loader from "@/src/components/Loader";

const ListClients = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteClients();
  const clients = data?.pages.flatMap((page) => page.data) ?? [];
  return (
    <View style={styles.container}>
      <FlatList
        data={clients}
        renderItem={({ item }) => (
          <ClientCard
            client={item}
            onClientPress={(client) => {
              console.log("Cliente seleccionado:", client.fullName);
            }}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Clientes</Text>
          </View>
        }
        ListEmptyComponent={<Text>No Hay Clientes</Text>}
        ListFooterComponent={isFetchingNextPage ? <Loader /> : null}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        decelerationRate={"fast"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // This is crucial for FlatList to scroll
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 20,
  },
  header: {
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E1E1E",
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
