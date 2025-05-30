import { create } from "zustand";

interface DoctorModalState{
    isOpen: boolean
    setIsOpen: (isOpen : boolean) => void
}

export const useModalDoctorStore = create<DoctorModalState>((set) =>({
    isOpen : false,
    setIsOpen : (isOpen) => set({ isOpen })
}))