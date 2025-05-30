import { create } from "zustand"

type DialogType = "login" | "signup"

interface AuthState {
  isOpen: boolean
  dialogType: DialogType
  setIsOpen: (isOpen: boolean) => void
  setDialogType: (type: DialogType) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isOpen: false,
  dialogType: "login",
  setIsOpen: (isOpen) => set({ isOpen }),
  setDialogType: (dialogType) => set({ dialogType }),
}))
