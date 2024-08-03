import { create } from "zustand";

type NewTemplateState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewTemplate = create<NewTemplateState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
