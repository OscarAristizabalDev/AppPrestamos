import {
  Client,
  PaginatedClient,
  PaginatedClientSchema,
  UpdateClient,
} from "../schemas/client.schema";
import { api } from "@src/lib/api";
import { DocumentType } from "../interfaces/typedocument";

export const getClientsPaginated = async ({
  pageParam = 1,
  inputSearch,
}: {
  pageParam?: number;
  inputSearch?: string;
}) => {
  const params = new URLSearchParams();
  params.append("page", String(pageParam));
  params.append("limit", "10");
  if (inputSearch) {
    params.append("search", inputSearch);
  }
  const { data } = await api.get<PaginatedClient>(
    `clients/all?${params.toString()}`,
  );
  try {
    const parsed = PaginatedClientSchema.parse(data);
    return parsed;
  } catch (error) {
    console.error("[Zod Parsing] Getting Clients Error: ", error);
    throw error;
  }
};

export const getDocumentTypes = async () => {
  const { data } = await api.get<DocumentType[]>("clients/doctypes");
  console.info("[Response DocTypes] Document types: ", data);
  return data;
};

export const createClient = async (client: Client) => {
  console.info("Creating client: ", {
    ...client,
    typeDocument: client.typeDocument?.id,
    active: 1,
  });
  try {
    delete client.id;
    const { data } = await api.post("/clients", {
      ...client,
      typeDocument: client.typeDocument?.id,
      active: 1,
    });
    return data;
  } catch (error) {
    console.error("Error creating client: ", error);
    throw error;
  }
};

export const updateClient = async ({ data }: { data: UpdateClient }) => {
  console.info("Actualizando cliente: ", {
    ...data,
    typeDocument: data.typeDocument?.id,
    fullName: data.names + " " + data.surnames,
  });
  try {
    const { data: response } = await api.put(`/clients`, {
      ...data,
      typeDocument: data.typeDocument?.id,
      fullName: data.names + " " + data.surnames,
    });
    console.info("[Response Update] Cliente actualizado: ", response);
    return response;
  } catch (error) {
    console.error("Error updating client: ", error);
    throw error;
  }
};

export const deleteClient = async (id: string) => {
  const { data } = await api.delete(`/clients/${id}`);
  return data;
};
