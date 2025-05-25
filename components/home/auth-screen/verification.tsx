"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { create } from "zustand"
import { doc, getDoc, runTransaction } from "firebase/firestore"
import { firestore } from "@/firebase/config"
import type { OTPDocument } from "@/types"

import { RoleSelection } from "./role-selection"
import { StaffSelection } from "./staff-selection"
import { VerificationProcess } from "./verification-process"

// Types
type StaffRole = "Doctor" | "Nurse" | "Surgeon" | "Anesthesiologist" | "Radiologist" | "Intern" | "Administrator"

interface ExtendedOTPDocument extends OTPDocument {
  staffType?: StaffRole
}

interface VerificationState {
  // État
  isLoading: boolean
  isSaving: boolean
  role: string | null
  staffType: StaffRole | null
  step: number
  verifications: {
    diplome: boolean
    identite: boolean
    structure: boolean
  }
  otpValues: string[]
  progress: number

  // Actions
  setLoading: (loading: boolean) => void
  setSaving: (saving: boolean) => void
  setRole: (role: string | null) => void
  setStaffType: (staffType: StaffRole | null) => void
  setStep: (step: number) => void
  setVerifications: (verifications: { diplome: boolean; identite: boolean; structure: boolean }) => void
  setOtpValues: (otpValues: string[]) => void
  setProgress: (progress: number) => void

  // Actions complexes
  calculateProgress: () => number
  checkVerificationStatus: (id: string) => Promise<boolean>
  saveProgress: (id: string, updates: Partial<ExtendedOTPDocument>) => Promise<void>
  handleRoleSelect: (id: string, value: "patient" | "personalMedical" | "admin") => Promise<void>
  handleStaffSelect: (id: string, staff: StaffRole) => Promise<void>
  handleVerificationToggle: (id: string, type: keyof typeof initialVerifications) => Promise<void>
  handleOtpChange: (id: string, index: number, value: string) => Promise<void>
  handleSubmit: (id: string) => Promise<void>
  resetState: () => void
}

const initialVerifications = {
  diplome: false,
  identite: false,
  structure: false,
}

const initialOtpValues = ["", "", "", "", "", ""]

// Store Zustand
const useVerificationStore = create<VerificationState>((set, get) => ({
  // État initial
  isLoading: true,
  isSaving: false,
  role: null,
  staffType: null,
  step: 1,
  verifications: initialVerifications,
  otpValues: initialOtpValues,
  progress: 0,

  // Actions simples
  setLoading: (loading) => set({ isLoading: loading }),
  setSaving: (saving) => set({ isSaving: saving }),
  setRole: (role) => set({ role }),
  setStaffType: (staffType) => set({ staffType }),
  setStep: (step) => set({ step }),
  setVerifications: (verifications) => set({ verifications }),
  setOtpValues: (otpValues) => set({ otpValues }),
  setProgress: (progress) => set({ progress }),

  // Calcul du progrès
  calculateProgress: () => {
    const { role, step, staffType, verifications, otpValues } = get()

    if (!role) return 0

    if (role === "patient") {
      return step === 1 ? 33 : step === 2 ? 66 : 100
    }

    if (role === "personalMedical") {
      let total = 0
      if (step >= 2) total += 20 // Role selected
      if (step >= 3 && staffType) total += 20 // Staff type selected

      // Each verification is worth 20% (60% total for all 3)
      const verificationCount = Object.values(verifications).filter(Boolean).length
      total += verificationCount * 20

      return Math.min(total, 100)
    }

    if (role === "admin") {
      let total = 0
      if (step >= 2) total += 15 // Role selected

      // Each verification is worth 20% (60% total for all 3)
      const verificationCount = Object.values(verifications).filter(Boolean).length
      total += verificationCount * 20

      // OTP is worth 25%, calculated based on filled fields
      const otpCount = otpValues.filter((v) => v !== "").length
      total += Math.floor((otpCount / 6) * 25)

      return Math.min(total, 100)
    }

    return 0
  },

  // Vérification du statut
  checkVerificationStatus: async (id: string) => {
    try {
      const verificationRef = doc(firestore, "verification", id)
      const verificationSnap = await getDoc(verificationRef)

      if (verificationSnap.exists()) {
        const data = verificationSnap.data() as ExtendedOTPDocument

        // If verification is completed, return true to redirect
        if (data.isCompleted) {
          return true
        }

        // Restore previous progress
        const { calculateProgress } = get()
        set({
          role: data.role,
          staffType: data.staffType || null,
          step: data.step,
          verifications: data.verifications,
          otpValues: data.otpValues,
        })

        // Calculate and set progress
        const progress = data.progress || calculateProgress()
        set({ progress })
      }

      return false
    } catch (error) {
      console.error("Error checking verification status:", error)
      return false
    } finally {
      set({ isLoading: false })
    }
  },

  // Sauvegarde du progrès
  saveProgress: async (id: string, updates: Partial<ExtendedOTPDocument>) => {
    set({ isSaving: true })
    try {
      const { role, staffType, step, verifications, otpValues, calculateProgress } = get()
      const verificationRef = doc(firestore, "verification", id)

      await runTransaction(firestore, async (transaction) => {
        const verificationDoc = await transaction.get(verificationRef)

        // Prepare data to save
        const existingData = verificationDoc.exists()
          ? (verificationDoc.data() as ExtendedOTPDocument)
          : {
              role,
              staffType,
              step,
              verifications,
              otpValues,
              isCompleted: false,
              progress: 0,
              completedAt: null as any,
            }

        const newData = {
          ...existingData,
          ...updates,
        }

        // Calculate and update progress
        if (
          !newData.progress ||
          updates.role ||
          updates.step ||
          updates.staffType ||
          updates.verifications ||
          updates.otpValues
        ) {
          newData.progress = calculateProgress()
        }

        // Save to Firestore
        transaction.set(verificationRef, newData)

        // Update local state
        set({ progress: newData.progress })
      })
    } catch (error) {
      console.error("Error saving progress:", error)
    } finally {
      set({ isSaving: false })
    }
  },

  // Sélection du rôle
  handleRoleSelect: async (id: string, value: "patient" | "personalMedical" | "admin") => {
    const { saveProgress } = get()
    set({ role: value })

    if (value === "personalMedical") {
      set({ step: 2 })
      await saveProgress(id, { role: value, step: 2 })
    } else {
      set({ step: 3 })
      await saveProgress(id, { role: value, step: 3 })
    }
  },

  // Sélection du personnel
  handleStaffSelect: async (id: string, staff: StaffRole) => {
    const { saveProgress } = get()
    set({ staffType: staff, step: 3 })
    await saveProgress(id, { staffType: staff, step: 3 })
  },

  // Toggle de vérification
  handleVerificationToggle: async (id: string, type: keyof typeof initialVerifications) => {
    const { verifications, saveProgress } = get()
    const newVerifications = {
      ...verifications,
      [type]: !verifications[type],
    }
    set({ verifications: newVerifications })
    await saveProgress(id, { verifications: newVerifications })
  },

  // Changement OTP
  handleOtpChange: async (id: string, index: number, value: string) => {
    const { otpValues, saveProgress } = get()
    const newOtpValues = [...otpValues]
    newOtpValues[index] = value
    set({ otpValues: newOtpValues })

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }

    await saveProgress(id, { otpValues: newOtpValues })
  },

  // Soumission finale
  handleSubmit: async (id: string) => {
    set({ isSaving: true })
    try {
      const { role, staffType, step, verifications, otpValues, calculateProgress } = get()

      // Mark verification as completed using transaction
      await runTransaction(firestore, async (transaction) => {
        const verificationRef = doc(firestore, "verification", id)
        const verificationDoc = await transaction.get(verificationRef)

        const existingData = verificationDoc.exists()
          ? (verificationDoc.data() as ExtendedOTPDocument)
          : {
              role,
              staffType,
              step,
              verifications,
              otpValues,
              progress: calculateProgress(),
              completedAt: null as any,
              isCompleted: false,
            }

        transaction.set(verificationRef, {
          ...existingData,
          isCompleted: true,
          completedAt: new Date(),
          progress: 100,
        })
      })

      // Update local progress
      set({ progress: 100 })
    } catch (error) {
      console.error("Error completing verification:", error)
      set({ isSaving: false })
    }
  },

  // Reset de l'état
  resetState: () =>
    set({
      isLoading: true,
      isSaving: false,
      role: null,
      staffType: null,
      step: 1,
      verifications: initialVerifications,
      otpValues: initialOtpValues,
      progress: 0,
    }),
}))

// Composant principal
export function Verification({ id }: { id: string }) {
  const router = useRouter()

  // État depuis Zustand
  const {
    isLoading,
    isSaving,
    role,
    staffType,
    step,
    verifications,
    otpValues,
    progress,
    checkVerificationStatus,
    handleRoleSelect,
    handleStaffSelect,
    handleVerificationToggle,
    handleOtpChange,
    handleSubmit,
    resetState,
    setStep,
  } = useVerificationStore()

  // Vérification du statut au montage du composant
  useEffect(() => {
    const initVerification = async () => {
      const isCompleted = await checkVerificationStatus(id)
      if (isCompleted) {
        router.push("/")
      }
    }

    initVerification()
  }, [id, router, checkVerificationStatus])

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      resetState()
    }
  }, [resetState])

  // Gestion des actions
  const handleRoleSelectWrapper = async (value: "patient" | "personalMedical" | "admin") => {
    await handleRoleSelect(id, value)
  }

  const handleStaffSelectWrapper = async (staff: StaffRole) => {
    await handleStaffSelect(id, staff)
  }

  const handleVerificationToggleWrapper = async (type: keyof typeof verifications) => {
    await handleVerificationToggle(id, type)
  }

  const handleOtpChangeWrapper = async (index: number, value: string) => {
    await handleOtpChange(id, index, value)
  }

  const handleSubmitWrapper = async () => {
    await handleSubmit(id)
    // Redirect to home page after a brief delay to show 100% progress
    setTimeout(() => {
      router.push("/")
    }, 1000)
  }

  const handleGoHome = () => {
    // Empêcher le retour à la page d'accueil pendant la vérification
    return
  }

  const handleBack = () => {
    if (step === 3 && role === "personalMedical") {
      setStep(2)
    } else if (step === 2 || step === 3) {
      setStep(1)
    }
  }

  // Empêcher la navigation arrière pendant la vérification
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault()
      if (!confirm("Êtes-vous sûr de vouloir quitter le processus de vérification ?")) {
        window.history.pushState(null, "", window.location.href)
      } else {
        router.push("/")
      }
    }

    window.history.pushState(null, "", window.location.href)
    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [router])

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
          <p className="text-gray-600 text-lg animate-pulse">Vérification du statut...</p>
        </div>
      </div>
    )
  }

  // Render appropriate step
  if (step === 1) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <RoleSelection onRoleSelect={handleRoleSelectWrapper} onGoHome={handleGoHome} selectedRole={role} />
        </div>
      </div>
    )
  }

  if (step === 2 && role === "personalMedical") {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <StaffSelection onStaffSelect={handleStaffSelectWrapper} onBack={handleBack} selectedStaff={staffType} />
        </div>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl mx-auto">
          <VerificationProcess
            role={role as "patient" | "personalMedical" | "admin"}
            staffType={staffType || undefined}
            verifications={verifications}
            otpValues={otpValues}
            onVerificationToggle={handleVerificationToggleWrapper}
            onOtpChange={handleOtpChangeWrapper}
            onSubmit={handleSubmitWrapper}
            onBack={handleBack}
            onGoHome={handleGoHome}
            isSaving={isSaving}
            progress={progress}
          />
        </div>
      </div>
    )
  }

  return null
}
