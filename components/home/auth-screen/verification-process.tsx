"use client"
import {
  Check,
  FileText,
  BadgeIcon as IdCard,
  Building,
  Lock,
  Loader2,
  ChevronLeft,
  Home,
  Upload,
  X,
  Clock,
} from "lucide-react"
import { CldUploadWidget } from "next-cloudinary"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import type { VerificationFile, VerificationProcessProps } from "@/types"

// Types basés sur votre fichier de types
type StaffRole = "Doctor" | "Nurse" | "Surgeon" | "Anesthesiologist" | "Radiologist" | "Intern" | "Administrator"
type VerificationStatus = "pending" | "verified" | "rejected"

export function VerificationProcess({
  role,
  staffType,
  verifications,
  verificationStatuses,
  uploadedFiles,
  otpValues,
  onVerificationToggle,
  onFileUpload,
  onOtpChange,
  onSubmit,
  onBack,
  onGoHome,
  isSaving,
  progress,
}: VerificationProcessProps) {
  const isVerificationComplete = () => {
    if (role === "patient") return true
    if (role === "personalMedical") return verifications.diplome && verifications.identite && verifications.structure
    if (role === "admin") {
      return (
        verifications.diplome && verifications.identite && verifications.structure && otpValues.every((v) => v !== "")
      )
    }
    return false
  }

  const getRoleLabel = () => {
    if (role === "patient") return "Patient"
    if (role === "personalMedical" && staffType) {
      const labels: Record<StaffRole, string> = {
        Doctor: "Médecin",
        Nurse: "Infirmier(ère)",
        Surgeon: "Chirurgien(ne)",
        Anesthesiologist: "Anesthésiste",
        Radiologist: "Radiologue",
        Intern: "Interne",
        Administrator: "Administrateur médical",
      }
      return labels[staffType as StaffRole]
    }
    if (role === "admin") return "Administrateur"
    return "Personnel médical"
  }

  const getVerificationStatus = (type: keyof typeof verifications) => {
    const hasFile = !!uploadedFiles[type]
    const statusItem = verificationStatuses[type]
    const isVerified = verifications[type] // Utiliser directement la valeur booléenne

    // Pas de fichier uploadé
    if (!hasFile) {
      return {
        status: "no-file",
        color: {
          bg: "bg-white border-gray-200",
          icon: "bg-gray-100",
          text: "text-gray-800",
          badge: "bg-gray-500",
        },
        label: "Aucun fichier",
        icon: Clock,
      }
    }

    // Si vérifié (utiliser verifications.diplome/identite/structure)
    if (hasFile && isVerified) {
      return {
        status: "verified",
        color: {
          bg: "bg-green-50 border-green-200",
          icon: "bg-green-500",
          text: "text-green-700",
          badge: "bg-green-500",
        },
        label: "Vérifié",
        icon: Check,
      }
    }

    // Si rejeté explicitement via verificationStatuses
    if (hasFile && !isVerified && statusItem?.status === "rejected") {
      return {
        status: "rejected",
        color: {
          bg: "bg-red-50 border-red-200",
          icon: "bg-red-500",
          text: "text-red-700",
          badge: "bg-red-500",
        },
        label: "Rejeté",
        icon: X,
      }
    }

    // Si le fichier est uploadé mais pas encore vérifié (verifications.xxx = false)
    if (hasFile && !isVerified) {
      return {
        status: "pending",
        color: {
          bg: "bg-orange-50 border-orange-200",
          icon: "bg-orange-500",
          text: "text-orange-700",
          badge: "bg-orange-500",
        },
        label: "En attente de vérification",
        icon: Clock,
      }
    }

    // Par défaut, en attente
    return {
      status: "pending",
      color: {
        bg: "bg-orange-50 border-orange-200",
        icon: "bg-orange-500",
        text: "text-orange-700",
        badge: "bg-orange-500",
      },
      label: "En attente de vérification",
      icon: Clock,
    }
  }

  const validateFileType = (resourceType: string, format: string): boolean => {
    const allowedFormats = ["pdf", "jpg", "jpeg", "png", "gif", "webp"]
    return (
      (resourceType === "image" && allowedFormats.includes(format.toLowerCase())) ||
      (resourceType === "raw" && format.toLowerCase() === "pdf")
    )
  }

  const validateFileSize = (bytes: number): boolean => {
    const maxSize = 10 * 1024 * 1024 // 10MB
    return bytes <= maxSize
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleUploadSuccess = (type: keyof typeof verifications, result: any) => {
    // Validation du type de fichier
    if (!validateFileType(result.info.resource_type, result.info.format)) {
      toast.error("Format de fichier non supporté. Veuillez utiliser PDF, JPEG, PNG, GIF ou WebP.")
      return
    }

    // Validation de la taille
    if (!validateFileSize(result.info.bytes)) {
      toast.error("Le fichier est trop volumineux. Taille maximale : 10MB.")
      return
    }

    const fileData: VerificationFile = {
      fileName: result.info.original_filename || result.info.public_id,
      fileUrl: result.info.secure_url,
      publicId: result.info.public_id,
      uploadedAt: new Date(),
      fileSize: result.info.bytes,
      fileType: result.info.format,
    }

    onFileUpload(type, fileData)
  }

  const handleUploadError = (error: any) => {
    console.error("Upload error:", error)
    toast.error("Erreur lors du téléchargement du fichier")
  }

  const handleRemoveFile = (type: keyof typeof verifications) => {
    // Annuler la vérification (décocher)
    onVerificationToggle(type)
  }

  const verificationItems = [
    {
      key: "diplome" as const,
      icon: FileText,
      label: "Diplôme médical",
    },
    {
      key: "identite" as const,
      icon: IdCard,
      label: "Carte d'identité",
    },
    {
      key: "structure" as const,
      icon: Building,
      label: "Structure médicale",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto pt-4 sm:pt-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 relative">
          <Button
            variant="ghost"
            onClick={onBack}
            className="absolute top-0 left-0 text-teal-600 hover:text-teal-700 hover:bg-teal-100 p-2 sm:p-3"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Retour</span>
          </Button>

          <Button
            variant="ghost"
            onClick={onGoHome}
            className="absolute top-0 right-0 text-teal-600 hover:text-teal-700 hover:bg-teal-100 p-2 sm:p-3"
            size="sm"
          >
            <Home className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Accueil</span>
          </Button>

          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
            <Check className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 px-4">
            Vérification - {getRoleLabel()}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-4">Complétez les étapes de vérification</p>

          {/* Progress bar */}
          <div className="mt-4 sm:mt-6 max-w-xs sm:max-w-md mx-auto px-4">
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-2">
              <div
                className="bg-gradient-to-r from-teal-400 to-green-500 h-2 sm:h-3 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-gray-600">
              <span>Progression</span>
              <span className="font-semibold">{progress}%</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
          {role === "patient" && (
            <div className="text-center py-8 sm:py-12">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-bounce shadow-lg">
                <Check className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-emerald-700 mb-3 sm:mb-4 px-4">
                Vérification complète !
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 px-4">
                Aucune vérification supplémentaire requise pour les patients
              </p>
              <Button
                onClick={onSubmit}
                disabled={isSaving}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 w-full sm:w-auto max-w-xs mx-auto"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
                    <span className="text-sm sm:text-base">Finalisation...</span>
                  </>
                ) : (
                  <span className="text-sm sm:text-base">Accéder à mon espace</span>
                )}
              </Button>
            </div>
          )}

          {(role === "personalMedical" || role === "admin") && (
            <>
              {/* Document Verification */}
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 px-2 sm:px-0">
                  Documents à vérifier
                </h2>

                {verificationItems.map((item) => {
                  const Icon = item.icon
                  const status = getVerificationStatus(item.key)
                  const StatusIcon = status.icon
                  const uploadedFile = uploadedFiles[item.key]
                  const statusItem = verificationStatuses[item.key]

                  return (
                    <div key={item.key}>
                      <div
                        className={`
                        p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 border-2 shadow-lg
                        ${status.color.bg}
                      `}
                      >
                        {/* Header avec icône et titre */}
                        <div className="flex items-center space-x-3 sm:space-x-4 mb-3">
                          <div
                            className={`
                            w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg flex-shrink-0
                            ${status.color.icon}
                          `}
                          >
                            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={`text-base sm:text-lg font-medium ${status.color.text} block`}>
                              {item.label}
                            </span>
                          </div>
                        </div>

                        {/* Badge de statut - ligne séparée */}
                        <div className="mb-3 sm:mb-4">
                          <Badge
                            className={`transition-all duration-300 text-white ${status.color.badge} text-xs sm:text-sm inline-flex items-center`}
                          >
                            <StatusIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span>{status.label}</span>
                          </Badge>
                        </div>

                        {/* Informations du fichier */}
                        {uploadedFile && (
                          <div className="mb-3 sm:mb-4 p-3 bg-white/50 rounded-lg border border-white/20">
                            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                              <p className="font-medium truncate">📄 {uploadedFile.fileName}</p>
                              <p>📅 Uploadé le: {new Date(uploadedFile.uploadedAt).toLocaleDateString()}</p>
                              <p>📏 Taille: {formatFileSize(uploadedFile.fileSize)}</p>
                              <p>🔗 Type: {uploadedFile.fileType}</p>
                              {statusItem?.verifiedAt && (
                                <p>✅ Vérifié le: {new Date(statusItem.verifiedAt).toLocaleDateString()}</p>
                              )}
                              {uploadedFile.fileUrl && (
                                <a
                                  href={uploadedFile.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline"
                                >
                                  👁️ Voir le fichier
                                </a>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Actions - boutons */}
                        <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-3 mb-3">
                          <CldUploadWidget
                            signatureEndpoint="/api/sign-image"
                            onSuccess={(result) => handleUploadSuccess(item.key, result)}
                            onError={handleUploadError}
                          >
                            {({ open }) => (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => open()}
                                className="flex items-center justify-center gap-2 w-full sm:w-auto text-xs sm:text-sm py-2"
                                disabled={statusItem?.status === "verified"}
                              >
                                <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span>{uploadedFile ? "Changer le fichier" : "Télécharger un fichier"}</span>
                              </Button>
                            )}
                          </CldUploadWidget>

                          {uploadedFile && statusItem?.status !== "verified" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveFile(item.key)}
                              className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 flex items-center justify-center gap-2 w-full sm:w-auto text-xs sm:text-sm py-2"
                            >
                              <X className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span>Annuler</span>
                            </Button>
                          )}
                        </div>

                        {/* Informations sur les formats */}
                        <div className="text-xs text-gray-500 mb-2">
                          📋 Formats acceptés: PDF, JPEG, PNG, GIF, WebP (max 10MB)
                        </div>

                        {/* Message de rejet */}
                        {statusItem?.status === "rejected" && (
                          <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded-lg">
                            <p className="text-xs sm:text-sm text-red-700 flex items-center gap-2">
                              <X className="h-4 w-4 flex-shrink-0" />
                              Ce document a été rejeté. Veuillez télécharger un nouveau fichier.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Admin OTP */}
              {role === "admin" && (
                <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                      <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                    </div>
                    <Label className="text-base sm:text-lg font-medium text-gray-800">Code secret administrateur</Label>
                  </div>

                  <div className="flex justify-center space-x-2 sm:space-x-3 overflow-x-auto pb-2">
                    {otpValues.map((value, index) => (
                      <Input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={value}
                        onChange={(e) => onOtpChange(index, e.target.value.replace(/[^0-9]/g, ""))}
                        className={`w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold rounded-lg sm:rounded-xl transition-all duration-200 flex-shrink-0 ${
                          value
                            ? "border-purple-400 bg-purple-50 text-purple-700 shadow-md"
                            : "border-gray-300 hover:border-purple-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="text-center pt-4 sm:pt-6 px-2 sm:px-0">
                <Button
                  onClick={onSubmit}
                  disabled={!isVerificationComplete() || isSaving}
                  className={`
                  px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold shadow-lg transform transition-all duration-200 w-full sm:w-auto max-w-sm mx-auto
                  ${
                    isVerificationComplete()
                      ? "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
                      <span className="text-sm sm:text-base">Finalisation...</span>
                    </>
                  ) : (
                    <span className="text-sm sm:text-base">Confirmer la vérification</span>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Progress indicator */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="flex justify-center space-x-2 mb-2 sm:mb-4">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-teal-500 rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-teal-500 rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-teal-500 rounded-full"></div>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">Étape 3 sur 3</p>
        </div>
      </div>
    </div>
  )
}
