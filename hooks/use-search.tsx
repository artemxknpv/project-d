import { create } from "zustand";

type SearchStore = {
  open?: boolean;
  onOpen: () => void;
  onClose: () => void;
  toggle: () => void;
};

export const useSearch = create<SearchStore>((set, get) => ({
  open: false,
  onClose: () => set({ open: false }),
  toggle: () => set({ open: !get().open }),
  onOpen: () => set({ open: true }),
}));
