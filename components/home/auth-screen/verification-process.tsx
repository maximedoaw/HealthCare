"use client"
import { Check, FileText, BadgeIcon as IdCard, Building, Lock, Loader2, ChevronLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

// Types basés sur votre fichier de types
type StaffRole = "Doctor" | "Nurse" | "Surgeon" | "Anesthesiologist" | "Radiologist" | "Intern" | "Administrator"

interface VerificationProcessProps {
  role: "patient" | "personalMedical" | "admin"
  staffType?: StaffRole
  verifications: {
    diplome: boolean
    identite: boolean
    structure: boolean
  }
  otpValues: string[]
  onVerificationToggle: (type: keyof VerificationProcessProps["verifications"]) => void
  onOtpChange: (index: number, value: string) => void
  onSubmit: () => void
  onBack: () => void
  onGoHome: () => void
  isSaving: boolean
  progress: number
}

export function VerificationProcess({
  role,
  staffType,
  verifications,
  otpValues,
  onVerificationToggle,
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
      return labels[staffType]
    }
    if (role === "admin") return "Administrateur"
    return "Personnel médical"
  }

  const verificationItems = [
    {
      key: "diplome" as const,
      icon: FileText,
      label: "Diplôme médical",
      color: "emerald",
    },
    {
      key: "identite" as const,
      icon: IdCard,
      label: "Carte d'identité",
      color: "blue",
    },
    {
      key: "structure" as const,
      icon: Building,
      label: "Structure médicale",
      color: "purple",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="absolute top-4 left-4 text-teal-600 hover:text-teal-700 hover:bg-teal-100"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Retour
          </Button>

          <Button
            variant="ghost"
            onClick={onGoHome}
            className="absolute top-4 right-4 text-teal-600 hover:text-teal-700 hover:bg-teal-100"
          >
            <Home className="h-5 w-5 mr-2" />
            Accueil
          </Button>

          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Check className="h-10 w-10 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">Vérification - {getRoleLabel()}</h1>
          <p className="text-gray-600 text-lg">Complétez les étapes de vérification</p>

          {/* Progress bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-teal-400 to-green-500 h-3 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progression</span>
              <span className="font-semibold">{progress}%</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {role === "patient" && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-lg">
                <Check className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-emerald-700 mb-4">Vérification complète !</h2>
              <p className="text-gray-600 text-lg mb-8">Aucune vérification supplémentaire requise pour les patients</p>
              <Button
                onClick={onSubmit}
                disabled={isSaving}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg transform transition-all duration-200 hover:scale-105"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Finalisation...
                  </>
                ) : (
                  "Accéder à mon espace"
                )}
              </Button>
            </div>
          )}

          {(role === "personalMedical" || role === "admin") && (
            <>
              {/* Document Verification */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Documents à vérifier</h2>

                {verificationItems.map((item) => {
                  const Icon = item.icon
                  const isVerified = verifications[item.key]

                  return (
                    <div
                      key={item.key}
                      className={`
                        p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-102
                        ${
                          isVerified
                            ? "bg-green-50 border-2 border-green-200 shadow-lg"
                            : "bg-white border border-gray-200 hover:shadow-md"
                        }
                      `}
                      onClick={() => onVerificationToggle(item.key)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`
                            w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                            ${isVerified ? "bg-green-500 shadow-lg" : "bg-gray-100"}
                          `}
                          >
                            <Icon className={`h-6 w-6 ${isVerified ? "text-white" : "text-gray-600"}`} />
                          </div>
                          <span className={`text-lg font-medium ${isVerified ? "text-green-700" : "text-gray-800"}`}>
                            {item.label}
                          </span>
                        </div>

                        <Badge
                          variant={isVerified ? "default" : "outline"}
                          className={`transition-all duration-300 ${
                            isVerified ? "bg-green-500 hover:bg-green-600 text-white" : "text-gray-600"
                          }`}
                        >
                          {isVerified ? <Check className="h-4 w-4" /> : "À vérifier"}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Admin OTP */}
              {role === "admin" && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Lock className="h-6 w-6 text-purple-600" />
                    </div>
                    <Label className="text-lg font-medium text-gray-800">Code secret administrateur</Label>
                  </div>

                  <div className="flex justify-center space-x-3">
                    {otpValues.map((value, index) => (
                      <Input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={value}
                        onChange={(e) => onOtpChange(index, e.target.value.replace(/[^0-9]/g, ""))}
                        className={`w-12 h-12 text-center text-xl font-bold rounded-xl transition-all duration-200 ${
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
              <div className="text-center pt-6">
                <Button
                  onClick={onSubmit}
                  disabled={!isVerificationComplete() || isSaving}
                  className={`
                    px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transform transition-all duration-200
                    ${
                      isVerificationComplete()
                        ? "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white hover:scale-105"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }
                  `}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Finalisation...
                    </>
                  ) : (
                    "Confirmer la vérification"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Progress indicator */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
            <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
            <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
          </div>
          <p className="text-sm text-gray-500">Étape 3 sur 3</p>
        </div>
      </div>
    </div>
  )
}
