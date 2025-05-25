import { create } from 'zustand'

interface PatientModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const usePatientModalStore = create<PatientModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}))