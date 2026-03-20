import {
  Client,
  PaginatedClient,
  PaginatedClientSchema,
} from "../schemas/client.schema";
import { api } from "@/src/lib/api";

export const getClientsPaginated = async ({
  pageParam = 1,
}: {
  pageParam?: number;
}) => {
  console.info("trying fetching all clients");
  const { data } = await api.get<PaginatedClient>(
    `clients/all?page=${pageParam}&limit=10`,
  );
  try {
    const parsed = PaginatedClientSchema.parse(data);
    return parsed;
  } catch (error) {
    console.error("ZOD Error fetching clients: ", error);
    throw error;
  }
};

export const createClient = async (client: Client) => {
  const { data } = await api.post("/clients", client);
  return data;
};

export const updateClient = async (client: Client) => {
  const { data } = await api.put(`/clients/${client.id}`, client);
  return data;
};

export const deleteClient = async (id: string) => {
  const { data } = await api.delete(`/clients/${id}`);
  return data;
};
