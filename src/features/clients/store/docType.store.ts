import { create } from "zustand";
import { DocumentType } from "../interfaces/typedocument";

interface DocTypeState {
  items: DocumentType[];
  isLoaded: boolean;
  setItems: (items: DocumentType[]) => void;
}

export const useDocTypeStore = create<DocTypeState>((set) => ({
  items: [],
  isLoaded: false,
  setItems: (items) => set({ items, isLoaded: true }),
}));
