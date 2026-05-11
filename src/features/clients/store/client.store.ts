import { create } from "zustand";
import { Client } from "../schemas/client.schema";

interface ClientStore {
  showDetails: boolean;
  showCreateModal: boolean;
  showEditModal: boolean;
  showConfirmDelete: boolean;
  selectedClient: Client | null;
  setShowDetails: (showDetails: boolean) => void;
  setShowCreateModal: (showCreateModal: boolean) => void;
  setShowEditModal: (showEditModal: boolean) => void;
  setShowConfirmDelete: (showConfirmDelete: boolean) => void;
  setSelectedClient: (selectedClient: Client) => void;
}

export const useClientStore = create<ClientStore>((set) => ({
  showDetails: false,
  showCreateModal: false,
  showEditModal: false,
  showConfirmDelete: false,
  selectedClient: null,
  setShowDetails: (showDetails: boolean) => set({ showDetails }),
  setShowCreateModal: (showCreateModal: boolean) => set({ showCreateModal }),
  setShowEditModal: (showEditModal: boolean) => set({ showEditModal }),
  setShowConfirmDelete: (showConfirmDelete: boolean) =>
    set({ showConfirmDelete }),
  setSelectedClient: (selectedClient: Client) => set({ selectedClient }),
}));
