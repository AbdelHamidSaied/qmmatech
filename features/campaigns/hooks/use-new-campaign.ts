import { create } from "zustand";

type NewCampaignState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewCampaign = create<NewCampaignState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
