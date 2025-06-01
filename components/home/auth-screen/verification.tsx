"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"


import { RoleSelection } from "./role-selection"
import { StaffSelection } from "./staff-selection"
import { VerificationProcess } from "./verification-process"
import { MedicalLoader } from "@/components/medical-loader"
import type { StaffRole, VerificationFile } from "@/types"
import { useVerificationStore } from "@/store/useVerificationStore"



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
    verificationStatuses,
    uploadedFiles,
    otpValues,
    progress,
    checkVerificationStatus,
    startRealtimeListener, // Ajouter cette ligne
    handleRoleSelect,
    handleStaffSelect,
    handleVerificationToggle,
    handleFileUpload,
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
        return
      }

      // Démarrer le listener temps réel après la vérification initiale
      startRealtimeListener(id)
    }

    initVerification()
  }, [id, router, checkVerificationStatus, startRealtimeListener])

  // Gestion de la redirection quand la vérification est complétée via le temps réel
  useEffect(() => {
    const handleVerificationCompleted = () => {
      router.push("/")
    }

    window.addEventListener("verification-completed", handleVerificationCompleted)

    return () => {
      window.removeEventListener("verification-completed", handleVerificationCompleted)
    }
  }, [router])

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

  const handleFileUploadWrapper = async (type: keyof typeof verifications, fileData: VerificationFile) => {
    await handleFileUpload(id, type, fileData)
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
    router.push("/")
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
          <MedicalLoader />
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
            verificationStatuses={verificationStatuses}
            uploadedFiles={uploadedFiles}
            otpValues={otpValues}
            onVerificationToggle={handleVerificationToggleWrapper}
            onFileUpload={handleFileUploadWrapper}
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
