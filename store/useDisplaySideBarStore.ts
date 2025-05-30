import { create } from "zustand"

type DisplaySidebarStore = {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

export const useDisplaySidebarStore = create<DisplaySidebarStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))