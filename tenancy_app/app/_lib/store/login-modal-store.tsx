import { create } from "zustand";

interface LoginModalState {
  isOpen: boolean;
  setOpen: () => void;
  setClose: () => void;
}

export const LoginModalStore = create<LoginModalState>((set) => ({
  isOpen: false,
  setOpen: () => set((state: any) => ({ isOpen: true })),
  setClose: () => set((state: any) => ({ isOpen: false })),
}));
