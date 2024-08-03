import { create } from "zustand";

type NewContactState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewContact = create<NewContactState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
